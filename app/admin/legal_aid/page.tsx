"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  AddAid,
  AidCard,
  AidFilter,
  AidHeader,
  AidTable,
  EditAid,
} from "@/components/admin/legal_aid";

import type { LegalAidService } from "@/components/admin/legal_aid/AidCard";

const dummyServices: LegalAidService[] = [
  {
    id: "1",
    name: "Legal Aid Society of Metro",
    type: "organization",
    specialization: ["Family Law", "Housing Rights"],
    email: "info@legalaidmetro.org",
    phone: "+1 (555) 123-4567",
    address: "123 Justice Ave, Metro City, MC 12345",
    website: "www.legalaidmetro.org",
    availability: "Mon-Fri 9AM-5PM",
    languages: ["English", "Spanish"],
    description:
      "Provides free legal services to low-income families in housing disputes, custody cases, and domestic violence matters.",
  },
  {
    id: "2",
    name: "Sarah Johnson, Esq.",
    type: "lawyer",
    specialization: ["Immigration Law", "Civil Rights"],
    email: "sarah.johnson@probono.law",
    phone: "+1 (555) 234-5678",
    address: "456 Liberty St, Metro City, MC 12346",
    website: "www.johnsonlaw.com",
    availability: "Tue, Thu 2PM-6PM",
    languages: ["English", "Spanish", "French"],
    description:
      "Experienced immigration attorney offering pro bono services for asylum seekers and citizenship applications.",
  },
  {
    id: "3",
    name: "Community Legal Clinic",
    type: "organization",
    specialization: ["Consumer Protection", "Bankruptcy"],
    email: "help@communitylegal.org",
    phone: "+1 (555) 345-6789",
    address: "789 Community Blvd, Metro City, MC 12347",
    website: "www.communitylegal.org",
    availability: "Mon, Wed, Fri 10AM-4PM",
    languages: ["English"],
    description:
      "Non-profit clinic providing free legal advice and representation for consumer debt and bankruptcy cases.",
  },
  {
    id: "4",
    name: "Michael Rodriguez, Esq.",
    type: "lawyer",
    specialization: ["Employment Law", "Workers Rights"],
    email: "mrodriguez@freelegal.net",
    phone: "+1 (555) 456-7890",
    address: "321 Worker Ave, Metro City, MC 12348",
    availability: "Mon-Wed 1PM-5PM",
    languages: ["English", "Spanish"],
    description:
      "Specializes in employment law and workers rights cases, offering pro bono services for wage disputes and workplace discrimination.",
  },
];

export default function LegalAidPage() {
  const [services, setServices] = useState<LegalAidService[]>(dummyServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<LegalAidService | null>(null);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.specialization.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || service.type === typeFilter;

    const matchesSpecialization =
      specializationFilter === "all" ||
      service.specialization.some(
        (spec) =>
          spec.toLowerCase().replace(/\s+/g, "-") === specializationFilter
      );

    return matchesSearch && matchesType && matchesSpecialization;
  });

  const handleAddService = (serviceData: any) => {
    setServices((prev) => [...prev, serviceData]);

    // API integration point
    // try {
    //   const response = await fetch('/api/legal-aid-services', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(serviceData)
    //   })
    //   const newService = await response.json()
    //   setServices(prev => [...prev, newService])
    // } catch (error) {
    //   console.error('Failed to add service:', error)
    // }
  };

  const handleEditService = (service: LegalAidService) => {
    setSelectedService(service);
    setIsEditSidebarOpen(true);
  };

  const handleSaveService = (updatedService: LegalAidService) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );

    // API integration point
    // try {
    //   await fetch(`/api/legal-aid-services/${updatedService.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(updatedService)
    //   })
    // } catch (error) {
    //   console.error('Failed to update service:', error)
    // }
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((service) => service.id !== serviceId));

    // API integration point
    // try {
    //   await fetch(`/api/legal-aid-services/${serviceId}`, {
    //     method: 'DELETE'
    //   })
    // } catch (error) {
    //   console.error('Failed to delete service:', error)
    // }
  };

  const handleViewService = (service: LegalAidService) => {
    setSelectedService(service);
    setIsEditSidebarOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AidHeader onAddService={() => setIsAddModalOpen(true)} />

        <AidFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          specializationFilter={specializationFilter}
          onSpecializationFilterChange={setSpecializationFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultsCount={filteredServices.length}
        />

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <AidCard
                key={service.id}
                service={service}
                onView={handleViewService}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
              />
            ))}
          </div>
        ) : (
          <AidTable
            services={filteredServices}
            onView={handleViewService}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
        )}

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No legal aid services found matching your criteria.
            </p>
            <p className="text-gray-400 mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      <AddAid
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddService}
      />

      <EditAid
        isOpen={isEditSidebarOpen}
        onClose={() => setIsEditSidebarOpen(false)}
        service={selectedService}
        onSave={handleSaveService}
        onDelete={handleDeleteService}
      />
    </AdminLayout>
  );
}
