"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, Search, Filter, ChevronRight, X, Phone, Mail, MapPin,
  Briefcase, TrendingUp, Calendar, Star, Clock, User,
  ArrowUpDown, Download, UserPlus,
} from "lucide-react";
import { employees, departments } from "@/lib/oms-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
  LineChart, Line,
} from "recharts";
import { formatRupiah } from "@/lib/currency";

type Employee = (typeof employees)[0];

function statusDot(status: string) {
  const map: Record<string, string> = {
    Active: "var(--success)",
    "On Leave": "var(--warning)",
    Inactive: "var(--muted-foreground)",
  };
  return map[status] ?? "var(--muted-foreground)";
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function kpiColor(score: number) {
  if (score >= 90) return "var(--success)";
  if (score >= 80) return "var(--primary)";
  if (score >= 70) return "var(--warning)";
  return "var(--destructive)";
}

// Employee Detail Slide Panel
function EmployeeDetailPanel({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const historyTimeline = [
    { date: employee.hireDate, event: "Joined the company", type: "join" },
    { date: "2022-06-01", event: `Promoted to ${employee.grade}`, type: "promotion" },
    { date: "2023-03-15", event: "Completed Leadership Training", type: "training" },
    { date: "2024-01-08", event: "KPI Target Achieved — Q4 2023", type: "achievement" },
    { date: "2024-09-12", event: "Team Lead Assignment", type: "role" },
    { date: "2025-04-28", event: "Annual Performance Review — 91%", type: "review" },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const typeColors: Record<string, string> = {
    join: "var(--primary)",
    promotion: "var(--success)",
    training: "var(--accent)",
    achievement: "var(--warning)",
    role: "var(--primary)",
    review: "var(--success)",
  };

  const workloadData = [
    { month: "Nov", load: 78 },
    { month: "Dec", load: 82 },
    { month: "Jan", load: 85 },
    { month: "Feb", load: employee.utilization - 3 },
    { month: "Mar", load: employee.utilization - 1 },
    { month: "Apr", load: employee.utilization },
  ];

  return (
    <div
      className="fixed inset-y-0 right-0 w-96 z-50 shadow-2xl overflow-y-auto flex flex-col"
      style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b sticky top-0" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0" style={{ background: "var(--primary)" }}>
            {initials(employee.name)}
          </div>
          <div>
            <p className="font-bold" style={{ color: "var(--foreground)" }}>{employee.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{employee.position}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full" style={{ background: statusDot(employee.status) }} />
              <span className="text-xs" style={{ color: statusDot(employee.status) }}>{employee.status}</span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded ml-1" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>{employee.grade}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/organization/employees/${employee.id}`}
            className="px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 hover:underline"
            style={{ background: "var(--primary-light)", color: "var(--primary)" }}
          >
            View Full Profile <ChevronRight className="w-3 h-3" />
          </Link>
          <button onClick={onClose} className="p-1 rounded hover:bg-black/5">
            <X className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-5">
        {/* Contact */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>Contact</p>
          {[
            { icon: Phone, value: employee.phone },
            { icon: Mail, value: employee.email },
            { icon: MapPin, value: employee.location },
          ].map((c) => (
            <div key={c.value} className="flex items-center gap-2 text-xs">
              <c.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
              <span style={{ color: "var(--foreground)" }}>{c.value}</span>
            </div>
          ))}
        </div>

        {/* Position Info */}
        <div className="p-3 rounded-xl border flex flex-col gap-2" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>Position</p>
          {[
            { label: "Department", value: employee.dept },
            { label: "Manager", value: employee.manager },
            { label: "Hire Date", value: employee.hireDate },
            { label: "Tenure", value: `${employee.tenure} years` },
          ].map((f) => (
            <div key={f.label} className="flex justify-between text-xs">
              <span style={{ color: "var(--muted-foreground)" }}>{f.label}</span>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>{f.value}</span>
            </div>
          ))}
        </div>

        {/* Salary */}
        <div className="p-3 rounded-xl border flex flex-col gap-2" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>Compensation</p>
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--muted-foreground)" }}>Annual Salary</span>
            <span className="font-bold text-sm" style={{ color: "var(--primary)" }}>{formatRupiah(employee.cost)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--muted-foreground)" }}>Monthly</span>
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>{formatRupiah(Math.round(employee.cost / 12))}</span>
          </div>
        </div>

        {/* KPI Score */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>KPI Score</p>
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ background: kpiColor(employee.kpiScore) }}
            >
              {employee.kpiScore}%
            </div>
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>Performance</p>
              <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full" style={{ width: `${employee.kpiScore}%`, background: kpiColor(employee.kpiScore) }} />
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                {employee.kpiScore >= 90 ? "Excellent" : employee.kpiScore >= 80 ? "Good" : "Needs improvement"}
              </p>
            </div>
          </div>
        </div>

        {/* Workload Trend */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>
            Workload — Current: <span style={{ color: employee.utilization > 90 ? "var(--destructive)" : "var(--primary)" }}>{employee.utilization}%</span>
          </p>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={workloadData}>
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[60, 100]} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 10 }} formatter={(v: number) => [`${v}%`, "Load"]} />
              <Line dataKey="load" stroke="var(--primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* History Timeline */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)" }}>History Timeline</p>
          <div className="relative pl-4 border-l flex flex-col gap-3" style={{ borderColor: "var(--border)" }}>
            {historyTimeline.map((entry, i) => (
              <div key={i} className="relative">
                <div
                  className="absolute -left-5 w-2.5 h-2.5 rounded-full border-2 border-card"
                  style={{ background: typeColors[entry.type] ?? "var(--primary)" }}
                />
                <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{entry.event}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{entry.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function EmployeeDirectoryPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "dept" | "grade" | "util" | "kpi">("name");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filtered = employees
    .filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || e.dept === deptFilter;
      const matchGrade = gradeFilter === "all" || e.grade === gradeFilter;
      const matchStatus = statusFilter === "all" || e.status === statusFilter;
      return matchSearch && matchDept && matchGrade && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "dept") return a.dept.localeCompare(b.dept);
      if (sortBy === "grade") return a.grade.localeCompare(b.grade);
      if (sortBy === "util") return b.utilization - a.utilization;
      if (sortBy === "kpi") return b.kpiScore - a.kpiScore;
      return 0;
    });

  const totalHC = employees.length;
  const activeHC = employees.filter((e) => e.status === "Active").length;
  const onLeave = employees.filter((e) => e.status === "On Leave").length;
  const avgKPI = Math.round(employees.reduce((s, e) => s + e.kpiScore, 0) / employees.length);
  const avgUtil = Math.round(employees.reduce((s, e) => s + e.utilization, 0) / employees.length);

  const deptNames = Array.from(new Set(employees.map((e) => e.dept))).sort();
  const grades = Array.from(new Set(employees.map((e) => e.grade))).sort();

  const deptChartData = deptNames.map((d) => ({
    name: departments.find((dep) => dep.name === d)?.code ?? d.slice(0, 4),
    count: employees.filter((e) => e.dept === d).length,
  }));

  return (
    <>
      <div className={`flex gap-6 min-h-full transition-all ${selectedEmployee ? "mr-96" : ""}`}>
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                <span>Organization Structure</span>
                <ChevronRight className="w-3 h-3" />
                <span style={{ color: "var(--primary)" }} className="font-medium">Employee Directory</span>
              </nav>
              <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Employee Directory</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
              <Button size="sm" className="gap-1.5" style={{ background: "var(--primary)", color: "white" }}>
                <UserPlus className="w-3.5 h-3.5" /> Add Employee
              </Button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Total Employees", value: totalHC, color: "var(--primary)", bg: "var(--primary-light)" },
              { label: "Active", value: activeHC, color: "var(--success)", bg: "#DCFCE7" },
              { label: "On Leave", value: onLeave, color: "var(--warning)", bg: "#FEF3C7" },
              { label: "Avg KPI Score", value: `${avgKPI}%`, color: kpiColor(avgKPI), bg: "var(--primary-light)" },
              { label: "Avg Utilization", value: `${avgUtil}%`, color: avgUtil > 90 ? "var(--destructive)" : "var(--primary)", bg: "var(--primary-light)" },
            ].map((k) => (
              <div key={k.label} className="p-3 rounded-xl border text-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{k.label}</p>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 p-3 rounded-xl border flex-wrap" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
              <Input placeholder="Search by name, position, or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
            </div>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Departments</SelectItem>
                {deptNames.map((d) => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="Grade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Grades</SelectItem>
                {grades.map((g) => <SelectItem key={g} value={g} className="text-xs">{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Status</SelectItem>
                <SelectItem value="Active" className="text-xs">Active</SelectItem>
                <SelectItem value="On Leave" className="text-xs">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-28 h-8 text-xs gap-1">
                <ArrowUpDown className="w-3 h-3" /><SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name" className="text-xs">Name</SelectItem>
                <SelectItem value="dept" className="text-xs">Department</SelectItem>
                <SelectItem value="grade" className="text-xs">Grade</SelectItem>
                <SelectItem value="util" className="text-xs">Utilization</SelectItem>
                <SelectItem value="kpi" className="text-xs">KPI Score</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs ml-auto" style={{ color: "var(--muted-foreground)" }}>{filtered.length} of {totalHC}</span>
          </div>

          {/* Table */}
          <div className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                    {["Employee", "Department", "Position", "Grade", "Manager", "Utilization", "KPI Score", "Tenure", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr
                      key={emp.id}
                      className="cursor-pointer transition-colors"
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: selectedEmployee?.id === emp.id ? "var(--primary-light)" : undefined,
                      }}
                      onClick={() => setSelectedEmployee(selectedEmployee?.id === emp.id ? null : emp)}
                      onMouseEnter={(e) => { if (selectedEmployee?.id !== emp.id) (e.currentTarget as HTMLElement).style.background = "var(--muted)"; }}
                      onMouseLeave={(e) => { if (selectedEmployee?.id !== emp.id) (e.currentTarget as HTMLElement).style.background = ""; }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: "var(--primary)" }}
                          >
                            {initials(emp.name)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{emp.name}</p>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: "var(--muted-foreground)" }}>{emp.dept}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: "var(--foreground)" }}>{emp.position}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                          {emp.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: "var(--muted-foreground)" }}>{emp.manager}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--border)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${emp.utilization}%`,
                                background: emp.utilization > 90 ? "var(--destructive)" : emp.utilization > 75 ? "var(--primary)" : "var(--success)",
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: emp.utilization > 90 ? "var(--destructive)" : "var(--foreground)" }}>
                            {emp.utilization}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-bold" style={{ color: kpiColor(emp.kpiScore) }}>{emp.kpiScore}%</span>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: "var(--muted-foreground)" }}>{emp.tenure}y</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: statusDot(emp.status) }} />
                          <span className="text-xs" style={{ color: statusDot(emp.status) }}>{emp.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-10 text-xs" style={{ color: "var(--muted-foreground)" }}>
                        No employees match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Static right panel only when no employee selected */}
        {!selectedEmployee && (
          <div className="w-72 flex-shrink-0 flex flex-col gap-4">
            <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>Staff by Department</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={deptChartData} barSize={12}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 10 }} />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {deptChartData.map((_, i) => (
                      <Cell key={i} fill="var(--primary)" fillOpacity={0.5 + (i % 5) * 0.1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Top Performers</p>
              {employees.sort((a, b) => b.kpiScore - a.kpiScore).slice(0, 5).map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-2.5 py-2 border-b cursor-pointer hover:opacity-80"
                  style={{ borderColor: "var(--border)" }}
                  onClick={() => setSelectedEmployee(emp)}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "var(--primary)" }}>
                    {initials(emp.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>{emp.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{emp.position}</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: kpiColor(emp.kpiScore) }}>{emp.kpiScore}%</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>Tip</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                Click any row to open the employee detail slide panel with full profile, KPI, workload trend, and history timeline.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Slide-in Detail Panel */}
      {selectedEmployee && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSelectedEmployee(null)} />
          <EmployeeDetailPanel employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
        </>
      )}
    </>
  );
}
