import NextAuth from "next-auth";
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
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";

// Extend the User, Session, and JWT types to include custom fields
import type { JWT } from "next-auth/jwt";
declare module "next-auth" {
  interface User {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    name?: string | null;
    email?: string | null;
    subscription_status?: string;
  }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      role?: string;
      subscription_status?: string;
    };
    accessToken?: string;
    refreshToken?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    id?: string;
    name?: string | null;
    subscription_status?: string;
    email?: string | null;
    accessTokenExpires?: number;
  }
}

const authOptions: NextAuthOptions = {
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
              subscription_status: data.user?.subscription_status,
            };
          }
          return null;
        } catch (e) {
          console.log("AUTH ERROR:", e);
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
      // On initial sign in
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.subscription_status = user.subscription_status;
        // Set expiry to 15 minutes from now (or your backend's expiry time)
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        return token;
      }

      // If token is not expired, return it
      if (
        token.accessToken &&
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // If token is expired, try to refresh
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
            // Optionally update refreshToken if backend returns a new one
            if (data.refresh_token) {
              token.refreshToken = data.refresh_token;
            }
            return token;
          } else {
            // Refresh failed, force sign out
            return {
              ...token,
              accessToken: undefined,
              refreshToken: undefined,
            };
          }
        } catch (e) {
          // Refresh failed, force sign out
          return { ...token, accessToken: undefined, refreshToken: undefined };
        }
      }
      // No refresh token, force sign out
      return { ...token, accessToken: undefined, refreshToken: undefined };
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = typeof token.id === "string" ? token.id : undefined;
        session.user.role =
          typeof token.role === "string" ? token.role : undefined;
        session.accessToken =
          typeof token.accessToken === "string" ? token.accessToken : undefined;
        session.refreshToken =
          typeof token.refreshToken === "string"
            ? token.refreshToken
            : undefined;
        session.user.email =
          typeof token.email === "string" ? token.email : undefined;
        session.user.subscription_status =
          typeof token.subscription_status === "string"
            ? token.subscription_status
            : undefined;

        session.user.name =
          typeof token.name === "string" ? token.name : undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
