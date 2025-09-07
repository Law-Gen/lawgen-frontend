"use client";

import {
  Building2,
  User,
  Mail,
  Phone,
  Clock,
  Globe,
  MapPin,
  User2,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalEntity } from "@/src/store/slices/legalAidSlice";

interface AidCardProps {
  service: LegalEntity;
  onView: (service: LegalEntity) => void;
  onEdit: (service: LegalEntity) => void;
  onDelete: (serviceId: string) => void;
}

export default function AidCard({
  service,
  onView,
  onEdit,
  onDelete,
}: AidCardProps) {
  const getTypeIcon = () => {
    return service.entity_type === "PRIVATE_LAW_FIRM" ||
      service.entity_type === "LEGAL_AID_ORGANIZATION" ? (
      <Building2 className="h-5 w-5 text-amber-600" />
    ) : (
      <User className="h-5 w-5 text-amber-600" />
    );
  };

  const getTypeBadge = () => {
    let label = "";
    if (service.entity_type === "PRIVATE_LAW_FIRM") label = "Private Law Firm";
    else if (service.entity_type === "LEGAL_AID_ORGANIZATION")
      label = "Legal Aid Org.";
    else if (service.entity_type === "PRO_BONO_LAWYER")
      label = "Pro Bono Lawyer";
    else label = service.entity_type;
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        {label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg">{getTypeIcon()}</div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {service.name}
            </h3>
            <div className="mt-1">{getTypeBadge()}</div>
          </div>
        </div>
        <Trash
          onClick={() => onDelete(service.id)}
          className="text-red-600"
        ></Trash>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-amber-700 font-medium text-sm">
          {service.services_offered?.join(", ")}
        </p>
        <p className="text-gray-600 text-sm line-clamp-2">
          {service.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span>{service.email?.join(", ")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{service.phone?.join(", ")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Globe className="h-4 w-4" />
          <span>{service.website}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>
            {service.city}, {service.sub_city}, Woreda {service.woreda},{" "}
            {service.street_address}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{service.working_hours}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User2 className="h-4 w-4" />
          <span>{service.contact_person}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold">Established:</span>
          <span>{service.date_of_establishment}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold">Jurisdiction:</span>
          <span>{service.jurisdiction}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold">Status:</span>
          <span>{service.status}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          onClick={() => onView(service)}
          className="bg-amber-700 hover:bg-amber-800 text-white"
        >
          View Details
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
          Edit
        </Button>
      </div>
    </div>
  );
}
