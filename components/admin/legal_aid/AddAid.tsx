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
import { useAppDispatch } from "@/src/store/hooks";
import { createLegalEntity } from "@/src/store/slices/legalAidSlice";

interface AddAidProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (serviceData: any) => void;
}

export default function AddAid({ isOpen, onClose, onAdd }: AddAidProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    entity_type: "PRIVATE_LAW_FIRM",
    email: "",
    phone: "",
    website: "",
    city: "",
    sub_city: "",
    woreda: "",
    street_address: "",
    description: "",
    services_offered: "",
    jurisdiction: "",
    working_hours: "",
    contact_person: "",
    date_of_establishment: "",
    status: "ACTIVE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare the payload as expected by the backend
    const payload = {
      ...formData,
      phone: formData.phone
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      email: formData.email
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      services_offered: formData.services_offered
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    await dispatch(createLegalEntity(payload));
    // Reset form
    setFormData({
      name: "",
      entity_type: "PRIVATE_LAW_FIRM",
      email: "",
      phone: "",
      website: "",
      city: "",
      sub_city: "",
      woreda: "",
      street_address: "",
      description: "",
      services_offered: "",
      jurisdiction: "",
      working_hours: "",
      contact_person: "",
      date_of_establishment: "",
      status: "ACTIVE",
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
                <Label htmlFor="entity_type">Entity Type *</Label>
                <Select
                  value={formData.entity_type}
                  onValueChange={(value) =>
                    handleInputChange("entity_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIVATE_LAW_FIRM">
                      Private Law Firm
                    </SelectItem>
                    <SelectItem value="LEGAL_AID_ORGANIZATION">
                      Legal Aid Organization
                    </SelectItem>
                    <SelectItem value="PRO_BONO_LAWYER">
                      Pro Bono Lawyer
                    </SelectItem>
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
                  placeholder="+251-"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="street_address">Street Address</Label>
                <Input
                  id="street_address"
                  placeholder="123 Main St, City, State, ZIP"
                  value={formData.street_address}
                  onChange={(e) =>
                    handleInputChange("street_address", e.target.value)
                  }
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
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Addis Ababa"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sub_city">Sub City</Label>
              <Input
                id="sub_city"
                placeholder="Bole"
                value={formData.sub_city}
                onChange={(e) => handleInputChange("sub_city", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="woreda">Woreda</Label>
              <Input
                id="woreda"
                placeholder="03"
                value={formData.woreda}
                onChange={(e) => handleInputChange("woreda", e.target.value)}
              />
            </div>
          </div>

          {/* Service Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Service Information
            </h3>
            <div>
              <Label htmlFor="services_offered">Services Offered *</Label>
              <Input
                id="services_offered"
                placeholder="Corporate Law, Civil Litigation"
                value={formData.services_offered}
                onChange={(e) =>
                  handleInputChange("services_offered", e.target.value)
                }
                required
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="working_hours">Working Hours</Label>
              <Input
                id="working_hours"
                placeholder="Mon-Fri 08:00-17:00"
                value={formData.working_hours}
                onChange={(e) =>
                  handleInputChange("working_hours", e.target.value)
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
            <div className="mt-4">
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              <Input
                id="jurisdiction"
                placeholder="Federal"
                value={formData.jurisdiction}
                onChange={(e) =>
                  handleInputChange("jurisdiction", e.target.value)
                }
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                placeholder="John Doe"
                value={formData.contact_person}
                onChange={(e) =>
                  handleInputChange("contact_person", e.target.value)
                }
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="date_of_establishment">
                Date of Establishment
              </Label>
              <Input
                id="date_of_establishment"
                type="date"
                value={formData.date_of_establishment}
                onChange={(e) =>
                  handleInputChange("date_of_establishment", e.target.value)
                }
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
