"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  UserHeader,
  UserFilter,
  UserDetail,
  AddUser,
} from "@/components/admin/user";
import { User, UserList } from "@/components/admin/user";

const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@lawfirm.com",
    role: "admin",
    status: "active",
    joinedDate: "2023-01-15",
    subscription: "Premium Plan",
    gender: "male",
    birthdate: "1985-03-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@lawfirm.com",
    role: "user",
    status: "active",
    joinedDate: "2023-02-21",
    subscription: "Premium Plan",
    gender: "female",
    birthdate: "1990-07-22",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@lawfirm.com",
    role: "user",
    status: "inactive",
    joinedDate: "2023-03-08",
    subscription: "Basic Plan",
    gender: "male",
    birthdate: "1988-11-10",
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.wilson@lawfirm.com",
    role: "user",
    status: "active",
    joinedDate: "2023-04-12",
    subscription: "Basic Plan",
    gender: "female",
    birthdate: "1992-05-18",
  },
  {
    id: "5",
    name: "David Miller",
    email: "david.miller@lawfirm.com",
    role: "admin",
    status: "active",
    joinedDate: "2023-05-05",
    subscription: "Premium Plan",
    gender: "male",
    birthdate: "1987-09-03",
  },
  {
    id: "6",
    name: "Lisa Chen",
    email: "lisa.chen@lawfirm.com",
    role: "user",
    status: "active",
    joinedDate: "2023-06-18",
    subscription: "Basic Plan",
    gender: "female",
    birthdate: "1991-12-25",
  },
  {
    id: "7",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@lawfirm.com",
    role: "user",
    status: "inactive",
    joinedDate: "2023-07-22",
    subscription: "Basic Plan",
    gender: "prefer-not-to-say",
    birthdate: "1989-04-14",
  },
];

export default function UserPage() {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  // Remove unused isUserAdd state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const filteredUsers = dummyUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (userId: string, updates: Partial<User>) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );

    // TODO: API integration for updating user
    // try {
    //   const response = await fetch(`/api/users/${userId}`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(updates)
    //   })
    //   if (!response.ok) throw new Error('Failed to update user')
    //   const updatedUser = await response.json()
    //   setUsers(prevUsers =>
    //     prevUsers.map(user => user.id === userId ? updatedUser : user)
    //   )
    // } catch (error) {
    //   console.error('Error updating user:', error)
    // }
  };
  // This function opens the AddUser modal
  const handleAddUserClick = () => {
    setIsAddUserOpen(true);
  };

  // This function is called when a user is added from AddUser
  const handleUserAdd = (userData: any) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      joinedDate: userData.joinedDate,
      subscription: `${
        userData.subscription.charAt(0).toUpperCase() +
        userData.subscription.slice(1)
      } Plan`,
      gender: userData.gender,
      birthdate: userData.birthdate,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setIsAddUserOpen(false);
    console.log("New user added:", newUser);
  };
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <UserHeader onUserAddClick={handleAddUserClick} />
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
          onSave={handleSaveUser}
        />

        <AddUser
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onAddUser={handleUserAdd}
        />
      </div>
    </AdminLayout>
  );
}
