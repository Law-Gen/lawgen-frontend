"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  questions: any[];
  createdAt: Date;
  completions: number;
}

interface QuizCardProps {
  quiz: Quiz;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
}

export default function QuizCard({ quiz, onEdit, onDelete }: QuizCardProps) {
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {quiz.title}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-md border ${getDifficultyColor(
                quiz.difficulty
              )}`}
            >
              {quiz.difficulty}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 border border-gray-200">
              {quiz.category}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>{quiz.questions.length} questions</span>
            <span>Created: {formatDate(quiz.createdAt)}</span>
            <span>{quiz.completions} completions</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(quiz)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(quiz.id)}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
