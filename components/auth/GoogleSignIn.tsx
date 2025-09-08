"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function GoogleSignIn() {
  const { theme, resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleGoogleSignIn() {
    setIsLoading(true);

    try {
      // Generate a secure state parameter
      const state =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Store state in sessionStorage for verification
      sessionStorage.setItem("oauth_state", state);

      // Redirect directly to your backend's Google OAuth endpoint
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const backendOAuthUrl = `https://lawgen-backend.onrender.com/auth/google/oauth?redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}`;

      // Redirect to backend OAuth endpoint
      window.location.href = backendOAuthUrl;
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      setIsLoading(false);
    }
  }

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="w-full">
        <button
          type="button"
          disabled
          className="w-full flex justify-center items-center min-h-[44px] py-2 rounded-lg shadow-sm font-semibold text-base bg-gray-200 text-gray-800"
        >
          Continue with Google
        </button>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className={`w-full flex justify-center items-center min-h-[44px] py-2 rounded-lg shadow-sm font-semibold text-base transition-opacity ${
          isDark ? "bg-zinc-800 text-white" : "bg-[#f5ede6] text-black"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
      >
        {isLoading ? "Redirecting..." : "Continue with Google"}
      </button>
    </div>
  );
}
