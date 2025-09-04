"use client";

import { Badge, Button, Card, CardContent } from "@/components/ui";
import {
  AlertTriangle,
  Lightbulb,
  Zap,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

export interface Feedback {
  id: string;
  title: string;
  description: string;
  type: "bug" | "feature" | "improvement" | "general";
  severity: "high" | "medium" | "low";
  status: "open" | "in-progress" | "under-review" | "resolved";
  submittedBy: string;
  submittedByEmail: string;
  date: string;
  device?: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
  onViewDetails: (feedback: Feedback) => void;
}

const typeIcons = {
  bug: AlertTriangle,
  feature: Lightbulb,
  improvement: Zap,
  general: MessageCircle,
};

const typeColors = {
  bug: "text-red-600 bg-red-50",
  feature: "text-yellow-600 bg-yellow-50",
  improvement: "text-blue-600 bg-blue-50",
  general: "text-gray-600 bg-gray-50",
};

const severityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const statusColors = {
  open: "bg-red-100 text-red-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "under-review": "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
};

const statusLabels = {
  open: "Open",
  "in-progress": "In Progress",
  "under-review": "Under Review",
  resolved: "Resolved",
};

export default function FeedbackCard({
  feedback,
  onViewDetails,
}: FeedbackCardProps) {
  const TypeIcon = typeIcons[feedback.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg ${typeColors[feedback.type]}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={statusColors[feedback.status]}
              >
                {statusLabels[feedback.status]}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                {feedback.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                {feedback.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {feedback.type.replace("-", " ")}
              </Badge>
              <Badge
                variant="outline"
                className={severityColors[feedback.severity]}
              >
                {feedback.severity}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Submitted by:</span>{" "}
                {feedback.submittedBy}
              </div>
              <div>
                <span className="font-medium">Date:</span> {feedback.date}
              </div>
              {/* <div>
                <span className="font-medium">Category:</span>{" "}
                {feedback.category}
              </div> */}
            </div>

            <Button
              onClick={() => onViewDetails(feedback)}
              className="w-full mt-4"
              variant="default"
            >
              View Details
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
