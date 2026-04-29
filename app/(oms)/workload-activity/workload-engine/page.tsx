"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ActivitySquare,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Download,
  Layers,
  Network,
  RefreshCw,
  Send,
  Sliders,
  Target,
  TrendingDown,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TopBar } from "@/components/oms/topbar";
import { AiAssistant } from "@/components/oms/ai-assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  unifiedComplexityMultipliers as COMPLEXITY_MULTIPLIERS,
  unifiedWORKLOAD_CONSTANTS as WORKLOAD_CONSTANTS,
  unifiedDepartments as departments,
  unifiedKpiList as kpiList,
  unifiedProcessList as processList,
  unifiedWorkloadActivities as workloadActivities,
  unifiedWorkloadByDepartment as workloadByDepartment,
  unifiedWorkloadByRole as workloadByRole,
  unifiedWorkloadHeatmap as workloadHeatmap,
} from "@/lib/om-metrics";

function utilColor(util: number) {
  if (util > 110) return "text-destructive";
  if (util >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (util >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-blue-600 dark:text-blue-400";
}

function heatmapColor(util: number) {
  if (util === 0) return "bg-muted/30 text-muted-foreground";
  if (util > 110) return "bg-destructive text-destructive-foreground";
  if (util > 90) return "bg-destructive/70 text-destructive-foreground";
  if (util > 70) return "bg-emerald-500 text-emerald-50";
  if (util > 50) return "bg-emerald-400/70 text-emerald-50";
  if (util > 30) return "bg-amber-400/70 text-amber-50";
  return "bg-blue-400/70 text-blue-50";
}

export default function WorkloadEnginePage() {
  const router = useRouter();
  // Filters
  const [orgFilter, setOrgFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [processFilter, setProcessFilter] = useState("all");
  const [kpiFilter, setKpiFilter] = useState("all");
  const [period, setPeriod] = useState("Apr 26");

  // Global assumptions
  const [stdHours, setStdHours] = useState<number>(WORKLOAD_CONSTANTS.monthlyHours);
  const [productivity, setProductivity] = useState<number>(
    WORKLOAD_CONSTANTS.productivityFactor,
  );
  const [workingDays, setWorkingDays] = useState<number>(22);
  const [absenceFactor, setAbsenceFactor] = useState<number>(0.05);
  const [complexityDefault, setComplexityDefault] = useState<number>(1.25);
  const [reworkDefault, setReworkDefault] = useState<number>(8);
  const [peakDefault, setPeakDefault] = useState<number>(1.2);

  // Dialogs
  const [exportOpen, setExportOpen] = useState(false);
  const [planningOpen, setPlanningOpen] = useState(false);
  const [recalcOpen, setRecalcOpen] = useState(false);

  // Filtered activity set
  const filteredActivities = useMemo(() => {
    return workloadActivities.filter((a) => {
      if (deptFilter !== "all" && a.departmentId !== deptFilter) return false;
      if (roleFilter !== "all" && a.responsiblePosition !== roleFilter)
        return false;
      if (processFilter !== "all" && a.processId !== processFilter) return false;
      if (kpiFilter !== "all" && a.linkedKpiId !== kpiFilter) return false;
      return true;
    });
  }, [deptFilter, roleFilter, processFilter, kpiFilter]);

  // Recalc totals using current capacity assumptions
  const totals = useMemo(() => {
    const totalDemand = filteredActivities.reduce(
      (s, a) => s + a.adjustedWorkload,
      0,
    );
    const effCap = stdHours * productivity * (1 - absenceFactor);
    const requiredHc = effCap > 0 ? totalDemand / effCap : 0;
    const availableHc = workloadByDepartment.reduce(
      (s, d) =>
        deptFilter === "all" || d.dept === departments.find((x) => x.id === deptFilter)?.name
          ? s + d.headcount
          : s,
      0,
    );
    const overloadedRoles = workloadByRole.filter((r) => r.utilization > 110)
      .length;
    return {
      totalDemand: Math.round(totalDemand),
      requiredHc: Math.round(requiredHc * 10) / 10,
      availableHc,
      netGap: Math.round((requiredHc - availableHc) * 10) / 10,
      overloadedRoles,
      overloadedPct:
        workloadByRole.length > 0
          ? Math.round((overloadedRoles / workloadByRole.length) * 100)
          : 0,
      effCap: Math.round(effCap),
    };
  }, [filteredActivities, stdHours, productivity, absenceFactor, deptFilter]);

  // Aggregated table: Department × Role
  const aggregateRows = useMemo(() => {
    const map = new Map<
      string,
      {
        deptId: string;
        dept: string;
        role: string;
        processIds: Set<string>;
        activities: number;
        workloadHours: number;
        assignedHc: number;
      }
    >();
    filteredActivities.forEach((a) => {
      const key = `${a.departmentId}::${a.responsiblePosition}`;
      const cur = map.get(key) ?? {
        deptId: a.departmentId,
        dept: a.department,
        role: a.responsiblePosition,
        processIds: new Set<string>(),
        activities: 0,
        workloadHours: 0,
        assignedHc: 0,
      };
      cur.processIds.add(a.processId);
      cur.activities += 1;
      cur.workloadHours += a.adjustedWorkload;
      cur.assignedHc = Math.max(cur.assignedHc, a.assignedHc);
      map.set(key, cur);
    });
    return Array.from(map.values())
      .map((r) => {
        const effCap = stdHours * productivity * (1 - absenceFactor);
        const capacityH = r.assignedHc * effCap;
        const requiredHc = effCap > 0 ? r.workloadHours / effCap : 0;
        const utilization =
          capacityH > 0 ? Math.round((r.workloadHours / capacityH) * 100) : 0;
        const status =
          utilization > 110
            ? "Overloaded"
            : utilization >= 90
              ? "Balanced"
              : utilization >= 70
                ? "Underutilized"
                : "Significantly Underutilized";
        return {
          deptId: r.deptId,
          dept: r.dept,
          role: r.role,
          linkedProcesses: r.processIds.size,
          activities: r.activities,
          workloadHours: Math.round(r.workloadHours),
          effectiveCapacity: Math.round(capacityH),
          requiredHc: Math.round(requiredHc * 100) / 100,
          currentHc: r.assignedHc,
          gap: Math.round((requiredHc - r.assignedHc) * 100) / 100,
          utilization,
          status,
        };
      })
      .sort((a, b) => b.workloadHours - a.workloadHours);
  }, [filteredActivities, stdHours, productivity, absenceFactor]);

  // Required HC waterfall: aggregation steps
  const waterfall = useMemo(() => {
    const baseSum = filteredActivities.reduce((s, a) => s + a.baseWorkload, 0);
    const complexityImpact = filteredActivities.reduce(
      (s, a) => s + a.baseWorkload * (a.complexityMultiplier - 1),
      0,
    );
    const qualityImpact = filteredActivities.reduce(
      (s, a) =>
        s +
        a.baseWorkload * a.complexityMultiplier * (a.qualityReviewFactor - 1),
      0,
    );
    const seasonalImpact = filteredActivities.reduce(
      (s, a) =>
        s +
        a.baseWorkload *
          a.complexityMultiplier *
          a.qualityReviewFactor *
          (a.seasonalPeakFactor - 1),
      0,
    );
    const reworkImpact = filteredActivities.reduce(
      (s, a) =>
        s +
        a.baseWorkload *
          a.complexityMultiplier *
          a.qualityReviewFactor *
          a.seasonalPeakFactor *
          a.reworkRate,
      0,
    );
    const total = baseSum + complexityImpact + qualityImpact + seasonalImpact + reworkImpact;
    return [
      { name: "Base", value: Math.round(baseSum) },
      { name: "+ Complexity", value: Math.round(complexityImpact), delta: true },
      { name: "+ Quality", value: Math.round(qualityImpact), delta: true },
      { name: "+ Seasonal", value: Math.round(seasonalImpact), delta: true },
      { name: "+ Rework", value: Math.round(reworkImpact), delta: true },
      { name: "Total", value: Math.round(total) },
    ];
  }, [filteredActivities]);

  // Bar data — demand vs capacity by department
  const deptBarData = useMemo(
    () =>
      workloadByDepartment.map((d) => ({
        name: d.dept,
        Demand: d.demand,
        Capacity: Math.round(
          d.headcount * stdHours * productivity * (1 - absenceFactor),
        ),
      })),
    [stdHours, productivity, absenceFactor],
  );

  const allRoles = useMemo(
    () =>
      Array.from(
        new Set(workloadActivities.map((a) => a.responsiblePosition)),
      ).sort(),
    [],
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar
        title="Workload Engine"
        breadcrumb={["Workload & Activities", "Workload Engine"]}
      />

      <main className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <p className="text-sm text-muted-foreground">
              Calculation engine for activity workload, required HC, capacity
              gap, and utilization. Aggregates from activity → role →
              department → organization.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setRecalcOpen(true)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Recalculate All
            </Button>
            <Button variant="outline" onClick={() => setPlanningOpen(true)}>
              <Send className="mr-2 h-4 w-4" />
              Send Required HC
            </Button>
            <Button variant="outline" onClick={() => setExportOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export Workload Model
            </Button>
          </div>
        </div>

        {/* FILTER BAR */}
        <Card className="mb-4">
          <CardContent className="grid gap-3 p-4 md:grid-cols-3 lg:grid-cols-6">
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
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {allRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={processFilter} onValueChange={setProcessFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Process" />
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
                <SelectValue placeholder="KPI" />
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
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {["Feb 26", "Mar 26", "Apr 26", "May 26", "Q2 26"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* INPUT PANEL — Global assumptions */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sliders className="h-4 w-4" />
              Global assumptions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-4 md:grid-cols-4 lg:grid-cols-7">
            <AssumptionInput
              label="Std monthly capacity"
              value={stdHours}
              onChange={setStdHours}
              suffix="h"
              min={80}
              max={200}
              step={1}
            />
            <AssumptionInput
              label="Productivity factor"
              value={productivity}
              onChange={setProductivity}
              suffix="×"
              min={0.5}
              max={1}
              step={0.05}
            />
            <AssumptionInput
              label="Working days / mo"
              value={workingDays}
              onChange={setWorkingDays}
              min={15}
              max={26}
              step={1}
            />
            <AssumptionInput
              label="Leave / absence"
              value={absenceFactor}
              onChange={setAbsenceFactor}
              suffix="×"
              min={0}
              max={0.3}
              step={0.01}
            />
            <AssumptionInput
              label="Complexity default"
              value={complexityDefault}
              onChange={setComplexityDefault}
              suffix="×"
              min={1}
              max={1.75}
              step={0.05}
            />
            <AssumptionInput
              label="Rework default (%)"
              value={reworkDefault}
              onChange={setReworkDefault}
              suffix="%"
              min={0}
              max={30}
              step={1}
            />
            <AssumptionInput
              label="Peak factor default"
              value={peakDefault}
              onChange={setPeakDefault}
              suffix="×"
              min={1}
              max={1.5}
              step={0.05}
            />
          </CardContent>
        </Card>

        {/* OUTPUT TOTALS */}
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          <KpiCard
            icon={<ActivitySquare className="h-4 w-4" />}
            label="Total demand"
            value={`${totals.totalDemand.toLocaleString()} h`}
            sub="across activities"
          />
          <KpiCard
            icon={<Users className="h-4 w-4" />}
            label="Required HC"
            value={`${totals.requiredHc} FTE`}
            sub={`Eff. cap ${totals.effCap}h / FTE`}
          />
          <KpiCard
            icon={<Users className="h-4 w-4" />}
            label="Available HC"
            value={`${totals.availableHc} FTE`}
            sub="active employees"
          />
          <KpiCard
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Net gap"
            value={`${totals.netGap > 0 ? "+" : ""}${totals.netGap}`}
            sub={`${totals.overloadedPct}% roles overloaded`}
            valueClass={
              totals.netGap > 0
                ? "text-destructive"
                : "text-emerald-600 dark:text-emerald-400"
            }
          />
          <KpiCard
            icon={<TrendingDown className="h-4 w-4" />}
            label="Overloaded roles"
            value={totals.overloadedRoles.toString()}
            sub={`out of ${workloadByRole.length} roles`}
            valueClass={totals.overloadedRoles > 0 ? "text-destructive" : ""}
          />
        </div>

        {/* PROCESSING PANEL — Calculation Pipeline */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Network className="h-4 w-4" />
              Workload aggregation pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 lg:grid-cols-4">
              <PipelineStage
                step={1}
                title="Activity-level"
                icon={<ActivitySquare className="h-5 w-5" />}
                value={`${filteredActivities.length} activities`}
                detail={`${totals.totalDemand.toLocaleString()} h workload`}
                description="Each activity computes adjusted workload using complexity, quality, seasonal & rework factors."
              />
              <PipelineStage
                step={2}
                title="Role-level"
                icon={<Layers className="h-5 w-5" />}
                value={`${aggregateRows.length} role groups`}
                detail={`${aggregateRows.reduce((s, r) => s + r.activities, 0)} aggregated`}
                description="Sums workload across activities sharing the same responsible position."
              />
              <PipelineStage
                step={3}
                title="Department-level"
                icon={<Users className="h-5 w-5" />}
                value={`${workloadByDepartment.length} departments`}
                detail={`${workloadByDepartment.reduce((s, d) => s + d.activities, 0)} activities`}
                description="Aggregates role demand into department-level required HC and utilization."
              />
              <PipelineStage
                step={4}
                title="Organization"
                icon={<Target className="h-5 w-5" />}
                value={`${totals.requiredHc} FTE required`}
                detail={`Net gap ${totals.netGap > 0 ? "+" : ""}${totals.netGap}`}
                description="Final input for Workforce Planning module + Management Dashboard."
              />
            </div>

            {/* Formula band */}
            <div className="mt-4 rounded-lg border bg-muted/30 p-3 text-xs">
              <div className="flex items-center gap-2">
                <Calculator className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold">Formula chain</span>
              </div>
              <code className="mt-1 block whitespace-pre-wrap leading-relaxed text-muted-foreground">
{`Adjusted Workload = Frequency × Duration × Complexity × Quality × Seasonal × (1 + Rework)
Effective Capacity per FTE = Standard Monthly Hours (${stdHours}) × Productivity (${productivity}) × (1 - Absence ${(absenceFactor * 100).toFixed(0)}%) = ${totals.effCap} h
Required HC = Adjusted Workload ÷ Effective Capacity per FTE
Utilization = Adjusted Workload ÷ (Assigned HC × Effective Capacity per FTE)`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* CHARTS */}
        <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Heatmap · role × department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-1 text-xs">
                  <thead>
                    <tr>
                      <th className="text-left font-medium text-muted-foreground" />
                      {workloadHeatmap.departments.map((d: string) => (
                        <th
                          key={d}
                          className="px-1 py-1 text-left font-medium text-muted-foreground"
                        >
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {workloadHeatmap.roles.map((role: string) => (
                      <tr key={role}>
                        <th className="max-w-[180px] truncate pr-2 text-left text-xs font-medium text-muted-foreground">
                          {role}
                        </th>
                        {workloadHeatmap.departments.map((dept: string) => {
                          const cell = workloadHeatmap.cells.find(
                            (c: (typeof workloadHeatmap.cells)[number]) => c.role === role && c.dept === dept,
                          );
                          const util = cell?.utilization ?? 0;
                          return (
                            <td key={dept}>
                              <div
                                className={`flex h-9 items-center justify-center rounded-md text-[11px] font-semibold ${heatmapColor(util)}`}
                                title={
                                  cell
                                    ? `${role} · ${dept} · ${util}% · ${cell.demand} h demand`
                                    : "no activities"
                                }
                              >
                                {cell ? `${util}%` : "—"}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <LegendDot color="bg-blue-400/70" label="Underutilized" />
                <LegendDot color="bg-amber-400/70" label="Low" />
                <LegendDot color="bg-emerald-500" label="Balanced" />
                <LegendDot color="bg-destructive/70" label="High" />
                <LegendDot color="bg-destructive" label="Overloaded" />
              </div>
            </CardContent>
          </Card>

          {/* Demand vs Capacity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Demand vs capacity by department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={deptBarData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Demand" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="Capacity"
                    fill="var(--chart-2)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Required HC Waterfall */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">
              Required HC waterfall — drivers of adjusted workload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={waterfall}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" h" />
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {waterfall.map((w, i) => (
                    <Cell
                      key={i}
                      fill={
                        w.delta
                          ? "var(--chart-3)"
                          : i === waterfall.length - 1
                            ? "var(--primary)"
                            : "var(--chart-1)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-1 text-xs text-muted-foreground">
              Shows the contribution of each multiplier on top of the base
              workload — useful for identifying which adjustment drives the
              biggest HC requirement.
            </p>
          </CardContent>
        </Card>

        {/* AGGREGATION TABLE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Department × Role aggregation</span>
              <span className="text-xs font-normal text-muted-foreground">
                Click any row to drill into the Activity Directory
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">
                      Department
                    </th>
                    <th className="px-4 py-2 text-left font-medium">Role</th>
                    <th className="px-4 py-2 text-right font-medium">
                      Linked processes
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Activities
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Workload (h)
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Eff. capacity
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Required HC
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Current HC
                    </th>
                    <th className="px-4 py-2 text-right font-medium">Gap</th>
                    <th className="px-4 py-2 text-right font-medium">
                      Utilization
                    </th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregateRows.map((r) => (
                    <tr
                      key={`${r.deptId}-${r.role}`}
                      className="cursor-pointer border-t hover:bg-muted/30"
                      onClick={() => {
                        const target = workloadActivities.find((a) => a.departmentId === r.deptId && a.responsiblePosition === r.role);
                        if (target) {
                          router.push(`/workload-activity/activity-directory/${target.id}`);
                          return;
                        }
                        router.push(`/workload-activity/activity-directory?dept=${r.deptId}`);
                      }}
                    >
                      <td className="px-4 py-2 font-medium">{r.dept}</td>
                      <td className="px-4 py-2 text-muted-foreground">{r.role}</td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {r.linkedProcesses}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {r.activities}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {r.workloadHours.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {r.effectiveCapacity.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {r.requiredHc.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {r.currentHc}
                      </td>
                      <td
                        className={`px-4 py-2 text-right font-medium tabular-nums ${r.gap > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}
                      >
                        {r.gap > 0 ? `+${r.gap.toFixed(2)}` : r.gap.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-2 text-right font-semibold tabular-nums ${utilColor(r.utilization)}`}
                      >
                        {r.utilization}%
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className={utilColor(r.utilization)}>
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS BAR */}
        <Card className="mt-4 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-semibold">Push results downstream</p>
              <p className="text-xs text-muted-foreground">
                Workforce Planning will use {totals.requiredHc} required FTE.
                Management Dashboard will receive the utilization KPI.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  router.push("/workload-activity/activity-directory?status=Overloaded")
                }
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Open Overloaded
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  router.push("/workload-activity/activity-directory?status=Underutilized")
                }
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                Open Underutilized
              </Button>
              <Button asChild variant="outline">
                <Link href="/workload-activity/utilization-dashboard">
                  Utilization Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button onClick={() => setPlanningOpen(true)}>
                <Send className="mr-2 h-4 w-4" />
                Send to Workforce Planning
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* RECALCULATE */}
      <Dialog open={recalcOpen} onOpenChange={setRecalcOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recalculate the entire workload model</DialogTitle>
            <DialogDescription>
              Re-runs the full pipeline using the latest BPM activities, Org
              Structure roster, and the current global assumptions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 rounded-lg border bg-muted/20 p-3 text-xs">
            <PipelineRow
              step="Activity layer"
              detail={`${workloadActivities.length} activities`}
            />
            <PipelineRow
              step="Role layer"
              detail={`${aggregateRows.length} role groups`}
            />
            <PipelineRow
              step="Department layer"
              detail={`${workloadByDepartment.length} departments`}
            />
            <PipelineRow
              step="Organization layer"
              detail={`${totals.requiredHc} FTE required`}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecalcOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setRecalcOpen(false)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run recalculation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EXPORT */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export workload model</DialogTitle>
            <DialogDescription>
              {filteredActivities.length} activities · {aggregateRows.length}{" "}
              role groups · {totals.requiredHc} FTE required.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              CSV (.csv)
            </Button>
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              Excel (.xlsx)
            </Button>
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              PDF executive report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SEND TO WORKFORCE PLANNING */}
      <Dialog open={planningOpen} onOpenChange={setPlanningOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sent to Workforce Planning</DialogTitle>
            <DialogDescription>
              Required HC of{" "}
              <span className="font-medium">{totals.requiredHc} FTE</span> and a
              gap of{" "}
              <span className="font-medium">
                {totals.netGap > 0 ? "+" : ""}
                {totals.netGap}
              </span>{" "}
              have been pushed to the Workforce Planning module.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border bg-emerald-500/10 p-3 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              The audit log captured the submission at {new Date().toLocaleString()}.
            </span>
          </div>
          <DialogFooter>
            <Button asChild variant="outline">
              <Link href="/scenario/builder">Open Scenario Builder</Link>
            </Button>
            <Button onClick={() => setPlanningOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AiAssistant />
    </div>
  );
}

/* ---- helpers ---- */

function AssumptionInput({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  valueClass = "",
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-0.5 p-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {icon}
          <span className="text-[11px] uppercase tracking-wide">{label}</span>
        </div>
        <p className={`text-xl font-bold tabular-nums ${valueClass}`}>
          {value}
        </p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function PipelineStage({
  step,
  title,
  icon,
  value,
  detail,
  description,
}: {
  step: number;
  title: string;
  icon: React.ReactNode;
  value: string;
  detail: string;
  description: string;
}) {
  return (
    <div className="relative rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {step}
        </span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <p className="text-sm font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{detail}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/80">
        {description}
      </p>
      {/* arrow */}
      <ArrowDown className="absolute -right-1.5 top-1/2 hidden -translate-y-1/2 text-muted-foreground/50 lg:block" />
    </div>
  );
}

function PipelineRow({ step, detail }: { step: string; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{step}</span>
      <span className="font-mono font-semibold">{detail}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-3 w-3 rounded ${color}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
