"use client"

import { useState } from "react"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { BottomNavigation } from "@/components/ui/bottom-navigation"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  bio: string
  avatar?: string
  joinDate: string
  subscription: {
    plan: "free" | "premium" | "professional"
    status: "active" | "expired" | "cancelled"
    expiryDate?: string
    features: string[]
  }
  usage: {
    chatMessages: number
    chatLimit: number
    quizzesTaken: number
    quizLimit: number
    documentsGenerated: number
    documentLimit: number
  }
  preferences: {
    language: "english" | "amharic"
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    privacy: {
      profileVisible: boolean
      shareUsageData: boolean
    }
  }
}

const mockUserProfile: UserProfile = {
  name: "Almaz Tadesse",
  email: "almaz.tadesse@email.com",
  phone: "+251-911-123-456",
  location: "Addis Ababa, Ethiopia",
  bio: "Small business owner interested in learning about business law and employment regulations.",
  joinDate: "2024-01-15",
  subscription: {
    plan: "free",
    status: "active",
    features: ["Basic chat support", "Limited quizzes", "Community access"],
  },
  usage: {
    chatMessages: 45,
    chatLimit: 50,
    quizzesTaken: 8,
    quizLimit: 10,
    documentsGenerated: 2,
    documentLimit: 3,
  },
  preferences: {
    language: "english",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profileVisible: true,
      shareUsageData: false,
    },
  },
}

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: "ETB 0",
    period: "forever",
    features: [
      "50 chat messages per month",
      "10 quizzes per month",
      "3 document generations",
      "Basic legal resources",
      "Community access",
    ],
    limitations: ["Limited AI responses", "Basic support", "No priority access"],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "ETB 299",
    period: "per month",
    features: [
      "Unlimited chat messages",
      "Unlimited quizzes",
      "50 document generations",
      "Advanced legal resources",
      "Priority support",
      "Legal document templates",
      "Expert consultations (2/month)",
    ],
    limitations: [],
    popular: true,
  },
  {
    id: "professional",
    name: "Professional",
    price: "ETB 599",
    period: "per month",
    features: [
      "Everything in Premium",
      "Unlimited document generations",
      "Custom legal templates",
      "24/7 priority support",
      "Expert consultations (5/month)",
      "Legal case tracking",
      "Advanced analytics",
      "API access",
    ],
    limitations: [],
    popular: false,
  },
]

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const handleSaveProfile = () => {
    // Here you would typically save to your backend
    setIsEditing(false)
  }

  const handleUpgrade = (planId: string) => {
    // Here you would handle the subscription upgrade
    console.log("Upgrading to:", planId)
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "premium":
        return "bg-primary text-primary-foreground"
      case "professional":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

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
              <h1 className="text-lg font-semibold text-primary">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="bg-transparent hover:scale-105 transition-transform"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <MotionWrapper animation="fadeInUp">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary">Profile Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-transparent hover:scale-105 transition-transform"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-primary">{profile.name}</h2>
                        <Badge className={getPlanColor(profile.subscription.plan)}>
                          {profile.subscription.plan.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Member since {new Date(profile.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3">
                      <Button onClick={handleSaveProfile} className="hover:scale-105 transition-transform">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </MotionWrapper>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <MotionWrapper animation="fadeInUp">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Current Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-primary">{profile.subscription.plan.toUpperCase()} Plan</h3>
                      <p className="text-sm text-muted-foreground">Status: {profile.subscription.status}</p>
                    </div>
                    <Badge className={getPlanColor(profile.subscription.plan)}>
                      {profile.subscription.plan.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-primary mb-2">Current Features:</h4>
                    <ul className="space-y-1">
                      {profile.subscription.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>

            <div className="grid md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan, index) => (
                <MotionWrapper key={plan.id} animation="staggerIn" delay={index * 100}>
                  <Card className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-primary">{plan.name}</CardTitle>
                      <div className="text-2xl font-bold text-primary">
                        {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-primary mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className="w-full hover:scale-105 transition-transform"
                        variant={profile.subscription.plan === plan.id ? "outline" : "default"}
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={profile.subscription.plan === plan.id}
                      >
                        {profile.subscription.plan === plan.id ? "Current Plan" : "Upgrade"}
                      </Button>
                    </CardContent>
                  </Card>
                </MotionWrapper>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <MotionWrapper animation="fadeInUp">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={profile.preferences.notifications.email}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            notifications: { ...profile.preferences.notifications, email: checked },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={profile.preferences.notifications.sms}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            notifications: { ...profile.preferences.notifications, sms: checked },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={profile.preferences.notifications.push}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            notifications: { ...profile.preferences.notifications, push: checked },
                          },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper animation="fadeInUp">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="profile-visible">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                    </div>
                    <Switch
                      id="profile-visible"
                      checked={profile.preferences.privacy.profileVisible}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            privacy: { ...profile.preferences.privacy, profileVisible: checked },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="share-usage">Share Usage Data</Label>
                      <p className="text-sm text-muted-foreground">Help improve our services by sharing usage data</p>
                    </div>
                    <Switch
                      id="share-usage"
                      checked={profile.preferences.privacy.shareUsageData}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            privacy: { ...profile.preferences.privacy, shareUsageData: checked },
                          },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <MotionWrapper animation="staggerIn" delay={0}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">💬 Chat Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Used</span>
                        <span>
                          {profile.usage.chatMessages} / {profile.usage.chatLimit}
                        </span>
                      </div>
                      <Progress value={getUsagePercentage(profile.usage.chatMessages, profile.usage.chatLimit)} />
                      <p className="text-xs text-muted-foreground">
                        {profile.usage.chatLimit - profile.usage.chatMessages} messages remaining this month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>

              <MotionWrapper animation="staggerIn" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">📝 Quizzes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Taken</span>
                        <span>
                          {profile.usage.quizzesTaken} / {profile.usage.quizLimit}
                        </span>
                      </div>
                      <Progress value={getUsagePercentage(profile.usage.quizzesTaken, profile.usage.quizLimit)} />
                      <p className="text-xs text-muted-foreground">
                        {profile.usage.quizLimit - profile.usage.quizzesTaken} quizzes remaining this month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>

              <MotionWrapper animation="staggerIn" delay={200}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">📄 Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Generated</span>
                        <span>
                          {profile.usage.documentsGenerated} / {profile.usage.documentLimit}
                        </span>
                      </div>
                      <Progress
                        value={getUsagePercentage(profile.usage.documentsGenerated, profile.usage.documentLimit)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {profile.usage.documentLimit - profile.usage.documentsGenerated} documents remaining this month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>
            </div>

            <MotionWrapper animation="fadeInUp">
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-primary mb-2">Need More Resources?</h3>
                  <p className="text-muted-foreground mb-4">
                    Upgrade your plan to get unlimited access to all features and remove usage limits.
                  </p>
                  <Button onClick={() => setActiveTab("subscription")} className="hover:scale-105 transition-transform">
                    View Subscription Plans
                  </Button>
                </CardContent>
              </Card>
            </MotionWrapper>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  )
}
