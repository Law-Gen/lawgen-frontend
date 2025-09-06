"use client";

import { useState, useEffect } from "react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MainNavigation } from "@/components/ui/main-navigation";
import { useTheme } from "next-themes";

interface LegalCategory {
  id: string;
  name: string;
  description: string;
  url: string;
  language: string;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/auth/signin";
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchGroups();
    }
  }, [status]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL}/api/v1/contents`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      const data = await res.json();
      setGroups(data.group || []);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContents = async (group: Group) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL}/api/v1/contents/group/${group.group_id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      const data = await res.json();
      setContents(data.contents || []);
      setSelectedGroup(group);
    } catch (err) {
      console.error("Failed to fetch contents:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 overflow-x-hidden">
      {/* Mobile Sidebar (RIGHT SIDE) */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity ${
          sidebarOpen ? "block md:hidden" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[101] h-full w-64 bg-card dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6 gap-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-primary">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="text-2xl"
            >
              &times;
            </button>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-2 py-1 rounded border w-full flex items-center gap-2"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <LanguageToggle />
          {!session && (
            <Link href="/auth/signin" className="w-full">
              <Button size="lg" variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </aside>

      {/* Header (kept exactly like your code) */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="w-full flex items-center px-2 gap-4">
          <div className="flex flex-col items-start min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-primary truncate">
              Legal Categories
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Explore legal topics by category
            </p>
          </div>
          <div className="md:hidden" style={{ marginLeft: "4px" }}>
            <button
              className="p-0 bg-transparent border-none shadow-none outline-none focus:outline-none"
              style={{ lineHeight: 0 }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h12M4 10h12M4 14h12" />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex flex-1 justify-center">
            <MainNavigation />
          </div>
          <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-1 rounded border"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <LanguageToggle />
            {!session && (
              <Link href="/auth/signin">
                <Button size="sm" variant="outline" className="bg-transparent">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="container mx-auto px-2 mt-4">
        {selectedGroup ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedGroup(null)}
            className="hover:scale-105 transition-transform"
          >
            ← Back to Categories
          </Button>
        ) : (
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="hover:scale-105 transition-transform"
            >
              ← Back
            </Button>
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : selectedGroup ? (
          <div className="grid gap-4">
            {contents.map((content, index) => (
              <MotionWrapper
                key={content.id}
                animation="staggerIn"
                delay={index * 100}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                  <CardContent className="p-4 md:p-6 space-y-2">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-primary">
                        {content.name}
                      </h3>
                      <Badge variant="outline">{content.language}</Badge>
                    </div>
                  
                    <a
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="hover:scale-105 transition-transform"
                      >
                        Open PDF
                      </Button>
                    </a>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:scale-105 transition-transform w-full"
                      >
                        Explore Topics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {groups.map((group, index) => (
              <MotionWrapper
                key={group.group_id}
                animation="staggerIn"
                delay={index * 100}
              >
                <Card
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                  onClick={() => fetchContents(group)}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-primary">
                      {group.group_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2 md:space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Click to explore contents
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:scale-105 transition-transform w-full"
                      >
                        Explore Topics
                      </Button>
                    </div>
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
