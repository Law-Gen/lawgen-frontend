"use client";
import { Button, Badge, Avatar, AvatarFallback } from "@/components/ui";
import type { User } from "@/src/store/slices/userSlice";

interface UserListProps {
  users: User[];
  onViewUser: (user: User) => void;
}

export default function UserList({ users, onViewUser }: UserListProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "user":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get initials from full name
  const getInitials = (full_name: string) => {
    return full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getSubscriptionDisplay = (status: string) => {
    switch (status) {
      case "enterprise":
        return "Enterprise";
      case "premium":
        return "Premium";
      case "free":
        return "Free";
      default:
        return "Free";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-8 gap-4 p-4 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
        <div>NAME</div>
        <div>EMAIL</div>
        <div>ROLE</div>
        <div>STATUS</div>
        <div>JOINED DATE</div>
        <div>GENDER</div>
        <div>BIRTHDATE</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-8 gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
          >
            {/* profile picture or the initials of the person */}
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                {user.profile.profile_picture_url ? (
                  <img
                    src={user.profile.profile_picture_url || "/placeholder.svg"}
                    alt={user.full_name}
                    className="w-full h-full object-coverr rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {getInitials(user.full_name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="font-medium text-foreground">
                {user.full_name}
              </span>
            </div>

            {/* user email */}
            <div className="text-muted-foreground">{user.email}</div>

            {/* user role */}
            <div>
              <Badge variant="outline" className={getRoleColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>

            {/* subscription */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground capitalize">
                {user.subscription_status}
              </span>
            </div>

            {/* joined date */}
            <div className="text-muted-foreground">{user.created_at}</div>

            {/* user gender */}
            <div className="text-muted-foreground">
              {user.profile.gender
                ? user.profile.gender.charAt(0).toUpperCase() +
                  user.profile.gender.slice(1)
                : "N/A"}
            </div>

            {/* birthdate */}
            <div className="text-muted-foreground">
              {user.profile.birth_date &&
              user.profile.birth_date !== "0001-01-01T00:00:00Z"
                ? formatDate(user.profile.birth_date)
                : "N/A"}
            </div>

            {/* view button */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewUser(user)}
                className="text-muted-foreground hover:text-foreground"
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
