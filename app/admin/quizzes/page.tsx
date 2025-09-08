"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchQuizCategories,
  deleteQuiz,
  updateQuiz,
} from "@/src/store/slices/quizSlice";

import AdminLayout from "@/components/admin/AdminLayout";
import QuizHeader from "@/components/admin/quiz/QuizHeader";
import { QuizCard } from "@/components/admin/quiz/QuizCard";
import CreateQuiz from "@/components/admin/quiz/CreateQuiz";
import { Quiz } from "@/src/store/slices/quizSlice";

export default function QuizzesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = useAppSelector((state) => state.quizzes.categories);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Get categoryId from query param (?categoryId=...)
  const categoryId =
    searchParams.get("categoryId") || (categories[0]?.id ?? "");
  const selectedCategory =
    categories.find((cat) => cat.id === categoryId) || categories[0];

  useEffect(() => {
    dispatch(fetchQuizCategories());
  }, [dispatch]);

  // Handlers for quiz actions
  const handleEditQuiz = (quiz: Quiz) => {
    dispatch(
      updateQuiz({
        quizId: quiz.id,
        name: quiz.name,
        description: quiz.description,
      })
    );
  };
  const handleDeleteQuiz = (quizId: string) => {
    dispatch(deleteQuiz(quizId));
  };
  const handleCreateQuiz = () => setIsCreateModalOpen(true);
  const handleCloseCreate = () => setIsCreateModalOpen(false);
  const handleSubmitQuiz = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {selectedCategory && (
          <QuizHeader
            onCreateClick={handleCreateQuiz}
            category={selectedCategory}
          />
        )}
        <div className="mt-8">
          {selectedCategory ? (
            <QuizCard
              categoryId={selectedCategory.id}
              onEdit={handleEditQuiz}
              onDelete={handleDeleteQuiz}
            />
          ) : (
            <div className="text-gray-500">No category selected.</div>
          )}
        </div>
        <CreateQuiz
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreate}
          onSubmit={handleSubmitQuiz}
        />
      </div>
    </AdminLayout>
  );
}
