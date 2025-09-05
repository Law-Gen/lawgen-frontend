"use client";

import { Button } from "@/components/ui/button";

interface LegalAidHeaderProps {
  onAddService: () => void;
}

export default function AidHeader({ onAddService }: LegalAidHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Legal Aid Services
          </h1>
          <p className="text-gray-600">
            Manage free legal aid services and pro bono lawyers directory.
          </p>
        </div>
        <Button
          onClick={onAddService}
          className="bg-amber-700 hover:bg-amber-800 text-white"
        >
          + Add Legal Aid Service
        </Button>
      </div>
    </div>
  );
}
