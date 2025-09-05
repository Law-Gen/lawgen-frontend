"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase } from "lucide-react";
import { Button, Input, Textarea, Label } from "@/components/ui";

interface Category {
  id: string;
  name: string;
  description: string;
  quizCount: number;
  lastUpdated: string;
  color: "brown" | "yellow" | "red";
}

interface CategoryEditProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (
    categoryId: string,
    updates: { name: string; description: string }
  ) => void;
}

const colorClasses = {
  brown: "bg-amber-100 text-amber-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
};

export default function CategoryEdit({
  isOpen,
  onClose,
  category,
  onSave,
}: CategoryEditProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  const handleSave = () => {
    if (category && name.trim() && description.trim()) {
      onSave(category.id, {
        name: name.trim(),
        description: description.trim(),
      });
      onClose();
    }
  };
  const handleCancel = () => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && category && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-primary-200">
              <h2 className="text-lg font-semibold text-primary-900">
                Edit Category
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-primary-500 hover:text-primary-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`p-4 rounded-full ${colorClasses[category.color]}`}
                >
                  <Briefcase className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-primary-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-primary-600">
                    {category.quizCount} quizzes
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="category-name"
                    className="text-sm font-medium text-primary-700"
                  >
                    Category Name
                  </Label>
                  <Input
                    id="category-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="category-description"
                    className="text-sm font-medium text-primary-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="category-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter category description"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="bg-primary-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-primary-900">
                    Category Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-primary-600">Quiz Count:</span>
                      <span className="ml-2 font-medium text-primary-900">
                        {category.quizCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-primary-600">Last Updated:</span>
                      <span className="ml-2 font-medium text-primary-900">
                        {category.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-primary-200 flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!name.trim() || !description.trim()}
                className="flex-1 bg-primary-600 hover:bg-primary-700"
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
