"use client";

import { useState } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import { changePassword } from "@/src/store/slices/userSlice";
import {
  Button,
  Label,
  Input,
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
  const dispatch = useAppDispatch();
  const [settings, setSettings] = useState<SecuritySettingsData>({
    sessionTimeout: data?.sessionTimeout || "30",
    passwordExpiry: data?.passwordExpiry || "90",
  });

  // Password change form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleSave = () => {
    // await fetch('/api/settings/security', { method: 'PUT', body: JSON.stringify(settings) })
    onSave?.(settings);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    try {
      await dispatch(changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      })).unwrap();
      
      setPasswordSuccess("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error: any) {
      setPasswordError(error.message || "Failed to change password");
    }
  };

  const handleOpenPasswordForm = () => {
    setShowPasswordForm(true);
    setPasswordError("");
    setPasswordSuccess("");
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
        
        {!showPasswordForm ? (
          <Button onClick={handleOpenPasswordForm}>Change Password</Button>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            {passwordError && (
              <div className="text-red-500 text-sm">{passwordError}</div>
            )}
            
            {passwordSuccess && (
              <div className="text-green-600 text-sm">{passwordSuccess}</div>
            )}
            
            <div className="flex gap-2">
              <Button type="submit">Update Password</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
