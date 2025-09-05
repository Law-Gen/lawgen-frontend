"use client";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

interface CategoryHeaderProps {
  onCreateClick: () => void;
}

export default function CategoryHeader({ onCreateClick }: CategoryHeaderProps) {
  return (
    <div className="flex items-center justify-content: justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quizze Categories</h1>
        <p className="text-gray-600 mt-1"></p>
      </div>
      <Button
        onClick={onCreateClick}
        className="bg-amber-700 hover:bg-amber-800"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create New Quiz Category
      </Button>
    </div>
  );
}
