# Authentication Setup (NextAuth + Google)

This guide explains how to use NextAuth to handle email/password and Google sign-in in this project.

## 1) Environment variables
Set these environment variables in your project settings. Use the platform Settings or the Dev Server tool to configure secrets.

- NEXTAUTH_URL: your app URL (e.g. http://localhost:3000 or https://your-domain.com)
- NEXTAUTH_SECRET: a strong random string
- GOOGLE_CLIENT_ID: from Google Cloud Console
- GOOGLE_CLIENT_SECRET: from Google Cloud Console
- NEXT_PUBLIC_API_BASE_URL: backend base URL (already set)

Optional (existing):
- NEXT_PUBLIC_QUIZ_BASE_URL

## 2) Google Cloud Console
- Create OAuth 2.0 Client ID (Web application) at https://console.cloud.google.com/apis/credentials
- Authorized redirect URI: {NEXTAUTH_URL}/api/auth/callback/google
  - Example (local): http://localhost:3000/api/auth/callback/google
  - Example (prod): https://your-domain.com/api/auth/callback/google
- Authorized JavaScript origins: your site origins (local and prod)
- Copy Client ID/Secret into GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET

## 3) NextAuth configuration
The app/api/auth/[...nextauth]/route.ts has:
- CredentialsProvider for email/password via backend
- GoogleProvider for OAuth with offline access (refresh token)
- JWT/session callbacks that expose accessToken/refreshToken on session

## 4) Sign-in buttons
The Google button uses NextAuth:
- signIn("google", { callbackUrl: "/chat" })
- No custom PKCE page is needed; NextAuth handles the OAuth flow and callback

## 5) Testing locally
- Ensure NEXTAUTH_URL=http://localhost:3000
- Start dev server
- Visit /auth/signin or /auth/signup and click "Continue with Google"
- On success you should be redirected to /chat and session contains accessToken

## 6) Backend integration notes
- The app uses session.accessToken for API Authorization headers.
- If your backend expects its own JWT (not Google’s), add an exchange step in the NextAuth jwt callback to call your backend and swap the Google token for your API token, then set token.accessToken accordingly.

## 7) Troubleshooting
- Invalid redirect_uri: ensure it matches {NEXTAUTH_URL}/api/auth/callback/google exactly.
- No refresh token: Google only returns it on first consent; set prompt=consent and access_type=offline (already configured).
- Session empty: check NEXTAUTH_SECRET, NEXTAUTH_URL, and that cookies are not blocked.
