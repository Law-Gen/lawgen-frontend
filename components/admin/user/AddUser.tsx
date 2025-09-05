"use client";

import type React from "react";
import { useState } from "react";

import { X, UserPlus } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Avatar,
  AvatarFallback,
  Label,
  Textarea,
} from "@/components/ui";

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: any) => void;
}

export default function AddUser({ isOpen, onClose, onAddUser }: AddUserProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("active");
  const [subscription, setSubscription] = useState("basic");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!firstName || !lastName || !email || !role || !subscription) {
      alert("please fill in all the requiered fields");
      return;
    }

    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      phone: phone || undefined,
      role,
      status,
      subscription,
      gender: gender || undefined,
      birthdate: birthdate || undefined,
      joinedDate: new Date().toISOString().split("T")[0],
    };
  };

  const handleAddUser = () => {
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      role,
      status,
      subscription,
      gender,
      birthdate,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    onAddUser(userData);

    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRole("");
    setStatus("active");
    setSubscription("basic");
    setGender("");
    setBirthdate("");
    onClose();
  };
  if (!isOpen) return null;

  return (
    // <Dialog open={isOpen} onOpenChange={handleClose}>
    //   <DialogContent className="sm:max-w-md">
    //     <DialogHeader>
    //       <DialogTitle className="text-xl font-semibold text-gray-900">
    //         Add User
    //       </DialogTitle>
    //       <Button
    //         variant="ghost"
    //         size="sm"
    //         onClick={handleClose}
    //         className="absolute right-4 top-4 p-0 h-auto"
    //       ></Button>
    //     </DialogHeader>
    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <Label
    //         htmlFor="userName"
    //         className="text-sm font-medium text-gray-700"
    //       >
    //         User's Name
    //       </Label>
    //     </form>
    //   </DialogContent>
    // </Dialog>

    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto max-h-screen">
        <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Add New User
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            {/* User Preview */}
            {(firstName || lastName) && (
              <div className="text-center space-y-4 p-4 bg-muted/30 rounded-lg">
                <Avatar className="w-16 h-16 mx-auto bg-primary text-primary-foreground">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                    {getInitials(firstName, lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {firstName} {lastName}
                  </h3>
                  {email && (
                    <p className="text-sm text-muted-foreground">{email}</p>
                  )}
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <Input
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Gender
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Birth Date
                  </label>
                  <Input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Account Settings
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Status
                  </label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Subscription
                  </label>
                  <Select value={subscription} onValueChange={setSubscription}>
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
