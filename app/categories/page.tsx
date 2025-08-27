"use client"

import { useState } from "react"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { BottomNavigation } from "@/components/ui/bottom-navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface LegalCategory {
  id: string
  name: string
  description: string
  icon: string
  topicCount: number
  difficulty: "beginner" | "intermediate" | "advanced"
  topics: LegalTopic[]
}

interface LegalTopic {
  id: string
  title: string
  description: string
  readTime: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

const mockCategories: LegalCategory[] = [
  {
    id: "1",
    name: "Employment Law",
    description: "Rights and responsibilities in the workplace",
    icon: "💼",
    topicCount: 12,
    difficulty: "beginner",
    topics: [
      {
        id: "1-1",
        title: "Understanding Your Employment Contract",
        description: "Learn about key terms and conditions in employment agreements",
        readTime: "5 min",
        difficulty: "beginner",
      },
      {
        id: "1-2",
        title: "Overtime Pay and Working Hours",
        description: "Know your rights regarding working time and compensation",
        readTime: "7 min",
        difficulty: "beginner",
      },
      {
        id: "1-3",
        title: "Workplace Discrimination and Harassment",
        description: "Understanding protection against unfair treatment at work",
        readTime: "10 min",
        difficulty: "intermediate",
      },
    ],
  },
  {
    id: "2",
    name: "Family Law",
    description: "Marriage, divorce, child custody, and family matters",
    icon: "👨‍👩‍👧‍👦",
    topicCount: 15,
    difficulty: "intermediate",
    topics: [
      {
        id: "2-1",
        title: "Marriage Laws in Ethiopia",
        description: "Legal requirements and procedures for marriage",
        readTime: "8 min",
        difficulty: "beginner",
      },
      {
        id: "2-2",
        title: "Divorce Procedures and Rights",
        description: "Understanding the divorce process and your rights",
        readTime: "12 min",
        difficulty: "intermediate",
      },
      {
        id: "2-3",
        title: "Child Custody and Support",
        description: "Legal aspects of child custody arrangements",
        readTime: "15 min",
        difficulty: "advanced",
      },
    ],
  },
  {
    id: "3",
    name: "Property Law",
    description: "Real estate, rental agreements, and property rights",
    icon: "🏠",
    topicCount: 10,
    difficulty: "intermediate",
    topics: [
      {
        id: "3-1",
        title: "Rental Agreements and Tenant Rights",
        description: "Understanding your rights and obligations as a tenant",
        readTime: "6 min",
        difficulty: "beginner",
      },
      {
        id: "3-2",
        title: "Property Ownership and Registration",
        description: "Legal procedures for property ownership in Ethiopia",
        readTime: "10 min",
        difficulty: "intermediate",
      },
    ],
  },
  {
    id: "4",
    name: "Business Law",
    description: "Starting and running a business legally",
    icon: "🏢",
    topicCount: 8,
    difficulty: "advanced",
    topics: [
      {
        id: "4-1",
        title: "Business Registration Process",
        description: "Step-by-step guide to registering your business",
        readTime: "12 min",
        difficulty: "intermediate",
      },
      {
        id: "4-2",
        title: "Contract Law for Businesses",
        description: "Essential contract principles for business owners",
        readTime: "15 min",
        difficulty: "advanced",
      },
    ],
  },
]

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export default function CategoriesPage() {
  const { data: session } = useSession()
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | null>(null)

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="hover:scale-105 transition-transform"
              >
                ← Back to Categories
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="text-2xl">{selectedCategory.icon}</span>
                  {selectedCategory.name}
                </h1>
                <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </header>

        <div className="container mx-auto p-4">
          <div className="grid gap-4">
            {selectedCategory.topics.map((topic, index) => (
              <MotionWrapper key={topic.id} animation="staggerIn" delay={index * 100}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-primary">{topic.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={difficultyColors[topic.difficulty]} variant="secondary">
                          {topic.difficulty}
                        </Badge>
                        <Badge variant="outline">{topic.readTime}</Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{topic.description}</p>
                    <Button size="sm" className="hover:scale-105 transition-transform">
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </div>

        {session && <BottomNavigation />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                ← Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-primary">Legal Categories</h1>
              <p className="text-sm text-muted-foreground">Explore legal topics by category</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            {!session && (
              <Link href="/auth/signin">
                <Button size="sm" variant="outline" className="bg-transparent">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((category, index) => (
            <MotionWrapper key={category.id} animation="staggerIn" delay={index * 100}>
              <Card
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                onClick={() => setSelectedCategory(category)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <CardTitle className="text-primary">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary">{category.topicCount} topics</Badge>
                    <Badge className={difficultyColors[category.difficulty]} variant="secondary">
                      {category.difficulty}
                    </Badge>
                  </div>
                  <Button className="w-full hover:scale-105 transition-transform">Explore Topics</Button>
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      </div>

      {session && <BottomNavigation />}
    </div>
  )
}
