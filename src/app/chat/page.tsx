'use client'

import { useSession } from 'next-auth/react'
import ChatInterface from '../../components/ChatInterface'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // If loading, show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <ChatInterface isLoggedIn={!!session} />
}