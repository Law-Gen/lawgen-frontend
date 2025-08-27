"use client"

import { useState } from "react"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { BottomNavigation } from "@/components/ui/bottom-navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface QuizCategory {
  id: string
  name: string
  description: string
  icon: string
  quizCount: number
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
}

interface Quiz {
  id: string
  title: string
  description: string
  categoryId: string
  difficulty: "beginner" | "intermediate" | "advanced"
  questions: Question[]
  estimatedTime: string
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizResult {
  score: number
  totalQuestions: number
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[]
}

const mockQuizCategories: QuizCategory[] = [
  {
    id: "1",
    name: "Employment Law",
    description: "Test your knowledge of workplace rights and responsibilities",
    icon: "💼",
    quizCount: 3,
    difficulty: "beginner",
    estimatedTime: "10-15 min",
  },
  {
    id: "2",
    name: "Family Law",
    description: "Quiz on marriage, divorce, and family legal matters",
    icon: "👨‍👩‍👧‍👦",
    quizCount: 4,
    difficulty: "intermediate",
    estimatedTime: "15-20 min",
  },
  {
    id: "3",
    name: "Property Law",
    description: "Test your understanding of property rights and real estate",
    icon: "🏠",
    quizCount: 2,
    difficulty: "intermediate",
    estimatedTime: "12-18 min",
  },
  {
    id: "4",
    name: "Business Law",
    description: "Quiz on business registration and commercial law",
    icon: "🏢",
    quizCount: 2,
    difficulty: "advanced",
    estimatedTime: "20-25 min",
  },
]

const mockQuiz: Quiz = {
  id: "employment-basics",
  title: "Employment Law Basics",
  description: "Test your knowledge of fundamental employment rights in Ethiopia",
  categoryId: "1",
  difficulty: "beginner",
  estimatedTime: "10 min",
  questions: [
    {
      id: "q1",
      question: "What is the standard working week in Ethiopia according to labor law?",
      options: ["40 hours", "44 hours", "48 hours", "50 hours"],
      correctAnswer: 2,
      explanation:
        "According to Ethiopian labor law, the standard working week is 48 hours, typically spread over 6 days with 8 hours per day.",
    },
    {
      id: "q2",
      question: "How much notice must an employer give before terminating an employee without cause?",
      options: ["1 week", "2 weeks", "1 month", "3 months"],
      correctAnswer: 2,
      explanation:
        "Ethiopian labor law requires employers to give at least one month's notice before terminating an employee without cause, or payment in lieu of notice.",
    },
    {
      id: "q3",
      question: "What is the minimum age for employment in Ethiopia?",
      options: ["14 years", "16 years", "18 years", "21 years"],
      correctAnswer: 0,
      explanation:
        "The minimum age for employment in Ethiopia is 14 years, though there are restrictions on the type of work and hours for minors.",
    },
    {
      id: "q4",
      question: "Are employees entitled to overtime pay in Ethiopia?",
      options: ["No, never", "Yes, always", "Only for government employees", "Yes, for work beyond normal hours"],
      correctAnswer: 3,
      explanation:
        "Yes, employees in Ethiopia are entitled to overtime pay for work performed beyond normal working hours, typically at a rate of 1.5 times the regular wage.",
    },
    {
      id: "q5",
      question: "What is the minimum annual leave entitlement for employees?",
      options: ["10 days", "14 days", "21 days", "30 days"],
      correctAnswer: 1,
      explanation:
        "Ethiopian labor law provides for a minimum of 14 working days of annual leave for employees who have completed one year of service.",
    },
  ],
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export default function QuizPage() {
  const { data: session } = useSession()
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const handleStartQuiz = () => {
    setCurrentQuiz(mockQuiz)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizResult(null)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuiz) return

    const currentQuestion = currentQuiz.questions[currentQuestionIndex]
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (!currentQuiz) return

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // Calculate results
      const answers = currentQuiz.questions.map((question) => ({
        questionId: question.id,
        selectedAnswer: selectedAnswers[question.id] ?? -1,
        correct: selectedAnswers[question.id] === question.correctAnswer,
      }))

      const score = answers.filter((answer) => answer.correct).length

      setQuizResult({
        score,
        totalQuestions: currentQuiz.questions.length,
        answers,
      })
      setShowResults(true)
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizResult(null)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setCurrentQuiz(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizResult(null)
  }

  // Quiz Results View
  if (showResults && quizResult && currentQuiz) {
    const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToCategories}
                className="hover:scale-105 transition-transform"
              >
                ← Back to Quizzes
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-primary">Quiz Results</h1>
                <p className="text-sm text-muted-foreground">{currentQuiz.title}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </header>

        <div className="container mx-auto p-4 max-w-4xl">
          <MotionWrapper animation="fadeInUp">
            <Card className="mb-6">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">{percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"}</div>
                <CardTitle className="text-2xl text-primary">
                  {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Learning!"}
                </CardTitle>
                <p className="text-muted-foreground">
                  You scored {quizResult.score} out of {quizResult.totalQuestions} questions correctly
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
                  <Progress value={percentage} className="w-full max-w-md mx-auto" />
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleRetakeQuiz} variant="outline" className="bg-transparent">
                    Retake Quiz
                  </Button>
                  <Button onClick={handleBackToCategories}>Try Another Quiz</Button>
                </div>
              </CardContent>
            </Card>
          </MotionWrapper>

          {/* Detailed Results */}
          <div className="space-y-4">
            {currentQuiz.questions.map((question, index) => {
              const userAnswer = quizResult.answers.find((a) => a.questionId === question.id)
              const isCorrect = userAnswer?.correct ?? false

              return (
                <MotionWrapper key={question.id} animation="staggerIn" delay={index * 100}>
                  <Card className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            isCorrect ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary mb-2">{question.question}</h3>
                          <div className="space-y-2 mb-4">
                            {question.options.map((option, optionIndex) => {
                              const isUserAnswer = userAnswer?.selectedAnswer === optionIndex
                              const isCorrectAnswer = optionIndex === question.correctAnswer

                              return (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    isCorrectAnswer
                                      ? "bg-green-50 border-green-200 text-green-800"
                                      : isUserAnswer && !isCorrectAnswer
                                        ? "bg-red-50 border-red-200 text-red-800"
                                        : "bg-muted border-border"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isCorrectAnswer && <span className="text-green-600">✓</span>}
                                    {isUserAnswer && !isCorrectAnswer && <span className="text-red-600">✗</span>}
                                    <span>{option}</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                          <div className="bg-accent/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </MotionWrapper>
              )
            })}
          </div>
        </div>

        {session && <BottomNavigation />}
      </div>
    )
  }

  // Quiz Taking View
  if (currentQuiz && !showResults) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
    const selectedAnswer = selectedAnswers[currentQuestion.id]

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentQuiz(null)}
                className="hover:scale-105 transition-transform"
              >
                ← Exit Quiz
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-primary">{currentQuiz.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                </p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </header>

        <div className="container mx-auto p-4 max-w-4xl">
          <MotionWrapper animation="fadeInUp">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-primary mb-6">{currentQuestion.question}</h2>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                          selectedAnswer === index
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswer === index
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground"
                            }`}
                          >
                            {selectedAnswer === index && <span className="text-xs">✓</span>}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="bg-transparent"
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === undefined}
                    className="hover:scale-105 transition-transform"
                  >
                    {currentQuestionIndex === currentQuiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionWrapper>
        </div>

        {session && <BottomNavigation />}
      </div>
    )
  }

  // Quiz Selection View (Category selected)
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
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
                  {selectedCategory.name} Quizzes
                </h1>
                <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </header>

        <div className="container mx-auto p-4">
          <MotionWrapper animation="fadeInUp">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">{mockQuiz.title}</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">{mockQuiz.description}</p>
                  </div>
                  <Badge className={difficultyColors[mockQuiz.difficulty]} variant="secondary">
                    {mockQuiz.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <span>📝 {mockQuiz.questions.length} questions</span>
                  <span>⏱️ {mockQuiz.estimatedTime}</span>
                </div>
                <Button onClick={handleStartQuiz} className="w-full hover:scale-105 transition-transform">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </MotionWrapper>
        </div>

        {session && <BottomNavigation />}
      </div>
    )
  }

  // Main Categories View
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                ← Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-primary">Legal Knowledge Quizzes</h1>
              <p className="text-sm text-muted-foreground">Test and improve your legal knowledge</p>
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
          {mockQuizCategories.map((category, index) => (
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
                    <Badge variant="secondary">{category.quizCount} quizzes</Badge>
                    <Badge className={difficultyColors[category.difficulty]} variant="secondary">
                      {category.difficulty}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">⏱️ {category.estimatedTime}</div>
                  <Button className="w-full hover:scale-105 transition-transform">Take Quiz</Button>
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </div>

        {/* Call to Action */}
        <MotionWrapper animation="fadeInUp">
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-primary mb-2">Need Personalized Legal Guidance?</h3>
              <p className="text-muted-foreground mb-4">
                Our AI assistant can provide tailored legal advice based on your specific situation.
              </p>
              <Link href="/chat">
                <Button className="hover:scale-105 transition-transform">Chat with AI Assistant</Button>
              </Link>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>

      {session && <BottomNavigation />}
    </div>
  )
}
