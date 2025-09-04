import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions, User } from "next-auth"

// Extend the User and Session types to include 'role'
declare module "next-auth" {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      id?: string
      role?: string
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // TODO: Replace with actual database validation
        // For demo purposes, we'll use a simple check
        if (credentials.email === "demo@legalaid.com" && credentials.password === "demo123") {
          return {
            id: "1",
            email: credentials.email,
            name: "Demo User",
            role: "user",
          }
        }

        return null
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
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub
        session.user.role = typeof token.role === "string" ? token.role : undefined
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
