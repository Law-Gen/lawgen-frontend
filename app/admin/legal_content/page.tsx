"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  DocumentHeader,
  DocumentCard,
  DocumentFilter,
  DocumentTable,
} from "@/components/admin/legal_content";

const dummyDocuments = [
  {
    id: "1",
    title: "Non-Disclosure Agreement Template",
    type: "template" as const,
    category: "Contract Law",
    downloads: 156,
    fileSize: "2.4 MB",
    author: "John Smith",
    updatedAt: "2024-01-12",
    iconColor: "brown" as const,
  },
  {
    id: "2",
    title: "Corporate Bylaws Guide",
    type: "guide" as const,
    category: "Corporate Law",
    downloads: 89,
    fileSize: "5.8 MB",
    author: "Sarah Johnson",
    updatedAt: "2024-01-11",
    iconColor: "yellow" as const,
  },
  {
    id: "3",
    title: "Patent Application Checklist",
    type: "checklist" as const,
    category: "Intellectual Property",
    downloads: 234,
    fileSize: "1.2 MB",
    author: "Michael Brown",
    updatedAt: "2024-01-10",
    iconColor: "red" as const,
  },
  {
    id: "4",
    title: "Employment Contract Template",
    type: "template" as const,
    category: "Employment Law",
    downloads: 178,
    fileSize: "3.1 MB",
    author: "Emily Wilson",
    updatedAt: "2024-01-09",
    iconColor: "blue" as const,
  },
  {
    id: "5",
    title: "Real Estate Purchase Agreement",
    type: "template" as const,
    category: "Real Estate Law",
    downloads: 67,
    fileSize: "4.5 MB",
    author: "Alex Rodriguez",
    updatedAt: "2024-01-08",
    iconColor: "yellow" as const,
  },
];

export default function LegalContent() {
  const [isUploadModalOpen, SetIsUploadModalOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredDocuments = dummyDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      doc.category.toLowerCase().replace(" ", "-") === selectedCategory;
    const matchesType = selectedType === "all" || doc.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDownload = (id: string) => {
    console.log(" Download document:", id);
    // downloadDocument(id) // Uncomment when API is ready
  };

  const handleView = (id: string) => {
    console.log(" View document:", id);
    // Navigate to document viewer or open in new tab
  };

  const handleShare = (id: string) => {
    console.log(" Share document:", id);
    // Open share modal or copy link to clipboard
  };

  const handleUpload = () => {
    console.log(" Upload document clicked");
    // Open upload modal or file picker
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <DocumentHeader onUploadClick={() => SetIsUploadModalOpen(true)} />

        <DocumentFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDownload={handleDownload}
                onView={handleView}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          <DocumentTable
            documents={filteredDocuments}
            onDownload={handleDownload}
            onView={handleView}
            onShare={handleShare}
          />
        )}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-primary-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-primary-900 mb-2">
              No documents found
            </h3>
            <p className="text-primary-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
