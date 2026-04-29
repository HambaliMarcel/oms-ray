"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronRight, Mail, Phone, MapPin, Calendar, Briefcase,
  TrendingUp, Star, AlertCircle, Users, DollarSign, Clock,
} from "lucide-react";
import { employees, departments, positions } from "@/lib/oms-data";
import { ActivitiesWorkloadSection } from "@/components/oms/activities-workload-section";
import { Button } from "@/components/ui/button";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
function statusDot(status: string) {
  const map: Record<string, string> = {
    Active: "var(--success)", "On Leave": "var(--warning)", Inactive: "var(--muted-foreground)",
  };
  return map[status] ?? "var(--muted-foreground)";
}
function kpiColor(score: number) {
  if (score >= 90) return "var(--success)";
  if (score >= 80) return "var(--primary)";
  if (score >= 70) return "var(--warning)";
  return "var(--destructive)";
}

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const employee = employees.find((e) => e.id === id);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Employee not found.</p>
        <Link href="/organization/employees">
          <Button variant="outline" size="sm" className="gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back to Employees</Button>
        </Link>
      </div>
    );
  }

  const dept = departments.find((d) => d.id === employee.deptId);
  const position = positions.find((p) => p.title === employee.position);
  const manager = employees.find((e) => e.id === (employee as { reportingTo?: string | null }).reportingTo) ?? null;
  const reports = employees.filter((e) => (e as { reportingTo?: string | null }).reportingTo === employee.id);

  return (
    <div className="flex gap-6 min-h-full">
      {/* Main */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        {/* Breadcrumb + header */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>
            <Link href="/organization/employees" className="hover:underline">Employee Directory</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "var(--primary)" }} className="font-medium">{employee.name}</span>
          </nav>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ background: "var(--primary)" }}>
                {initials(employee.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{employee.name}</h1>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>{employee.grade}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                    style={{ background: employee.status === "Active" ? "#DCFCE7" : "#FEF3C7", color: statusDot(employee.status) }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusDot(employee.status) }} />
                    {employee.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {position ? (
                      <Link href={`/organization/positions/${position.id}`} className="hover:underline">
                        {employee.position}
                      </Link>
                    ) : (
                      employee.position
                    )}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{employee.location}</span>
                  <span>·</span>
                  <span>{employee.id}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/organization/employees">
                <Button variant="outline" size="sm" className="gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back to Directory</Button>
              </Link>
              {position && (
                <Link href={`/organization/positions/${position.id}`}>
                  <Button size="sm" className="gap-1.5" style={{ background: "var(--primary)", color: "white" }}>
                    <Briefcase className="w-3.5 h-3.5" /> View Role
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "KPI Score", value: `${employee.kpiScore}%`, icon: Star, color: kpiColor(employee.kpiScore), bg: "#DCFCE7" },
            { label: "Utilization", value: `${employee.utilization}%`, icon: TrendingUp, color: employee.utilization >= 90 ? "var(--destructive)" : "var(--primary)", bg: employee.utilization >= 90 ? "#FEE2E2" : "var(--primary-light)" },
            { label: "Tenure", value: `${employee.tenure}y`, icon: Calendar, color: "var(--accent)", bg: "#E0F0FF" },
            { label: "Annual Cost", value: `$${(employee.cost / 1000).toFixed(0)}K`, icon: DollarSign, color: "var(--success)", bg: "#DCFCE7" },
            { label: "Risk Score", value: employee.riskScore, icon: AlertCircle, color: employee.riskScore > 30 ? "var(--destructive)" : employee.riskScore > 20 ? "var(--warning)" : "var(--success)", bg: employee.riskScore > 30 ? "#FEE2E2" : employee.riskScore > 20 ? "#FEF3C7" : "#DCFCE7" },
          ].map((k) => (
            <div key={k.label} className="flex items-center gap-3 p-4 rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: k.bg }}>
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight tabular-nums" style={{ color: k.color }}>{k.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activities, Workload & Performance — primary section */}
        <ActivitiesWorkloadSection kind="employee" employeeId={employee.id} />

        {/* Reporting structure */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)" }}>Reports To</p>
            {manager ? (
              <Link href={`/organization/employees/${manager.id}`} className="flex items-center gap-3 p-2 -m-2 rounded hover:bg-black/5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "var(--primary)" }}>{initials(manager.name)}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{manager.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{manager.position}</p>
                </div>
                <ChevronRight className="w-4 h-4 ml-auto" style={{ color: "var(--muted-foreground)" }} />
              </Link>
            ) : (
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>—</p>
            )}
          </div>

          <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
              <Users className="w-3.5 h-3.5" /> Direct Reports ({reports.length})
            </p>
            {reports.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>No direct reports.</p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                {reports.map((r) => (
                  <Link key={r.id} href={`/organization/employees/${r.id}`} className="flex items-center gap-2 p-1 -m-1 rounded hover:bg-black/5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: "var(--primary)" }}>{initials(r.name)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{r.name}</p>
                      <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>{r.position}</p>
                    </div>
                    <span className="text-[10px] tabular-nums" style={{ color: kpiColor(r.kpiScore) }}>{r.kpiScore}%</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4">
        <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)" }}>Contact</p>
          <div className="flex flex-col gap-2">
            <a href={`mailto:${employee.email}`} className="flex items-center gap-2 text-xs hover:underline" style={{ color: "var(--primary)" }}>
              <Mail className="w-3.5 h-3.5" /> <span className="truncate">{employee.email}</span>
            </a>
            <span className="flex items-center gap-2 text-xs" style={{ color: "var(--foreground)" }}>
              <Phone className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} /> {employee.phone}
            </span>
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)" }}>Profile</p>
          {[
            { label: "Department", value: employee.dept },
            { label: "Cost Center", value: dept?.code ?? "—" },
            { label: "Manager", value: employee.manager ?? "—" },
            { label: "Hire Date", value: employee.hireDate },
            { label: "Salary", value: `$${(employee.salary / 1000).toFixed(0)}K` },
            { label: "Loaded Cost", value: `$${(employee.cost / 1000).toFixed(0)}K` },
          ].map((f) => (
            <div key={f.label} className="flex justify-between py-2 border-b text-xs last:border-0" style={{ borderColor: "var(--border)" }}>
              <span style={{ color: "var(--muted-foreground)" }}>{f.label}</span>
              <span className="font-medium text-right" style={{ color: "var(--foreground)" }}>{f.value}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)" }}>Quick Actions</p>
          <div className="flex flex-col gap-2">
            {position && (
              <Link href={`/organization/positions/${position.id}`}>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <Briefcase className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} /> View Position
                </Button>
              </Link>
            )}
            <Link href="/workload-activity/utilization-dashboard">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                <Clock className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} /> Utilization Dashboard
              </Button>
            </Link>
            <Link href="/business-process/process-directory">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                <Star className="w-3.5 h-3.5" style={{ color: "var(--success)" }} /> Process & KPI Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
