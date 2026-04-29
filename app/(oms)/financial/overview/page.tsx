"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight, Download, GitCompare, Settings2, Sparkles, AlertTriangle,
  TrendingUp, TrendingDown, Users, Briefcase, DollarSign, Target,
  Filter, ArrowUpRight, Zap, Building2, Layers, Activity,
} from "lucide-react";
import {
  unifiedCostAnalysis as costAnalysis,
  unifiedCostMonthlyTrend as costMonthlyTrend,
  unifiedEmployeesAll as employeesAll,
  unifiedDepartments as departments,
  unifiedPositions as positions,
  unifiedScenarios as scenarios,
  unifiedWorkloadByDepartment as workloadByDepartment,
  unifiedProcesses as processes,
} from "@/lib/om-metrics";
import { formatRupiah } from "@/lib/currency";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar, ScatterChart, Scatter, ZAxis, AreaChart, Area,
} from "recharts";

const DONUT_COLORS = ["#5B8DEF", "#10B981", "#F59E0B", "#EC4899"];

// ============================================================
// COST ENGINE — derives full cost from employees + positions
// ============================================================
type EmpCost = {
  id: string; name: string; position: string; dept: string; deptId: string;
  level: string; grade: string; status: string; type: "Permanent" | "Contract";
  baseSalary: number; allowances: number; benefits: number; bonus: number;
  overtime: number; monthlyCost: number; annualCost: number;
  utilization: number; kpiScore: number; location: string;
};

// Deterministic helper
const seedHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

// Derive complete cost record per active employee
const deriveEmployeeCost = (e: any): EmpCost => {
  const seed = seedHash(e.id);
  const baseSalary  = e.salary;
  const allowances  = Math.round(baseSalary * 0.08);                    // 8%
  const benefits    = Math.round(baseSalary * 0.12);                    // 12%
  const bonus       = Math.round(baseSalary * (0.05 + (seed % 8) / 100));// 5–12%
  const overtime    = (seed % 3 === 0) ? Math.round(baseSalary * 0.06) : 0;
  const monthlyCost = baseSalary + allowances + benefits + bonus + overtime;
  // Permanent vs Contract — Junior/Specialist/Coordinator have ~25% contract mix
  const lvl = e.level;
  const type: "Permanent" | "Contract" =
    (lvl === "Junior" || lvl === "Specialist" || lvl === "Coordinator" || lvl === "Junior Staff" || lvl === "Staff")
      ? (seed % 4 === 0 ? "Contract" : "Permanent")
      : "Permanent";
  return {
    id: e.id, name: e.name, position: e.position, dept: e.dept, deptId: e.deptId,
    level: e.level, grade: e.grade, status: e.status, type,
    baseSalary, allowances, benefits, bonus, overtime,
    monthlyCost, annualCost: monthlyCost * 12,
    utilization: e.utilization ?? 80, kpiScore: e.kpiScore ?? 75,
    location: e.location ?? "Jakarta",
  };
};

// Derive vacant position cost (uses midpoint of salary band, applies loaded factor 1.25)
const deriveVacantPosCost = (p: any) => {
  const vacant = (p.planned ?? 0) - (p.filled ?? 0);
  if (vacant <= 0) return null;
  const midSalary  = ((p.salaryMin ?? 0) + (p.salaryMax ?? 0)) / 2;
  const loaded     = midSalary * 1.25; // benefits + allowances loaded
  return {
    id: p.id, title: p.title, dept: p.dept, deptId: p.deptId, level: p.level,
    grade: p.grade, vacant, midSalary, monthlyPerVacant: Math.round(loaded),
    monthlyTotal: Math.round(loaded * vacant), annualTotal: Math.round(loaded * vacant * 12),
  };
};

// ============================================================
export default function CostOverviewPage() {
  // ---- Global filter state ----
  const [period, setPeriod]    = useState<"Monthly" | "Quarterly" | "Yearly">("Monthly");
  const [org, setOrg]          = useState<string>("All");           // dept name or All
  const [roleLevel, setRoleLevel] = useState<string>("All");        // All / Executive / Manager / etc
  const [empType, setEmpType]  = useState<"All" | "Permanent" | "Contract">("All");
  const [scenarioId, setScenarioId] = useState<string>("S000");

  // ---- Cost configuration ----
  const [includeVacant, setIncludeVacant] = useState(true);
  const [includeContract, setIncludeContract] = useState(true);
  const [includeOvertime, setIncludeOvertime] = useState(true);
  const [compBase, setCompBase]   = useState(true);
  const [compAllow, setCompAllow] = useState(true);
  const [compBen, setCompBen]     = useState(true);
  const [compBon, setCompBon]     = useState(true);
  const [aggMode, setAggMode]     = useState<"Org" | "Role" | "Process">("Org");
  const [viewMode, setViewMode]   = useState<"Monthly" | "Annual">("Monthly");

  // ============================================================
  // CORE DATASET — built once from filters
  // ============================================================
  const empCosts = useMemo<EmpCost[]>(
    () => employeesAll
      .filter((e) => e.status === "Active")
      .map(deriveEmployeeCost),
    []
  );

  // Apply filters
  const filteredEmp = useMemo(() => {
    return empCosts.filter((e) => {
      if (org !== "All" && e.dept !== org) return false;
      if (roleLevel !== "All" && e.level !== roleLevel) return false;
      if (empType !== "All" && e.type !== empType) return false;
      if (!includeContract && e.type === "Contract") return false;
      // recompute monthlyCost based on selected components
      return true;
    });
  }, [empCosts, org, roleLevel, empType, includeContract]);

  // Recompute components-based monthly cost
  const recomputeMonthly = (e: EmpCost) => {
    let m = 0;
    if (compBase)  m += e.baseSalary;
    if (compAllow) m += e.allowances;
    if (compBen)   m += e.benefits;
    if (compBon)   m += e.bonus;
    if (includeOvertime) m += e.overtime;
    return m;
  };

  const empWithComputed = useMemo(
    () => filteredEmp.map((e) => ({ ...e, monthlyCost: recomputeMonthly(e), annualCost: recomputeMonthly(e) * 12 })),
    [filteredEmp, compBase, compAllow, compBen, compBon, includeOvertime]
  );

  // Vacant positions
  const vacantPositions = useMemo(() => {
    if (!includeVacant) return [];
    return positions
      .map(deriveVacantPosCost)
      .filter((v): v is NonNullable<ReturnType<typeof deriveVacantPosCost>> => !!v)
      .filter((v) => org === "All" || v.dept === org)
      .filter((v) => roleLevel === "All" || v.level === roleLevel);
  }, [includeVacant, org, roleLevel]);

  // ============================================================
  // CALCULATIONS
  // ============================================================
  const totalEmployeeCost = empWithComputed.reduce((s, e) => s + e.monthlyCost, 0);
  const totalVacantCost   = vacantPositions.reduce((s, v) => s + v.monthlyTotal, 0);
  const totalCost         = totalEmployeeCost + totalVacantCost;

  const activeEmpCount    = empWithComputed.length;
  const totalPositions    = positions.filter((p) => org === "All" || p.dept === org).reduce((s, p) => s + (p.planned ?? 0), 0);

  const costPerEmployee   = activeEmpCount > 0 ? Math.round(totalCost / activeEmpCount) : 0;
  const costPerPosition   = totalPositions > 0 ? Math.round(totalCost / totalPositions) : 0;

  // Cost per process — use processes' linked dept costs (proxy)
  const costPerProcess = useMemo(() => {
    return processes.map((p) => {
      const deptEmps = empWithComputed.filter((e) => e.dept === p.category);
      const sameCategoryCount = processes.filter((pp) => pp.category === p.category).length;
      const cost = deptEmps.reduce((s, e) => s + e.monthlyCost, 0) / Math.max(1, sameCategoryCount);
      return { id: p.id, name: p.name, dept: p.category, cost: Math.round(cost), efficiency: p.efficiency };
    });
  }, [empWithComputed]);

  // Cost growth — compare last two months from costMonthlyTrend
  const lastTrend = costMonthlyTrend[costMonthlyTrend.length - 1].total;
  const prevTrend = costMonthlyTrend[costMonthlyTrend.length - 2].total;
  const costGrowthPct = ((lastTrend - prevTrend) / prevTrend) * 100;

  // ============================================================
  // SCENARIO DELTA — applies factor to baseline
  // ============================================================
  const activeScenario = scenarios.find((s) => s.id === scenarioId)!;
  const baseScenario   = scenarios[0];
  const scenarioDelta  = activeScenario.cost - baseScenario.cost;
  const scenarioDeltaPct = (scenarioDelta / baseScenario.cost) * 100;

  // ============================================================
  // BREAKDOWNS — cost composition donut
  // ============================================================
  const compBreakdown = useMemo(() => {
    let salary = 0, allow = 0, ben = 0, bon = 0;
    empWithComputed.forEach((e) => {
      if (compBase)  salary += e.baseSalary;
      if (compAllow) allow  += e.allowances;
      if (compBen)   ben    += e.benefits;
      if (compBon)   bon    += e.bonus;
    });
    return [
      { name: "Salary",     value: salary, fill: DONUT_COLORS[0] },
      { name: "Allowances", value: allow,  fill: DONUT_COLORS[1] },
      { name: "Benefits",   value: ben,    fill: DONUT_COLORS[2] },
      { name: "Bonus",      value: bon,    fill: DONUT_COLORS[3] },
    ].filter((d) => d.value > 0);
  }, [empWithComputed, compBase, compAllow, compBen, compBon]);

  // ============================================================
  // COST BY DEPARTMENT — bar chart
  // ============================================================
  const costByDept = useMemo(() => {
    const map = new Map<string, { dept: string; cost: number; hc: number }>();
    empWithComputed.forEach((e) => {
      const cur = map.get(e.dept) ?? { dept: e.dept, cost: 0, hc: 0 };
      cur.cost += e.monthlyCost; cur.hc += 1;
      map.set(e.dept, cur);
    });
    return Array.from(map.values()).sort((a, b) => b.cost - a.cost);
  }, [empWithComputed]);

  // ============================================================
  // COST vs UTILIZATION — scatter
  // ============================================================
  const scatterData = useMemo(() => {
    return empWithComputed.map((e) => {
      const efficiency = e.utilization / Math.max(1, e.monthlyCost / 1000);
      let zone: "optimized" | "overcost" | "underutil" | "ok" = "ok";
      if (e.utilization < 70 && e.monthlyCost > 100000) zone = "overcost";
      else if (e.utilization > 90 && e.monthlyCost < 80000) zone = "optimized";
      else if (e.utilization < 65) zone = "underutil";
      return {
        x: Math.round(e.monthlyCost / 1000),
        y: e.utilization,
        z: 100,
        name: e.name,
        position: e.position,
        zone,
      };
    });
  }, [empWithComputed]);

  // ============================================================
  // OVERCOST DETECTION
  // ============================================================
  const overcostList = useMemo(() => {
    return empWithComputed
      .filter((e) => e.utilization < 70 && e.monthlyCost > costPerEmployee * 1.1)
      .sort((a, b) => b.monthlyCost - a.monthlyCost)
      .slice(0, 8);
  }, [empWithComputed, costPerEmployee]);

  // ============================================================
  // COST DENSITY HEATMAP — dept × level matrix
  // ============================================================
  const heatmap = useMemo(() => {
    const levels = ["Executive", "Director", "VP", "Manager", "Senior", "Staff", "Junior"];
    const deptList = Array.from(new Set(empWithComputed.map((e) => e.dept)));
    const cells: { dept: string; level: string; cost: number; count: number }[] = [];
    deptList.forEach((dept) => {
      levels.forEach((level) => {
        const employees = empWithComputed.filter((e) => e.dept === dept && (e.level === level || e.level?.includes(level)));
        const cost = employees.reduce((s, e) => s + e.monthlyCost, 0);
        cells.push({ dept, level, cost, count: employees.length });
      });
    });
    const maxCost = Math.max(1, ...cells.map((c) => c.cost));
    return { cells, deptList, levels, maxCost };
  }, [empWithComputed]);

  // ============================================================
  // AI INSIGHTS
  // ============================================================
  const topCostDepts = [...costByDept].sort((a, b) => b.cost - a.cost).slice(0, 3);
  const insights = [
    {
      type: "warning" as const,
      title: `${overcostList.length} underutilized expensive roles detected`,
      detail: `Top: ${overcostList.slice(0, 2).map((e) => e.name).join(", ")} — combined ${fmt(overcostList.reduce((s, e) => s + e.monthlyCost, 0))}/mo`,
    },
    {
      type: "info" as const,
      title: "Cost concentration risk",
      detail: `${topCostDepts[0]?.dept} accounts for ${((topCostDepts[0]?.cost / Math.max(1, totalCost)) * 100).toFixed(1)}% of total workforce cost`,
    },
    {
      type: "success" as const,
      title: "Optimization opportunity",
      detail: `Reassigning workload from underutilized roles could save ~${fmt(Math.round(overcostList.reduce((s, e) => s + e.monthlyCost, 0) * 0.3))}/mo`,
    },
    {
      type: "warning" as const,
      title: "Vacant position cost exposure",
      detail: `${vacantPositions.length} open positions = ${fmt(totalVacantCost)}/mo if filled at midpoint`,
    },
  ];

  // ============================================================
  // DETAIL TABLE — combine employees + tag status
  // ============================================================
  const detailTable = useMemo(() => {
    return empWithComputed.map((e) => {
      const efficiency = (e.utilization / Math.max(1, e.monthlyCost / 1000)).toFixed(2);
      let status: "Optimized" | "Overcost" | "Underutilized" = "Optimized";
      if (e.utilization < 70 && e.monthlyCost > costPerEmployee * 1.1) status = "Overcost";
      else if (e.utilization < 65) status = "Underutilized";
      return { ...e, efficiency, statusTag: status };
    });
  }, [empWithComputed, costPerEmployee]);

  const [tableStatus, setTableStatus] = useState<"All" | "Optimized" | "Overcost" | "Underutilized">("All");
  const [tableSearch, setTableSearch] = useState("");
  const tableRows = detailTable
    .filter((r) => tableStatus === "All" || r.statusTag === tableStatus)
    .filter((r) => !tableSearch || r.name.toLowerCase().includes(tableSearch.toLowerCase()) || r.position.toLowerCase().includes(tableSearch.toLowerCase()));

  // ---------------------------------------------------------------
  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F9FC]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E9F0] px-6 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-1">
              <Link href="/" className="hover:text-[#4F46E5]">OM+</Link>
              <ChevronRight className="w-3 h-3" />
              <span>Financial & Cost Management</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#111827] font-medium">Cost Overview</span>
            </div>
            <h1 className="text-xl font-semibold text-[#111827]">Workforce Cost Intelligence</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">Aggregation · Analytics · Insights · Comparisons</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] bg-white border border-[#E5E9F0] rounded-lg hover:bg-[#F9FAFB]">
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>
            <Link href="/scenario/comparison" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] bg-white border border-[#E5E9F0] rounded-lg hover:bg-[#F9FAFB]">
              <GitCompare className="w-3.5 h-3.5" /> Compare Scenario
            </Link>
            <Link href="/scenario/builder" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-[#2563EB]">
              <Sparkles className="w-3.5 h-3.5" /> Open Scenario Builder
            </Link>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-[#E5E9F0] px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-[#6B7280]" />
          <FilterSelect label="Period" value={period} onChange={setPeriod as any} options={["Monthly", "Quarterly", "Yearly"]} />
          <FilterSelect label="Organization" value={org} onChange={setOrg} options={["All", ...departments.map((d) => d.name)]} />
          <FilterSelect label="Level" value={roleLevel} onChange={setRoleLevel} options={["All", "Executive", "Director", "VP", "Manager", "Senior", "Staff", "Junior", "Specialist"]} />
          <FilterSelect label="Type" value={empType} onChange={setEmpType as any} options={["All", "Permanent", "Contract"]} />
          <FilterSelect label="Scenario" value={scenarioId} onChange={setScenarioId} options={scenarios.map((s) => s.id)} render={(id) => scenarios.find((s) => s.id === id)?.name ?? id} />
          <div className="ml-auto flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-0.5">
            {(["Monthly", "Annual"] as const).map((m) => (
              <button key={m} onClick={() => setViewMode(m)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === m ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280]"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 12-column grid */}
      <div className="px-6 py-5 grid grid-cols-12 gap-5">

        {/* LEFT — Cost Configuration (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <SectionCard title="Cost Configuration" icon={<Settings2 className="w-4 h-4" />}>
            <div className="space-y-3">
              <ToggleRow label="Include Vacant Positions" value={includeVacant} onChange={setIncludeVacant} />
              <ToggleRow label="Include Contract Workers" value={includeContract} onChange={setIncludeContract} />
              <ToggleRow label="Include Overtime Cost" value={includeOvertime} onChange={setIncludeOvertime} />
            </div>
          </SectionCard>

          <SectionCard title="Cost Components">
            <div className="space-y-2.5">
              <CheckRow label="Base Salary" value={compBase} onChange={setCompBase} />
              <CheckRow label="Allowances" value={compAllow} onChange={setCompAllow} />
              <CheckRow label="Benefits" value={compBen} onChange={setCompBen} />
              <CheckRow label="Bonus" value={compBon} onChange={setCompBon} />
            </div>
          </SectionCard>

          <SectionCard title="Aggregation Mode">
            <div className="grid grid-cols-3 gap-1.5">
              {(["Org", "Role", "Process"] as const).map((m) => (
                <button key={m} onClick={() => setAggMode(m)}
                  className={`px-2 py-2 text-[11px] font-medium rounded-lg border transition-all ${
                    aggMode === m
                      ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                      : "bg-white text-[#6B7280] border-[#E5E9F0] hover:border-[#3B82F6] hover:text-[#3B82F6]"
                  }`}>
                  By {m}
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Cost by Department mini list */}
          <SectionCard title={`Top Cost ${aggMode === "Org" ? "Departments" : aggMode === "Role" ? "Roles" : "Processes"}`}>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {(aggMode === "Org" ? costByDept :
                aggMode === "Role" ?
                  Object.entries(empWithComputed.reduce((acc: Record<string, { dept: string; cost: number; hc: number }>, e) => {
                    const k = e.position;
                    if (!acc[k]) acc[k] = { dept: k, cost: 0, hc: 0 };
                    acc[k].cost += e.monthlyCost; acc[k].hc += 1;
                    return acc;
                  }, {})).map(([_, v]) => v).sort((a, b) => b.cost - a.cost) :
                  costPerProcess.map((p) => ({ dept: p.name, cost: p.cost, hc: 0 }))
              ).slice(0, 8).map((row, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="text-[#111827] font-medium truncate">{row.dept}</div>
                    <div className="text-[10px] text-[#6B7280]">{row.hc > 0 ? `${row.hc} HC` : ""}</div>
                  </div>
                  <span className="text-[#111827] font-semibold tabular-nums">{fmt(row.cost)}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* CENTER — Calculation Engine (6 cols) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          {/* 5 KPI calc cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <CalcCard label="Total Workforce Cost" value={fmt(viewMode === "Annual" ? totalCost * 12 : totalCost)}
              sublabel={`${activeEmpCount} active + ${vacantPositions.length} vacant`}
              icon={<DollarSign className="w-4 h-4" />} accent="#3B82F6" />
            <CalcCard label="Cost per Employee" value={fmt(viewMode === "Annual" ? costPerEmployee * 12 : costPerEmployee)}
              sublabel={`${activeEmpCount} active employees`}
              icon={<Users className="w-4 h-4" />} accent="#10B981" />
            <CalcCard label="Cost per Position" value={fmt(viewMode === "Annual" ? costPerPosition * 12 : costPerPosition)}
              sublabel={`${totalPositions} planned positions`}
              icon={<Briefcase className="w-4 h-4" />} accent="#F59E0B" />
            <CalcCard label="Cost per Activity" value={fmt(Math.round(totalCost / Math.max(1, workloadByDepartment.reduce((s, w) => s + w.activities, 0))))}
              sublabel={`${workloadByDepartment.reduce((s, w) => s + w.activities, 0)} activities`}
              icon={<Activity className="w-4 h-4" />} accent="#EC4899" />
            <CalcCard label="Cost per Process" value={fmt(Math.round(costPerProcess.reduce((s, p) => s + p.cost, 0) / Math.max(1, costPerProcess.length)))}
              sublabel={`${processes.length} business processes`}
              icon={<Layers className="w-4 h-4" />} accent="#8B5CF6" />
            <CalcCard label="Cost Growth" value={`${costGrowthPct >= 0 ? "+" : ""}${costGrowthPct.toFixed(1)}%`}
              sublabel="vs last month"
              icon={costGrowthPct >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              accent={costGrowthPct >= 5 ? "#EF4444" : "#10B981"} />
          </div>

          {/* Cost Trend (Area) */}
          <SectionCard title="Cost Trend Analysis" subtitle="Monthly historical + 3-month forecast" icon={<TrendingUp className="w-4 h-4" />}>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  ...costMonthlyTrend,
                  { month: "May 26", salary: costMonthlyTrend[5].salary * 1.012, benefits: costMonthlyTrend[5].benefits * 1.012, bonus: costMonthlyTrend[5].bonus * 1.012, total: costMonthlyTrend[5].total * 1.012, forecast: true },
                  { month: "Jun 26", salary: costMonthlyTrend[5].salary * 1.024, benefits: costMonthlyTrend[5].benefits * 1.024, bonus: costMonthlyTrend[5].bonus * 1.024, total: costMonthlyTrend[5].total * 1.024, forecast: true },
                  { month: "Jul 26", salary: costMonthlyTrend[5].salary * 1.036, benefits: costMonthlyTrend[5].benefits * 1.036, bonus: costMonthlyTrend[5].bonus * 1.036, total: costMonthlyTrend[5].total * 1.036, forecast: true },
                ]}>
                  <defs>
                    <linearGradient id="costArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, border: "1px solid #E5E9F0", fontSize: 12 }} />
                  <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} fill="url(#costArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Cost vs Utilization Scatter */}
          <SectionCard title="Cost vs Utilization Analysis" subtitle="Identify optimized, overcost, and underutilized roles" icon={<Target className="w-4 h-4" />}>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
                  <XAxis type="number" dataKey="x" name="Cost" tick={{ fontSize: 11, fill: "#6B7280" }}
                    label={{ value: "Monthly Cost (k IDR)", position: "insideBottom", offset: -10, fontSize: 11, fill: "#6B7280" }} />
                  <YAxis type="number" dataKey="y" name="Utilization" domain={[0, 110]} tick={{ fontSize: 11, fill: "#6B7280" }}
                    label={{ value: "Utilization %", angle: -90, position: "insideLeft", fontSize: 11, fill: "#6B7280" }} />
                  <ZAxis type="number" dataKey="z" range={[40, 80]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: 8, border: "1px solid #E5E9F0", fontSize: 12 }}
                    formatter={(value: any, name: any) => name === "Cost" ? `${value}k` : `${value}%`}
                    labelFormatter={() => ""} />
                  <Scatter data={scatterData.filter((d) => d.zone === "optimized")} fill="#10B981" name="Optimized" />
                  <Scatter data={scatterData.filter((d) => d.zone === "overcost")} fill="#EF4444" name="Overcost" />
                  <Scatter data={scatterData.filter((d) => d.zone === "underutil")} fill="#F59E0B" name="Underutilized" />
                  <Scatter data={scatterData.filter((d) => d.zone === "ok")} fill="#94A3B8" name="Standard" />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Cost Density Heatmap */}
          <SectionCard title="Cost Density Heatmap" subtitle="Department × Role Level concentration" icon={<Zap className="w-4 h-4" />}>
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid gap-px" style={{ gridTemplateColumns: `120px repeat(${heatmap.levels.length}, 1fr)` }}>
                  <div></div>
                  {heatmap.levels.map((l) => (
                    <div key={l} className="text-[10px] text-[#6B7280] font-medium text-center px-1 py-1.5">{l}</div>
                  ))}
                  {heatmap.deptList.flatMap((d) => [
                    <div key={`row-${d}`} className="text-[10px] text-[#374151] font-medium pr-2 py-2 truncate">{d}</div>,
                    ...heatmap.levels.map((l) => {
                      const cell = heatmap.cells.find((c) => c.dept === d && c.level === l);
                      const intensity = cell ? cell.cost / heatmap.maxCost : 0;
                      const bg = `rgba(59, 130, 246, ${0.05 + intensity * 0.85})`;
                      return (
                        <div key={`${d}-${l}`} className="text-[10px] text-center py-2 rounded font-semibold tabular-nums"
                          style={{ background: bg, color: intensity > 0.5 ? "#fff" : "#374151" }}
                          title={`${d} · ${l}: ${cell?.count ?? 0} HC · ${fmt(cell?.cost ?? 0)}`}>
                          {cell && cell.cost > 0 ? `${(cell.cost / 1000).toFixed(0)}k` : "—"}
                        </div>
                      );
                    }),
                  ])}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Overcost Detection */}
          <SectionCard title="Overcost Detection Engine" subtitle="High cost + Low utilization roles" icon={<AlertTriangle className="w-4 h-4 text-[#F59E0B]" />}>
            <div className="space-y-2">
              {overcostList.length === 0 ? (
                <div className="text-xs text-[#6B7280] text-center py-4">No overcost roles detected at current filters</div>
              ) : overcostList.map((e, i) => (
                <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FEF3C7] border border-[#FCD34D]">
                  <div className="w-7 h-7 rounded-full bg-[#F59E0B] text-white text-[11px] font-semibold flex items-center justify-center">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#111827] truncate">{e.name} · {e.position}</div>
                    <div className="text-[11px] text-[#6B7280]">{e.dept} · Util {e.utilization}% · Cost {fmt(e.monthlyCost)}/mo</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#92400E] bg-[#FFFBEB] px-2 py-1 rounded">OVERCOST</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* RIGHT — Output Panel (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">

          {/* Top KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <SmallKpi label="Total Cost" value={fmt(viewMode === "Annual" ? totalCost * 12 : totalCost)} delta={`${costGrowthPct >= 0 ? "+" : ""}${costGrowthPct.toFixed(1)}%`} positive={costGrowthPct < 5} />
            <SmallKpi label="Avg / Employee" value={fmt(viewMode === "Annual" ? costPerEmployee * 12 : costPerEmployee)} delta={`${activeEmpCount} HC`} positive />
            <SmallKpi label="Avg / Position" value={fmt(viewMode === "Annual" ? costPerPosition * 12 : costPerPosition)} delta={`${totalPositions} positions`} positive />
            <SmallKpi label="Cost Growth" value={`${costGrowthPct.toFixed(1)}%`} delta="month over month" positive={costGrowthPct < 5} />
          </div>

          {/* Scenario Compare */}
          <SectionCard title="Scenario Impact" icon={<GitCompare className="w-4 h-4" />}>
            <div className="space-y-3">
              <div className="text-[11px] text-[#6B7280]">Active: <span className="font-semibold text-[#111827]">{activeScenario.name}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F9FAFB] rounded-lg p-3">
                  <div className="text-[10px] text-[#6B7280] uppercase tracking-wide">Baseline</div>
                  <div className="text-sm font-semibold text-[#111827] mt-1 tabular-nums">{fmt(baseScenario.cost)}</div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">{baseScenario.hc} HC</div>
                </div>
                <div className="bg-[#EFF6FF] rounded-lg p-3 border border-[#3B82F6]/20">
                  <div className="text-[10px] text-[#3B82F6] uppercase tracking-wide font-semibold">Scenario</div>
                  <div className="text-sm font-semibold text-[#111827] mt-1 tabular-nums">{fmt(activeScenario.cost)}</div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">{activeScenario.hc} HC</div>
                </div>
              </div>
              <div className={`flex items-center justify-between rounded-lg p-2.5 ${scenarioDelta >= 0 ? "bg-[#FEF2F2]" : "bg-[#F0FDF4]"}`}>
                <div className="text-[11px] text-[#374151]">
                  <span className="font-semibold">Delta:</span> {fmt(Math.abs(scenarioDelta))} ({scenarioDelta >= 0 ? "+" : ""}{scenarioDeltaPct.toFixed(1)}%)
                </div>
                {scenarioDelta >= 0 ? <TrendingUp className="w-4 h-4 text-[#EF4444]" /> : <TrendingDown className="w-4 h-4 text-[#10B981]" />}
              </div>
              {/* Before/After bars */}
              <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ name: "Baseline", cost: baseScenario.cost }, { name: "Scenario", cost: activeScenario.cost }]} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, border: "1px solid #E5E9F0", fontSize: 11 }} />
                    <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                      <Cell fill="#94A3B8" />
                      <Cell fill="#3B82F6" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>

          {/* Cost Composition Donut */}
          <SectionCard title="Cost Composition" subtitle="Salary / Allowances / Benefits / Bonus">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={compBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {compBreakdown.map((c, i) => <Cell key={i} fill={c.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, border: "1px solid #E5E9F0", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 mt-2">
              {compBreakdown.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.fill }} />
                    <span className="text-[#374151]">{c.name}</span>
                  </div>
                  <span className="text-[#111827] font-semibold tabular-nums">{((c.value / Math.max(1, compBreakdown.reduce((s, x) => s + x.value, 0))) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* AI Insights */}
          <SectionCard title="AI Insights" icon={<Sparkles className="w-4 h-4 text-[#8B5CF6]" />}>
            <div className="space-y-2">
              {insights.map((ins, i) => (
                <div key={i} className={`p-2.5 rounded-lg border text-[11px] ${
                  ins.type === "warning" ? "bg-[#FEF3C7] border-[#FCD34D]" :
                  ins.type === "info" ? "bg-[#DBEAFE] border-[#93C5FD]" :
                  "bg-[#D1FAE5] border-[#6EE7B7]"
                }`}>
                  <div className="font-semibold text-[#111827] mb-0.5">{ins.title}</div>
                  <div className="text-[#374151] leading-snug">{ins.detail}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Visualization Section: Bar (Cost by Dept) */}
      <div className="px-6 pb-5">
        <SectionCard title="Cost by Department" subtitle={`Headcount aggregation · ${aggMode} mode`} icon={<Building2 className="w-4 h-4" />}>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByDept}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={50} />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, border: "1px solid #E5E9F0", fontSize: 12 }} />
                <Bar dataKey="cost" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Detail Table */}
      <div className="px-6 pb-8">
        <div className="bg-white rounded-xl border border-[#E5E9F0] shadow-sm">
          <div className="p-4 border-b border-[#E5E9F0] flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">Workforce Cost Detail</h3>
              <p className="text-[11px] text-[#6B7280] mt-0.5">{tableRows.length} of {detailTable.length} employees · click row to drilldown</p>
            </div>
            <div className="flex items-center gap-2">
              <input value={tableSearch} onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search employee or position..."
                className="px-3 py-1.5 text-xs border border-[#E5E9F0] rounded-lg w-56 focus:outline-none focus:border-[#3B82F6]" />
              <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-0.5">
                {(["All", "Optimized", "Overcost", "Underutilized"] as const).map((s) => (
                  <button key={s} onClick={() => setTableStatus(s)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${tableStatus === s ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280]"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] tracking-wide">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium">Employee</th>
                  <th className="text-left px-4 py-2.5 font-medium">Position</th>
                  <th className="text-left px-4 py-2.5 font-medium">Department</th>
                  <th className="text-left px-4 py-2.5 font-medium">Type</th>
                  <th className="text-right px-4 py-2.5 font-medium">Monthly Cost</th>
                  <th className="text-right px-4 py-2.5 font-medium">Annual Cost</th>
                  <th className="text-right px-4 py-2.5 font-medium">Util %</th>
                  <th className="text-right px-4 py-2.5 font-medium">Efficiency</th>
                  <th className="text-center px-4 py-2.5 font-medium">Status</th>
                  <th className="text-center px-4 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {tableRows.slice(0, 120).map((r) => (
                  <tr key={r.id} className="hover:bg-[#F9FAFB] cursor-pointer group" title={`Salary ${fmt(r.baseSalary)} · Allow ${fmt(r.allowances)} · Ben ${fmt(r.benefits)} · Bon ${fmt(r.bonus)} · OT ${fmt(r.overtime)}`}>
                    <td className="px-4 py-2.5">
                      <Link href={`/organization/employees/${r.id}`} className="font-medium text-[#111827] hover:text-[#3B82F6]">{r.name}</Link>
                    </td>
                    <td className="px-4 py-2.5 text-[#374151]">{r.position}</td>
                    <td className="px-4 py-2.5 text-[#6B7280]">{r.dept}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        r.type === "Permanent" ? "bg-[#DBEAFE] text-[#1E40AF]" : "bg-[#FED7AA] text-[#9A3412]"
                      }`}>{r.type}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-[#111827]">{fmt(r.monthlyCost)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-[#374151]">{fmt(r.annualCost)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      <span className={`font-semibold ${r.utilization >= 90 ? "text-[#EF4444]" : r.utilization >= 75 ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
                        {r.utilization}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-[#374151]">{r.efficiency}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        r.statusTag === "Optimized" ? "bg-[#D1FAE5] text-[#065F46]" :
                        r.statusTag === "Overcost" ? "bg-[#FEE2E2] text-[#991B1B]" :
                        "bg-[#FEF3C7] text-[#92400E]"
                      }`}>{r.statusTag}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#3B82F6]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tableRows.length > 120 && (
            <div className="p-3 border-t border-[#E5E9F0] text-center text-[11px] text-[#6B7280]">
              Showing first 120 of {tableRows.length} matching rows · refine filters to narrow
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================
const fmt = (n: number) => {
  return formatRupiah(n);
};

function SectionCard({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E9F0] shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className="text-[#6B7280]">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-[#111827]">{title}</h3>
          {subtitle && <p className="text-[10px] text-[#6B7280] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function CalcCard({ label, value, sublabel, icon, accent }: { label: string; value: string; sublabel: string; icon: React.ReactNode; accent: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E9F0] shadow-sm p-3.5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-wide text-[#6B7280] font-medium">{label}</span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: accent }}>{icon}</div>
      </div>
      <div className="text-lg font-bold text-[#111827] tabular-nums leading-tight">{value}</div>
      <div className="text-[10px] text-[#6B7280] mt-1">{sublabel}</div>
    </div>
  );
}

function SmallKpi({ label, value, delta, positive }: { label: string; value: string; delta: string; positive: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E9F0] shadow-sm p-3">
      <div className="text-[10px] uppercase tracking-wide text-[#6B7280] font-medium">{label}</div>
      <div className="text-base font-bold text-[#111827] tabular-nums mt-1">{value}</div>
      <div className={`text-[10px] mt-0.5 ${positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>{delta}</div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-[#374151]">{label}</span>
      <button onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full p-0.5 transition-all flex items-center ${value ? "bg-[#3B82F6] justify-end" : "bg-[#E5E7EB] justify-start"}`}>
        <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
      </button>
    </div>
  );
}

function CheckRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)}
        className="w-3.5 h-3.5 rounded border-[#E5E9F0] text-[#3B82F6]" />
      <span className="text-xs text-[#374151]">{label}</span>
    </label>
  );
}

function FilterSelect({ label, value, onChange, options, render }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; render?: (v: string) => string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-[#6B7280] font-medium">{label}:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="text-xs px-2 py-1 border border-[#E5E9F0] rounded-md bg-white text-[#111827] focus:outline-none focus:border-[#3B82F6] min-w-[100px]">
        {options.map((o) => <option key={o} value={o}>{render ? render(o) : o}</option>)}
      </select>
    </div>
  );
}
