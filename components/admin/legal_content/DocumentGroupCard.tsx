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

export default function DocumentGroupCard({
  onGroupClick,
}: DocumentGroupCardProps) {
  const dispatch = useAppDispatch();
  const { groups, loading, error, meta } = useAppSelector(
    (state) => state.legalContent
  );

  useEffect(() => {
    dispatch(fetchContentGroups());
  }, [dispatch]);

  const handleDeleteGroup = (group: LegalContentGroup) => {
    dispatch(deleteGroupById(group.group_id));
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {meta && (
          <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-2 border border-border text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>
              Total Items:{" "}
              <span className="font-semibold text-foreground">
                {meta.total_items}
              </span>
            </span>
            <span>
              Page:{" "}
              <span className="font-semibold text-foreground">
                {meta.current_page}
              </span>{" "}
              / {meta.total_pages}
            </span>
            <span>
              Page Size:{" "}
              <span className="font-semibold text-foreground">
                {meta.page_size}
              </span>
            </span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.group_id}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden"
            onClick={() => onGroupClick(group)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary bg-primary/10 rounded-lg p-1" />
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {group.group_name}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup(group);
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                title="Delete Group"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            {meta && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4 mt-4">
                <span>
                  Total Items:{" "}
                  <span className="font-semibold text-foreground">
                    {meta.total_items}
                  </span>
                </span>
                <span>
                  Page:{" "}
                  <span className="font-semibold text-foreground">
                    {meta.current_page}
                  </span>{" "}
                  / {meta.total_pages}
                </span>
                <span>
                  Page Size:{" "}
                  <span className="font-semibold text-foreground">
                    {meta.page_size}
                  </span>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {loading && <div className="mt-4 text-muted-foreground">Loading...</div>}
      {error && <div className="mt-4 text-destructive">{error}</div>}
    </div>
  );
}
