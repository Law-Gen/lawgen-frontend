"use client";

import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Deadline {
  title: string;
  taskName: string;
  date: string;
  priority: "high" | "medium" | "low";
}

function calculateDaysLeft(date: string) {
  const today = new Date();
  const deadlineDate = new Date(date);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays} days left` : "Expired";
}

export default function UpcomingDeadlines() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Deadline>({
    title: "",
    taskName: "",
    date: "",
    priority: "low",
  });

  useEffect(() => {
    const storedDeadlines: string | null = localStorage.getItem("deadlines");
    if (storedDeadlines) {
      setDeadlines(JSON.parse(storedDeadlines));
    } else {
      const initialData: Deadline[] = [
        {
          title: "File Motion to Dismiss",
          taskName: "Smith vs. Johnson",
          date: "2024-01-15",
          priority: "high",
        },
        {
          title: "Submit Discovery Documents",
          taskName: "ABC Corp Merger",
          date: "2024-01-18",
          priority: "medium",
        },
      ];
      setDeadlines(initialData);
      localStorage.setItem("deadlines", JSON.stringify(initialData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  const addDeadline = () => {
    if (!newDeadline.title || !newDeadline.taskName || !newDeadline.date) {
      alert("please fill in all fields");
      return;
    }

    setDeadlines([...deadlines, newDeadline]);
    setNewDeadline({ title: "", taskName: "", date: "", priority: "low" });
    setShowModal(false);
  };

  const removeDeadline = (index: number) => {
    const update = deadlines.filter((_, i) => i !== index);
    setDeadlines(update);
  };

  const priorityDot = (priority: "high" | "medium" | "low") =>
    priority === "high"
      ? "bg-destructive"
      : priority === "medium"
      ? "bg-chart-4"
      : "bg-muted";

  const priorityBadge = (priority: "high" | "medium" | "low") =>
    priority === "high"
      ? "bg-destructive/15 text-destructive"
      : priority === "medium"
      ? "bg-chart-4/15 text-chart-4"
      : "bg-muted text-muted-foreground";

  return (
    <>
      {/* Upcoming Deadlines Card */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Upcoming Deadlines
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary"
          >
            View Calendar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {deadlines.map((item, index) => (
              <div key={index} className="flex items-center gap-3 py-2">
                <div className={`w-2 h-2 rounded-full ${priorityDot(item.priority)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.taskName}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <Badge className={`px-2 py-1 rounded-full text-xs ${priorityBadge(item.priority)}`}>
                  {calculateDaysLeft(item.date)}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDeadline(index)}
                  className="text-xs text-destructive hover:bg-destructive/10 ml-2"
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              className="mt-4 w-full border-dashed border-border text-card-foreground hover:bg-accent"
              onClick={() => setShowModal(true)}
            >
              + Add New Deadline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Adding Deadline */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="bg-card border border-border rounded-lg p-6 w-96 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold mb-4 text-card-foreground">
                Add New Deadline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                placeholder="Title"
                value={newDeadline.title}
                onChange={(e) =>
                  setNewDeadline({ ...newDeadline, title: e.target.value })
                }
                className="w-full bg-background border border-border text-foreground rounded px-3 py-2 mb-3"
              />
              <input
                type="text"
                placeholder="Case Name"
                value={newDeadline.taskName}
                onChange={(e) =>
                  setNewDeadline({ ...newDeadline, taskName: e.target.value })
                }
                className="w-full bg-background border border-border text-foreground rounded px-3 py-2 mb-3"
              />
              <input
                type="date"
                value={newDeadline.date}
                onChange={(e) =>
                  setNewDeadline({ ...newDeadline, date: e.target.value })
                }
                className="w-full bg-background border border-border text-foreground rounded px-3 py-2 mb-3"
              />
              <select
                value={newDeadline.priority}
                onChange={(e) =>
                  setNewDeadline({
                    ...newDeadline,
                    priority: e.target.value as "high" | "medium" | "low",
                  })
                }
                className="w-full bg-background border border-border text-foreground rounded px-3 py-2 mb-3"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button onClick={addDeadline} className="px-4 py-2">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
