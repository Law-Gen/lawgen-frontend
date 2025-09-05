"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCards from "@/components/admin/dashboard/StatsCard";
import UpcomingDeadlines from "@/components/admin/dashboard/UpcomingDeadlines";
import RecentActivites from "@/components/admin/dashboard/RecentActivites";

import { useState } from "react";

export default function AdminDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <AdminLayout>
      <div className="space-y-6">
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivites />
          <UpcomingDeadlines />
        </div>
      </div>
    </AdminLayout>
  );
}
