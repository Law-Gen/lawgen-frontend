"use client";
import { Button, Badge, Avatar, AvatarFallback } from "@/components/ui";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  joinedDate: string;
  subscription?: string;
  avatar?: string;
  gender?: "male" | "female" | "prefer-not-to-say";
  birthdate: string;
}

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{user.name}</span>
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
                {user.subscription}
              </span>
            </div>

            {/* joined date */}
            <div className="text-muted-foreground">{user.joinedDate}</div>

            {/* user gender */}
            <div className="text-muted-foreground">
              {user.gender
                ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                : "N/A"}
            </div>

            {/* birthdate */}
            <div className="text-muted-foreground">{user.birthdate}</div>

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
