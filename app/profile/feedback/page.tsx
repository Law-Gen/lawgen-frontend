"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "next-themes";

// Extend the session user type to include 'id'
declare module "next-auth" {
  interface User {
    id: string;
  }
}

interface Feedback {
  id: string;
  submitter_user_id: string;
  type: string;
  description: string;
  severity: string;
  timestamp: string;
}

export default function FeedbackPage() {
  const { data: session } = useSession();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/v1/feedback`)
      .then((res) => res.json())
      .then((data) => {
        // Only show feedback submitted by this user
        setFeedbacks(
          data.filter(
            (f: Feedback) => f.submitter_user_id === session?.user?.id
          )
        );
      });
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!type || !description || !severity) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submitter_user_id: session?.user?.id,
          type,
          description,
          severity,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      const data = await res.json();
      setSuccess("Feedback submitted successfully!");
      setFeedbacks((prev) => [data, ...prev]);
      setType("");
      setDescription("");
      setSeverity("");
    } catch (err) {
      setError("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Bug Report, Suggestion, etc."
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your feedback in detail"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>
                  Select severity
                </option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Your Feedback</h2>
        {feedbacks.length === 0 ? (
          <p className="text-muted-foreground">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <Card key={fb.id}>
                <CardHeader>
                  <CardTitle>
                    {fb.type}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({fb.severity})
                    </span>
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {new Date(fb.timestamp).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div>{fb.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full bg-primary text-white shadow-md"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
}
