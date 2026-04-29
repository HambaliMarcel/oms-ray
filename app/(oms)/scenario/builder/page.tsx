"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Save, Copy, Send, RotateCcw, Plus, Edit2, Trash2, ArrowLeft, ArrowRight,
  ChevronRight, ChevronDown, Building2, Briefcase, Workflow, Activity,
  Users, DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Target, Zap, BarChart3, GitBranch, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from "recharts";
import {
  unifiedDepartments as initialDepts,
  unifiedPositions as initialPositions,
  unifiedScenarios as scenarios,
  unifiedProcesses as processes,
} from "@/lib/om-metrics";
import { formatRupiah } from "@/lib/currency";

type Dept = (typeof initialDepts)[number];
type Pos  = (typeof initialPositions)[number];

const STATUS_COLORS: Record<string, string> = {
  Active:    "bg-slate-100 text-slate-700 border-slate-200",
  Draft:     "bg-amber-50 text-amber-700 border-amber-200",
  Submitted: "bg-blue-50 text-blue-700 border-blue-200",
  Approved:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function fmtCost(n: number) {
  return formatRupiah(n);
}

export default function ScenarioBuilderPage() {
  const [scenarioId, setScenarioId] = useState("S001");
  useEffect(() => {
    const nextId = new URLSearchParams(window.location.search).get("id");
    if (nextId) setScenarioId(nextId);
  }, []);
  const baseScenario = scenarios.find((s) => s.id === scenarioId) || scenarios[1];

  // Scenario meta
  const [name, setName] = useState(baseScenario.name);
  const [status, setStatus] = useState(baseScenario.status);

  // Editable structure (deep copies)
  const [depts, setDepts]         = useState<Dept[]>(initialDepts.map((d) => ({ ...d })));
  const [positions, setPositions] = useState<Pos[]>(initialPositions.map((p) => ({ ...p })));

  // Assumptions
  const [hiringSpeed, setHiringSpeed]     = useState(60);
  const [attritionRate, setAttritionRate] = useState(8);
  const [growthPct, setGrowthPct]         = useState(0);
  const [salaryChange, setSalaryChange]   = useState(0);
  const [benefitsPct, setBenefitsPct]     = useState(28);
  const [bonusPct, setBonusPct]           = useState(15);

  // UI state
  const [activeSection, setActiveSection] = useState("structure");
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(["D04", "D05"]));
  const [editDept, setEditDept]   = useState<Dept | null>(null);
  const [createDeptOpen, setCreateDeptOpen] = useState(false);
  const [deleteDeptId, setDeleteDeptId] = useState<string | null>(null);
  const [editPos, setEditPos]     = useState<Pos | null>(null);
  const [createPosOpen, setCreatePosOpen] = useState(false);
  const [deletePosId, setDeletePosId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const [newDept, setNewDept] = useState({ name: "", code: "", headPlan: 10, head: "" });
  const [newPos, setNewPos] = useState({ title: "", deptId: "D02", level: "Staff", grade: "G5", salaryMin: 12000000, salaryMax: 22000000 });

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  // ====== CALCULATION ENGINE ======
  const baselineMetrics = useMemo(() => {
    const totalHC = initialDepts.reduce((s, d) => s + d.hc, 0);
    const totalCost = initialDepts.reduce((s, d) => s + d.cost, 0);
    const avgUtil = initialDepts.reduce((s, d) => s + (d.hc / d.headPlan) * 100, 0) / initialDepts.length;
    const avgKPI = initialDepts.reduce((s, d) => s + d.kpi, 0) / initialDepts.length;
    return { hc: totalHC, cost: totalCost, util: Math.min(100, avgUtil), kpi: avgKPI };
  }, []);

  const scenarioMetrics = useMemo(() => {
    const adjustedHC = depts.reduce((s, d) => s + d.hc, 0);
    const targetHC = adjustedHC * (1 + growthPct / 100);
    const baseCost = depts.reduce((s, d) => s + d.cost, 0);
    const benefitsMultiplier = 1 + (benefitsPct - 28) / 100 + (bonusPct - 15) / 100;
    const adjustedCost = baseCost * (1 + salaryChange / 100) * benefitsMultiplier * (targetHC / Math.max(adjustedHC, 1));
    const planTotal = depts.reduce((s, d) => s + d.headPlan, 0);
    const actualHC = targetHC * (1 - attritionRate / 100) + Math.max(0, planTotal - targetHC) * (hiringSpeed / 100);
    const util = planTotal > 0 ? Math.min(100, (actualHC / planTotal) * 100) : 0;
    const utilDelta = Math.abs(util - 85);
    const kpiPenalty = utilDelta > 10 ? (utilDelta - 10) * 0.5 : 0;
    const kpiBoost = (hiringSpeed - 50) * 0.05;
    const adjustedKPI = Math.max(50, Math.min(100, baselineMetrics.kpi - kpiPenalty + kpiBoost));
    return { hc: Math.round(targetHC), cost: adjustedCost, util, kpi: adjustedKPI };
  }, [depts, growthPct, salaryChange, benefitsPct, bonusPct, attritionRate, hiringSpeed, baselineMetrics.kpi]);

  const deltas = {
    hc:   scenarioMetrics.hc - baselineMetrics.hc,
    cost: scenarioMetrics.cost - baselineMetrics.cost,
    util: scenarioMetrics.util - baselineMetrics.util,
    kpi:  scenarioMetrics.kpi - baselineMetrics.kpi,
  };

  const scenarioStatus = useMemo(() => {
    if (scenarioMetrics.util > 95 || scenarioMetrics.kpi < 70)
      return { label: "Critical", color: "rose", icon: AlertTriangle };
    if (scenarioMetrics.util > 90 || scenarioMetrics.kpi < 78 || Math.abs(deltas.cost) / baselineMetrics.cost > 0.15)
      return { label: "At Risk", color: "amber", icon: AlertTriangle };
    return { label: "Balanced", color: "emerald", icon: CheckCircle2 };
  }, [scenarioMetrics, deltas.cost, baselineMetrics.cost]);

  const hcByDeptData = depts.map((d) => {
    const baseDept = initialDepts.find((b) => b.id === d.id);
    return {
      dept: d.code,
      Baseline: baseDept?.hc ?? d.hc,
      Scenario: Math.round(d.hc * (1 + growthPct / 100)),
    };
  });

  const costData = depts.map((d) => {
    const baseDept = initialDepts.find((b) => b.id === d.id);
    const benefitsMultiplier = 1 + (benefitsPct - 28) / 100 + (bonusPct - 15) / 100;
    return {
      dept: d.code,
      Baseline: Math.round((baseDept?.cost ?? d.cost) / 1000),
      Scenario: Math.round((d.cost * (1 + salaryChange / 100) * benefitsMultiplier) / 1000),
    };
  });

  const workloadData = depts.map((d) => {
    const filled = positions.filter((p) => p.deptId === d.id).reduce((s, p) => s + p.filled, 0);
    const planned = positions.filter((p) => p.deptId === d.id).reduce((s, p) => s + p.planned, 0);
    const util = planned > 0 ? (filled / planned) * 100 : 0;
    const adjustedUtil = util * (1 + (growthPct / 100)) * (1 - attritionRate / 200);
    return { dept: d.name, util: Math.round(util), adjusted: Math.round(adjustedUtil), planned, filled };
  });

  // ====== HANDLERS ======
  function toggleDept(id: string) {
    const next = new Set(expandedDepts);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedDepts(next);
  }

  function handleCreateDept() {
    if (!newDept.name.trim()) return;
    const id = `D${String(depts.length + 13).padStart(2, "0")}`;
    const created = {
      id,
      name: newDept.name.trim(),
      code: newDept.code.trim() || newDept.name.slice(0, 4).toUpperCase(),
      hc: 0, headPlan: newDept.headPlan, gap: newDept.headPlan,
      budget: newDept.headPlan * 80000, utilized: 0,
      head: newDept.head || "TBD", location: "Jakarta", status: "Active",
      color: "#94A3B8", vacancies: newDept.headPlan, spanOfControl: 4, avgTenure: 0,
      kpi: 75, cost: newDept.headPlan * 65000,
    } as Dept;
    setDepts([...depts, created]);
    setCreateDeptOpen(false);
    setNewDept({ name: "", code: "", headPlan: 10, head: "" });
    showToast(`Department "${created.name}" created`);
  }

  function handleSaveDept() {
    if (!editDept) return;
    setDepts(depts.map((d) => d.id === editDept.id ? editDept : d));
    setEditDept(null);
    showToast(`Updated "${editDept.name}"`);
  }

  function handleDeleteDept() {
    if (!deleteDeptId) return;
    const d = depts.find((x) => x.id === deleteDeptId);
    setDepts(depts.filter((x) => x.id !== deleteDeptId));
    setPositions(positions.filter((p) => p.deptId !== deleteDeptId));
    setDeleteDeptId(null);
    if (d) showToast(`Removed "${d.name}"`);
  }

  function handleCreatePos() {
    if (!newPos.title.trim()) return;
    const id = `P${String(positions.length + 103).padStart(3, "0")}`;
    const dept = depts.find((d) => d.id === newPos.deptId);
    const created = {
      id, title: newPos.title.trim(),
      dept: dept?.name ?? "", deptId: newPos.deptId,
      grade: newPos.grade, level: newPos.level,
      filled: 0, planned: 1, status: "Open",
      salaryMin: newPos.salaryMin, salaryMax: newPos.salaryMax,
      competencies: [],
    } as Pos;
    setPositions([...positions, created]);
    setCreatePosOpen(false);
    setNewPos({ title: "", deptId: "D02", level: "Staff", grade: "G5", salaryMin: 60000, salaryMax: 90000 });
    showToast(`Position "${created.title}" created`);
  }

  function handleSavePos() {
    if (!editPos) return;
    setPositions(positions.map((p) => p.id === editPos.id ? editPos : p));
    setEditPos(null);
    showToast(`Updated "${editPos.title}"`);
  }

  function handleDuplicatePos(p: Pos) {
    const id = `P${String(positions.length + 103).padStart(3, "0")}`;
    const dup = { ...p, id, title: `${p.title} (Copy)`, filled: 0, planned: 1 } as Pos;
    setPositions([...positions, dup]);
    showToast(`Duplicated "${p.title}"`);
  }

  function handleDeletePos() {
    if (!deletePosId) return;
    const p = positions.find((x) => x.id === deletePosId);
    setPositions(positions.filter((x) => x.id !== deletePosId));
    setDeletePosId(null);
    if (p) showToast(`Removed "${p.title}"`);
  }

  function handleReset() {
    setDepts(initialDepts.map((d) => ({ ...d })));
    setPositions(initialPositions.map((p) => ({ ...p })));
    setHiringSpeed(60); setAttritionRate(8); setGrowthPct(0);
    setSalaryChange(0); setBenefitsPct(28); setBonusPct(15);
    showToast("Reset to baseline");
  }

  function handleSave() { showToast("Scenario saved"); }
  function handleSubmit() { setStatus("Submitted"); showToast("Submitted for approval"); }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-col gap-4 pb-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <Link href="/scenario/directory">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Directory
              </Button>
            </Link>
            <div className="flex-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-semibold border-0 px-0 h-9 focus-visible:ring-0 bg-transparent"
              />
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-xs font-normal ${STATUS_COLORS[status] ?? ""}`}>
                  {status}
                </Badge>
                <span className="text-xs text-muted-foreground">{baseScenario.id}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{baseScenario.type}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Baseline
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Copy className="w-3.5 h-3.5" /> Duplicate
            </Button>
            <Link href={`/scenario/comparison?a=S000&b=${baseScenario.id}`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <GitBranch className="w-3.5 h-3.5" /> Compare
              </Button>
            </Link>
            <Button size="sm" className="gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90"
              onClick={handleSave}>
              <Save className="w-3.5 h-3.5" /> Save
            </Button>
            <Button size="sm" className="gap-1.5 text-xs"
              style={{ background: "var(--primary)", color: "white" }}
              onClick={handleSubmit}>
              <Send className="w-3.5 h-3.5" /> Submit for Approval
            </Button>
          </div>
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT: Editable Components */}
          <Card className="col-span-12 lg:col-span-4 xl:col-span-3 p-0 overflow-hidden">
            <div className="px-4 py-3 border-b bg-slate-50/50">
              <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Editable Components
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Modify any element to see live impact</div>
            </div>
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
              <TabsList className="grid grid-cols-3 mx-3 mt-3 h-auto p-1">
                <TabsTrigger value="structure" className="text-xs px-1 py-1.5 gap-1">
                  <Building2 className="w-3 h-3" /> Org
                </TabsTrigger>
                <TabsTrigger value="positions" className="text-xs px-1 py-1.5 gap-1">
                  <Briefcase className="w-3 h-3" /> Roles
                </TabsTrigger>
                <TabsTrigger value="processes" className="text-xs px-1 py-1.5 gap-1">
                  <Workflow className="w-3 h-3" /> Process
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-3 mx-3 mt-2 h-auto p-1">
                <TabsTrigger value="workload" className="text-xs px-1 py-1.5 gap-1">
                  <Activity className="w-3 h-3" /> Workload
                </TabsTrigger>
                <TabsTrigger value="workforce" className="text-xs px-1 py-1.5 gap-1">
                  <Users className="w-3 h-3" /> WFM
                </TabsTrigger>
                <TabsTrigger value="cost" className="text-xs px-1 py-1.5 gap-1">
                  <DollarSign className="w-3 h-3" /> Cost
                </TabsTrigger>
              </TabsList>

              {/* Section 1: Org Structure */}
              <TabsContent value="structure" className="m-0 p-3 max-h-[640px] overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Departments</div>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                    onClick={() => setCreateDeptOpen(true)}>
                    <Plus className="w-3 h-3" /> Add
                  </Button>
                </div>
                <div className="flex flex-col gap-1">
                  {depts.map((d) => (
                    <div key={d.id} className="rounded-lg border bg-white">
                      <div className="flex items-center gap-2 p-2 hover:bg-slate-50 transition cursor-pointer"
                        onClick={() => toggleDept(d.id)}>
                        {expandedDepts.has(d.id)
                          ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground truncate">{d.name}</div>
                          <div className="text-[10px] text-muted-foreground">{d.hc}/{d.headPlan} HC · {d.head}</div>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-normal h-5 px-1.5">
                          {d.code}
                        </Badge>
                      </div>
                      {expandedDepts.has(d.id) && (
                        <div className="px-2 pb-2 flex items-center gap-1 border-t pt-2">
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 px-2"
                            onClick={() => setEditDept(d)}>
                            <Edit2 className="w-2.5 h-2.5" /> Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            onClick={() => setDeleteDeptId(d.id)}>
                            <Trash2 className="w-2.5 h-2.5" /> Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Section 2: Positions */}
              <TabsContent value="positions" className="m-0 p-3 max-h-[640px] overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Positions ({positions.length})</div>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                    onClick={() => setCreatePosOpen(true)}>
                    <Plus className="w-3 h-3" /> Create
                  </Button>
                </div>
                <div className="flex flex-col gap-1">
                  {positions.slice(0, 30).map((p) => (
                    <div key={p.id} className="rounded-lg border bg-white p-2 hover:bg-slate-50 transition group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground truncate">{p.title}</div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {p.dept} · {(p as any).level || p.grade} · {p.filled}/{p.planned}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {formatRupiah(p.salaryMin)} – {formatRupiah(p.salaryMax)}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                            onClick={() => setEditPos(p)}>
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                            onClick={() => handleDuplicatePos(p)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50"
                            onClick={() => setDeletePosId(p.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {positions.length > 30 && (
                    <div className="text-[11px] text-muted-foreground text-center py-2">
                      + {positions.length - 30} more positions
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Section 3: Processes */}
              <TabsContent value="processes" className="m-0 p-3 max-h-[640px] overflow-y-auto">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Business Processes
                </div>
                <div className="flex flex-col gap-1">
                  {processes.slice(0, 8).map((proc: any) => (
                    <div key={proc.id} className="rounded-lg border bg-white p-2 hover:bg-slate-50 transition">
                      <div className="text-xs font-medium text-foreground">{proc.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Owner: {proc.owner} · KPI: {proc.kpi ?? "Linked"}
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Button size="sm" variant="ghost" className="h-6 text-[10px] px-1.5">
                          <Edit2 className="w-2.5 h-2.5 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 text-[10px] px-1.5 text-rose-600">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 mt-1">
                    <Plus className="w-3 h-3" /> Add Process
                  </Button>
                </div>
              </TabsContent>

              {/* Section 4: Activity & Workload */}
              <TabsContent value="workload" className="m-0 p-3 max-h-[640px] overflow-y-auto">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Activity & Workload
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { name: "Customer Onboarding", freq: "Daily", duration: "45 min", role: "CS Rep", emp: 12 },
                    { name: "Invoice Processing", freq: "Daily", duration: "20 min", role: "AP Specialist", emp: 5 },
                    { name: "Quarterly Audit", freq: "Quarterly", duration: "5 days", role: "Internal Auditor", emp: 2 },
                    { name: "Vendor Onboarding", freq: "Weekly", duration: "2 hr", role: "Procurement", emp: 4 },
                    { name: "Payroll Run", freq: "Monthly", duration: "1 day", role: "Payroll Mgr", emp: 1 },
                  ].map((a, i) => (
                    <div key={i} className="rounded-lg border bg-white p-2.5">
                      <div className="text-xs font-medium text-foreground mb-1.5">{a.name}</div>
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div>
                          <div className="text-muted-foreground">Frequency</div>
                          <div className="text-foreground font-medium">{a.freq}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Duration</div>
                          <div className="text-foreground font-medium">{a.duration}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Role</div>
                          <div className="text-foreground font-medium">{a.role}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Employees</div>
                          <div className="text-foreground font-medium">{a.emp}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Section 5: Workforce Assumptions */}
              <TabsContent value="workforce" className="m-0 p-3 max-h-[640px] overflow-y-auto">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Workforce Assumptions
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Hiring Speed</Label>
                      <span className="text-xs font-semibold text-primary">{hiringSpeed}%</span>
                    </div>
                    <Slider value={[hiringSpeed]} onValueChange={([v]) => setHiringSpeed(v)} min={0} max={100} step={5} />
                    <div className="text-[10px] text-muted-foreground mt-1">% of open positions filled this period</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Attrition Rate</Label>
                      <span className="text-xs font-semibold text-primary">{attritionRate}%</span>
                    </div>
                    <Slider value={[attritionRate]} onValueChange={([v]) => setAttritionRate(v)} min={0} max={25} step={1} />
                    <div className="text-[10px] text-muted-foreground mt-1">Annual voluntary turnover</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Growth %</Label>
                      <span className="text-xs font-semibold text-primary">{growthPct > 0 ? "+" : ""}{growthPct}%</span>
                    </div>
                    <Slider value={[growthPct]} onValueChange={([v]) => setGrowthPct(v)} min={-20} max={30} step={1} />
                    <div className="text-[10px] text-muted-foreground mt-1">Net headcount change vs baseline</div>
                  </div>
                </div>
              </TabsContent>

              {/* Section 6: Cost Assumptions */}
              <TabsContent value="cost" className="m-0 p-3 max-h-[640px] overflow-y-auto">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Cost Assumptions
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Salary Change</Label>
                      <span className="text-xs font-semibold text-primary">{salaryChange > 0 ? "+" : ""}{salaryChange}%</span>
                    </div>
                    <Slider value={[salaryChange]} onValueChange={([v]) => setSalaryChange(v)} min={-15} max={20} step={1} />
                    <div className="text-[10px] text-muted-foreground mt-1">Across-the-board salary adjustment</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Benefits %</Label>
                      <span className="text-xs font-semibold text-primary">{benefitsPct}%</span>
                    </div>
                    <Slider value={[benefitsPct]} onValueChange={([v]) => setBenefitsPct(v)} min={15} max={45} step={1} />
                    <div className="text-[10px] text-muted-foreground mt-1">% of salary for benefits</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Bonus %</Label>
                      <span className="text-xs font-semibold text-primary">{bonusPct}%</span>
                    </div>
                    <Slider value={[bonusPct]} onValueChange={([v]) => setBonusPct(v)} min={0} max={35} step={1} />
                    <div className="text-[10px] text-muted-foreground mt-1">Average annual bonus target</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* CENTER: Real-Time Simulation */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-6 flex flex-col gap-4">
            <Card className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center gap-2 text-xs">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-foreground">Real-Time Simulation</span>
                <span className="text-muted-foreground">— recalculating on every input change</span>
                <span className="ml-auto text-[10px] text-blue-700 font-medium">LIVE</span>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">1. Headcount Impact</div>
                  <div className="text-xs text-muted-foreground">Baseline vs Scenario by department</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {deltas.hc > 0 ? "+" : ""}{deltas.hc} FTE
                </Badge>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hcByDeptData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Scenario" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">2. Workload Impact</div>
                  <div className="text-xs text-muted-foreground">Overloaded vs underutilized roles</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {workloadData.slice(0, 6).map((w) => {
                  const overloaded = w.adjusted > 100;
                  const underutil = w.adjusted < 70;
                  const bgClass = overloaded ? "bg-rose-50 border-rose-200"
                    : underutil ? "bg-amber-50 border-amber-200"
                    : "bg-emerald-50 border-emerald-200";
                  const textClass = overloaded ? "text-rose-700"
                    : underutil ? "text-amber-700"
                    : "text-emerald-700";
                  return (
                    <div key={w.dept} className={`p-2.5 rounded-lg border ${bgClass}`}>
                      <div className="text-[10px] font-medium text-foreground truncate">{w.dept}</div>
                      <div className={`text-lg font-bold mt-0.5 ${textClass}`}>{w.adjusted}%</div>
                      <div className="text-[10px] text-muted-foreground">
                        {w.filled}/{w.planned} filled
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">3. Cost Impact</div>
                  <div className="text-xs text-muted-foreground">Annual cost by department (Rupiah)</div>
                </div>
                <Badge variant="outline" className={`text-xs ${deltas.cost >= 0 ? "text-rose-700 border-rose-200 bg-rose-50" : "text-emerald-700 border-emerald-200 bg-emerald-50"}`}>
                  {deltas.cost >= 0 ? "+" : ""}{fmtCost(deltas.cost)}
                </Badge>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number) => formatRupiah(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Scenario" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">4. KPI Impact</div>
                    <div className="text-xs text-muted-foreground">Process performance score</div>
                  </div>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-end gap-3 mt-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground">Baseline</div>
                    <div className="text-2xl font-bold text-slate-500">{baselineMetrics.kpi.toFixed(0)}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground mb-2" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Scenario</div>
                    <div className="text-2xl font-bold text-foreground">{scenarioMetrics.kpi.toFixed(0)}</div>
                  </div>
                  <Badge variant="outline" className={`ml-auto text-xs ${deltas.kpi >= 0 ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-rose-700 border-rose-200 bg-rose-50"}`}>
                    {deltas.kpi >= 0 ? "+" : ""}{deltas.kpi.toFixed(1)}
                  </Badge>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">5. Gap Analysis</div>
                    <div className="text-xs text-muted-foreground">HC gap vs plan</div>
                  </div>
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-end gap-3 mt-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground">Open Roles</div>
                    <div className="text-2xl font-bold text-foreground">
                      {depts.reduce((s, d) => s + d.gap, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Filled %</div>
                    <div className="text-2xl font-bold text-foreground">
                      {scenarioMetrics.util.toFixed(0)}%
                    </div>
                  </div>
                  <Badge variant="outline" className={`ml-auto text-xs ${deltas.util >= 0 ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-amber-700 border-amber-200 bg-amber-50"}`}>
                    {deltas.util >= 0 ? "+" : ""}{deltas.util.toFixed(1)}pp
                  </Badge>
                </div>
              </Card>
            </div>
          </div>

          {/* RIGHT: Summary Output */}
          <Card className="col-span-12 lg:col-span-3 xl:col-span-3 p-0 overflow-hidden h-fit">
            <div className="px-4 py-3 border-b bg-slate-50/50">
              <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4" /> Scenario Summary
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Live impact rollup</div>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <StatusBanner status={scenarioStatus} />

              <SummaryRow label="HC Change"   base={baselineMetrics.hc}   value={scenarioMetrics.hc}   delta={deltas.hc}   suffix=" FTE" />
              <SummaryRow label="Cost Change" base={baselineMetrics.cost} value={scenarioMetrics.cost} delta={deltas.cost} suffix="" isCost />
              <SummaryRow label="Utilization" base={baselineMetrics.util} value={scenarioMetrics.util} delta={deltas.util} suffix="%" precision={1} />
              <SummaryRow label="KPI Score"   base={baselineMetrics.kpi}  value={scenarioMetrics.kpi}  delta={deltas.kpi}  suffix=""  precision={1} />

              <div className="border-t pt-3 mt-1">
                <Link href={`/scenario/comparison?a=S000&b=${baseScenario.id}`} className="block">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                    <GitBranch className="w-3.5 h-3.5" /> View Full Comparison
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* DIALOGS */}
      <Dialog open={createDeptOpen} onOpenChange={setCreateDeptOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
            <DialogDescription>Create a new department in this scenario.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs">Department Name</Label>
              <Input value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Code</Label>
                <Input value={newDept.code} onChange={(e) => setNewDept({ ...newDept, code: e.target.value })} placeholder="e.g. CS" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Headcount Target</Label>
                <Input type="number" value={newDept.headPlan} onChange={(e) => setNewDept({ ...newDept, headPlan: +e.target.value })} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Department Head</Label>
              <Input value={newDept.head} onChange={(e) => setNewDept({ ...newDept, head: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDeptOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateDept} style={{ background: "var(--primary)", color: "white" }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editDept} onOpenChange={(o) => !o && setEditDept(null)}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader><DialogTitle>Edit Department</DialogTitle></DialogHeader>
          {editDept && (
            <div className="grid gap-3 py-2">
              <div className="grid gap-1.5">
                <Label className="text-xs">Name</Label>
                <Input value={editDept.name} onChange={(e) => setEditDept({ ...editDept, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-xs">HC Target</Label>
                  <Input type="number" value={editDept.headPlan} onChange={(e) => setEditDept({ ...editDept, headPlan: +e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Current HC</Label>
                  <Input type="number" value={editDept.hc} onChange={(e) => setEditDept({ ...editDept, hc: +e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Head</Label>
                <Input value={editDept.head} onChange={(e) => setEditDept({ ...editDept, head: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDept(null)}>Cancel</Button>
            <Button onClick={handleSaveDept} style={{ background: "var(--primary)", color: "white" }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteDeptId} onOpenChange={(o) => !o && setDeleteDeptId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Department?</DialogTitle>
            <DialogDescription>All associated positions will also be removed from this scenario.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDeptId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDept}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createPosOpen} onOpenChange={setCreatePosOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader><DialogTitle>Create Position</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs">Title</Label>
              <Input value={newPos.title} onChange={(e) => setNewPos({ ...newPos, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Department</Label>
                <Select value={newPos.deptId} onValueChange={(v) => setNewPos({ ...newPos, deptId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {depts.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Level</Label>
                <Select value={newPos.level} onValueChange={(v) => setNewPos({ ...newPos, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior Staff">Junior Staff</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Senior Staff">Senior Staff</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="VP">VP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Min Salary</Label>
                <Input type="number" value={newPos.salaryMin} onChange={(e) => setNewPos({ ...newPos, salaryMin: +e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Max Salary</Label>
                <Input type="number" value={newPos.salaryMax} onChange={(e) => setNewPos({ ...newPos, salaryMax: +e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePosOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePos} style={{ background: "var(--primary)", color: "white" }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPos} onOpenChange={(o) => !o && setEditPos(null)}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader><DialogTitle>Edit Position</DialogTitle></DialogHeader>
          {editPos && (
            <div className="grid gap-3 py-2">
              <div className="grid gap-1.5">
                <Label className="text-xs">Title</Label>
                <Input value={editPos.title} onChange={(e) => setEditPos({ ...editPos, title: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Department</Label>
                <Select value={editPos.deptId} onValueChange={(v) => {
                  const d = depts.find((x) => x.id === v);
                  setEditPos({ ...editPos, deptId: v, dept: d?.name ?? editPos.dept });
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {depts.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-xs">Min Salary</Label>
                  <Input type="number" value={editPos.salaryMin} onChange={(e) => setEditPos({ ...editPos, salaryMin: +e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Max Salary</Label>
                  <Input type="number" value={editPos.salaryMax} onChange={(e) => setEditPos({ ...editPos, salaryMax: +e.target.value })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPos(null)}>Cancel</Button>
            <Button onClick={handleSavePos} style={{ background: "var(--primary)", color: "white" }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletePosId} onOpenChange={(o) => !o && setDeletePosId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Delete Position?</DialogTitle></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePosId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePos}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50"
          style={{ background: "var(--primary)", color: "white" }}>
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}

function StatusBanner({ status }: { status: { label: string; color: string; icon: any } }) {
  const Icon = status.icon;
  const palette: Record<string, { bg: string; border: string; text: string; iconText: string }> = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", iconText: "text-emerald-600" },
    amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   iconText: "text-amber-600" },
    rose:    { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    iconText: "text-rose-600" },
  };
  const p = palette[status.color] ?? palette.emerald;
  return (
    <div className={`p-3 rounded-lg border ${p.bg} ${p.border}`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${p.iconText}`} />
        <div>
          <div className={`text-sm font-bold ${p.text}`}>{status.label}</div>
          <div className="text-[10px] text-muted-foreground">Overall scenario health</div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label, base, value, delta, suffix, isCost, precision = 0,
}: {
  label: string; base: number; value: number; delta: number;
  suffix?: string; isCost?: boolean; precision?: number;
}) {
  const positive = delta > 0;
  const neutral = delta === 0;
  const goodDirection = label === "Cost Change" ? !positive : positive;
  const colorClass = neutral
    ? "text-slate-600"
    : goodDirection
      ? "text-emerald-600"
      : "text-rose-600";

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/60 border border-slate-100">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        <div className="text-lg font-bold text-foreground mt-0.5">
          {isCost ? fmtCost(value) : value.toFixed(precision)}{suffix}
        </div>
        <div className="text-[10px] text-muted-foreground">
          from {isCost ? fmtCost(base) : base.toFixed(precision)}{suffix}
        </div>
      </div>
      <div className={`flex flex-col items-end gap-0.5 ${colorClass}`}>
        {neutral ? null : positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <div className="text-sm font-semibold">
          {neutral ? "0" : (positive ? "+" : "") + (isCost ? fmtCost(Math.abs(delta)) : delta.toFixed(precision))}
          {!isCost && suffix}
        </div>
      </div>
    </div>
  );
}
