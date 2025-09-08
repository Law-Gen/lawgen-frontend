"use client";

import { Input } from "@/components/ui";
import { Search } from "lucide-react";

interface CategoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function CategoryFilters({
  searchTerm,
  onSearchChange,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>
    </div>
  );
}
