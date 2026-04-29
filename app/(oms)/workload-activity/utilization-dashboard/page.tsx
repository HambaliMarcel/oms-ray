"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TopBar } from "@/components/oms/topbar";
import { AiAssistant } from "@/components/oms/ai-assistant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  unifiedWorkloadActivities as workloadActivities,
  unifiedWorkloadByDepartment as workloadByDepartment,
  unifiedWorkloadByRole as workloadByRole,
  unifiedDepartments as departments,
  unifiedEmployeesAll as employeesAll,
  unifiedWORKLOAD_CONSTANTS as WORKLOAD_CONSTANTS,
} from "@/lib/om-metrics";

// ---- helpers ----
function utilColor(u: number) {
  if (u > 110) return "text-destructive";
  if (u >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (u >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-blue-600 dark:text-blue-400";
}
function statusBadgeCls(u: number) {
  if (u > 110) return "bg-destructive/15 text-destructive border-destructive/30";
  if (u >= 90) return "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
  if (u >= 70) return "bg-amber-500/15 text-amber-600 border-amber-500/30";
  return "bg-blue-500/15 text-blue-600 border-blue-500/30";
}
function statusLabel(u: number) {
  if (u > 110) return "Overloaded";
  if (u >= 90) return "Balanced";
  if (u >= 70) return "Underutilized";
  return "Significantly Under";
}

const MONTHS = ["Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26"];

export default function UtilizationDashboardPage() {
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const router = useRouter();
  const goToActivity = (id: string) =>
    router.push(`/workload-activity/activity-directory/${id}`);

  const roles = useMemo(
    () => ["All", ...Array.from(new Set(workloadActivities.map((a) => a.role)))],
    [],
  );
  const deptNames = useMemo(() => ["All", ...departments.map((d) => d.name)], []);

  const filtered = useMemo(() => {
    return workloadActivities.filter((a) => {
      if (deptFilter !== "All" && a.department !== deptFilter) return false;
      if (roleFilter !== "All" && a.role !== roleFilter) return false;
      if (statusFilter === "Overloaded" && a.utilization <= 110) return false;
      if (statusFilter === "Balanced" && (a.utilization < 90 || a.utilization > 110)) return false;
      if (statusFilter === "Underutilized" && a.utilization >= 70) return false;
      return true;
    });
  }, [deptFilter, roleFilter, statusFilter]);

  const avgUtil = filtered.length
    ? Math.round(filtered.reduce((s, a) => s + a.utilization, 0) / filtered.length)
    : 0;
  const overloaded = filtered.filter((a) => a.utilization > 110).length;
  const balanced = filtered.filter((a) => a.utilization >= 90 && a.utilization <= 110).length;
  const underutil = filtered.filter((a) => a.utilization < 90).length;
  const totalDemand = Math.round(filtered.reduce((s, a) => s + a.adjustedWorkload, 0));
  const totalCapacity = Math.round(
    filtered.reduce((s, a) => s + a.assignedHc * Math.max(1, a.effectiveCapacityPerFte), 0),
  );

  // Chart 1: Util by Department
  const deptData = workloadByDepartment.map((d) => ({
    name: d.dept.length > 10 ? d.dept.slice(0, 10) + "…" : d.dept,
    fullName: d.dept,
    util: Math.round(
      (d.demand /
        Math.max(
          1,
          d.headcount * WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor,
        )) *
        100,
    ),
    demand: Math.round(d.demand),
    headcount: d.headcount,
  }));

  // Chart 2: Util by Role (top 10)
  const roleData = workloadByRole
    .map((r) => ({
      role: r.role.length > 18 ? r.role.slice(0, 18) + "…" : r.role,
      fullRole: r.role,
      util: Math.round(
        (r.demand /
          Math.max(
            1,
            r.assignedHc *
              WORKLOAD_CONSTANTS.monthlyHours *
              WORKLOAD_CONSTANTS.productivityFactor,
          )) *
          100,
      ),
      demand: Math.round(r.demand),
      hc: r.assignedHc,
    }))
    .sort((a, b) => b.util - a.util)
    .slice(0, 10);

  // Chart 3: Distribution donut
  const distribution = [
    {
      name: "Overloaded (>110%)",
      value: workloadActivities.filter((a) => a.utilization > 110).length,
      color: "var(--destructive)",
    },
    {
      name: "Balanced (90–110%)",
      value: workloadActivities.filter((a) => a.utilization >= 90 && a.utilization <= 110).length,
      color: "#22c55e",
    },
    {
      name: "Underutilized (70–89%)",
      value: workloadActivities.filter((a) => a.utilization >= 70 && a.utilization < 90).length,
      color: "#f59e0b",
    },
    {
      name: "Sig. Under (<70%)",
      value: workloadActivities.filter((a) => a.utilization < 70).length,
      color: "#60a5fa",
    },
  ];

  // Chart 4: 6-month trend
  const trendData = MONTHS.map((month, mi) => {
    const vals = filtered.map((a) => a.trend[mi]).filter(Boolean);
    const avg = vals.length
      ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
      : 0;
    return { month, utilization: avg };
  });

  // Chart 5: Demand vs Capacity by dept
  const demandCapData = workloadByDepartment.map((d) => ({
    dept: d.dept.length > 8 ? d.dept.slice(0, 8) + "…" : d.dept,
    demand: Math.round(d.demand),
    capacity: Math.round(
      d.headcount * WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor,
    ),
  }));

  // Chart 6: Radar — complexity breakdown by dept
  const radarData = departments.slice(0, 6).map((d) => {
    const acts = workloadActivities.filter((a) => a.department === d.name);
    const avgComplexity = acts.length
      ? acts.reduce((s, a) => s + a.complexityMultiplier, 0) / acts.length
      : 1;
    const avgRework = acts.length
      ? (acts.reduce((s, a) => s + a.reworkRate, 0) / acts.length) * 100
      : 0;
    return {
      dept: d.name.length > 8 ? d.name.slice(0, 8) + "…" : d.name,
      complexity: Math.round(avgComplexity * 100),
      rework: Math.round(avgRework * 10),
    };
  });

  // Employee load table
  const empLoad = useMemo(() => {
    return employeesAll
      .filter(
        (e) =>
          deptFilter === "All" ||
          e.dept === deptFilter ||
          departments.find((d) => d.id === e.deptId)?.name === deptFilter,
      )
      .map((e) => {
        const myActs = workloadActivities.filter((a) => a.assignedEmployees.includes(e.id));
        const totalDemandEmp = myActs.reduce((s, a) => s + a.adjustedWorkload, 0);
        const cap = Math.max(
          1,
          WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor,
        );
        const util = Math.round((totalDemandEmp / cap) * 100);
        return {
          ...e,
          assignedCount: myActs.length,
          totalDemand: Math.round(totalDemandEmp),
          util,
        };
      })
      .sort((a, b) => b.util - a.util)
      .slice(0, 20);
  }, [deptFilter]);

  const tooltipStyle = {
    fontSize: 11,
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          title="Utilization Dashboard"
          subtitle="Workload distribution across departments, roles, and employees"
          actions={
            <Button variant="outline" size="sm" className="gap-1.5">
              <BarChart2 className="h-4 w-4" /> Export
            </Button>
          }
        />

        <div className="flex flex-1 gap-0 overflow-hidden">
          {/* Main scroll area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Workload Planning</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-foreground">Utilization Dashboard</span>
            </nav>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {deptNames.map((d) => (
                    <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {["All", "Overloaded", "Balanced", "Underutilized"].map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(deptFilter !== "All" || roleFilter !== "All" || statusFilter !== "All") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground"
                  onClick={() => {
                    setDeptFilter("All");
                    setRoleFilter("All");
                    setStatusFilter("All");
                  }}
                >
                  Clear filters
                </Button>
              )}
              <span className="ml-auto text-xs text-muted-foreground">{filtered.length} activities</span>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {[
                { label: "Avg Utilization", value: `${avgUtil}%`, icon: <Activity className="h-4 w-4" />, color: utilColor(avgUtil) },
                { label: "Overloaded", value: overloaded, icon: <AlertTriangle className="h-4 w-4 text-destructive" />, color: "text-destructive" },
                { label: "Balanced", value: balanced, icon: <TrendingUp className="h-4 w-4 text-emerald-600" />, color: "text-emerald-600" },
                { label: "Underutilized", value: underutil, icon: <TrendingDown className="h-4 w-4 text-amber-600" />, color: "text-amber-600" },
                { label: "Total Demand", value: `${(totalDemand / 1000).toFixed(1)}k h`, icon: <BarChart2 className="h-4 w-4 text-primary" />, color: "text-primary" },
                { label: "Total Capacity", value: `${(totalCapacity / 1000).toFixed(1)}k h`, icon: <Users className="h-4 w-4 text-muted-foreground" />, color: "text-foreground" },
              ].map((k) => (
                <Card key={k.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{k.label}</span>
                      {k.icon}
                    </div>
                    <p className={`mt-1 text-2xl font-bold tabular-nums ${k.color}`}>{k.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts row 1: dept bar + distribution */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Utilization by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={deptData} barSize={22}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 140]} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number, _, props) => [`${v}% · ${props.payload.demand.toLocaleString()} h`, props.payload.fullName]} />
                      <Bar dataKey="util" radius={[4, 4, 0, 0]}>
                        {deptData.map((d, i) => (
                          <Cell key={i} fill={d.util > 110 ? "var(--destructive)" : d.util >= 90 ? "#22c55e" : d.util >= 70 ? "#f59e0b" : "#60a5fa"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={40} outerRadius={68} paddingAngle={2}>
                        {distribution.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-1 space-y-1">
                    {distribution.map((d) => (
                      <div key={d.name} className="flex items-center gap-2 text-xs">
                        <span className="h-2 w-2 flex-none rounded-full" style={{ background: d.color }} />
                        <span className="flex-1 truncate text-muted-foreground">{d.name}</span>
                        <span className="font-bold tabular-nums">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts row 2: trend + demand vs capacity */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">6-Month Utilization Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[60, 120]} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Avg Utilization"]} />
                      <Area type="monotone" dataKey="utilization" stroke="var(--primary)" strokeWidth={2} fill="url(#utilGrad)" dot={{ r: 4, fill: "var(--primary)" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Demand vs Capacity by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={demandCapData} barSize={14} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="dept" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [`${v.toLocaleString()} h`, name === "demand" ? "Adjusted Demand" : "Available Capacity"]} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="demand" name="Demand" fill="var(--primary)" radius={[3, 3, 0, 0]} opacity={0.85} />
                      <Bar dataKey="capacity" name="Capacity" fill="#22c55e" radius={[3, 3, 0, 0]} opacity={0.7} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts row 3: role bar + radar */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Top 10 Roles by Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={roleData} layout="vertical" barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                      <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 140]} />
                      <YAxis type="category" dataKey="role" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={140} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number, _, props) => [`${v}% · ${props.payload.hc} FTE · ${props.payload.demand.toLocaleString()} h`, props.payload.fullRole]} />
                      <Bar dataKey="util" radius={[0, 4, 4, 0]}>
                        {roleData.map((r, i) => (
                          <Cell key={i} fill={r.util > 110 ? "var(--destructive)" : r.util >= 90 ? "#22c55e" : "#f59e0b"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Complexity vs Rework by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="dept" tick={{ fontSize: 10 }} />
                      <Radar name="Complexity" dataKey="complexity" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
                      <Radar name="Rework" dataKey="rework" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Employee load table */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Employee Load — Top 20 by Utilization</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {deptFilter === "All" ? "All Departments" : deptFilter}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        {["Employee", "Department", "Activities", "Demand (h)", "Utilization", "Status", ""].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {empLoad.map((e) => (
                        <tr key={e.id} className="border-b transition-colors hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-xs font-semibold">{e.name}</p>
                              <p className="text-[11px] text-muted-foreground">{e.position}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{e.dept}</td>
                          <td className="px-4 py-3 text-xs tabular-nums font-medium text-primary">{e.assignedCount}</td>
                          <td className="px-4 py-3 text-xs tabular-nums">{e.totalDemand.toLocaleString()}</td>
                          <td className="w-48 px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Progress value={Math.min(100, e.util)} className="h-1.5 flex-1" />
                              <span className={`w-10 text-xs font-bold tabular-nums ${utilColor(e.util)}`}>{e.util}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={`text-[11px] ${statusBadgeCls(e.util)}`}>
                              {statusLabel(e.util)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => {
                                const act = workloadActivities.find((a) =>
                                  a.assignedEmployees.includes(e.id),
                                );
                                if (act) goToActivity(act.id);
                              }}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right alerts panel */}
          <div className="hidden w-72 border-l bg-card p-4 xl:flex xl:flex-col xl:gap-4 overflow-y-auto">
            <Tabs defaultValue="alerts">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
                <TabsTrigger value="top" className="text-xs">Top Activities</TabsTrigger>
              </TabsList>

              <TabsContent value="alerts" className="mt-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overloaded Activities</p>
                {workloadActivities
                  .filter((a) => a.utilization > 110)
                  .sort((a, b) => b.utilization - a.utilization)
                  .slice(0, 8)
                  .map((a) => (
                    <button
                      key={a.id}
                      onClick={() => goToActivity(a.id)}
                      className="w-full rounded-lg border bg-destructive/5 p-3 text-left transition-colors hover:bg-destructive/10"
                    >
                      <p className="truncate text-xs font-semibold">{a.name}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{a.department}</span>
                        <span className="text-xs font-bold text-destructive">{a.utilization}%</span>
                      </div>
                      <Progress value={Math.min(100, a.utilization)} className="mt-1.5 h-1" />
                    </button>
                  ))}
                {workloadActivities.filter((a) => a.utilization > 110).length === 0 && (
                  <p className="text-xs italic text-muted-foreground">No overloaded activities.</p>
                )}
              </TabsContent>

              <TabsContent value="top" className="mt-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Highest Workload</p>
                {[...workloadActivities]
                  .sort((a, b) => b.adjustedWorkload - a.adjustedWorkload)
                  .slice(0, 8)
                  .map((a) => (
                    <button
                      key={a.id}
                      onClick={() => goToActivity(a.id)}
                      className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/40"
                    >
                      <p className="truncate text-xs font-semibold">{a.name}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{a.role}</span>
                        <span className={`text-xs font-bold tabular-nums ${utilColor(a.utilization)}`}>
                          {a.adjustedWorkload.toFixed(0)} h
                        </span>
                      </div>
                    </button>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AiAssistant />
    </div>
  );
}


