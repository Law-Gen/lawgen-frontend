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

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const colorClasses = {
  brown: "bg-amber-100 text-amber-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
};

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="bg-white rounded-lg border border-primary-200 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-primary-50 border-b border-primary-200 text-sm font-medium text-primary-700">
        <div className="col-span-3">Name</div>
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Quiz Count</div>
        <div className="col-span-2">Last Updated</div>
        <div className="col-span-1">Actions</div>
      </div>
      <div className="divide-y divide-primary-100">
        {categories.map((category) => (
          <div
            key={category.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-primary-25 transition-colors items-center"
          >
            <div className="col-span-3 flex items-center gap-2">
              <div className={`p-2 rounded-lg ${colorClasses[category.color]}`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-semibold text-primary-900">
                {category.name}
              </span>
            </div>
            <div className="col-span-4 text-primary-700">
              {category.description}
            </div>
            <div className="col-span-2 font-medium text-primary-900">
              {category.quizCount}
            </div>
            <div className="col-span-2 text-primary-600">
              {category.lastUpdated}
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(category)}
              >
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
        ))}
      </div>
    </div>
  );
}
