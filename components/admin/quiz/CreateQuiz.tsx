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
import { X, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { createQuiz, addQuestion, Quiz } from "@/src/store/slices/quizSlice";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create New Quiz
            </h2>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-1 rounded ${
                  step >= 1 ? "bg-amber-600" : "bg-gray-200"
                }`}
              />
              <div
                className={`w-8 h-1 rounded ${
                  step >= 2 ? "bg-amber-600" : "bg-gray-200"
                }`}
              />
              <span className="text-sm text-gray-500 ml-2">
                Step {step} of 2
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Quiz Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-sm font-medium text-gray-700"
                      >
                        Quiz Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={quizData.title}
                        onChange={(e) =>
                          handleQuizInfoChange("title", e.target.value)
                        }
                        className="mt-1"
                        placeholder="Enter quiz title"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Category
                        </Label>
                        <Select
                          value={quizData.category}
                          onValueChange={(value) =>
                            handleQuizInfoChange("category", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
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

                    <div>
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={quizData.description}
                        onChange={(e) =>
                          handleQuizInfoChange("description", e.target.value)
                        }
                        className="mt-1 min-h-[120px]"
                        placeholder="Enter quiz description"
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
                className="p-6"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Add Questions
                    </h3>
                    <span className="text-sm text-gray-500">
                      {quizData.questions.length} questions added
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Question {quizData.questions.length + 1}
                    </h4>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Question <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        value={currentQuestion.question}
                        onChange={(e) => handleQuestionChange(e.target.value)}
                        className="mt-1"
                        placeholder="Enter your question"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Answer Options <span className="text-red-500">*</span>
                      </Label>
                      <div className="mt-2 space-y-3">
                        <RadioGroup
                          value={currentQuestion.correctAnswer.toString()}
                          onValueChange={handleCorrectAnswerChange}
                        >
                          {currentQuestion.options.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <RadioGroupItem
                                value={index.toString()}
                                id={`option-${index}`}
                              />
                              <Input
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(index, e.target.value)
                                }
                                placeholder={`Option ${String.fromCharCode(
                                  65 + index
                                )}`}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </RadioGroup>
                        <p className="text-xs text-gray-500 mt-2">
                          Select the radio button next to the correct answer
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleAddQuestion}
                        disabled={
                          !currentQuestion.question ||
                          currentQuestion.correctAnswer === -1
                        }
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </div>

                  {quizData.questions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Added Questions
                      </h4>
                      {quizData.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="bg-white border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 mb-2">
                                Question {index + 1}
                              </h5>
                              <p className="text-gray-700 mb-3">
                                {question.question}
                              </p>
                              <div className="space-y-1">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-full border-2 ${
                                        optIndex === question.correctAnswer
                                          ? "bg-amber-600 border-amber-600"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {optIndex === question.correctAnswer && (
                                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-600">
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
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)}>
                Previous
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          <div>
            {step === 1 ? (
              <Button
                onClick={handleNextStep}
                disabled={!quizData.title || !quizData.category}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Next: Add Questions
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={quizData.questions.length === 0}
                className="bg-amber-600 hover:bg-amber-700"
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
