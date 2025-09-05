"use client";

import {
  Building2,
  User,
  Mail,
  Phone,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface LegalAidService {
  id: string;
  name: string;
  type: "organization" | "lawyer";
  specialization: string[];
  email: string;
  phone: string;
  address: string;
  website?: string;
  availability: string;
  languages: string[];
  description: string;
}

interface AidCardProps {
  service: LegalAidService;
  onView: (service: LegalAidService) => void;
  onEdit: (service: LegalAidService) => void;
  onDelete: (serviceId: string) => void;
}

export default function AidCard({
  service,
  onView,
  onEdit,
  onDelete,
}: AidCardProps) {
  const getTypeIcon = () => {
    return service.type === "organization" ? (
      <Building2 className="h-5 w-5 text-amber-600" />
    ) : (
      <User className="h-5 w-5 text-amber-600" />
    );
  };

  const getTypeBadge = () => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          service.type === "organization"
            ? "bg-amber-100 text-amber-800"
            : "bg-amber-100 text-amber-800"
        }`}
      >
        {service.type === "organization" ? "Organization" : "Lawyer"}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(service)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(service)}>
              Edit Service
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(service.id)}
              className="text-red-600"
            >
              Delete Service
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-amber-700 font-medium text-sm">
          {service.specialization.join(", ")}
        </p>
        <p className="text-gray-600 text-sm line-clamp-2">
          {service.description}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span>{service.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{service.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{service.availability}</span>
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
