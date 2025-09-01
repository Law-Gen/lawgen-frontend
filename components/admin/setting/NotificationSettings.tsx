"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Textarea,
} from "@/components/ui";

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  marketingEmails: boolean;
}

interface AdminNotification {
  type: string;
  title: string;
  message: string;
  targetUsers: string;
}

interface NotificationSettingsProps {
  preferences?: NotificationPreferences;
  onSavePreferences?: (preferences: NotificationPreferences) => void;
  onSendNotification?: (notification: AdminNotification) => void;
}

export default function NotificationSetting({
  preferences,
  onSavePreferences,
  onSendNotification,
}: NotificationSettingsProps) {
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationPreferences>({
      emailNotifications: preferences?.emailNotifications ?? true,
      pushNotifications: preferences?.pushNotifications ?? false,
      weeklyReports: preferences?.weeklyReports ?? true,
      marketingEmails: preferences?.marketingEmails ?? false,
    });

  const [adminNotification, setAdminNotification] = useState<AdminNotification>(
    {
      type: "document",
      title: "",
      message: "",
      targetUsers: "all",
    }
  );

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePreferences = () => {
    // await fetch('/api/settings/notifications', { method: 'PUT', body: JSON.stringify(notificationSettings) })
    onSavePreferences?.(notificationSettings);
  };

  const handleSendNotification = () => {
    // await fetch('/api/admin/notifications', { method: 'POST', body: JSON.stringify(adminNotification) })
    onSendNotification?.(adminNotification);

    // Reset form
    setAdminNotification({
      type: "document",
      title: "",
      message: "",
      targetUsers: "all",
    });
  };

  const notificationOptions = [
    {
      key: "emailNotifications" as const,
      label: "Email Notifications",
      description: "Receive notifications via email",
    },
    {
      key: "pushNotifications" as const,
      label: "Push Notifications",
      description: "Receive push notifications in browser",
    },
    {
      key: "weeklyReports" as const,
      label: "Weekly Reports",
      description: "Receive weekly activity summaries",
    },
    {
      key: "marketingEmails" as const,
      label: "Marketing Emails",
      description: "Receive product updates and promotions",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Notification Preferences
        </h2>
        <p className="text-muted-foreground mb-6">
          Manage how you receive notifications and updates.
        </p>
      </div>

      <div className="space-y-6">
        {notificationOptions.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={item.key}>{item.label}</Label>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <Switch
              id={item.key}
              checked={notificationSettings[item.key]}
              onCheckedChange={() => handleNotificationToggle(item.key)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSavePreferences}>
          Save Notification Preferences
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Send Notifications to Users</h3>
        <p className="text-sm text-muted-foreground">
          Send notifications to users about new documents or quizzes.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Create User Notification</CardTitle>
            <CardDescription>
              Send notifications about new content to your team members.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notificationType">Notification Type</Label>
                <Select
                  value={adminNotification.type}
                  onValueChange={(value) =>
                    setAdminNotification((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">
                      New Document Upload
                    </SelectItem>
                    <SelectItem value="quiz">New Quiz Addition</SelectItem>
                    <SelectItem value="general">
                      General Announcement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetUsers">Target Users</Label>
                <Select
                  value={adminNotification.targetUsers}
                  onValueChange={(value) =>
                    setAdminNotification((prev) => ({
                      ...prev,
                      targetUsers: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="partners">Partners Only</SelectItem>
                    <SelectItem value="associates">Associates Only</SelectItem>
                    <SelectItem value="paralegals">Paralegals Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notificationTitle">Title</Label>
              <Input
                id="notificationTitle"
                placeholder="Enter notification title"
                value={adminNotification.title}
                onChange={(e) =>
                  setAdminNotification((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notificationMessage">Message</Label>
              <Textarea
                id="notificationMessage"
                placeholder="Enter notification message"
                value={adminNotification.message}
                onChange={(e) =>
                  setAdminNotification((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <Button onClick={handleSendNotification} className="w-full">
              Send Notification
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
