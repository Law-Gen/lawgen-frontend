"use client";

import type React from "react";
import { useState } from "react";

import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { createQuizCategory } from "@/src/store/slices/quizSlice";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
}: AddCategoryModalProps) {
  const dispatch = useAppDispatch();
  const createCategoryStatus = useAppSelector(
    (state) => state.quizzes.createCategoryStatus
  );
  const createCategoryError = useAppSelector(
    (state) => state.quizzes.createCategoryError
  );
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      await dispatch(createQuizCategory(formData.name));
      setFormData({ name: "" });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ name: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add Category
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-4 top-4 p-0 h-auto"
          ></Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="categoryName"
              className="text-sm font-medium text-gray-700"
            >
              Category Name
            </Label>
            <Input
              id="categoryName"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Category names should be clear and descriptive.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="submit"
              className="bg-amber-700 hover:bg-amber-800 text-white"
              disabled={!formData.name.trim()}
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
