"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, Plus, Copy, Trash2, Send, ExternalLink, Filter, Download,
  TrendingUp, TrendingDown, Minus, ChevronDown, MoreHorizontal,
  CheckCircle2, Clock, FileText, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { unifiedScenarios as initialScenarios } from "@/lib/om-metrics";
import { formatRupiah } from "@/lib/currency";

type Scenario = (typeof initialScenarios)[number];

const TYPE_COLORS: Record<string, string> = {
  Baseline:        "bg-slate-100 text-slate-700 border-slate-200",
  Growth:          "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cost:            "bg-amber-50 text-amber-700 border-amber-200",
  Automation:      "bg-blue-50 text-blue-700 border-blue-200",
  Restructuring:   "bg-violet-50 text-violet-700 border-violet-200",
};

const STATUS_COLORS: Record<string, string> = {
  Active:    "bg-slate-100 text-slate-700 border-slate-200",
  Draft:     "bg-amber-50 text-amber-700 border-amber-200",
  Submitted: "bg-blue-50 text-blue-700 border-blue-200",
  Approved:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function formatCost(n: number) {
  return formatRupiah(n);
}

function ImpactCell({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (value === 0)
    return (
      <span className="inline-flex items-center gap-1 text-slate-500 text-sm">
        <Minus className="w-3.5 h-3.5" /> 0{suffix}
      </span>
    );
  const positive = value > 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? "text-emerald-600" : "text-rose-600";
  return (
    <span className={`inline-flex items-center gap-1 font-medium text-sm ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {positive ? "+" : ""}
      {suffix === "cost" ? formatCost(value) : value}
      {suffix !== "cost" ? suffix : ""}
    </span>
  );
}

export default function ScenarioDirectoryPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios as Scenario[]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitId, setSubmitId] = useState<string | null>(null);
  const [toast, setToast] = useState<string>("");

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Growth");
  const [newDesc, setNewDesc] = useState("");

  const filtered = useMemo(() => {
    return scenarios.filter((s) => {
      if (typeFilter !== "all" && s.type !== typeFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [scenarios, search, typeFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: scenarios.length,
    drafts: scenarios.filter((s) => s.status === "Draft").length,
    submitted: scenarios.filter((s) => s.status === "Submitted").length,
    approved: scenarios.filter((s) => s.status === "Approved").length,
  }), [scenarios]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function handleCreate() {
    if (!newName.trim()) return;
    const newId = `S${String(scenarios.length).padStart(3, "0")}`;
    const newScenario: Scenario = {
      id: newId,
      name: newName.trim(),
      description: newDesc.trim() || "New scenario draft",
      type: newType,
      status: "Draft",
      createdBy: "Current User",
      lastUpdated: new Date().toISOString().slice(0, 10),
      hc: 246,
      hcImpact: 0,
      cost: 40250000,
      costImpact: 0,
      util: 84.2,
      kpi: 82,
    } as Scenario;
    setScenarios([newScenario, ...scenarios]);
    setNewName(""); setNewDesc(""); setNewType("Growth");
    setCreateOpen(false);
    showToast(`Created "${newScenario.name}"`);
  }

  function handleDuplicate(s: Scenario) {
    const newId = `S${String(scenarios.length).padStart(3, "0")}`;
    const dup: Scenario = {
      ...s,
      id: newId,
      name: `${s.name} (Copy)`,
      status: "Draft",
      createdBy: "Current User",
      lastUpdated: new Date().toISOString().slice(0, 10),
    } as Scenario;
    setScenarios([dup, ...scenarios]);
    showToast(`Duplicated "${s.name}"`);
  }

  function handleDelete() {
    if (!deleteId) return;
    const s = scenarios.find((x) => x.id === deleteId);
    setScenarios(scenarios.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    if (s) showToast(`Deleted "${s.name}"`);
  }

  function handleSubmit() {
    if (!submitId) return;
    const s = scenarios.find((x) => x.id === submitId);
    setScenarios(scenarios.map((x) =>
      x.id === submitId ? ({ ...x, status: "Submitted" } as Scenario) : x
    ));
    setSubmitId(null);
    if (s) showToast(`Submitted "${s.name}" for approval`);
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-col gap-5 pb-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Scenario Directory</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse, manage, and track all transformation scenarios across the organization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
            <Button size="sm" className="gap-1.5 text-xs"
              style={{ background: "var(--primary)", color: "white" }}
              onClick={() => setCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5" /> Create New Scenario
            </Button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Scenarios</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{stats.drafts}</div>
              <div className="text-xs text-muted-foreground">In Draft</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{stats.submitted}</div>
              <div className="text-xs text-muted-foreground">Pending Approval</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">{stats.approved}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-3 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search scenarios by name or description..."
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-[160px] text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Baseline">Baseline</SelectItem>
              <SelectItem value="Growth">Growth</SelectItem>
              <SelectItem value="Cost">Cost</SelectItem>
              <SelectItem value="Automation">Automation</SelectItem>
              <SelectItem value="Restructuring">Restructuring</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[160px] text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"
            onClick={() => { setSearch(""); setTypeFilter("all"); setStatusFilter("all"); }}>
            <Filter className="w-3.5 h-3.5" /> Clear
          </Button>
          <div className="text-xs text-muted-foreground ml-auto">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> of {scenarios.length}
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Scenario Name</th>
                  <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Created By</th>
                  <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Last Updated</th>
                  <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">HC Impact</th>
                  <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Cost Impact</th>
                  <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const hcImpact = (s as any).hcImpact ?? 0;
                  const costImpact = (s as any).costImpact ?? 0;
                  return (
                    <tr key={s.id} className="border-b hover:bg-slate-50 transition group">
                      <td className="px-4 py-3">
                        <Link href={`/scenario/builder?id=${s.id}`} className="block">
                          <div className="font-medium text-foreground group-hover:text-primary transition">
                            {s.name}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-[360px]">
                            {s.description}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs font-normal ${TYPE_COLORS[s.type] ?? ""}`}>
                          {s.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs font-normal ${STATUS_COLORS[s.status] ?? ""}`}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{(s as any).createdBy ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{(s as any).lastUpdated ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <ImpactCell value={hcImpact} suffix=" FTE" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ImpactCell value={costImpact} suffix="cost" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/scenario/builder?id=${s.id}`}>
                            <Button variant="outline" size="sm" className="h-8 px-2 gap-1 text-xs">
                              <ExternalLink className="w-3.5 h-3.5" /> Open
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleDuplicate(s)}>
                                <Copy className="w-4 h-4 mr-2" /> Duplicate
                              </DropdownMenuItem>
                              {s.status === "Draft" && (
                                <DropdownMenuItem onClick={() => setSubmitId(s.id)}>
                                  <Send className="w-4 h-4 mr-2" /> Submit for Approval
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-rose-600 focus:text-rose-600"
                                onClick={() => setDeleteId(s.id)}
                                disabled={s.id === "S000"}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                      No scenarios match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create New Scenario</DialogTitle>
            <DialogDescription>
              Start a new transformation scenario. You can edit all assumptions in the Builder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Scenario Name</Label>
              <Input
                id="name"
                placeholder="e.g. Q3 2026 Growth Plan"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Cost">Cost</SelectItem>
                  <SelectItem value="Automation">Automation</SelectItem>
                  <SelectItem value="Restructuring">Restructuring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                placeholder="Brief description of the scenario..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}
              style={{ background: "var(--primary)", color: "white" }}>
              Create Scenario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Delete Scenario?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The scenario and its data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirm */}
      <Dialog open={!!submitId} onOpenChange={(o) => !o && setSubmitId(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Submit for Approval?</DialogTitle>
            <DialogDescription>
              This scenario will be routed to the Workflow & Governance approval pipeline.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitId(null)}>Cancel</Button>
            <Button onClick={handleSubmit}
              style={{ background: "var(--primary)", color: "white" }}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50"
          style={{ background: "var(--primary)", color: "white" }}>
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}
