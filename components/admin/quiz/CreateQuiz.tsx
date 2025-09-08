"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, BookOpen, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { createQuiz, addQuestion } from "@/src/store/slices/quizSlice";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  title: string;
  category: string;
  description: string;
  questions: Question[];
}

interface CreateQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuizData) => void;
}

export default function CreateQuiz({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuizProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.quizzes.categories);
  const [step, setStep] = useState(1);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData>({
    title: "",
    category: "",
    description: "",
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: -1,
  });

  const handleQuizInfoChange = (field: keyof QuizData, value: string) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (value: string) => {
    setCurrentQuestion((prev) => ({ ...prev, question: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }));
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      correctAnswer: Number.parseInt(value),
    }));
  };

  // Create quiz when moving to step 2
  const handleNextStep = async () => {
    if (!quizData.title || !quizData.category) return;
    const result = await dispatch(
      createQuiz({
        category_id: quizData.category,
        name: quizData.title,
        description: quizData.description,
      })
    );
    // @ts-ignore
    if (result.payload && result.payload.id) {
      setQuizId(result.payload.id);
      setStep(2);
    }
  };

  // Add question handler (only after quiz is created)
  const handleAddQuestion = async () => {
    if (!quizId) return;
    if (!currentQuestion.question || currentQuestion.correctAnswer === -1)
      return;
    // Convert options to {A: ..., B: ..., C: ...} format
    const filteredOptions = currentQuestion.options.filter(
      (opt) => opt.trim() !== ""
    );
    const optionsObj: Record<string, string> = {};
    filteredOptions.forEach((opt, idx) => {
      optionsObj[String.fromCharCode(65 + idx)] = opt;
    });
    const correctOption = String.fromCharCode(
      65 + currentQuestion.correctAnswer
    );
    await dispatch(
      addQuestion({
        quizId,
        text: currentQuestion.question,
        options: optionsObj,
        correct_option: correctOption,
      })
    );
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now().toString(),
          question: currentQuestion.question,
          options: filteredOptions,
          correctAnswer: currentQuestion.correctAnswer,
        },
      ],
    }));
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: -1,
    });
  };

  const removeQuestion = (questionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleSubmit = () => {
    onSubmit(quizData);
    onClose();
    // Reset form
    setStep(1);
    setQuizData({
      title: "",
      category: "",
      description: "",
      questions: [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-border"
      >
        <div className="flex items-center justify-between p-8 border-b border-border bg-gradient-to-r from-muted to-secondary/20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Create New Quiz
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-2 rounded-full transition-all duration-300 ${
                    step >= 1
                      ? "bg-gradient-to-r from-primary to-accent"
                      : "bg-muted"
                  }`}
                />
                <div
                  className={`w-10 h-2 rounded-full transition-all duration-300 ${
                    step >= 2
                      ? "bg-gradient-to-r from-primary to-accent"
                      : "bg-muted"
                  }`}
                />
              </div>
              <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {step} of 2
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-background/50 rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-8"
              >
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                      <span className="text-accent-foreground font-bold text-sm">
                        1
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Quiz Information
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-sm font-semibold text-foreground flex items-center gap-2"
                      >
                        Quiz Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={quizData.title}
                        onChange={(e) =>
                          handleQuizInfoChange("title", e.target.value)
                        }
                        className="h-12 border-border focus:border-primary focus:ring-primary/20 rounded-xl"
                        placeholder="Enter an engaging quiz title"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={quizData.category}
                          onValueChange={(value) =>
                            handleQuizInfoChange("category", value)
                          }
                        >
                          <SelectTrigger className="h-12 border-border focus:border-primary rounded-xl">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-semibold text-foreground"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={quizData.description}
                        onChange={(e) =>
                          handleQuizInfoChange("description", e.target.value)
                        }
                        className="min-h-[140px] border-border focus:border-primary focus:ring-primary/20 rounded-xl resize-none"
                        placeholder="Describe what this quiz covers and what learners can expect..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-8"
              >
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                        <span className="text-accent-foreground font-bold text-sm">
                          2
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Add Questions
                      </h3>
                    </div>
                    <div className="bg-gradient-to-r from-muted to-secondary/20 px-4 py-2 rounded-xl border border-border">
                      <span className="text-sm font-medium text-primary">
                        {quizData.questions.length} questions added
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-muted to-secondary/10 rounded-2xl p-8 border border-border space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                        <Plus className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">
                        Question {quizData.questions.length + 1}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">
                        Question <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        value={currentQuestion.question}
                        onChange={(e) => handleQuestionChange(e.target.value)}
                        className="min-h-[100px] border-border focus:border-primary focus:ring-primary/20 rounded-xl bg-background"
                        placeholder="Enter your question here..."
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-foreground">
                        Answer Options{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="space-y-3">
                        <RadioGroup
                          value={currentQuestion.correctAnswer.toString()}
                          onValueChange={handleCorrectAnswerChange}
                        >
                          {currentQuestion.options.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors"
                            >
                              <RadioGroupItem
                                value={index.toString()}
                                id={`option-${index}`}
                                className="border-2 border-muted-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                              />
                              <div className="w-8 h-8 bg-gradient-to-br from-muted to-secondary/20 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-semibold text-muted-foreground">
                                  {String.fromCharCode(65 + index)}
                                </span>
                              </div>
                              <Input
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(index, e.target.value)
                                }
                                placeholder={`Enter option ${String.fromCharCode(
                                  65 + index
                                )}`}
                                className="flex-1 border-0 focus:ring-0 bg-transparent"
                              />
                            </div>
                          ))}
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground bg-accent/10 p-3 rounded-lg border border-accent/20">
                          💡 Select the radio button next to the correct answer
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleAddQuestion}
                        disabled={
                          !currentQuestion.question ||
                          currentQuestion.correctAnswer === -1
                        }
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </div>

                  {quizData.questions.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        Added Questions
                      </h4>
                      <div className="space-y-4">
                        {quizData.questions.map((question, index) => (
                          <div
                            key={question.id}
                            className="bg-background border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-sm">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <h5 className="font-semibold text-foreground">
                                    Question {index + 1}
                                  </h5>
                                </div>
                                <p className="text-muted-foreground mb-4 leading-relaxed">
                                  {question.question}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                                        optIndex === question.correctAnswer
                                          ? "bg-primary/10 border-primary/30"
                                          : "bg-muted border-border"
                                      }`}
                                    >
                                      <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                          optIndex === question.correctAnswer
                                            ? "bg-primary border-primary"
                                            : "border-muted-foreground"
                                        }`}
                                      >
                                        {optIndex ===
                                          question.correctAnswer && (
                                          <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                                        )}
                                      </div>
                                      <span className="text-sm font-medium text-muted-foreground">
                                        {String.fromCharCode(65 + optIndex)}.
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        {option}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuestion(question.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl ml-4"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between p-8 border-t border-border bg-gradient-to-r from-muted to-secondary/10">
          <div className="flex gap-3">
            {step === 2 && (
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border-border hover:bg-muted"
              >
                Previous
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-border hover:bg-muted bg-transparent"
            >
              Cancel
            </Button>
          </div>

          <div>
            {step === 1 ? (
              <Button
                onClick={handleNextStep}
                disabled={!quizData.title || !quizData.category}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Add Questions
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={quizData.questions.length === 0}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
