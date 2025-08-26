import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Legal Assistant - Professional Legal Information Platform',
  description: 'Access professional legal information, chat with AI assistance, and connect with legal aid resources in English and Amharic.',
  keywords: ['legal assistance', 'law', 'legal aid', 'attorney', 'legal advice'],
  authors: [{ name: 'Legal Assistant Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8b5a3c',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <Providers>
          <main className="relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}