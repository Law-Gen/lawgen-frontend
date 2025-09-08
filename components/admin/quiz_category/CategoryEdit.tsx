"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase } from "lucide-react";
import { Button, Input, Textarea, Label } from "@/components/ui";
import { useAppDispatch } from "@/src/store/hooks";
import { updateQuizCategory, QuizCategory } from "@/src/store/slices/quizSlice";

interface CategoryEditProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
    description?: string;
    quizCount: number;
    lastUpdated: string;
    color: "brown" | "yellow" | "red";
  };
  onSave: (id: string, data: { name: string }) => void;
}

export default function CategoryEdit({
  isOpen,
  onClose,
  category,
  onSave,
}: CategoryEditProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSave = () => {
    if (category && name.trim()) {
      dispatch(
        updateQuizCategory({ categoryId: category.id, name: name.trim() })
      );
      if (onSave)
        onSave(category.id, {
          name: name.trim(),
        });
      onClose();
    }
  };
  const handleCancel = () => {
    if (category) {
      setName(category.name);
    }
    onClose();
  };

  const colorClasses = {
    brown: "bg-brown-100 text-brown-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <AnimatePresence>
      {isOpen && category && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[420px] bg-[#F9F6F2] shadow-2xl z-50 flex flex-col border-l border-gray-200 rounded-l-2xl"
          >
            <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100 bg-white rounded-tl-2xl">
              <h2 className="text-xl font-bold text-gray-900">
                Update Category
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 px-7 py-6 space-y-8 overflow-y-auto">
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`p-4 rounded-full shadow ${
                    colorClasses[category.color as "brown" | "yellow" | "red"]
                  }`}
                >
                  <Briefcase className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.quizCount} quizzes
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <Label
                    htmlFor="category-name"
                    className="text-xs font-semibold text-gray-700 mb-1 block"
                  >
                    Category Name
                  </Label>
                  <Input
                    id="category-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
                    className="mt-1 rounded-lg border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div className="bg-white rounded-xl p-4 space-y-2 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-base mb-2">
                    Category Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Quiz Count:</span>
                      <span className="ml-2 font-bold text-gray-900">
                        {category.quizCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="ml-2 font-bold text-gray-900">
                        {category.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-7 py-6 border-t border-gray-100 bg-white rounded-bl-2xl flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white shadow"
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
