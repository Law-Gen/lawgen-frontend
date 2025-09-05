import { useEffect } from "react";
import { api } from "@/src/lib/api"; // your API helper

export default function GoogleCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const code_verifier = localStorage.getItem("pkce_verifier");

    if (code && code_verifier) {
      api
        .post("/auth/google", { code, code_verifier })
        .then((data) => {
          // Store tokens, redirect, etc.
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          window.location.href = "/chat";
        })
        .catch((err) => {
          alert("Google sign-in failed");
        });
    }
  }, []);

  return <div>Signing in with Google...</div>;
}
