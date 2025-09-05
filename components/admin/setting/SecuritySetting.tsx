"use client";

import { useState } from "react";
import {
  Button,
  Label,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface SecuritySettingsData {
  sessionTimeout: string;
  passwordExpiry: string;
}

interface SecuritySettingsProps {
  data?: SecuritySettingsData;
  onSave?: (data: SecuritySettingsData) => void;
  onChangePassword?: () => void;
}

export default function SecuritySetting({
  data,
  onSave,
  onChangePassword,
}: SecuritySettingsProps) {
  const [settings, setSettings] = useState<SecuritySettingsData>({
    sessionTimeout: data?.sessionTimeout || "30",
    passwordExpiry: data?.passwordExpiry || "90",
  });

  const handleSave = () => {
    // await fetch('/api/settings/security', { method: 'PUT', body: JSON.stringify(settings) })
    onSave?.(settings);
  };

  const handleChangePassword = () => {
    // This could open a modal or redirect to a password change form
    onChangePassword?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Security Settings
        </h2>
        <p className="text-muted-foreground mb-6">
          Manage your account security and access preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
          <Select
            value={settings.sessionTimeout}
            onValueChange={(value) =>
              setSettings((prev) => ({ ...prev, sessionTimeout: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
          <Select
            value={settings.passwordExpiry}
            onValueChange={(value) =>
              setSettings((prev) => ({ ...prev, passwordExpiry: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select expiry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Security Settings</Button>
      </div>

      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Password</h3>
        <Button onClick={handleChangePassword}>Change Password</Button>
      </div>
    </div>
  );
}
