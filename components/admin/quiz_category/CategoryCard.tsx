"use client";

import { Edit, Trash2 } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchQuizCategories,
  deleteQuizCategory,
  fetchQuizzesByCategory,
} from "@/src/store/slices/quizSlice";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  total_quizzes: number;
  created_at: string;
  updated_at: string;
}

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onClick?: () => void;
}

const colorClasses = {
  brown: "bg-amber-100 text-amber-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
};

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  onClick,
}: CategoryCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const categories = useAppSelector((state) => state.quizzes.categories);

  useEffect(() => {
    dispatch(fetchQuizCategories());
  }, [dispatch]);

  const handleDelete = (categoryId: string) => {
    dispatch(deleteQuizCategory(categoryId));
    if (onDelete) onDelete(categoryId);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default: Fetch quizzes for this category and redirect
      dispatch(fetchQuizzesByCategory({ categoryId: category.id })).then(() => {
        router.push("/admin/quizzes");
      });
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        {/* <div className={`p-3 rounded-lg ${colorClasses[category.color]}`}>
          <Briefcase className="w-6 h-6" />
        </div> */}
        <div className="justify-between mb-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(category);
            }}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(category.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {category.name}
      </h3>
      {/* <p className="text-gray-600 mb-4 text-sm">{category.description}</p> */}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{category.total_quizzes} quizzes</span>
        <span>Updated {category.updated_at}</span>
      </div>
    </div>
  );
}
