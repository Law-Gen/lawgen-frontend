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
import { LegalEntity } from "@/src/store/slices/legalAidSlice";
import { useAppDispatch } from "@/src/store/hooks";
import { updateLegalEntity, deleteLegalEntity } from "@/src/store/slices/legalAidSlice";

interface EditAidProps {
  isOpen: boolean;
  onClose: () => void;
  service: LegalEntity | null;
  onSave: (serviceData: LegalEntity) => void;
  onDelete: (serviceId: string) => void;
}

export default function EditAid({
  isOpen,
  onClose,
  service,
  onSave,
  onDelete,
}: EditAidProps) {
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

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        entity_type: service.entity_type,
        email: service.email.join(", "),
        phone: service.phone.join(", "),
        website: service.website || "",
        city: service.city,
        sub_city: service.sub_city,
        woreda: service.woreda,
        street_address: service.street_address,
        description: service.description,
        services_offered: service.services_offered.join(", "),
        jurisdiction: service.jurisdiction,
        working_hours: service.working_hours,
        contact_person: service.contact_person,
        date_of_establishment: service.date_of_establishment,
        status: service.status,
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

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

    await dispatch(updateLegalEntity({ id: service.id, updates: payload }));
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    if (
      service &&
      window.confirm("Are you sure you want to delete this service?")
    ) {
      await dispatch(deleteLegalEntity(service.id));
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
            <Label htmlFor="edit-entity-type">Entity Type</Label>
            <Select
              value={formData.entity_type}
              onValueChange={(value) => handleInputChange("entity_type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE_LAW_FIRM">Private Law Firm</SelectItem>
                <SelectItem value="LEGAL_AID_ORGANIZATION">Legal Aid Organization</SelectItem>
                <SelectItem value="PRO_BONO_LAWYER">Pro Bono Lawyer</SelectItem>
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
            <Label htmlFor="edit-services-offered">Services Offered</Label>
            <Input
              id="edit-services-offered"
              value={formData.services_offered}
              onChange={(e) =>
                handleInputChange("services_offered", e.target.value)
              }
              placeholder="Family Law, Immigration Law, Housing Rights"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-city">City</Label>
            <Input
              id="edit-city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-sub-city">Sub City</Label>
            <Input
              id="edit-sub-city"
              value={formData.sub_city}
              onChange={(e) => handleInputChange("sub_city", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-woreda">Woreda</Label>
            <Input
              id="edit-woreda"
              value={formData.woreda}
              onChange={(e) => handleInputChange("woreda", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-street-address">Street Address</Label>
            <Textarea
              id="edit-street-address"
              value={formData.street_address}
              onChange={(e) => handleInputChange("street_address", e.target.value)}
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
            <Label htmlFor="edit-working-hours">Working Hours</Label>
            <Input
              id="edit-working-hours"
              value={formData.working_hours}
              onChange={(e) =>
                handleInputChange("working_hours", e.target.value)
              }
              placeholder="Mon-Fri 9AM-5PM"
            />
          </div>

          <div>
            <Label htmlFor="edit-contact-person">Contact Person</Label>
            <Input
              id="edit-contact-person"
              value={formData.contact_person}
              onChange={(e) => handleInputChange("contact_person", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-jurisdiction">Jurisdiction</Label>
            <Input
              id="edit-jurisdiction"
              value={formData.jurisdiction}
              onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-date-establishment">Date of Establishment</Label>
            <Input
              id="edit-date-establishment"
              type="date"
              value={formData.date_of_establishment}
              onChange={(e) => handleInputChange("date_of_establishment", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
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
