"use client";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import StatsCards from "@/components/admin/dashboard/StatsCard";
import UpcomingDeadlines from "@/components/admin/dashboard/UpcomingDeadlines";
import RecentActivites from "@/components/admin/dashboard/RecentActivites";

import { useState } from "react";

export default function AdminDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* {sidebarOpen ? (
        <Sidebar open={sidebarOpen} />
      ) : (
        <ColSidebar open={!sidebarOpen} />
      )} */}
      <Sidebar isExpanded={sidebarExpanded} />

      <div className="flex-1 flex flex-col">
        <Header
          userName="John Doe"
          role="Senior Partner"
          onMenuClick={() => setSidebarExpanded((prev) => !prev)}
        />
        {/* Content container */}
        <div className="px-6 pb-6 space-y-6">
          {/* Top metrics */}
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivites />
            <UpcomingDeadlines />
          </div>
        </div>
      </div>
    </div>
  );
}
