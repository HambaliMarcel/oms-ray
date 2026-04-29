"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, BadgeDollarSign, Gauge, Layers3, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/lib/currency";
import {
  unifiedProcessList as processList,
  unifiedWorkloadActivities as workloadActivities,
  unifiedProcessIOMapping as processIOMapping,
  unifiedProcessDependencies as processDependencies,
  unifiedProcessKPIMaps as processKPIMaps,
  unifiedEmployeesAll as employeesAll,
  unifiedPositions as positions,
  unifiedWORKLOAD_CONSTANTS as WORKLOAD_CONSTANTS,
} from "@/lib/om-metrics";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#EEF2F7] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-[#0F172A]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function statusPill(status: string) {
  if (status.toLowerCase().includes("critical")) return "bg-red-50 text-red-600";
  if (status.toLowerCase().includes("risk")) return "bg-amber-50 text-amber-600";
  return "bg-emerald-50 text-emerald-600";
}

export default function ProcessDetailPage({ params }: { params: Promise<{ processId: string }> }) {
  const { processId } = use(params);
  const router = useRouter();
  const process = processList.find((p) => p.id === processId);

  const [editOpen, setEditOpen] = useState(false);
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  const [linkKpiOpen, setLinkKpiOpen] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  if (!process) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8">
        <div className="rounded-2xl bg-white p-8 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-sm text-[#475569]">Process not found.</p>
          <Button className="mt-4 rounded-xl bg-[#2563EB] text-white" onClick={() => router.push("/business-process/process-directory")}>
            Back to Process Directory
          </Button>
        </div>
      </div>
    );
  }

  const processActivities = workloadActivities
    .filter((a) => a.processId === process.id)
    .sort((a, b) => a.seq - b.seq);
  const processKpis = processKPIMaps.filter((k) => k.processId === process.id);
  const outputs = processIOMapping.filter((io) => io.fromProcess === process.id);
  const deps = processDependencies.filter((d) => d.fromProcess === process.id || d.toProcess === process.id);
  const upstream = deps.filter((d) => d.toProcess === process.id).map((d) => processList.find((p) => p.id === d.fromProcess)).filter(Boolean);
  const downstream = deps.filter((d) => d.fromProcess === process.id).map((d) => processList.find((p) => p.id === d.toProcess)).filter(Boolean);
  const ownerEmployee = employeesAll.find((e) => e.position === process.owner) ?? employeesAll.find((e) => e.id === process.ownerId);

  const activityRows = processActivities.map((a) => {
    const assigned = employeesAll.filter((e) => a.assignedEmployees.includes(e.id));
    const assignedNames = assigned.map((e) => e.name).join(", ");
    const assignedHc = a.assignedHc;
    const requiredHc = a.requiredHc;
    const allocAverage = assigned.length ? Math.round(100 / assigned.length) : 0;
    const activityCost = assigned.reduce((sum, e) => {
      const monthly = (e as any).totalMonthlyCost ?? Math.round(((e as any).cost ?? 360_000_000) / 12);
      return sum + monthly * (allocAverage / 100);
    }, 0);
    return { a, assigned, assignedNames, assignedHc, requiredHc, activityCost };
  });

  const totalBaseWorkload = activityRows.reduce((s, r) => s + r.a.baseWorkload, 0);
  const totalAdjustedWorkload = activityRows.reduce((s, r) => s + r.a.adjustedWorkload, 0);
  const requiredHc = totalAdjustedWorkload / (WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor);
  const assignedHc = activityRows.reduce((s, r) => s + r.assignedHc, 0);
  const hcGap = requiredHc - assignedHc;
  const avgUtil = activityRows.length ? activityRows.reduce((s, r) => s + r.a.utilization, 0) / activityRows.length : 0;
  const overloadedCount = activityRows.filter((r) => r.a.utilization > 110).length;
  const underutilizedCount = activityRows.filter((r) => r.a.utilization < 90).length;

  const processMonthlyCost = activityRows.reduce((s, r) => s + r.activityCost, 0);
  const processAnnualCost = processMonthlyCost * 12;
  const costPerActivity = processMonthlyCost / Math.max(activityRows.length, 1);
  const costPerOutput = processMonthlyCost / Math.max(outputs.length, 1);
  const costPerHour = processMonthlyCost / Math.max(totalAdjustedWorkload, 1);
  const highestCostActivity = [...activityRows].sort((x, y) => y.activityCost - x.activityCost)[0];

  const involvedPeople = useMemo(() => {
    const map = new Map<string, { employee: (typeof employeesAll)[number]; position: string; roleInProcess: string; activities: number; allocation: number; workload: number; utilization: number; monthlyCostContribution: number }>();
    activityRows.forEach(({ a, assigned }) => {
      assigned.forEach((e) => {
        const key = e.id;
        const prev = map.get(key) ?? {
          employee: e,
          position: e.position,
          roleInProcess: e.position === process.owner ? "Owner" : "Executor",
          activities: 0,
          allocation: 0,
          workload: 0,
          utilization: 0,
          monthlyCostContribution: 0,
        };
        const alloc = assigned.length ? 100 / assigned.length : 0;
        const monthly = (e as any).totalMonthlyCost ?? Math.round(((e as any).cost ?? 360_000_000) / 12);
        prev.activities += 1;
        prev.allocation += alloc;
        prev.workload += a.adjustedWorkload * (alloc / 100);
        prev.utilization = (prev.workload / (WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor)) * 100;
        prev.monthlyCostContribution += monthly * (alloc / 100);
        map.set(key, prev);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.utilization - a.utilization);
  }, [activityRows, process.owner]);

  const workloadByActivityChart = activityRows.map((r) => ({ name: r.a.name.slice(0, 14), workload: Math.round(r.a.adjustedWorkload) }));
  const utilByPositionChart = involvedPeople.slice(0, 8).map((p) => ({ name: p.position.slice(0, 14), util: Math.round(p.utilization) }));
  const demandCapacityChart = [{ name: "Demand", value: Math.round(totalAdjustedWorkload) }, { name: "Capacity", value: Math.round(assignedHc * WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor) }];
  const costByActivityChart = activityRows.map((r) => ({ name: r.a.name.slice(0, 12), value: Math.round(r.activityCost) }));
  const costByPositionChart = involvedPeople.slice(0, 8).map((p) => ({ name: p.position.slice(0, 12), value: Math.round(p.monthlyCostContribution) }));
  const costUtilChart = involvedPeople.slice(0, 8).map((p) => ({ name: p.position.slice(0, 10), util: Math.round(p.utilization), cost: Math.round(p.monthlyCostContribution / 1_000_000) }));
  const activityAssigneeRows = activityRows.flatMap((row) => {
    if (row.assigned.length === 0) {
      return [{ row, assigneeName: "-", perAssigneeHc: row.assignedHc }];
    }
    const perAssigneeHc = row.assignedHc / row.assigned.length;
    return row.assigned.map((emp) => ({
      row,
      assigneeName: emp.name,
      perAssigneeHc,
    }));
  });

  const staffingStatus = avgUtil > 110 ? "At Risk" : avgUtil >= 90 ? "Balanced" : "Underutilized";
  const processLevel = process.code.includes(".") ? "L3" : process.code.split("-").length > 1 ? "L2" : "L1";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="space-y-6 p-6">
        <section className="rounded-2xl border border-[#E6EDF8] bg-gradient-to-b from-white to-[#F8FBFF] px-5 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <p className="text-[11px] text-[#64748B]">Business Process Management &gt; Process Directory &gt; {process.name}</p>
          <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#0F172A]">Process Detail — {process.name}</h1>
              <p className="mt-1 text-xs text-[#64748B]">Operational execution, workload structure, cost exposure, and KPI linkage in one view.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-8 rounded-xl" onClick={() => setEditOpen(true)}>Edit Process</Button>
              <Button size="sm" variant="outline" className="h-8 rounded-xl" onClick={() => setAddActivityOpen(true)}>Add Activity</Button>
              <Button size="sm" variant="outline" className="h-8 rounded-xl" onClick={() => setLinkKpiOpen(true)}>Link KPI</Button>
              <Button size="sm" variant="outline" className="h-8 rounded-xl" onClick={() => setSimulateOpen(true)}>Simulate in Scenario</Button>
              <Button size="sm" className="h-8 rounded-xl bg-[#2563EB] text-white" onClick={() => setExportOpen(true)}>Export Process Detail</Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <Section title="Process Profile">
              <div className="grid grid-cols-1 gap-3 text-sm lg:grid-cols-2">
                <p><b>Process ID:</b> {process.code}</p><p><b>Process Name:</b> {process.name}</p>
                <p><b>Process Description:</b> {process.description}</p><p><b>Process Category:</b> {process.category}</p>
                <p><b>Process Level:</b> {processLevel}</p><p><b>Owning Organization:</b> PT Pelabuhan Indonesia (Persero)</p>
                <p><b>Division:</b> {process.dept}</p><p><b>Department:</b> {process.dept}</p>
                <p><b>Process Owner Position:</b> {process.owner}</p><p><b>Process Owner Employee:</b> {ownerEmployee?.name ?? "Not assigned"}</p>
                <p><b>Process Status:</b> <span className={`rounded-full px-2 py-1 text-xs ${statusPill(process.status)}`}>{process.status}</span></p>
                <p><b>Process Criticality:</b> {process.bottleneck ? "High" : "Medium"}</p>
                <p><b>Last Updated:</b> {process.lastUpdated}</p>
              </div>
            </Section>

            <Section title="Process Chain Context">
              <div className="rounded-xl bg-[#F8FAFC] p-4 text-sm">
                <p><b>Dependency Type:</b> Sequential</p>
                <p><b>Handoff Points:</b> {deps.length} mapped dependencies</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-white px-3 py-2">{upstream[0]?.name ?? "No upstream"}</span>
                  <span>-&gt;</span>
                  <span className="rounded-lg bg-[#DBEAFE] px-3 py-2 font-semibold text-[#1D4ED8]">{process.name}</span>
                  <span>-&gt;</span>
                  <span className="rounded-lg bg-white px-3 py-2">{downstream[0]?.name ?? "No downstream"}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => router.push("/business-process/process-chain")}>Open Process Chain</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditOpen(true)}>Modify Dependency</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => upstream[0] && router.push(`/business-process/process-directory/${upstream[0].id}`)}>View Upstream Process</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => downstream[0] && router.push(`/business-process/process-directory/${downstream[0].id}`)}>View Downstream Process</Button>
              </div>
            </Section>

            <Section title="Activities">
              <div className="mb-3 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setAddActivityOpen(true)}>Add Activity</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => router.push("/workload-activity/workload-engine")}>Send to Workload Engine</Button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-[#EEF2F7]">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] text-xs font-medium text-[#94A3B8]">
                    <tr>
                      <th className="px-3 py-3 text-left">Step</th><th className="px-3 py-3 text-left">Activity Name</th><th className="px-3 py-3 text-left">Activity Description</th><th className="px-3 py-3 text-left">Responsible Position</th><th className="px-3 py-3 text-left">Assigned Employee</th>
                      <th className="px-3 py-3 text-right">Frequency / Month</th><th className="px-3 py-3 text-right">Duration</th><th className="px-3 py-3 text-right">Adjusted Workload</th><th className="px-3 py-3 text-right">Required HC</th><th className="px-3 py-3 text-right">Assigned HC</th><th className="px-3 py-3 text-right">Utilization</th><th className="px-3 py-3 text-left">Staffing</th><th className="px-3 py-3 text-right">Activity Cost</th><th className="px-3 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityAssigneeRows.map(({ row, assigneeName, perAssigneeHc }, idx) => (
                      <tr key={`${row.a.id}-${assigneeName}-${idx}`} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                        <td className="px-3 py-3">{row.a.seq}</td>
                        <td className="px-3 py-3"><button className="font-medium text-[#2563EB] hover:underline" onClick={() => router.push(`/workload-activity/activity-directory/${row.a.id}`)}>{row.a.name}</button></td>
                        <td className="px-3 py-3">{row.a.description}</td>
                        <td className="px-3 py-3">{row.a.responsiblePosition}</td>
                        <td className="px-3 py-3">{assigneeName}</td>
                        <td className="px-3 py-3 text-right">{row.a.frequencyValue}</td>
                        <td className="px-3 py-3 text-right">{row.a.duration}h</td>
                        <td className="px-3 py-3 text-right">{Math.round(row.a.adjustedWorkload)}</td>
                        <td className="px-3 py-3 text-right">{row.requiredHc.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right">{perAssigneeHc.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right">{Math.round(row.a.utilization)}%</td>
                        <td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs ${statusPill(row.a.staffingStatus)}`}>{row.a.staffingStatus}</span></td>
                        <td className="px-3 py-3 text-right">{formatRupiah(Math.round(row.activityCost))}</td>
                        <td className="px-3 py-3"><Button size="sm" variant="ghost" className="h-7 rounded-lg text-[#2563EB]" onClick={() => router.push(`/workload-activity/activity-directory/${row.a.id}`)}>View Detail</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="People & Positions Involved">
              <div className="overflow-x-auto rounded-xl border border-[#EEF2F7]">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] text-xs font-medium text-[#94A3B8]"><tr><th className="px-3 py-3 text-left">Position</th><th className="px-3 py-3 text-left">Employee</th><th className="px-3 py-3 text-right">Assigned Activities</th><th className="px-3 py-3 text-right">Total Workload</th><th className="px-3 py-3 text-right">Utilization</th><th className="px-3 py-3 text-right">Monthly Cost Contribution</th><th className="px-3 py-3 text-left">Actions</th></tr></thead>
                  <tbody>
                    {involvedPeople.map((p) => (
                      <tr key={p.employee.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                        <td className="px-3 py-3">{p.position}</td>
                        <td className="px-3 py-3">{p.employee.name}</td>
                        <td className="px-3 py-3 text-right">{p.activities}</td>
                        <td className="px-3 py-3 text-right">{Math.round(p.workload)}h</td>
                        <td className="px-3 py-3 text-right">{Math.round(p.utilization)}%</td>
                        <td className="px-3 py-3 text-right">{formatRupiah(Math.round(p.monthlyCostContribution))}</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1">
                            <Button size="sm" variant="ghost" className="h-7 rounded-lg text-[#2563EB]" onClick={() => router.push(`/organization/positions/${positions.find((x) => x.title === p.position)?.id ?? ""}`)}>Position</Button>
                            <Button size="sm" variant="ghost" className="h-7 rounded-lg text-[#2563EB]" onClick={() => router.push(`/organization/employees/${p.employee.id}`)}>Employee</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setEditOpen(true)}>Reassign Owner</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => router.push(`/organization/positions/create?processId=${process.id}`)}>Add Supporting Position</Button>
              </div>
            </Section>
          </div>

          <div className="space-y-6 xl:col-span-4">
            <Section title="Linked KPI">
              <div className="overflow-x-auto rounded-xl border border-[#EEF2F7]">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] text-xs font-medium text-[#94A3B8]"><tr><th className="px-3 py-3 text-left">KPI Name</th><th className="px-3 py-3 text-left">KPI Owner</th><th className="px-3 py-3 text-left">Unit</th><th className="px-3 py-3 text-right">Target</th><th className="px-3 py-3 text-right">Actual</th><th className="px-3 py-3 text-right">Variance</th><th className="px-3 py-3 text-left">Trend</th><th className="px-3 py-3 text-left">Status</th></tr></thead>
                  <tbody>
                    {processKpis.map((k) => {
                      const target = Number(k.target);
                      const actual = Number(k.actual);
                      const variance = actual - target;
                      return (
                        <tr key={k.kpiId} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                          <td className="px-3 py-3">{k.kpiName}</td><td className="px-3 py-3">{process.owner}</td><td className="px-3 py-3">%</td>
                          <td className="px-3 py-3 text-right">{target}%</td><td className="px-3 py-3 text-right">{actual}%</td><td className="px-3 py-3 text-right">{variance > 0 ? "+" : ""}{variance}%</td>
                          <td className="px-3 py-3">Stable</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs ${statusPill(variance < 0 ? "At Risk" : "On Track")}`}>{variance < 0 ? "At Risk" : "On Track"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-xs text-[#64748B]">KPI infographic charts removed from this section.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setLinkKpiOpen(true)}>Link KPI</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setLinkKpiOpen(true)}>Edit KPI Target</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => router.push("/business-process/process-directory")}>Open KPI Drilldown</Button>
              </div>
            </Section>

            <Section title="Process Workload Summary">
              <div className="space-y-1 text-sm">
                <p><b>Total base workload hours:</b> {Math.round(totalBaseWorkload)}</p>
                <p><b>Total adjusted workload hours:</b> {Math.round(totalAdjustedWorkload)}</p>
                <p><b>Required HC:</b> {requiredHc.toFixed(2)}</p>
                <p><b>Assigned HC:</b> {assignedHc.toFixed(2)}</p>
                <p><b>HC Gap:</b> {hcGap.toFixed(2)}</p>
                <p><b>Average utilization:</b> {Math.round(avgUtil)}%</p>
                <p><b>Overloaded activities count:</b> {overloadedCount}</p>
                <p><b>Underutilized activities count:</b> {underutilizedCount}</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-40 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Workload by Activity</p><ResponsiveContainer width="100%" height="85%"><BarChart data={workloadByActivityChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="workload" fill="#2563EB" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                <div className="h-40 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Utilization by Position</p><ResponsiveContainer width="100%" height="85%"><BarChart data={utilByPositionChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="util" fill="#0EA5E9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                <div className="h-40 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Demand vs Capacity</p><ResponsiveContainer width="100%" height="85%"><BarChart data={demandCapacityChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#1D4ED8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
              </div>
            </Section>

            <Section title="Process Cost">
              <div className="space-y-1 text-sm">
                <p><b>Total monthly process cost:</b> {formatRupiah(Math.round(processMonthlyCost))}</p>
                <p><b>Annualized process cost:</b> {formatRupiah(Math.round(processAnnualCost))}</p>
                <p><b>Cost per activity:</b> {formatRupiah(Math.round(costPerActivity))}</p>
                <p><b>Cost per output:</b> {formatRupiah(Math.round(costPerOutput))}</p>
                <p><b>Cost per workload hour:</b> {formatRupiah(Math.round(costPerHour))}</p>
                <p><b>Highest cost activity:</b> {highestCostActivity?.a.name ?? "-"} ({formatRupiah(Math.round(highestCostActivity?.activityCost ?? 0))})</p>
                <p><b>Highest cost position:</b> {involvedPeople[0]?.position ?? "-"}</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-40 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Cost by Activity</p><ResponsiveContainer width="100%" height="85%"><BarChart data={costByActivityChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis hide /><Tooltip formatter={(v: number) => formatRupiah(v)} /><Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                <div className="h-40 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Cost by Position</p><ResponsiveContainer width="100%" height="85%"><BarChart data={costByPositionChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis hide /><Tooltip formatter={(v: number) => formatRupiah(v)} /><Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                <div className="h-40 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Cost vs Utilization</p><ResponsiveContainer width="100%" height="85%"><BarChart data={costUtilChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="util" fill="#2563EB" radius={[4, 4, 0, 0]} /><Bar dataKey="cost" fill="#94A3B8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => router.push("/financial/breakdown")}>Open Financial Cost Breakdown</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setSimulateOpen(true)}>Simulate Cost in Scenario</Button>
              </div>
            </Section>

          </div>
        </section>

      </main>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Edit Process</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Process Name</Label><Input defaultValue={process.name} /></div>
            <div><Label>Description</Label><Input defaultValue={process.description} /></div>
            <div><Label>Process Category</Label><Input defaultValue={process.category} /></div>
            <div><Label>Process Owner Position</Label><Input defaultValue={process.owner} /></div>
            <div><Label>Process Owner Employee</Label><Input defaultValue={ownerEmployee?.name ?? ""} /></div>
            <div><Label>Department</Label><Input defaultValue={process.dept} /></div>
            <div><Label>Upstream Process</Label><Input defaultValue={upstream[0]?.name ?? ""} /></div>
            <div><Label>Downstream Process</Label><Input defaultValue={downstream[0]?.name ?? ""} /></div>
            <div><Label>Linked KPI</Label><Input defaultValue={processKpis[0]?.kpiName ?? ""} /></div>
            <div><Label>Process Criticality</Label><Input defaultValue={process.bottleneck ? "High" : "Medium"} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className="bg-[#2563EB] text-white" onClick={() => setEditOpen(false)}>Save & Submit Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addActivityOpen} onOpenChange={setAddActivityOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Add Activity</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Activity Name</Label><Input /></div><div><Label>Description</Label><Input /></div>
            <div><Label>Step Number</Label><Input type="number" /></div><div><Label>Responsible Position</Label><Input defaultValue={process.owner} /></div>
            <div><Label>Assigned Employees</Label><Input placeholder="Employee IDs" /></div><div><Label>Frequency</Label><Input defaultValue={process.frequency} /></div>
            <div><Label>Duration</Label><Input type="number" step="0.1" defaultValue="1" /></div><div><Label>Complexity Multiplier</Label><Input type="number" step="0.01" defaultValue="1.15" /></div>
            <div><Label>Quality Review Factor</Label><Input type="number" step="0.01" defaultValue="1.10" /></div><div><Label>Seasonal Peak Factor</Label><Input type="number" step="0.01" defaultValue="1.20" /></div>
            <div><Label>Rework Rate</Label><Input type="number" step="0.01" defaultValue="0.08" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddActivityOpen(false)}>Cancel</Button>
            <Button className="bg-[#2563EB] text-white" onClick={() => setAddActivityOpen(false)}>Create Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={linkKpiOpen} onOpenChange={setLinkKpiOpen}>
        <DialogContent><DialogHeader><DialogTitle>Link KPI</DialogTitle></DialogHeader><p className="text-sm text-[#475569]">KPI linkage update will refresh process directory, chain, and dashboard indicators.</p><DialogFooter><Button variant="outline" onClick={() => setLinkKpiOpen(false)}>Cancel</Button><Button className="bg-[#2563EB] text-white" onClick={() => setLinkKpiOpen(false)}>Apply KPI Link</Button></DialogFooter></DialogContent>
      </Dialog>
      <Dialog open={simulateOpen} onOpenChange={setSimulateOpen}>
        <DialogContent><DialogHeader><DialogTitle>Simulate in Scenario</DialogTitle></DialogHeader><p className="text-sm text-[#475569]">Scenario draft will include process workload, cost, and KPI impact.</p><DialogFooter><Button variant="outline" onClick={() => setSimulateOpen(false)}>Cancel</Button><Button className="bg-[#2563EB] text-white" onClick={() => setSimulateOpen(false)}>Create Scenario Draft</Button></DialogFooter></DialogContent>
      </Dialog>
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent><DialogHeader><DialogTitle>Export Process Detail</DialogTitle></DialogHeader><p className="text-sm text-[#475569]">Export package includes profile, chain, KPI, activities, workload, and cost sections.</p><DialogFooter><Button variant="outline" onClick={() => setExportOpen(false)}>Close</Button><Button className="bg-[#2563EB] text-white" onClick={() => setExportOpen(false)}>Export PDF Summary</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
}
