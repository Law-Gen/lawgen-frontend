"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Scale,
  FileText,
  Users,
  Building,
  Shield,
  Gavel,
  Home,
  Briefcase,
  Lightbulb,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { MainNavigation } from "@/components/ui/main-navigation";
const API_URL = process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL || "";
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

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("contract") || name.includes("agreement")) return FileText;
  if (name.includes("corporate") || name.includes("business")) return Building;
  if (name.includes("family") || name.includes("personal")) return Users;
  if (name.includes("criminal") || name.includes("defense")) return Shield;
  if (name.includes("litigation") || name.includes("court")) return Gavel;
  if (name.includes("real estate") || name.includes("property")) return Home;
  if (name.includes("employment") || name.includes("workplace"))
    return Briefcase;
  if (
    name.includes("intellectual property") ||
    name.includes("patent") ||
    name.includes("trademark")
  )
    return Lightbulb;
  if (
    name.includes("personal injury") ||
    name.includes("accident") ||
    name.includes("injury")
  )
    return Heart;
  if (
    name.includes("commercial") ||
    name.includes("commerce") ||
    name.includes("trade")
  )
    return Building;
  return Scale; // Default legal icon
};

const getCategoryDescription = (categoryName: string) => {
  const descriptions: { [key: string]: string } = {
    "Contract Law": "Agreements, terms, and legal obligations",
    "Corporate Law": "Business formation and compliance",
    "Family Law": "Marriage, divorce, and custody matters",
    "Criminal Law": "Defense and criminal proceedings",
    "Real Estate": "Property transactions and disputes",
    "Employment Law": "Workplace rights and regulations",
    "Intellectual Property": "Patents, trademarks, and copyrights",
    "Personal Injury": "Accident claims and compensation",
    "Commercial Law": "Business transactions and commercial disputes",
  };
  return descriptions[categoryName] || "Legal guidance and information";
};

const useSession = () => {
  return {
    data: { user: { name: "Demo User" } }, // Mock authenticated user
    status: "authenticated" as const,
  };
};

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
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
        if (!API_URL) {
          console.warn(
            "NEXT_PUBLIC_FEEDBACK_API_BASE_URL not set, using fallback data"
          );
          // Fallback categories for demo purposes
          setCategories([
            { group_id: "1", group_name: "Contract Law" },
            { group_id: "2", group_name: "Corporate Law" },
            { group_id: "3", group_name: "Family Law" },
            { group_id: "4", group_name: "Criminal Law" },
            { group_id: "5", group_name: "Employment Law" },
            { group_id: "6", group_name: "Intellectual Property" },
            { group_id: "7", group_name: "Personal Injury" },
            { group_id: "8", group_name: "Real Estate" },
            { group_id: "9", group_name: "Commercial Law" },
          ]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/v1/contents`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data.group || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([
          { group_id: "1", group_name: "Contract Law" },
          { group_id: "2", group_name: "Corporate Law" },
          { group_id: "3", group_name: "Family Law" },
          { group_id: "4", group_name: "Criminal Law" },
          { group_id: "5", group_name: "Employment Law" },
          { group_id: "6", group_name: "Intellectual Property" },
          { group_id: "7", group_name: "Personal Injury" },
          { group_id: "8", group_name: "Real Estate" },
          { group_id: "9", group_name: "Commercial Law" },
        ]);
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
          if (!process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL) {
            console.warn(
              "NEXT_PUBLIC_FEEDBACK_API_BASE_URL not set, using empty content"
            );
            setSelectedCategoryContent([]);
            setIsLoading(false);
            return;
          }

          const response = await fetch(
            `${API_URL}/api/v1/contents/group/${selectedCategory.group_id}`
          );
          console.log("Fetching content for category:", selectedCategory);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setSelectedCategoryContent(data.contents || []);
        } catch (error) {
          console.error("Failed to fetch category content:", error);
          setSelectedCategoryContent([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategoryContent();
    }
  }, [selectedCategory]);

  // UPDATED: Use the BouncingLoader component instead of static text
  if (isLoading) {
    return <BouncingLoader />;
  }

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 overflow-x-hidden">
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
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-transparent"
                >
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
              {/* MainNavigation component goes here */}
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
          {selectedCategoryContent.length === 0 ? (
            <div className="text-center py-16">
              <Scale className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No Content Available
              </h3>
              <p className="text-muted-foreground">
                Content for this category will be added by the administrator.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {selectedCategoryContent.map((content, index) => {
                const IconComponent = getCategoryIcon(content.name);

                return (
                  <MotionWrapper
                    key={content.id}
                    animation="staggerIn"
                    delay={index * 100}
                  >
                    <a
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer h-full bg-card/90 backdrop-blur-sm border-border/50 hover:border-accent/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <CardHeader className="relative z-10 pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {content.language.toUpperCase()}
                            </Badge>
                          </div>

                          <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors duration-300 text-balance mb-3">
                            {content.name}
                          </CardTitle>

                          <p className="text-sm text-muted-foreground leading-relaxed text-pretty line-clamp-3">
                            {content.description}
                          </p>
                        </CardHeader>

                        <CardContent className="relative z-10 pt-0 pb-6">
                          <div className="flex items-center justify-between pt-4 border-t border-border/30">
                            <span className="text-sm font-medium text-muted-foreground">
                              Legal Resource
                            </span>
                            <span className="text-sm text-accent group-hover:text-accent/80 transition-colors flex items-center gap-1">
                              View Details
                              <FileText className="w-4 h-4" />
                            </span>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </CardContent>
                      </Card>
                    </a>
                  </MotionWrapper>
                );
              })}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 overflow-x-hidden">
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
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-transparent"
              >
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
            {/* MainNavigation component goes here */}
            <MainNavigation/>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = getCategoryIcon(category.group_name);
            const description = getCategoryDescription(category.group_name);

            return (
              <MotionWrapper
                key={category.group_id}
                animation="staggerIn"
                delay={index * 100}
              >
                <Card
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer h-full bg-card/90 backdrop-blur-sm border-border/50 hover:border-accent/30"
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="relative z-10 text-center pb-4">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors duration-300 text-balance">
                      {category.group_name}
                    </CardTitle>

                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed text-pretty">
                      {description}
                    </p>
                  </CardHeader>

                  <CardContent className="relative z-10 text-center pt-0 pb-6">
                    <Button
                      className="w-full group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg bg-primary hover:bg-accent text-primary-foreground font-medium"
                      size="lg"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {t("explore_topics")}
                        <Scale className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      </span>
                    </Button>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </CardContent>
                </Card>
              </MotionWrapper>
            );
          })}
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
