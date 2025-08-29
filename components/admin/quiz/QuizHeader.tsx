"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizHeaderProps {
  onCreateClick: () => void;
}

export default function QuizHeader({ onCreateClick }: QuizHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-600 mt-1"></p>
      </div>
      <Button
        onClick={onCreateClick}
        className="bg-amber-700 hover:bg-amber-800"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create New Quiz
      </Button>
    </div>
  );
}
