"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface OverviewProfileTabProps {
  profile: UserProfile | null;
  loading: boolean;
  error: string;
}

export default function OverviewProfileTab({
  profile,
  loading,
  error,
}: OverviewProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formattedJoinDate, setFormattedJoinDate] = useState("");
  const [formattedBirthdate, setFormattedBirthdate] = useState("");

  useEffect(() => {
    if (profile?.joinDate) {
      setFormattedJoinDate(new Date(profile.joinDate).toLocaleDateString());
    }
    if (profile?.birthdate) {
      setFormattedBirthdate(new Date(profile.birthdate).toLocaleDateString());
    }
  }, [profile]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile data.</div>;
  return (
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
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-primary">
                {profile.name}
              </h2>
              <Badge>{profile.subscription.plan.toUpperCase()}</Badge>
            </div>
            <p className="text-muted-foreground">
              Member since {formattedJoinDate}
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
              {profile.birthdate ? formattedBirthdate : "-"}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={profile.name} disabled className="mt-1" />
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
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                value={profile.gender || "-"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input
                id="birthdate"
                type="date"
                value={profile.birthdate || ""}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                disabled
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
