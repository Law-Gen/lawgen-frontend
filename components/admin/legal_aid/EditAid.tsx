"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

import {
  Button,
  Select,
  Input,
  Label,
  Textarea,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { LegalAidService } from "./AidCard";

interface EditAidProps {
  isOpen: boolean;
  onClose: () => void;
  service: LegalAidService | null;
  onSave: (serviceData: LegalAidService) => void;
  onDelete: (serviceId: string) => void;
}

export default function EditAid({
  isOpen,
  onClose,
  service,
  onSave,
  onDelete,
}: EditAidProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "organization" as "organization" | "lawyer",
    email: "",
    phone: "",
    address: "",
    website: "",
    languages: "",
    specialization: "",
    availability: "",
    description: "",
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        type: service.type,
        email: service.email,
        phone: service.phone,
        address: service.address,
        website: service.website || "",
        languages: service.languages.join(", "),
        specialization: service.specialization.join(", "),
        availability: service.availability,
        description: service.description,
      });
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    const updatedService: LegalAidService = {
      ...service,
      ...formData,
      specialization: formData.specialization.split(",").map((s) => s.trim()),
      languages: formData.languages.split(",").map((l) => l.trim()),
    };

    onSave(updatedService);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    if (
      service &&
      window.confirm("Are you sure you want to delete this service?")
    ) {
      onDelete(service.id);
      onClose();
    }
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Service Details
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="lawyer">Lawyer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-specialization">Specialization</Label>
            <Input
              id="edit-specialization"
              value={formData.specialization}
              onChange={(e) =>
                handleInputChange("specialization", e.target.value)
              }
              placeholder="Family Law, Immigration Law, Housing Rights"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-address">Address</Label>
            <Textarea
              id="edit-address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="edit-website">Website</Label>
            <Input
              id="edit-website"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="edit-availability">Availability</Label>
            <Input
              id="edit-availability"
              value={formData.availability}
              onChange={(e) =>
                handleInputChange("availability", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="edit-languages">Languages</Label>
            <Input
              id="edit-languages"
              value={formData.languages}
              onChange={(e) => handleInputChange("languages", e.target.value)}
              placeholder="English, Spanish, French"
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t">
            <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
              ✓ Save Changes
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              >
                Delete Service
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
