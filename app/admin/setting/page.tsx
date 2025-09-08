"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui";
import {
  NotificationSetting,
  AccountSetting,
  SettingSidebar,
} from "@/components/admin/setting";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSetting />;
      case "notifications":
        return <NotificationSetting />;
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
