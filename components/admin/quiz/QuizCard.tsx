"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchQuizzesByCategory } from "@/src/store/slices/quizSlice";

// interface Quiz {
//   id: string;
//   title: string;
//   category: string;
//   difficulty: string;
//   description: string;
//   questions: any[];
//   createdAt: Date;
//   completions: number;
// }

interface SingleQuizCardProps {
  quiz: any;
  onEdit: (quiz: any) => void;
  onDelete: (quizId: string) => void;
}

function SingleQuizCard({ quiz, onEdit, onDelete }: SingleQuizCardProps) {
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {quiz.name}
          </h3>
          <p>{quiz.description}</p>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>
              {quiz.questions?.length || quiz.total_questions || 0} questions
            </span>
            <span>Created: {formatDate(new Date(quiz.created_at))}</span>
            {/* completions not in API, so omit or set to 0 */}
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

interface QuizCardListProps {
  categoryId: string;
  onEdit: (quiz: any) => void;
  onDelete: (quizId: string) => void;
}

export function QuizCard({ categoryId, onEdit, onDelete }: QuizCardListProps) {
  const dispatch = useAppDispatch();
  const quizzes = useAppSelector(
    (state) => state.quizzes.quizzesByCategory?.[categoryId] || []
  );
  useEffect(() => {
    if (categoryId) {
      dispatch(fetchQuizzesByCategory({ categoryId }));
    }
  }, [dispatch, categoryId]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz: any) => (
        <SingleQuizCard
          key={quiz.id}
          quiz={quiz}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
