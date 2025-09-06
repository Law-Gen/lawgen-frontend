"use client";

import { useState, useEffect } from "react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MainNavigation } from "@/components/ui/main-navigation";
import { useTheme } from "next-themes";

interface LegalCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  topicCount: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  topics: LegalTopic[];
}

interface LegalTopic {
  id: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: "beginner" | "intermediate" | "advanced";
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
        description:
          "Learn about key terms and conditions in employment agreements",
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
        description:
          "Understanding protection against unfair treatment at work",
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
];

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  // Require sign-in for categories
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/auth/signin";
    }
  }, [status]);
  if (status === "loading") {
    return <div className="flex justify-center items-center h-64 text-lg">Loading...</div>;
  }
  const [selectedCategory, setSelectedCategory] =
    useState<LegalCategory | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  // Legal categories are public, no signin required

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 overflow-x-hidden">
        {/* Mobile Sidebar (RIGHT SIDE) */}
        <div
          className={`fixed inset-0 z-[100] bg-black/40 transition-opacity ${
            sidebarOpen ? "block md:hidden" : "hidden"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          className={`fixed top-0 right-0 z-[101] h-full w-64 bg-card dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col h-full p-6 gap-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-primary">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="text-2xl"
              >
                &times;
              </button>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-1 rounded border w-full flex items-center gap-2"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <LanguageToggle />
            {!session && (
              <Link href="/auth/signin" className="w-full">
                <Button size="lg" variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </aside>

        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
          <div className="w-full flex items-center px-2 gap-4">
            {/* Left: Title and description */}
            <div className="flex flex-col items-start min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-primary truncate">
                Legal Categories
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                Explore legal topics by category
              </p>
            </div>
            {/* Hamburger icon for mobile */}
            <div className="md:hidden" style={{ marginLeft: "4px" }}>
              <button
                className="p-0 bg-transparent border-none shadow-none outline-none focus:outline-none"
                style={{ lineHeight: 0 }}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6h12M4 10h12M4 14h12" />
                </svg>
              </button>
            </div>
            {/* Center: Main navigation (desktop only) */}
            <div className="hidden md:flex flex-1 justify-center">
              <MainNavigation />
            </div>
            {/* Right: Language toggle, dark mode, and sign in (desktop only) */}
            <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="px-2 py-1 rounded border"
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
              <LanguageToggle />
              {!session && (
                <Link href="/auth/signin">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="hover:scale-105 transition-transform"
          >
            ← Back to Categories
          </Button>
        </div>

        <div className="container mx-auto p-4">
          <div className="grid gap-4">
            {selectedCategory.topics.map((topic, index) => (
              <MotionWrapper
                key={topic.id}
                animation="staggerIn"
                delay={index * 100}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                  <CardContent className="p-4 md:p-6 space-y-2">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-primary">
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={difficultyColors[topic.difficulty]}
                          variant="secondary"
                        >
                          {topic.difficulty}
                        </Badge>
                        <Badge variant="outline">{topic.readTime}</Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {topic.description}
                    </p>
                    <Button
                      size="sm"
                      className="hover:scale-105 transition-transform"
                    >
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </div>

        {session && (
          <div className="md:hidden">
            <BottomNavigation />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 overflow-x-hidden">
      {/* Mobile Sidebar (RIGHT SIDE) */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity ${
          sidebarOpen ? "block md:hidden" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[101] h-full w-64 bg-card dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6 gap-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-primary">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="text-2xl"
            >
              &times;
            </button>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-2 py-1 rounded border w-full flex items-center gap-2"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <LanguageToggle />
          {!session && (
            <Link href="/auth/signin" className="w-full">
              <Button size="lg" variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </aside>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="w-full flex items-center px-2 gap-4">
          {/* Left: Title and description */}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-primary truncate">
              Legal Categories
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Explore legal topics by category
            </p>
          </div>
          {/* Hamburger icon for mobile */}
          <div className="md:hidden" style={{ marginLeft: "4px" }}>
            <button
              className="p-0 bg-transparent border-none shadow-none outline-none focus:outline-none"
              style={{ lineHeight: 0 }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h12M4 10h12M4 14h12" />
              </svg>
            </button>
          </div>
          {/* Center: Main navigation (desktop only) */}
          <div className="hidden md:flex flex-1 justify-center">
            <MainNavigation />
          </div>
          {/* Right: Language toggle, dark mode, and sign in (desktop only) */}
          <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-1 rounded border"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
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
      <div className="container mx-auto px-2 mt-4">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="hover:scale-105 transition-transform"
          >
            ← Back
          </Button>
        </Link>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {mockCategories.map((category, index) => (
            <MotionWrapper
              key={category.id}
              animation="staggerIn"
              delay={index * 100}
            >
              <Card
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                onClick={() => setSelectedCategory(category)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <CardTitle className="text-primary">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2 md:space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">
                      {category.topicCount} topics
                    </Badge>
                    <Badge
                      className={difficultyColors[category.difficulty]}
                      variant="secondary"
                    >
                      {category.difficulty}
                    </Badge>
                  </div>
                  <Button className="w-full hover:scale-105 transition-transform mt-2">
                    Explore Topics
                  </Button>
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      </div>

      {session && (
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}
