"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/ui/language-toggle"; // Assuming this is used elsewhere
import { BottomNavigation } from "@/components/ui/bottom-navigation"; // Assuming this is used elsewhere
import { MainNavigation } from "@/components/ui/main-navigation"; // Assuming this is used elsewhere

interface Group {
  group_id: string;
  group_name: string;
  description?: string;
  topicCount?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

// Assuming difficultyColors are defined somewhere or removed if not used here
const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme(); // Assuming theme is used
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetchGroups();
    }
  }, [status]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL}/api/v1/contents`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch categories");

      const responseData = await res.json(); // Renamed to avoid conflict with `data`

      // Check if responseData.group exists and is an array
      if (responseData && Array.isArray(responseData.group)) {
        // The API directly returns an array of groups under the 'group' key.
        // No need for `Array.from(new Map(...))` if `group_id` is already unique.
        // If you still want to ensure uniqueness based on group_id, you can keep the Map logic.
        const uniqueGroups: Group[] = Array.from(
          new Map(
            responseData.group.map((g: Group) => [g.group_id, g])
          ).values()
        );
        setGroups(uniqueGroups);
      } else {
        console.warn(
          "API response for /api/v1/contents does not contain a 'group' array:",
          responseData
        );
        setGroups([]); // Set to empty array if no groups found
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-primary">
            Legal Categories
          </h1>
          <MainNavigation />
        </div>
      </header>

      <div className="container mx-auto p-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group, index) => (
              <MotionWrapper
                key={group.group_id}
                animation="staggerIn"
                delay={index * 100}
              >
                <Card
                  className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                  onClick={() => router.push(`/categories/${group.group_id}`)}
                >
                  <CardHeader className="text-center">
                    <CardTitle>{group.group_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <p className="text-muted-foreground text-sm">
                      Explore legal topics
                    </p>
                    <Button className="w-full">Explore Topics</Button>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        )}
      </div>

      {session && (
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}
