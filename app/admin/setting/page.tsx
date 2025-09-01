"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui";
import {
  SecuritySetting,
  NotificationSetting,
  GeneralSetting,
  AccountSetting,
  SettingSidebar,
} from "@/components/admin/setting";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");

  const handleGeneralSave = async (data: any) => {
    console.log("[v0] Saving general settings:", data);
    // await fetch('/api/settings/general', { method: 'PUT', body: JSON.stringify(data) })
  };

  const handleAccountSave = async (data: any) => {
    console.log("[v0] Saving account settings:", data);
    // await fetch('/api/settings/account', { method: 'PUT', body: JSON.stringify(data) })
  };

  const handlePhotoUpload = async (file: File) => {
    console.log("[v0] Uploading photo:", file.name);
    // const formData = new FormData()
    // formData.append('photo', file)
    // await fetch('/api/settings/account/photo', { method: 'POST', body: formData })
  };

  const handlePhotoRemove = async () => {
    console.log("[v0] Removing photo");
    // await fetch('/api/settings/account/photo', { method: 'DELETE' })
  };

  const handleNotificationPreferencesSave = async (preferences: any) => {
    console.log("[v0] Saving notification preferences:", preferences);
    // await fetch('/api/settings/notifications', { method: 'PUT', body: JSON.stringify(preferences) })
  };

  const handleSendNotification = async (notification: any) => {
    console.log("[v0] Sending admin notification:", notification);
    // await fetch('/api/admin/notifications', { method: 'POST', body: JSON.stringify(notification) })
  };

  const handleSecuritySave = async (data: any) => {
    console.log("[v0] Saving security settings:", data);
    // await fetch('/api/settings/security', { method: 'PUT', body: JSON.stringify(data) })
  };

  const handleChangePassword = () => {
    console.log("[v0] Opening change password modal");
    // This could open a modal or redirect to a password change form
  };

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSetting onSave={handleGeneralSave} />;
      case "account":
        return (
          <AccountSetting
            onSave={handleAccountSave}
            onUploadPhoto={handlePhotoUpload}
            onRemovePhoto={handlePhotoRemove}
          />
        );
      case "notifications":
        return (
          <NotificationSetting
            onSavePreferences={handleNotificationPreferencesSave}
            onSendNotification={handleSendNotification}
          />
        );
      case "security":
        return (
          <SecuritySetting
            onSave={handleSecuritySave}
            onChangePassword={handleChangePassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="flex h-full">
        <SettingSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </div>

            {renderContent()}

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-border">
              <Button variant="outline">Cancel</Button>
              <Button>Save All Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
