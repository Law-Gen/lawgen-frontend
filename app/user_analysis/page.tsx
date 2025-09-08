"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowLeft,
  Users,
  Search,
  TrendingUp,
  BarChart as BarChartIcon,
  CalendarDays,
  Download,
  Sparkles,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useSession } from "next-auth/react";
import { MainNavigation } from "@/components/ui/main-navigation";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useTheme } from "next-themes";
import Link from "next/link";

interface Demographics {
  male: number;
  female: number;
  age_ranges: Record<string, number>;
}

interface KeywordItem {
  term: string;
  count: number;
  demographics: Demographics;
}

interface TopicItem {
  name: string;
  count: number;
  demographics: Demographics;
}

interface AnalyticsResponse {
  keywords: KeywordItem[];
  topics: TopicItem[];
}

const FEEDBACK_BASE = process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL;

// Color palettes
const pastelPalette = [
  "#A7F3D0",
  "#FDE68A",
  "#BFDBFE",
  "#FBCFE8",
  "#C7D2FE",
  "#FCA5A5",
  "#F9A8D4",
  "#FCD34D",
  "#6EE7B7",
  "#93C5FD",
];
const pieBright = ["#6366f1", "#ec4899", "#f59e0b", "#10b981"]; // extended for future

const dateRanges = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "This Month", value: "month" },
  { label: "Custom", value: "custom" },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTs, setRefreshTs] = useState(Date.now());
  const [startDate, setStartDate] = useState("2025-09-01");
  const [endDate, setEndDate] = useState("2025-09-05");
  const [dateRange, setDateRange] = useState("7");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  
  // Fetch
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!FEEDBACK_BASE)
          throw new Error("NEXT_PUBLIC_FEEDBACK_API_BASE_URL not configured");
        const params = new URLSearchParams({
          start_date: startDate,
          end_date: endDate,
        });
        const url = `${FEEDBACK_BASE}/api/v1/enterprise/analytics/query-trends?${params}`;
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        console.log("Response:", res);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        console.log("Analytics data:", json);
        if (!cancelled) {
          setData({
            keywords: Array.isArray(json.keywords) ? json.keywords : [],
            topics: Array.isArray(json.topics) ? json.topics : [],
          });
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load analytics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [refreshTs, startDate, endDate]);

  // Date range quick selection
  useEffect(() => {
    if (dateRange === "custom") return;
    const now = new Date();
    if (dateRange === "month") {
      setStartDate(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
      );
      setEndDate(now.toISOString().slice(0, 10));
    } else {
      const days = Number(dateRange);
      const start = new Date(now);
      start.setDate(start.getDate() - days + 1);
      setStartDate(start.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
    }
  }, [dateRange]);

  // Aggregations
  const genderTotals = useMemo(() => {
    if (!data) return { male: 0, female: 0 };
    return [...data.keywords, ...data.topics].reduce(
      (acc, item) => {
        acc.male += item.demographics?.male || 0;
        acc.female += item.demographics?.female || 0;
        return acc;
      },
      { male: 0, female: 0 }
    );
  }, [data]);

  const ageRangeTotals = useMemo(() => {
    if (!data) return [] as { range: string; count: number }[];
    const map: Record<string, number> = {};
    [...data.keywords, ...data.topics].forEach((item) => {
      Object.entries(item.demographics?.age_ranges || {}).forEach(([k, v]) => {
        map[k] = (map[k] || 0) + (v || 0);
      });
    });
    return Object.entries(map).map(([range, count]) => ({ range, count }));
  }, [data]);

  const keywordData = useMemo(() => {
    if (!data) return [];
    return data.keywords.map((k, i) => ({
      name: (k.term ?? "").trim(),
      count: k.count,
      fill: pastelPalette[i % pastelPalette.length],
    }));
  }, [data]);

  const topicData = useMemo(() => {
    if (!data) return [];
    return data.topics.map((t, i) => ({
      name: (t.name ?? "").trim(),
      count: t.count,
      fill: pastelPalette[(i + 3) % pastelPalette.length],
    }));
  }, [data]);

  const totalQueries = useMemo(
    () => data?.keywords.reduce((s, k) => s + (k.count || 0), 0) || 0,
    [data]
  );

  const genderPie = [
    { name: "Male", value: genderTotals.male, fill: pieBright[0] },
    { name: "Female", value: genderTotals.female, fill: pieBright[1] },
  ];

  // Topic filter removed; showing all topics by default.

  // CSV Export
  const handleExportCSV = useCallback(() => {
    if (!data) return;
    const rows: string[][] = [
      ["Type", "Name/Keyword", "Count", "Male", "Female", "AgeRanges"],
      ...data.keywords.map((k) => [
        "keyword",
        k.term,
        String(k.count),
        String(k.demographics?.male ?? 0),
        String(k.demographics?.female ?? 0),
        JSON.stringify(k.demographics?.age_ranges ?? {}),
      ]),
      ...data.topics.map((t) => [
        "topic",
        t.name,
        String(t.count),
        String(t.demographics?.male ?? 0),
        String(t.demographics?.female ?? 0),
        JSON.stringify(t.demographics?.age_ranges ?? {}),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${startDate}_${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data, startDate, endDate]);

  // Motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  return (
    <div className="relative">
      {/* subtle gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-pink-50/40 to-amber-50/60 dark:from-indigo-950/50 dark:via-fuchsia-900/30 dark:to-amber-900/30" />
      <div className="relative md:p-8 mx-auto space-y-8 pt-24 md:pt-28">
        {/* Mobile overlay (quiz header/menu style) */}
        <div
          className={`fixed inset-0 z-[100] bg-black/40 transition-opacity ${
            sidebarOpen ? "block md:hidden" : "hidden"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Mobile sidebar (quiz header/menu style) */}
        <aside
          className={`fixed top-0 right-0 z-[101] h-full w-64 bg-card dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col h-full p-6 gap-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-primary">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="text-2xl"
              >
                &times;
              </button>
            </div>
            <Button
              onClick={() => {
                router.back();
                setSidebarOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-1 rounded border w-full flex items-center gap-2"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <LanguageToggle />
            <div className="mt-auto pt-4 border-t border-white/50 dark:border-white/10 text-xs text-muted-foreground">
              User Analytics Navigation
            </div>
          </div>
        </aside>
        {/* Fixed header (quiz header/menu style) */}
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-card/80 backdrop-blur-sm border-b border-border">
          {/* <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 fixed top-0 z-50"> */}

          <div className="w-full flex items-center px-2 gap-4">
            <div className="flex flex-col items-start min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-primary truncate">
                Analytics
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                Test your legal knowledge
              </p>
            </div>
            <div className="md:hidden" style={{ marginLeft: "4px" }}>
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="p-0 bg-transparent border-none"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6h12M4 10h12M4 14h12" />
                </svg>
              </button>
            </div>
            <div className="hidden md:flex flex-1 justify-center">
              <MainNavigation />
            </div>
            <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="px-2 py-1 rounded border"
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {" "}
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
              <LanguageToggle />
              {!session && (
                <Link href="/auth/signin">
                  <Button size="sm" variant="outline">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 items-center bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl p-6 mt-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full backdrop-blur bg-white/60 dark:bg-white/10 hover:bg-white/80 border border-white/60 dark:border-white/10 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2 text-xs font-medium">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg px-2 py-1 bg-white/60 dark:bg-white/10 backdrop-blur border border-white/60 dark:border-white/10 shadow-sm text-sm"
            >
              {dateRanges.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {dateRange === "custom" && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded px-2 py-1 bg-white/60 dark:bg-white/10 text-sm border border-white/60 dark:border-white/10"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded px-2 py-1 bg-white/60 dark:bg-white/10 text-sm border border-white/60 dark:border-white/10"
                />
              </>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRefreshTs(Date.now())}
            disabled={loading}
            className="rounded-full bg-white/60 dark:bg-white/10 backdrop-blur border border-white/60 dark:border-white/10 hover:bg-white/80"
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            disabled={loading || !data}
            className="rounded-full bg-white/60 dark:bg-white/10 backdrop-blur border border-white/60 dark:border-white/10 hover:bg-white/80 flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> CSV
          </Button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="rounded-2xl border border-red-300/40 bg-gradient-to-r from-red-50/70 to-pink-50/60 dark:from-red-950/40 dark:to-pink-950/30 backdrop-blur shadow-sm">
                <CardContent className="pt-6 flex items-center justify-between text-sm text-red-600 dark:text-red-300">
                  <span>{error}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setRefreshTs(Date.now())}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-5 grid-cols-2 md:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <KpiCard
              icon={Search}
              label="Keywords"
              value={data?.keywords.length ?? 0}
              loading={loading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard
              icon={Layers}
              label="Topics"
              value={data?.topics.length ?? 0}
              loading={loading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard
              icon={TrendingUp}
              label="Total Queries"
              value={totalQueries}
              loading={loading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard
              icon={Users}
              label="Male / Female"
              value={`${genderTotals.male} / ${genderTotals.female}`}
              loading={loading}
            />
          </motion.div>
        </motion.div>

        {/* Charts Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Keyword Frequency */}
          <motion.div variants={itemVariants} className="col-span-2">
            <GlassCard
              title="Keyword Frequency"
              description="Most frequent search queries"
              loading={loading}
              empty={keywordData.length === 0}
              emptyLabel="No keyword data yet"
              icon={Search}
            >
              {keywordData.length > 0 && (
                <ChartContainer
                  config={{ count: { label: "Count" } }}
                  className="h-full w-full"
                >
                  <BarChart data={keywordData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    >
                      {keywordData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </GlassCard>
          </motion.div>
          {/* Gender Pie */}
          <motion.div variants={itemVariants}>
            <GlassCard
              title="Gender Distribution"
              description="Engagement split"
              loading={loading}
              empty={genderPie.every((g) => g.value === 0)}
              emptyLabel="No gender stats"
              icon={Users}
            >
              {genderPie.some((g) => g.value > 0) && (
                <ChartContainer
                  config={{ value: { label: "Users" } }}
                  className="h-full w-full"
                >
                  <PieChart>
                    <Pie
                      data={genderPie}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {genderPie.map((g, i) => (
                        <Cell key={i} fill={g.fill} />
                      ))}
                    </Pie>
                    <Legend />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Topics & Age */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-3"
        >
          <motion.div variants={itemVariants} className="col-span-2">
            <GlassCard
              title="Topic Frequency"
              description="Which themes users care about"
              loading={loading}
              empty={topicData.length === 0}
              emptyLabel="No topic data yet"
              icon={BarChartIcon}
            >
              {topicData.length > 0 && (
                <ChartContainer
                  config={{ count: { label: "Count" } }}
                  className="h-full w-full"
                >
                  <BarChart data={topicData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      radius={[6, 6, 0, 0]}
                      animationDuration={900}
                    >
                      {topicData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </GlassCard>
          </motion.div>
          <motion.div variants={itemVariants}>
            <GlassCard
              title="Age Ranges"
              description="Aggregate audience age"
              loading={loading}
              empty={ageRangeTotals.length === 0}
              emptyLabel="No age data yet"
              icon={TrendingUp}
            >
              {ageRangeTotals.length > 0 && (
                <ChartContainer
                  config={{ count: { label: "Count" } }}
                  className="h-full w-full"
                >
                  <BarChart data={ageRangeTotals}>
                    <XAxis dataKey="range" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      radius={[6, 6, 0, 0]}
                      animationDuration={700}
                    >
                      {ageRangeTotals.map((d, i) => (
                        <Cell
                          key={i}
                          fill={pastelPalette[(i + 5) % pastelPalette.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Raw Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard
            title="Keyword Details"
            description="Full breakdown with demographics"
            loading={loading}
            empty={!data || data.keywords.length === 0}
            emptyLabel="No keyword rows yet"
            icon={Search}
          >
            {data && data.keywords.length > 0 && (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm border-separate border-spacing-y-1">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-1 px-3">Keyword</th>
                      <th className="py-1 px-3">Count</th>
                      <th className="py-1 px-3">Male</th>
                      <th className="py-1 px-3">Female</th>
                      <th className="py-1 px-3">Top Age Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.keywords.map((k, i) => {
                      const ages = Object.entries(
                        k.demographics?.age_ranges || {}
                      );
                      const topAge = ages.sort((a, b) => b[1] - a[1])[0];
                      return (
                        <tr
                          key={i}
                          className="group bg-white/30 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur rounded-xl transition-colors"
                        >
                          <td className="py-2 px-3 font-medium whitespace-nowrap max-w-[220px] truncate">
                            {k.term || (
                              <em className="text-muted-foreground">&nbsp;</em>
                            )}
                          </td>
                          <td className="py-2 px-3 tabular-nums">{k.count}</td>
                          <td className="py-2 px-3 tabular-nums">
                            {k.demographics?.male ?? 0}
                          </td>
                          <td className="py-2 px-3 tabular-nums">
                            {k.demographics?.female ?? 0}
                          </td>
                          <td className="py-2 px-3 text-xs">
                            {topAge ? `${topAge[0]} (${topAge[1]})` : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </motion.div>
        {session && (
          <div className="md:hidden sticky bottom-0 z-30 -mx-4 px-4 pb-2">
            <BottomNavigation />
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable KPIs with count-up
function KpiCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: number | string;
  loading: boolean;
}) {
  const display = typeof value === "number" ? value : undefined;
  return (
    <GlassInner className="p-4 flex flex-col gap-2 min-h-[110px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          {label}
        </span>
        <span className="p-2 rounded-full bg-gradient-to-tr from-indigo-200/70 via-pink-200/70 to-amber-200/70 dark:from-indigo-500/30 dark:via-pink-500/30 dark:to-amber-500/30 shadow-inner">
          <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
        </span>
      </div>
      {loading ? (
        <Skeleton className="h-7 w-24" />
      ) : (
        <div className="text-2xl font-semibold tracking-tight">
          {display !== undefined ? <CountUp end={display} /> : value}
        </div>
      )}
    </GlassInner>
  );
}

// Count up component
function CountUp({ end, duration = 900 }: { end: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const startTs = performance.now();
    const startVal = 0;
    const frame = (t: number) => {
      const progress = Math.min(1, (t - startTs) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(startVal + (end - startVal) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [end, duration]);
  return <span ref={ref}>0</span>;
}

// Generic glass card for charts / table sections
function GlassCard({
  title,
  description,
  children,
  loading,
  empty,
  emptyLabel,
  icon: Icon,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  loading: boolean;
  empty: boolean;
  emptyLabel: string;
  icon: React.ComponentType<any>;
}) {
  return (
    <GlassInner className="p-5 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-indigo-500/80" />
            <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="relative flex-1 min-h-[18rem]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        )}
        {!loading && empty && <FancyEmptyState label={emptyLabel} />}
        <div
          className={`h-full w-full transition-opacity ${
            loading || empty ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {children}
        </div>
      </div>
    </GlassInner>
  );
}

// Inner glass wrapper
function GlassInner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white/55 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),rgba(255,255,255,0)_60%)]" />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

// Enhanced empty state
function FancyEmptyState({ label }: { label: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-center px-6">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-gradient-to-tr from-indigo-300/40 via-pink-300/40 to-amber-300/40 rounded-full animate-pulse" />
        <div className="relative p-4 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur border border-white/60 dark:border-white/10 shadow-sm">
          <BarChartIcon className="h-6 w-6 text-indigo-500" />
        </div>
      </div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground max-w-xs">
        Once users begin engaging, rich visual insights will appear here
        automatically.
      </p>
    </div>
  );
}
