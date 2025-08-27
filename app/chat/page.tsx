"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { BottomNavigation } from "@/components/ui/bottom-navigation"
import { ChatHistory } from "@/components/chat/chat-history"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI legal assistant. I can help you with general legal information and guidance. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response with more realistic legal guidance
    setTimeout(() => {
      const responses = [
        "Thank you for your question about legal matters. While I can provide general information, please remember that this doesn't constitute legal advice. For your specific situation, I'd recommend consulting with a qualified legal professional.",
        "That's an interesting legal question. Based on general legal principles, here are some key points to consider... However, laws can vary by jurisdiction, so it's important to verify this information with local legal resources.",
        "I understand your concern about this legal issue. Let me provide some general guidance that might help you understand the basic concepts involved. For personalized advice, please consider speaking with a lawyer who specializes in this area.",
        "This is a common legal question that many people have. Here's some general information that might be helpful... Remember, every situation is unique, so professional legal consultation is always recommended for specific cases.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex flex-col">
      <header className="bg-card/90 backdrop-blur-md border-b border-border/50 p-4 sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                <span className="text-xl text-primary-foreground">⚖️</span>
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-primary">Legal Assistant</h1>
              <p className="text-sm text-muted-foreground">AI-powered legal guidance</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            {!session && (
              <Link href="/auth/signin">
                <Button size="sm" variant="outline" className="bg-transparent hover:scale-105 transition-transform">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {!session && (
        <MotionWrapper animation="fadeInUp">
          <Alert className="mx-4 mt-4 border-accent bg-gradient-to-r from-accent/10 to-primary/10 backdrop-blur-sm">
            <AlertDescription className="text-center py-2">
              <strong className="text-primary">Guest Mode:</strong> This chat provides general legal information only
              and does not constitute legal advice.
              <Link href="/auth/signup" className="text-primary hover:underline ml-2 font-semibold">
                Sign up for free
              </Link>{" "}
              to unlock personalized features and save your chat history.
            </AlertDescription>
          </Alert>
        </MotionWrapper>
      )}

      <div className="flex-1 flex">
        {/* Chat History Sidebar - Only for logged-in users */}
        {session && (
          <div className="hidden lg:block w-80 border-r border-border bg-card/50 backdrop-blur-sm">
            <ChatHistory />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <MotionWrapper key={message.id} animation="staggerIn" delay={index * 50}>
                <div className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {message.sender === "ai" && (
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-primary to-accent shadow-lg">
                      <AvatarFallback className="text-primary-foreground font-semibold">AI</AvatarFallback>
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
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p
                        className={`text-xs mt-3 opacity-70 ${
                          message.sender === "user" ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </CardContent>
                  </Card>
                  {message.sender === "user" && (
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-accent to-secondary shadow-lg">
                      <AvatarFallback className="text-accent-foreground font-semibold">
                        {session?.user?.name?.[0] || "U"}
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
                    <AvatarFallback className="text-primary-foreground font-semibold">AI</AvatarFallback>
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

          <div className="border-t border-border bg-card/90 backdrop-blur-md p-6">
            <div className="container mx-auto">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    placeholder={session ? "Ask a legal question..." : "Ask a legal question (guest mode)..."}
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
                  className="hover:scale-105 transition-transform px-6 py-3 shadow-lg"
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
              {!session && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Enjoying the chat? Sign up to save your conversations and unlock premium features!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/auth/signup">
                      <Button variant="default" size="sm" className="hover:scale-105 transition-transform">
                        Sign Up Free
                      </Button>
                    </Link>
                    <Link href="/auth/signin">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent hover:scale-105 transition-transform"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Only for logged-in users */}
      {session && <BottomNavigation />}
    </div>
  )
}
