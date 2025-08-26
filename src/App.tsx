'use client'

// This is a compatibility layer for environments that expect App.tsx
// In a proper Next.js setup, this file wouldn't be needed
import React from 'react';
import { LegalLoadingSpinner } from './components/LegalLoadingSpinner';

export default function App() {
  React.useEffect(() => {
    // Redirect to Next.js app router
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LegalLoadingSpinner 
        message="Redirecting to Legal Assistant..." 
        size="lg"
      />
    </div>
  );
}