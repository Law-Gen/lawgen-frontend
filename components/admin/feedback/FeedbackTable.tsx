"use client";

import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  AlertTriangle,
  Lightbulb,
  Zap,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import type { Feedback } from "@/src/store/slices/feedbackSlice";

interface FeedbackTableProps {
  feedbacks: Feedback[];
  onViewDetails: (feedback: Feedback) => void;
}

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
  "in-progress": "In Progress",
  "under-review": "Under Review",
  resolved: "Resolved",
};

export default function FeedbackTable({
  feedbacks,
  onViewDetails,
}: FeedbackTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">FEEDBACK</TableHead>
            <TableHead className="font-semibold">TYPE</TableHead>
            <TableHead className="font-semibold">SEVERITY</TableHead>
            <TableHead className="font-semibold">STATUS</TableHead>
            <TableHead className="font-semibold">SUBMITTED BY</TableHead>
            <TableHead className="font-semibold">DATE</TableHead>
            <TableHead className="font-semibold">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => {
            return (
              <TableRow key={feedback.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-foreground line-clamp-1">
                        {feedback.type}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                        {feedback.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {feedback.type.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={severityColors[feedback.severity]}
                  >
                    {feedback.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      statusColors[
                        feedback.status as keyof typeof statusColors
                      ] ?? ""
                    }
                  >
                    {statusLabels[
                      feedback.status as keyof typeof statusLabels
                    ] ?? feedback.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {feedback.submitter_user_id}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {feedback.timestamp}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(feedback)}
                    className="text-primary hover:text-primary-foreground"
                  >
                    View
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
