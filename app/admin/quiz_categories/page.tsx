"use client";

import { useAppSelector } from "@/src/store/hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  CategoryHeader,
  CategoryFilter,
  CategoryCard,
  AddCategory,
  CategoryEdit,
} from "@/components/admin/quiz_category";

export default function QuizCategoriesPage() {
  const categories = useAppSelector((state) => state.quizzes.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const router = useRouter();
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleDeleteCategory = () => {
    setIsEditOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = () => {
    setIsEditOpen(false);
    setSelectedCategory(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <CategoryHeader onCreateClick={() => setIsAddModalOpen(true)} />
        <CategoryFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>

        <AddCategory
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
        <CategoryEdit
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          onSave={handleSaveCategory}
        />
      </div>
    </AdminLayout>
  );
}
