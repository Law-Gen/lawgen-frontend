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
import { useChat } from "@/contexts/chat-context";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useChatService } from "@/lib/chat-service";

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

interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: "user" | "ai";
  timestamp: Date;
  liked?: boolean;
}

export default function ChatPage() {
  const { state, sendMessage, createNewSession, loadMessages } = useChat();
  const { isAuthenticated, user } = useAuthSession();
  const chatService = useChatService();

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  }, [state.messages]);

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (state.currentSessionId) {
      loadMessages(state.currentSessionId);
    }
  }, [state.currentSessionId, loadMessages]);

  const handleLanguageToggle = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "am" : "en"));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    try {
      await sendMessage(inputMessage, language);
      setInputMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      // Error is handled by the context
    } finally {
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
    const lastAi = [...state.messages]
      .reverse()
      .find((m) => m.sender === "ai" && typeof m.content === "string");
    if (lastAi && typeof lastAi.content === "string") {
      try {
        await navigator.clipboard.writeText(lastAi.content);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const handleClear = async () => {
    try {
      await createNewSession();
    } catch (error) {
      console.error("Failed to create new session:", error);
    }
  };

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
    setIsLoading(true);
    try {
      if (!chatService) {
        throw new Error("Chat service not available");
      }

      const response = await chatService.sendVoiceMessage(audioFile, language);

      if (response.audioUrl) {
        // Add voice response message
        const audioMessage: Message = {
          id: Date.now().toString(),
          content: <CustomAudioPlayer audioUrl={response.audioUrl} />,
          sender: "ai",
          timestamp: new Date(),
        };

        // Add to chat context (this would need to be implemented in the context)
        // For now, we'll handle it locally until voice messages are integrated
        console.log("Voice response received:", response);
      }

      setVoiceStatus(null);
    } catch (error) {
      console.error("Voice query failed:", error);
      setVoiceStatus(
        `Voice query failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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
            {/* Display error if exists */}
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {/* Display messages from context */}
            {state.messages.map((message) => (
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
                    <CardContent className="p-4">
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
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          onClick={() => {
                            // Handle like functionality - this would need to be implemented in context
                            console.log("Like message:", message.id);
                          }}
                          className="text-xs opacity-80 hover:opacity-100"
                        >
                          👍
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

            {/* Loading indicator */}
            {(isLoading || state.isLoading) && (
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
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
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
              {/* Voice status alerts */}
              {(voiceStatus || permissionError) && (
                <Alert className="mb-4">
                  <AlertDescription>
                    {voiceStatus || permissionError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Quick prompts */}
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

              {/* Input area */}
              <div className="flex gap-2 md:gap-4 items-end">
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Ask a legal question..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[48px] text-base border-border/50 bg-background/50 backdrop-blur-sm"
                    disabled={isLoading || state.isLoading}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !inputMessage.trim() || isLoading || state.isLoading
                  }
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
                  disabled={isLoading || state.isLoading}
                >
                  🎤
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLanguageToggle}
                  className="hover:scale-105 transition-transform w-20"
                  disabled={isLoading || state.isLoading}
                >
                  {language.toUpperCase()}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyLast}
                  disabled={isLoading || state.isLoading}
                >
                  Copy Last
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClear}
                  disabled={isLoading || state.isLoading}
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
