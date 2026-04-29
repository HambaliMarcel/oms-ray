"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/oms/topbar";
import { AiAssistant } from "@/components/oms/ai-assistant";
import { useRouter } from "next/navigation";
import {
  unifiedProcessList as processList,
  unifiedProcessChains as processChains,
  unifiedActivityList as activityList,
  unifiedDepartments as departments,
} from "@/lib/om-metrics";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Search,
  Plus,
  Upload,
  Download,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity as ActivityIcon,
  Clock,
  Users,
  Network,
  ChevronRight,
  LayoutGrid,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ----- Status & category color mapping -----
const STATUS_STYLE: Record<string, string> = {
  "On Track": "bg-chart-3/10 text-chart-3 border-chart-3/30",
  "At Risk": "bg-chart-4/10 text-chart-4 border-chart-4/30",
  Critical: "bg-chart-5/10 text-chart-5 border-chart-5/30",
};

const CATEGORY_STYLE: Record<string, string> = {
  Strategic: "bg-primary/10 text-primary border-primary/30",
  Financial: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  Operations: "bg-chart-2/10 text-chart-2 border-chart-2/30",
  Talent: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  Governance: "bg-chart-4/10 text-chart-4 border-chart-4/30",
};

const PIE_COLORS = ["var(--chart-3)", "var(--chart-1)", "var(--chart-4)", "var(--chart-5)"];

export default function ProcessChainPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"chain" | "grid">("chain");
  const router = useRouter();

  // ----- Filter logic -----
  const filtered = useMemo(() => {
    return processList.filter((p) => {
      if (
        search &&
        !`${p.name} ${p.code} ${p.owner}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      if (deptFilter !== "All" && p.dept !== deptFilter) return false;
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      return true;
    });
  }, [search, deptFilter, categoryFilter, statusFilter]);

  // ----- Aggregated metrics -----
  const stats = useMemo(() => {
    const total = filtered.length;
    const bottlenecks = filtered.filter((p) => p.bottleneck).length;
    const slaCompliant = filtered.filter((p) => p.slaMet).length;
    const slaPct = total > 0 ? Math.round((slaCompliant / total) * 100) : 0;
    const avgKpi =
      total > 0 ? Math.round(filtered.reduce((s, p) => s + p.kpiScore, 0) / total) : 0;
    const avgEff =
      total > 0 ? Math.round(filtered.reduce((s, p) => s + p.efficiency, 0) / total) : 0;
    const totalActs = filtered.reduce(
      (s, p) => s + activityList.filter((a) => a.processId === p.id).length,
      0,
    );
    return { total, bottlenecks, slaPct, avgKpi, avgEff, totalActs };
  }, [filtered]);

  // ----- KPI distribution -----
  const kpiDistribution = useMemo(() => {
    const buckets = { Excellent: 0, Good: 0, Warning: 0, Critical: 0 };
    filtered.forEach((p) => {
      if (p.kpiScore >= 90) buckets.Excellent++;
      else if (p.kpiScore >= 75) buckets.Good++;
      else if (p.kpiScore >= 60) buckets.Warning++;
      else buckets.Critical++;
    });
    return Object.entries(buckets)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [filtered]);

  // ----- Top bottlenecks -----
  const topBottlenecks = useMemo(() => {
    return [...filtered]
      .filter((p) => p.actualTime > p.sla)
      .sort((a, b) => b.actualTime - b.sla - (a.actualTime - a.sla))
      .slice(0, 5)
      .map((p) => ({
        name: p.code,
        fullName: p.name,
        delay: Math.round((p.actualTime - p.sla) * 10) / 10,
        id: p.id,
      }));
  }, [filtered]);

  // ----- Department breakdown -----
  const deptBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((p) => map.set(p.dept, (map.get(p.dept) || 0) + 1));
    return Array.from(map.entries())
      .map(([name, count]) => ({
        name,
        count,
        color: departments.find((d) => d.name === name)?.color || "var(--chart-1)",
      }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  // ----- Build chains from filtered set -----
  const visibleChains = useMemo(() => {
    const filteredIds = new Set(filtered.map((p) => p.id));
    return processChains
      .map((chain) => ({
        ...chain,
        processes: chain.flow
          .filter((id) => filteredIds.has(id))
          .map((id) => processList.find((p) => p.id === id)!)
          .filter(Boolean),
      }))
      .filter((c) => c.processes.length > 0);
  }, [filtered]);

  // ----- Orphan processes (in filter but not in any visible chain) -----
  const orphans = useMemo(() => {
    const inChain = new Set(visibleChains.flatMap((c) => c.processes.map((p) => p.id)));
    return filtered.filter((p) => !inChain.has(p.id));
  }, [filtered, visibleChains]);

  const departmentOptions = useMemo(
    () => Array.from(new Set(processList.map((p) => p.dept))),
    [],
  );
  const categoryOptions = useMemo(
    () => Array.from(new Set(processList.map((p) => p.category))),
    [],
  );

  const openPanel = (id: string) => {
    router.push(`/business-process/process-directory/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        title="Process Chain"
        subtitle="— End-to-end Flow"
        breadcrumb={["OM+", "Business Process", "Process Chain"]}
      />

      <main className="p-6 space-y-6">
        {/* ===== HEADER ACTIONS ===== */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Process Chain</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              End-to-end view of every operational process — connected to org structure, KPIs, and workload.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/business-process/process-directory">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted text-foreground">
                <Network className="w-3.5 h-3.5" />
                Directory View
              </button>
            </Link>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted text-foreground">
              <Upload className="w-3.5 h-3.5" />
              Import
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted text-foreground">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <Link href="/business-process/process-directory">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white"
                style={{ background: "var(--primary)" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Manage Processes
              </button>
            </Link>
          </div>
        </div>

        {/* ===== FILTER BAR ===== */}
        <div className="bg-card border border-border rounded-xl p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, code, or owner..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-background border border-border rounded-lg font-medium"
          >
            <option value="All">All Departments</option>
            {departmentOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-background border border-border rounded-lg font-medium"
          >
            <option value="All">All Categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-background border border-border rounded-lg font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="At Risk">At Risk</option>
            <option value="Critical">Critical</option>
          </select>

          <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("chain")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors",
                viewMode === "chain"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Workflow className="w-3 h-3" />
              Chain
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="w-3 h-3" />
              Grid
            </button>
          </div>
        </div>

        {/* ===== METRIC STRIP ===== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard label="Total Processes" value={stats.total} icon={<ActivityIcon className="w-4 h-4" />} />
          <MetricCard
            label="Bottlenecks"
            value={stats.bottlenecks}
            icon={<AlertTriangle className="w-4 h-4 text-chart-5" />}
            tone="negative"
          />
          <MetricCard
            label="SLA Compliance"
            value={`${stats.slaPct}%`}
            icon={<Clock className="w-4 h-4" />}
            tone={stats.slaPct >= 80 ? "positive" : stats.slaPct >= 60 ? "neutral" : "negative"}
          />
          <MetricCard
            label="Avg KPI"
            value={stats.avgKpi}
            icon={
              stats.avgKpi >= 75 ? (
                <TrendingUp className="w-4 h-4 text-chart-3" />
              ) : (
                <TrendingDown className="w-4 h-4 text-chart-5" />
              )
            }
          />
          <MetricCard label="Avg Efficiency" value={`${stats.avgEff}%`} icon={<TrendingUp className="w-4 h-4" />} />
          <MetricCard label="Activities" value={stats.totalActs} icon={<Users className="w-4 h-4" />} />
        </div>

        {/* ===== 3-PANEL LAYOUT ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* LEFT — Department mix */}
          <div className="xl:col-span-3">
            <div className="bg-card border border-border rounded-xl p-4 h-full">
              <h3 className="text-sm font-semibold text-foreground mb-3">Department Mix</h3>
              <div className="space-y-2.5">
                {deptBreakdown.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">No data</p>
                ) : (
                  deptBreakdown.map((d) => {
                    const max = Math.max(...deptBreakdown.map((x) => x.count), 1);
                    return (
                      <div key={d.name}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-foreground">{d.name}</span>
                          <span className="text-muted-foreground tabular-nums">{d.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(d.count / max) * 100}%`,
                              background: d.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* CENTER — Chain or Grid */}
          <div className="xl:col-span-6">
            <div className="bg-card border border-border rounded-xl p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {viewMode === "chain"
                    ? "Process Flow Chains"
                    : `Process Grid (${filtered.length})`}
                </h3>
                {viewMode === "chain" && (
                  <span className="text-xs text-muted-foreground">
                    {visibleChains.length} chain{visibleChains.length !== 1 ? "s" : ""}
                    {orphans.length > 0 && ` · ${orphans.length} standalone`}
                  </span>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <Search className="w-10 h-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground mt-3">
                    No processes match your filters.
                  </p>
                </div>
              ) : viewMode === "chain" ? (
                <div className="space-y-6">
                  {visibleChains.map((chain) => (
                    <div key={chain.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {chain.label}
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {chain.processes.map((p, i) => (
                          <div key={p.id} className="flex items-center gap-2">
                            <ProcessNode
                              process={p}
                              selected={false}
                              onClick={() => openPanel(p.id)}
                            />
                            {i < chain.processes.length - 1 && (
                              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {orphans.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Standalone Processes
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {orphans.map((p) => (
                          <ProcessNode
                            key={p.id}
                            process={p}
                            selected={false}
                            onClick={() => openPanel(p.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filtered.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => openPanel(p.id)}
                      className={cn(
                        "rounded-lg border bg-card p-3 text-left transition-all hover:shadow-md hover:-translate-y-px",
                        p.bottleneck ? "border-chart-5/40" : "border-border",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-muted-foreground tracking-wide">
                          {p.code}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                            STATUS_STYLE[p.status],
                          )}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-semibold text-foreground line-clamp-1">{p.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{p.dept} · {p.owner}</div>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">
                          {activityList.filter((a) => a.processId === p.id).length} activities
                        </span>
                        <span
                          className={cn(
                            "font-semibold tabular-nums",
                            p.kpiScore >= 80
                              ? "text-chart-3"
                              : p.kpiScore >= 60
                                ? "text-chart-4"
                                : "text-chart-5",
                          )}
                        >
                          KPI {p.kpiScore}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Insights */}
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-chart-5" />
                Top Bottlenecks
              </h3>
              {topBottlenecks.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No bottlenecks detected
                </p>
              ) : (
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topBottlenecks} layout="vertical" margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={50}
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 11,
                        }}
                        formatter={(v: number, _n, item) => [
                          `+${v}d`,
                          (item?.payload as { fullName?: string })?.fullName ?? "Delay",
                        ]}
                      />
                      <Bar dataKey="delay" fill="var(--chart-5)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">KPI Distribution</h3>
              {kpiDistribution.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No data</p>
              ) : (
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={kpiDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={64}
                        paddingAngle={2}
                      >
                        {kpiDistribution.map((entry, i) => (
                          <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 11,
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== SUMMARY TABLE ===== */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              All Filtered Processes ({filtered.length})
            </h3>
            <Link
              href="/business-process/process-directory"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              Open full directory <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left py-2.5 px-4 font-semibold text-muted-foreground">Code</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-muted-foreground">Process</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-muted-foreground">Department</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-muted-foreground">Owner</th>
                  <th className="text-center py-2.5 px-4 font-semibold text-muted-foreground">Category</th>
                  <th className="text-center py-2.5 px-4 font-semibold text-muted-foreground">Status</th>
                  <th className="text-center py-2.5 px-4 font-semibold text-muted-foreground">KPI</th>
                  <th className="text-center py-2.5 px-4 font-semibold text-muted-foreground">SLA</th>
                  <th className="text-center py-2.5 px-4 font-semibold text-muted-foreground">Actual</th>
                  <th className="text-center py-2.5 px-4 font-semibold text-muted-foreground">Activities</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => openPanel(p.id)}
                    className={cn(
                      "border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer transition-colors",
                    )}
                  >
                    <td className="py-2.5 px-4 font-medium text-muted-foreground">{p.code}</td>
                    <td className="py-2.5 px-4 font-semibold text-foreground">{p.name}</td>
                    <td className="py-2.5 px-4 text-foreground">{p.dept}</td>
                    <td className="py-2.5 px-4 text-foreground">{p.owner}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded border",
                          CATEGORY_STYLE[p.category] ?? "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded border",
                          STATUS_STYLE[p.status],
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={cn(
                          "font-semibold tabular-nums",
                          p.kpiScore >= 80
                            ? "text-chart-3"
                            : p.kpiScore >= 60
                              ? "text-chart-4"
                              : "text-chart-5",
                        )}
                      >
                        {p.kpiScore}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center text-muted-foreground tabular-nums">
                      {p.sla}d
                    </td>
                    <td
                      className={cn(
                        "py-2.5 px-4 text-center font-medium tabular-nums",
                        p.slaMet ? "text-chart-3" : "text-chart-5",
                      )}
                    >
                      {p.actualTime}d
                    </td>
                    <td className="py-2.5 px-4 text-center text-foreground">
                      {activityList.filter((a) => a.processId === p.id).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AiAssistant />
    </div>
  );
}

// ===========================================================================
// SUB-COMPONENTS
// ===========================================================================

function MetricCard({
  label,
  value,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: "positive" | "negative" | "neutral";
}) {
  const valueClass =
    tone === "positive"
      ? "text-chart-3"
      : tone === "negative"
        ? "text-chart-5"
        : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className={cn("mt-0.5 text-xl font-bold tabular-nums", valueClass)}>{value}</p>
      </div>
      <div className="rounded-md bg-muted p-2 text-muted-foreground">{icon}</div>
    </div>
  );
}

function ProcessNode({
  process,
  selected,
  onClick,
}: {
  process: (typeof processList)[number];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group min-w-[180px] max-w-[220px] rounded-lg border bg-card px-3 py-2.5 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5",
        selected && "ring-2 ring-primary",
        process.bottleneck ? "border-chart-5/40" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold text-muted-foreground tracking-wide">
          {process.code}
        </span>
        {process.bottleneck && (
          <AlertTriangle className="w-3 h-3 shrink-0 text-chart-5" />
        )}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-foreground line-clamp-1">
        {process.name}
      </div>
      <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
        {process.dept} · {process.owner}
      </div>
      <div className="mt-2 flex items-center justify-between gap-1">
        <span
          className={cn(
            "text-[9px] font-semibold px-1.5 py-0.5 rounded border",
            CATEGORY_STYLE[process.category] ?? "bg-muted text-muted-foreground border-border",
          )}
        >
          {process.category}
        </span>
        <span
          className={cn(
            "text-[10px] font-bold tabular-nums",
            process.kpiScore >= 80
              ? "text-chart-3"
              : process.kpiScore >= 60
                ? "text-chart-4"
                : "text-chart-5",
          )}
        >
          {process.kpiScore}
        </span>
      </div>
    </button>
  );
}
