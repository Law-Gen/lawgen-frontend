import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Debug logging to help identify the issue
console.log("NextAuth API_BASE_URL:", API_BASE_URL);
console.log(
  "All env vars:",
  Object.keys(process.env).filter((key) => key.includes("API"))
);

if (!API_BASE_URL) {
  console.error(
    "NEXT_PUBLIC_API_URL is not defined! Please check your .env file."
  );
}

// *** REMOVE 'export' from here ***
const authOptions: NextAuthOptions = {
  // Change 'export const' to 'const'
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (!API_BASE_URL) {
          console.error("API_BASE_URL is undefined. Cannot authenticate user.");
          return null;
        }

        try {
          const loginUrl = `${API_BASE_URL}/auth/login`;
          console.log("Attempting login to:", loginUrl);

          const res = await fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          let data;
          try {
            data = await res.json();
          } catch (err) {
            data = { error: "Invalid JSON response" };
          }
          console.log("AUTH DEBUG:", {
            status: res.status,
            ok: res.ok,
            data,
          });
          if (res.ok && data.access_token) {
            // You can also store user info if returned by your backend
            // Return user object and tokens
            return {
              id: data.user?.id || data.user_id || data.id || credentials.email,
              name: data.user?.name || data.name || credentials.email,
              email: data.user?.email || credentials.email,
              role: data.user?.role || data.role || "user",
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
          }
          return null;
        } catch (e) {
          console.log("AUTH ERROR:", e);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "google-backend",
      name: "Google Backend",
      credentials: {
        authorizationCode: { label: "Authorization Code", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.authorizationCode) {
            console.log("No authorization code provided");
            return null;
          }

          console.log("Processing Google authorization code");

          // Exchange authorization code for tokens via your backend
          const response = await fetch(
            "https://lawgen-backend.onrender.com/auth/google",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                authorization_code: credentials.authorizationCode,
                redirect_uri: `${process.env.NEXTAUTH_URL}/auth/google/callback`,
              }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              "Backend Google auth failed:",
              response.status,
              errorText
            );
            return null;
          }

          const data = await response.json();
          console.log("Google auth response:", data);


          // Expected response: { access_token, refresh_token, user: {...} }
          if (data.access_token && data.user) {
            return {
              id: data.user.id || data.user.email,
              email: data.user.email,
              name: data.user.name,
              image: data.user.picture || data.user.avatar,
              role: data.user.role || "user",
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
          }

          console.error("Invalid response from backend:", data);
          return null;
        } catch (error) {
          console.error("Google auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        return token;
      }

      if (
        token.accessToken &&
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      if (token.refreshToken) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "X-Refresh-Token": token.refreshToken,
            },
          });
          const data = await res.json();
          if (res.ok && data.access_token) {
            token.accessToken = data.access_token;
            token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
            if (data.refresh_token) {
              token.refreshToken = data.refresh_token;
            }
            return token;
          } else {
            return {
              ...token,
              accessToken: undefined,
              refreshToken: undefined,
            };
          }
        } catch (e) {
          return { ...token, accessToken: undefined, refreshToken: undefined };
        }
      }
      return { ...token, accessToken: undefined, refreshToken: undefined };
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: String(token.id || token.sub || ""),
          role: token.role as string | undefined,
          email: token.email as string | null | undefined,
          name: token.name as string | null | undefined,
          image: session.user.image,
        };
        session.accessToken = token.accessToken as string | undefined;
        session.refreshToken = token.refreshToken as string | undefined;
        session.error = token.error as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// This part remains the same, as you correctly export the handler for GET and POST
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
