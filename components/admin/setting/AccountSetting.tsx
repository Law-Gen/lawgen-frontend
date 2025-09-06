"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchProfile } from "@/src/store/slices/profileSlice";
import {
  Button,
  Input,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
} from "@/components/ui";
import EditProfile from "./EditProfile";

// This interface is now only for local state, not needed for Redux

export default function AccountSetting() {
  // Redux hooks
  const dispatch = useAppDispatch();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useAppSelector((state) => state.profile);

  // Local state
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleEditSuccess = () => {
    setIsEditing(false);
    // Refetch profile to get updated data
    dispatch(fetchProfile());
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    return nameParts
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Show edit profile component if editing
  if (isEditing) {
    return (
      <EditProfile
        onCancel={() => setIsEditing(false)}
        onSuccess={handleEditSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Personal Information
        </h2>
        <p className="text-muted-foreground mb-6">
          View your personal details and profile information.
        </p>
      </div>

      {profileLoading && <div>Loading profile...</div>}
      {profileError && <div className="text-red-500">{profileError}</div>}

      {/* Read-only Profile Information Display */}
      {profile && (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
                value={profile.full_name || ""}
                disabled
                className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
                value={profile.email || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={
                  profile.role 
                    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                    : "Not specified"
                }
                disabled
                className="bg-muted"
              />
            </div>
        <div className="space-y-2">
          <Label htmlFor="subscription">Subscription Status</Label>
          <Input
            id="subscription"
            value={
              profile.subscription_status 
                ? profile.subscription_status.charAt(0).toUpperCase() + profile.subscription_status.slice(1)
                : "Not specified"
            }
            disabled
            className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                value={
                  profile.profile?.gender && profile.profile.gender.trim()
                    ? profile.profile.gender.charAt(0).toUpperCase() + profile.profile.gender.slice(1)
                    : "Not specified"
                }
                disabled
                className="bg-muted"
              />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input
            id="birthDate"
                value={
                  profile.profile?.birth_date
                    ? profile.profile.birth_date.split("T")[0]
                    : "Not specified"
                }
                disabled
                className="bg-muted"
          />
        </div>
            <div className="space-y-2">
          <Label htmlFor="language">Language Preference</Label>
              <Input
                id="language"
                value={
                  profile.profile?.language_preference && 
                  profile.profile.language_preference.trim() 
                    ? profile.profile.language_preference === 'en' 
                      ? 'English' 
                      : profile.profile.language_preference === 'am' 
                        ? 'Amharic' 
                        : profile.profile.language_preference
                    : "Not specified"
                }
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createdAt">Account Created</Label>
              <Input
                id="createdAt"
                value={
                  profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : ""
                }
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="updatedAt">Last Updated</Label>
              <Input
                id="updatedAt"
                value={
                  profile.updated_at
                    ? new Date(profile.updated_at).toLocaleDateString()
                    : ""
                }
                disabled
                className="bg-muted"
              />
        </div>
      </div>

      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Profile Picture</h3>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
                  src={
                    profile.profile?.profile_picture_url || "/placeholder.svg"
                  }
              alt="Profile picture"
            />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {getInitials(profile.full_name || "User")}
            </AvatarFallback>
          </Avatar>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setIsEditing(true)}
              disabled={profileLoading}
            >
              Edit Profile
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
