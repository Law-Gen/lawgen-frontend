"use client";

import { Provider } from "react-redux";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { store } from "@/src/store/store";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <Provider store={store}>
      <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
    </Provider>
  );
}
