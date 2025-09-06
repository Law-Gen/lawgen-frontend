"use client";

import { useState, useEffect } from "react";
import { MainNavigation } from "@/components/ui/main-navigation";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  const { data: session } = useSession();

  // Fetched organizations from backend
  const [organizations, setOrganizations] = useState<LegalOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchLegalAid("/api/v1/legal-entities")
      .then((data) => {
        setOrganizations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch legal aid organizations");
        setLoading(false);
      });
  }, []);

  // No search or filter logic; use organizations directly
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="w-full flex items-center px-2 gap-4">
          {/* Left: Title and description */}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-primary truncate">
              Legal Aid Directory
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Find legal assistance near you
            </p>
          </div>
          {/* Hamburger icon for mobile */}
          <div className="md:hidden" style={{ marginLeft: "4px" }}>
            {/* Hamburger icon and mobile nav logic can be added here if needed */}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar (RIGHT SIDE) */}

      <div className="container mx-auto p-4">
        {/* Search and Filters */}

        {/* Loading and error states (below search) */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <span className="text-lg text-muted-foreground">
              Loading legal aid organizations...
            </span>
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
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Organization Image */}
                        <div className="flex-shrink-0">
                          <Avatar className="w-16 h-16 md:w-20 md:h-20">
                            <AvatarImage
                              src={org.image || "/placeholder.svg"}
                              alt={org.name}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                              {org.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        {/* Organization Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-primary">
                                  {org.name}
                                </h3>
                                {org.verified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
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
                            <Button
                              size="sm"
                              className="hover:scale-105 transition-transform"
                            >
                              Contact
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:scale-105 transition-transform bg-transparent"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:scale-105 transition-transform bg-transparent"
                            >
                              Share
                            </Button>
                          </div>
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
                      onClick={() => {}}
                      className="hover:scale-105 transition-transform"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              </MotionWrapper>
            )}
          </>
        )}

        {/* Call to Action */}
        <MotionWrapper animation="fadeInUp">
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-primary mb-2">
                Need Help Finding the Right Legal Aid?
              </h3>
              <p className="text-muted-foreground mb-4">
                Our AI assistant can help you find the most suitable legal
                organization for your specific needs.
              </p>
              <Link href="/chat">
                <Button className="hover:scale-105 transition-transform">
                  Ask AI Assistant
                </Button>
              </Link>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>

      {/* Bottom Navigation - Only for logged-in users */}
      {session && <BottomNavigation />}
    </div>
  );
}
