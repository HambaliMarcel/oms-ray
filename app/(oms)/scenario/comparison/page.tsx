"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ArrowUpDown, Check, Download, GitBranch,
  TrendingUp, TrendingDown, Users, DollarSign, Activity, Target,
  AlertTriangle, CheckCircle2, Building2, ChevronDown, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { unifiedScenarios as scenarios, unifiedDepartments as departments, unifiedPositions as positions } from "@/lib/om-metrics";
import { formatRupiah } from "@/lib/currency";

const STATUS_COLORS: Record<string, string> = {
  Active:    "bg-slate-100 text-slate-700 border-slate-200",
  Draft:     "bg-amber-50 text-amber-700 border-amber-200",
  Submitted: "bg-blue-50 text-blue-700 border-blue-200",
  Approved:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function fmtCost(n: number) {
  return formatRupiah(n);
}

function pctDelta(a: number, b: number) {
  if (a === 0) return 0;
  return ((b - a) / a) * 100;
}

// Generate scenario-specific scaled department + position data
function getScenarioData(scenarioId: string) {
  const scn = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
  // Scale factor based on hcImpact relative to baseline 246
  const hcScale = scn.hc / 246;
  const costScale = scn.cost / 40250000;

  const scaledDepts = departments.map((d) => ({
    ...d,
    hc: Math.round(d.hc * hcScale),
    cost: Math.round(d.cost * costScale),
    kpi: Math.max(60, Math.min(100, Math.round(d.kpi + (scn.kpi - 82)))),
  }));

  const scaledPositions = positions.map((p) => ({
    ...p,
    filled: Math.max(0, Math.round(p.filled * hcScale)),
  }));

  return { scenario: scn, depts: scaledDepts, positions: scaledPositions };
}

export default function ScenarioComparisonPage() {
  const [aId, setAId] = useState("S000");
  const [bId, setBId] = useState("S001");
  const [view, setView] = useState<"overview" | "structure" | "workforce">("overview");
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(["D04", "D05"]));
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextA = params.get("a");
    const nextB = params.get("b");
    if (nextA) setAId(nextA);
    if (nextB) setBId(nextB);
  }, []);

  const a = useMemo(() => getScenarioData(aId), [aId]);
  const b = useMemo(() => getScenarioData(bId), [bId]);

  const aMetrics = {
    hc: a.scenario.hc,
    cost: a.scenario.cost,
    util: a.scenario.util,
    kpi: a.scenario.kpi,
  };
  const bMetrics = {
    hc: b.scenario.hc,
    cost: b.scenario.cost,
    util: b.scenario.util,
    kpi: b.scenario.kpi,
  };

  const deltas = {
    hc: bMetrics.hc - aMetrics.hc,
    cost: bMetrics.cost - aMetrics.cost,
    util: bMetrics.util - aMetrics.util,
    kpi: bMetrics.kpi - aMetrics.kpi,
  };

  // Recommendation
  const recommendation = useMemo(() => {
    let scoreA = aMetrics.kpi - aMetrics.util * 0.2 - (aMetrics.cost / 1_000_000) * 0.5;
    let scoreB = bMetrics.kpi - bMetrics.util * 0.2 - (bMetrics.cost / 1_000_000) * 0.5;
    return scoreB > scoreA ? "B" : "A";
  }, [aMetrics, bMetrics]);

  // Charts: side-by-side metrics
  const metricChart = [
    { metric: "HC",          A: aMetrics.hc,                B: bMetrics.hc },
    { metric: "Cost (Rp Miliar)",   A: +(aMetrics.cost/1_000_000_000).toFixed(2), B: +(bMetrics.cost/1_000_000_000).toFixed(2) },
    { metric: "Utilization", A: +aMetrics.util.toFixed(1),  B: +bMetrics.util.toFixed(1) },
    { metric: "KPI",         A: aMetrics.kpi,               B: bMetrics.kpi },
  ];

  const radarData = [
    { dim: "Headcount",     A: (aMetrics.hc / 350) * 100,        B: (bMetrics.hc / 350) * 100 },
    { dim: "Cost Eff.",     A: 100 - (aMetrics.cost / 60000000) * 100, B: 100 - (bMetrics.cost / 60000000) * 100 },
    { dim: "Utilization",   A: aMetrics.util,                    B: bMetrics.util },
    { dim: "KPI Score",     A: aMetrics.kpi,                     B: bMetrics.kpi },
    { dim: "Coverage",      A: Math.min(100, (aMetrics.hc / 246) * 80), B: Math.min(100, (bMetrics.hc / 246) * 80) },
    { dim: "Stability",     A: 100 - Math.abs(aMetrics.util - 85), B: 100 - Math.abs(bMetrics.util - 85) },
  ];

  const deptCompareChart = a.depts.map((dA, i) => ({
    dept: dA.code,
    A: dA.hc,
    B: b.depts[i]?.hc ?? dA.hc,
  }));

  const costCompareChart = a.depts.map((dA, i) => ({
    dept: dA.code,
    A: Math.round(dA.cost / 1000),
    B: Math.round((b.depts[i]?.cost ?? dA.cost) / 1000),
  }));

  function swap() {
    setAId(bId);
    setBId(aId);
  }

  function toggleDept(id: string) {
    const next = new Set(expandedDepts);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedDepts(next);
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-col gap-4 pb-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/scenario/directory">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Directory
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Scenario Comparison</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Side-by-side analysis of two scenarios
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Export Report
            </Button>
            <Link href={`/scenario/builder?id=${bId}`}>
              <Button size="sm" className="gap-1.5 text-xs"
                style={{ background: "var(--primary)", color: "white" }}>
                <GitBranch className="w-3.5 h-3.5" /> Open Scenario B
              </Button>
            </Link>
          </div>
        </div>

        {/* A/B Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
          <ScenarioPicker
            label="A — Baseline"
            value={aId}
            onChange={setAId}
            scenario={a.scenario}
            color="slate"
          />
          <div className="flex items-center justify-center">
            <Button variant="outline" size="sm" onClick={swap} className="h-9 w-9 p-0 rounded-full">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
          <ScenarioPicker
            label="B — Comparison"
            value={bId}
            onChange={setBId}
            scenario={b.scenario}
            color="blue"
          />
        </div>

        {/* KPI Comparison Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCompare label="Headcount" icon={Users}
            aValue={aMetrics.hc.toString()} bValue={bMetrics.hc.toString()}
            delta={deltas.hc} deltaSuffix=" FTE" goodWhenPositive={false} />
          <KpiCompare label="Annual Cost" icon={DollarSign}
            aValue={fmtCost(aMetrics.cost)} bValue={fmtCost(bMetrics.cost)}
            delta={deltas.cost} deltaPrefix="" deltaCustom={fmtCost(Math.abs(deltas.cost))}
            goodWhenPositive={false} />
          <KpiCompare label="Utilization" icon={Activity}
            aValue={aMetrics.util.toFixed(1) + "%"} bValue={bMetrics.util.toFixed(1) + "%"}
            delta={deltas.util} deltaSuffix="pp" precision={1} goodWhenPositive />
          <KpiCompare label="KPI Score" icon={Target}
            aValue={aMetrics.kpi.toFixed(0)} bValue={bMetrics.kpi.toFixed(0)}
            delta={deltas.kpi} deltaSuffix="" precision={0} goodWhenPositive />
        </div>

        {/* Recommendation Banner */}
        <Card className={`p-4 border-2 ${recommendation === "B" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${recommendation === "B" ? "bg-emerald-100" : "bg-slate-100"}`}>
              <CheckCircle2 className={`w-5 h-5 ${recommendation === "B" ? "text-emerald-700" : "text-slate-700"}`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground">
                Recommendation: Scenario {recommendation} — {(recommendation === "A" ? a : b).scenario.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {recommendation === "B"
                  ? `Scenario B delivers ${deltas.kpi > 0 ? "+" : ""}${deltas.kpi} KPI points with ${deltas.cost > 0 ? "increased" : "reduced"} cost (${fmtCost(Math.abs(deltas.cost))}). Utilization shifts ${deltas.util > 0 ? "up" : "down"} by ${Math.abs(deltas.util).toFixed(1)}pp.`
                  : `Scenario A maintains stronger overall balance. Scenario B trades cost or KPI for marginal gains.`}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs">Send for Approval</Button>
              <Button size="sm" className="text-xs" style={{ background: "var(--primary)", color: "white" }}>
                Adopt as Baseline
              </Button>
            </div>
          </div>
        </Card>

        {/* View Tabs */}
        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
          <TabsList>
            <TabsTrigger value="overview" className="text-xs gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Overview & KPIs
            </TabsTrigger>
            <TabsTrigger value="structure" className="text-xs gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Org Structure
            </TabsTrigger>
            <TabsTrigger value="workforce" className="text-xs gap-1.5">
              <Users className="w-3.5 h-3.5" /> Workforce
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Multi-Dimensional Comparison</div>
                    <div className="text-xs text-muted-foreground">Normalized 0–100 across 6 dimensions</div>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
                      <Radar name="A" dataKey="A" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                      <Radar name="B" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Headcount by Department</div>
                    <div className="text-xs text-muted-foreground">FTE distribution across functions</div>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptCompareChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="A" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="B" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-4 lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Cost Distribution by Department</div>
                    <div className="text-xs text-muted-foreground">Annual cost (Rupiah)</div>
                  </div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costCompareChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number) => formatRupiah(v)} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="A" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="B" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* STRUCTURE — side by side trees */}
          <TabsContent value="structure" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OrgTreeColumn
                title={`A — ${a.scenario.name}`}
                badge={a.scenario.status}
                depts={a.depts}
                expanded={expandedDepts}
                onToggle={toggleDept}
                accent="slate"
                otherDepts={b.depts}
              />
              <OrgTreeColumn
                title={`B — ${b.scenario.name}`}
                badge={b.scenario.status}
                depts={b.depts}
                expanded={expandedDepts}
                onToggle={toggleDept}
                accent="blue"
                otherDepts={a.depts}
              />
            </div>
          </TabsContent>

          {/* WORKFORCE — side by side table */}
          <TabsContent value="workforce" className="mt-4">
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b bg-slate-50/50 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <div>Department</div>
                <div className="text-right">A: HC</div>
                <div className="text-right">B: HC</div>
                <div className="text-right">Δ HC</div>
                <div className="text-right">A: Cost</div>
                <div className="text-right">B: Cost</div>
                <div className="text-right">Δ Cost</div>
              </div>
              <div className="divide-y">
                {a.depts.map((dA, i) => {
                  const dB = b.depts[i] ?? dA;
                  const hcDelta = dB.hc - dA.hc;
                  const costDelta = dB.cost - dA.cost;
                  return (
                    <div key={dA.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-2.5 text-sm hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: dA.color }} />
                        <span className="text-foreground font-medium">{dA.name}</span>
                      </div>
                      <div className="text-right text-foreground">{dA.hc}</div>
                      <div className="text-right text-foreground font-semibold">{dB.hc}</div>
                      <div className={`text-right text-xs font-semibold ${hcDelta > 0 ? "text-emerald-600" : hcDelta < 0 ? "text-rose-600" : "text-slate-500"}`}>
                        {hcDelta > 0 ? "+" : ""}{hcDelta}
                      </div>
                      <div className="text-right text-foreground">{fmtCost(dA.cost)}</div>
                      <div className="text-right text-foreground font-semibold">{fmtCost(dB.cost)}</div>
                      <div className={`text-right text-xs font-semibold ${costDelta > 0 ? "text-rose-600" : costDelta < 0 ? "text-emerald-600" : "text-slate-500"}`}>
                        {costDelta >= 0 ? "+" : "-"}{fmtCost(Math.abs(costDelta))}
                      </div>
                    </div>
                  );
                })}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3 bg-slate-50 text-sm font-bold">
                  <div>Total</div>
                  <div className="text-right">{a.depts.reduce((s, d) => s + d.hc, 0)}</div>
                  <div className="text-right">{b.depts.reduce((s, d) => s + d.hc, 0)}</div>
                  <div className={`text-right ${deltas.hc > 0 ? "text-emerald-600" : deltas.hc < 0 ? "text-rose-600" : ""}`}>
                    {deltas.hc > 0 ? "+" : ""}{deltas.hc}
                  </div>
                  <div className="text-right">{fmtCost(aMetrics.cost)}</div>
                  <div className="text-right">{fmtCost(bMetrics.cost)}</div>
                  <div className={`text-right ${deltas.cost > 0 ? "text-rose-600" : deltas.cost < 0 ? "text-emerald-600" : ""}`}>
                    {deltas.cost >= 0 ? "+" : "-"}{fmtCost(Math.abs(deltas.cost))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ScenarioPicker({
  label, value, onChange, scenario, color,
}: {
  label: string; value: string; onChange: (v: string) => void;
  scenario: typeof scenarios[number]; color: "slate" | "blue";
}) {
  const accent = color === "blue"
    ? { border: "border-blue-200", bg: "bg-blue-50/50", text: "text-blue-700", labelBg: "bg-blue-600" }
    : { border: "border-slate-200", bg: "bg-slate-50/50", text: "text-slate-700", labelBg: "bg-slate-700" };
  return (
    <Card className={`p-4 ${accent.border} ${accent.bg}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${accent.labelBg}`}>
          {label}
        </div>
        <Badge variant="outline" className={`text-xs font-normal ${STATUS_COLORS[scenario.status] ?? ""}`}>
          {scenario.status}
        </Badge>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {scenarios.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-muted-foreground">· {s.type}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wide">HC</span>
          <span className="font-bold text-foreground">{scenario.hc}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wide">Cost</span>
          <span className="font-bold text-foreground">{fmtCost(scenario.cost)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wide">Util</span>
          <span className="font-bold text-foreground">{scenario.util.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wide">KPI</span>
          <span className="font-bold text-foreground">{scenario.kpi}</span>
        </div>
      </div>
      <div className="text-[11px] text-muted-foreground mt-2 line-clamp-2">
        {scenario.description}
      </div>
    </Card>
  );
}

function KpiCompare({
  label, icon: Icon, aValue, bValue, delta, deltaPrefix, deltaSuffix = "",
  deltaCustom, precision = 0, goodWhenPositive,
}: {
  label: string; icon: any; aValue: string; bValue: string; delta: number;
  deltaPrefix?: string; deltaSuffix?: string; deltaCustom?: string;
  precision?: number; goodWhenPositive: boolean;
}) {
  const isGood = goodWhenPositive ? delta > 0 : delta < 0;
  const isNeutral = delta === 0;
  const colorClass = isNeutral ? "text-slate-500" : isGood ? "text-emerald-600" : "text-rose-600";
  const TrendIcon = isNeutral ? null : delta > 0 ? TrendingUp : TrendingDown;
  const formattedDelta = deltaCustom
    ? (delta >= 0 ? "+" : "-") + deltaCustom
    : (delta > 0 ? "+" : "") + (deltaPrefix ?? "") + delta.toFixed(precision) + deltaSuffix;
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="text-[10px] text-slate-500 uppercase">A</div>
          <div className="text-xl font-bold text-slate-500">{aValue}</div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground mb-1.5" />
        <div className="text-right">
          <div className="text-[10px] text-blue-600 uppercase">B</div>
          <div className="text-xl font-bold text-foreground">{bValue}</div>
        </div>
      </div>
      <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${colorClass}`}>
        {TrendIcon ? <TrendIcon className="w-3.5 h-3.5" /> : null}
        <span>{formattedDelta}</span>
        <span className="text-muted-foreground font-normal">vs A</span>
      </div>
    </Card>
  );
}

function OrgTreeColumn({
  title, badge, depts, expanded, onToggle, accent, otherDepts,
}: {
  title: string; badge: string; depts: typeof departments; expanded: Set<string>;
  onToggle: (id: string) => void; accent: "slate" | "blue";
  otherDepts: typeof departments;
}) {
  const accentColor = accent === "blue" ? "border-blue-200 bg-blue-50/30" : "border-slate-200 bg-slate-50/30";
  return (
    <Card className={`p-0 overflow-hidden border-2 ${accentColor}`}>
      <div className="px-4 py-3 border-b bg-white/70 flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground truncate">{title}</div>
        <Badge variant="outline" className={`text-xs font-normal ${STATUS_COLORS[badge] ?? ""}`}>
          {badge}
        </Badge>
      </div>
      <div className="p-3 max-h-[600px] overflow-y-auto flex flex-col gap-1">
        {depts.map((d, i) => {
          const otherD = otherDepts[i];
          const hcDelta = otherD ? d.hc - otherD.hc : 0;
          const isExpanded = expanded.has(d.id);
          return (
            <div key={d.id} className="rounded-lg border bg-white">
              <div className="flex items-center gap-2 p-2.5 cursor-pointer hover:bg-slate-50"
                onClick={() => onToggle(d.id)}>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground truncate">{d.name}</div>
                  <div className="text-[10px] text-muted-foreground">{d.head} · {d.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">{d.hc}</div>
                  {hcDelta !== 0 && (
                    <div className={`text-[10px] font-semibold ${hcDelta > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {hcDelta > 0 ? "+" : ""}{hcDelta}
                    </div>
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="px-2 pb-2 border-t pt-2 grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <div className="text-muted-foreground">Plan</div>
                    <div className="text-foreground font-semibold">{d.headPlan}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">KPI</div>
                    <div className="text-foreground font-semibold">{d.kpi}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cost</div>
                    <div className="text-foreground font-semibold">{fmtCost(d.cost)}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
