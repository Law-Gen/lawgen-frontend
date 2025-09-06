"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { UserList, UserFilter, UserDetail } from "@/components/admin/user";
import {
  type User,
  setSelectedUser,
  fetchUsers,
} from "@/src/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

export default function UserPage() {
  const dispatch = useAppDispatch();

  const { users, selectedUser, error } = useAppSelector(
    (state: any) => state.users
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter users by search and role
  const filteredUsers = users.filter(
    (user: { full_name: string; email: string; role: string }) => {
      const matchesSearch =
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    }
  );

  const handleViewUser = (user: User) => {
    dispatch(setSelectedUser(user));
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    dispatch(setSelectedUser(null));
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor user accounts
            </p>
          </div>
        </div>
        <UserFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
        />
        <UserList users={filteredUsers} onViewUser={handleViewUser} />
        <UserDetail
          user={selectedUser}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
        />
      </div>
    </AdminLayout>
  );
}
