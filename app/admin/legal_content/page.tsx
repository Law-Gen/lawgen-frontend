"use client";
import { useEffect, useState } from "react";
import {
  fetchContentGroups,
  LegalContentGroup,
} from "@/src/store/slices/legalContentSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  DocumentHeader,
  DocumentFilter,
  DocumentTable,
  UploadDocument,
  DocumentGroupCard,
} from "@/components/admin/legal_content";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

export default function LegalContent() {
  const dispatch = useAppDispatch();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const handleGroupClick = (group: LegalContentGroup) => {
    setSelectedGroupId(group.group_id);
  };

  const handleBackToGroups = () => {
    setSelectedGroupId(null);
  };

  useEffect(() => {
    dispatch(fetchContentGroups());
  }, [dispatch]);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <DocumentHeader onUploadClick={() => setIsUploadOpen(true)} />
        <DocumentFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Show group cards if no group is selected */}
        {!selectedGroupId && (
          <DocumentGroupCard onGroupClick={handleGroupClick} />
        )}

        {/* Show DocumentTable for selected group */}
        {selectedGroupId && (
          <div>
            <button
              className="mb-4 text-primary-600 hover:underline"
              onClick={handleBackToGroups}
            >
              ← Back to Groups
            </button>
            <DocumentTable groupId={selectedGroupId} />
          </div>
        )}

        {/* Upload Document Popup */}
        <UploadDocument
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={() => setIsUploadOpen(false)}
        />
      </div>
    </AdminLayout>
  );
}
