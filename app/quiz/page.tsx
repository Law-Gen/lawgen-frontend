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
import { Progress } from "@/components/ui/progress";

// --- Interfaces for the component's state and props ---
interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  quizCount: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// --- Interfaces for the raw API response data ---
interface ApiQuizInfo {
  id: string;
  name: string;
  description: string;
}

interface ApiQuizQuestion {
  id: string;
  text: string;
  options: Record<string, string>;
  correct_option: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

interface ApiQuizDetail extends ApiQuizInfo {
  questions: ApiQuizQuestion[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

// --- NEW: Bouncing Dots Loader Component ---
const BouncingDotsLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <style>
      {`
        @keyframes bounce {
          0%, 75%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-10px);
          }
        }
        .bounce-dot {
          animation: bounce 1.2s infinite;
        }
      `}
    </style>
    <div className="flex space-x-2">
      <div
        className="bounce-dot h-3 w-3 bg-primary rounded-full"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="bounce-dot h-3 w-3 bg-primary rounded-full"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="bounce-dot h-3 w-3 bg-primary rounded-full"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  </div>
);

// --- Main Component ---
export default function QuizPage() {
  const { data: session, status } = useSession();
  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/auth/signin";
    }
  }, [status]);
  const { theme, setTheme } = useTheme();

  // --- General State ---
  const [quizCategories, setQuizCategories] = useState<QuizCategory[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Quiz Flow State ---
  const [viewState, setViewState] = useState<
    "categories" | "quizzes" | "active" | "finished"
  >("categories");
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(
    null
  );
  const [quizzesForCategory, setQuizzesForCategory] = useState<ApiQuizDetail[]>(
    []
  );

  // --- Active Quiz Session State ---
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<
    QuizQuestion[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const API_BASE_URL = process.env.NEXT_PUBLIC_QUIZ_BASE_URL;

  useEffect(() => {
    if (status === "unauthenticated") window.location.href = "/auth/signin";
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && API_BASE_URL) {
      const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`${API_BASE_URL}/quizzes/categories`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            } as HeadersInit,
          });
          if (!response.ok)
            throw new Error(
              `Failed to fetch categories: ${response.statusText}`
            );
          const data = await response.json();
          setQuizCategories(data.items || []);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategories();
    }
  }, [status, session, API_BASE_URL]);

  const handleSelectCategory = async (category: QuizCategory) => {
    setSelectedCategory(category);
    setIsLoading(true);
    setError(null);
    try {
      if (!session || !session.accessToken) {
        throw new Error("Session is not available. Please sign in again.");
      }
      const quizzesRes = await fetch(
        `${API_BASE_URL}/quizzes/categories/${category.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          } as HeadersInit,
        }
      );
      if (!quizzesRes.ok)
        throw new Error("Failed to fetch quizzes for the category.");

      const quizzesData = await quizzesRes.json();
      const quizInfos: ApiQuizInfo[] = quizzesData.items || [];

      const quizDetailPromises = quizInfos.map((info) =>
        fetch(`${API_BASE_URL}/quizzes/${info.id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          } as HeadersInit,
        }).then((res) => res.json())
      );

      const detailedQuizzes: ApiQuizDetail[] = await Promise.all(
        quizDetailPromises
      );
      setQuizzesForCategory(detailedQuizzes);
      setViewState("quizzes");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = (quiz: ApiQuizDetail) => {
    const questions: QuizQuestion[] = quiz.questions.map((q) => ({
      id: q.id,
      question: q.text,
      options: Object.values(q.options),
      answer: q.options[q.correct_option],
      difficulty:
        q.difficulty || quiz.difficulty || selectedCategory!.difficulty,
    }));
    setActiveQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setViewState("active");
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === activeQuizQuestions[currentQuestionIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setViewState("finished");
    }
  };

  const handleGoToCategories = () => {
    setViewState("categories");
    setSelectedCategory(null);
    setQuizzesForCategory([]);
    setActiveQuizQuestions([]);
  };

  const PageLayout = ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 overflow-x-hidden">
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
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="w-full flex items-center px-2 gap-4">
          <div className="flex-shrink-0">
            <img
              src="/logo (1).svg"
              alt="LawGen Logo"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover border border-muted shadow"
            />
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-primary truncate">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Test your legal knowledge
            </p>
          </div>
          <div className="md:hidden" style={{ marginLeft: "4px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-0 bg-transparent border-none"
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
          <div className="hidden md:flex flex-1 justify-center">
            <MainNavigation />
          </div>
          <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-1 rounded border"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {" "}
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <LanguageToggle />
            {!session && (
              <Link href="/auth/signin">
                <Button size="sm" variant="outline">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
      {session && (
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );

  if (status === "loading" || isLoading) {
    return <BouncingDotsLoader />;
  }
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-lg text-red-500">
        <p>Error: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  // --- RENDER LOGIC using a switch for clarity ---
  switch (viewState) {
    case "active":
      const currentQuestion = activeQuizQuestions[currentQuestionIndex];
      const progress =
        ((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100;
      return (
        <PageLayout title={selectedCategory?.name || "Quiz"}>
          <MotionWrapper
            animation="fadeInUp"
            className="w-full max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    Question {currentQuestionIndex + 1} of{" "}
                    {activeQuizQuestions.length}
                  </span>
                  <span>Score: {score}</span>
                </div>
                <Progress value={progress} className="w-full my-2" />
                <CardTitle className="text-xl md:text-2xl text-center leading-relaxed pt-4">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-3">
                {currentQuestion.options.map((option) => {
                  const isCorrect = option === currentQuestion.answer;
                  const isSelected = option === selectedAnswer;
                  let buttonVariant:
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline" = "outline";
                  if (isAnswered) {
                    if (isCorrect) buttonVariant = "default";
                    else if (isSelected && !isCorrect)
                      buttonVariant = "destructive";
                  }
                  return (
                    <Button
                      key={option}
                      variant={buttonVariant}
                      className={`justify-start p-6 text-base h-auto whitespace-normal ${
                        isSelected && !isAnswered ? "border-primary" : ""
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isAnswered}
                    >
                      {option}
                    </Button>
                  );
                })}
                {isAnswered && (
                  <Button
                    onClick={handleNextQuestion}
                    className="mt-4 w-full"
                    size="lg"
                  >
                    {currentQuestionIndex < activeQuizQuestions.length - 1
                      ? "Next Question"
                      : "Finish Quiz"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </MotionWrapper>
        </PageLayout>
      );

    case "finished":
      const originalQuiz = quizzesForCategory.find((q) =>
        q.questions.some((aq) => aq.id === activeQuizQuestions[0].id)
      );
      return (
        <PageLayout title="Quiz Results">
          <MotionWrapper
            animation="fadeInUp"
            className="w-full max-w-md mx-auto text-center"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xl text-muted-foreground">
                  Your Final Score:
                </p>
                <p className="text-5xl font-bold text-primary">
                  {score} / {activeQuizQuestions.length}
                </p>
                <div className="flex flex-col gap-4 pt-4">
                  {originalQuiz && (
                    <Button
                      onClick={() => handleStartQuiz(originalQuiz)}
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  )}
                  <Button
                    onClick={handleGoToCategories}
                    variant="outline"
                    className="w-full"
                  >
                    All Categories
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionWrapper>
        </PageLayout>
      );

    case "quizzes":
      return (
        <PageLayout title={selectedCategory?.name || "Quizzes"}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoToCategories}
            className="mb-4"
          >
            ← Back to Categories
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {quizzesForCategory.map((quiz, index) => (
              <MotionWrapper
                key={quiz.id}
                animation="staggerIn"
                delay={index * 100}
              >
                <Card className="flex flex-col justify-between h-full">
                  <CardHeader>
                    <CardTitle>{quiz.name}</CardTitle>
                    <p className="text-sm text-muted-foreground pt-2">
                      {quiz.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full"
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </PageLayout>
      );

    default: // "categories" view
      return (
        <PageLayout title="Quiz Categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {quizCategories.map((category, index) => (
              <MotionWrapper
                key={category.id}
                animation="staggerIn"
                delay={index * 100}
              >
                <Card
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                  onClick={() => handleSelectCategory(category)}
                >
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{category.icon || "📚"}</div>
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
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </PageLayout>
      );
  }
}
