"use client";

import { Briefcase, Edit, Trash2 } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

interface Category {
  id: string;
  name: string;
  description: string;
  quizCount: number;
  lastUpdated: string;
  color: "brown" | "yellow" | "red";
}

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
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
}: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[category.color]}`}>
          <Briefcase className="w-6 h-6" />
        </div>
        <div className="justify-between mb-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {category.name}
      </h3>
      <p className="text-gray-600 mb-4 text-sm">{category.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span
          className={`font-medium ${
            category.color === "brown"
              ? "text-amber-700"
              : category.color === "yellow"
              ? "text-yellow-700"
              : "text-red-700"
          }`}
        >
          {category.quizCount} quizzes
        </span>
        <span>Updated {category.lastUpdated}</span>
      </div>
    </div>
  );
}
