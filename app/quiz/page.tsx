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

interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  quizCount: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  quizzes: Quiz[];
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

const mockQuizCategories: QuizCategory[] = [
  {
    id: "1",
    name: "Employment Law",
    description: "Test your knowledge of workplace rights and responsibilities",
    icon: "💼",
    quizCount: 3,
    difficulty: "beginner",
    quizzes: [
      {
        id: "employment-basics",
        question:
          "What is the standard working week in Ethiopia according to labor law?",
        options: ["40 hours", "44 hours", "48 hours", "50 hours"],
        answer: "48 hours",
        difficulty: "beginner",
      },
      {
        id: "termination-notice",
        question:
          "How much notice must an employer give before terminating an employee without cause?",
        options: ["1 week", "2 weeks", "1 month", "3 months"],
        answer: "1 month",
        difficulty: "beginner",
      },
      {
        id: "minimum-age",
        question: "What is the minimum age for employment in Ethiopia?",
        options: ["14 years", "16 years", "18 years", "21 years"],
        answer: "14 years",
        difficulty: "beginner",
      },
    ],
  },
  {
    id: "2",
    name: "Family Law",
    description: "Quiz on marriage, divorce, and family legal matters",
    icon: "👨‍👩‍👧‍👦",
    quizCount: 4,
    difficulty: "intermediate",
    quizzes: [
      {
        id: "divorce-grounds",
        question: "What is not a ground for divorce in Ethiopia?",
        options: ["Adultery", "Desertion", "Imprisonment", "Incompatibility"],
        answer: "Incompatibility",
        difficulty: "intermediate",
      },
      {
        id: "child-custody",
        question:
          "In case of divorce, which factor is not considered for child custody?",
        options: [
          "Child's preference",
          "Parental income",
          "Parental relationship",
          "Child's education",
        ],
        answer: "Parental income",
        difficulty: "intermediate",
      },
      {
        id: "marriage-age",
        question: "What is the legal age for marriage in Ethiopia?",
        options: ["16", "18", "21", "25"],
        answer: "18",
        difficulty: "intermediate",
      },
      {
        id: "dowry",
        question:
          "What is the maximum amount of bride price (dowry) in Ethiopia?",
        options: ["10 cows", "20 cows", "50 cows", "No limit"],
        answer: "No limit",
        difficulty: "intermediate",
      },
    ],
  },
  {
    id: "3",
    name: "Property Law",
    description: "Test your understanding of property rights and real estate",
    icon: "🏠",
    quizCount: 2,
    difficulty: "intermediate",
    quizzes: [
      {
        id: "property-transfer",
        question:
          "What is required for the valid transfer of immovable property in Ethiopia?",
        options: [
          "Verbal agreement",
          "Written contract",
          "Notarization",
          "All of the above",
        ],
        answer: "Written contract",
        difficulty: "intermediate",
      },
      {
        id: "lease-agreement",
        question:
          "Which of the following is not essential for a lease agreement to be valid?",
        options: [
          "Offer and acceptance",
          "Consideration",
          "Capacity to contract",
          "Registration",
        ],
        answer: "Registration",
        difficulty: "intermediate",
      },
    ],
  },
  {
    id: "4",
    name: "Business Law",
    description: "Quiz on business registration and commercial law",
    icon: "🏢",
    quizCount: 2,
    difficulty: "advanced",
    quizzes: [
      {
        id: "company-formation",
        question:
          "What is the minimum number of shareholders required to form a private limited company in Ethiopia?",
        options: ["1", "2", "3", "5"],
        answer: "2",
        difficulty: "advanced",
      },
      {
        id: "trade-mark",
        question: "What is the duration of trademark registration in Ethiopia?",
        options: ["10 years", "7 years", "5 years", "Indefinitely"],
        answer: "7 years",
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

export default function QuizPage() {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Quiz Selection View (Category selected)
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
                Legal Quiz
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                Test your legal knowledge by category
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
            ← Back to Quizzes
          </Button>
        </div>

        <div className="container mx-auto p-4 min-h-[100vh]">
          <MotionWrapper animation="fadeInUp">
            {selectedCategory.quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="mb-6 hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-primary">
                        {quiz.question}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">
                        {quiz.options.join(", ")}
                      </p>
                    </div>
                    <Badge
                      className={difficultyColors[quiz.difficulty]}
                      variant="secondary"
                    >
                      {quiz.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => {
                      // Handle quiz start
                    }}
                    className="w-full hover:scale-105 transition-transform"
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </MotionWrapper>
        </div>

        {session && (
          <div className="md:hidden">
            <BottomNavigation />
          </div>
        )}
      </div>
    );
  }

  // Main Categories View
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
              Legal Quiz
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Test your legal knowledge by category
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

      <div className="container min-h-[100vh] mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {mockQuizCategories.map((category, index) => (
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
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary">
                      {category.quizCount} quizzes
                    </Badge>
                    <Badge
                      className={difficultyColors[category.difficulty]}
                      variant="secondary"
                    >
                      {category.difficulty}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ⏱️ {category.quizzes[0].options.length} questions
                  </div>
                  <Button className="w-full hover:scale-105 transition-transform">
                    Take Quiz
                  </Button>
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </div>

        {/* Call to Action */}
        <MotionWrapper animation="fadeInUp">
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-4 md:p-6 text-center space-y-2 md:space-y-4">
              <h3 className="text-xl font-semibold text-primary mb-2">
                Need Personalized Legal Guidance?
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our AI assistant can provide tailored legal advice based on your
                specific situation.
              </p>
              <Link href="/chat">
                <Button className="hover:scale-105 transition-transform mt-2">
                  Chat with AI Assistant
                </Button>
              </Link>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>

      {session && (
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}
