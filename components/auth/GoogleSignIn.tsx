"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { api } from "@/src/lib/api";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleSignIn({
  onSuccess,
}: {
  onSuccess?: (user: any) => void;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Inject the Google script
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);

    s.onload = () => {
      const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
      if (!window.google || !client_id) {
        if (fallbackRef.current) fallbackRef.current.style.display = "block";
        return;
      }
      window.google.accounts.id.initialize({
        client_id,
        callback: async (resp: any) => {
          try {
            const data = await api.post("/auth/google-idtoken", {
              id_token: resp.credential,
            });
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            onSuccess?.(data.user);
            window.location.href = "/";
          } catch (e) {
            console.error("Google sign-in failed", e);
            alert("Google sign-in failed");
          }
        },
      });
      if (divRef.current) {
        window.google.accounts.id.renderButton(divRef.current, {
          type: "standard",
          size: "large",
          shape: "pill",
          theme: theme === "dark" ? "filled_black" : "outline", // dark mode support
          text: "continue_with",
        });
      }
    };

    return () => {
      document.body.removeChild(s);
    };
  }, [theme]);

  return (
    <>
      <div
        ref={divRef}
        className={`w-full flex justify-center items-center min-h-[44px] py-2 rounded-lg shadow-sm ${
          theme === "dark" ? "bg-zinc-800" : "bg-[#f5ede6]"
        }`}
      ></div>
      <div
        ref={fallbackRef}
        style={{ display: "none" }}
        className="text-center text-xs text-red-500 mt-2"
      >
        Google Sign-In button could not be loaded. Check your Google Client ID
        and internet connection.
      </div>
    </>
  );
}
