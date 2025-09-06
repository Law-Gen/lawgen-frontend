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

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import {
  User,
  promoteToAdmin,
  activateUser,
  demoteToUser,
  deactivateUser,
} from "@/src/store/slices/userSlice";

interface UserDetailProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetail({ user, isOpen, onClose }: UserDetailProps) {
  const dispatch = useAppDispatch();
  const [role, setRole] = useState<"admin" | "user">("user");
  // const [status, setStatus] = useState(user?.status || "active");
  const [subscription, setSubscription] = useState<
    "free" | "premium" | "enterprise"
  >("free");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setSubscription(user.subscription_status);
      setGender(user.profile.gender || "");
      setBirthdate(
        user.profile.birth_date &&
          user.profile.birth_date !== "0001-01-01T00:00:00Z"
          ? user.profile.birth_date.split("T")[0]
          : ""
      );
    }
  }, [user]);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSave = async () => {
    // // Determine subscription value based on isPremium and user selection
    // let subscription: "basic" | "premium" | "enterprise" = "basic";
    // if (
    //   user?.subscription === "enterprise" ||
    //   user?.subscription === "premium" ||
    //   user?.subscription === "basic"
    // ) {
    //   subscription = user.subscription;
    // }
    // // If you want to allow changing subscription, you should store the selected value in state
    // // For example, add: const [subscription, setSubscription] = useState<"basic" | "premium" | "enterprise">(user?.subscription || "basic");
    // // And update <Select> to use value={subscription} and onValueChange={setSubscription}
    // onSave(user.id, {
    //   role: role as "admin" | "user",
    //   status: status as "active" | "inactive",
    //   subscription,
    //   gender: gender as "male" | "female" | "prefer-not-to-say" | undefined,
    //   birthdate: birthdate || undefined,
    // });
    // onClose();

    if (role === "admin" && user.role !== "admin") {
      await dispatch(promoteToAdmin(user.email));
    } else if (role === "admin" && user.role != "user") {
      await dispatch(demoteToUser(user.email));
    }
    onClose();
  };
  const handleActivate = async () => {
    await dispatch(activateUser(user.email));
    onClose();
  };

  const handleDeactivate = async () => {
    await dispatch(deactivateUser(user.email));
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
              {user.profile.profile_picture_url ? (
                <img
                  src={user.profile.profile_picture_url || "/placeholder.svg"}
                  alt={user.full_name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              )}
            </Avatar>

            <div>
              <h3 className="font-semibold text-foreground">
                {user.full_name}
              </h3>
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

          {/* Subscription Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Subscription
            </label>
            <div className="p-3 bg-muted/50 rounded-lg">
              <span className="text-sm capitalize">
                {user.subscription_status}
              </span>
            </div>
          </div>

          {/* Gender Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Gender
            </label>
            <div className="p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">
                {user.profile.gender || "Not specified"}
              </span>
            </div>
          </div>

          {/* Birthdate Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Birthdate
            </label>
            <div className="p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">
                {user.profile.birth_date &&
                user.profile.birth_date !== "0001-01-01T00:00:00Z"
                  ? new Date(user.profile.birth_date).toLocaleDateString()
                  : "Not specified"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {role === "admin" && user.role !== "admin" && (
              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Promote to Admin
              </Button>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleActivate}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Activate User
              </Button>
              <Button
                onClick={handleDeactivate}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Deactivate User
              </Button>
            </div>
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
