"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight, ChevronDown, Building2, Briefcase, User, Search,
  Download, Filter, X, ArrowUpRight, DollarSign, Percent,
} from "lucide-react";
import {
  unifiedEmployeesAll as employeesAll, unifiedDepartments as departments, unifiedPositions as positions, unifiedScenarios as scenarios,
} from "@/lib/om-metrics";
import { formatRupiah } from "@/lib/currency";

// Format helper
const fmt = (n: number) => {
  return formatRupiah(n);
};

// Deterministic seed
const seedHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

// Derive employee cost details
const getEmpCost = (e: any) => {
  const seed = seedHash(e.id);
  const baseSalary = e.salary;
  const allowances = Math.round(baseSalary * 0.08);
  const benefits   = Math.round(baseSalary * 0.12);
  const bonus      = Math.round(baseSalary * (0.05 + (seed % 8) / 100));
  const overtime   = (seed % 3 === 0) ? Math.round(baseSalary * 0.06) : 0;
  const total = baseSalary + allowances + benefits + bonus + overtime;
  return { baseSalary, allowances, benefits, bonus, overtime, total };
};

// ============================================================
export default function CostBreakdownPage() {
  const [view, setView] = useState<"Org" | "Position" | "Employee">("Org");
  const [orgFilter, setOrgFilter] = useState<string>("All");
  const [positionFilter, setPositionFilter] = useState<string>("All");
  const [scenarioId, setScenarioId] = useState<string>("S000");
  const [search, setSearch] = useState("");
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(departments.slice(0, 3).map((d) => d.id)));
  const [drillNode, setDrillNode] = useState<{ type: string; id: string; data: any } | null>(null);

  // Active employees enriched
  const empData = useMemo(() => employeesAll
    .filter((e) => e.status === "Active")
    .map((e) => ({ ...e, ...getEmpCost(e) })), []);

  // Apply org filter
  const filteredEmp = empData.filter((e) => orgFilter === "All" || e.dept === orgFilter);

  // ============================================================
  // ORG VIEW DATA
  // ============================================================
  const orgTree = useMemo(() => {
    return departments.map((d) => {
      const emps = empData.filter((e) => e.deptId === d.id);
      const totalCost = emps.reduce((s, e) => s + e.total, 0);
      const hc = emps.length;
      const avg = hc > 0 ? Math.round(totalCost / hc) : 0;

      // Sub-units = group employees by level within dept
      const levels = Array.from(new Set(emps.map((e) => e.level)));
      const subUnits = levels.map((lvl) => {
        const subEmps = emps.filter((e) => e.level === lvl);
        const subCost = subEmps.reduce((s, e) => s + e.total, 0);
        return {
          name: lvl,
          hc: subEmps.length,
          cost: subCost,
          avg: subEmps.length > 0 ? Math.round(subCost / subEmps.length) : 0,
        };
      }).sort((a, b) => b.cost - a.cost);

      return { ...d, totalCost, hc, avg, subUnits };
    }).sort((a, b) => b.totalCost - a.totalCost);
  }, [empData]);

  const totalOrgCost = orgTree.reduce((s, d) => s + d.totalCost, 0);
  const totalOrgHc   = orgTree.reduce((s, d) => s + d.hc, 0);

  // ============================================================
  // POSITION VIEW DATA
  // ============================================================
  const positionRows = useMemo(() => {
    return positions
      .filter((p) => orgFilter === "All" || p.dept === orgFilter)
      .filter((p) => positionFilter === "All" || p.title === positionFilter)
      .map((p) => {
        const filledEmps = empData.filter((e) => e.position?.includes(p.title) && e.dept === p.dept);
        const actualCost = filledEmps.reduce((s, e) => s + e.total, 0);
        const midSal = ((p.salaryMin ?? 0) + (p.salaryMax ?? 0)) / 2;
        const plannedCost = Math.round(midSal * 1.25 * (p.planned ?? 0));
        const vacant = (p.planned ?? 0) - (p.filled ?? 0);
        const gap = plannedCost - actualCost;
        return {
          id: p.id, title: p.title, dept: p.dept, deptId: p.deptId, grade: p.grade, level: p.level,
          filled: p.filled ?? 0, planned: p.planned ?? 0, vacant,
          plannedCost, actualCost, gap,
          vacancyStatus: vacant === 0 ? "Filled" : vacant > (p.planned ?? 0) / 2 ? "Critical" : "Open",
          salaryMin: p.salaryMin, salaryMax: p.salaryMax,
        };
      })
      .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()));
  }, [orgFilter, positionFilter, search, empData]);

  // ============================================================
  // EMPLOYEE VIEW DATA
  // ============================================================
  const employeeRows = useMemo(() => {
    return filteredEmp
      .filter((e) => positionFilter === "All" || e.position?.includes(positionFilter))
      .filter((e) => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.position.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.total - a.total);
  }, [filteredEmp, positionFilter, search]);

  // ============================================================
  const toggleDept = (id: string) => {
    setExpandedDepts((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const expandAll = () => setExpandedDepts(new Set(departments.map((d) => d.id)));
  const collapseAll = () => setExpandedDepts(new Set());

  // ============================================================
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
              <span className="text-[#111827] font-medium">Cost Breakdown</span>
            </div>
            <h1 className="text-xl font-semibold text-[#111827]">Cost Breakdown</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">Granular exploration of cost across organization, positions, and employees</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] bg-white border border-[#E5E9F0] rounded-lg hover:bg-[#F9FAFB]">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <Link href="/financial/overview" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-[#2563EB]">
              <DollarSign className="w-3.5 h-3.5" /> Cost Overview
            </Link>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-[#E5E9F0] px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-[#6B7280]" />
          <FilterSelect label="Organization" value={orgFilter} onChange={setOrgFilter} options={["All", ...departments.map((d) => d.name)]} />
          <FilterSelect label="Position" value={positionFilter} onChange={setPositionFilter} options={["All", ...Array.from(new Set(positions.map((p) => p.title)))]} />
          <FilterSelect label="Scenario" value={scenarioId} onChange={setScenarioId} options={scenarios.map((s) => s.id)} render={(id) => scenarios.find((s) => s.id === id)?.name ?? id} />
          {(view === "Position" || view === "Employee") && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="text-xs pl-7 pr-3 py-1 border border-[#E5E9F0] rounded-md bg-white focus:outline-none focus:border-[#3B82F6] w-44" />
            </div>
          )}
          <div className="ml-auto flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-0.5">
            {(["Org", "Position", "Employee"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${view === v ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280]"}`}>
                {v === "Org" && <Building2 className="w-3 h-3" />}
                {v === "Position" && <Briefcase className="w-3 h-3" />}
                {v === "Employee" && <User className="w-3 h-3" />}
                {v} View
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="px-6 pt-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Total Workforce Cost" value={fmt(totalOrgCost)} sublabel={`${totalOrgHc} active employees`} icon={<DollarSign className="w-4 h-4" />} accent="#3B82F6" />
          <KpiCard label="Departments" value={`${orgTree.length}`} sublabel="organizational units" icon={<Building2 className="w-4 h-4" />} accent="#10B981" />
          <KpiCard label="Total Positions" value={`${positions.reduce((s, p) => s + (p.planned ?? 0), 0)}`} sublabel={`${positions.reduce((s, p) => s + (p.filled ?? 0), 0)} filled`} icon={<Briefcase className="w-4 h-4" />} accent="#F59E0B" />
          <KpiCard label="Avg Cost / Employee" value={fmt(totalOrgHc > 0 ? Math.round(totalOrgCost / totalOrgHc) : 0)} sublabel="loaded monthly" icon={<Percent className="w-4 h-4" />} accent="#8B5CF6" />
        </div>
      </div>

      {/* Main content area */}
      <div className="px-6 py-5">
        <div className="grid grid-cols-12 gap-5">
          {/* Main view */}
          <div className={drillNode ? "col-span-12 lg:col-span-8" : "col-span-12"}>

            {/* ORG VIEW */}
            {view === "Org" && (
              <div className="bg-white rounded-xl border border-[#E5E9F0] shadow-sm">
                <div className="p-4 border-b border-[#E5E9F0] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827]">Organization Tree</h3>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Company → Division → Department · click to drilldown</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={expandAll} className="text-[11px] text-[#3B82F6] font-medium hover:underline">Expand All</button>
                    <span className="text-[#E5E9F0]">·</span>
                    <button onClick={collapseAll} className="text-[11px] text-[#3B82F6] font-medium hover:underline">Collapse All</button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Company root */}
                  <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#3B82F6] bg-gradient-to-r from-[#EFF6FF] to-white mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-[#111827]">PT Global Corp Indonesia</div>
                      <div className="text-[11px] text-[#6B7280]">{orgTree.length} departments · {totalOrgHc} HC</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-[#111827] tabular-nums">{fmt(totalOrgCost)}</div>
                      <div className="text-[10px] text-[#6B7280]">monthly · {fmt(totalOrgCost * 12)} annual</div>
                    </div>
                  </div>

                  {/* Departments */}
                  <div className="space-y-1.5 ml-6 border-l-2 border-[#E5E9F0] pl-4">
                    {orgTree.map((d) => {
                      const isExpanded = expandedDepts.has(d.id);
                      const pctOfTotal = (d.totalCost / Math.max(1, totalOrgCost)) * 100;
                      return (
                        <div key={d.id}>
                          <div onClick={() => setDrillNode({ type: "Department", id: d.id, data: d })}
                            className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E9F0] hover:border-[#3B82F6] hover:bg-[#F9FAFB] cursor-pointer transition-all">
                            <button onClick={(e) => { e.stopPropagation(); toggleDept(d.id); }}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F3F4F6]">
                              {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />}
                            </button>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: d.color }}>
                              {d.code}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-[#111827]">{d.name}</div>
                              <div className="text-[10px] text-[#6B7280]">{d.hc} HC · {d.subUnits.length} sub-units · {d.location}</div>
                            </div>
                            <div className="hidden md:flex items-center gap-6 text-xs">
                              <div className="text-right">
                                <div className="text-[9px] uppercase text-[#6B7280] tracking-wide">Avg/Emp</div>
                                <div className="font-semibold text-[#111827] tabular-nums">{fmt(d.avg)}</div>
                              </div>
                              <div className="text-right w-20">
                                <div className="text-[9px] uppercase text-[#6B7280] tracking-wide">Total</div>
                                <div className="font-semibold text-[#111827] tabular-nums">{fmt(d.totalCost)}</div>
                              </div>
                              <div className="w-24">
                                <div className="text-[9px] text-[#6B7280] mb-0.5 text-right tabular-nums">{pctOfTotal.toFixed(1)}%</div>
                                <div className="h-1.5 rounded-full bg-[#F3F4F6]">
                                  <div className="h-full rounded-full" style={{ width: `${pctOfTotal}%`, background: d.color }} />
                                </div>
                              </div>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          </div>

                          {isExpanded && (
                            <div className="ml-12 mt-1.5 mb-2 space-y-1 border-l-2 border-dashed border-[#E5E9F0] pl-4">
                              {d.subUnits.map((sub, i) => (
                                <div key={i} onClick={() => setDrillNode({ type: "Level", id: `${d.id}-${sub.name}`, data: { ...sub, dept: d.name } })}
                                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[#F9FAFB] cursor-pointer">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.color, opacity: 0.6 }} />
                                  <div className="flex-1">
                                    <div className="text-xs font-medium text-[#374151]">{sub.name} Level</div>
                                    <div className="text-[10px] text-[#6B7280]">{sub.hc} HC · Avg {fmt(sub.avg)}</div>
                                  </div>
                                  <span className="text-xs font-semibold text-[#111827] tabular-nums">{fmt(sub.cost)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* POSITION VIEW */}
            {view === "Position" && (
              <div className="bg-white rounded-xl border border-[#E5E9F0] shadow-sm">
                <div className="p-4 border-b border-[#E5E9F0] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827]">Position Cost Analysis</h3>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">{positionRows.length} positions · planned vs actual cost · vacancy gap</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] tracking-wide">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-medium">Position</th>
                        <th className="text-left px-4 py-2.5 font-medium">Department</th>
                        <th className="text-left px-4 py-2.5 font-medium">Grade</th>
                        <th className="text-center px-4 py-2.5 font-medium">Filled / Planned</th>
                        <th className="text-right px-4 py-2.5 font-medium">Planned Cost</th>
                        <th className="text-right px-4 py-2.5 font-medium">Actual Cost</th>
                        <th className="text-right px-4 py-2.5 font-medium">Cost Gap</th>
                        <th className="text-center px-4 py-2.5 font-medium">Vacancy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {positionRows.map((p) => (
                        <tr key={p.id} onClick={() => setDrillNode({ type: "Position", id: p.id, data: p })}
                          className="hover:bg-[#F9FAFB] cursor-pointer">
                          <td className="px-4 py-2.5 font-medium text-[#111827]">{p.title}</td>
                          <td className="px-4 py-2.5 text-[#374151]">{p.dept}</td>
                          <td className="px-4 py-2.5 text-[#6B7280]">{p.grade}</td>
                          <td className="px-4 py-2.5 text-center tabular-nums">
                            <span className={p.filled === p.planned ? "text-[#10B981]" : "text-[#F59E0B]"}>
                              {p.filled}/{p.planned}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-[#374151]">{fmt(p.plannedCost)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-[#111827]">{fmt(p.actualCost)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums">
                            <span className={p.gap > 0 ? "text-[#10B981] font-semibold" : p.gap < 0 ? "text-[#EF4444] font-semibold" : "text-[#6B7280]"}>
                              {p.gap > 0 ? "+" : ""}{fmt(p.gap)}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                              p.vacancyStatus === "Filled" ? "bg-[#D1FAE5] text-[#065F46]" :
                              p.vacancyStatus === "Critical" ? "bg-[#FEE2E2] text-[#991B1B]" :
                              "bg-[#FEF3C7] text-[#92400E]"
                            }`}>{p.vacancyStatus}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EMPLOYEE VIEW */}
            {view === "Employee" && (
              <div className="bg-white rounded-xl border border-[#E5E9F0] shadow-sm">
                <div className="p-4 border-b border-[#E5E9F0] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827]">Employee Cost Detail</h3>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">{employeeRows.length} employees · full cost breakdown</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] tracking-wide">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-medium">Name</th>
                        <th className="text-left px-4 py-2.5 font-medium">Position</th>
                        <th className="text-left px-4 py-2.5 font-medium">Department</th>
                        <th className="text-right px-4 py-2.5 font-medium">Salary</th>
                        <th className="text-right px-4 py-2.5 font-medium">Allowances</th>
                        <th className="text-right px-4 py-2.5 font-medium">Benefits</th>
                        <th className="text-right px-4 py-2.5 font-medium">Bonus</th>
                        <th className="text-right px-4 py-2.5 font-medium">Overtime</th>
                        <th className="text-right px-4 py-2.5 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {employeeRows.slice(0, 200).map((e) => (
                        <tr key={e.id} onClick={() => setDrillNode({ type: "Employee", id: e.id, data: e })}
                          className="hover:bg-[#F9FAFB] cursor-pointer">
                          <td className="px-4 py-2.5 font-medium text-[#111827]">{e.name}</td>
                          <td className="px-4 py-2.5 text-[#374151]">{e.position}</td>
                          <td className="px-4 py-2.5 text-[#6B7280]">{e.dept}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-[#374151]">{fmt(e.baseSalary)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-[#374151]">{fmt(e.allowances)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-[#374151]">{fmt(e.benefits)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-[#374151]">{fmt(e.bonus)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-[#6B7280]">{e.overtime > 0 ? fmt(e.overtime) : "—"}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums font-bold text-[#111827]">{fmt(e.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {employeeRows.length > 200 && (
                    <div className="p-3 border-t border-[#E5E9F0] text-center text-[11px] text-[#6B7280]">
                      Showing first 200 of {employeeRows.length} employees · refine filters to narrow
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DRILLDOWN PANEL */}
          {drillNode && (
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white rounded-xl border border-[#E5E9F0] shadow-sm sticky top-[180px]">
                <div className="p-4 border-b border-[#E5E9F0] flex items-start justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-[#3B82F6] tracking-wide font-semibold">{drillNode.type} Detail</div>
                    <h3 className="text-sm font-bold text-[#111827] mt-0.5">
                      {drillNode.type === "Department" ? drillNode.data.name :
                       drillNode.type === "Position" ? drillNode.data.title :
                       drillNode.type === "Employee" ? drillNode.data.name :
                       drillNode.data.dept + " · " + drillNode.data.name}
                    </h3>
                  </div>
                  <button onClick={() => setDrillNode(null)} className="text-[#9CA3AF] hover:text-[#374151]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  {drillNode.type === "Department" && <DeptDrill data={drillNode.data} empData={empData} />}
                  {drillNode.type === "Level" && <LevelDrill data={drillNode.data} />}
                  {drillNode.type === "Position" && <PositionDrill data={drillNode.data} empData={empData} />}
                  {drillNode.type === "Employee" && <EmployeeDrill data={drillNode.data} />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DRILL DOWN PANELS
// ============================================================
function DeptDrill({ data, empData }: { data: any; empData: any[] }) {
  const emps = empData.filter((e) => e.deptId === data.id);
  const topEarners = [...emps].sort((a, b) => b.total - a.total).slice(0, 5);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <MiniStat label="Total Cost" value={fmt(data.totalCost)} />
        <MiniStat label="Headcount" value={`${data.hc}`} />
        <MiniStat label="Avg / Employee" value={fmt(data.avg)} />
        <MiniStat label="Annual" value={fmt(data.totalCost * 12)} />
      </div>
      <div>
        <div className="text-[10px] uppercase text-[#6B7280] tracking-wide font-medium mb-2">Sub-units</div>
        <div className="space-y-1.5">
          {data.subUnits.map((s: any, i: number) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 bg-[#F9FAFB] rounded">
              <div>
                <div className="font-medium text-[#374151]">{s.name}</div>
                <div className="text-[10px] text-[#6B7280]">{s.hc} HC</div>
              </div>
              <span className="font-semibold text-[#111827] tabular-nums">{fmt(s.cost)}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase text-[#6B7280] tracking-wide font-medium mb-2">Top 5 by Cost</div>
        <div className="space-y-1.5">
          {topEarners.map((e: any) => (
            <Link key={e.id} href={`/organization/employees/${e.id}`} className="flex items-center justify-between text-xs p-2 hover:bg-[#F9FAFB] rounded">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[#374151] truncate">{e.name}</div>
                <div className="text-[10px] text-[#6B7280] truncate">{e.position}</div>
              </div>
              <span className="font-semibold text-[#111827] tabular-nums ml-2">{fmt(e.total)}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

function LevelDrill({ data }: { data: any }) {
  return (
    <>
      <div className="text-[11px] text-[#6B7280]">Level breakdown for <span className="font-semibold text-[#111827]">{data.dept}</span></div>
      <div className="grid grid-cols-2 gap-2">
        <MiniStat label="Headcount" value={`${data.hc}`} />
        <MiniStat label="Avg Cost" value={fmt(data.avg)} />
        <MiniStat label="Total Cost" value={fmt(data.cost)} />
        <MiniStat label="Annual" value={fmt(data.cost * 12)} />
      </div>
    </>
  );
}

function PositionDrill({ data, empData }: { data: any; empData: any[] }) {
  const filledEmps = empData.filter((e) => e.position?.includes(data.title) && e.dept === data.dept);
  return (
    <>
      <div className="text-[11px] text-[#6B7280]">{data.dept} · Grade {data.grade} · {data.level}</div>
      <div className="grid grid-cols-2 gap-2">
        <MiniStat label="Filled" value={`${data.filled}`} />
        <MiniStat label="Planned" value={`${data.planned}`} />
        <MiniStat label="Vacant" value={`${data.vacant}`} accent={data.vacant > 0 ? "warn" : undefined} />
        <MiniStat label="Status" value={data.vacancyStatus} accent={data.vacancyStatus === "Critical" ? "danger" : undefined} />
      </div>
      <div className="bg-[#F9FAFB] rounded-lg p-3">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-[#6B7280]">Salary Band</span>
          <span className="font-semibold text-[#111827] tabular-nums">{fmt(data.salaryMin)} – {fmt(data.salaryMax)}</span>
        </div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[#6B7280]">Planned Cost</span>
          <span className="font-semibold text-[#111827] tabular-nums">{fmt(data.plannedCost)}</span>
        </div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[#6B7280]">Actual Cost</span>
          <span className="font-semibold text-[#111827] tabular-nums">{fmt(data.actualCost)}</span>
        </div>
        <div className="border-t border-[#E5E9F0] mt-2 pt-2 flex items-center justify-between text-xs">
          <span className="text-[#374151] font-medium">Cost Gap</span>
          <span className={`font-bold tabular-nums ${data.gap > 0 ? "text-[#10B981]" : data.gap < 0 ? "text-[#EF4444]" : "text-[#6B7280]"}`}>
            {data.gap > 0 ? "+" : ""}{fmt(data.gap)}
          </span>
        </div>
      </div>
      {filledEmps.length > 0 && (
        <div>
          <div className="text-[10px] uppercase text-[#6B7280] tracking-wide font-medium mb-2">Filled By</div>
          <div className="space-y-1.5">
            {filledEmps.slice(0, 5).map((e) => (
              <Link key={e.id} href={`/organization/employees/${e.id}`} className="flex items-center justify-between text-xs p-2 hover:bg-[#F9FAFB] rounded">
                <span className="font-medium text-[#374151]">{e.name}</span>
                <span className="font-semibold text-[#111827] tabular-nums">{fmt(e.total)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function EmployeeDrill({ data }: { data: any }) {
  const total = data.total;
  return (
    <>
      <div className="text-[11px] text-[#6B7280]">{data.position} · {data.dept} · Grade {data.grade}</div>
      <div className="bg-[#F9FAFB] rounded-lg p-3 space-y-2">
        <CostRow label="Base Salary" value={data.baseSalary} pct={data.baseSalary / total} />
        <CostRow label="Allowances" value={data.allowances} pct={data.allowances / total} />
        <CostRow label="Benefits" value={data.benefits} pct={data.benefits / total} />
        <CostRow label="Bonus" value={data.bonus} pct={data.bonus / total} />
        {data.overtime > 0 && <CostRow label="Overtime" value={data.overtime} pct={data.overtime / total} />}
        <div className="border-t border-[#E5E9F0] pt-2 flex items-center justify-between text-xs">
          <span className="text-[#374151] font-bold">Total Monthly</span>
          <span className="font-bold text-[#111827] tabular-nums">{fmt(total)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <MiniStat label="Annual Cost" value={fmt(total * 12)} />
        <MiniStat label="Utilization" value={`${data.utilization}%`} />
        <MiniStat label="KPI Score" value={`${data.kpiScore}`} />
        <MiniStat label="Tenure" value={`${data.tenure}y`} />
      </div>
      <Link href={`/organization/employees/${data.id}`}
        className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-[#EFF6FF]">
        View Full Profile <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================
function KpiCard({ label, value, sublabel, icon, accent }: { label: string; value: string; sublabel: string; icon: React.ReactNode; accent: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E9F0] shadow-sm p-3.5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-wide text-[#6B7280] font-medium">{label}</span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: accent }}>{icon}</div>
      </div>
      <div className="text-lg font-bold text-[#111827] tabular-nums">{value}</div>
      <div className="text-[10px] text-[#6B7280] mt-0.5">{sublabel}</div>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: "warn" | "danger" }) {
  const color = accent === "danger" ? "#EF4444" : accent === "warn" ? "#F59E0B" : "#111827";
  return (
    <div className="bg-[#F9FAFB] rounded-lg p-2.5">
      <div className="text-[9px] uppercase text-[#6B7280] tracking-wide font-medium">{label}</div>
      <div className="text-sm font-bold tabular-nums mt-0.5" style={{ color }}>{value}</div>
    </div>
  );
}

function CostRow({ label, value, pct }: { label: string; value: number; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-[#6B7280]">{label}</span>
        <span className="font-semibold text-[#111827] tabular-nums">{fmt(value)} <span className="text-[10px] text-[#6B7280]">({(pct * 100).toFixed(0)}%)</span></span>
      </div>
      <div className="h-1 rounded-full bg-[#E5E9F0]">
        <div className="h-full rounded-full bg-[#3B82F6]" style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
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
