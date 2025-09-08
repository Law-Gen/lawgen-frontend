"use client";

import { Search, Grid3X3, List } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface LegalAidFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  specializationFilter: string;
  onSpecializationFilterChange: (value: string) => void;
  resultsCount: number;
}

export default function AidFilter({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  specializationFilter,
  onSpecializationFilterChange,

  resultsCount,
}: LegalAidFiltersProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search legal aid services..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="lawyer">Lawyer</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={specializationFilter}
            onValueChange={onSpecializationFilterChange}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="family-law">Family Law</SelectItem>
              <SelectItem value="immigration-law">Immigration Law</SelectItem>
              <SelectItem value="housing-rights">Housing Rights</SelectItem>
              <SelectItem value="consumer-protection">
                Consumer Protection
              </SelectItem>
              <SelectItem value="employment-law">Employment Law</SelectItem>
              <SelectItem value="civil-rights">Civil Rights</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 ml-2">
            {resultsCount} services found
          </span>
        </div>
      </div>
    </div>
  );
}
