"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui";

interface DocumentHeaderProps {
  onUploadClick: () => void;
}

export default function DocumentHeader({ onUploadClick }: DocumentHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className=" text-3xl font-bold text-gray-900">
          Legal Content Library
        </h1>
      </div>
      <Button
        onClick={onUploadClick}
        className="bg-amber-700 hover:bg-amber-800 px-6 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Upload Document
      </Button>
    </div>
  );
}
