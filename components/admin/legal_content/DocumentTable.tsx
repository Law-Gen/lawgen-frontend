"use client";

import { FileText, Download, Eye, Share2 } from "lucide-react";
import { Button, Badge } from "@/components/ui";

interface Document {
  id: string;
  title: string;
  type: "template" | "guide" | "checklist" | "form";
  category: string;
  downloads: number;
  fileSize: string;
  author: string;
  updatedAt: string;
  iconColor: "brown" | "yellow" | "red" | "blue" | "green";
}

interface DocumentTableProps {
  documents: Document[];
  onDownload: (id: string) => void;
  onView: (id: string) => void;
  onShare: (id: string) => void;
}

export default function DocumentTable({
  documents,
  onDownload,
  onView,
  onShare,
}: DocumentTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "template":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "guide":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "checklist":
        return "bg-red-50 text-red-700 border-red-200";
      case "form":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-primary-200 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-primary-50 border-b border-primary-200 text-sm font-medium text-primary-700">
        <div className="col-span-4">Document</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">Downloads</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-3">Actions</div>
      </div>

      <div className="divide-y divide-primary-100">
        {documents.map((document) => (
          <div
            key={document.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-primary-25 transition-colors"
          >
            <div className="col-span-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-primary-900 truncate">
                  {document.title}
                </h3>
                <p className="text-sm text-primary-600">
                  {document.fileSize} • By {document.author}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center">
              <Badge
                variant="outline"
                className={`capitalize text-xs ${getTypeColor(document.type)}`}
              >
                {document.type}
              </Badge>
            </div>

            <div className="col-span-2 flex items-center">
              <span className="text-sm text-primary-700">
                {document.category}
              </span>
            </div>

            <div className="col-span-1 flex items-center">
              <span className="text-sm text-primary-900 font-medium">
                {document.downloads}
              </span>
            </div>

            {/* <div className="col-span-1 flex items-center">
              <Badge
                variant="outline"
                className={`capitalize text-xs ${getStatusColor(
                  document.status
                )}`}
              >
                {document.status}
              </Badge>
            </div> */}

            <div className="col-span-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(document.id)}
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(document.id)}
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(document.id)}
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
