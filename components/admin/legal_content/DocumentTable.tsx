"use client";

import { FileText, Download, Eye, Share2 } from "lucide-react";
import { Button } from "@/components/ui";

interface Document {
  id: string;
  title: string;
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
  return (
    <div className="bg-white rounded-lg border border-primary-200 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-primary-50 border-b border-primary-200 text-sm font-medium text-primary-700">
        <div className="col-span-4">Document</div>
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
