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
  Separator,
} from "@/components/ui";

interface GeneralSettingsData {
  companyName: string;
  timezone: string;
  language: string;
  dateFormat: string;
  isDarkMode: boolean;
}

interface GeneralSettingsProps {
  data?: GeneralSettingsData;
  onSave?: (data: GeneralSettingsData) => void;
}

export default function GeneralSetting({ data, onSave }: GeneralSettingsProps) {
  const [settings, setSettings] = useState<GeneralSettingsData>({
    companyName: data?.companyName || "LawGen Legal Services",
    timezone: data?.timezone || "eastern",
    language: data?.language || "english",
    dateFormat: data?.dateFormat || "mmddyyyy",
    isDarkMode: data?.isDarkMode || false,
  });

  const handleSave = () => {
    // await fetch('/api/settings/general', { method: 'PUT', body: JSON.stringify(settings) })
    onSave?.(settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Company Information
        </h2>
        <p className="text-muted-foreground mb-6">
          Manage your company settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={settings.companyName}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, companyName: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={settings.timezone}
            onValueChange={(value) =>
              setSettings((prev) => ({ ...prev, timezone: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eastern">Eastern Time (ET)</SelectItem>
              <SelectItem value="central">Central Time (CT)</SelectItem>
              <SelectItem value="mountain">Mountain Time (MT)</SelectItem>
              <SelectItem value="pacific">Pacific Time (PT)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={settings.language}
            onValueChange={(value) =>
              setSettings((prev) => ({ ...prev, language: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateFormat">Date Format</Label>
          <Select
            value={settings.dateFormat}
            onValueChange={(value) =>
              setSettings((prev) => ({ ...prev, dateFormat: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
              <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
              <SelectItem value="yyyymmdd">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark themes
            </p>
          </div>
          <Switch
            id="darkMode"
            checked={settings.isDarkMode}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, isDarkMode: checked }))
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save General Settings</Button>
      </div>
    </div>
  );
}
