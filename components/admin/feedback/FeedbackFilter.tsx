"use client";

import { Search, Grid3X3, List } from "lucide-react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface FeedbackFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;

  typeFilter: string;
  onTypeChange: (value: string) => void;

  severityFilter: string;
  onSeverityChange: (value: string) => void;

  statusFilter: string;
  onStatusChange: (value: string) => void;

  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;

  feedbackCount: number;
}

export default function FeedbackFiler({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeChange,
  severityFilter,
  onSeverityChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  feedbackCount,
}: FeedbackFilterProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center-justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="improvement">Improvement</SelectItem>
              <SelectItem value="general">General Feedback</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={onSeverityChange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-sm text-muted-foreground ml-2">
            {feedbackCount} feedback{feedbackCount !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>
    </div>
  );
}
