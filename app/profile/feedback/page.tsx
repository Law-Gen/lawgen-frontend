"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FEEDBACK_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FeedbackForm() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get user id from localStorage/session (assume it's stored as 'user_id')
  function getUserId() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_id") || "";
    }
    return "";
  }

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

    const submitter_user_id = getUserId();
    if (!submitter_user_id) {
      setError("User ID not found. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("access_token") || "";
      }

      const res = await fetch(
        `${FEEDBACK_API_BASE_URL}/api/v1/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            submitter_user_id,
            type,
            description,
            severity,
          }),
        }
      );

      if (!res.ok) {
        let msg = "Failed to submit feedback";
        try {
          const errData = await res.json();
          msg = errData?.error || JSON.stringify(errData);
        } catch {}
        throw new Error(msg);
      }

      setSuccess("Feedback submitted successfully!");
      setType("");
      setDescription("");
      setSeverity("");
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg w-full mx-auto">
      <CardHeader>
        <CardTitle>Submit Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 flex items-center justify-between">
            <span>{success}</span>
            <button
              type="button"
              className="ml-4 text-green-700 hover:text-green-900 font-bold"
              onClick={() => setSuccess("")}
            >
              ×
            </button>
          </div>
        )}
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
