"use client";

import { useTheme } from "next-themes";

function base64URLEncode(buffer: ArrayBuffer | Uint8Array) {
  const uint8Array =
    buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return btoa(String.fromCharCode(...uint8Array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generatePKCE() {
  const code_verifier = base64URLEncode(
    crypto.getRandomValues(new Uint8Array(32))
  );
  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  const code_challenge = base64URLEncode(digest);
  return { code_verifier, code_challenge };
}

export default function GoogleSignIn() {
  const { theme } = useTheme();

  async function handleGoogleSignIn() {
    const { code_verifier, code_challenge } = await generatePKCE();
    localStorage.setItem("pkce_verifier", code_verifier);

    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirect_uri = window.location.origin + "/auth/google/callback";
    const scope = "openid email profile";
    const state = Math.random().toString(36).substring(2);

    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&scope=${encodeURIComponent(
      scope
    )}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256`;

    window.location.href = url;
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className={`w-full flex justify-center items-center min-h-[44px] py-2 rounded-lg shadow-sm font-semibold text-base ${
        theme === "dark" ? "bg-zinc-800 text-white" : "bg-[#f5ede6] text-black"
      }`}
    >
      Continue with Google
    </button>
  );
}
