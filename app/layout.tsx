import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { SessionProvider } from "./providers/session-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "LegalAid - Legal Information & Assistance Platform",
  description:
    "Get instant legal guidance, connect with professionals, and access comprehensive legal resources in English and Amharic.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
