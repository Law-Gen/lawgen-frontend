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
    planID?: string
  ): Promise<T> {
    if (!this.baseUrl) {
      throw new Error("Chat service base URL not configured");
    }

    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add authentication headers if provided
    if (userID) headers["userID"] = userID;
    if (planID) headers["planID"] = planID;

    const response = await fetch(url, {
      ...options,
      headers,
    });

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
    planID?: string
  ): Promise<ChatSessionsResponse> {
    try {
      const endpoint = `/chats/sessions?page=${page}&limit=${limit}`;
      const response = await this.makeRequest<ChatSessionsResponse>(
        endpoint,
        { method: "GET" },
        userID,
        planID
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
    planID?: string
  ): Promise<ChatMessagesResponse> {
    try {
      const endpoint = `/chats/sessions/${sessionId}/messages?page=${page}&limit=${limit}`;
      const response = await this.makeRequest<ChatMessagesResponse>(
        endpoint,
        { method: "GET" },
        userID,
        planID
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
    planID?: string
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
        planID
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
    planID?: string
  ): Promise<void> {
    try {
      const endpoint = `/chats/sessions/${sessionId}`;
      await this.makeRequest<void>(
        endpoint,
        { method: "DELETE" },
        userID,
        planID
      );
    } catch (error) {
      console.error("Error deleting chat session:", error);
      throw error;
    }
  }

  async sendMessage(
    sessionId: string,
    content: string,
    userID?: string,
    planID?: string
  ): Promise<ChatMessage> {
    try {
      const endpoint = `/chats/sessions/${sessionId}/messages`;
      const response = await this.makeRequest<ChatMessage>(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify({ content }),
        },
        userID,
        planID
      );

      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async sendVoiceMessage(
    audioFile: File,
    language: string = "en",
    userID?: string,
    planID?: string
  ): Promise<{ audioUrl?: string; content?: string }> {
    try {
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("language", language);

      const endpoint = `/chats/voice-query`;
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
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
    planID?: string
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
        planID
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
  const { user, isAuthenticated } = useAuthSession();

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
      const { userID, planID } = getUserInfo();
      return chatService.getSessions(page, limit, userID, planID);
    };

    const getSessionMessages = async (
      sessionId: string,
      page = 1,
      limit = 50
    ) => {
      const { userID, planID } = getUserInfo();
      return chatService.getSessionMessages(
        sessionId,
        page,
        limit,
        userID,
        planID
      );
    };

    const createSession = async (title: string) => {
      const { userID, planID } = getUserInfo();
      return chatService.createSession(title, userID, planID);
    };

    const deleteSession = async (sessionId: string) => {
      const { userID, planID } = getUserInfo();
      return chatService.deleteSession(sessionId, userID, planID);
    };

    const sendMessage = async (sessionId: string, content: string) => {
      const { userID, planID } = getUserInfo();
      return chatService.sendMessage(sessionId, content, userID, planID);
    };

    const sendVoiceMessage = async (
      audioFile: File,
      language: string = "en"
    ) => {
      const { userID, planID } = getUserInfo();
      return chatService.sendVoiceMessage(audioFile, language, userID, planID);
    };

    const updateSessionTitle = async (sessionId: string, title: string) => {
      const { userID, planID } = getUserInfo();
      return chatService.updateSessionTitle(sessionId, title, userID, planID);
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
  }, [user, isAuthenticated]);
}
