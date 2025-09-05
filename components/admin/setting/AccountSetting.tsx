"use client";

import type React from "react";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
} from "@/components/ui";

interface AccountSettingsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  profilePicture?: string;
}

interface AccountSettingProps {
  data?: AccountSettingsData;
  onSave?: (data: AccountSettingsData) => void;
  onUploadPhoto?: (file: File) => void;
  onRemovePhoto?: () => void;
}

export default function AccountSetting({
  data,
  onSave,
  onUploadPhoto,
  onRemovePhoto,
}: AccountSettingProps) {
  const [settings, setSettings] = useState<AccountSettingsData>({
    firstName: data?.firstName || "John",
    lastName: data?.lastName || "Doe",
    email: data?.email || "john.doe@lawfirm.com",
    phone: data?.phone || "+1 (555) 123-4567",
    jobTitle: data?.jobTitle || "Senior Partner",
    profilePicture: data?.profilePicture,
  });

  const handleSave = () => {
    // await fetch('/api/settings/account', { method: 'PUT', body: JSON.stringify(settings) })
    onSave?.(settings);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // const formData = new FormData()
      // formData.append('photo', file)
      // await fetch('/api/settings/account/photo', { method: 'POST', body: formData })
      onUploadPhoto?.(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {" "}
          Personal Information{" "}
        </h2>
        <p className="text-muted-foreground mb-6">
          Update your personal details and profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="FirstName">First Name</Label>
          <Input
            id="firstName"
            value={settings.firstName}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={settings.lastName}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, lastName: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={settings.email}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={settings.phone}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={settings.jobTitle}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, jobTitle: e.target.value }))
            }
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Profile Picture</h3>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={settings.profilePicture || "/placeholder.svg"} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {settings.firstName[0]}
              {settings.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("photo-upload")?.click()}
            >
              Upload New Photo
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={onRemovePhoto}
            >
              Remove Photo
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Account Settings</Button>
      </div>
    </div>
  );
}
