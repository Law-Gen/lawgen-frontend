"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  UpdateFeedback,
  FeedbackTable,
  FeedbackCard,
  FeedbackFilter,
} from "@/components/admin/feedback";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchFeedbacks,
  setSelectedFeedback,
  updateFeedbackStatus,
} from "@/src/store/slices/feedbackSlice";
import type { Feedback } from "@/src/store/slices/feedbackSlice";

function applyLocalStatus(feedbacks: Feedback[]): Feedback[] {
  // Get local status changes from localStorage
  let localChanges: Record<string, any> = {};
  try {
    localChanges = JSON.parse(
      localStorage.getItem("feedbackStatusChanges") || "{}"
    );
  } catch (e) {}
  return feedbacks.map((fb) => {
    const local = localChanges[fb.id];
    return local ? { ...fb, ...local } : fb;
  });
}

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useAppDispatch();
  const feedbacks = useAppSelector((state) => state.feedback.feedbacks);
  const loading = useAppSelector((state) => state.feedback.loading);
  const error = useAppSelector((state) => state.feedback.error);
  const selectedFeedback = useAppSelector(
    (state) => state.feedback.selectedFeedback
  );

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  // Normalize and filter feedbacks
  const normalizeSeverity = (sev: string): "high" | "medium" | "low" => {
    if (!sev) return "low";
    const s = sev.toLowerCase();
    if (s === "high") return "high";
    if (s === "medium") return "medium";
    return "low";
  };
  const normalizeStatus = (
    status: string | undefined
  ): "in-progress" | "under-review" | "resolved" => {
    if (!status) return "in-progress";
    if (["in-progress", "under-review", "resolved"].includes(status))
      return status as any;
    return "in-progress";
  };

  // Merge local status before mapping/filtering
  const feedbacksWithStatus = applyLocalStatus(feedbacks);
  const filteredFeedbacks = feedbacksWithStatus
    .map((feedback) => ({
      ...feedback,
      severity: normalizeSeverity(feedback.severity),
      status: normalizeStatus((feedback as any).status),
      type: feedback.type && feedback.type.trim() ? feedback.type : "General",
      description:
        feedback.description && feedback.description.trim()
          ? feedback.description
          : "No description provided.",
      submitter_user_id:
        feedback.submitter_user_id && feedback.submitter_user_id.trim()
          ? feedback.submitter_user_id
          : "Anonymous",
    }))
    .filter((feedback) => {
      const matchesSearch =
        feedback.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.submitter_user_id
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || feedback.type === typeFilter;
      const matchesSeverity =
        severityFilter === "all" || feedback.severity === severityFilter;
      const matchesStatus =
        statusFilter === "all" || feedback.status === statusFilter;
      return matchesSearch && matchesType && matchesSeverity && matchesStatus;
    });

  const handleViewDetails = (feedback: Feedback) => {
    dispatch(setSelectedFeedback(feedback));
    setSidebarOpen(true);
  };

  const handleUpdateStatus = (
    feedbackId: string,
    updates: Partial<Feedback>
  ) => {
    dispatch(updateFeedbackStatus({ id: feedbackId, updates }));
    console.log("[v0] Updated feedback:", feedbackId, updates);
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

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading feedbacks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">
                <p className="font-medium">Error loading feedbacks</p>
                <p className="text-sm">{error}</p>
              </div>
              <button 
                onClick={() => dispatch(fetchFeedbacks())}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {feedbacks.length === 0 
                  ? "No feedbacks available. Check your API connection or try refreshing the page."
                  : "No feedback found matching your criteria."
                }
              </p>
              {feedbacks.length === 0 && (
                <button 
                  onClick={() => dispatch(fetchFeedbacks())}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Refresh
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
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
