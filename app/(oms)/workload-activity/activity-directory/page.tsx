"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Download,
  Plus,
  RefreshCw,
  Search,
  Send,
  SlidersHorizontal,
  TrendingDown,
  Upload,
  Users,
} from "lucide-react";
import { TopBar } from "@/components/oms/topbar";
import { AiAssistant } from "@/components/oms/ai-assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const [expandedProcesses, setExpandedProcesses] = useState<Record<string, boolean>>({});

  // Position list (unique responsible positions)
  const positions = useMemo(() => {
    const set = new Set(workloadActivities.map((a) => a.responsiblePosition));
    return Array.from(set).sort();
  }, []);

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

        {/* Filter bar */}
        <Card className="mb-4 border-0 bg-transparent shadow-none">
          <CardContent className="grid gap-3 p-0 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activity, code, or process"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
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
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {grouped.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-12 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <Activity className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No activities match your filters.</p>
              <Button size="sm" variant="outline" onClick={clearFilters}>Clear filters</Button>
            </div>
          ) : (
            grouped.map(({ process, items }) => {
              const isOpen = expandedProcesses[process.id] ?? true;
              return (
                <section key={process.id} className="rounded-2xl bg-[#EDF2F7] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <button
                    type="button"
                    onClick={() => setExpandedProcesses((p) => ({ ...p, [process.id]: !isOpen }))}
                    className="flex w-full items-center justify-between rounded-2xl bg-[#DDE4EC] px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-[22px] font-semibold text-[#1F2937]">{process.name}</p>
                      <p className="text-xs text-[#64748B]">{process.code} · {items.length} Activities</p>
                    </div>
                    {isOpen ? <ChevronDown className="h-5 w-5 text-[#64748B]" /> : <ChevronRight className="h-5 w-5 text-[#64748B]" />}
                  </button>
                  {isOpen && (
                    <div className="mt-4 space-y-3">
                      {items.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => goToActivity(a.id)}
                          className="flex w-full items-start justify-between rounded-2xl bg-white px-5 py-4 text-left shadow-[0_6px_16px_rgba(15,23,42,0.04)]"
                        >
                          <div className="min-w-0">
                            <p className="text-[26px] leading-none text-[#FACC15]">•</p>
                            <p className="-mt-1 text-[22px] font-semibold text-[#1F2937]">{a.name}</p>
                            <p className="text-sm text-[#64748B]">Role: {a.responsiblePosition}</p>
                            <p className="mt-1 text-sm font-medium text-[#2563EB]">Open activity detail {"->"}</p>
                          </div>
                          <div className="ml-4 grid grid-cols-3 gap-6 text-right">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">Frequency</p>
                              <p className="text-sm font-semibold text-[#1F2937]">{a.frequencyValue}/mo</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">Duration</p>
                              <p className="text-sm font-semibold text-[#1F2937]">{a.duration}h</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">Workload</p>
                              <p className="text-sm font-semibold text-[#1D4ED8]">{Math.round(a.adjustedWorkload)}h/mo</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
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

function RecalcRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}
