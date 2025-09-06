"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  AddAid,
  AidCard,
  AidFilter,
  AidHeader,
  AidTable,
  EditAid,
} from "@/components/admin/legal_aid";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchLegalEntities, deleteLegalEntity } from "@/src/store/slices/legalAidSlice";
import { LegalEntity } from "@/src/store/slices/legalAidSlice";

export default function LegalAidPage() {
  const dispatch = useAppDispatch();
  const { entities: services, loading, error } = useAppSelector((state) => state.legalAid);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<LegalEntity | null>(null);

  // Fetch legal entities on component mount
  useEffect(() => {
    dispatch(fetchLegalEntities());
  }, [dispatch]);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.services_offered.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || service.entity_type === typeFilter;

    const matchesSpecialization =
      specializationFilter === "all" ||
      service.services_offered.some(
        (spec) =>
          spec.toLowerCase().replace(/\s+/g, "-") === specializationFilter
      );

    return matchesSearch && matchesType && matchesSpecialization;
  });

  const handleViewService = (service: LegalEntity) => {
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

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-500">Loading legal aid services...</div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-red-500">Error: {error}</div>
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!loading && !error && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <AidCard
                    key={service.id}
                    service={service}
                    onView={handleViewService}
                    onEdit={handleViewService}
                    onDelete={(id) => dispatch(deleteLegalEntity(id))}
                  />
                ))}
              </div>
            ) : (
              <AidTable
                services={filteredServices}
                onView={handleViewService}
                onEdit={handleViewService}
                onDelete={(id) => dispatch(deleteLegalEntity(id))}
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
          </>
        )}
      </div>

      <AddAid
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={() => {}} // Not used anymore - AddAid handles this with Redux
      />

      <EditAid
        isOpen={isEditSidebarOpen}
        onClose={() => setIsEditSidebarOpen(false)}
        service={selectedService}
        onSave={() => {}} // Not used anymore - EditAid handles this with Redux
        onDelete={() => {}} // Not used anymore - EditAid handles this with Redux
      />
    </AdminLayout>
  );
}
