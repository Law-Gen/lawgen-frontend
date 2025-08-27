"use client"

import type React from "react"

import { useState } from "react"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement actual password reset
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
        <MotionWrapper animation="scaleIn">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <MotionWrapper animation="fadeInUp">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-accent-foreground">✉️</span>
                </div>
              </MotionWrapper>
              <MotionWrapper animation="fadeInUp" delay={100}>
                <CardTitle className="text-2xl text-primary">Check Your Email</CardTitle>
              </MotionWrapper>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <MotionWrapper animation="fadeInUp" delay={200}>
                <p className="text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </MotionWrapper>
              <MotionWrapper animation="fadeInUp" delay={300}>
                <Link href="/auth/signin">
                  <Button className="w-full hover:scale-105 transition-transform">Back to Sign In</Button>
                </Link>
              </MotionWrapper>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <MotionWrapper animation="scaleIn">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <MotionWrapper animation="fadeInUp">
              <Link href="/" className="inline-block">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform">
                  <span className="text-2xl text-primary-foreground">⚖️</span>
                </div>
              </Link>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={100}>
              <CardTitle className="text-2xl text-primary">Reset Password</CardTitle>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={200}>
              <p className="text-muted-foreground">Enter your email to receive a reset link</p>
            </MotionWrapper>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <MotionWrapper animation="fadeInUp" delay={300}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
              </MotionWrapper>

              <MotionWrapper animation="fadeInUp" delay={400}>
                <Button type="submit" className="w-full hover:scale-105 transition-transform" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </MotionWrapper>

              <MotionWrapper animation="fadeInUp" delay={500}>
                <div className="text-center">
                  <Link href="/auth/signin" className="text-sm text-primary hover:underline transition-colors">
                    Back to Sign In
                  </Link>
                </div>
              </MotionWrapper>
            </form>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  )
}
