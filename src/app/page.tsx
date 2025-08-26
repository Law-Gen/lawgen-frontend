'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { LegalLoadingOverlay } from '../components/LegalLoadingSpinner'

// Dynamically import the LandingPage to avoid SSR issues
const LandingPage = dynamic(() => import('../components/LandingPage').then(mod => mod.LandingPage), {
  loading: () => <LegalLoadingOverlay isVisible={true} message="Loading Legal Assistant..." />,
  ssr: false
})

export default function HomePage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Show loading while NextAuth is initializing or app is loading
  if (status === 'loading' || isLoading) {
    return (
      <LegalLoadingOverlay 
        isVisible={true}
        message="Initializing Legal Assistant Platform..."
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingPage />
    </div>
  )
}