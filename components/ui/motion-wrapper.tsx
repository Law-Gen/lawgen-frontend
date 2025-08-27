"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  delay?: number
  animation?: "fadeInUp" | "staggerIn" | "scaleIn"
}

export function MotionWrapper({ children, className, delay = 0, animation = "fadeInUp" }: MotionWrapperProps) {
  const animationClass = {
    fadeInUp: "animate-fade-in-up",
    staggerIn: "animate-stagger-in",
    scaleIn: "animate-scale-in",
  }[animation]

  return (
    <div className={cn(animationClass, className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
