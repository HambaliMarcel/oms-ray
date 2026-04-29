"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase, Plus, Search, ChevronRight, Eye, Edit2, Trash2,
  Users, AlertCircle, Upload, Filter, ArrowUpDown,
} from "lucide-react";
import { positions, departments } from "@/lib/oms-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
} from "recharts";
import { formatRupiah } from "@/lib/currency";

export default function PositionDirectoryPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"title" | "dept" | "grade">("title");
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const filtered = positions
    .filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.dept.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || p.dept === deptFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchGrade = gradeFilter === "all" || p.grade === gradeFilter;
      return matchSearch && matchDept && matchStatus && matchGrade;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "dept") return a.dept.localeCompare(b.dept);
      if (sortBy === "grade") return a.grade.localeCompare(b.grade);
      return 0;
    });

  const totalPositions = positions.length;
  const filledPositions = positions.filter((p) => p.status === "Filled").length;
  const openPositions = positions.filter((p) => p.status === "Open").length;
  const totalPlanned = positions.reduce((s, p) => s + p.planned, 0);
  const totalFilled = positions.reduce((s, p) => s + p.filled, 0);

  const deptDistribution = departments.map((d) => ({
    name: d.code,
    total: positions.filter((p) => p.deptId === d.id).length,
    open: positions.filter((p) => p.deptId === d.id && p.status === "Open").length,
  }));

  const grades = Array.from(new Set(positions.map((p) => p.grade))).sort();
  const deptNames = Array.from(new Set(positions.map((p) => p.dept))).sort();

  return (
    <div className="flex gap-6 min-h-full">
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <nav className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
              <span>Organization Structure</span>
              <ChevronRight className="w-3 h-3" />
              <span style={{ color: "var(--primary)" }} className="font-medium">Position Directory</span>
            </nav>
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Position Directory</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/organization/positions/create?mode=bulk-upload">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Bulk Upload
              </Button>
            </Link>
            <Link href="/organization/positions/create">
              <Button size="sm" className="gap-1.5" style={{ background: "var(--primary)", color: "white" }}>
                <Plus className="w-3.5 h-3.5" /> Create Position
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Positions", value: totalPositions, icon: Briefcase, color: "var(--primary)", bg: "var(--primary-light)" },
            { label: "Filled Positions", value: filledPositions, icon: Users, color: "var(--success)", bg: "#DCFCE7" },
            { label: "Open Positions", value: openPositions, icon: AlertCircle, color: "var(--destructive)", bg: "#FEE2E2" },
            { label: "Fill Rate", value: `${Math.round((totalFilled / totalPlanned) * 100)}%`, icon: ArrowUpDown, color: "var(--accent)", bg: "#E0F0FF" },
          ].map((k) => (
            <div key={k.label} className="flex items-center gap-3 p-4 rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: k.bg }}>
                <k.icon className="w-5 h-5" style={{ color: k.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold leading-tight" style={{ color: k.color }}>{k.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 p-3 rounded-xl border flex-wrap" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
            <Input placeholder="Search positions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
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
              <SelectItem value="Open" className="text-xs">Open</SelectItem>
              <SelectItem value="Filled" className="text-xs">Filled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-28 h-8 text-xs gap-1">
              <ArrowUpDown className="w-3 h-3" /><SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title" className="text-xs">Title</SelectItem>
              <SelectItem value="dept" className="text-xs">Department</SelectItem>
              <SelectItem value="grade" className="text-xs">Grade</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs ml-auto" style={{ color: "var(--muted-foreground)" }}>{filtered.length} of {totalPositions}</span>
        </div>

        {/* Table */}
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  {["Position Name", "Department", "Grade", "Filled", "Planned", "Gap", "Salary Range", "Reporting To", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((pos) => {
                  const gap = pos.planned - pos.filled;
                  const deptMeta = departments.find((d) => d.id === pos.deptId);
                  return (
                    <tr
                      key={pos.id}
                      style={{ borderBottom: "1px solid var(--border)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--muted)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--primary-light)" }}>
                            <Briefcase className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                          </div>
                          <Link href={`/organization/positions/${pos.id}`} className="text-xs font-semibold hover:underline" style={{ color: "var(--foreground)" }}>
                            {pos.title}
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: "var(--muted-foreground)" }}>{pos.dept}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                          {pos.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold" style={{ color: "var(--foreground)" }}>{pos.filled}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: "var(--muted-foreground)" }}>{pos.planned}</td>
                      <td className="py-3 px-4 text-xs">
                        <span
                          className="font-bold"
                          style={{ color: gap > 0 ? "var(--destructive)" : "var(--success)" }}
                        >
                          {gap > 0 ? `-${gap}` : "0"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {formatRupiah(pos.salaryMin)} – {formatRupiah(pos.salaryMax)}
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: "var(--muted-foreground)" }}>{deptMeta?.head ?? "N/A"}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: pos.status === "Open" ? "#FEE2E2" : "#DCFCE7",
                            color: pos.status === "Open" ? "var(--destructive)" : "var(--success)",
                          }}
                        >
                          {pos.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/organization/positions/${pos.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Eye className="w-3 h-3" /></Button>
                          </Link>
                          <Link href={`/organization/positions/${pos.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit2 className="w-3 h-3" /></Button>
                          </Link>
                          <Button
                            variant="ghost" size="sm" className="h-7 w-7 p-0"
                            style={{ color: "var(--destructive)" }}
                            onClick={() => setDeleteDialog(pos.title)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-10 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      No positions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4">
        <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>Positions by Department</p>
          <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>Total vs Open vacancies</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={deptDistribution} barSize={10}>
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 10 }} />
              <Bar dataKey="total" name="Total" fill="var(--primary)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="open" name="Open" fill="var(--destructive)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Grade Summary</p>
          <div className="flex flex-col gap-2">
            {grades.map((g) => {
              const count = positions.filter((p) => p.grade === g).length;
              const open = positions.filter((p) => p.grade === g && p.status === "Open").length;
              return (
                <div key={g} className="flex items-center gap-3 py-1.5 border-b text-xs" style={{ borderColor: "var(--border)" }}>
                  <span className="font-mono font-bold w-8" style={{ color: "var(--primary)" }}>{g}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--muted)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / positions.length) * 100}%`, background: "var(--primary)" }} />
                  </div>
                  <span style={{ color: "var(--foreground)" }}>{count}</span>
                  {open > 0 && <span style={{ color: "var(--destructive)" }}>({open} open)</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Quick Actions</p>
          <div className="flex flex-col gap-2">
            <Link href="/organization/positions/create">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                <Plus className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} /> Create New Position
              </Button>
            </Link>
            <Link href="/organization/positions?status=Open">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                <AlertCircle className="w-3.5 h-3.5" style={{ color: "var(--destructive)" }} /> View Open Positions
              </Button>
            </Link>
            <Link href="/organization/employees">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                <Users className="w-3.5 h-3.5" style={{ color: "var(--success)" }} /> Employee Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Position</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteDialog}</strong>? This will remove all linked vacancy records and workforce planning data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button style={{ background: "var(--destructive)", color: "white" }} onClick={() => setDeleteDialog(null)}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
