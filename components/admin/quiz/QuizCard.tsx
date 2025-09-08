"use client";

import { Edit, Trash2, Users, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchQuizzesByCategory } from "@/src/store/slices/quizSlice";

interface SingleQuizCardProps {
  quiz: any;
  onEdit: (quiz: any) => void;
  onDelete: (quizId: string) => void;
}

function SingleQuizCard({ quiz, onEdit, onDelete }: SingleQuizCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="group bg-card rounded-2xl border border-border hover:border-primary/30 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-muted to-secondary/20 rounded-xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                {quiz.name}
              </h3>
              {quiz.description && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {quiz.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center">
                <Users className="w-3 h-3 text-accent" />
              </div>
              <span className="font-medium">
                {quiz.questions?.length || quiz.total_questions || 0} questions
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-3 h-3 text-primary" />
              </div>
              <span className="font-medium">
                {formatDate(new Date(quiz.created_at))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(quiz)}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl w-9 h-9 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(quiz.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl w-9 h-9 p-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-muted to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
