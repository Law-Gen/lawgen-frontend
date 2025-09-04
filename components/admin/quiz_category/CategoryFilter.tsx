"use client";

import { Input, Button } from "@/components/ui";
import { Search, Grid3X3, List } from "lucide-react";

interface CategoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function CategoryFilters({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
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

      <div className="flex items-center gap-2">
        {viewMode === "grid" ? (
          <Button
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="color-amber-700 "
          >
            <List className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="color-amber-700 "
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
