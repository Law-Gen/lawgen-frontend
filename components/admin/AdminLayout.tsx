"use client";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { useState, type ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  userName?: string;
  role?: string;
}

export default function AdminLayout({
  children,
  userName,
  role,
}: AdminLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isExpanded={sidebarExpanded} />

      <div className="flex-1 flex flex-col">
        <Header
          userName={userName}
          role={role}
          onMenuClick={() => setSidebarExpanded((prev) => !prev)}
        />

        <main className="flex-1 overflow-auto">
          <div className="px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
