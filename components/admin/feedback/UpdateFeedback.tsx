"use client";

import {
  X,
  User,
  Calendar,
  Monitor,
  AlertTriangle,
  Lightbulb,
  Zap,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";

import { motion, AnimatePresence } from "framer-motion";
import type { Feedback } from "@/src/store/slices/feedbackSlice";

interface UpdateFeedbackProps {
  feedback: Feedback | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (feedbackId: string, updates: Partial<Feedback>) => void;
  //   onUpdateType: (feedbackId: string, updates: Partial<Feedback>) => void;
  //   onUpdateSeverity: (feedback: string, updates: Partial<Feedback>) => void;
}

const statusLabels = {
  "in-progress": "In Progress",
  "under-review": "Under Review",
  resolved: "Resolved",
};

const statusColors = {
  open: "bg-red-100 text-red-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "under-review": "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
};

const severityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

export default function UpdateFeedback({
  feedback,
  isOpen,
  onClose,
  onUpdateStatus,
}: UpdateFeedbackProps) {
  if (!feedback) return null;

  const handleSave = () => {
    console.log("[v0] Saving feedback updates for:", feedback.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Update Feedback Status
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Status
                  </label>
                  <Select defaultValue="">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Internal Notes
                  </label>
                  <Textarea
                    placeholder="Add internal notes about this feedback..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Current Details</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Submitted by:</span>{" "}
                      {feedback.submitter_user_id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {feedback.timestamp}
                    </span>
                  </div>

                  {feedback.type && (
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Device:</span>{" "}
                        {feedback.id}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Description</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {feedback.description}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Button onClick={handleSave} className="w-full">
                  ✓ Update Status
                </Button>

                <Button variant="ghost" onClick={onClose} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
