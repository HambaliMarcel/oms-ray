"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  GripVertical,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { TopBar } from "@/components/oms/topbar";
import { AiAssistant } from "@/components/oms/ai-assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
import { useRouter } from "next/navigation";
import { ActivityForm } from "@/components/workload/activity-form";
import {
  unifiedWorkloadActivities as workloadActivities,
  unifiedEmployeesAll as employeesAll,
  unifiedDepartments as departments,
  unifiedWORKLOAD_CONSTANTS as WORKLOAD_CONSTANTS,
  type WorkloadActivity,
} from "@/lib/om-metrics";

// ---- column definitions ----
type KanbanCol = {
  id: "unassigned" | "understaffed" | "balanced" | "overloaded";
  label: string;
  filterFn: (a: WorkloadActivity) => boolean;
  headerBorder: string;
  badgeClass: string;
};

const COLUMNS: KanbanCol[] = [
  {
    id: "unassigned",
    label: "Unassigned",
    filterFn: (a) => a.assignedHc === 0,
    headerBorder: "border-t-gray-400",
    badgeClass: "bg-muted text-muted-foreground",
  },
  {
    id: "understaffed",
    label: "Understaffed",
    filterFn: (a) => a.assignedHc > 0 && a.hcGap > 0.05 && a.utilization > 100,
    headerBorder: "border-t-destructive",
    badgeClass: "bg-destructive/15 text-destructive border-destructive/30",
  },
  {
    id: "balanced",
    label: "Balanced",
    filterFn: (a) => a.assignedHc > 0 && a.utilization >= 70 && a.utilization <= 110,
    headerBorder: "border-t-emerald-500",
    badgeClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  },
  {
    id: "overloaded",
    label: "Overloaded",
    filterFn: (a) => a.assignedHc > 0 && a.utilization > 110,
    headerBorder: "border-t-amber-500",
    badgeClass: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  },
];

// ---- helpers ----
function utilColor(util: number) {
  if (util > 110) return "text-destructive";
  if (util >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (util >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-blue-600 dark:text-blue-400";
}

function critBadge(c: WorkloadActivity["criticality"]) {
  const m: Record<string, string> = {
    Critical: "bg-destructive/15 text-destructive border-destructive/30",
    High: "bg-orange-500/15 text-orange-600 border-orange-500/30",
    Medium: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    Low: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  };
  return m[c] ?? "";
}

export default function AssignmentManagement() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const router = useRouter();
  const goToActivity = (id: string) =>
    router.push(`/workload-activity/activity-directory/${id}`);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignDialog, setAssignDialog] = useState<WorkloadActivity | null>(null);
  const [assignSearch, setAssignSearch] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  const deptNames = ["All", ...departments.map((d) => d.name)];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return workloadActivities.filter((a) => {
      if (deptFilter !== "All" && a.department !== deptFilter) return false;
      if (
        q &&
        !a.name.toLowerCase().includes(q) &&
        !a.role.toLowerCase().includes(q) &&
        !a.processName.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [search, deptFilter]);

  // Capacity sidebar employees
  const empCapacity = useMemo(() => {
    return employeesAll
      .filter(
        (e) =>
          deptFilter === "All" ||
          e.dept === deptFilter ||
          departments.find((d) => d.id === e.deptId)?.name === deptFilter,
      )
      .map((e) => {
        const myActs = workloadActivities.filter((a) => a.assignedEmployees.includes(e.id));
        const demand = myActs.reduce((s, a) => s + a.adjustedWorkload, 0);
        const cap = Math.max(
          1,
          WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor,
        );
        const util = Math.round((demand / cap) * 100);
        return { ...e, assignedCount: myActs.length, demand: Math.round(demand), util };
      })
      .sort((a, b) => b.util - a.util)
      .slice(0, 12);
  }, [deptFilter]);

  // Assign dialog: eligible employees
  const availableEmps = useMemo(() => {
    if (!assignDialog) return [];
    const q = assignSearch.toLowerCase();
    return employeesAll
      .filter(
        (e) =>
          !assignDialog.assignedEmployees.includes(e.id) &&
          (e.position.toLowerCase().includes(assignDialog.role.toLowerCase()) ||
            e.dept.toLowerCase().includes(assignDialog.department.toLowerCase())) &&
          (!q || e.name.toLowerCase().includes(q) || e.position.toLowerCase().includes(q)),
      )
      .slice(0, 12);
  }, [assignDialog, assignSearch]);

  const totalActivities = workloadActivities.length;
  const unassignedCount = workloadActivities.filter((a) => a.assignedHc === 0).length;
  const understaffedCount = workloadActivities.filter(
    (a) => a.assignedHc > 0 && a.hcGap > 0.05 && a.utilization > 100,
  ).length;
  const overloadedCount = workloadActivities.filter(
    (a) => a.assignedHc > 0 && a.utilization > 110,
  ).length;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          title="Assignment Management"
          subtitle="Assign employees to activities and manage staffing"
          actions={
            <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> New Activity
            </Button>
          }
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Capacity sidebar */}
          <div className="hidden w-64 flex-none flex-col gap-3 overflow-y-auto border-r bg-card p-4 xl:flex">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Employee Capacity
            </p>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-7 w-full text-xs">
                <SelectValue placeholder="Filter dept" />
              </SelectTrigger>
              <SelectContent>
                {deptNames.map((d) => (
                  <SelectItem key={d} value={d} className="text-xs">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              {empCapacity.map((e) => {
                const isFull = e.util >= 90;
                return (
                  <div
                    key={e.id}
                    className="cursor-pointer rounded-lg border bg-background p-2.5 transition-colors hover:border-primary/50"
                    onClick={() => {
                      const act = workloadActivities.find((a) =>
                        a.assignedEmployees.includes(e.id),
                      );
                      if (act) goToActivity(act.id);
                    }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold">{e.name}</p>
                        <p className="truncate text-[10px] text-muted-foreground">{e.position}</p>
                      </div>
                      <span className={`text-[11px] font-bold tabular-nums ${utilColor(e.util)}`}>
                        {e.util}%
                      </span>
                    </div>
                    <Progress value={Math.min(100, e.util)} className="mt-1.5 h-1" />
                    <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{e.assignedCount} activities</span>
                      <span
                        className={
                          isFull
                            ? "font-medium text-amber-600"
                            : "font-medium text-emerald-600"
                        }
                      >
                        {isFull ? "Near capacity" : "Available"}
                      </span>
                    </div>
                  </div>
                );
              })}
              {empCapacity.length === 0 && (
                <p className="text-xs italic text-muted-foreground">
                  No employees in this department.
                </p>
              )}
            </div>

            <Separator />
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total activities</span>
                <span className="font-bold">{totalActivities}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unassigned</span>
                <span className="font-bold text-muted-foreground">{unassignedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Understaffed</span>
                <span className="font-bold text-destructive">{understaffedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overloaded</span>
                <span className="font-bold text-amber-600">{overloadedCount}</span>
              </div>
            </div>
          </div>

          {/* Kanban board */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-3 border-b px-5 py-3">
              <nav className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Workload Planning</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-medium text-foreground">Assignment Management</span>
              </nav>
              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search activities..."
                    className="h-8 w-52 pl-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Columns */}
            <div className="flex flex-1 gap-3 overflow-x-auto overflow-y-hidden p-4">
              {COLUMNS.map((col) => {
                const cards = filtered.filter(col.filterFn);
                return (
                  <div
                    key={col.id}
                    className="flex w-[17.5rem] flex-none flex-col rounded-xl border bg-muted/30"
                  >
                    {/* Header */}
                    <div
                      className={`rounded-t-xl border-t-2 bg-card px-4 py-3 ${col.headerBorder}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{col.label}</span>
                        <Badge
                          variant="outline"
                          className={`text-[11px] ${col.badgeClass}`}
                        >
                          {cards.length}
                        </Badge>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
                      {cards.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                          <Check className="h-6 w-6 text-muted-foreground/40" />
                          <p className="mt-1 text-xs text-muted-foreground">No activities</p>
                        </div>
                      )}
                      {cards.map((a) => (
                        <div
                          key={a.id}
                          className="group cursor-pointer rounded-lg border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-sm"
                          onClick={() => goToActivity(a.id)}
                        >
                          <div className="flex items-start gap-1.5">
                            <GripVertical className="mt-0.5 h-3.5 w-3.5 flex-none text-muted-foreground/30 group-hover:text-muted-foreground/60" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[12px] font-semibold leading-tight">
                                {a.name}
                              </p>
                              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                                {a.processName}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-1">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${critBadge(a.criticality)}`}
                            >
                              {a.criticality}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {a.complexityLevel}
                            </Badge>
                          </div>

                          <div className="mt-2.5 grid grid-cols-3 gap-1 text-[11px]">
                            <div>
                              <p className="text-muted-foreground">Demand</p>
                              <p className="font-semibold tabular-nums">
                                {a.adjustedWorkload.toFixed(0)} h
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Req. HC</p>
                              <p className="font-semibold tabular-nums">
                                {a.requiredHc.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Assigned</p>
                              <p
                                className={`font-semibold tabular-nums ${
                                  a.hcGap > 0.05 ? "text-destructive" : "text-emerald-600"
                                }`}
                              >
                                {a.assignedHc}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="mb-0.5 flex items-center justify-between text-[10px]">
                              <span className="text-muted-foreground">Utilization</span>
                              <span className={`font-bold ${utilColor(a.utilization)}`}>
                                {a.utilization}%
                              </span>
                            </div>
                            <Progress
                              value={Math.min(100, a.utilization)}
                              className="h-1.5"
                            />
                          </div>

                          {a.assignedEmployeeNames.length > 0 && (
                            <div className="mt-2 flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate text-[10px] text-muted-foreground">
                                {a.assignedEmployeeNames.slice(0, 2).join(", ")}
                                {a.assignedEmployeeNames.length > 2 &&
                                  ` +${a.assignedEmployeeNames.length - 2}`}
                              </span>
                            </div>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-6 w-full gap-1 text-[11px] text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssignDialog(a);
                            }}
                          >
                            <Plus className="h-3 w-3" /> Assign Employee
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AiAssistant />

      {/* Create activity modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Activity</DialogTitle>
            <DialogDescription>
              Define a new workload activity and assign it to a business process.
            </DialogDescription>
          </DialogHeader>
          <ActivityForm onCancel={() => setCreateOpen(false)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateOpen(false)}>Save Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign employee dialog */}
      <Dialog open={!!assignDialog} onOpenChange={(o) => !o && setAssignDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Employee</DialogTitle>
            <DialogDescription>
              Assign an employee to <strong>{assignDialog?.name}</strong>. Showing eligible
              employees by role / department match.
            </DialogDescription>
          </DialogHeader>

          {assignDialog && (
            <div className="space-y-3">
              <div className="space-y-1 rounded-lg border bg-muted/30 p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required role</span>
                  <span className="font-semibold">{assignDialog.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required HC</span>
                  <span className="font-semibold">{assignDialog.requiredHc.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currently assigned</span>
                  <span className="font-semibold">{assignDialog.assignedHc}</span>
                </div>
                {assignDialog.hcGap > 0.05 && (
                  <div className="flex items-center gap-1.5 text-destructive">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      Gap: {assignDialog.hcGap.toFixed(2)} FTE needed
                    </span>
                  </div>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                  placeholder="Search employees..."
                  className="h-8 pl-8 text-xs"
                />
              </div>

              <div className="max-h-60 space-y-1.5 overflow-y-auto">
                {availableEmps.map((e) => {
                  const myActs = workloadActivities.filter((a) =>
                    a.assignedEmployees.includes(e.id),
                  );
                  const demand = myActs.reduce((s, a) => s + a.adjustedWorkload, 0);
                  const cap = Math.max(
                    1,
                    WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor,
                  );
                  const util = Math.round((demand / cap) * 100);
                  const isSelected = selectedEmpId === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEmpId(isSelected ? null : e.id)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold">{e.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {e.position} · {e.dept}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-bold ${utilColor(util)}`}>{util}%</p>
                          <p className="text-[10px] text-muted-foreground">
                            {myActs.length} acts
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 flex-none text-primary" />
                        )}
                      </div>
                      <Progress value={Math.min(100, util)} className="mt-1.5 h-1" />
                    </button>
                  );
                })}
                {availableEmps.length === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No eligible employees found.
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignDialog(null);
                setSelectedEmpId(null);
                setAssignSearch("");
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedEmpId}
              onClick={() => {
                setAssignDialog(null);
                setSelectedEmpId(null);
                setAssignSearch("");
              }}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
