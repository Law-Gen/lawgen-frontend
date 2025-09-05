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
  // ***** this is how we will fetch the data from the back once completed
  // const [stats, setStats] = useState<DashboardStats>({
  //   users: 0,
  //   quizzes: 0,
  //   documents: 0,
  // });

  // // Optional: If you have last month's data for growth
  // const [growth, setGrowth] = useState({
  //   users: 12.5,
  //   quizzes: 5.2,
  //   documents: 8.1,
  //   monthly: 2.3,
  // });

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const [usersRes, quizzesRes, docsRes] = await Promise.all([
  //         fetch("/admin/users"),
  //         fetch("/admin/quizzes"),
  //         fetch("/admin/contents"),
  //       ]);

  //       const [usersData, quizzesData, docsData] = await Promise.all([
  //         usersRes.json(),
  //         quizzesRes.json(),
  //         docsRes.json(),
  //       ]);

  //       setStats({
  //         users: usersData.length,
  //         quizzes: quizzesData.length,
  //         documents: docsData.length,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }

  //   fetchData();
  // }, []);

  // **** this is how we will display the fetched data
  // const stats = [
  //   {
  //     title:"Total Users",
  //     value: {stats.users},
  //     growth: {growth.users},
  //     icon: <Users className="w-4 h-4"/>
  //   },
  //   {
  //     title:"Quizzes Created",
  //     value:{stats.quizzes},
  //     growth:{growth.users},
  //     icon:<ClipboardList className="w-4 h-4"/>
  //   },
  //   {
  //     title:"Legal Documents",
  //     vlaue:{stats.documents},
  //     growth:{growth.documents},
  //     icon:<FileText className="w-4 h-4"/>
  //   },
  //   {
  //     title: "Monthly Growth",
  //     value:{growth.monthly},
  //     description:" Monthly Growth vs last month",
  //     icon:<TrendingUp className="w-3 h-4"/>
  //   }
  // ]

  const metrics = [
    {
      title: "Total Users",
      value: "2,543",
      description: "Total Users vs last month",
      growth: "+12.5%",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Quizzes Created",
      value: "145",
      description: "Quizzes Created vs last month",
      growth: "+5.2%",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      title: "Legal Documents",
      value: "382",
      description: "Legal Documents vs last month",
      growth: "+8.1%",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: "Monthly Growth",
      value: "18.2%",
      description: "Monthly Growth vs last month",
      growth: "+2.3%",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

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
