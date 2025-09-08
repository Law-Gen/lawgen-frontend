"use client";

import type React from "react";

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
import {
  Moon,
  Sun,
  ChevronLeft,
  Play,
  RotateCcw,
  Trophy,
  Target,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Star,
  PlayCircle,
  CircleHelp,
  ListChecks,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
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

// --- Quiz Category Icon Helper ---
// Use quiz/question related icons only
const getQuizCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("general")) return CircleHelp;
  if (name.includes("knowledge")) return BookOpen;
  if (name.includes("logic") || name.includes("reasoning")) return Lightbulb;
  if (name.includes("star") || name.includes("top")) return Star;
  if (name.includes("list")) return ListChecks;
  return CircleHelp; // Default: quiz/question icon
};

// --- Enhanced Bouncing Dots Loader Component ---
const BouncingDotsLoader = () => (
  <div className="flex justify-center items-center h-screen gradient-bg">
    <div className="flex space-x-3">
      <div
        className="h-4 w-4 bg-primary rounded-full animate-bounce shadow-lg"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="h-4 w-4 bg-secondary rounded-full animate-bounce shadow-lg"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="h-4 w-4 bg-accent rounded-full animate-bounce shadow-lg"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  </div>
);

// --- Main Component ---
export default function QuizPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
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
  const [resumeAvailable, setResumeAvailable] = useState(false);

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
          try {
            const saved = localStorage.getItem("quizState");
            if (saved) setResumeAvailable(true);
          } catch {}
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
    try {
      localStorage.setItem(
        "quizState",
        JSON.stringify({
          selectedCategory: selectedCategory
            ? { id: selectedCategory.id, name: selectedCategory.name }
            : null,
          questions,
          currentQuestionIndex: 0,
          score: 0,
          viewState: "active",
        })
      );
    } catch {}
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    const correct = answer === activeQuizQuestions[currentQuestionIndex].answer;
    if (correct) setScore((prev) => prev + 1);
    try {
      const raw = localStorage.getItem("quizState");
      const saved = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "quizState",
        JSON.stringify({
          ...saved,
          currentQuestionIndex,
          score: correct ? (saved?.score || 0) + 1 : saved?.score || 0,
        })
      );
    } catch {}
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuizQuestions.length - 1) {
      const next = currentQuestionIndex + 1;
      setCurrentQuestionIndex(next);
      setSelectedAnswer(null);
      setIsAnswered(false);
      try {
        const raw = localStorage.getItem("quizState");
        const saved = raw ? JSON.parse(raw) : {};
        localStorage.setItem(
          "quizState",
          JSON.stringify({ ...saved, currentQuestionIndex: next })
        );
      } catch {}
    } else {
      setViewState("finished");
      try {
        const raw = localStorage.getItem("quizState");
        const saved = raw ? JSON.parse(raw) : {};
        localStorage.setItem(
          "quizState",
          JSON.stringify({ ...saved, viewState: "finished" })
        );
      } catch {}
    }
  };

  const handleGoToCategories = () => {
    setViewState("categories");
    setSelectedCategory(null);
    setQuizzesForCategory([]);
    setActiveQuizQuestions([]);
    try {
      localStorage.removeItem("quizState");
      setResumeAvailable(false);
    } catch {}
  };

  const PageLayout = ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <div className="min-h-screen gradient-bg overflow-x-hidden">
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity ${
          sidebarOpen ? "block md:hidden" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[101] h-full w-72 bg-card/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden border-l border-border`}
      >
        <div className="flex flex-col h-full p-6 gap-6">
          <div className="flex items-center justify-between mb-6">
            <span className="heading-secondary">{t("menu")}</span>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="text-2xl hover:text-primary transition-colors p-1"
            >
              &times;
            </button>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            <span className="body-small font-medium">
              {theme === "dark" ? t("dark_mode") : t("light_mode")}
            </span>
          </button>
          <LanguageToggle />
          {!session && (
            <Link href="/auth/signin" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="w-full hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                {t("sign_in")}
              </Button>
            </Link>
          )}
        </div>
      </aside>

      <header className="bg-card/90 backdrop-blur-md border-b border-border/50 p-4 sticky top-0 z-50 shadow-sm">
        <div className="w-full flex items-center px-2 gap-4">
          <div className="flex-shrink-0">
            <img
              src="/logo (1).svg"
              alt="LawGen Logo"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover border-2 border-primary/20 shadow-md"
            />
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <h1 className="heading-secondary truncate">{title}</h1>
            <p className="body-small truncate">{t("test_legal_knowledge")}</p>
          </div>
          <div className="md:hidden" style={{ marginLeft: "4px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
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
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
            <LanguageToggle />
            {!session && (
              <Link href="/auth/signin">
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  {t("sign_in")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto p-6">{children}</main>
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
      <div className="flex flex-col justify-center items-center h-screen text-lg text-destructive gradient-bg">
        <div className="text-center p-8 bg-card rounded-2xl shadow-xl border border-border max-w-md">
          <p className="heading-secondary mb-4">
            {t("error")}: {error}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            {t("try_again")}
          </Button>
        </div>
      </div>
    );
  }

  switch (viewState) {
    case "active":
      const currentQuestion = activeQuizQuestions[currentQuestionIndex];
      const progress =
        ((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100;
      return (
        <PageLayout title={selectedCategory?.name || t("quiz")}>
          <MotionWrapper
            animation="fadeInUp"
            className="w-full max-w-3xl mx-auto"
          >
            <Card className="gradient-card border-border/50 shadow-xl">
              <CardHeader className="p-8">
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                  <span className="body-small font-medium">
                    {t("question")} {currentQuestionIndex + 1} {t("of")}{" "}
                    {activeQuizQuestions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="body-small font-medium">
                      {t("score")}: {score}
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="w-full my-4 h-2" />
                <CardTitle className="heading-primary text-center leading-relaxed pt-4">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4 p-8 pt-0">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = option === currentQuestion.answer;
                  const isSelected = option === selectedAnswer;
                  let buttonVariant:
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline" = "outline";
                  let buttonClass =
                    "justify-start p-6 text-base h-auto whitespace-normal transition-all duration-200 ";

                  if (isAnswered) {
                    if (isCorrect) {
                      buttonVariant = "default";
                      buttonClass +=
                        "bg-primary text-primary-foreground border-primary";
                    } else if (isSelected && !isCorrect) {
                      buttonVariant = "destructive";
                    }
                  } else if (isSelected) {
                    buttonClass += "border-primary bg-primary/5";
                  }

                  return (
                    <Button
                      key={option}
                      variant={buttonVariant}
                      className={buttonClass}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isAnswered}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </span>
                    </Button>
                  );
                })}
                {isAnswered && (
                  <Button
                    onClick={handleNextQuestion}
                    className="mt-6 w-full bg-primary hover:bg-accent"
                    size="lg"
                  >
                    {currentQuestionIndex < activeQuizQuestions.length - 1
                      ? t("next_question")
                      : t("finish_quiz")}
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
      const percentage = Math.round((score / activeQuizQuestions.length) * 100);

      return (
        <PageLayout title={t("quiz_results")}>
          <MotionWrapper
            animation="fadeInUp"
            className="w-full max-w-lg mx-auto text-center"
          >
            <Card className="gradient-card border-border/50 shadow-xl">
              <CardHeader className="p-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="heading-primary mb-2">
                  {t("quiz_complete")}
                </CardTitle>
                <p className="body-large">
                  {t("congratulations_on_finishing")}
                </p>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                <div className="text-center">
                  <p className="body-large mb-2">{t("your_final_score")}:</p>
                  <div className="text-6xl font-bold text-primary mb-2">
                    {score}
                    <span className="text-3xl text-muted-foreground">
                      /{activeQuizQuestions.length}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-accent">
                    {percentage}%
                  </p>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  {originalQuiz && (
                    <Button
                      onClick={() => handleStartQuiz(originalQuiz)}
                      className="w-full bg-primary hover:bg-accent"
                      size="lg"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t("try_again")}
                    </Button>
                  )}
                  <Button
                    onClick={handleGoToCategories}
                    variant="outline"
                    className="w-full bg-transparent hover:bg-accent hover:text-accent-foreground"
                    size="lg"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {t("back_to_quizzes")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionWrapper>
        </PageLayout>
      );

    case "quizzes":
      return (
        <PageLayout title={selectedCategory?.name || t("quizzes")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoToCategories}
            className="mb-6 group transition-all duration-200 bg-transparent hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            {t("back_to_quizzes")}
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzesForCategory.map((quiz, index) => {
              const IconComponent = getQuizCategoryIcon(quiz.name);
              return (
                <MotionWrapper
                  key={quiz.id}
                  animation="staggerIn"
                  delay={index * 100}
                >
                  <Card
                    className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer h-full bg-card/90 backdrop-blur-sm border-border/50 hover:border-accent/30"
                    onClick={() => handleStartQuiz(quiz)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="relative z-10 text-center pb-4">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors duration-300 text-balance">
                        {quiz.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed text-pretty">
                        {quiz.description}
                      </p>
                    </CardHeader>
                    <CardContent className="relative z-10 text-center pt-0 pb-6">
                      <Button
                        className="w-full group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg bg-primary hover:bg-accent text-primary-foreground font-medium"
                        size="lg"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {t("start_quiz")}
                          <Play className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        </span>
                      </Button>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </CardContent>
                  </Card>
                </MotionWrapper>
              );
            })}
          </div>
        </PageLayout>
      );

    default:
      return (
        <PageLayout title={t("quiz_categories")}>
          {resumeAvailable && (
            <div className="mb-8 p-6 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="body-small font-medium text-accent-foreground mb-1">
                  {t("resume_quiz")}
                </p>
                <p className="body-small text-muted-foreground">
                  {t("unfinished_quiz_waiting")}
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  try {
                    const raw = localStorage.getItem("quizState");
                    if (!raw) return;
                    const saved = JSON.parse(raw);
                    if (saved?.questions?.length) {
                      setActiveQuizQuestions(saved.questions);
                      setCurrentQuestionIndex(saved.currentQuestionIndex || 0);
                      setScore(saved.score || 0);
                      setViewState(saved.viewState || "active");
                    }
                  } catch {}
                }}
                className="bg-accent hover:bg-accent/90"
              >
                {t("resume")}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizCategories.map((category, index) => {
              const IconComponent = getQuizCategoryIcon(category.name);

              return (
                <MotionWrapper
                  key={category.id}
                  animation="staggerIn"
                  delay={index * 100}
                >
                  <Card
                    className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer h-full bg-card/90 backdrop-blur-sm border-border/50 hover:border-accent/30"
                    onClick={() => handleSelectCategory(category)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="relative z-10 text-center pb-4">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors duration-300 text-balance">
                        {category.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed text-pretty">
                        {category.description}
                      </p>
                    </CardHeader>
                    <CardContent className="relative z-10 text-center pt-0 pb-6">
                      <Button
                        className="w-full group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg bg-primary hover:bg-accent text-primary-foreground font-medium"
                        size="lg"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {t("explore_quizzes")}
                          <Play className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        </span>
                      </Button>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </CardContent>
                  </Card>
                </MotionWrapper>
              );
            })}
          </div>
        </PageLayout>
      );
  }
}
