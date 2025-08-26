'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { LegalLoadingSpinner } from './LegalLoadingSpinner'
import { 
  Scale, 
  MessageCircle, 
  BookOpen, 
  Users, 
  Shield, 
  Star,
  ChevronRight,
  Globe,
  Phone,
  Mail
} from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'AI Legal Chat',
    description: 'Get instant legal guidance from our AI assistant trained on legal expertise.',
    color: 'text-primary'
  },
  {
    icon: BookOpen,
    title: 'Legal Resources',
    description: 'Access comprehensive legal information organized by categories and topics.',
    color: 'text-accent-foreground'
  },
  {
    icon: Users,
    title: 'Legal Aid Directory',
    description: 'Find qualified legal professionals and aid organizations in your area.',
    color: 'text-secondary-foreground'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your legal consultations are protected with enterprise-grade security.',
    color: 'text-muted-foreground'
  }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    content: 'This platform helped me understand my business legal requirements clearly.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Individual User',
    content: 'The AI chat feature provided quick answers to my legal questions.',
    rating: 5
  },
  {
    name: 'Maria Rodriguez',
    role: 'Legal Student',
    content: 'Great resource for learning and understanding legal concepts.',
    rating: 5
  }
]

export function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = async () => {
    setIsLoading(true)
    
    if (session) {
      router.push('/chat')
    } else {
      router.push('/auth/signin')
    }
    
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleGuestChat = () => {
    router.push('/chat/guest')
  }

  if (isLoading) {
    return <LegalLoadingSpinner message="Redirecting..." size="lg" className="min-h-screen flex items-center justify-center" />
  }

  return (
    <div className="min-h-screen bg-gradient-brown-light">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">Legal Assistant</span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => router.push('/categories')}>
              Categories
            </Button>
            <Button variant="ghost" onClick={handleGuestChat}>
              Try Chat
            </Button>
            {session ? (
              <Button onClick={() => router.push('/profile')}>
                Profile
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => router.push('/auth/signin')}>
                  Sign In
                </Button>
                <Button onClick={() => router.push('/auth/signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Badge variant="secondary" className="mb-4">
            <Globe className="w-4 h-4 mr-1" />
            Available in English & Amharic
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Professional <span className="gradient-text">Legal Assistance</span> at Your Fingertips
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access expert legal guidance, connect with qualified professionals, and navigate complex legal matters with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="btn-glow group"
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleGuestChat}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Try Guest Chat
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive legal assistance platform combines AI technology with professional expertise to provide you with the support you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-card/50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Trusted by Legal Professionals</h2>
            <p className="text-muted-foreground">
              See what our users say about their experience with our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of users who trust our platform for their legal needs. Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Start Free Consultation
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/categories')}>
              Explore Categories
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scale className="w-6 h-6 text-primary" />
              <span className="font-bold">Legal Assistant</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>support@legalassistant.com</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Legal Assistant. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage