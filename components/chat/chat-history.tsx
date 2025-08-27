"use client"

import { useState } from "react"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export function ChatHistory() {
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Employment Rights Question",
      lastMessage: "Thank you for the clarification about overtime pay...",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "2",
      title: "Contract Review Help",
      lastMessage: "I need help understanding this rental agreement...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "3",
      title: "Small Claims Court",
      lastMessage: "What documents do I need for small claims court?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ])

  return (
    <Card className="h-full rounded-none border-0 bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary">Chat History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2 px-4">
            {chatSessions.map((session, index) => (
              <MotionWrapper key={session.id} animation="staggerIn" delay={index * 100}>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm text-primary mb-1 line-clamp-1">{session.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{session.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">{session.timestamp.toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full bg-transparent">
            New Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
