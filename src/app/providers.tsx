'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { LanguageProvider } from '../components/LanguageContext'
import { Toaster } from '../components/ui/sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
    >
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
        <Toaster 
          position="top-right"
          richColors
          closeButton
        />
      </LanguageProvider>
    </SessionProvider>
  )
}