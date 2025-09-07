"use client";

import type React from "react";
import { useState } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import { postContent } from "@/src/store/slices/legalContentSlice";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { X, Upload, Cloud } from "lucide-react";

interface UploadDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (documentData: any) => void;
}

export default function UploadDocument({
  isOpen,
  onClose,
  onUpload,
}: UploadDocumentProps) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async () => {
    if (!title || !category || !file || !description || !language) {
      alert("please fill in all required fields and select a file");
      return;
    }

    // Dispatch postContent thunk
    await dispatch(
      postContent({
        file,
        group_name: category,
        name: title,
        description,
        language,
      })
    );

    // Optionally call onUpload callback
    if (onUpload) onUpload({ title, category, description, file, language });

    // Reset form
    setTitle("");
    setCategory("");
    setDescription("");
    setLanguage("");
    setFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed insert-0 bg-black/20 z-40" onClick={onClose} />

      {/* modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Upload Legal Document
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Document Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Document Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Document Category should be fetched from the legal content category I will create */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contract Law">Contract Law</SelectItem>
                    <SelectItem value="Corporate Law">Corporate Law</SelectItem>
                    <SelectItem value="Intellectual Property">
                      Intellectual Property
                    </SelectItem>
                    <SelectItem value="Employment Law">
                      Employment Law
                    </SelectItem>
                    <SelectItem value="Real Estate Law">Family Law</SelectItem>
                    <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                    <SelectItem value="Criminal Law">Crivil Law</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* document description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                placeholder="Enter document description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* languague */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Language <span className="text-red-500">*</span>
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">English</SelectItem>
                  <SelectItem value="amh">Amharic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* file Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                File Upload <span className="text-red-500"></span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Cloud className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-foreground font-medium">
                    {file ? file.name : "Drag and drop your file here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {" "}
                    Supported formats: PDF, DOCX, DOC{" "}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".pdf,.docx,.doc";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) setFile(file);
                      };
                      input.click();
                    }}
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
