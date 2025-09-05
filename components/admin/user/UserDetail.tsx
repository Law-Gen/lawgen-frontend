"use client";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Input,
  Avatar,
  AvatarFallback,
} from "@/components/ui";
import { X } from "lucide-react";

import { useState } from "react";
import { User } from "./UserList";

interface UserDetailProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<User>) => void;
}

export default function UserDetail({
  user,
  isOpen,
  onClose,
  onSave,
}: UserDetailProps) {
  const [role, setRole] = useState<"admin" | "user">("user");
  const [status, setStatus] = useState(user?.status || "active");
  const [subscription, setSubscription] = useState<
    "basic" | "premium" | "enterprise"
  >("basic");
  const [gender, setGender] = useState(user?.gender || "");
  const [birthdate, setBirthdate] = useState(user?.birthdate || "");

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSave = () => {
    // Determine subscription value based on isPremium and user selection
    let subscription: "basic" | "premium" | "enterprise" = "basic";
    if (
      user?.subscription === "enterprise" ||
      user?.subscription === "premium" ||
      user?.subscription === "basic"
    ) {
      subscription = user.subscription;
    }
    // If you want to allow changing subscription, you should store the selected value in state
    // For example, add: const [subscription, setSubscription] = useState<"basic" | "premium" | "enterprise">(user?.subscription || "basic");
    // And update <Select> to use value={subscription} and onValueChange={setSubscription}
    onSave(user.id, {
      role: role as "admin" | "user",
      status: status as "active" | "inactive",
      subscription,
      gender: gender as "male" | "female" | "prefer-not-to-say" | undefined,
      birthdate: birthdate || undefined,
    });
    onClose();
  };
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-card border-l border-border z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              User Details
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="text-center space-y-4">
            <Avatar className="w-20 h-20 mx-auto bg-primary text-primary-foreground">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Role</label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as "admin" | "user")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Status
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="active"
                  name="status"
                  value="active"
                  checked={status === "active"}
                  onChange={(e) =>
                    setStatus(e.target.value as "active" | "inactive")
                  }
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="active" className="text-sm text-foreground">
                  Active
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="inactive"
                  name="status"
                  value="inactive"
                  checked={status === "inactive"}
                  onChange={(e) =>
                    setStatus(e.target.value as "active" | "inactive")
                  }
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="inactive" className="text-sm text-foreground">
                  Inactive
                </label>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Subscription
            </label>
            {/* <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            </div> */}
            <Select
              value={subscription}
              onValueChange={(value) =>
                setSubscription(value as "basic" | "premium" | "enterprise")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Gender (Optional)
            </label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Birthdate Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Birthdate (Optional)
            </label>
            <Input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
