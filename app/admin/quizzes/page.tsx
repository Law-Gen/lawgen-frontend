"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import {
  QuizCard,
  QuizFilter,
  QuizHeader,
  CreateQuiz,
} from "@/components/admin/quiz";

// Import the Quiz type from the shared location
import type { Quiz } from "@/components/admin/quiz/types";

export default function QuizzesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Contract Law Fundamentals",
      category: "Contract Law",
      difficulty: "Beginner",
      duration: "30 minutes",
      description: "Basic principles of contract law",
      questions: Array(15).fill({}), // 15 questions
      createdAt: new Date("2023-05-15"),
      completions: 234,
    },
    {
      id: "2",
      title: "Corporate Governance Essentials",
      category: "Corporate Law",
      difficulty: "Intermediate",
      duration: "45 minutes",
      description: "Essential concepts in corporate governance",
      questions: Array(25).fill({}), // 25 questions
      createdAt: new Date("2023-04-20"),
      completions: 189,
    },
  ]);

  const handleCreateQuiz = (quizData: any) => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      ...quizData,
      createdAt: new Date(),
      completions: 0,
    };
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    console.log("Edit quiz:", quiz.title);
    // TODO: Implement edit functionality
  };

  const handleDeleteQuiz = (quizId: string) => {
    console.log(" Delete quiz:", quizId);
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      quiz.category.toLowerCase().replace(" ", "-") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <QuizHeader onCreateClick={() => setIsCreateModalOpen(true)} />

      <QuizFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="space-y-4">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onEdit={handleEditQuiz}
              onDelete={handleDeleteQuiz}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No quizzes found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first quiz"}
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Quiz
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateQuiz
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateQuiz}
      />
    </div>
  );
}
