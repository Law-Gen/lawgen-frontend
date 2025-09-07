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
import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

// Define interfaces for the data fetched from the API
interface ApiGroup {
  group_id: string;
  group_name: string;
}

interface ApiContent {
  id: string;
  GroupID: string;
  group_name: string;
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

// NEW: Bouncing dots loader component
const BouncingLoader = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/auth/signin";
    }
  }, [status]);
  const [categories, setCategories] = useState<ApiGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ApiGroup | null>(
    null
  );
  const [selectedCategoryContent, setSelectedCategoryContent] = useState<
    ApiContent[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use the environment variable for the API endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL}/api/v1/contents`
        );
        const data = await response.json();
        setCategories(data.group);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch content for the selected category
  useEffect(() => {
    if (selectedCategory) {
      const fetchCategoryContent = async () => {
        setIsLoading(true);
        try {
          // Use the environment variable for the API endpoint
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL}/api/v1/contents/group/${selectedCategory.group_id}`
          );
          const data = await response.json();
          setSelectedCategoryContent(data.contents);
        } catch (error) {
          console.error("Failed to fetch category content:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategoryContent();
    }
  }, [selectedCategory]);

  // UPDATED: Use the BouncingLoader component instead of static text
  if (status === "loading" || isLoading) {
    return <BouncingLoader />;
  }

  if (status === "unauthenticated") {
    window.location.href = "/auth/signin";
    return null;
  }

  if (selectedCategory) {
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
                          className="px-2 py-1 rounded border"
                          aria-label="Toggle dark mode"
                          title="Toggle dark mode"
                        >
                          {theme === "dark" ? (
                            <Moon className="w-4 h-4" />
                          ) : (
                            <Sun className="w-4 h-4" />
                          )}
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

        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
          <div className="w-full flex items-center px-2 gap-4">
            {/* Left: Title and description */}
            <div className="flex flex-col items-start min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-primary truncate">
                {selectedCategory.group_name}
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                Explore topics in this category
              </p>
            </div>
            {/* Hamburger icon for mobile */}
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
            {/* Center: Main navigation (desktop only) */}
            <div className="hidden md:flex flex-1 justify-center">
              <MainNavigation />
            </div>
            {/* Right: Language toggle, dark mode, and sign in (desktop only) */}
            <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
                 <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="px-2 py-1 rounded border"
                            aria-label="Toggle dark mode"
                            title="Toggle dark mode"
                          >
                            {theme === "dark" ? (
                              <Moon className="w-4 h-4" />
                            ) : (
                              <Sun className="w-4 h-4" />
                            )}
                          </button>
              <LanguageToggle />
              {!session && (
                <Link href="/auth/signin">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="hover:scale-105 transition-transform"
          >
            ← Back to Categories
          </Button>
        </div>

        <div className="container mx-auto p-4">
          <div className="grid gap-4">
            {selectedCategoryContent.map((content, index) => (
              <MotionWrapper
                key={content.id}
                animation="staggerIn"
                delay={index * 100}
              >
                <a
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                    <CardContent className="p-4 md:p-6 space-y-2">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-primary">
                          {content.name}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {content.description}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </MotionWrapper>
            ))}
          </div>
        </div>

        {session && (
          <div className="md:hidden">
            <BottomNavigation />
          </div>
        )}
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
                     className="px-2 py-1 rounded border"
                     aria-label="Toggle dark mode"
                     title="Toggle dark mode"
                   >
                     {theme === "dark" ? (
                       <Moon className="w-4 h-4" />
                     ) : (
                       <Sun className="w-4 h-4" />
                     )}
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

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="w-full flex items-center px-2 gap-4">
          <div className="flex-shrink-0">
            <img
              src="/logo (1).svg"
              alt="LawGen Logo"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover border border-muted shadow"
            />
          </div>
          {/* Left: Title and description */}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-primary truncate">
              Legal Categories
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Explore legal topics by category
            </p>
          </div>
          {/* Hamburger icon for mobile */}
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
          {/* Center: Main navigation (desktop only) */}
          <div className="hidden md:flex flex-1 justify-center">
            <MainNavigation />
          </div>
          {/* Right: Language toggle, dark mode, and sign in (desktop only) */}
          <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
            <button
                       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                       className="px-2 py-1 rounded border"
                       aria-label="Toggle dark mode"
                       title="Toggle dark mode"
                     >
                       {theme === "dark" ? (
                         <Moon className="w-4 h-4" />
                       ) : (
                         <Sun className="w-4 h-4" />
                       )}
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
      <div className="container mx-auto px-2 mt-4">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="hover:scale-105 transition-transform"
          >
            ← Back
          </Button>
        </Link>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <MotionWrapper
              key={category.group_id}
              animation="staggerIn"
              delay={index * 100}
            >
              <Card
                className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer h-full bg-gradient-to-br from-primary/5 to-accent/10 border-border/50"
                onClick={() => setSelectedCategory(category)}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-primary">
                    {category.group_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2 md:space-y-4">
                  <Button className="w-full hover:scale-105 transition-transform mt-2 shadow-md">
                    {t("explore_topics")}
                  </Button>
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      </div>

      {session && (
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}
