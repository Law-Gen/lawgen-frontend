"use client";
import { useEffect, useState } from "react";

import { FileText, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui";
import {
  fetchSingleContent,
  fetchContentsByGroup,
  deleteContentById,
} from "@/src/store/slices/legalContentSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

interface DocumentTableProps {
  groupId: string;
}

export default function DocumentTable({ groupId }: DocumentTableProps) {
  const dispatch = useAppDispatch();
  const { contents, loading, error, singleContent } = useAppSelector(
    (state) => state.legalContent
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchContentsByGroup(groupId));
    }
  }, [dispatch, groupId]);

  const handleDelete = (id: string) => {
    dispatch(deleteContentById(id));
  };

  const handleView = (id: string) => {
    dispatch(fetchSingleContent(id));
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-8 gap-4 px-6 py-4 bg-muted border-b border-border text-sm font-medium text-foreground">
        <div className="col-span-3">Document</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Actions</div>
      </div>

      <div className="divide-y divide-border">
        {loading && <div className="p-4 text-muted-foreground">Loading...</div>}
        {error && <div className="p-4 text-destructive">{error}</div>}
        {contents.length === 0 && !loading && !error && (
          <div className="p-4 text-center text-muted-foreground">
            No documents found in this group.
          </div>
        )}
        {contents.map((document) => (
          <div
            key={document.id}
            className="grid grid-cols-8 gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
          >
            <div className="col-span-3 flex items-center gap-3">
              <div className="flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {document.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {document.language} • {document.group_name}
                </p>
              </div>
            </div>

            <div className="col-span-2 flex items-center">
              <span className="text-sm text-foreground">
                {document.group_name}
              </span>
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleView(document.id)}
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                title="View Content"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(document.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Delete Content"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Dialog for single document info */}
      {dialogOpen && singleContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-lg shadow-lg p-8 max-w-lg w-full relative border border-border">
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              onClick={handleCloseDialog}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {singleContent.name}
            </h2>
            <div className="mb-2 text-sm text-muted-foreground">
              Group: {singleContent.group_name}
            </div>
            <div className="mb-2 text-sm text-muted-foreground">
              Language: {singleContent.language}
            </div>
            <div className="mb-2 text-sm text-muted-foreground">
              Description: {singleContent.description}
            </div>
            <div className="mb-2 text-sm text-muted-foreground">
              URL:{" "}
              <a
                href={singleContent.url}
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {singleContent.url}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
