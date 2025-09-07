import { useEffect } from "react";
import { api } from "@/src/lib/api";

export default function GoogleCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const code_verifier = localStorage.getItem("pkce_verifier");

    if (code && code_verifier) {
      api
        .post("/auth/google", { code, code_verifier })
        .then((data) => {
          if (data?.access_token) localStorage.setItem("access_token", data.access_token);
          if (data?.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
          if (data?.user?.id) localStorage.setItem("user_id", String(data.user.id));
          if (data?.user?.plan) localStorage.setItem("plan_id", String(data.user.plan));
          window.location.href = "/chat";
        })
        .catch(() => {
          alert("Google sign-in failed");
        });
    }
  }, []);

  return <div>Signing in with Google...</div>;
}
