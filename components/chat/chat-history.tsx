"use client";

import { useMemo, useState } from "react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Plus,
  Search,
  MessageCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useChat } from "@/contexts/chat-context";
import { useAuthSession } from "@/hooks/use-auth-session";

export function ChatHistory() {
  const {
    state,
    loadSessions,
    createNewSession,
    selectSession,
    deleteSession,
  } = useChat();
  const { isAuthenticated } = useAuthSession();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return state.sessions;
    const q = query.toLowerCase();
    return state.sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.lastMessage.toLowerCase().includes(q)
    );
  }, [state.sessions, query]);

  const handleNewChat = async () => {
    try {
      await createNewSession();
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    try {
      await selectSession(sessionId);
    } catch (error) {
      console.error("Failed to select session:", error);
    }
  };

  const handleDeleteSession = async (
    sessionId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent session selection

    if (confirm("Are you sure you want to delete this conversation?")) {
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    }
  };

  const handleRefresh = () => {
    loadSessions();
  };

  return (
    <Card className="h-full rounded-none border-0 bg-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat History
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              disabled={state.isLoadingSessions}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  state.isLoadingSessions ? "animate-spin" : ""
                }`}
              />
            </Button>
            <Button
              onClick={handleNewChat}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {!isAuthenticated && (
          <Alert className="mt-2">
            <AlertDescription className="text-sm">
              Sign in to sync your chat history across devices.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {state.sessionsError && (
          <div className="px-4 mb-4">
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                {state.sessionsError}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="h-[calc(100vh-320px)] overflow-y-auto">
          <div className="space-y-2 px-4">
            {state.isLoadingSessions && state.sessions.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading conversations...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {query
                  ? "No conversations match your search"
                  : "No conversations yet"}
                {!query && (
                  <div className="mt-4">
                    <Button onClick={handleNewChat} variant="outline" size="sm">
                      Start your first conversation
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {filtered.map((session, index) => (
                  <MotionWrapper
                    key={session.id}
                    animation="staggerIn"
                    delay={index * 50}
                  >
                    <Card
                      onClick={() => handleSelectSession(session.id)}
                      className={`cursor-pointer hover:bg-accent/50 transition-colors group relative ${
                        state.currentSessionId === session.id
                          ? "bg-accent/30 border-primary/20"
                          : ""
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm text-primary line-clamp-1 group-hover:text-primary/80 flex-1 pr-2">
                            {session.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            {session.messageCount !== undefined &&
                              session.messageCount > 0 && (
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                  {session.messageCount}
                                </span>
                              )}
                            <Button
                              onClick={(e) =>
                                handleDeleteSession(session.id, e)
                              }
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {session.lastMessage || "New conversation"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  </MotionWrapper>
                ))}
              </>
            )}
          </div>
        </div>

        {state.sessions.length > 0 && (
          <div className="px-4 py-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              {state.sessions.length} conversation
              {state.sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
