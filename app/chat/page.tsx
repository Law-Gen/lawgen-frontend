"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";

import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { ChatHistory } from "@/components/chat/chat-history";
import { MainNavigation } from "@/components/ui/main-navigation";
import { useTheme } from "next-themes";
import { CustomAudioPlayer } from "@/components/chat/custom-audio-player";

// --- Helper function to convert browser audio to WAV format ---
/**
 * Encodes an AudioBuffer into a WAV format Blob.
 * This is crucial for ensuring compatibility with the Azure Speech SDK backend.
 * @param {AudioBuffer} buffer The audio buffer to encode.
 * @returns {Blob} A blob containing the audio in WAV format.
 */
const bufferToWav = (buffer: AudioBuffer): Blob => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const newBuffer = new ArrayBuffer(length);
  const view = new DataView(newBuffer);
  const channels: Float32Array[] = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // write interleaved data
  for (i = 0; i < numOfChan; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++; // next source sample
  }

  return new Blob([view], { type: "audio/wav" });

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
};

// --- Main Chat Component ---

interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: "user" | "ai";
  timestamp: Date;
  liked?: boolean;
}

export default function ChatPage() {
  const base_url =
    process.env.NEXT_PUBLIC_QUIZ_BASE_URL || "http://localhost:8000";
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI legal assistant. I can help you with general legal information and guidance. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "am">("en");
  const [quickPrompts] = useState<string[]>([
    "What are my employee rights?",
    "How do I draft a rental agreement?",
    "Steps to file a small claim",
  ]);

  // Voice-specific state
  const [isRecording, setIsRecording] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);

  // Refs for managing media and scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    try {
      const stored = localStorage.getItem("guestSessionId");
      if (stored) setSessionId(stored);
    } catch {}

    const onLoad = (e: any) => {
      setSessionId(e?.detail?.id || null);
    };
    const onNew = () => {
      setSessionId(null);
      setMessages([
        {
          id: "1",
          content:
            "Hello! I'm your AI legal assistant. I can help you with general legal information and guidance. How can I assist you today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    };
    window.addEventListener("chat:load-session", onLoad as any);
    window.addEventListener("chat:new", onNew as any);
    return () => {
      window.removeEventListener("chat:load-session", onLoad as any);
      window.removeEventListener("chat:new", onNew as any);
    };
  }, []);

  // --- Core Logic for Text Chat (SSE) ---

  const handleLanguageToggle = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "am" : "en"));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
      id: aiMessageId,
      content: "",
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    const requestBody: any = {
      query: userMessage.content,
      language: language,
      ...(sessionId ? { sessionId } : {}),
    };

    try {
      const response = await fetch(`${base_url}/chats/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let eventIdx;
        while ((eventIdx = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, eventIdx);
          buffer = buffer.slice(eventIdx + 2);

          let eventType: string | null = null;
          let eventData = "";
          for (const line of rawEvent.split("\n")) {
            if (line.startsWith("event: "))
              eventType = line.substring(7).trim();
            else if (line.startsWith("data: ")) eventData += line.substring(6);
          }

          if (eventType === "message") {
            const parsedData = JSON.parse(eventData);
            if (parsedData.sessionId && !sessionId) {
              setSessionId(parsedData.sessionId);
              try {
                localStorage.setItem("guestSessionId", parsedData.sessionId);
              } catch {}
            }
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      content:
                        (msg.content as string) + (parsedData.text || ""),
                    }
                  : msg
              )
            );
          } else if (eventType === "error") {
            const parsedData = JSON.parse(eventData);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: `Error: ${parsedData.message}` }
                  : msg
              )
            );
          }
        }
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: "Sorry, I encountered an error. Please try again.",
              }
            : msg
        )
      );
    } finally {
      try {
        const title =
          typeof userMessage.content === "string"
            ? userMessage.content.slice(0, 60)
            : "Chat Session";
        const lastMessage =
          typeof userMessage.content === "string" ? userMessage.content : "";
        const id =
          sessionId ||
          localStorage.getItem("guestSessionId") ||
          `temp-${Date.now()}`;
        if (!sessionId) {
          localStorage.setItem("guestSessionId", id);
        }
        const existingRaw = localStorage.getItem("chatSessions");
        const existing = existingRaw ? (JSON.parse(existingRaw) as any[]) : [];
        const idx = existing.findIndex((s) => s.id === id);
        const item = { id, title, lastMessage, timestamp: Date.now() };
        if (idx >= 0) existing[idx] = item;
        else existing.unshift(item);
        localStorage.setItem("chatSessions", JSON.stringify(existing));
      } catch {}
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyLast = async () => {
    const lastAi = [...messages]
      .reverse()
      .find((m) => m.sender === "ai" && typeof m.content === "string");
    if (lastAi && typeof lastAi.content === "string") {
      try {
        await navigator.clipboard.writeText(lastAi.content);
      } catch {}
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm your AI legal assistant. I can help you with general legal information and guidance. How can I assist you today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    setSessionId(null);
    try {
      localStorage.removeItem("guestSessionId");
    } catch {}
  };

  // --- Core Logic for Voice Chat (Recording & WAV Conversion) ---

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    setPermissionError(null);
    setVoiceStatus("Requesting microphone permission...");
    try {
      if (audioContext.current?.state === "suspended")
        await audioContext.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setVoiceStatus("Recording... Click the icon again to stop.");
      audioChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) =>
        audioChunks.current.push(event.data);

      mediaRecorder.current.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const decodedAudioBuffer = await audioContext.current?.decodeAudioData(
          arrayBuffer
        );

        if (decodedAudioBuffer) {
          const wavBlob = bufferToWav(decodedAudioBuffer);
          const audioFile = new File([wavBlob], "voice-query.wav", {
            type: "audio/wav",
          });
          sendVoiceQuery(audioFile);
        } else {
          setVoiceStatus("Error: Could not process recorded audio.");
        }
      };

      mediaRecorder.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setPermissionError(
        "Microphone access was denied. Please enable it in your browser settings."
      );
      setVoiceStatus(null);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setVoiceStatus("Processing audio and sending...");
    }
  };

  const sendVoiceQuery = async (audioFile: File) => {
    setIsLoading(true); // Use the main loader
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("language", language); // Hardcoded for now

    try {
      const resp = await fetch(`${base_url}/chats/voice-query`, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(` error ${resp.status}: ${errText}`);
      }

      const audioBlob = await resp.blob();
      if (audioBlob.type.startsWith("audio/")) {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioMessage: Message = {
          id: Date.now().toString(),
          content: <CustomAudioPlayer audioUrl={audioUrl} />,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, audioMessage]);
        setVoiceStatus(null);
      } else {
        throw new Error("Response was not a valid audio file.");
      }
    } catch (err) {
      const error = err as Error;
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `Voice query failed: ${error.message}`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setVoiceStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render JSX ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex flex-col overflow-x-hidden">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="w-full flex items-center px-2 gap-4">
          <div className="flex-shrink-0">
            <img
              src="/logo (1).svg"
              alt="LawGen Logo"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover border border-muted shadow"
            />
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-primary truncate">
              Legal Assistant Chat
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              AI-powered legal guidance and conversation
            </p>
          </div>
          <div className="hidden md:flex flex-1 justify-center">
            <MainNavigation />
          </div>
          <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
            <LanguageToggle />
          </div>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <aside className="hidden md:block w-72 border-r border-border/60 bg-card/40">
          <ChatHistory />
        </aside>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <MotionWrapper key={message.id}>
                <div
                  className={`flex gap-4 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-primary to-accent shadow-lg">
                      <AvatarFallback className="text-primary-foreground font-semibold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <Card
                    className={`max-w-[85%] group shadow-lg hover:shadow-xl transition-shadow ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        : "bg-card/80 backdrop-blur-sm border-border/50"
                    }`}
                  >
                    <CardContent className="">
                      <div className="text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div
                        className={`flex items-center gap-3 mt-3 ${
                          message.sender === "user"
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          onClick={() =>
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === message.id
                                  ? { ...m, liked: !m.liked }
                                  : m
                              )
                            )
                          }
                          className="text-xs opacity-80 hover:opacity-100"
                        >
                          {message.liked ? "👍" : "👍"}
                        </button>
                        {typeof message.content === "string" && (
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                message.content as string
                              )
                            }
                            className="text-xs opacity-80 hover:opacity-100"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {message.sender === "user" && (
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-accent to-secondary shadow-lg">
                      <AvatarFallback className="text-accent-foreground font-semibold">
                        U
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </MotionWrapper>
            ))}

            {isLoading && messages[messages.length - 1]?.sender !== "user" && (
              <MotionWrapper>
                <div className="flex gap-4 justify-start">
                  <Avatar className="w-10 h-10 bg-gradient-to-r from-primary to-accent shadow-lg">
                    <AvatarFallback className="text-primary-foreground font-semibold">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-3 h-3 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </MotionWrapper>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border bg-card/90 backdrop-blur-md p-4 md:p-6">
            <div className="container mx-auto px-0 md:px-2">
              {(voiceStatus || permissionError) && (
                <Alert className="mb-4">
                  <AlertDescription>
                    {voiceStatus || permissionError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                {quickPrompts.map((p) => (
                  <Button
                    key={p}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 md:gap-4 items-end">
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Ask a legal question..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[48px] text-base border-border/50 bg-background/50 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="hover:scale-105 transition-transform px-4 md:px-6 py-3 shadow-lg"
                >
                  Send
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleRecording}
                  className={`hover:scale-105 transition-transform bg-transparent border-border/50 p-3 ${
                    isRecording ? "text-red-500 border-red-500" : ""
                  }`}
                  title={isRecording ? "Stop Recording" : "Start Voice Input"}
                  disabled={isLoading}
                >
                  🎤
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLanguageToggle}
                  className="hover:scale-105 transition-transform w-20"
                  disabled={isLoading}
                >
                  {language.toUpperCase()}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyLast}
                  disabled={isLoading}
                >
                  Copy Last
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
