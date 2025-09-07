"use client";

import { Search, Grid3X3, List } from "lucide-react";
import { Input, Button } from "@/components/ui";

interface DocumentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function DocumentFilter({
  searchQuery,
  onSearchChange,
}: DocumentFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <div className="flex flex-col sm:flex-row flex-1 gap-4 items-start sm:items-center w-full lg:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );
}
