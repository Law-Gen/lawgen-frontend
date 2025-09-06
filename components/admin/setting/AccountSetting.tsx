"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchProfile, updateProfile } from "@/src/store/slices/userSlice";
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

// This interface is now only for local state, not needed for Redux

export default function AccountSetting() {
  // Redux hooks
  const dispatch = useAppDispatch();

  const { profile, profileLoading, profileError } = useAppSelector((state) => state.users);

  // Local state for editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [languagePreference, setLanguagePreference] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [profilePictureFile, setProfilePictureFile] = useState<
    File | undefined
  >(undefined);

  // Fetch profile on mount

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Populate local state when profile is loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || "");
      setGender(profile.profile.gender || "");
      setBirthdate(
        profile.profile.birth_date ? profile.profile.birth_date.split("T")[0] : ""
      );
      setLanguagePreference(profile.profile.language_preference || "");
      setProfilePicture(profile.profile.profile_picture_url || "");
    }
  }, [profile]);
  // Save changes to profile
  const handleSave = () => {
    // Only send fields supported by backend
    dispatch(
      updateProfile({
        gender,
        birth_date: birthdate,
        language_preference: languagePreference,
        profile_picture: profilePictureFile,
      })
    );
    setIsEditing(false);
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
          Personal Information
        </h2>
        <p className="text-muted-foreground mb-6">
          Update your personal details and profile information.
        </p>
      </div>

      {profileLoading && <div>Loading profile...</div>}
      {profileError && <div className="text-red-500">{profileError}</div>}

      {/* Editable profile fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!isEditing || profileLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={gender}
            onValueChange={setGender}
            disabled={!isEditing || profileLoading}
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
            disabled={!isEditing || profileLoading}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="language">Language Preference</Label>
          <Select
            value={languagePreference}
            onValueChange={setLanguagePreference}
            disabled={!isEditing || profileLoading}
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
              {fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
              disabled={!isEditing || profileLoading}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("photo-upload")?.click()}
              disabled={!isEditing || profileLoading}
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
              disabled={!isEditing || profileLoading}
            >
              Remove Photo
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing((prev) => !prev)}
          disabled={profileLoading}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
        <Button onClick={handleSave} disabled={!isEditing || profileLoading}>
          {profileLoading ? "Saving..." : "Save Account Settings"}
        </Button>
      </div>
    </div>
  );
}
