'use client'

import React, { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Separator } from '../../../components/ui/separator'
import { LegalLoadingSpinner } from '../../../components/LegalLoadingSpinner'
import { toast } from 'sonner@2.0.3'
import { Scale, Github, Mail, Eye, EyeOff } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    // Check if user is already authenticated
    getSession().then(session => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [router, callbackUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid credentials. Please try again.')
      } else {
        toast.success('Successfully signed in!')
        router.push(callbackUrl)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}`)
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-brown-light flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-3xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4"
            >
              <Scale className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="gradient-text">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your legal assistance platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LegalLoadingSpinner size="sm" message="" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => router.push('/auth/forgot-password')}
                disabled={isLoading}
              >
                Forgot your password?
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('github')}
                disabled={isLoading}
                className="w-full"
              >
                <Github className="w-4 h-4 mr-2" />
                Continue with GitHub
              </Button>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  onClick={() => router.push('/auth/signup')}
                  disabled={isLoading}
                  className="p-0"
                >
                  Sign up
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}