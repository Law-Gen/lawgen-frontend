"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { updateProfile, changePassword } from "@/src/store/slices/profileSlice";
import {
  Button,
  Input,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface EditProfileProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditProfile({ onCancel, onSuccess }: EditProfileProps) {
  const dispatch = useAppDispatch();
  const { profile, loading: profileLoading } = useAppSelector(
    (state) => state.profile
  );

  // Local state for editable fields
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [languagePreference, setLanguagePreference] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [profilePictureFile, setProfilePictureFile] = useState<
    File | undefined
  >(undefined);

  // Sync local state with profile data when it changes
  useEffect(() => {
    if (profile) {
      setGender(profile.profile?.gender || "");
      setBirthdate(
        profile.profile?.birth_date
          ? profile.profile.birth_date.split("T")[0]
          : ""
      );
      setLanguagePreference(profile.profile?.language_preference || "");
      setProfilePicture(profile.profile?.profile_picture_url || "");
    }
  }, [profile]);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Save changes to profile
  const handleSave = async () => {
    try {
      const result = await dispatch(
        updateProfile({
          gender,
          birth_date: birthdate,
          language_preference: languagePreference,
          profile_picture: profilePictureFile,
        })
      );
      
      if (updateProfile.fulfilled.match(result)) {
        onSuccess();
      } else {
        console.error("Profile update failed:", result.payload);
      }
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  // Password change handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Basic validation
    if (!oldPassword.trim()) {
      setPasswordError("Current password is required");
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError("New password is required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    try {
      const result = await dispatch(
        changePassword({ old_password: oldPassword, new_password: newPassword })
      );

      if (changePassword.fulfilled.match(result)) {
        setPasswordSuccess("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setShowPasswordForm(false);
      } else {
        setPasswordError(
          (result.payload as string) || "Failed to change password"
        );
      }
    } catch (error) {
      setPasswordError("An unexpected error occurred");
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
      setProfilePictureFile(file);
    }
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    return nameParts
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Edit Profile
        </h2>
        <p className="text-muted-foreground mb-6">
          Update your personal details and profile information.
        </p>
      </div>

      {/* Editable profile fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={gender}
            onValueChange={setGender}
            disabled={profileLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input
            id="birthDate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            disabled={profileLoading}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="language">Language Preference</Label>
          <Select
            value={languagePreference}
            onValueChange={setLanguagePreference}
            disabled={profileLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="am">Amharic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Profile Picture</h3>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={profilePicture || "/placeholder.svg"}
              alt="Profile picture"
            />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {profile?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
              disabled={profileLoading}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("photo-upload")?.click()}
              disabled={profileLoading}
            >
              Upload New Photo
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => {
                setProfilePicture("");
                setProfilePictureFile(undefined);
              }}
              disabled={profileLoading}
            >
              Remove Photo
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={profileLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={profileLoading}>
            {profileLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        <Separator />
        <div>
          <Button
            variant="outline"
            onClick={() => setShowPasswordForm((v) => !v)}
            className="mb-2"
          >
            {showPasswordForm ? "Cancel Password Change" : "Change Password"}
          </Button>
          {showPasswordForm && (
            <form
              onSubmit={handleChangePassword}
              className="space-y-4 max-w-md mt-2"
            >
              <div>
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              {passwordError && (
                <div className="text-red-500">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="text-green-600">{passwordSuccess}</div>
              )}
              <Button type="submit" disabled={profileLoading}>
                {profileLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
