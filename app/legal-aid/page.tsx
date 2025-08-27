"use client"

import { useState } from "react"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { BottomNavigation } from "@/components/ui/bottom-navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface LegalOrganization {
  id: string
  name: string
  type: "law_firm" | "legal_aid" | "pro_bono" | "government"
  specialties: string[]
  location: string
  phone: string
  email: string
  website?: string
  description: string
  rating: number
  verified: boolean
  languages: string[]
  image?: string
}

const mockOrganizations: LegalOrganization[] = [
  {
    id: "1",
    name: "Ethiopian Legal Aid Center",
    type: "legal_aid",
    specialties: ["Family Law", "Employment Rights", "Housing"],
    location: "Addis Ababa, Ethiopia",
    phone: "+251-11-123-4567",
    email: "info@elac.org.et",
    website: "https://elac.org.et",
    description: "Providing free legal assistance to low-income individuals and families across Ethiopia.",
    rating: 4.8,
    verified: true,
    languages: ["English", "Amharic"],
    image: "/legal-aid-center-building.png",
  },
  {
    id: "2",
    name: "Addis Legal Services",
    type: "law_firm",
    specialties: ["Business Law", "Contract Review", "Intellectual Property"],
    location: "Addis Ababa, Ethiopia",
    phone: "+251-11-234-5678",
    email: "contact@addislegal.com",
    website: "https://addislegal.com",
    description: "Full-service law firm specializing in business and commercial law matters.",
    rating: 4.6,
    verified: true,
    languages: ["English", "Amharic"],
    image: "/modern-law-firm-office.png",
  },
  {
    id: "3",
    name: "Women's Rights Legal Clinic",
    type: "pro_bono",
    specialties: ["Women's Rights", "Domestic Violence", "Divorce"],
    location: "Addis Ababa, Ethiopia",
    phone: "+251-11-345-6789",
    email: "help@wrlc.org.et",
    description: "Dedicated to protecting and advancing women's legal rights through free legal services.",
    rating: 4.9,
    verified: true,
    languages: ["English", "Amharic", "Oromo"],
    image: "/womens-rights-clinic.png",
  },
  {
    id: "4",
    name: "Ministry of Justice Legal Aid",
    type: "government",
    specialties: ["Criminal Defense", "Civil Rights", "Administrative Law"],
    location: "Addis Ababa, Ethiopia",
    phone: "+251-11-456-7890",
    email: "legalaid@moj.gov.et",
    website: "https://moj.gov.et",
    description: "Government-provided legal assistance for citizens in need of legal representation.",
    rating: 4.3,
    verified: true,
    languages: ["English", "Amharic"],
    image: "/government-building.png",
  },
]

const organizationTypeLabels = {
  law_firm: "Law Firm",
  legal_aid: "Legal Aid",
  pro_bono: "Pro Bono",
  government: "Government",
}

const organizationTypeColors = {
  law_firm: "bg-primary text-primary-foreground",
  legal_aid: "bg-accent text-accent-foreground",
  pro_bono: "bg-secondary text-secondary-foreground",
  government: "bg-muted text-muted-foreground",
}

export default function LegalAidPage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")

  const filteredOrganizations = mockOrganizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
      org.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "all" || org.type === selectedType

    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                ← Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-primary">Legal Aid Directory</h1>
              <p className="text-sm text-muted-foreground">Find legal assistance near you</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
                    className="hover:scale-105 transition-transform"
                  >
                    All
                  </Button>
                  {Object.entries(organizationTypeLabels).map(([type, label]) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className="hover:scale-105 transition-transform bg-transparent"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Results */}
        <div className="grid gap-4">
          {filteredOrganizations.map((org, index) => (
            <MotionWrapper key={org.id} animation="staggerIn" delay={index * 100}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Organization Image */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-16 h-16 md:w-20 md:h-20">
                        <AvatarImage src={org.image || "/placeholder.svg"} alt={org.name} />
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
                            <h3 className="text-lg font-semibold text-primary">{org.name}</h3>
                            {org.verified && (
                              <Badge variant="secondary" className="text-xs">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={organizationTypeColors[org.type]}>
                              {organizationTypeLabels[org.type]}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <span className="text-accent">★</span>
                              <span className="text-sm font-medium">{org.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">{org.description}</p>

                      {/* Specialties */}
                      <div>
                        <p className="text-sm font-medium text-primary mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {org.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <p className="text-sm font-medium text-primary mb-2">Languages:</p>
                        <div className="flex flex-wrap gap-1">
                          {org.languages.map((language) => (
                            <Badge key={language} variant="secondary" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">📍 {org.location}</p>
                          <p className="text-muted-foreground">📞 {org.phone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">✉️ {org.email}</p>
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
                        <Button size="sm" className="hover:scale-105 transition-transform">
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

        {filteredOrganizations.length === 0 && (
          <MotionWrapper animation="fadeInUp">
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-primary mb-2">No organizations found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all organizations.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedType("all")
                  }}
                  className="hover:scale-105 transition-transform"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </MotionWrapper>
        )}

        {/* Call to Action */}
        <MotionWrapper animation="fadeInUp">
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-primary mb-2">Need Help Finding the Right Legal Aid?</h3>
              <p className="text-muted-foreground mb-4">
                Our AI assistant can help you find the most suitable legal organization for your specific needs.
              </p>
              <Link href="/chat">
                <Button className="hover:scale-105 transition-transform">Ask AI Assistant</Button>
              </Link>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>

      {/* Bottom Navigation - Only for logged-in users */}
      {session && <BottomNavigation />}
    </div>
  )
}
