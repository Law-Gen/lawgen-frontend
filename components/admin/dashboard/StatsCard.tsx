"use client";

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
// import { Description } from "@radix-ui/react-toast";
// import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  File,
  TrendingUp,
  ArrowUp,
  ClipboardList,
} from "lucide-react";

// ***** this also part of the api system
// interface DashboardStats {
//   users: number;
//   quizzes: number;
//   documents: number;
// }
interface StatsCardsProps {
  title: string;
  value: string;
  description: string;
  growth: string;
  icon: React.ReactNode;
}

// this is the UI we will be using
function MetricCard({
  title,
  value,
  description,
  growth,
  icon,
}: StatsCardsProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex items-center gap-1 mt-2">
          <ArrowUp className="w-4 h-4 text-chart-1" />
          <span className="text-sm font-medium text-chart-1">{growth}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsCards() {
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* key matrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
}
