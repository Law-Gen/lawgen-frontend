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
import Link from "next/link";
import { useTheme } from "next-themes";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function ChatPage() {
  // Chat is now public, no session required
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);
    // Simulate AI response with more realistic legal guidance
    setTimeout(() => {
      const responses = [
        "Thank you for your question about legal matters. While I can provide general information, please remember that this doesn't constitute legal advice. For your specific situation, I'd recommend consulting with a qualified legal professional.",
        "That's an interesting legal question. Based on general legal principles, here are some key points to consider... However, laws can vary by jurisdiction, so it's important to verify this information with local legal resources.",
        "I understand your concern about this legal issue. Let me provide some general guidance that might help you understand the basic concepts involved. For personalized advice, please consider speaking with a lawyer who specializes in this area.",
        "This is a common legal question that many people have. Here's some general information that might be helpful... Remember, every situation is unique, so professional legal consultation is always recommended for specific cases.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex flex-col overflow-x-hidden">
      {/* Mobile Sidebar (RIGHT SIDE) */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity ${
          sidebarOpen ? "block md:hidden" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[101] h-full w-64 bg-card dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6 gap-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-primary">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="text-2xl"
            >
              &times;
            </button>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-2 py-1 rounded border w-full flex items-center gap-2"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <LanguageToggle />
        </div>
      </aside>

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
          {/* Left: Title and description */}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-primary truncate">
              Legal Assistant Chat
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              AI-powered legal guidance and conversation
            </p>
          </div>
          {/* Hamburger icon for mobile */}
          <div className="md:hidden" style={{ marginLeft: "4px" }}>
            <button
              className="p-0 bg-transparent border-none shadow-none outline-none focus:outline-none"
              style={{ lineHeight: 0 }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h12M4 10h12M4 14h12" />
              </svg>
            </button>
          </div>
          {/* Center: Main navigation (desktop only) */}
          <div className="hidden md:flex flex-1 justify-center">
            <MainNavigation />
          </div>
          {/* Right: Language toggle, dark mode, and sign in (desktop only) */}
          <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-1 rounded border"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Chat History Sidebar - Only for logged-in users */}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <MotionWrapper
                key={message.id}
                animation="staggerIn"
                delay={index * 50}
              >
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
                    className={`max-w-[85%] shadow-lg hover:shadow-xl transition-shadow ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        : "bg-card/80 backdrop-blur-sm border-border/50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-3 opacity-70 ${
                          message.sender === "user"
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </CardContent>
                  </Card>
                  {message.sender === "user" && (
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-accent to-secondary shadow-lg">
                      <AvatarFallback className="text-accent-foreground font-semibold">
                        {"U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </MotionWrapper>
            ))}

            {isLoading && (
              <MotionWrapper animation="fadeInUp">
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
              <div className="flex gap-2 md:gap-4 items-end">
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder={
                      true
                        ? "Ask a legal question..."
                        : "Ask a legal question (guest mode)..."
                    }
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
                  className="hover:scale-105 transition-transform bg-transparent border-border/50 p-3"
                  title="Voice input (coming soon)"
                  disabled
                >
                  🎤
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Only for logged-in users */}
    </div>
  );
}
