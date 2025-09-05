"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  CategoryHeader,
  CategoryFilter,
  CategoryCard,
  AddCategory,
  CategoryTable,
  CategoryEdit,
} from "@/components/admin/quiz_category";

interface Category {
  id: string;
  name: string;
  description: string;
  quizCount: number;
  lastUpdated: string;
  color: "brown" | "yellow" | "red";
}

const dummyCategories = [
  {
    id: "1",
    name: "Contract Law",
    description: "Legal agreements and contract disputes",
    quizCount: 12,
    lastUpdated: "2024-01-10",
    color: "brown" as const,
  },
  {
    id: "2",
    name: "Corporate Law",
    description: "Business formation and corporate governance",
    quizCount: 8,
    lastUpdated: "2024-01-09",
    color: "yellow" as const,
  },
  {
    id: "3",
    name: "Intellectual Property",
    description: "Patents, trademarks, and copyrights",
    quizCount: 15,
    lastUpdated: "2024-01-08",
    color: "red" as const,
  },
  {
    id: "4",
    name: "Employment Law",
    description: "Workplace rights and labor disputes",
    quizCount: 10,
    lastUpdated: "2024-01-07",
    color: "brown" as const,
  },
  {
    id: "5",
    name: "Real Estate Law",
    description: "Property transactions and disputes",
    quizCount: 6,
    lastUpdated: "2024-01-06",
    color: "yellow" as const,
  },
  {
    id: "6",
    name: "Criminal Law",
    description: "Criminal defense and prosecution",
    quizCount: 9,
    lastUpdated: "2024-01-05",
    color: "red" as const,
  },
];
export default function QuizCategoriesPage() {
  const [categories, setCategories] = useState(dummyCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = (categoryData: {
    name: string;
    description: string;
  }) => {
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name,
      description: categoryData.description,
      quizCount: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      color: "brown" as const, // Default color
    };
    setCategories((prev) => [...prev, newCategory]);

    // TODO: API Integration
    // try {
    //   const response = await fetch('/api/quiz-categories', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(categoryData)
    //   })
    //   const createdCategory = await response.json()
    //   setCategories(prev => [...prev, createdCategory])
    // } catch (error) {
    //   console.error('Failed to create category:', error)
    // }
  };

  const handleEditCategory = (category: Category) => {
    console.log("Edit category:", category);
    setSelectedCategory(category);
    setIsEditOpen(true);
    // TODO: Implement edit functionality
    // This could open an edit modal or navigate to an edit page
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));

    // TODO: API Integration
    // try {
    //   await fetch(`/api/quiz-categories/${categoryId}`, {
    //     method: 'DELETE'
    //   })
    //   setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    // } catch (error) {
    //   console.error('Failed to delete category:', error)
    // }
  };

  const handleSaveCategory = (
    categoryId: string,
    updates: { name: string; description: string }
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              ...updates,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : cat
      )
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <CategoryHeader onCreateClick={() => setIsAddModalOpen(true)} />

        <CategoryFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === "grid" ? (
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
        ) : (
          <CategoryTable
            categories={filteredCategories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm
                ? "No categories match your search."
                : "No categories found."}
            </p>
          </div>
        )}

        <AddCategory
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCategory}
        />

        <CategoryEdit
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false), setSelectedCategory(null);
          }}
          category={selectedCategory}
          onSave={handleSaveCategory}
        />
      </div>
    </AdminLayout>
  );
}
