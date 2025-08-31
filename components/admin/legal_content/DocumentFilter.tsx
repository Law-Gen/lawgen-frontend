"use client";

import { Search, Grid3X3, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Button,
} from "@/components/ui";

interface DocumentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function DocumentFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  viewMode,
  onViewModeChange,
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

        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full sm:w-44 border-primary-200 focus:border-primary-500">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="contract-law">Contract Law</SelectItem>
              <SelectItem value="corporate-law">Corporate Law</SelectItem>
              <SelectItem value="intellectual-property">
                Intellectual Property
              </SelectItem>
              <SelectItem value="employment-law">Employment Law</SelectItem>
              <SelectItem value="real-estate-law">Real Estate Law</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full sm:w-36 border-primary-200 focus:border-primary-500">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="template">Template</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="checklist">Checklist</SelectItem>
              <SelectItem value="form">Form</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex border border-primary-200 rounded-lg overflow-hidden bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className={`px-3 py-2 border-0 rounded-none ${
            viewMode === "grid"
              ? "bg-primary-700 text-white hover:bg-primary-800"
              : "text-primary-600 hover:bg-primary-50 hover:text-primary-700"
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange("list")}
          className={`px-3 py-2 border-0 rounded-none ${
            viewMode === "list"
              ? "bg-primary-700 text-white hover:bg-primary-800"
              : "text-primary-600 hover:bg-primary-50 hover:text-primary-700"
          }`}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
