"use client";

import { useState, useEffect } from "react";
import { MainNavigation } from "@/components/ui/main-navigation";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useSession } from "next-auth/react";
import Link from "next/link";
// ADDED: Import the BottomNavigation component
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useTheme } from "next-themes"; // Add this import if you want theme toggle
import { Moon, Sun } from "lucide-react";

const FEEDBACK_API_BASE_URL = process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL;

// Custom fetch for legal aid using feedback base url with Bearer token
const fetchLegalAid = async (path: string, options: RequestInit = {}) => {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token") || "";
  }
  const res = await fetch(`${FEEDBACK_API_BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error("Failed to fetch legal aid data");
  return res.json();
};

// Frontend interface for a legal organization
interface LegalOrganization {
  id: string;
  name: string;
  type: "law_firm" | "legal_aid" | "pro_bono" | "government";
  specialties: string[];
  location: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  rating: number;
  verified: boolean;
  languages: string[];
  image?: string;
}

// Helper function to map API entity_type to our frontend type
const mapApiTypeToComponentType = (
  apiType: string
): LegalOrganization["type"] => {
  switch (apiType) {
    case "PRIVATE_LAW_FIRM":
      return "law_firm";
    case "LEGAL_AID_ORGANIZATION":
      return "legal_aid";
    // Add other mappings as needed
    default:
      return "government"; // Fallback type
  }
};

const organizationTypeLabels = {
  law_firm: "Law Firm",
  legal_aid: "Legal Aid",
  pro_bono: "Pro Bono",
  government: "Government",
};

const organizationTypeColors = {
  law_firm: "bg-primary text-primary-foreground",
  legal_aid: "bg-accent text-accent-foreground",
  pro_bono: "bg-secondary text-secondary-foreground",
  government: "bg-muted text-muted-foreground",
};

export default function LegalAidPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme(); // Add this line for theme toggle

  const [organizations, setOrganizations] = useState<LegalOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchLegalAid("/api/v1/legal-entities")
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          const formattedOrganizations = data.items.map(
            (item: any): LegalOrganization => ({
              id: item.id,
              name: item.name,
              type: mapApiTypeToComponentType(item.entity_type),
              specialties: item.services_offered || [],
              location: [
                item.street_address,
                item.woreda,
                item.sub_city,
                item.city,
              ]
                .filter(Boolean)
                .join(", "),
              phone: item.phone?.[0] || "Not Available",
              email: item.email?.[0] || "Not Available",
              website: item.website,
              description: item.description || "No description provided.",
              rating: 4.5,
              verified: item.status === "ACTIVE",
              languages: ["English", "Amharic"],
              image: item.image || undefined,
            })
          );
          setOrganizations(formattedOrganizations);
        } else {
          console.warn("Unexpected API response format:", data);
          setOrganizations([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch legal aid organizations");
        setLoading(false);
      });
  }, []);

  // Search and filter logic
  const filteredOrganizations = organizations.filter((org) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesName = org.name.toLowerCase().includes(lowerCaseQuery);
    const matchesSpecialty = org.specialties.some((specialty) =>
      specialty.toLowerCase().includes(lowerCaseQuery)
    );
    const matchesLocation = org.location.toLowerCase().includes(lowerCaseQuery);
    const matchesType = selectedType === "all" || org.type === selectedType;

    return (matchesName || matchesSpecialty || matchesLocation) && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="w-full flex items-center px-2 gap-4">
          <div className="flex flex-1 flex-col items-start min-w-0">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img
                  src="/logo (1).svg"
                  alt="LawGen Logo"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover border border-muted shadow"
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-primary truncate">
                  Legal Aid Directory
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  Find legal assistance near you
                </p>
              </div>
            </div>
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

      {/* Mobile Sidebar */}
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
          <MainNavigation />
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

      <div className="container mx-auto p-4">
        {/* Search and Filters */}
        <MotionWrapper animation="fadeInUp">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, specialty, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("all")}
                  >
                    All
                  </Button>
                  {Object.entries(organizationTypeLabels).map(
                    ([type, label]) => (
                      <Button
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(type)}
                        className="bg-transparent"
                      >
                        {label}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Loading and error states */}
        {loading && (
          <div className="flex justify-center items-center h-64 space-x-2">
            <span className="sr-only">Loading...</span>
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-64">
            <span className="text-lg text-destructive">{error}</span>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="grid gap-4">
              {organizations.map((org, index) => (
                <MotionWrapper
                  key={org.id}
                  animation="staggerIn"
                  delay={index * 100}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-primary">
                                {org.name}
                              </h3>
                              {org.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                className={organizationTypeColors[org.type]}
                              >
                                {organizationTypeLabels[org.type]}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-accent">★</span>
                                <span className="text-sm font-medium">
                                  {org.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {org.description}
                        </p>
                        {/* Specialties */}
                        <div>
                          <p className="text-sm font-medium text-primary mb-2">
                            Specialties:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {org.specialties.map((specialty) => (
                              <Badge
                                key={specialty}
                                variant="outline"
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {/* Languages */}
                        <div>
                          <p className="text-sm font-medium text-primary mb-2">
                            Languages:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {org.languages.map((language) => (
                              <Badge
                                key={language}
                                variant="secondary"
                                className="text-xs"
                              >
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {/* Contact Information */}
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              📍 {org.location}
                            </p>
                            <p className="text-muted-foreground">
                              📞 {org.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              ✉️ {org.email}
                            </p>
                            {org.website && (
                              <a
                                href={org.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                🌐 Visit Website
                              </a>
                            )}
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm">Contact</Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                          >
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </MotionWrapper>
              ))}
            </div>
            {organizations.length === 0 && (
              <MotionWrapper animation="fadeInUp">
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      No legal aid found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or browse all
                      organizations.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedType("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              </MotionWrapper>
            )}
          </>
        )}
      </div>

      {/* ADDED: Bottom Navigation for logged-in users on mobile */}
      {session && (
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}
