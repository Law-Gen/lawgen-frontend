"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { Trash, FileText } from "lucide-react";
import { Button } from "@/components/ui";
import {
  fetchContentGroups,
  fetchContentsByGroup,
  LegalContentGroup,
  deleteGroupById,
} from "@/src/store/slices/legalContentSlice";

interface DocumentGroupCardProps {
  onGroupClick: (group: LegalContentGroup) => void;
}

export default function DocumentGroupCard({ onGroupClick }: DocumentGroupCardProps) {
  const dispatch = useAppDispatch();
  const { groups, loading, error, meta } = useAppSelector((state) => state.legalContent);

  useEffect(() => {
    dispatch(fetchContentGroups());
  }, [dispatch]);

  const handleDeleteGroup = (group: LegalContentGroup) => {
    dispatch(deleteGroupById(group.group_id));
  };

  // Render meta info (pagination)
  const renderMeta = () =>
    meta ? (
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Total Items: {meta.total_items}
          </span>
        </div>
      </div>
    ) : null;

  return (
    <div>
      {renderMeta()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.group_id}
            className="bg-white rounded-xl border border-primary-100 p-6 hover:shadow-lg transition-all duration-200 hover:border-primary-200 flex flex-col justify-between cursor-pointer"
            onClick={() => onGroupClick(group)}
          >
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              {group.group_name}
            </h3>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={e => { e.stopPropagation(); handleDeleteGroup(group); }}
                className="border-primary-200 text-red-600 hover:bg-red-50"
                title="Delete Group"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="mt-4">Loading...</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
}
