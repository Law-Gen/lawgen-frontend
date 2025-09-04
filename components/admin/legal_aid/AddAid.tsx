"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddAidProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (serviceData: any) => void;
}

export default function AddAid({ isOpen, onClose, onAdd }: AddAidProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "organization",
    email: "",
    phone: "",
    address: "",
    website: "",
    languages: "",
    specialization: "",
    availability: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData = {
      ...formData,
      id: Date.now().toString(),
      specialization: formData.specialization.split(",").map((s) => s.trim()),
      languages: formData.languages.split(",").map((l) => l.trim()),
    };

    onAdd(serviceData);

    // Reset form
    setFormData({
      name: "",
      type: "organization",
      email: "",
      phone: "",
      address: "",
      website: "",
      languages: "",
      specialization: "",
      availability: "",
      description: "",
    });

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Legal Aid Service
          </DialogTitle>
          <p className="text-gray-600">
            Add a new legal aid organization or pro bono lawyer to the directory
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter organization or lawyer name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
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
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State, ZIP"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="www.example.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="languages">Languages Spoken</Label>
              <Input
                id="languages"
                placeholder="English, Spanish, French"
                value={formData.languages}
                onChange={(e) => handleInputChange("languages", e.target.value)}
              />
            </div>
          </div>

          {/* Service Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Service Information
            </h3>
            <div>
              <Label htmlFor="specialization">Specialization *</Label>
              <Input
                id="specialization"
                placeholder="Family Law, Immigration Law, Housing Rights"
                value={formData.specialization}
                onChange={(e) =>
                  handleInputChange("specialization", e.target.value)
                }
                required
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                placeholder="Mon-Fri 9AM-5PM, Tue/Thu 2PM-6PM"
                value={formData.availability}
                onChange={(e) =>
                  handleInputChange("availability", e.target.value)
                }
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the services provided, areas of expertise, and any special programs..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
              + Add Legal Aid Service
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
