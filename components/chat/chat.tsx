'use client';
import React, { useState, useEffect, useRef } from 'react';

// --- Type Definitions for API data ---
interface Session {
  id: string;
  topic?: string;
}

interface Message {
  text: string;
  // Add other message properties if they exist
}

interface Source {
  Source: string;
  ArticleNumber: string;
}

const Chat: React.FC = () => {
  // --- State Management using React Hooks ---
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // State for the main chat interaction
  const [prompt, setPrompt] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [status, setStatus] = useState('Ready');
  const [isSending, setIsSending] = useState(false);

  // State for voice chat
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [voiceLang, setVoiceLang] = useState('en');
  const [voiceStatus, setVoiceStatus] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  // --- Data Fetching and Side Effects ---

  // Fetch all sessions on initial component mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Fetch messages when the currentSessionId changes
  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    } else {
      setMessages([]); // Clear old messages when no session is selected
    }
  }, [currentSessionId]);

  // --- API Interaction Functions ---

  const loadSessions = async () => {
    setStatus('Loading sessions...');
    try {
      const res = await fetch("https://lawgen-backend-3ln1.onrender.com/api/v1/chats/sessions");
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data.sessions || []);
      setStatus('Sessions loaded.');
    } catch (err) {
      const error = err as Error;
      setStatus(`❌ Could not load sessions: ${error.message}`);
      console.error('Session fetch error:', err);
    }
  };

  const loadMessages = async (sessionId: string) => {
    setMessages([]); // Clear previous messages
    setStatus(`Loading messages for session ${sessionId}...`);
    try {
      const res = await fetch(`https://lawgen-backend-3ln1.onrender.com/api/v1/chats/sessions/${sessionId}/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data.messages || []);
      setStatus('Messages loaded.');
    } catch (err) {
      const error = err as Error;
      setStatus(`❌ Could not load messages: ${error.message}`);
      console.error('Message fetch error:', err);
    }
  };

  // --- Main Chat Logic (Text Query with SSE) ---

  const handleSendQuery = async () => {
    if (!prompt.trim() || isSending) return;

    setIsSending(true);
    setStreamingResponse('');
    setStatus("POST https://lawgen-backend-3ln1.onrender.com/api/v1/chats/query ...");

    try {
      const response = await fetch("https://lawgen-backend-3ln1.onrender.com/api/v1/chats/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "react-frontend",
          query: prompt,
          language: "en" // Or make this dynamic
        })
      });

      if (!response.body) {
        throw new Error("No response body received from server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let newSessionId: string | null = null;

      // Process the SSE stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let eventIdx;
        while ((eventIdx = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, eventIdx);
          buffer = buffer.slice(eventIdx + 2);
          
          const lines = rawEvent.split("\n");
          let eventType: string | null = null;
          let eventData = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.substring(7).trim();
            } else if (line.startsWith("data: ")) {
              eventData += line.substring(6);
            }
          }

          if (!eventType) continue;

          let parsedData;
          try {
            parsedData = JSON.parse(eventData);
          } catch {
            parsedData = eventData;
          }

          // Handle different event types by updating state
          switch(eventType) {
            case "session_id":
              newSessionId = parsedData.id;
              setStreamingResponse(prev => `${prev}Session ID: ${parsedData.id}\n`);
              break;
            case "message":
              setStreamingResponse(prev => `${prev}${parsedData.text}`);
              break;
            case "complete":
              let completeText = "";
              if (parsedData.text) completeText += `\n${parsedData.text}`;
              if (parsedData.sources && parsedData.sources.length > 0) {
                completeText += "\nSources used in this answer:\n";
                parsedData.sources.forEach((src: Source) => {
                  completeText += `- ${src.Source} (Article: ${src.ArticleNumber})\n`;
                });
              }
              if (parsedData.suggested_questions) {
                completeText += "\nSuggested questions:\n" + parsedData.suggested_questions.join("\n");
              }
              setStreamingResponse(prev => prev + completeText);
              setStatus("Done ✅");
              
              await loadSessions();
              if (newSessionId) {
                setCurrentSessionId(newSessionId);
              }
              break;
            case "error":
              setStatus(`❌ Error: ${parsedData.message || 'Unknown error'}`);
              break;
          }
        }
      }
    } catch (err) {
      const error = err as Error;
      setStatus(`❌ Error receiving response: ${error.message}`);
      console.error("Fetch error:", err);
    } finally {
      setIsSending(false);
      setPrompt('');
    }
  };

  // --- Voice Chat Logic ---

  const handleSendVoiceQuery = async () => {
    if (!voiceFile) {
        setVoiceStatus("Please select an audio file.");
        return;
    }
    setVoiceStatus("Sending voice query...");
    setAudioUrl(null);

    const formData = new FormData();
    formData.append("file", voiceFile);
    formData.append("language", voiceLang);

    try {
        const resp = await fetch("https://lawgen-backend-3ln1.onrender.com/api/v1/chats/voice-query", {
            method: "POST",
            body: formData
        });

        if (!resp.ok) {
            const errText = await resp.text();
            throw new Error(`Voice query failed: ${resp.statusText}\n${errText}`);
        }

        const audioBlob = await resp.blob();
        if (audioBlob.type.startsWith('audio/')) {
            const newAudioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(newAudioUrl);
            setVoiceStatus("Voice response received.");
        } else {
            setVoiceStatus("Response was not a valid audio file.");
        }
    } catch (err) {
        const error = err as Error;
        setVoiceStatus(`Error: ${error.message}`);
    }
  };

  // Auto-play audio when a new URL is set
  useEffect(() => {
    if (audioUrl && audioPlayerRef.current) {
        audioPlayerRef.current.play();
    }
  }, [audioUrl]);

  // --- Render Component (JSX with Tailwind CSS) ---

  return (
    <div className="w-full max-w-3xl bg-white mt-10 mx-auto rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-slate-800 tracking-wider mb-6">
        LAWGEN Legal Assistant
      </h2>
      
      <div className="flex gap-6 mb-5">
        <div className="flex-1 min-w-0 bg-slate-50 rounded-xl p-3 shadow-sm">
          <h4 className="font-semibold text-slate-700 mb-2">Sessions</h4>
          <ul className="list-none p-0 m-0 max-h-[180px] overflow-y-auto">
            {sessions.length === 0 && <li className="text-slate-500 p-2">No sessions found.</li>}
            {sessions.map(session => (
              <li
                key={session.id}
                className={`p-2 px-2.5 rounded-md mb-0.5 cursor-pointer transition-colors duration-150 ${
                  currentSessionId === session.id 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'hover:bg-slate-200'
                }`}
                onClick={() => setCurrentSessionId(session.id)}
              >
                {session.topic || session.id}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 min-w-0 bg-slate-50 rounded-xl p-3 shadow-sm">
          <h4 className="font-semibold text-slate-700 mb-2">Messages</h4>
          <ul className="list-none p-0 m-0 max-h-[180px] overflow-y-auto">
            {messages.length === 0 && <li className="text-slate-500 p-2">No messages in this session.</li>}
            {messages.map((msg, index) => (
              <li key={index} className="p-2">{msg.text}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="min-h-[120px] bg-slate-50 rounded-xl p-3 mb-5 text-slate-800 whitespace-pre-wrap overflow-y-auto border border-slate-200">
        {streamingResponse || <span className="text-slate-400">Response will appear here...</span>}
      </div>

      <div className="flex gap-2.5 mb-2">
        <input
          type="text"
          placeholder="Type your question..."
          autoComplete="off"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSendQuery()}
          disabled={isSending}
          className="flex-1 p-2.5 rounded-lg border border-slate-300 text-base outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        />
        <button 
          onClick={handleSendQuery} 
          disabled={isSending}
          className="px-5 py-2.5 border-none bg-blue-500 text-white rounded-lg cursor-pointer text-base font-medium transition hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div className="text-sm text-slate-500 mt-1 min-h-[20px]">{status}</div>

      <h2 className="text-xl font-semibold text-slate-800 tracking-wider my-6 pt-4 border-t">Voice Chat</h2>
      <div className="bg-slate-50 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setVoiceFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <select
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value)}
              className="rounded-lg border-slate-300"
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
            </select>
        </div>
        <button 
          onClick={handleSendVoiceQuery}
          className="w-full px-5 py-2.5 border-none bg-blue-500 text-white rounded-lg cursor-pointer text-base font-medium transition hover:bg-blue-600 disabled:bg-blue-300"
        >
          Send Voice Query
        </button>
        {audioUrl && (
          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            controls
            className="w-full mt-2"
          />
        )}
        <div className="text-sm text-slate-600 min-h-[20px]">{voiceStatus}</div>
      </div>
    </div>
  );
};

export default Chat;