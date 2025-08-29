"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuizFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

// **** might be used when we are recieving info from the api
// const categoryItems = [
//     {
//         name:"All Categories"
//     },
//     {
//         name: "Contract Law"
//     },
//     {
//         name: "Civil Law"
//     },
// ]

export default function QuizFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: QuizFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform-translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search quizzes ..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-amber-200 focus:border-amber-amber-400 focus:ring-amber-400"
        />
      </div>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-48 border-amber-200 focus:border-amber-400 focus:ring-amber-400">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectContent>
            <SelectItem value="all"> All Categories </SelectItem>
            <SelectItem value="criminal-law"> Criminal Law </SelectItem>
          </SelectContent>
        </SelectContent>
      </Select>
    </div>
  );
}
