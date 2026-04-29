"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Edit,
  FileSpreadsheet,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  TrendingDown,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import { TopBar } from "@/components/oms/topbar";
import { AiAssistant } from "@/components/oms/ai-assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ActivityForm } from "@/components/workload/activity-form";
import {
  unifiedWorkloadActivities as workloadActivities,
  unifiedProcessList as processList,
  unifiedDepartments as departments,
  unifiedKpiList as kpiList,
  type WorkloadActivity,
} from "@/lib/om-metrics";

const STAFFING_FILTERS = [
  "All",
  "Understaffed",
  "Balanced",
  "Overloaded",
  "Underutilized",
] as const;

function staffingBadge(status: WorkloadActivity["staffingStatus"]) {
  const styles: Record<WorkloadActivity["staffingStatus"], string> = {
    Overloaded: "bg-destructive/15 text-destructive border-destructive/30",
    Understaffed: "bg-destructive/15 text-destructive border-destructive/30",
    Balanced:
      "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    Underutilized:
      "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    "Significantly Underutilized":
      "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  };
  return (
    <Badge variant="outline" className={`text-[10px] ${styles[status]}`}>
      {status === "Significantly Underutilized" ? "Sig. Under" : status}
    </Badge>
  );
}

function utilColor(util: number) {
  if (util > 110) return "text-destructive";
  if (util >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (util >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-blue-600 dark:text-blue-400";
}

export default function ActivityDirectoryPage() {
  const [search, setSearch] = useState("");
  const [orgFilter, setOrgFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [processFilter, setProcessFilter] = useState("all");
  const [kpiFilter, setKpiFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [staffingFilter, setStaffingFilter] =
    useState<(typeof STAFFING_FILTERS)[number]>("All");

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    processList.forEach((p) => (init[p.id] = true));
    return init;
  });

  // Router for full-page navigation
  const router = useRouter();
  const goToActivity = (id: string) =>
    router.push(`/workload-activity/activity-directory/${id}`);

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkloadActivity | null>(null);
  const [duplicateTarget, setDuplicateTarget] =
    useState<WorkloadActivity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkloadActivity | null>(null);
  const [recalcTarget, setRecalcTarget] = useState<WorkloadActivity | null>(null);
  const [sendHcTarget, setSendHcTarget] = useState<WorkloadActivity | null>(null);

  // Filter set
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return workloadActivities.filter((a) => {
      if (term) {
        const hay = `${a.name} ${a.processName} ${a.activityCode}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (deptFilter !== "all" && a.departmentId !== deptFilter) return false;
      if (processFilter !== "all" && a.processId !== processFilter) return false;
      if (kpiFilter !== "all" && a.linkedKpiId !== kpiFilter) return false;
      if (positionFilter !== "all" && a.responsiblePosition !== positionFilter)
        return false;
      if (staffingFilter !== "All") {
        if (staffingFilter === "Underutilized") {
          // Group both underutilized variants under "Underutilized"
          if (
            a.staffingStatus !== "Underutilized" &&
            a.staffingStatus !== "Significantly Underutilized"
          )
            return false;
        } else if (a.staffingStatus !== staffingFilter) {
          return false;
        }
      }
      return true;
    });
  }, [
    search,
    deptFilter,
    processFilter,
    kpiFilter,
    positionFilter,
    staffingFilter,
  ]);

  // Group by Business Process, sequential
  const grouped = useMemo(() => {
    const map = new Map<string, WorkloadActivity[]>();
    filtered.forEach((a) => {
      const arr = map.get(a.processId) ?? [];
      arr.push(a);
      map.set(a.processId, arr);
    });
    return Array.from(map.entries())
      .map(([pid, items]) => ({
        process: processList.find((p) => p.id === pid)!,
        items: items.sort((a, b) => a.seq - b.seq),
      }))
      .sort((a, b) =>
        (a.process?.code ?? "").localeCompare(b.process?.code ?? ""),
      );
  }, [filtered]);

  // KPI strip
  const kpiStrip = useMemo(() => {
    const total = filtered.length;
    const synced = filtered.filter((a) => a.processId).length;
    const totalDemand = filtered.reduce((s, a) => s + a.adjustedWorkload, 0);
    const requiredHc = filtered.reduce((s, a) => s + a.requiredHc, 0);
    const assignedHc = filtered.reduce((s, a) => s + a.assignedHc, 0);
    const avgUtil =
      total > 0
        ? Math.round(filtered.reduce((s, a) => s + a.utilization, 0) / total)
        : 0;
    const understaffed = filtered.filter(
      (a) => a.staffingStatus === "Understaffed",
    ).length;
    return {
      total,
      synced,
      totalDemand: Math.round(totalDemand),
      requiredHc: Math.round(requiredHc * 10) / 10,
      assignedHc: Math.round(assignedHc * 10) / 10,
      avgUtil,
      understaffed,
    };
  }, [filtered]);

  // Position list (unique responsible positions)
  const positions = useMemo(() => {
    const set = new Set(workloadActivities.map((a) => a.responsiblePosition));
    return Array.from(set).sort();
  }, []);

  function toggleExpand(pid: string) {
    setExpanded((p) => ({ ...p, [pid]: !p[pid] }));
  }

  function clearFilters() {
    setSearch("");
    setOrgFilter("all");
    setDivisionFilter("all");
    setDeptFilter("all");
    setProcessFilter("all");
    setKpiFilter("all");
    setPositionFilter("all");
    setStaffingFilter("All");
  }

  function exportCsv() {
    const header = [
      "Code",
      "Activity",
      "Process",
      "Step",
      "Department",
      "Position",
      "Frequency",
      "Duration",
      "Base Workload",
      "Adjusted Workload",
      "Required HC",
      "Assigned HC",
      "Gap",
      "Utilization",
      "Status",
    ];
    const rows = filtered.map((a) => [
      a.activityCode,
      a.name,
      a.processCode,
      a.seq,
      a.department,
      a.responsiblePosition,
      a.frequencyType,
      a.duration,
      a.baseWorkload,
      a.adjustedWorkload,
      a.requiredHc,
      a.assignedHc,
      a.hcGap,
      a.utilization,
      a.staffingStatus,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-directory-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar
        title="Activity Directory"
        breadcrumb={["Workload & Activities", "Activity Directory"]}
      />

      <main className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <p className="text-sm text-muted-foreground">
              Activities sourced from business processes, mapped to positions,
              employees, workload demand, and utilization.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Activity
            </Button>
            <Button variant="outline" onClick={() => setSyncOpen(true)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync from BPM
            </Button>
            <Button variant="outline" onClick={() => setBulkOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button variant="outline" onClick={exportCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          <KpiCell label="Total Activities" value={kpiStrip.total.toString()} />
          <KpiCell
            label="Synced from BPM"
            value={kpiStrip.synced.toString()}
            sub="from process portfolio"
          />
          <KpiCell
            label="Workload Hours / Mo"
            value={kpiStrip.totalDemand.toLocaleString()}
            sub="adjusted demand"
          />
          <KpiCell
            label="Required HC"
            value={`${kpiStrip.requiredHc} FTE`}
          />
          <KpiCell
            label="Assigned HC"
            value={`${kpiStrip.assignedHc} FTE`}
          />
          <KpiCell
            label="Avg Utilization"
            value={`${kpiStrip.avgUtil}%`}
            valueClass={utilColor(kpiStrip.avgUtil)}
          />
          <KpiCell
            label="Understaffed"
            value={kpiStrip.understaffed.toString()}
            valueClass={
              kpiStrip.understaffed > 0 ? "text-destructive" : undefined
            }
          />
        </div>

        {/* Filter bar */}
        <Card className="mb-4">
          <CardContent className="grid gap-3 p-4 md:grid-cols-3 lg:grid-cols-7">
            <div className="relative md:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activity, code, or process"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={orgFilter} onValueChange={setOrgFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="hq">Headquarters</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
              </SelectContent>
            </Select>
            <Select value={divisionFilter} onValueChange={setDivisionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                <SelectItem value="ops">Operations</SelectItem>
                <SelectItem value="corp">Corporate</SelectItem>
                <SelectItem value="rev">Revenue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={processFilter} onValueChange={setProcessFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Business Process" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Processes</SelectItem>
                {processList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={kpiFilter} onValueChange={setKpiFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Linked KPI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All KPIs</SelectItem>
                {kpiList.slice(0, 12).map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="lg:col-span-2">
                <SelectValue placeholder="Responsible Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-1.5 lg:col-span-5">
              <span className="self-center text-xs font-medium text-muted-foreground">
                Status:
              </span>
              {STAFFING_FILTERS.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={staffingFilter === s ? "default" : "outline"}
                  onClick={() => setStaffingFilter(s)}
                  className="h-7 text-xs"
                >
                  {s}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={clearFilters}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grouped sequential activity list */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm">
              {filtered.length}{" "}
              {filtered.length === 1 ? "activity" : "activities"} in{" "}
              {grouped.length} {grouped.length === 1 ? "process" : "processes"}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={() => {
                  const next: Record<string, boolean> = {};
                  processList.forEach((p) => (next[p.id] = true));
                  setExpanded(next);
                }}
              >
                Expand all
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={() => setExpanded({})}
              >
                Collapse all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {grouped.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
                <Activity className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No activities match your filters.
                </p>
                <Button size="sm" variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {grouped.map(({ process, items }) => {
                  const isOpen = expanded[process.id] ?? true;
                  const groupDemand = items.reduce(
                    (s, a) => s + a.adjustedWorkload,
                    0,
                  );
                  const groupRequired = items.reduce(
                    (s, a) => s + a.requiredHc,
                    0,
                  );
                  const groupAssigned = items.reduce(
                    (s, a) => s + a.assignedHc,
                    0,
                  );
                  return (
                    <div key={process.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-3 bg-muted/40 px-4 py-3 text-left hover:bg-muted/60"
                        onClick={() => toggleExpand(process.id)}
                      >
                        <div className="flex items-center gap-3">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <p className="text-sm font-semibold">
                              <span className="mr-2 font-mono text-xs text-muted-foreground">
                                {process.code}
                              </span>
                              {process.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {process.dept} · Owner {process.owner} ·{" "}
                              {process.frequency}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {items.length} steps
                          </Badge>
                          {process.bottleneck && (
                            <Badge className="bg-destructive/15 text-destructive border-destructive/30">
                              Bottleneck
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            <span className="font-medium text-foreground">
                              {Math.round(groupDemand)}
                            </span>{" "}
                            h/mo
                          </span>
                          <span>
                            Req{" "}
                            <span className="font-medium text-foreground">
                              {groupRequired.toFixed(1)}
                            </span>{" "}
                            · Asg{" "}
                            <span className="font-medium text-foreground">
                              {groupAssigned.toFixed(0)}
                            </span>
                          </span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/20 text-[11px] uppercase text-muted-foreground">
                              <tr>
                                <th className="w-10 px-3 py-2 text-left font-medium">
                                  Step
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Activity
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Department
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Position
                                </th>
                                <th className="px-3 py-2 text-right font-medium">
                                  People
                                </th>
                                <th className="px-3 py-2 text-right font-medium">
                                  Freq
                                </th>
                                <th className="px-3 py-2 text-right font-medium">
                                  Avg dur
                                </th>
                                <th className="px-3 py-2 text-right font-medium">
                                  Demand
                                </th>
                                <th className="px-3 py-2 text-right font-medium">
                                  Req HC
                                </th>
                                <th className="px-3 py-2 text-right font-medium">
                                  Asg HC
                                </th>
                                <th className="px-3 py-2 text-right font-medium">
                                  Util
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Status
                                </th>
                                <th className="w-10 px-3 py-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((a) => (
                                <tr
                                  key={a.id}
                                  className="cursor-pointer border-t hover:bg-muted/30"
                                  onClick={() => goToActivity(a.id)}
                                >
                                  <td className="px-3 py-2 text-center">
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-semibold tabular-nums">
                                      {a.seq}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <p className="font-medium">{a.name}</p>
                                    <p className="font-mono text-[11px] text-muted-foreground">
                                      {a.activityCode}
                                    </p>
                                  </td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground">
                                    {a.department}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground">
                                    {a.responsiblePosition}
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums">
                                    {a.assignedHc}
                                  </td>
                                  <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                                    {a.frequencyType}
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums">
                                    {a.duration}h
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums">
                                    {Math.round(a.adjustedWorkload)}h
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums">
                                    {a.requiredHc.toFixed(1)}
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums">
                                    {a.assignedHc.toFixed(0)}
                                  </td>
                                  <td
                                    className={`px-3 py-2 text-right font-semibold tabular-nums ${utilColor(a.utilization)}`}
                                  >
                                    {a.utilization}%
                                  </td>
                                  <td className="px-3 py-2">
                                    {staffingBadge(a.staffingStatus)}
                                  </td>
                                  <td
                                    className="px-3 py-2"
                                    onClick={(ev) => ev.stopPropagation()}
                                  >
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-7 w-7"
                                        >
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onSelect={() => goToActivity(a.id)}
                                        >
                                          <Activity className="mr-2 h-4 w-4" />
                                          View Detail
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() => setEditTarget(a)}
                                        >
                                          <Edit className="mr-2 h-4 w-4" />
                                          Edit Activity
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() => goToActivity(a.id)}
                                        >
                                          <UserPlus className="mr-2 h-4 w-4" />
                                          Assign Employees
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() => setRecalcTarget(a)}
                                        >
                                          <RefreshCw className="mr-2 h-4 w-4" />
                                          Recalculate Workload
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() => setSendHcTarget(a)}
                                        >
                                          <Send className="mr-2 h-4 w-4" />
                                          Send Required HC
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                          <a
                                            href={`/process/portfolio?process=${a.processId}`}
                                          >
                                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            View Source Process
                                          </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() => setDuplicateTarget(a)}
                                        >
                                          <Copy className="mr-2 h-4 w-4" />
                                          Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onSelect={() => setDeleteTarget(a)}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* CREATE — full-page form modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create new activity</DialogTitle>
            <DialogDescription>
              Define a new operational activity. The workload preview updates
              live as you change inputs.
            </DialogDescription>
          </DialogHeader>
          <ActivityForm onCancel={() => setCreateOpen(false)} />
          <DialogFooter className="border-t pt-3">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Save Draft
            </Button>
            <Button onClick={() => setCreateOpen(false)}>Submit Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT — same form, pre-filled, with before/after */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit activity</DialogTitle>
            <DialogDescription>
              {editTarget?.activityCode} · {editTarget?.name}
            </DialogDescription>
          </DialogHeader>
          {editTarget && <ActivityForm initial={editTarget} editing />}
          <DialogFooter className="border-t pt-3">
            <Button variant="ghost" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Save Draft
            </Button>
            <Button onClick={() => setEditTarget(null)}>
              Submit Change for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BULK UPLOAD */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk upload activities</DialogTitle>
            <DialogDescription>
              Upload a CSV with columns: Activity Name, Process Code, Step,
              Frequency Type, Frequency Value, Duration, Complexity, Position,
              Assignee IDs.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border-2 border-dashed p-8 text-center">
            <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drop your CSV file here</p>
            <p className="text-xs text-muted-foreground">
              or click to browse — max 10 MB
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Choose file
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setBulkOpen(false)}>
              Validate &amp; Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SYNC FROM BPM */}
      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync from Business Process</DialogTitle>
            <DialogDescription>
              Pull the latest activity definitions from the BPM module. The
              engine will re-derive workload demand, required HC and utilization
              for every affected activity.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <p className="font-medium">Last sync</p>
            <p className="text-muted-foreground">
              28 Apr 2026 · 09:14 — 4 activities updated, 2 new activities
              detected
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSyncOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setSyncOpen(false)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run sync now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DUPLICATE */}
      <Dialog
        open={!!duplicateTarget}
        onOpenChange={(v) => !v && setDuplicateTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate activity</DialogTitle>
            <DialogDescription>
              A copy of <strong>{duplicateTarget?.name}</strong> will be created
              in the same process. You can rename and reassign after creation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicateTarget(null)}>
              Cancel
            </Button>
            <Button onClick={() => setDuplicateTarget(null)}>Duplicate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete activity</DialogTitle>
            <DialogDescription>
              Delete <strong>{deleteTarget?.name}</strong>? This removes its
              workload contribution from {deleteTarget?.processName} and
              triggers re-aggregation in Workforce Planning.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteTarget(null)}
            >
              Delete activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RECALCULATE */}
      <Dialog
        open={!!recalcTarget}
        onOpenChange={(v) => !v && setRecalcTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recalculate workload</DialogTitle>
            <DialogDescription>
              Re-run the workload formula for{" "}
              <strong>{recalcTarget?.name}</strong> using the latest inputs from
              BPM and Org Structure. Required HC, utilization, and staffing
              status will refresh.
            </DialogDescription>
          </DialogHeader>
          {recalcTarget && (
            <div className="grid gap-2 rounded-lg border bg-muted/20 p-3 text-xs">
              <RecalcRow
                label="Base workload"
                value={`${recalcTarget.baseWorkload} h`}
              />
              <RecalcRow
                label="Adjusted workload"
                value={`${recalcTarget.adjustedWorkload.toFixed(2)} h`}
              />
              <RecalcRow
                label="Required HC"
                value={`${recalcTarget.requiredHc.toFixed(2)} FTE`}
              />
              <RecalcRow
                label="Utilization"
                value={`${recalcTarget.utilization}%`}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecalcTarget(null)}>
              Close
            </Button>
            <Button onClick={() => setRecalcTarget(null)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Recalculate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SEND HC TO WORKFORCE PLANNING */}
      <Dialog
        open={!!sendHcTarget}
        onOpenChange={(v) => !v && setSendHcTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Required HC to Workforce Planning</DialogTitle>
            <DialogDescription>
              Required HC of{" "}
              <strong>{sendHcTarget?.requiredHc.toFixed(2)} FTE</strong> for
              role <strong>{sendHcTarget?.responsiblePosition}</strong> in{" "}
              {sendHcTarget?.department} will be pushed downstream. Workforce
              Planning will receive the request immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendHcTarget(null)}>
              Cancel
            </Button>
            <Button onClick={() => setSendHcTarget(null)}>
              <Send className="mr-2 h-4 w-4" />
              Send now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AiAssistant />
    </div>
  );
}

function KpiCell({
  label,
  value,
  sub,
  valueClass = "",
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-0.5 p-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className={`text-xl font-bold tabular-nums ${valueClass}`}>
          {value}
        </p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function RecalcRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}
