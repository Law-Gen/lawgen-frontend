"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function GoogleCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing Google authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        const error = params.get("error");

        if (error) {
          setStatus("error");
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage("No authorization code received from Google");
          return;
        }

        // Verify state parameter
        const storedState = sessionStorage.getItem("oauth_state");
        if (!storedState || storedState !== state) {
          setStatus("error");
          setMessage("Invalid state parameter. Possible security issue.");
          return;
        }

        // Clean up stored state
        sessionStorage.removeItem("oauth_state");

        setMessage("Authenticating with backend...");

        // Use NextAuth to sign in with the authorization code
        const result = await signIn("google-backend", {
          authorizationCode: code,
          redirect: false,
        });

        if (result?.error) {
          setStatus("error");
          setMessage(`Authentication failed: ${result.error}`);
        } else if (result?.ok) {
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");

          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          setStatus("error");
          setMessage("Authentication failed: Unknown error");
        }
      } catch (error) {
        console.error("Callback error:", error);
        setStatus("error");
        setMessage("An unexpected error occurred during authentication");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Google Authentication
          </h2>
          <div className="mt-8">
            {status === "loading" && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {message}
                </span>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{message}</span>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>{message}</span>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => (window.location.href = "/auth/signin")}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
