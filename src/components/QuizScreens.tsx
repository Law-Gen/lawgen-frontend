import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, Star, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useLanguage } from './LanguageContext';
import { useRouter } from './AppRouter';
import BottomNavigation from './BottomNavigation';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizScreensProps {
  mode: 'home' | 'questions' | 'results';
}

const QuizScreens: React.FC<QuizScreensProps> = ({ mode }) => {
  const { t } = useLanguage();
  const { navigate, screenData } = useRouter();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const quizTopics = [
    {
      title: 'Family Law Basics',
      description: 'Test your knowledge of marriage, divorce, and custody laws',
      questions: 10,
      difficulty: 'Beginner',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Business Law Fundamentals',
      description: 'Learn about contracts, partnerships, and corporate law',
      questions: 15,
      difficulty: 'Intermediate',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Criminal Law Overview',
      description: 'Understanding criminal charges and legal procedures',
      questions: 12,
      difficulty: 'Advanced',
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Property Rights',
      description: 'Real estate, landlord-tenant, and property ownership',
      questions: 8,
      difficulty: 'Beginner',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  const sampleQuestions: Question[] = [
    {
      id: 1,
      question: "What is the minimum age for marriage without parental consent in most U.S. states?",
      options: ["16 years", "18 years", "21 years", "25 years"],
      correctAnswer: 1,
      explanation: "In most U.S. states, the legal age for marriage without parental consent is 18 years old."
    },
    {
      id: 2,
      question: "Which document establishes the basic rules and procedures for a corporation?",
      options: ["Business License", "Articles of Incorporation", "Operating Agreement", "Partnership Agreement"],
      correctAnswer: 1,
      explanation: "Articles of Incorporation is the legal document that establishes a corporation and its basic governing rules."
    },
    {
      id: 3,
      question: "What is the standard of proof required in criminal cases?",
      options: ["Preponderance of evidence", "Clear and convincing", "Beyond a reasonable doubt", "Probable cause"],
      correctAnswer: 2,
      explanation: "Criminal cases require proof 'beyond a reasonable doubt,' the highest standard of evidence in law."
    }
  ];

  const handleStartQuiz = (topic: any) => {
    navigate('quiz-questions', { topic, questions: sampleQuestions });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      // Calculate score and navigate to results
      const correctAnswers = selectedAnswers.filter((answer, index) => 
        answer === sampleQuestions[index].correctAnswer
      ).length;
      navigate('quiz-results', { 
        score: correctAnswers, 
        total: sampleQuestions.length 
      });
    }
  };

  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <motion.header 
          className="px-4 py-6 flex items-center bg-card/50 backdrop-blur-sm border-b border-border/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('chat-logged-in')}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl text-primary">Legal Quizzes</h1>
        </motion.header>

        {/* Quiz Topics */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <p className="text-muted-foreground text-center">
                Test your legal knowledge with interactive quizzes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizTopics.map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm"
                    onClick={() => handleStartQuiz(topic)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${topic.color} flex items-center justify-center`}>
                          <Trophy className="w-6 h-6" />
                        </div>
                        <Badge 
                          variant={topic.difficulty === 'Beginner' ? 'secondary' : 
                                 topic.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                        >
                          {topic.difficulty}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg text-primary mb-2">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {topic.questions} questions
                        </span>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Start Quiz
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  if (mode === 'questions') {
    const question = sampleQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <motion.header 
          className="px-4 py-6 bg-card/50 backdrop-blur-sm border-b border-border/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('quiz-home')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.header>

        {/* Question */}
        <div className="flex-1 flex flex-col p-4">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <Card className="mb-6 border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{question.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {question.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showExplanation}
                          className={`w-full p-4 h-auto text-left justify-start transition-all duration-300 ${
                            showExplanation 
                              ? index === question.correctAnswer 
                                ? 'border-green-500 bg-green-50 text-green-700' 
                                : selectedAnswers[currentQuestion] === index
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'opacity-50'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              showExplanation && index === question.correctAnswer
                                ? 'border-green-500 bg-green-500'
                                : showExplanation && selectedAnswers[currentQuestion] === index && index !== question.correctAnswer
                                ? 'border-red-500 bg-red-500'
                                : 'border-muted-foreground'
                            }`}>
                              {showExplanation && index === question.correctAnswer && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                              {showExplanation && selectedAnswers[currentQuestion] === index && index !== question.correctAnswer && (
                                <XCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="mb-6 border-border/50 bg-blue-50/50">
                        <CardContent className="p-4">
                          <p className="text-sm text-blue-700">{question.explanation}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Button
                        onClick={handleNextQuestion}
                        className="w-full py-3 bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        {currentQuestion < sampleQuestions.length - 1 ? 'Next Question' : 'View Results'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'results') {
    const { score, total } = screenData || { score: 0, total: 3 };
    const percentage = Math.round((score / total) * 100);
    const getScoreMessage = () => {
      if (percentage >= 80) return "Excellent! You have a strong understanding of legal concepts.";
      if (percentage >= 60) return "Good job! You're on the right track with your legal knowledge.";
      return "Keep learning! Review the topics and try again to improve your score.";
    };

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <motion.header 
          className="px-4 py-6 bg-card/50 backdrop-blur-sm border-b border-border/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('quiz-home')}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl text-primary">Quiz Results</h1>
          </div>
        </motion.header>

        {/* Results */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="text-center border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.4 }}
                    className="mb-6"
                  >
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-10 h-10 text-primary-foreground" />
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-2xl text-primary mb-2"
                  >
                    Quiz Complete!
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-6"
                  >
                    <div className="text-4xl mb-2">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                      >
                        {score}
                      </motion.span>
                      <span className="text-2xl text-muted-foreground">/{total}</span>
                    </div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                        >
                          <Star className={`w-6 h-6 ${
                            i < Math.floor(percentage / 20) 
                              ? 'text-amber-400 fill-current' 
                              : 'text-muted-foreground'
                          }`} />
                        </motion.div>
                      ))}
                    </div>
                    <Badge 
                      variant={percentage >= 80 ? 'default' : percentage >= 60 ? 'secondary' : 'outline'}
                      className="text-lg py-1 px-3"
                    >
                      {percentage}%
                    </Badge>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-muted-foreground mb-6"
                  >
                    {getScoreMessage()}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="space-y-3"
                  >
                    <Button
                      onClick={() => navigate('quiz-home')}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Another Quiz
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('chat-logged-in')}
                      className="w-full"
                    >
                      Ask AI About Topics
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return null;
};

export default QuizScreens;