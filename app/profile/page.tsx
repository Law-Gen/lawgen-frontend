"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainNavigation } from "@/components/ui/main-navigation";
import { useTheme } from "next-themes";
import ChapaPayment from "@/components/payment/ChapaPayment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { toast } from "@/hooks/use-toast";

// Interfaces
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  birthdate?: string;
  gender?: "male" | "female" | "other";
  joinDate: string;
  subscription: {
    plan: string; // 'free', 'pro', 'enterprise'
    status: "active" | "expired" | "cancelled";
  };
  preferences: {
    language: "english" | "amharic";
  };
}

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limitations?: string[];
  popular?: boolean;
}

// Static data for features, to be merged with fetched plans
const staticPlanFeatures: Record<
  string,
  { features: string[]; limitations: string[]; popular: boolean }
> = {
  free: {
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
  pro: {
    features: [
      "Unlimited chat messages",
      "Unlimited quizzes",
      "50 document generations",
      "Advanced legal resources",
      "Priority support",
      "Legal document templates",
    ],
    limitations: [],
    popular: true,
  },
  enterprise: {
    features: [
      "Everything in Pro",
      "Unlimited document generations",
      "Custom legal templates",
      "24/7 priority support",
      "Legal case tracking",
      "Advanced analytics",
    ],
    limitations: [],
    popular: false,
  },
};

export default function ProfilePage() {
  const { data: session } = useSession();
  //if session set the access token on local storage
  useEffect(() => {
    if (session) {
      localStorage.setItem("access_token", session?.accessToken ?? "");
      localStorage.setItem("refresh_token", session?.refreshToken ?? "");
    }
  }, [session]);
  const router = useRouter();

  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Fetching data
  useEffect(() => {
    async function fetchProfile() {
      if (!session) return;
      console.log("Fetching profile with session:", session);
      setProfileLoading(true);
      try {
        const res = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        const d = res.data;
        const mappedProfile: UserProfile = {
          name: d.full_name || "",
          email: d.email || "",
          phone: d.profile?.phone || "",
          avatar: d.profile?.profile_picture_url || "",
          birthdate: d.profile?.birth_date || "",
          gender: d.profile?.gender || "other",
          joinDate: d.created_at || "",
          subscription: {
            plan: (d.subscription_status || "free").toLowerCase(),
            status: "active",
          },
          preferences: {
            language:
              d.profile?.language_preference === "am" ? "amharic" : "english",
          },
        };
        setProfile(mappedProfile);
      } catch (err: any) {
        setProfileError(err.message || "Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, [session]);

  useEffect(() => {
    async function fetchPlans() {
      setPlansLoading(true);
      try {
        const res = await api.get("/subscriptions/plans", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        console.log("Fetched plans:", res);

        const mergedPlans = res?.map((plan: any) => {
          const staticFeatures = staticPlanFeatures[
            plan.name.toLowerCase() as keyof typeof staticPlanFeatures
          ] || { features: [], limitations: [], popular: false };
          return {
            id: plan.id,
            name: plan.name,
            price: plan.price,
            ...staticFeatures,
          };
        });
        setPlans(mergedPlans);
      } catch (err: any) {
        setPlansError(err.message || "Failed to load subscription plans.");
      } finally {
        setPlansLoading(false);
      }
    }
    fetchPlans();
  }, []);

  // Handlers
  const handleUpgrade = (plan: Plan) => {
    if (profile?.subscription.plan === plan.id) return;
    setSelectedPlan(plan);
    //set selected plan in local storage
    localStorage.setItem("selected_plan", JSON.stringify(plan.id));
    console.log(plan);
    // console.log("selected_plan", plan.id);
    setPaymentModalOpen(true);
  };

  const handleCancelSubscription = () => {
    setIsCancelModalOpen(true);
  };

  const confirmCancelSubscription = async () => {
    setIsCancelModalOpen(false);

    try {
      await api.post("/subscriptions/cancel", null, {
        headers: {
          Authorization: `Bearer ${
            session?.accessToken || localStorage.getItem("access_token")
          }`,
        },
      });

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully. You've been downgraded to the free plan.",
      });
      // Refetch profile to update UI

      const res = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${
            session?.accessToken || localStorage.getItem("access_token")
          }`,
        },
      });
      const d = res.data;
      setProfile((p) =>
        p
          ? {
              ...p,
              subscription: {
                ...p.subscription,
                plan: (d.subscription_status || "free").toLowerCase(),
              },
            }
          : null
      );
    } catch (err: any) {
      toast({
        title: "Cancellation Failed",
        description: err.message || "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      const payload = {
        full_name: profile.name,
        profile: {
          phone: profile.phone,
          birth_date: profile.birthdate,
          gender: profile.gender,
          language_preference:
            profile.preferences.language === "amharic" ? "am" : "en",
        },
      };
      await api.put("/users/me", payload);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Redirect if not logged in
  if (!session && !profileLoading) {
    router.push("/auth/signin");
    return null;
  }

  // Loading and error states
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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "pro":
        return "bg-primary text-primary-foreground";
      case "enterprise":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

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
    <div className="min-h-screen bg-background pb-16">
      {isPaymentModalOpen && selectedPlan && profile && (
        <ChapaPayment
          plan={{
            id: selectedPlan.id,
            name: selectedPlan.name,
            price: selectedPlan.price,
          }}
          user={{
            name: profile.name,
            email: profile.email,
          }}
          tx_ref={`lawgen-${profile.email.split("@")[0]}-${Date.now()}`}
          onClose={() => setPaymentModalOpen(false)}
        />
      )}

      {/* Cancel Subscription Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? This action
              cannot be undone and will revert you to the free plan immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h4 className="font-medium text-destructive mb-2">
                What happens when you cancel:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your subscription will end immediately</li>
                <li>• You'll be downgraded to the free plan</li>
                <li>• Access to premium features will be lost</li>
                <li>• You can resubscribe at any time</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={confirmCancelSubscription}>
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="w-full flex items-center px-2 gap-4">
          <div className="flex flex-1 flex-col items-start min-w-0">
            {getHeaderContent()}
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <MotionWrapper animation="fadeInUp">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary">
                      Profile Information
                    </CardTitle>
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
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative w-20 h-20">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={profile?.avatar || "/placeholder.svg"}
                          alt={profile?.name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                          {profile?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
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
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                </CardContent>
              </Card>
            </MotionWrapper>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {plansLoading ? (
                <p>Loading plans...</p>
              ) : plansError ? (
                <p className="text-red-500">{plansError}</p>
              ) : (
                plans?.map((plan, index) => (
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
                          ETB {plan.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /month
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-primary mb-2">
                            Features:
                          </h4>
                          <ul className="space-y-1">
                            {plan?.features.map((feature, i) => (
                              <li
                                key={i}
                                className="text-sm text-muted-foreground flex items-center gap-2"
                              >
                                <span className="text-green-500">✓</span>{" "}
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {plan.name === "free" ? (
                          <Button disabled className="w-full">
                            Current Plan
                          </Button>
                        ) : profile.subscription.plan === plan.name ? (
                          <Button
                            onClick={handleCancelSubscription}
                            variant="destructive"
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleUpgrade(plan)}
                            className="w-full"
                          >
                            Upgrade
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </MotionWrapper>
                ))
              )}
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6 min-h-[100vh]">
            <MotionWrapper animation="fadeInUp">
              <iframe
                src="/profile/feedback"
                title="Feedback"
                className="w-full min-h-[700px] border-none rounded-xl bg-transparent"
                style={{ background: "transparent" }}
              />
            </MotionWrapper>
          </TabsContent>
        </Tabs>
      </div>

      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
