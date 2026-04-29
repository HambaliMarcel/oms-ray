"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Edit2, UserPlus, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  unifiedPositions as positions,
  unifiedEmployeesAll as employees,
  unifiedDepartments as departments,
  unifiedWorkloadActivities as activities,
  unifiedProcessList as processList,
} from "@/lib/om-metrics";
import { formatRupiah } from "@/lib/currency";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,
} from "recharts";

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"];
const normalize = (n: number) => (n < 1_000_000 ? n * 1000 : n);
const statusByUtil = (u: number) => (u > 110 ? "Overloaded" : u >= 90 ? "Balanced" : u >= 70 ? "Underutilized" : "Significantly Underutilized");
const utilColor = (u: number) => (u > 110 ? "text-red-600" : u >= 90 ? "text-emerald-600" : "text-amber-600");
const utilBadge = (u: number) => (u > 110 ? "bg-red-50 text-red-600" : u >= 90 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600");

export default function PositionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const position = positions.find((p) => p.id === id);

  if (!position) {
    console.warn("Position not found:", id);
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Position not found.</p>
          <div className="mt-4">
            <Link href="/organization/positions">
              <Button variant="outline" size="sm">Back to Position Directory</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dept = departments.find((d) => d.id === position.deptId);
  const incumbents = employees.filter((e) => e.position === position.title);
  const ownerProcesses = processList.filter((p) => p.owner === position.title);
  const relatedActivities = activities.filter((a) => a.role === position.title);
  const superiorPosition = positions.find((p) => p.deptId === position.deptId && p.level === "Manager" && p.id !== position.id) ?? null;
  const subPositions = positions.filter((p) => p.deptId === position.deptId && p.id !== position.id).slice(0, 4);

  const plannedBaseSalary = normalize((position as any).plannedBaseSalary ?? Math.round(normalize(position.salaryMin) * 0.62));
  const plannedAllowance = normalize((position as any).plannedAllowance ?? Math.round(normalize(position.salaryMin) * 0.2));
  const plannedBenefits = normalize((position as any).plannedBenefits ?? Math.round(normalize(position.salaryMin) * 0.13));
  const plannedBonus = normalize((position as any).plannedBonusMonthlyEquivalent ?? Math.round(normalize(position.salaryMin) * 0.08));
  const plannedMonthlyCost = plannedBaseSalary + plannedAllowance + plannedBenefits + plannedBonus;
  const plannedAnnualCost = plannedMonthlyCost * 12;
  const actualMonthlyCost = incumbents.reduce((s, e) => s + normalize((e as any).totalMonthlyCost ?? e.cost), 0);
  const actualAnnualCost = actualMonthlyCost * 12;
  const costGap = actualMonthlyCost - plannedMonthlyCost;
  const costStatus = costGap > plannedMonthlyCost * 0.08 ? "Above Plan" : costGap < -plannedMonthlyCost * 0.08 ? "Below Plan" : "Within Plan";

  const totalWorkloadHours = Math.round(relatedActivities.reduce((s, a) => s + a.adjustedWorkload, 0));
  const requiredHC = Number((relatedActivities.reduce((s, a) => s + a.requiredHc, 0)).toFixed(1));
  const assignedHC = Number((relatedActivities.reduce((s, a) => s + a.assignedHc, 0)).toFixed(1));
  const hcGap = Number((requiredHC - assignedHC).toFixed(1));
  const avgUtil = relatedActivities.length ? Math.round(relatedActivities.reduce((s, a) => s + a.utilization, 0) / relatedActivities.length) : 0;

  const workloadPerPerson = useMemo(
    () =>
      incumbents.map((e) => {
        const assignedActs = relatedActivities.filter((a) => a.assignedEmployees.includes(e.id));
        const personLoad = assignedActs.reduce((s, a) => s + a.adjustedWorkload / Math.max(1, a.assignedEmployees.length), 0);
        const utilization = Math.round((personLoad / 136) * 100);
        return { employee: e, assignedActivities: assignedActs.length, workload: Math.round(personLoad), utilization };
      }),
    [incumbents, relatedActivities],
  );

  const kpiTop = [
    { label: "Headcount", value: `${position.filled} / ${position.planned} Filled`, color: "text-emerald-600" },
    { label: "Utilization", value: `${avgUtil}% (${statusByUtil(avgUtil)})`, color: utilColor(avgUtil) },
    { label: "Total Workload", value: `${totalWorkloadHours} hours/month`, color: "text-blue-600" },
    { label: "Monthly Cost", value: formatRupiah(actualMonthlyCost || plannedMonthlyCost), color: costStatus === "Above Plan" ? "text-red-600" : costStatus === "Within Plan" ? "text-emerald-600" : "text-amber-600" },
  ];

  const costDonut = [
    { name: "Base", value: plannedBaseSalary },
    { name: "Allowance", value: plannedAllowance },
    { name: "Benefits", value: plannedBenefits },
    { name: "Bonus", value: plannedBonus },
  ];
  const plannedVsActual = [{ name: "Monthly", Planned: plannedMonthlyCost, Actual: actualMonthlyCost || plannedMonthlyCost }];

  return (
    <div className="space-y-6 bg-[#F8FAFC] p-1">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Organization Management</span><ChevronRight className="h-3 w-3" />
          <Link href="/organization/positions" className="hover:underline">Position Directory</Link><ChevronRight className="h-3 w-3" />
          <span className="font-medium text-primary">{position.title}</span>
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold leading-tight">Position Detail — {position.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/organization/positions/${id}/edit`}><Button variant="outline" size="sm"><Edit2 className="mr-1.5 h-3.5 w-3.5" />Edit Position</Button></Link>
            <Button variant="outline" size="sm"><UserPlus className="mr-1.5 h-3.5 w-3.5" />Assign Employee</Button>
            <Link href="/scenario/builder"><Button size="sm"><GitBranch className="mr-1.5 h-3.5 w-3.5" />Simulate in Scenario</Button></Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {kpiTop.map((k) => (
          <div key={k.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className={`mt-1 text-2xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <Section title="Employees in Position">
            {incumbents.length === 0 ? (
              <div className="rounded-xl bg-[#F8FAFC] p-6 text-center text-sm text-muted-foreground">This position is currently vacant.</div>
            ) : (
              <>
                <EmployeeTable incumbents={incumbents} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Total employees: {incumbents.length}</span>
                  <span>Average utilization: {Math.round(incumbents.reduce((s, e) => s + e.utilization, 0) / incumbents.length)}%</span>
                  <span>Total cost: {formatRupiah(actualMonthlyCost)}</span>
                </div>
              </>
            )}
          </Section>

          <Section title="Activities">
            <SimpleTable
              headers={["Activity Name", "Process", "Frequency", "Duration", "Workload (hours)", "Assigned Employees", "Status"]}
              rows={relatedActivities.map((a) => [
                <Link key={a.id} href={`/workload-activity/activity-directory/${a.id}`} className="font-medium hover:underline">{a.name}</Link>,
                a.processName,
                `${(a as any).execPerMonth ?? (a as any).frequencyPerMonth ?? 1}/month`,
                `${a.duration}h`,
                `${Math.round(a.adjustedWorkload)}`,
                `${a.assignedEmployees.length}`,
                <span key={`${a.id}-s`} className={`rounded-full px-2 py-0.5 text-[11px] ${utilBadge(a.utilization)}`}>{statusByUtil(a.utilization)}</span>,
              ])}
            />
          </Section>

          <Section title="Workload per Person">
            <SimpleTable
              headers={["Employee", "Assigned Activities", "Total Workload Hours", "Capacity (136h)", "Utilization %"]}
              rows={workloadPerPerson.map((r) => [
                <Link key={r.employee.id} href={`/organization/employees/${r.employee.id}`} className="font-medium hover:underline">{r.employee.name}</Link>,
                `${r.assignedActivities}`,
                `${r.workload}`,
                "136",
                <span key={`${r.employee.id}-u`} className={utilColor(r.utilization)}>{r.utilization}%</span>,
              ])}
            />
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              <MiniMetric label="Total Workload" value={`${totalWorkloadHours} h`} />
              <MiniMetric label="Required HC" value={`${requiredHC}`} />
              <MiniMetric label="Assigned HC" value={`${assignedHC}`} />
              <MiniMetric label="Gap" value={`${hcGap > 0 ? "+" : ""}${hcGap}`} />
            </div>
          </Section>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4">
          <Section title="Position">
            <InfoGrid rows={[
              ["Nomenklatur Jabatan", position.title],
              ["Job Grade", position.grade],
              ["Department", dept?.name ?? position.dept],
              ["Reports To", superiorPosition?.title ?? "Manager Perencanaan Operasi"],
              ["Number of Subordinates", `${subPositions.length}`],
              ["Status", position.status],
            ]} />
          </Section>

          <Section title="Cost">
            <InfoGrid rows={[
              ["Planned Monthly Cost", formatRupiah(plannedMonthlyCost)],
              ["Planned Annual Cost", formatRupiah(plannedAnnualCost)],
              ["Actual Monthly Cost", formatRupiah(actualMonthlyCost || plannedMonthlyCost)],
              ["Actual Annual Cost", formatRupiah(actualAnnualCost || plannedAnnualCost)],
              ["Cost vs Plan", `${formatRupiah(costGap)} (${costStatus})`],
            ]} />
            <div className="mt-4 grid grid-cols-1 gap-3">
              <ChartCard title="Salary vs Benefits">
                <ResponsiveContainer width="100%" height={150}><PieChart><Pie data={costDonut} dataKey="value" cx="50%" cy="50%" innerRadius={32} outerRadius={56}>{costDonut.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => formatRupiah(v)} /></PieChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Planned vs Actual">
                <ResponsiveContainer width="100%" height={140}><BarChart data={plannedVsActual}><XAxis dataKey="name" /><YAxis hide /><Tooltip formatter={(v: number) => formatRupiah(v)} /><Bar dataKey="Planned" fill="#94A3B8" /><Bar dataKey="Actual" fill="#2563EB" /></BarChart></ResponsiveContainer>
              </ChartCard>
            </div>
          </Section>

          <Section title="Business Process & KPI">
            <SimpleTable
              headers={["Process Name", "Role", "KPI Name", "KPI Score", "Status"]}
              rows={(ownerProcesses.length ? ownerProcesses : processList.slice(0, 4)).map((p) => [
                <Link key={p.id} href={`/business-process/process-directory/${p.id}`} className="hover:underline">{p.name}</Link>,
                p.owner === position.title ? "Owner" : "Executor",
                (p as any).kpiName ?? "On-Time Berthing",
                `${(p as any).kpiScore ?? (p as any).efficiency ?? 84}%`,
                <span key={`${p.id}-st`} className={`rounded-full px-2 py-0.5 text-[11px] ${((p as any).kpiScore ?? (p as any).efficiency ?? 84) < 85 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>{((p as any).kpiScore ?? (p as any).efficiency ?? 84) < 85 ? "At Risk" : "On Track"}</span>,
              ])}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-[18px] font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function InfoGrid({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <div className="grid grid-cols-1 gap-2 text-[14px]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-3 rounded-lg bg-[#F8FAFC] px-3 py-2">
          <span className="text-muted-foreground">{k}</span>
          <span className="text-right font-medium">{v}</span>
        </div>
      ))}
    </div>
  );
}

function EmployeeTable({ incumbents }: { incumbents: typeof employees }) {
  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="h-12 bg-[#F1F5F9] text-left text-xs font-semibold text-muted-foreground">
            <th className="px-3">Employee</th>
            <th className="px-3">Status</th>
            <th className="px-3">Allocation %</th>
            <th className="px-3">Utilization %</th>
            <th className="px-3">Monthly Cost (Rp)</th>
            <th className="px-3">Performance</th>
            <th className="px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incumbents.map((e) => (
            <tr key={e.id} className="h-[64px] border-b border-slate-100 hover:bg-slate-50">
              <td className="px-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{e.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                  <div>
                    <Link href={`/organization/employees/${e.id}`} className="text-sm font-semibold hover:underline">{e.name}</Link>
                    <p className="text-[11px] text-muted-foreground">{e.position}</p>
                  </div>
                </div>
              </td>
              <td className="px-3">{e.status === "Active" ? "Tetap" : "Kontrak"}</td>
              <td className="px-3">100%</td>
              <td className={`px-3 ${utilColor(e.utilization)}`}>{e.utilization}%</td>
              <td className="px-3">{formatRupiah(normalize((e as any).totalMonthlyCost ?? e.cost))}</td>
              <td className="px-3">{e.kpiScore}%</td>
              <td className="px-3">
                <div className="flex gap-1">
                  <Link href={`/organization/employees/${e.id}`}><Button size="sm" variant="outline">View</Button></Link>
                  <Button size="sm" variant="outline">Remove</Button>
                  <Button size="sm" variant="outline">Reassign</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="h-12 bg-[#F1F5F9] text-left text-xs font-semibold text-muted-foreground">
            {headers.map((h) => <th key={h} className="px-3">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="h-[62px] border-b border-slate-100 hover:bg-slate-50">
              {r.map((c, j) => <td key={j} className="px-3">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#F8FAFC] p-3">
      <p className="mb-2 text-xs font-semibold">{title}</p>
      {children}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#F8FAFC] p-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
