"use client";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

interface UserHeaderProps {
  onUserAddClick: () => void;
}

export default function UserHeader({ onUserAddClick }: UserHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text 3xl font-bold text-gray-900 ">Users</h1>
      </div>
      <Button
        onClick={onUserAddClick}
        className="bg-amber-700 hover:bg-amber-800 px-6 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add User
      </Button>
    </div>
  );
}
