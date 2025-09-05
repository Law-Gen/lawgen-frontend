"use client";

import { Download, Eye, Share2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@/components/ui";

interface Document {
  id: string;
  title: string;
  type: "template" | "guide" | "checklist" | "form";
  category: string;
  downloads: number;
  fileSize: string;
  author: string;
  updatedAt: string;
  iconColor: "brown" | "yellow" | "red" | "blue";
}

interface DocumentCardProps {
  document: Document;
  onDownload?: (id: string) => void;
  onView?: (id: string) => void;
  onShare?: (id: string) => void;
}

const getIconColorClass = (color: string) => {
  switch (color) {
    case "brown":
      return "bg-primary-100 text-primary-700";
    case "yellow":
      return "bg-yellow-100 text-yellow-700";
    case "red":
      return "bg-red-100 text-red-700";
    case "blue":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-primary-100 text-primary-700";
  }
};

export default function DocumentCard({
  document,
  onDownload,
  onView,
  onShare,
}: DocumentCardProps) {
  return (
    <div className="bg-white rounded-xl border border-primary-100 p-6 hover:shadow-lg transition-all duration-200 hover:border-primary-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColorClass(
            document.iconColor
          )}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary-900 mb-2 line-clamp-2">
          {document.title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-primary-600">{document.category}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-primary-500 mb-4">
        <div className="flex items-center gap-1">
          <Download className="w-4 h-4" />
          <span>{document.downloads}</span>
        </div>
        <span>{document.fileSize}</span>
      </div>

      <div className="text-xs text-primary-400 mb-4">
        By {document.author} • Updated {document.updatedAt}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onDownload?.(document.id)}
          className="flex-1 bg-primary-700 hover:bg-primary-800 text-white"
        >
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView?.(document.id)}
          className="border-primary-200 text-primary-600 hover:bg-primary-50"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onShare?.(document.id)}
          className="border-primary-200 text-primary-600 hover:bg-primary-50"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
