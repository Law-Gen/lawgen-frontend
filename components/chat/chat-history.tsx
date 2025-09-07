"use client"

import { useEffect, useMemo, useState } from "react"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: number
}

export function ChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_QUIZ_BASE_URL
    const userId = (typeof window !== "undefined" && localStorage.getItem("user_id")) || undefined
    const planId = (typeof window !== "undefined" && localStorage.getItem("plan_id")) || "free"

    async function load() {
      try {
        if (userId && base) {
          const url = `${base}/chats/sessions?page=1&limit=50`
          const res = await fetch(url, { headers: { userID: userId, planID: planId } as HeadersInit })
          if (res.ok) {
            const data = await res.json()
            const items: ChatSession[] = (data.items || []).map((s: any) => ({
              id: String(s.id),
              title: s.title || "Chat Session",
              lastMessage: s.lastMessage || "",
              timestamp: new Date(s.updatedAt || s.createdAt || Date.now()).getTime(),
            }))
            setSessions(items)
            return
          }
        }
      } catch {}
      try {
        if (typeof window !== "undefined") {
          const local = localStorage.getItem("chatSessions")
          if (local) setSessions(JSON.parse(local))
        }
      } catch {}
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!query) return sessions
    const q = query.toLowerCase()
    return sessions.filter(
      (s) => s.title.toLowerCase().includes(q) || s.lastMessage.toLowerCase().includes(q)
    )
  }, [sessions, query])

  const handleSelect = (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("guestSessionId", id)
      window.dispatchEvent(new CustomEvent("chat:load-session", { detail: { id } }))
    }
  }

  const handleNewChat = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("guestSessionId")
      window.dispatchEvent(new Event("chat:new"))
    }
  }

  return (
    <Card className="h-full rounded-none border-0 bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary">Chat History</CardTitle>
        <Input
          placeholder="Search conversations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="space-y-2 px-4">
            {filtered.map((session, index) => (
              <MotionWrapper key={session.id} animation="staggerIn" delay={index * 50}>
                <Card onClick={() => handleSelect(session.id)} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm text-primary mb-1 line-clamp-1">{session.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{session.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">{new Date(session.timestamp).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full bg-transparent" onClick={handleNewChat}>
            New Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
