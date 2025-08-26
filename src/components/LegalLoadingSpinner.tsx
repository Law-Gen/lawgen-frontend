'use client'

import React from 'react'
import { motion } from 'motion/react'

interface LegalLoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LegalLoadingSpinner({ 
  message = "Loading legal assistance...", 
  size = 'md',
  className = '' 
}: LegalLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const scaleClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Gavel Animation Container */}
      <div className="relative">
        {/* Gavel Base/Block */}
        <motion.div
          className={`${sizeClasses[size]} bg-primary rounded-sm relative`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1, 0.8],
            opacity: [0, 1, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Gavel Handle */}
          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 bg-primary"
            style={{ height: size === 'lg' ? '2rem' : size === 'md' ? '1.5rem' : '1rem' }}
            animate={{
              rotate: [0, -15, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Gavel Head */}
          <motion.div
            className={`absolute -top-1 left-1/2 transform -translate-x-1/2 bg-primary rounded-sm`}
            style={{ 
              width: size === 'lg' ? '1.5rem' : size === 'md' ? '1rem' : '0.75rem',
              height: size === 'lg' ? '0.5rem' : size === 'md' ? '0.375rem' : '0.25rem'
            }}
            animate={{
              rotate: [0, -15, 15, 0],
              y: [0, -2, 2, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Impact Ripples */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{
            scale: [1, 2, 3],
            opacity: [0.6, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full border border-primary"
          animate={{
            scale: [1, 1.5, 2.5],
            opacity: [0.4, 0.2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.3
          }}
        />
      </div>

      {/* Loading Message */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className={`text-muted-foreground ${scaleClasses[size]}`}>
          {message}
        </p>
        
        {/* Animated Dots */}
        <motion.div
          className="flex justify-center space-x-1 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1 h-1 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Justice Scales (Decorative) */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <svg
          width={size === 'lg' ? '40' : size === 'md' ? '32' : '24'}
          height={size === 'lg' ? '40' : size === 'md' ? '32' : '24'}
          viewBox="0 0 24 24"
          fill="none"
          className="text-primary"
        >
          <path
            d="M12 2V22M8 6L12 2L16 6M6 8C4.9 8 4 8.9 4 10V12C4 13.1 4.9 14 6 14H8C9.1 14 10 13.1 10 12V10C10 8.9 9.1 8 8 8H6ZM16 8C14.9 8 14 8.9 14 10V12C14 13.1 14.9 14 16 14H18C19.1 14 20 13.1 20 12V10C20 8.9 19.1 8 18 8H16Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  )
}

// Full-screen loading overlay
export function LegalLoadingOverlay({ 
  isVisible = true,
  message = "Preparing your legal assistance..."
}: {
  isVisible?: boolean
  message?: string
}) {
  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-card p-8 rounded-lg shadow-2xl border"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <LegalLoadingSpinner message={message} size="lg" />
      </motion.div>
    </motion.div>
  )
}