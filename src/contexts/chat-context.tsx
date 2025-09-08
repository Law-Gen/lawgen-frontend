// "use client";

// import React, {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   useCallback,
// } from "react";
// import { useChatService } from "@/lib/chat-service";

// interface Message {
//   id: string;
//   content: string;
//   sender: "user" | "ai";
//   timestamp: Date;
//   liked?: boolean;
//   sessionId?: string;
// }

// interface ChatSession {
//   id: string;
//   title: string;
//   lastMessage: string;
//   timestamp: number;
//   messageCount?: number;
// }

// interface ChatState {
//   // Sessions
//   sessions: ChatSession[];
//   currentSessionId: string | null;
//   isLoadingSessions: boolean;
//   sessionsError: string | null;

//   // Messages
//   messages: Message[];
//   isLoadingMessages: boolean;
//   messagesError: string | null;

//   // Chat interaction
//   isTyping: boolean;
//   currentInput: string;
//   isLoading: boolean; // General loading state
//   error: string | null; // General error state

//   // UI state
//   sidebarOpen: boolean;
// }

// type ChatAction =
//   | { type: "SET_SESSIONS"; payload: ChatSession[] }
//   | { type: "SET_SESSIONS_LOADING"; payload: boolean }
//   | { type: "SET_SESSIONS_ERROR"; payload: string | null }
//   | { type: "SET_CURRENT_SESSION"; payload: string | null }
//   | { type: "ADD_SESSION"; payload: ChatSession }
//   | {
//       type: "UPDATE_SESSION";
//       payload: { id: string; updates: Partial<ChatSession> };
//     }
//   | { type: "DELETE_SESSION"; payload: string }
//   | { type: "SET_MESSAGES"; payload: Message[] }
//   | { type: "SET_MESSAGES_LOADING"; payload: boolean }
//   | { type: "SET_MESSAGES_ERROR"; payload: string | null }
//   | { type: "ADD_MESSAGE"; payload: Message }
//   | {
//       type: "UPDATE_MESSAGE";
//       payload: { id: string; updates: Partial<Message> };
//     }
//   | { type: "SET_TYPING"; payload: boolean }
//   | { type: "SET_CURRENT_INPUT"; payload: string }
//   | { type: "SET_LOADING"; payload: boolean }
//   | { type: "SET_ERROR"; payload: string | null }
//   | { type: "TOGGLE_SIDEBAR" }
//   | { type: "RESET_CHAT" };

// const initialState: ChatState = {
//   sessions: [],
//   currentSessionId: null,
//   isLoadingSessions: false,
//   sessionsError: null,
//   messages: [],
//   isLoadingMessages: false,
//   messagesError: null,
//   isTyping: false,
//   currentInput: "",
//   isLoading: false,
//   error: null,
//   sidebarOpen: true,
// };

// function chatReducer(state: ChatState, action: ChatAction): ChatState {
//   switch (action.type) {
//     case "SET_SESSIONS":
//       return { ...state, sessions: action.payload };
//     case "SET_SESSIONS_LOADING":
//       return { ...state, isLoadingSessions: action.payload };
//     case "SET_SESSIONS_ERROR":
//       return { ...state, sessionsError: action.payload };
//     case "SET_CURRENT_SESSION":
//       return { ...state, currentSessionId: action.payload };
//     case "ADD_SESSION":
//       return { ...state, sessions: [action.payload, ...state.sessions] };
//     case "UPDATE_SESSION":
//       return {
//         ...state,
//         sessions: state.sessions.map((session) =>
//           session.id === action.payload.id
//             ? { ...session, ...action.payload.updates }
//             : session
//         ),
//       };
//     case "DELETE_SESSION":
//       return {
//         ...state,
//         sessions: state.sessions.filter(
//           (session) => session.id !== action.payload
//         ),
//         currentSessionId:
//           state.currentSessionId === action.payload
//             ? null
//             : state.currentSessionId,
//       };
//     case "SET_MESSAGES":
//       return { ...state, messages: action.payload };
//     case "SET_MESSAGES_LOADING":
//       return { ...state, isLoadingMessages: action.payload };
//     case "SET_MESSAGES_ERROR":
//       return { ...state, messagesError: action.payload };
//     case "ADD_MESSAGE":
//       return { ...state, messages: [...state.messages, action.payload] };
//     case "UPDATE_MESSAGE":
//       return {
//         ...state,
//         messages: state.messages.map((message) =>
//           message.id === action.payload.id
//             ? { ...message, ...action.payload.updates }
//             : message
//         ),
//       };
//     case "SET_TYPING":
//       return { ...state, isTyping: action.payload };
//     case "SET_CURRENT_INPUT":
//       return { ...state, currentInput: action.payload };
//     case "SET_LOADING":
//       return { ...state, isLoading: action.payload };
//     case "SET_ERROR":
//       return { ...state, error: action.payload };
//     case "TOGGLE_SIDEBAR":
//       return { ...state, sidebarOpen: !state.sidebarOpen };
//     case "RESET_CHAT":
//       return {
//         ...initialState,
//         sessions: state.sessions, // Keep sessions
//         sidebarOpen: state.sidebarOpen, // Keep sidebar state
//       };
//     default:
//       return state;
//   }
// }

// interface ChatContextType {
//   state: ChatState;
//   dispatch: React.Dispatch<ChatAction>;

//   // Session actions
//   loadSessions: () => Promise<void>;
//   createNewSession: (title?: string) => Promise<void>;
//   selectSession: (sessionId: string) => Promise<void>;
//   deleteSession: (sessionId: string) => Promise<void>;
//   updateSessionTitle: (sessionId: string, title: string) => Promise<void>;

//   // Message actions
//   sendMessage: (content: string, language?: string) => Promise<void>;
//   loadMessages: (sessionId: string) => Promise<void>;

//   // UI actions
//   toggleSidebar: () => void;
//   resetChat: () => void;
// }

// const ChatContext = createContext<ChatContextType | null>(null);

// export function ChatProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(chatReducer, initialState);
//   const chatService = useChatService();

//   const loadSessions = useCallback(async () => {
//     try {
//       dispatch({ type: "SET_SESSIONS_LOADING", payload: true });
//       dispatch({ type: "SET_SESSIONS_ERROR", payload: null });

//       const response = await chatService.getSessions(1, 50);
//       const sessions: ChatSession[] = response.items.map((session) => ({
//         id: session.id,
//         title: session.title || "Untitled Chat",
//         lastMessage: session.lastMessage || "",
//         timestamp: session.timestamp || Date.now(),
//         messageCount: session.messageCount || 0,
//       }));

//       dispatch({ type: "SET_SESSIONS", payload: sessions });

//       // Also save to localStorage for offline access
//       localStorage.setItem("chatSessions", JSON.stringify(sessions));
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to load sessions";
//       dispatch({ type: "SET_SESSIONS_ERROR", payload: errorMessage });
//       console.error("Error loading sessions:", error);

//       // Fallback to localStorage
//       const localSessions = localStorage.getItem("chatSessions");
//       if (localSessions) {
//         try {
//           const sessions = JSON.parse(localSessions);
//           dispatch({ type: "SET_SESSIONS", payload: sessions });
//         } catch (parseError) {
//           console.error("Error parsing local sessions:", parseError);
//         }
//       }
//     } finally {
//       dispatch({ type: "SET_SESSIONS_LOADING", payload: false });
//     }
//   }, [chatService]);

//   const loadMessages = useCallback(
//     async (sessionId: string) => {
//       try {
//         dispatch({ type: "SET_MESSAGES_LOADING", payload: true });
//         dispatch({ type: "SET_MESSAGES_ERROR", payload: null });

//         if (chatService.isAuthenticated && !sessionId.startsWith("local-")) {
//           const response = await chatService.getSessionMessages(sessionId);
//           const messages: Message[] = response.items.map((msg) => ({
//             id: msg.id,
//             content: msg.content,
//             sender: msg.sender === "assistant" ? "ai" : "user",
//             timestamp: new Date(msg.timestamp),
//             sessionId: msg.sessionId,
//           }));
//           dispatch({ type: "SET_MESSAGES", payload: messages });
//         }
//       } catch (error) {
//         const errorMessage =
//           error instanceof Error ? error.message : "Failed to load messages";
//         dispatch({ type: "SET_MESSAGES_ERROR", payload: errorMessage });
//         console.error("Error loading messages:", error);
//       } finally {
//         dispatch({ type: "SET_MESSAGES_LOADING", payload: false });
//       }
//     },
//     [chatService]
//   );

//   const selectSession = useCallback(
//     async (sessionId: string) => {
//       try {
//         dispatch({ type: "SET_CURRENT_SESSION", payload: sessionId });
//         localStorage.setItem("guestSessionId", sessionId);

//         if (chatService.isAuthenticated && !sessionId.startsWith("local-")) {
//           await loadMessages(sessionId);
//         } else {
//           // For local sessions, load from localStorage
//           const localMessages = localStorage.getItem(`messages-${sessionId}`);
//           if (localMessages) {
//             const messages = JSON.parse(localMessages);
//             dispatch({ type: "SET_MESSAGES", payload: messages });
//           } else {
//             dispatch({ type: "SET_MESSAGES", payload: [] });
//           }
//         }
//       } catch (error) {
//         console.error("Error selecting session:", error);
//       }
//     },
//     [chatService, loadMessages]
//   );

//   // Load sessions on mount
//   useEffect(() => {
//     loadSessions();
//   }, [loadSessions]);

//   // Load session from localStorage on mount
//   useEffect(() => {
//     const savedSessionId = localStorage.getItem("guestSessionId");
//     if (savedSessionId && savedSessionId !== state.currentSessionId) {
//       selectSession(savedSessionId);
//     }
//   }, [selectSession, state.currentSessionId]);

//   const createNewSession = useCallback(
//     async (title = "New Chat") => {
//       try {
//         if (chatService.isAuthenticated) {
//           const newSession = await chatService.createSession(title);
//           dispatch({ type: "ADD_SESSION", payload: newSession });
//           dispatch({ type: "SET_CURRENT_SESSION", payload: newSession.id });
//           localStorage.setItem("guestSessionId", newSession.id);
//         } else {
//           // For unauthenticated users, create a local session
//           const newSession: ChatSession = {
//             id: `local-${Date.now()}`,
//             title,
//             lastMessage: "",
//             timestamp: Date.now(),
//             messageCount: 0,
//           };
//           dispatch({ type: "ADD_SESSION", payload: newSession });
//           dispatch({ type: "SET_CURRENT_SESSION", payload: newSession.id });
//           localStorage.setItem("guestSessionId", newSession.id);

//           // Save to localStorage
//           const updatedSessions = [newSession, ...state.sessions];
//           localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
//         }

//         dispatch({ type: "RESET_CHAT" });
//       } catch (error) {
//         console.error("Error creating new session:", error);
//         throw error;
//       }
//     },
//     [chatService, state.sessions]
//   );

//   const deleteSession = useCallback(
//     async (sessionId: string) => {
//       try {
//         if (chatService.isAuthenticated && !sessionId.startsWith("local-")) {
//           await chatService.deleteSession(sessionId);
//         } else {
//           // For local sessions, remove from localStorage
//           localStorage.removeItem(`messages-${sessionId}`);
//         }

//         dispatch({ type: "DELETE_SESSION", payload: sessionId });

//         // Update localStorage
//         const updatedSessions = state.sessions.filter(
//           (s) => s.id !== sessionId
//         );
//         localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));

//         // If this was the current session, clear it
//         if (state.currentSessionId === sessionId) {
//           localStorage.removeItem("guestSessionId");
//           dispatch({ type: "RESET_CHAT" });
//         }
//       } catch (error) {
//         console.error("Error deleting session:", error);
//         throw error;
//       }
//     },
//     [chatService, state.sessions, state.currentSessionId]
//   );

//   const updateSessionTitle = useCallback(
//     async (sessionId: string, title: string) => {
//       try {
//         if (chatService.isAuthenticated && !sessionId.startsWith("local-")) {
//           await chatService.updateSessionTitle(sessionId, title);
//         }

//         dispatch({
//           type: "UPDATE_SESSION",
//           payload: { id: sessionId, updates: { title } },
//         });

//         // Update localStorage
//         const updatedSessions = state.sessions.map((s) =>
//           s.id === sessionId ? { ...s, title } : s
//         );
//         localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
//       } catch (error) {
//         console.error("Error updating session title:", error);
//         throw error;
//       }
//     },
//     [chatService, state.sessions]
//   );

//   const sendMessage = useCallback(
//     async (content: string, language: string = "en") => {
//       if (!content.trim()) return;

//       const userMessage: Message = {
//         id: `user-${Date.now()}`,
//         content: content.trim(),
//         sender: "user",
//         timestamp: new Date(),
//         sessionId: state.currentSessionId || undefined,
//       };

//       dispatch({ type: "ADD_MESSAGE", payload: userMessage });
//       dispatch({ type: "SET_TYPING", payload: true });
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "SET_ERROR", payload: null });

//       try {
//         // Create session if none exists
//         if (!state.currentSessionId) {
//           await createNewSession();
//         }

//         let aiResponseContent = "";

//         // For authenticated users with remote sessions
//         if (
//           chatService.isAuthenticated &&
//           state.currentSessionId &&
//           !state.currentSessionId.startsWith("local-")
//         ) {
//           try {
//             const response = await chatService.sendMessage(
//               state.currentSessionId,
//               content
//             );
//             aiResponseContent =
//               response.content ||
//               "I received your message but couldn't generate a response.";
//           } catch (error) {
//             console.error("Error getting AI response:", error);
//             aiResponseContent =
//               "Sorry, I encountered an error processing your request. Please try again.";
//           }
//         } else {
//           // For local/unauthenticated users, provide a basic response
//           aiResponseContent =
//             "Thank you for your message. To get AI-powered legal assistance, please sign in to your account.";
//         }

//         // Add AI response
//         const aiMessage: Message = {
//           id: `ai-${Date.now()}`,
//           content: aiResponseContent,
//           sender: "ai",
//           timestamp: new Date(),
//           sessionId: state.currentSessionId || undefined,
//         };

//         dispatch({ type: "ADD_MESSAGE", payload: aiMessage });

//         // Save messages locally
//         const sessionId = state.currentSessionId || userMessage.id;
//         const allMessages = [...state.messages, userMessage, aiMessage];
//         localStorage.setItem(
//           `messages-${sessionId}`,
//           JSON.stringify(allMessages)
//         );

//         // Update session last message
//         if (state.currentSessionId) {
//           dispatch({
//             type: "UPDATE_SESSION",
//             payload: {
//               id: state.currentSessionId,
//               updates: {
//                 lastMessage: content,
//                 timestamp: Date.now(),
//               },
//             },
//           });
//         }
//       } catch (error) {
//         const errorMessage =
//           error instanceof Error ? error.message : "Failed to send message";
//         dispatch({ type: "SET_ERROR", payload: errorMessage });
//         console.error("Error sending message:", error);
//         throw error;
//       } finally {
//         dispatch({ type: "SET_TYPING", payload: false });
//         dispatch({ type: "SET_LOADING", payload: false });
//       }
//     },
//     [chatService, state.currentSessionId, state.messages, createNewSession]
//   );

//   const toggleSidebar = () => {
//     dispatch({ type: "TOGGLE_SIDEBAR" });
//   };

//   const resetChat = () => {
//     dispatch({ type: "RESET_CHAT" });
//     localStorage.removeItem("guestSessionId");
//   };

//   const contextValue: ChatContextType = {
//     state,
//     dispatch,
//     loadSessions,
//     createNewSession,
//     selectSession,
//     deleteSession,
//     updateSessionTitle,
//     sendMessage,
//     loadMessages,
//     toggleSidebar,
//     resetChat,
//   };

//   return (
//     <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
//   );
// }

// export function useChat() {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChat must be used within a ChatProvider");
//   }
//   return context;
// }
