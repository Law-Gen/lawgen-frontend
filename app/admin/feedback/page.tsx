"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  UpdateFeedback,
  FeedbackTable,
  FeedbackCard,
  FeedbackFilter,
} from "@/components/admin/feedback";
import { Feedback } from "@/components/admin/feedback/FeedbackCard";

const dummyFeedbacks: Feedback[] = [
  {
    id: "1",
    title: "Quiz submission not working",
    description:
      "When I try to submit a quiz, the page freezes and I lose all my progress. This happens consistently on Chrome browser.",
    type: "bug",
    severity: "high",
    status: "open",
    submittedBy: "John Smith",
    submittedByEmail: "john.smith@lawfirm.com",
    date: "2024-01-15",
    device: "Desktop",
  },
  {
    id: "2",
    title: "Dark mode support",
    description:
      "It would be great to have a dark mode option for better viewing experience during night time study sessions.",
    type: "feature",
    severity: "low",
    status: "under-review",
    submittedBy: "Sarah Johnson",
    submittedByEmail: "sarah.johnson@lawfirm.com",
    date: "2024-01-14",
  },
  {
    id: "3",
    title: "Document download fails",
    description:
      "Legal documents are not downloading properly. Getting a 404 error when clicking download button on PDF files.",
    type: "bug",
    severity: "medium",
    status: "in-progress",
    submittedBy: "Michael Brown",
    submittedByEmail: "michael.brown@lawfirm.com",
    date: "2024-01-13",
  },
  {
    id: "4",
    title: "Search functionality enhancement",
    description:
      "The search feature could be improved with filters and advanced search options for better content discovery.",
    type: "improvement",
    severity: "medium",
    status: "open",
    submittedBy: "Emily Wilson",
    submittedByEmail: "emily.wilson@legal.com",
    date: "2024-01-12",
  },
  {
    id: "5",
    title: "User profile update error",
    description:
      "Cannot update profile information. Form validation shows errors even when all fields are filled correctly.",
    type: "bug",
    severity: "high",
    status: "open",
    submittedBy: "Alex Rodriguez",
    submittedByEmail: "alex@example.com",
    date: "2024-01-11",
  },
  {
    id: "6",
    title: "Great platform overall",
    description:
      "Really enjoying the platform. The quiz system is intuitive and the legal content library is comprehensive.",
    type: "general",
    severity: "low",
    status: "resolved",
    submittedBy: "Lisa Chen",
    submittedByEmail: "lisa.chen@lawschool.edu",
    date: "2024-01-10",
  },
];

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredFeedbacks = dummyFeedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || feedback.type === typeFilter;
    const matchesSeverity =
      severityFilter === "all" || feedback.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" || feedback.status === statusFilter;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setSidebarOpen(true);
  };

  const handleUpdateStatus = (
    feedbackId: string,
    updates: Partial<Feedback>
  ) => {
    // TODO: Implement API call to update feedback
    console.log("[v0] Updating feedback:", feedbackId, updates);
  };

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text 3xl font-bold text-gray-900"> Feedbacks </h1>
          </div>

          <FeedbackFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            severityFilter={severityFilter}
            onSeverityChange={setSeverityFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            feedbackCount={filteredFeedbacks.length}
          />

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <FeedbackTable
              feedbacks={filteredFeedbacks}
              onViewDetails={handleViewDetails}
            />
          )}
          {filteredFeedbacks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No feedback found matching your criteria.
              </p>
            </div>
          )}
        </div>
        <UpdateFeedback
          feedback={selectedFeedback}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      </AdminLayout>
    </>
  );
}
