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
  const { contents, loading, error, singleContent } = useAppSelector((state) => state.legalContent);
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
    <div className="bg-white rounded-lg border border-primary-200 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-primary-50 border-b border-primary-200 text-sm font-medium text-primary-700">
        <div className="col-span-4">Document</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">Downloads</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-3">Actions</div>
      </div>

      <div className="divide-y divide-primary-100">
        {loading && <div className="p-4">Loading...</div>}
        {error && <div className="p-4 text-red-500">{error}</div>}
        {contents.length === 0 && !loading && !error && (
          <div className="p-4 text-center text-primary-400">
            No documents found in this group.
          </div>
        )}
        {contents.map((document) => (
          <div
            key={document.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-primary-25 transition-colors"
          >
            <div className="col-span-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-primary-900 truncate">
                  {document.name}
                </h3>
                <p className="text-sm text-primary-600">
                  {document.language} • {document.group_name}
                </p>
              </div>
            </div>

            <div className="col-span-2 flex items-center">
              <span className="text-sm text-primary-700">
                {document.group_name}
              </span>
            </div>

            <div className="col-span-1 flex items-center">
              <span className="text-sm text-primary-900 font-medium">
                {/* Placeholder for downloads */}-
              </span>
            </div>

            <div className="col-span-1 flex items-center">
              <span className="text-sm text-primary-900 font-medium">
                {/* Placeholder for status */}-
              </span>
            </div>

            <div className="col-span-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleView(document.id)}
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                title="View Content"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(document.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={handleCloseDialog}
          >
            ×
          </button>
          <h2 className="text-xl font-semibold mb-4">{singleContent.name}</h2>
          <div className="mb-2 text-sm text-gray-600">Group: {singleContent.group_name}</div>
          <div className="mb-2 text-sm text-gray-600">Language: {singleContent.language}</div>
          <div className="mb-2 text-sm text-gray-600">Description: {singleContent.description}</div>
          <div className="mb-2 text-sm text-gray-600">URL: <a href={singleContent.url} className="text-primary-600 underline" target="_blank" rel="noopener noreferrer">{singleContent.url}</a></div>
        </div>
      </div>
    )}
  </div>
  );
}
