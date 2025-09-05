"use client";
import { useEffect, useState } from "react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
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
}

declare const subscriptionPlans: any[];
declare function getPlanColor(plan: string): string;
declare function handleUpgrade(planId: string): void;

interface SubscriptionTabProps {
  profile: UserProfile | null;
  loading: boolean;
  error: string;
}

export default function SubscriptionTab({ profile, loading, error }: SubscriptionTabProps) {
  const [formattedExpiry, setFormattedExpiry] = useState("");
  useEffect(() => {
    if (profile?.subscription?.expiryDate) {
      setFormattedExpiry(new Date(profile.subscription.expiryDate).toLocaleDateString());
    }
  }, [profile]);

  if (loading) return <div>Loading subscription...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile data.</div>;

  return (
    <>
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
                {profile.subscription.features.map((feature: string, index: number) => (
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
            {/* Add expiry date if present */}
            {profile.subscription.expiryDate && (
              <div className="mt-2 text-sm text-muted-foreground">
                Expiry Date: {formattedExpiry}
              </div>
            )}
          </CardContent>
        </Card>
      </MotionWrapper>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 min-h-[100vh]">
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
    </>
  );
}