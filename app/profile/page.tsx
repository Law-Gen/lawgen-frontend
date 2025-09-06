"use client";

import type React from "react";

import { useState, useEffect } from "react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { api } from "@/src/lib/api";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainNavigation } from "@/components/ui/main-navigation";
import { useTheme } from "next-themes";
import FeedbackForm from "./feedback/page";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  birthdate?: string;
  gender?: "male" | "female" | "other";
  joinDate: string;
  subscription: {
    plan: "free" | "premium" | "professional";
    status: "active" | "expired" | "cancelled";
    expiryDate?: string;
    features: string[];
  };
  usage: {
    chatMessages: number;
    chatLimit: number;
    quizzesTaken: number;
    quizLimit: number;
    documentsGenerated: number;
    documentLimit: number;
  };
  preferences: {
    language: "english" | "amharic";
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisible: boolean;
      shareUsageData: boolean;
    };
  };
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
    limitations: [
      "Limited AI responses",
      "Basic support",
      "No priority access",
    ],
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
];

export default function ProfilePage() {
  // Change Password form state (must be inside the component)
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);
    try {
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("access_token") || "";
      }
      const res = await fetch(`${API_BASE_URL}/users/me/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      if (res.ok) {
        setPasswordSuccess("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setShowPasswordForm(false);
        window.confirm("Your password has been changed successfully.");
      } else {
        let errMsg = "Failed to change password.";
        try {
          const data = await res.json();
          console.error("Change password backend error:", data);
          errMsg = data?.message || JSON.stringify(data) || errMsg;
        } catch (e) {
          errMsg += " (no JSON error body)";
        }
        setPasswordError(errMsg);
        alert("Backend error: " + errMsg);
      }
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to change password.");
      alert("Request error: " + (err?.message || "Failed to change password."));
    } finally {
      setPasswordLoading(false);
    }
  };
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let didRefresh = false;
    async function fetchProfile() {
      setProfileLoading(true);
      setProfileError(null);
      try {
        let token = "";
        if (typeof window !== "undefined") {
          token = localStorage.getItem("access_token") || "";
        }
        const res = await api.get("/users/me", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        // Map backend response to UserProfile shape
        const d = res.data;
        const mappedProfile: UserProfile = {
          name: d.full_name || "",
          email: d.email || "",
          phone: d.profile?.phone || "",
          avatar: d.profile?.profile_picture_url || "",
          birthdate: d.profile?.birth_date || "",
          gender: d.profile?.gender || "",
          joinDate: d.created_at || "",
          subscription: {
            plan: (d.subscription_status || "free") as any,
            status: "active",
            features: [],
          },
          usage: {
            chatMessages: 0,
            chatLimit: 0,
            quizzesTaken: 0,
            quizLimit: 0,
            documentsGenerated: 0,
            documentLimit: 0,
          },
          preferences: {
            language:
              d.profile?.language_preference === "amharic" ||
              d.profile?.language_preference === "am"
                ? "amharic"
                : d.profile?.language_preference === "english" ||
                  d.profile?.language_preference === "en"
                ? "english"
                : "english",
            notifications: { email: true, sms: false, push: false },
            privacy: { profileVisible: true, shareUsageData: false },
          },
        };
        setProfile(mappedProfile);
      } catch (err: any) {
        // If unauthorized, try refresh token ONCE
        if (
          !didRefresh &&
          (err.message?.includes("401") ||
            err.message?.toLowerCase().includes("unauthorized"))
        ) {
          didRefresh = true;
          try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
              const refreshRes = await api.refreshToken(refreshToken);
              if (refreshRes.ok) {
                const data = await refreshRes.json();
                if (data.access_token) {
                  localStorage.setItem("access_token", data.access_token);
                  // Retry fetchProfile ONCE with new token
                  return fetchProfile();
                }
              }
            }
          } catch {}
        }
        setProfileError(err.message || "Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, [session]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  if (!session) {
    router.push("/auth/signin");
    return null;
  }
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading profile...
      </div>
    );
  }
  if (profileError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {profileError}
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No profile data found.
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (!profile) return;
    // Validate gender
    if (
      !profile.gender ||
      !["male", "female", "other"].includes(profile.gender)
    ) {
      alert("Please select a gender.");
      return;
    }
    if (
      !profile.preferences.language ||
      !["english", "amharic"].includes(profile.preferences.language)
    ) {
      alert("Please select a language preference.");
      return;
    }
    // Validate and format birthdate
    let birth_date = (profile.birthdate || "").trim();
    // Accept both YYYY-MM-DD and MM/DD/YYYY, convert to YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(birth_date)) {
      // MM/DD/YYYY to YYYY-MM-DD
      const [mm, dd, yyyy] = birth_date.split("/");
      birth_date = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth_date)) {
      alert("Please enter a valid birthdate in YYYY-MM-DD format.");
      return;
    }
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("access_token") || "";
    }
    const formData = new FormData();
    const gender = profile.gender.trim();
    // Always send language as 'en' or 'am' for backend
    let langPref = profile.preferences.language;
    if (langPref === "english") langPref = "en";
    if (langPref === "amharic") langPref = "am";
    formData.append("gender", gender);
    formData.append("birth_date", birth_date);
    formData.append("langauge_preference", langPref);
    // Only include profile_picture if uploading a new image
    if (
      profile.avatar &&
      typeof profile.avatar !== "string" &&
      typeof window !== "undefined" &&
      window.File &&
      (profile.avatar as any) instanceof window.File
    ) {
      formData.append("profile_picture", profile.avatar);
    }
    for (const [key, value] of formData.entries()) {
      console.log("FormData:", key, value);
    }
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        let errMsg = "Failed to update profile";
        try {
          const errData = await res.json();
          console.error("Backend error response:", errData);
          errMsg = JSON.stringify(errData, null, 2);
        } catch (e) {
          errMsg += " (no JSON error body)";
        }
        alert("Backend error: " + errMsg);
        throw new Error(errMsg);
      }
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    }
  };

  const handleUpgrade = (planId: string) => {
    // Here you would handle the subscription upgrade
    console.log("Upgrading to:", planId);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "premium":
        return "bg-primary text-primary-foreground";
      case "professional":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  // --- Header content for each tab ---
  const getHeaderContent = () => {
    if (activeTab === "overview") {
      return (
        <>
          <h1 className="text-lg font-semibold text-primary truncate">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground truncate">
            Manage your account and preferences
          </p>
        </>
      );
    }
    if (activeTab === "subscription") {
      return (
        <>
          <h1 className="text-lg font-semibold text-primary truncate">
            Subscription
          </h1>
          <p className="text-sm text-muted-foreground truncate">
            View and manage your subscription plan
          </p>
        </>
      );
    }
    if (activeTab === "feedback") {
      return (
        <>
          <h1 className="text-lg font-semibold text-primary truncate">
            Feedback
          </h1>
          <p className="text-sm text-muted-foreground truncate">
            Share your thoughts and help us improve
          </p>
        </>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 pb-16 overflow-x-hidden">
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
          {/* Dark mode toggle for mobile sidebar */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-2 py-1 rounded border w-full flex items-center gap-2"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <LanguageToggle />
          <Button
            variant="outline"
            size="sm"
            className="w-full text-primary dark:text-white border-primary hover:bg-primary hover:!text-white transition-colors bg-transparent"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="w-full flex items-center px-2 gap-4">
          {/* Left: Title and description */}
          <div className="flex flex-1 flex-col items-start min-w-0">
            {getHeaderContent()}
          </div>
          {/* Hamburger icon for mobile, right side */}
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
          {/* Right: Language toggle, dark mode, and sign out (desktop only) */}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-transparent hover:bg-primary hover:text-white text-primary dark:text-white border-primary"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-6xl">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <MotionWrapper animation="fadeInUp">
              <FeedbackForm />
            </MotionWrapper>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <MotionWrapper animation="fadeInUp">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary">
                      Profile Information
                    </CardTitle>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="bg-transparent hover:scale-105 transition-transform"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative w-20 h-20">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={profile.avatar || "/placeholder.svg"}
                          alt={profile.name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                          {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer shadow-md flex items-center justify-center w-7 h-7">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setProfile((p) => ({
                                  ...p,
                                  avatar: file, // store File object directly
                                }));
                              }
                            }}
                          />
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="8"
                              cy="8"
                              r="8"
                              fill="currentColor"
                              fillOpacity="0.2"
                            />
                            <path
                              d="M8 4v8M4 8h8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-primary">
                          {profile.name}
                        </h2>
                        <Badge
                          className={getPlanColor(profile.subscription.plan)}
                        >
                          {profile.subscription.plan.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Member since{" "}
                        {new Date(profile.joinDate).toLocaleDateString()}
                      </p>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Gender:</span>{" "}
                        {profile.gender
                          ? profile.gender.charAt(0).toUpperCase() +
                            profile.gender.slice(1)
                          : "-"}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Birthdate:</span>{" "}
                        {profile.birthdate
                          ? new Date(profile.birthdate).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </div>{" "}
                  {/* closes flex items-center gap-6 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
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
                          disabled
                          className="mt-1"
                        />
                      </div>
                      {/* Phone number field removed as requested */}
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <select
                          id="gender"
                          value={profile.gender || "male"}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              gender: e.target.value as
                                | "male"
                                | "female"
                                | "other",
                            })
                          }
                          className="mt-1 w-full border rounded px-3 py-2"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="birthdate">Birthdate</Label>
                        <input
                          id="birthdate"
                          type="date"
                          value={(() => {
                            if (!profile.birthdate) return "";
                            // Accepts 'yyyy-MM-dd', 'yyyy-MM-ddTHH:mm:ssZ', 'MM/DD/YYYY', etc.
                            const isoMatch =
                              profile.birthdate.match(/^\d{4}-\d{2}-\d{2}$/);
                            if (isoMatch) return profile.birthdate;
                            // Try to parse as Date and format as yyyy-MM-dd
                            const d = new Date(profile.birthdate);
                            if (!isNaN(d.getTime())) {
                              const yyyy = d.getFullYear();
                              const mm = String(d.getMonth() + 1).padStart(
                                2,
                                "0"
                              );
                              const dd = String(d.getDate()).padStart(2, "0");
                              return `${yyyy}-${mm}-${dd}`;
                            }
                            // fallback
                            return "";
                          })()}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              birthdate: e.target.value,
                            })
                          }
                          className="mt-1 w-full border rounded px-3 py-2"
                          pattern="\d{4}-\d{2}-\d{2}"
                          placeholder="YYYY-MM-DD"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="language_preference">
                          Language Preference
                        </Label>
                        <select
                          id="language_preference"
                          value={profile.preferences.language}
                          disabled={!isEditing}
                          onChange={(e) => {
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                language: e.target.value as
                                  | "english"
                                  | "amharic",
                              },
                            });
                          }}
                          className="mt-1 w-full border rounded px-3 py-2"
                        >
                          <option value="en">English</option>
                          <option value="amharic">Amharic</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {isEditing && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-2">
                            Security
                          </h3>
                          <button
                            className="text-primary underline hover:no-underline text-sm mb-2"
                            onClick={() => setShowPasswordForm((v) => !v)}
                            type="button"
                          >
                            {showPasswordForm ? "Cancel" : "Change Password"}
                          </button>
                          {showPasswordForm && (
                            <form
                              onSubmit={handleChangePassword}
                              className="space-y-3 max-w-sm"
                            >
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Old Password
                                </label>
                                <input
                                  type="password"
                                  value={oldPassword}
                                  onChange={(e) =>
                                    setOldPassword(e.target.value)
                                  }
                                  required
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  New Password
                                </label>
                                <input
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  required
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              {passwordError && (
                                <div className="text-red-500 text-xs">
                                  {passwordError}
                                </div>
                              )}
                              {passwordSuccess && (
                                <div className="text-green-600 text-xs">
                                  {passwordSuccess}
                                </div>
                              )}
                              <button
                                type="submit"
                                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 w-full"
                                disabled={passwordLoading}
                              >
                                {passwordLoading
                                  ? "Updating..."
                                  : "Update Password"}
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveProfile}
                        className="hover:scale-105 transition-transform"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="bg-transparent"
                      >
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
                  <CardTitle className="text-primary">
                    Current Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-primary">
                        {profile.subscription.plan.toUpperCase()} Plan
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Status: {profile.subscription.status}
                      </p>
                    </div>
                    <Badge className={getPlanColor(profile.subscription.plan)}>
                      {profile.subscription.plan.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-primary mb-2">
                      Current Features:
                    </h4>
                    <ul className="space-y-1">
                      {profile.subscription.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {subscriptionPlans.map((plan, index) => (
                <MotionWrapper
                  key={plan.id}
                  animation="staggerIn"
                  delay={index * 100}
                >
                  <Card
                    className={`relative ${
                      plan.popular ? "border-primary shadow-lg" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-primary">
                        {plan.name}
                      </CardTitle>
                      <div className="text-2xl font-bold text-primary">
                        {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{plan.period}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-primary mb-2">
                          Features:
                        </h4>
                        <ul className="space-y-1">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              <span className="text-green-500">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className="w-full hover:scale-105 transition-transform"
                        variant={
                          profile.subscription.plan === plan.id
                            ? "outline"
                            : "default"
                        }
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={profile.subscription.plan === plan.id}
                      >
                        {profile.subscription.plan === plan.id
                          ? "Current Plan"
                          : "Upgrade"}
                      </Button>
                    </CardContent>
                  </Card>
                </MotionWrapper>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
