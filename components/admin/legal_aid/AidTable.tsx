"use client";

import { Building2, User, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LegalAidService } from "./AidCard";

interface LegalAidTableProps {
  services: LegalAidService[];
  onView: (service: LegalAidService) => void;
  onEdit: (service: LegalAidService) => void;
  onDelete: (serviceId: string) => void;
}

export default function AidTable({
  services,
  onView,
  onEdit,
  onDelete,
}: LegalAidTableProps) {
  const getTypeIcon = (type: string) => {
    return type === "organization" ? (
      <Building2 className="h-4 w-4 text-amber-600" />
    ) : (
      <User className="h-4 w-4 text-amber-600" />
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          type === "organization"
            ? "bg-amber-100 text-amber-800"
            : "bg-amber-100 text-amber-800"
        }`}
      >
        {type === "organization" ? "Organization" : "Lawyer"}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center mr-3">
                      {getTypeIcon(service.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {service.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTypeBadge(service.type)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {service.specialization.join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{service.email}</div>
                  <div className="text-sm text-gray-500">{service.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {service.availability}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(service)}
                    >
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
