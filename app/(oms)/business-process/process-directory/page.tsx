"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/oms/topbar";
import { AiAssistant } from "@/components/oms/ai-assistant";
import { useRouter } from "next/navigation";
import { unifiedProcessList as processList, unifiedActivityList as activityList, unifiedDepartments as departments } from "@/lib/om-metrics";
import {
  Search,
  Plus,
  Upload,
  Download,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Workflow,
  AlertTriangle,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey = "code" | "name" | "dept" | "owner" | "kpi" | "sla" | "actual" | "efficiency";

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

const STAFFING_STYLE: Record<string, string> = {
  Understaffed: "bg-chart-5/10 text-chart-5 border-chart-5/30",
  Balanced: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  Overstaffed: "bg-chart-4/10 text-chart-4 border-chart-4/30",
};

export default function ProcessDirectoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bottleneckOnly, setBottleneckOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const router = useRouter();

  const categories = ["All", ...Array.from(new Set(processList.map((p) => p.category)))];
  const deptOptions = ["All", ...Array.from(new Set(processList.map((p) => p.dept)))];

  // ----- Filter + sort -----
  const rows = useMemo(() => {
    const filtered = processList.filter((p) => {
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      if (deptFilter !== "All" && p.dept !== deptFilter) return false;
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      if (bottleneckOnly && !p.bottleneck) return false;
      if (
        search &&
        !`${p.name} ${p.code} ${p.owner} ${p.dept}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      switch (sortKey) {
        case "code":
          return a.code.localeCompare(b.code) * dir;
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "dept":
          return a.dept.localeCompare(b.dept) * dir;
        case "owner":
          return a.owner.localeCompare(b.owner) * dir;
        case "kpi":
          return (a.kpiScore - b.kpiScore) * dir;
        case "sla":
          return (a.sla - b.sla) * dir;
        case "actual":
          return (a.actualTime - b.actualTime) * dir;
        case "efficiency":
          return (a.efficiency - b.efficiency) * dir;
        default:
          return 0;
      }
    });
    return sorted;
  }, [search, categoryFilter, deptFilter, statusFilter, bottleneckOnly, sortKey, sortAsc]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(rows.map((r) => r.id)));
  const collapseAll = () => setExpanded(new Set());

  const onSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const openPanel = (id: string) => {
    router.push(`/business-process/process-directory/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        title="Process Directory"
        subtitle="— Activity-level Breakdown"
        breadcrumb={["OM+", "Business Process", "Process Directory"]}
      />

      <main className="p-6 space-y-6">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Process Directory</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tabular view of all processes — expand any row to see activities, assigned employees, and workload.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/business-process/process-chain">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted text-foreground">
                <Workflow className="w-3.5 h-3.5" />
                Chain View
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
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white"
              style={{ background: "var(--primary)" }}
              onClick={() => alert("Create Process — opens in detail panel (use the New button on a row)")}
            >
              <Plus className="w-3.5 h-3.5" />
              Create Process
            </button>
          </div>
        </div>

        {/* ===== FILTER BAR ===== */}
        <div className="bg-card border border-border rounded-xl p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, code, owner, or department..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-background border border-border rounded-lg font-medium"
          >
            {deptOptions.map((d) => (
              <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
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

          <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-lg bg-background cursor-pointer hover:bg-muted">
            <input
              type="checkbox"
              checked={bottleneckOnly}
              onChange={(e) => setBottleneckOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded"
            />
            <span>Bottlenecks only</span>
          </label>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted text-foreground"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted text-foreground"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* ===== CATEGORY CHIPS ===== */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? processList.length
                : processList.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border",
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:bg-muted",
                )}
              >
                {cat}
                <span
                  className={cn(
                    "tabular-nums px-1.5 py-0.5 rounded text-[10px]",
                    categoryFilter === cat ? "bg-white/20" : "bg-muted",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Search className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground mt-3">No processes match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 border-b border-border sticky top-0 z-10">
                  <tr>
                    <th className="w-10 py-2.5 px-2"></th>
                    <SortHeader label="Code" k="code" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                    <SortHeader label="Process" k="name" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                    <SortHeader label="Department" k="dept" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                    <SortHeader label="Owner" k="owner" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                    <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground">Category</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground">Status</th>
                    <SortHeader label="KPI" k="kpi" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} center />
                    <SortHeader label="SLA" k="sla" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} center />
                    <SortHeader label="Actual" k="actual" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} center />
                    <SortHeader label="Efficiency" k="efficiency" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} center />
                    <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground">Activities</th>
                    <th className="w-24 py-2.5 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => {
                    const acts = activityList
                      .filter((a) => a.processId === p.id)
                      .sort((x, y) => x.seq - y.seq);
                    const isOpen = expanded.has(p.id);
                    const dept = departments.find((d) => d.name === p.dept);

                    return (
                      <ProcessRow
                        key={p.id}
                        p={p}
                        acts={acts}
                        isOpen={isOpen}
                        onToggle={() => toggleExpand(p.id)}
                        onView={() => openPanel(p.id)}
                        deptColor={dept?.color}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <AiAssistant />
    </div>
  );
}

// ===========================================================================
// SUB-COMPONENTS
// ===========================================================================

function SortHeader({
  label,
  k,
  sortKey,
  sortAsc,
  onSort,
  center,
}: {
  label: string;
  k: SortKey;
  sortKey: SortKey;
  sortAsc: boolean;
  onSort: (k: SortKey) => void;
  center?: boolean;
}) {
  const active = sortKey === k;
  return (
    <th
      onClick={() => onSort(k)}
      className={cn(
        "py-2.5 px-3 font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors",
        center ? "text-center" : "text-left",
      )}
    >
      <div className={cn("flex items-center gap-1", center && "justify-center")}>
        {label}
        <ArrowUpDown
          className={cn(
            "w-3 h-3 transition-opacity",
            active ? "opacity-100" : "opacity-30",
          )}
        />
        {active && <span className="text-[9px] tabular-nums">{sortAsc ? "↑" : "↓"}</span>}
      </div>
    </th>
  );
}

function ProcessRow({
  p,
  acts,
  isOpen,
  onToggle,
  onView,
  deptColor,
}: {
  p: (typeof processList)[number];
  acts: (typeof activityList);
  isOpen: boolean;
  onToggle: () => void;
  onView: () => void;
  deptColor?: string;
}) {
  return (
    <>
      <tr
        className={cn(
          "border-b border-border hover:bg-muted/40 transition-colors cursor-pointer",
          isOpen && "bg-primary/5",
          p.bottleneck && "border-l-2 border-l-chart-5",
        )}
        onClick={onToggle}
      >
        <td className="py-2.5 px-2 text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-1 rounded hover:bg-muted text-muted-foreground"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </td>
        <td className="py-2.5 px-3 font-medium text-muted-foreground tabular-nums">{p.code}</td>
        <td className="py-2.5 px-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{p.name}</span>
            {p.bottleneck && <AlertTriangle className="w-3 h-3 text-chart-5" />}
          </div>
        </td>
        <td className="py-2.5 px-3">
          <div className="flex items-center gap-1.5">
            {deptColor && (
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: deptColor }}
              />
            )}
            <span className="text-foreground">{p.dept}</span>
          </div>
        </td>
        <td className="py-2.5 px-3 text-foreground">{p.owner}</td>
        <td className="py-2.5 px-3 text-center">
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded border",
              CATEGORY_STYLE[p.category] ?? "bg-muted text-muted-foreground border-border",
            )}
          >
            {p.category}
          </span>
        </td>
        <td className="py-2.5 px-3 text-center">
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded border",
              STATUS_STYLE[p.status],
            )}
          >
            {p.status}
          </span>
        </td>
        <td className="py-2.5 px-3 text-center">
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
        <td className="py-2.5 px-3 text-center text-muted-foreground tabular-nums">{p.sla}d</td>
        <td
          className={cn(
            "py-2.5 px-3 text-center font-medium tabular-nums",
            p.slaMet ? "text-chart-3" : "text-chart-5",
          )}
        >
          {p.actualTime}d
        </td>
        <td className="py-2.5 px-3 text-center">
          <span
            className={cn(
              "font-semibold tabular-nums",
              p.efficiency >= 90
                ? "text-chart-3"
                : p.efficiency >= 80
                  ? "text-chart-1"
                  : "text-chart-4",
            )}
          >
            {p.efficiency}%
          </span>
        </td>
        <td className="py-2.5 px-3 text-center text-foreground tabular-nums">{acts.length}</td>
        <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={onView}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Quick view"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Edit"
              onClick={(e) => { e.stopPropagation(); onView(); }}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>

      {isOpen && (
        <tr className="bg-muted/20 border-b border-border">
          <td colSpan={13} className="px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <InfoBlock label="Process Description" value={p.description} />
              <InfoBlock label="Owner & Position" value={`${p.owner} — ${p.ownerPosition}`} />
              <InfoBlock
                label="Frequency · Version · Updated"
                value={`${p.frequency} · ${p.version} · ${p.lastUpdated}`}
              />
              <InfoBlock label="Input Source" value={p.inputSource} />
              <InfoBlock label="Output Deliverable" value={p.outputDeliverable} />
              <InfoBlock
                label="Linked"
                value={
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.previousProcess && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        From {p.previousProcess}
                      </span>
                    )}
                    {p.nextProcess && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
                        To {p.nextProcess}
                      </span>
                    )}
                    {!p.previousProcess && !p.nextProcess && (
                      <span className="text-[10px] text-muted-foreground">Standalone</span>
                    )}
                  </div>
                }
              />
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center justify-between">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Activities ({acts.length})
                </h4>
                <span className="text-[10px] text-muted-foreground">
                  Total assigned: {acts.reduce((s, a) => s + a.requiredHc, 0)} · Total hours/cycle:{" "}
                  {acts.reduce((s, a) => s + a.duration, 0)}
                </span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground w-8">#</th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Activity</th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Role</th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Assigned Employees</th>
                    <th className="text-center py-2 px-3 font-semibold text-muted-foreground">Hours</th>
                    <th className="text-center py-2 px-3 font-semibold text-muted-foreground">Workload (h/mo)</th>
                    <th className="text-center py-2 px-3 font-semibold text-muted-foreground">Utilization</th>
                    <th className="text-center py-2 px-3 font-semibold text-muted-foreground">Staffing</th>
                  </tr>
                </thead>
                <tbody>
                  {acts.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                      <td className="py-2 px-3 text-muted-foreground tabular-nums">{a.seq}</td>
                      <td className="py-2 px-3 font-medium text-foreground">{a.name}</td>
                      <td className="py-2 px-3 text-muted-foreground">{a.role}</td>
                      <td className="py-2 px-3 text-foreground">
                        <div className="flex flex-wrap gap-1">
                          {a.assignedEmployeeNames.length === 0 ? (
                            <span className="text-muted-foreground italic">Unassigned</span>
                          ) : (
                            a.assignedEmployeeNames.map((n) => (
                              <span
                                key={n}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground"
                              >
                                {n}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center text-foreground tabular-nums">{a.duration}</td>
                      <td className="py-2 px-3 text-center text-foreground tabular-nums">
                        {Math.round(a.workloadHours)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className={cn(
                              "tabular-nums font-medium",
                              a.utilization >= 90
                                ? "text-chart-5"
                                : a.utilization >= 75
                                  ? "text-chart-4"
                                  : "text-chart-3",
                            )}
                          >
                            {a.utilization}%
                          </span>
                          <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                a.utilization >= 90
                                  ? "bg-chart-5"
                                  : a.utilization >= 75
                                    ? "bg-chart-4"
                                    : "bg-chart-3",
                              )}
                              style={{ width: `${Math.min(100, a.utilization)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded border",
                            STAFFING_STYLE[a.staffingStatus],
                          )}
                        >
                          {a.staffingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={onView}
                className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted text-foreground flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open detail panel
              </button>
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-primary hover:bg-primary/90 flex items-center gap-1.5"
                onClick={onView}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit process
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function InfoBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-xs text-foreground">{value}</div>
    </div>
  );
}
