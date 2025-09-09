import { useAuthSession } from "@/hooks/use-auth-session";
import { useMemo } from "react";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messageCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: string;
  sessionId: string;
}

interface ChatSessionsResponse {
  items: ChatSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ChatMessagesResponse {
  items: ChatMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_QUIZ_BASE_URL || "";
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    userID?: string,
    planID?: string,
    accessToken?: string
  ): Promise<T> {
    if (!this.baseUrl) {
      throw new Error("Chat service base URL not configured");
    }

    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add authentication headers
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    } else if (userID) {
      headers["userID"] = userID;
      // if (planID) headers["planid"] = planID;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });
    console.log("ayele", response, url);
    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");

      switch (response.status) {
        case 401:
          throw new Error("Authentication required. Please sign in.");
        case 403:
          throw new Error("Access denied. Please check your subscription.");
        case 404:
          throw new Error("Resource not found.");
        case 429:
          throw new Error("Too many requests. Please try again later.");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(`Request failed: ${error || response.statusText}`);
      }
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Return empty object for non-JSON responses
      return {} as T;
    }

    try {
      return await response.json();
    } catch (err) {
      // If JSON parsing fails, return empty object
      return {} as T;
    }
  }

  async getSessions(
    page = 1,
    limit = 10,
    userID?: string,
    planID?: string,
    accessToken?: string
  ): Promise<ChatSessionsResponse> {
    try {
      const endpoint = `/chats/sessions?page=${page}&limit=${limit}`;
      const response = await this.makeRequest<ChatSessionsResponse>(
        endpoint,
        { method: "GET" },
        userID,
        planID,
        accessToken
      );

      // Ensure we always return a valid structure
      return {
        items: response.items || [],
        pagination: response.pagination || {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      };
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      throw error;
    }
  }

  async getSessionMessages(
    sessionId: string,
    page = 1,
    limit = 50,
    userID?: string,
    planID?: string,
    accessToken?: string
  ): Promise<ChatMessagesResponse> {
    try {
      const endpoint = `/chats/sessions/${sessionId}/messages?page=${page}&limit=${limit}`;
      const response = await this.makeRequest<ChatMessagesResponse>(
        endpoint,
        { method: "GET" },
        userID,
        planID,
        accessToken
      );

      return {
        items: response.items || [],
        pagination: response.pagination || {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      };
    } catch (error) {
      console.error("Error fetching session messages:", error);
      throw error;
    }
  }

  async createSession(
    title: string,
    userID?: string,
    planID?: string,
    accessToken?: string
  ): Promise<ChatSession> {
    try {
      const endpoint = "/chats/sessions";
      const response = await this.makeRequest<ChatSession>(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify({ title }),
        },
        userID,
        planID,
        accessToken
      );

      return response;
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw error;
    }
  }

  async deleteSession(
    sessionId: string,
    userID?: string,
    planID?: string,
    accessToken?: string
  ): Promise<void> {
    try {
      const endpoint = `/chats/sessions/${sessionId}`;
      await this.makeRequest<void>(
        endpoint,
        { method: "DELETE" },
        userID,
        planID,
        accessToken
      );
    } catch (error) {
      console.error("Error deleting chat session:", error);
      throw error;
    }
  }

  async sendMessage(
    content: string,
    userID?: string,
    language?: string,
    accessToken?: string
  ): Promise<{
    sessionId: string;
    messages: ChatMessage[];
    sources: any[];
    suggestedQuestions: string[];
  }> {
    if (!this.baseUrl) {
      throw new Error("Chat service base URL not configured");
    }

    const url = `${this.baseUrl}/chats/query`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: content, language }),
    });

    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");
      throw new Error(`Request failed: ${error || response.statusText}`);
    }

    return new Promise((resolve, reject) => {
      const reader = response.body?.getReader();
      if (!reader) {
        reject(new Error("Response body is not readable"));
        return;
      }

      let sessionId = "";
      const messages: ChatMessage[] = [];
      const sources: any[] = [];
      let suggestedQuestions: string[] = [];
      let buffer = "";
      let eventType = "";
      let currentMessageText = "";
      let isComplete = false;

      const processChunk = (chunk: string) => {
        if (isComplete) return; // Stop processing after complete

        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("event:")) {
            eventType = trimmedLine.slice(6).trim();
          } else if (trimmedLine.startsWith("data:")) {
            const data = trimmedLine.slice(5).trim();
            try {
              const parsedData = JSON.parse(data);
              if (eventType === "session_id") {
                sessionId = parsedData.id;
              } else if (eventType === "message") {
                // Accumulate the message text
                currentMessageText += parsedData.text;
                if (parsedData.sources) {
                  sources.push(...parsedData.sources);
                }
              } else if (eventType === "complete") {
                isComplete = true;
                // Create the final message with accumulated text
                if (currentMessageText) {
                  messages.push({
                    id: Date.now().toString(),
                    content: currentMessageText,
                    sender: "assistant",
                    timestamp: new Date().toISOString(),
                    sessionId,
                  });
                }
                suggestedQuestions = parsedData.suggested_questions || [];
                resolve({
                  sessionId,
                  messages,
                  sources,
                  suggestedQuestions,
                });
              }
            } catch (e) {
              // Ignore invalid JSON
            }
          }
        }
      };

      const readStream = async () => {
        try {
          while (!isComplete) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            processChunk(chunk);
          }
        } catch (error) {
          if (!isComplete) {
            reject(error);
          }
        }
      };

      readStream();
    });
  }

  async sendVoiceMessage(
    audioFile: File,
    language: string = "en",
    userID?: string,
    planID?: string,
    accessToken?: string
  ): Promise<{ audioUrl?: string; content?: string }> {
    try {
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("language", language);

      const endpoint = `/chats/voice-query`;
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...(userID && { userID: userID }),
          ...(planID && { planID: planID }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Voice query failed ${response.status}: ${errorText}`);
      }

      const audioBlob = await response.blob();
      if (audioBlob.type.startsWith("audio/")) {
        const audioUrl = URL.createObjectURL(audioBlob);
        return { audioUrl };
      } else {
        throw new Error("Response was not a valid audio file.");
      }
    } catch (error) {
      console.error("Error sending voice message:", error);
      throw error;
    }
  }

  async updateSessionTitle(
    sessionId: string,
    title: string,
    userID?: string,
    planID?: string,
    accessToken?: string
  ): Promise<ChatSession> {
    try {
      const endpoint = `/chats/sessions/${sessionId}`;
      const response = await this.makeRequest<ChatSession>(
        endpoint,
        {
          method: "PATCH",
          body: JSON.stringify({ title }),
        },
        userID,
        planID,
        accessToken
      );

      return response;
    } catch (error) {
      console.error("Error updating session title:", error);
      throw error;
    }
  }
}

// Create a singleton instance
export const chatService = new ChatService();

// Hook for using chat service with authentication
export function useChatService() {
  const { user, isAuthenticated, accessToken } = useAuthSession();

  return useMemo(() => {
    const getUserInfo = () => {
      if (!isAuthenticated || !user) {
        return { userID: undefined, planID: undefined };
      }

      return {
        userID: user.id || "anonymous",
        planID: (user as any).plan || "free",
      };
    };

    const getSessions = async (page = 1, limit = 10) => {
      return chatService.getSessions(
        page,
        limit,
        undefined,
        undefined,
        accessToken
      );
    };

    const getSessionMessages = async (
      sessionId: string,
      page = 1,
      limit = 50
    ) => {
      return chatService.getSessionMessages(
        sessionId,
        page,
        limit,
        undefined,
        undefined,
        accessToken
      );
    };

    const createSession = async (title: string) => {
      return chatService.createSession(
        title,
        undefined,
        undefined,
        accessToken
      );
    };

    const deleteSession = async (sessionId: string) => {
      return chatService.deleteSession(
        sessionId,
        undefined,
        undefined,
        accessToken
      );
    };

    const sendMessage = async (content: string, language: string) => {
      const { userID, planID } = getUserInfo();
      return chatService.sendMessage(content, userID, language, accessToken);
    };

    const sendVoiceMessage = async (
      audioFile: File,
      language: string = "en"
    ) => {
      const { userID, planID } = getUserInfo();
      return chatService.sendVoiceMessage(
        audioFile,
        language,
        userID,
        planID,
        accessToken
      );
    };

    const updateSessionTitle = async (sessionId: string, title: string) => {
      const { userID, planID } = getUserInfo();
      return chatService.updateSessionTitle(
        sessionId,
        title,
        userID,
        planID,
        accessToken
      );
    };

    return {
      getSessions,
      getSessionMessages,
      createSession,
      deleteSession,
      sendMessage,
      sendVoiceMessage,
      updateSessionTitle,
      isAuthenticated,
      user,
    };
  }, [user, isAuthenticated, accessToken]);
}
