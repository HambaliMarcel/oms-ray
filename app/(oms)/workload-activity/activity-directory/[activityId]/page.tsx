"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/lib/currency";
import {
  unifiedEmployeesAll as employeesAll,
  unifiedProcessList as processList,
  unifiedScenarios as scenarios,
  unifiedWorkloadActivities as workloadActivities,
  unifiedWORKLOAD_CONSTANTS as WORKLOAD_CONSTANTS,
  unifiedPositions as positions,
} from "@/lib/om-metrics";

function utilizationStatus(utilization: number) {
  if (utilization > 110) return { label: "Overloaded", badge: "bg-red-50 text-red-600" };
  if (utilization >= 90) return { label: "Balanced", badge: "bg-emerald-50 text-emerald-600" };
  if (utilization >= 70) return { label: "Underutilized", badge: "bg-amber-50 text-amber-600" };
  return { label: "Significantly Underutilized", badge: "bg-blue-50 text-blue-600" };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <h2 className="text-[18px] font-semibold text-[#0F172A]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

type EditState = {
  activityName: string;
  description: string;
  processId: string;
  responsiblePosition: string;
  frequencyValue: number;
  duration: number;
  complexityMultiplier: number;
  qualityReviewFactor: number;
  seasonalPeakFactor: number;
  reworkRate: number;
};

export default function ActivityDetailPage({ params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = use(params);
  const router = useRouter();
  const activity = workloadActivities.find((a) => a.id === activityId);

  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [recalcOpen, setRecalcOpen] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [assignedEmployees, setAssignedEmployees] = useState<string[]>(activity?.assignedEmployees ?? []);
  const [allocationPercent, setAllocationPercent] = useState<Record<string, number>>(
    Object.fromEntries((activity?.assignedEmployees ?? []).map((id) => [id, Math.max(10, Math.round(100 / Math.max((activity?.assignedEmployees.length ?? 1), 1)))])),
  );

  const [edit, setEdit] = useState<EditState>({
    activityName: activity?.name ?? "",
    description: activity?.description ?? "",
    processId: activity?.processId ?? "",
    responsiblePosition: activity?.responsiblePosition ?? "",
    frequencyValue: activity?.frequencyValue ?? 1,
    duration: activity?.duration ?? 1,
    complexityMultiplier: activity?.complexityMultiplier ?? 1.15,
    qualityReviewFactor: activity?.qualityReviewFactor ?? 1.1,
    seasonalPeakFactor: activity?.seasonalPeakFactor ?? 1.2,
    reworkRate: activity?.reworkRate ?? 0.08,
  });

  if (!activity) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8">
        <div className="rounded-2xl bg-white p-8 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-sm text-[#475569]">Activity not found.</p>
          <Button className="mt-4 rounded-xl bg-[#2563EB] text-white" onClick={() => router.push("/workload-activity/activity-directory")}>
            Back to Activity Directory
          </Button>
        </div>
      </div>
    );
  }

  const linkedProcess = processList.find((p) => p.id === edit.processId) ?? processList.find((p) => p.id === activity.processId);
  const processOwnerEmployee = employeesAll.find((e) => e.position === linkedProcess?.owner);
  const responsiblePosition = positions.find((p) => p.title === edit.responsiblePosition || p.title === activity.responsiblePosition);

  const baseWorkloadHours = edit.frequencyValue * edit.duration;
  const adjustedWorkloadHours =
    baseWorkloadHours *
    edit.complexityMultiplier *
    edit.qualityReviewFactor *
    edit.seasonalPeakFactor *
    (1 + edit.reworkRate);
  const effectiveCapacityPerFte = WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor;
  const requiredHc = adjustedWorkloadHours / effectiveCapacityPerFte;
  const assignedHc = Math.max(assignedEmployees.length, activity.assignedHc);
  const totalAssignedEffectiveCapacity = Math.max(assignedHc * effectiveCapacityPerFte, 1);
  const utilization = (adjustedWorkloadHours / totalAssignedEffectiveCapacity) * 100;
  const hcGap = requiredHc - assignedHc;
  const status = utilizationStatus(utilization);

  const assignedRows = assignedEmployees
    .map((eid) => employeesAll.find((e) => e.id === eid))
    .filter(Boolean)
    .map((employeeRef) => {
      const employee = employeeRef!;
      const alloc = allocationPercent[employee.id] ?? Math.round(100 / Math.max(assignedEmployees.length, 1));
      const capContribution = (effectiveCapacityPerFte * alloc) / 100;
      const thisActivityWorkload = (adjustedWorkloadHours * alloc) / 100;
      const otherWorkload = Math.max(0, 136 - thisActivityWorkload + ((employee.id.charCodeAt(0) % 8) - 4) * 3);
      const totalWorkload = thisActivityWorkload + otherWorkload;
      const empUtil = (totalWorkload / 136) * 100;
      const empMonthlyCost = (employee as any).totalMonthlyCost ?? Math.round(((employee as any).cost ?? 360_000_000) / 12);
      const monthlyCostContribution = empMonthlyCost * (alloc / 100);
      return { employee, alloc, capContribution, thisActivityWorkload, otherWorkload, totalWorkload, empUtil, monthlyCostContribution };
    });

  const totalMonthlyActivityCost = assignedRows.reduce((s, r) => s + r.monthlyCostContribution, 0);
  const annualizedActivityCost = totalMonthlyActivityCost * 12;
  const costPerExecution = totalMonthlyActivityCost / Math.max(edit.frequencyValue, 1);
  const costPerWorkloadHour = totalMonthlyActivityCost / Math.max(adjustedWorkloadHours, 1);

  const activityTrend = (activity.trend ?? [95, 100, 104, 108, 113, Math.round(utilization)]).map((v, idx) => ({
    month: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"][idx],
    utilization: v,
    workload: Math.round((adjustedWorkloadHours * v) / Math.max(utilization, 1)),
  }));

  const demandVsCapacityChart = [
    { name: "Demand", value: Number(adjustedWorkloadHours.toFixed(1)) },
    { name: "Capacity", value: Number((assignedHc * effectiveCapacityPerFte).toFixed(1)) },
  ];
  const hcComparisonChart = [{ name: "HC", required: Number(requiredHc.toFixed(2)), assigned: Number(assignedHc.toFixed(2)) }];
  const utilGauge = [{ name: "Used", value: Math.min(utilization, 150) }, { name: "Remaining", value: Math.max(0, 150 - utilization) }];

  const candidateEmployees = employeesAll.filter((e) => e.status === "Active" && e.deptId === activity.departmentId).slice(0, 15);
  const auditRows = [
    { date: "2026-03-15", user: "Raka Kusuma", action: "Updated frequency", before: "100/month", after: "120/month", approval: "Approved" },
    { date: "2026-03-18", user: "Citra Dewi", action: "Added employee allocation", before: "20%", after: "35%", approval: "Pending" },
  ];

  const statusColor = utilization > 110 ? "text-red-600" : utilization >= 90 ? "text-emerald-600" : utilization >= 70 ? "text-amber-600" : "text-blue-600";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="space-y-4 p-6">
        <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] text-[#64748B]">Workload &amp; Activity Management &gt; Activity Directory &gt; {edit.activityName}</p>
          <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">Activity Detail — {edit.activityName}</h1>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="rounded-xl h-8" onClick={() => setEditOpen(true)}>Edit Activity</Button>
              <Button size="sm" variant="outline" className="rounded-xl h-8" onClick={() => setAssignOpen(true)}>Assign Employees</Button>
              <Button size="sm" variant="outline" className="rounded-xl h-8" onClick={() => setRecalcOpen(true)}>Recalculate Workload</Button>
              <Button size="sm" variant="outline" className="rounded-xl h-8" onClick={() => setScenarioOpen(true)}>Simulate in Scenario</Button>
              <Button size="sm" className="rounded-xl h-8 bg-[#2563EB] text-white" onClick={() => setExportOpen(true)}>Export Activity Detail</Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            ["Monthly Workload", `${adjustedWorkloadHours.toFixed(1)} hours/month`],
            ["Required HC", `${requiredHc.toFixed(2)} FTE`],
            ["Assigned HC", `${assignedHc.toFixed(2)} FTE`],
            ["Utilization", `${utilization.toFixed(0)}% — ${status.label}`],
            ["Monthly Activity Cost", formatRupiah(Math.round(totalMonthlyActivityCost))],
          ].map(([label, value]) => (
            <article key={label} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <p className="text-xs text-[#94A3B8]">{label}</p>
              <p className={`mt-1 text-xl font-bold ${label === "Utilization" ? statusColor : "text-[#0F172A]"}`}>{value}</p>
            </article>
          ))}
        </section>

        <Section title="Activity Profile">
          <div className="grid grid-cols-1 gap-3 text-sm lg:grid-cols-2">
            <p><b>Activity ID:</b> {activity.activityCode}</p>
            <p><b>Activity Name:</b> {edit.activityName}</p>
            <p><b>Activity Description:</b> {edit.description}</p>
            <p><b>Activity Type:</b> {activity.processCategory}</p>
            <p><b>Linked Business Process:</b> {activity.processName}</p>
            <p><b>Process Step Number:</b> {activity.seq}</p>
            <p><b>Owning Organization:</b> PT Pelabuhan Indonesia (Persero)</p>
            <p><b>Division:</b> {activity.department}</p>
            <p><b>Department:</b> {activity.department}</p>
            <p><b>Responsible Position:</b> {edit.responsiblePosition}</p>
            <p><b>Activity Criticality:</b> {activity.criticality}</p>
            <p><b>Activity Status:</b> <span className={`rounded-full px-2 py-1 text-xs ${status.badge}`}>{status.label}</span></p>
            <p><b>Last Updated:</b> 2026-04-29</p>
          </div>
        </Section>

        <Section title="Linked Business Process">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <p><b>Business Process Name:</b> {linkedProcess?.name ?? activity.processName}</p>
            <p><b>Process Owner Position:</b> {linkedProcess?.owner ?? "Process Owner"}</p>
            <p><b>Process Owner Employee:</b> {processOwnerEmployee?.name ?? "Not assigned"}</p>
            <p><b>Linked KPI:</b> {activity.linkedKpi}</p>
            <p><b>KPI Target:</b> {linkedProcess ? `${Math.min((linkedProcess as any).kpiScore + 8, 98)}%` : "95%"}</p>
            <p><b>KPI Actual:</b> {linkedProcess ? `${(linkedProcess as any).kpiScore ?? 88}%` : "88%"}</p>
            <p><b>KPI Status:</b> {(linkedProcess as any)?.kpiScore >= 90 ? "On Track" : "At Risk"}</p>
            <p><b>Upstream Process:</b> {activity.previousActivityName ?? "None (start step)"}</p>
            <p><b>Downstream Process:</b> {activity.nextActivityName ?? "None (end step)"}</p>
            <p><b>Input Documents:</b> Vessel arrival notice, berth request, operational roster</p>
            <p><b>Output Deliverables:</b> Slot allocation confirmation, updated terminal schedule</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => router.push(`/business-process/process-directory/${activity.processId}`)}>Open Business Process Detail</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => router.push("/business-process/process-chain")}>View Process Chain</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => router.push(`/business-process/process-directory/${activity.processId}`)}>View KPI</Button>
          </div>
        </Section>

        <Section title="People Assigned to This Activity">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-xs text-[#94A3B8]">
                <tr>
                  <th className="p-2 text-left">Employee</th><th className="p-2 text-left">Employee ID</th><th className="p-2 text-left">Position</th><th className="p-2 text-left">Department</th><th className="p-2 text-right">Allocation %</th><th className="p-2 text-right">Capacity Contribution</th><th className="p-2 text-right">Workload from This Activity</th><th className="p-2 text-right">Other Workload</th><th className="p-2 text-right">Total Workload</th><th className="p-2 text-right">Utilization</th><th className="p-2 text-left">Status</th><th className="p-2 text-right">Monthly Cost Contribution</th>
                </tr>
              </thead>
              <tbody>
                {assignedRows.map((row) => {
                  const empStatus = utilizationStatus(row.empUtil);
                  return (
                    <tr key={row.employee.id} className="border-t border-[#F1F5F9]">
                      <td className="p-2"><Link className="font-medium hover:underline" href={`/organization/employees/${row.employee.id}`}>{row.employee.name}</Link></td>
                      <td className="p-2">{row.employee.id}</td>
                      <td className="p-2"><Link className="hover:underline" href={`/organization/positions/${positions.find((p) => p.title === row.employee.position)?.id ?? ""}`}>{row.employee.position}</Link></td>
                      <td className="p-2">{row.employee.dept}</td>
                      <td className="p-2 text-right">{row.alloc}%</td>
                      <td className="p-2 text-right">{row.capContribution.toFixed(1)}h</td>
                      <td className="p-2 text-right">{row.thisActivityWorkload.toFixed(1)}h</td>
                      <td className="p-2 text-right">{row.otherWorkload.toFixed(1)}h</td>
                      <td className="p-2 text-right">{row.totalWorkload.toFixed(1)}h</td>
                      <td className="p-2 text-right">{row.empUtil.toFixed(0)}%</td>
                      <td className="p-2"><span className={`rounded-full px-2 py-1 text-xs ${empStatus.badge}`}>{empStatus.label}</span></td>
                      <td className="p-2 text-right">{formatRupiah(Math.round(row.monthlyCostContribution))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setAssignOpen(true)}>Add Employee</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setAssignOpen(true)}>Remove Employee</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setAssignOpen(true)}>Adjust Allocation</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => router.push("/organization/employees")}>View Employee Detail</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => responsiblePosition && router.push(`/organization/positions/${responsiblePosition.id}`)}>View Position Detail</Button>
          </div>
        </Section>

        <Section title="Workload Calculation Inputs">
          <div className="grid grid-cols-1 gap-3 text-sm lg:grid-cols-2">
            <p><b>Frequency Type:</b> {activity.frequencyType}</p>
            <p><b>Frequency Value:</b> {edit.frequencyValue} executions/month</p>
            <p><b>Average Duration per Execution:</b> {edit.duration} hours</p>
            <p><b>Complexity Multiplier:</b> {edit.complexityMultiplier}</p>
            <p><b>Quality Review Factor:</b> {edit.qualityReviewFactor}</p>
            <p><b>Seasonal Peak Factor:</b> {edit.seasonalPeakFactor}</p>
            <p><b>Rework Rate:</b> {(edit.reworkRate * 100).toFixed(0)}%</p>
            <p><b>Standard Monthly Capacity per FTE:</b> {WORKLOAD_CONSTANTS.monthlyHours} hours</p>
            <p><b>Productivity Factor:</b> {WORKLOAD_CONSTANTS.productivityFactor}</p>
            <p><b>Effective Capacity per FTE:</b> {effectiveCapacityPerFte.toFixed(0)} hours</p>
            <p><b>Assigned HC:</b> {assignedHc.toFixed(2)} FTE</p>
          </div>
        </Section>

        <Section title="Workload Formula">
          <div className="space-y-1 text-sm text-[#334155]">
            <p>Base Workload Hours = Frequency x Duration</p>
            <p>Adjusted Workload Hours = Base Workload Hours x Complexity Multiplier x Quality Review Factor x Seasonal Peak Factor x (1 + Rework Rate)</p>
            <p>Effective Capacity per FTE = Standard Monthly Capacity x Productivity Factor</p>
            <p>Required HC = Adjusted Workload Hours / Effective Capacity per FTE</p>
            <p>Utilization = Adjusted Workload Hours / Total Assigned Effective Capacity</p>
          </div>
        </Section>

        <Section title="Calculation Breakdown">
          <div className="space-y-1 text-sm text-[#334155]">
            <p>Frequency = {edit.frequencyValue} executions/month</p>
            <p>Duration = {edit.duration} hours</p>
            <p>Base Workload = {edit.frequencyValue} x {edit.duration} = {baseWorkloadHours.toFixed(2)} hours/month</p>
            <p>Complexity Multiplier = {edit.complexityMultiplier}</p>
            <p>Quality Review Factor = {edit.qualityReviewFactor}</p>
            <p>Seasonal Peak Factor = {edit.seasonalPeakFactor}</p>
            <p>Rework Rate = {(edit.reworkRate * 100).toFixed(0)}%</p>
            <p>Adjusted Workload = {baseWorkloadHours.toFixed(2)} x {edit.complexityMultiplier} x {edit.qualityReviewFactor} x {edit.seasonalPeakFactor} x {(1 + edit.reworkRate).toFixed(2)} = {adjustedWorkloadHours.toFixed(2)} hours/month</p>
            <p>Effective Capacity = {WORKLOAD_CONSTANTS.monthlyHours} x {WORKLOAD_CONSTANTS.productivityFactor} = {effectiveCapacityPerFte.toFixed(0)} hours/month</p>
            <p>Required HC = {adjustedWorkloadHours.toFixed(2)} / {effectiveCapacityPerFte.toFixed(0)} = {requiredHc.toFixed(2)} FTE</p>
            <p>Assigned HC = {assignedHc.toFixed(2)} FTE</p>
            <p>Utilization = {adjustedWorkloadHours.toFixed(2)} / {(assignedHc * effectiveCapacityPerFte).toFixed(2)} = {utilization.toFixed(0)}%</p>
            <p><b>Status:</b> {status.label}</p>
          </div>
        </Section>

        <Section title="Workload Output">
          <div className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
            <p><b>Base Workload Hours:</b> {baseWorkloadHours.toFixed(2)}</p>
            <p><b>Adjusted Workload Hours:</b> {adjustedWorkloadHours.toFixed(2)}</p>
            <p><b>Required HC:</b> {requiredHc.toFixed(2)}</p>
            <p><b>Assigned HC:</b> {assignedHc.toFixed(2)}</p>
            <p><b>HC Gap:</b> {hcGap.toFixed(2)}</p>
            <p><b>Utilization:</b> {utilization.toFixed(0)}%</p>
            <p><b>Staffing Status:</b> {status.label}</p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-56 rounded-xl bg-[#F8FAFC] p-3">
              <p className="text-xs font-semibold">Demand vs Capacity</p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={demandVsCapacityChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-56 rounded-xl bg-[#F8FAFC] p-3">
              <p className="text-xs font-semibold">Utilization Gauge</p>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart><Pie data={utilGauge} dataKey="value" innerRadius={45} outerRadius={70}>{utilGauge.map((_, idx) => <Cell key={idx} fill={idx === 0 ? (utilization > 110 ? "#DC2626" : utilization >= 90 ? "#16A34A" : "#F59E0B") : "#E2E8F0"} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-56 rounded-xl bg-[#F8FAFC] p-3">
              <p className="text-xs font-semibold">Required HC vs Assigned HC</p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={hcComparisonChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="required" fill="#2563EB" /><Bar dataKey="assigned" fill="#94A3B8" /></BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-56 rounded-xl bg-[#F8FAFC] p-3">
              <p className="text-xs font-semibold">Monthly Workload Trend</p>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={activityTrend}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="workload" stroke="#2563EB" strokeWidth={2} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Section>

        <Section title="Activity Cost">
          <div className="space-y-1 text-sm text-[#334155]">
            {assignedRows.map((row) => {
              const monthly = (row.employee as any).totalMonthlyCost ?? Math.round(((row.employee as any).cost ?? 360_000_000) / 12);
              return <p key={row.employee.id}>{row.employee.name} monthly cost: {formatRupiah(monthly)} x {row.alloc}% = {formatRupiah(Math.round(row.monthlyCostContribution))}</p>;
            })}
            <p className="mt-2"><b>Total Monthly Activity Cost:</b> {formatRupiah(Math.round(totalMonthlyActivityCost))}</p>
            <p><b>Annualized Activity Cost:</b> {formatRupiah(Math.round(annualizedActivityCost))}</p>
            <p><b>Cost per execution:</b> {formatRupiah(Math.round(costPerExecution))}</p>
            <p><b>Cost per workload hour:</b> {formatRupiah(Math.round(costPerWorkloadHour))}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => router.push("/financial/breakdown")}>Open Financial Cost Breakdown</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setScenarioOpen(true)}>Simulate Cost in Scenario</Button>
          </div>
        </Section>

        <Section title="Assignment & Capacity Analysis">
          <div className="space-y-1 text-sm text-[#334155]">
            <p><b>Assigned employees:</b> {assignedRows.length}</p>
            <p><b>Allocation split:</b> {assignedRows.map((r) => `${r.employee.name} ${r.alloc}%`).join(", ")}</p>
            <p><b>Available remaining capacity:</b> {(assignedRows.reduce((s, r) => s + Math.max(0, 136 - r.totalWorkload), 0)).toFixed(1)} hours/month</p>
            <p><b>Backup assignee availability:</b> {candidateEmployees.length - assignedRows.length} candidates</p>
            <p><b>Overload risk:</b> {status.label === "Overloaded" ? "High" : "Moderate"}</p>
            <p><b>Reassignment recommendation:</b> Current utilization is {utilization.toFixed(0)}%. Add {Math.max(requiredHc - assignedHc, 0).toFixed(2)} FTE or redistribute {(Math.max(adjustedWorkloadHours - assignedHc * effectiveCapacityPerFte, 0)).toFixed(1)} hours/month to reduce utilization.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl">Optimize Assignment</Button>
            <Button variant="outline" className="rounded-xl">Reassign Activity</Button>
            <Button variant="outline" className="rounded-xl">Add Backup Assignee</Button>
          </div>
        </Section>

        <Section title="KPI Impact">
          <div className="space-y-1 text-sm text-[#334155]">
            <p><b>Linked KPI:</b> {activity.linkedKpi}</p>
            <p><b>KPI Target:</b> {linkedProcess ? `${Math.min((linkedProcess as any).kpiScore + 8, 98)}%` : "95%"}</p>
            <p><b>KPI Actual:</b> {linkedProcess ? `${(linkedProcess as any).kpiScore ?? 88}%` : "88%"}</p>
            <p><b>KPI Trend:</b> {(activityTrend[0]?.utilization ?? 80)}% {"->"} {(activityTrend[5]?.utilization ?? 88)}%</p>
            <p><b>Activity contribution to KPI:</b> High impact on process execution timeliness and quality.</p>
            <p><b>Risk if activity remains overloaded:</b> Overloaded scheduling activities may reduce berthing punctuality.</p>
          </div>
        </Section>

        <Section title="System Links">
          <div className="grid grid-cols-1 gap-2 text-sm lg:grid-cols-2">
            <Link className="text-[#2563EB] hover:underline" href={`/business-process/process-directory/${activity.processId}`}>Business Process Detail</Link>
            <Link className="text-[#2563EB] hover:underline" href={responsiblePosition ? `/organization/positions/${responsiblePosition.id}` : "/organization/positions"}>Responsible Position Detail</Link>
            <Link className="text-[#2563EB] hover:underline" href="/organization/employees">Assigned Employee Details</Link>
            <Link className="text-[#2563EB] hover:underline" href="/workload-activity/workload-engine">Workload Engine</Link>
            <Link className="text-[#2563EB] hover:underline" href="/workload-activity/utilization-dashboard">Utilization Dashboard</Link>
            <Link className="text-[#2563EB] hover:underline" href="/workload-activity/assignment-management">Assignment Management</Link>
            <Link className="text-[#2563EB] hover:underline" href="/scenario/builder">Scenario Planning</Link>
            <Link className="text-[#2563EB] hover:underline" href="/financial/breakdown">Financial Cost Breakdown</Link>
          </div>
        </Section>

        <Section title="Audit & Change History">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-xs text-[#94A3B8]">
                <tr><th className="p-2 text-left">Date</th><th className="p-2 text-left">User</th><th className="p-2 text-left">Action</th><th className="p-2 text-left">Before</th><th className="p-2 text-left">After</th><th className="p-2 text-left">Approval Status</th></tr>
              </thead>
              <tbody>
                {auditRows.map((r) => <tr key={`${r.date}-${r.user}`} className="border-t border-[#F1F5F9]"><td className="p-2">{r.date}</td><td className="p-2">{r.user}</td><td className="p-2">{r.action}</td><td className="p-2">{r.before}</td><td className="p-2">{r.after}</td><td className="p-2">{r.approval}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setHistoryOpen(true)}>View Audit Detail</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setExportOpen(true)}>Export History</Button>
          </div>
        </Section>
      </main>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Edit Activity</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Activity Name</Label><Input value={edit.activityName} onChange={(e) => setEdit((s) => ({ ...s, activityName: e.target.value }))} /></div>
            <div><Label>Description</Label><Input value={edit.description} onChange={(e) => setEdit((s) => ({ ...s, description: e.target.value }))} /></div>
            <div><Label>Linked Business Process</Label><Input value={linkedProcess?.name ?? ""} readOnly /></div>
            <div><Label>Responsible Position</Label><Input value={edit.responsiblePosition} onChange={(e) => setEdit((s) => ({ ...s, responsiblePosition: e.target.value }))} /></div>
            <div><Label>Frequency Value</Label><Input type="number" value={edit.frequencyValue} onChange={(e) => setEdit((s) => ({ ...s, frequencyValue: Number(e.target.value) || 0 }))} /></div>
            <div><Label>Duration</Label><Input type="number" step="0.1" value={edit.duration} onChange={(e) => setEdit((s) => ({ ...s, duration: Number(e.target.value) || 0 }))} /></div>
            <div><Label>Complexity Multiplier</Label><Input type="number" step="0.01" value={edit.complexityMultiplier} onChange={(e) => setEdit((s) => ({ ...s, complexityMultiplier: Number(e.target.value) || 1 }))} /></div>
            <div><Label>Quality Review Factor</Label><Input type="number" step="0.01" value={edit.qualityReviewFactor} onChange={(e) => setEdit((s) => ({ ...s, qualityReviewFactor: Number(e.target.value) || 1 }))} /></div>
            <div><Label>Seasonal Peak Factor</Label><Input type="number" step="0.01" value={edit.seasonalPeakFactor} onChange={(e) => setEdit((s) => ({ ...s, seasonalPeakFactor: Number(e.target.value) || 1 }))} /></div>
            <div><Label>Rework Rate</Label><Input type="number" step="0.01" value={edit.reworkRate} onChange={(e) => setEdit((s) => ({ ...s, reworkRate: Number(e.target.value) || 0 }))} /></div>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-3 text-sm">
            Before vs After: workload {activity.adjustedWorkload.toFixed(2)} {"->"} {adjustedWorkloadHours.toFixed(2)} hours/month, required HC {activity.requiredHc.toFixed(2)} {"->"} {requiredHc.toFixed(2)}, utilization {activity.utilization}% {"->"} {utilization.toFixed(0)}%, monthly cost {formatRupiah(Math.round((activity.adjustedWorkload / Math.max(adjustedWorkloadHours, 1)) * totalMonthlyActivityCost))} {"->"} {formatRupiah(Math.round(totalMonthlyActivityCost))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Save Draft</Button>
            <Button className="bg-[#2563EB] text-white" onClick={() => setEditOpen(false)}>Submit Change for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Employees</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {candidateEmployees.map((e) => {
              const checked = assignedEmployees.includes(e.id);
              return (
                <label key={e.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <span>{e.name} · {e.position}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(ev) => setAssignedEmployees((prev) => (ev.target.checked ? [...new Set([...prev, e.id])] : prev.filter((id) => id !== e.id)))}
                    />
                    <Input className="h-8 w-20" type="number" value={allocationPercent[e.id] ?? 20} onChange={(ev) => setAllocationPercent((p) => ({ ...p, [e.id]: Number(ev.target.value) || 0 }))} />
                  </div>
                </label>
              );
            })}
          </div>
          <DialogFooter><Button className="bg-[#2563EB] text-white" onClick={() => setAssignOpen(false)}>Apply Assignment</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={recalcOpen} onOpenChange={setRecalcOpen}><DialogContent><DialogHeader><DialogTitle>Recalculate Workload</DialogTitle></DialogHeader><p className="text-sm text-[#475569]">Workload, required HC, utilization, and monthly cost have been recalculated using latest inputs.</p><DialogFooter><Button className="bg-[#2563EB] text-white" onClick={() => setRecalcOpen(false)}>Done</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={scenarioOpen} onOpenChange={setScenarioOpen}><DialogContent><DialogHeader><DialogTitle>Simulate in Scenario</DialogTitle></DialogHeader><p className="text-sm text-[#475569]">Scenario draft will be created under {scenarios[0]?.name ?? "Baseline"} with updated activity workload and cost impact.</p><DialogFooter><Button variant="outline" onClick={() => setScenarioOpen(false)}>Cancel</Button><Button className="bg-[#2563EB] text-white" onClick={() => setScenarioOpen(false)}>Create Scenario Draft</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={exportOpen} onOpenChange={setExportOpen}><DialogContent><DialogHeader><DialogTitle>Export Activity Detail</DialogTitle></DialogHeader><p className="text-sm text-[#475569]">Export includes profile, process linkage, assignees, workload calculations, and cost breakdown.</p><DialogFooter><Button variant="outline" onClick={() => setExportOpen(false)}>Close</Button><Button className="bg-[#2563EB] text-white" onClick={() => setExportOpen(false)}>Export PDF Summary</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}><DialogContent><DialogHeader><DialogTitle>Audit Detail</DialogTitle></DialogHeader><p className="text-sm text-[#475569]">Detailed audit trail is available in Activity Governance logs.</p><DialogFooter><Button className="bg-[#2563EB] text-white" onClick={() => setHistoryOpen(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
