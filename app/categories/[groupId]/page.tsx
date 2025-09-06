"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Topic {
  id: string;
  name: string;
  description: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  readTime?: string; // This is not in your API response for contents, consider if it's needed or derived
  GroupID: string; // Add GroupID as it's part of the Article interface you provided
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function TopicsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  const groupId = params.groupId as string;

  useEffect(() => {
    if (session && groupId) {
      // Ensure groupId is available before fetching
      fetchTopics();
    }
  }, [session, groupId]); // Add groupId to dependency array

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL}/api/v1/contents/group/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch topics");

      const responseData = await res.json();

      // Check if responseData.contents exists and is an array
      if (responseData && Array.isArray(responseData.contents)) {
        setTopics(responseData.contents);
      } else {
        console.warn(
          "API response for /api/v1/contents/group does not contain a 'contents' array or it is null:",
          responseData
        );
        setTopics([]); // Set to empty array if no topics found
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/categories">
        <Button variant="ghost">← Back to Categories</Button>
      </Link>

      {loading ? (
        <p className="text-center mt-4">Loading...</p>
      ) : (
        <div className="grid gap-4 mt-4">
          {topics.length > 0 ? (
            topics.map((topic, index) => (
              <MotionWrapper
                key={topic.id}
                animation="staggerIn"
                delay={index * 100}
              >
                <Card className="hover:shadow-md transition-all">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{topic.name}</h3>
                      {topic.difficulty && ( // Assuming difficulty could be part of the topic
                        <Badge className={difficultyColors[topic.difficulty]}>
                          {topic.difficulty}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{topic.description}</p>
                    <Button
                      onClick={() => router.push(`/articles/${topic.id}`)}
                      size="sm"
                    >
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))
          ) : (
            <p className="text-center mt-4">
              No topics found in this category.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
