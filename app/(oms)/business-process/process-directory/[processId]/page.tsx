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
  unifiedProcessList as processList,
  unifiedWorkloadActivities as workloadActivities,
  unifiedProcessIOMapping as processIOMapping,
  unifiedProcessDependencies as processDependencies,
  unifiedProcessKPIMaps as processKPIMaps,
  unifiedEmployeesAll as employeesAll,
  unifiedPositions as positions,
  unifiedScenarios as scenarios,
  unifiedWORKLOAD_CONSTANTS as WORKLOAD_CONSTANTS,
  unifiedAIInsights as aiInsights,
} from "@/lib/om-metrics";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <h2 className="text-[18px] font-semibold text-[#0F172A]">{title}</h2>
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
  const [auditOpen, setAuditOpen] = useState(false);

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
  const inputs = processIOMapping.filter((io) => io.toProcess === process.id);
  const outputs = processIOMapping.filter((io) => io.fromProcess === process.id);
  const deps = processDependencies.filter((d) => d.fromProcess === process.id || d.toProcess === process.id);
  const upstream = deps.filter((d) => d.toProcess === process.id).map((d) => processList.find((p) => p.id === d.fromProcess)).filter(Boolean);
  const downstream = deps.filter((d) => d.fromProcess === process.id).map((d) => processList.find((p) => p.id === d.toProcess)).filter(Boolean);
  const ownerPosition = positions.find((p) => p.title === process.owner);
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

  const kpiTrend = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((m, i) => ({
    month: m,
    target: Math.min(process.kpiScore + 6, 96),
    actual: Math.max(60, Math.min(98, process.kpiScore - 5 + i * 1.2)),
  }));

  const workloadByActivityChart = activityRows.map((r) => ({ name: r.a.name.slice(0, 14), workload: Math.round(r.a.adjustedWorkload) }));
  const utilByPositionChart = involvedPeople.slice(0, 8).map((p) => ({ name: p.position.slice(0, 14), util: Math.round(p.utilization) }));
  const demandCapacityChart = [{ name: "Demand", value: Math.round(totalAdjustedWorkload) }, { name: "Capacity", value: Math.round(assignedHc * WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor) }];
  const costByActivityChart = activityRows.map((r) => ({ name: r.a.name.slice(0, 12), value: Math.round(r.activityCost) }));
  const costByPositionChart = involvedPeople.slice(0, 8).map((p) => ({ name: p.position.slice(0, 12), value: Math.round(p.monthlyCostContribution) }));
  const costUtilChart = involvedPeople.slice(0, 8).map((p) => ({ name: p.position.slice(0, 10), util: Math.round(p.utilization), cost: Math.round(p.monthlyCostContribution / 1_000_000) }));

  const processInsight = aiInsights.find((i) => i.affectedProcesses.includes(process.name) || i.affectedProcesses.includes(process.id));
  const processScenarios = scenarios.slice(0, 4).map((s, idx) => ({
    name: s.name,
    changeType: ["Activity change", "Owner change", "Staffing change", "Automation"][idx % 4],
    workloadImpact: `${idx % 2 === 0 ? "-" : "+"}${8 + idx * 3}%`,
    costImpact: `${idx % 2 === 0 ? "-" : "+"}${formatRupiah(120_000_000 + idx * 50_000_000)}/month`,
    kpiImpact: `${idx % 2 === 0 ? "+" : "-"}${3 + idx}%`,
    status: idx === 0 ? "Active" : "Draft",
  }));

  const auditRows = [
    { date: "2026-03-11", user: "Raka Kusuma", action: "Changed process owner", before: "Supervisor Pelayanan Kapal", after: "Manager Pelayanan Kapal", approval: "Approved" },
    { date: "2026-03-15", user: "Citra Dewi", action: "Added activity", before: "-", after: "Check Yard Capacity", approval: "Pending" },
  ];

  const staffingStatus = avgUtil > 110 ? "At Risk" : avgUtil >= 90 ? "Balanced" : "Underutilized";
  const processLevel = process.code.includes(".") ? "L3" : process.code.split("-").length > 1 ? "L2" : "L1";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="space-y-6 p-6">
        <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] text-[#64748B]">Business Process Management &gt; Process Directory &gt; {process.name}</p>
          <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-[28px] font-bold text-[#0F172A]">Process Detail — {process.name}</h1>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-8 rounded-xl" onClick={() => setEditOpen(true)}>Edit Process</Button>
              <Button size="sm" variant="outline" className="h-8 rounded-xl" onClick={() => setAddActivityOpen(true)}>Add Activity</Button>
              <Button size="sm" variant="outline" className="h-8 rounded-xl" onClick={() => setLinkKpiOpen(true)}>Link KPI</Button>
              <Button size="sm" variant="outline" className="h-8 rounded-xl" onClick={() => setSimulateOpen(true)}>Simulate in Scenario</Button>
              <Button size="sm" className="h-8 rounded-xl bg-[#2563EB] text-white" onClick={() => setExportOpen(true)}>Export Process Detail</Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {[
            ["Process KPI Score", `${process.kpiScore}%`],
            ["SLA Compliance", `${Math.round((process.sla / Math.max(process.actualTime, 1)) * 100)}%`],
            ["Linked Activities", `${processActivities.length} activities`],
            ["Total Workload", `${Math.round(totalAdjustedWorkload)} hours/month`],
            ["Process Cost", `${formatRupiah(Math.round(processMonthlyCost))}/month`],
            ["Staffing Status", staffingStatus],
          ].map(([label, value]) => (
            <article key={label} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <p className="text-xs text-[#94A3B8]">{label}</p>
              <p className="mt-1 text-xl font-bold text-[#0F172A]">{value}</p>
            </article>
          ))}
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

            <Section title="Input / Output Mapping">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F8FAFC] text-xs text-[#94A3B8]"><tr><th className="p-2 text-left">Input Name</th><th className="p-2 text-left">Input Type</th><th className="p-2 text-left">Source Process</th><th className="p-2 text-left">Source Department</th><th className="p-2 text-left">Data Owner</th><th className="p-2 text-left">Frequency</th><th className="p-2 text-left">Quality Status</th></tr></thead>
                    <tbody>{inputs.map((i) => <tr key={i.id} className="border-t border-[#F1F5F9]"><td className="p-2">{i.input}</td><td className="p-2">{i.dataType}</td><td className="p-2">{processList.find((p) => p.id === i.fromProcess)?.name ?? "-"}</td><td className="p-2">{processList.find((p) => p.id === i.fromProcess)?.dept ?? "-"}</td><td className="p-2">{process.owner}</td><td className="p-2">{i.frequency}</td><td className="p-2">Good</td></tr>)}</tbody>
                  </table>
                </div>
                <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F8FAFC] text-xs text-[#94A3B8]"><tr><th className="p-2 text-left">Output Name</th><th className="p-2 text-left">Output Type</th><th className="p-2 text-left">Receiving Process</th><th className="p-2 text-left">Receiving Department</th><th className="p-2 text-left">Output Owner</th><th className="p-2 text-left">SLA</th><th className="p-2 text-left">Status</th></tr></thead>
                    <tbody>{outputs.map((o) => <tr key={o.id} className="border-t border-[#F1F5F9]"><td className="p-2">{o.output}</td><td className="p-2">{o.dataType}</td><td className="p-2">{processList.find((p) => p.id === o.toProcess)?.name ?? "-"}</td><td className="p-2">{processList.find((p) => p.id === o.toProcess)?.dept ?? "-"}</td><td className="p-2">{process.owner}</td><td className="p-2">{process.sla} days</td><td className="p-2">{process.status}</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl">Add Input</Button>
                <Button variant="outline" className="rounded-xl">Add Output</Button>
                <Button variant="outline" className="rounded-xl">Edit Mapping</Button>
              </div>
            </Section>

            <Section title="Activities">
              <div className="mb-3 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setAddActivityOpen(true)}>Add Activity</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => router.push("/workload-activity/workload-engine")}>Send to Workload Engine</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] text-xs text-[#94A3B8]">
                    <tr>
                      <th className="p-2 text-left">Step</th><th className="p-2 text-left">Activity Name</th><th className="p-2 text-left">Activity Description</th><th className="p-2 text-left">Responsible Position</th><th className="p-2 text-left">Assigned Employees</th><th className="p-2 text-right">Frequency / Month</th><th className="p-2 text-right">Duration</th><th className="p-2 text-right">Adjusted Workload</th><th className="p-2 text-right">Required HC</th><th className="p-2 text-right">Assigned HC</th><th className="p-2 text-right">Utilization</th><th className="p-2 text-left">Staffing</th><th className="p-2 text-right">Activity Cost</th><th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityRows.map((row) => (
                      <tr key={row.a.id} className="border-t border-[#F1F5F9]">
                        <td className="p-2">{row.a.seq}</td>
                        <td className="p-2"><button className="font-medium text-[#2563EB] hover:underline" onClick={() => router.push(`/workload-activity/activity-directory/${row.a.id}`)}>{row.a.name}</button></td>
                        <td className="p-2">{row.a.description}</td>
                        <td className="p-2">{row.a.responsiblePosition}</td>
                        <td className="p-2">{row.assignedNames || "-"}</td>
                        <td className="p-2 text-right">{row.a.frequencyValue}</td>
                        <td className="p-2 text-right">{row.a.duration}h</td>
                        <td className="p-2 text-right">{Math.round(row.a.adjustedWorkload)}</td>
                        <td className="p-2 text-right">{row.requiredHc.toFixed(2)}</td>
                        <td className="p-2 text-right">{row.assignedHc.toFixed(2)}</td>
                        <td className="p-2 text-right">{Math.round(row.a.utilization)}%</td>
                        <td className="p-2"><span className={`rounded-full px-2 py-1 text-xs ${statusPill(row.a.staffingStatus)}`}>{row.a.staffingStatus}</span></td>
                        <td className="p-2 text-right">{formatRupiah(Math.round(row.activityCost))}</td>
                        <td className="p-2"><Button size="sm" variant="ghost" className="h-7 rounded-lg text-[#2563EB]" onClick={() => router.push(`/workload-activity/activity-directory/${row.a.id}`)}>View Detail</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="People & Positions Involved">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] text-xs text-[#94A3B8]"><tr><th className="p-2 text-left">Position</th><th className="p-2 text-left">Employee</th><th className="p-2 text-left">Role in Process</th><th className="p-2 text-right">Assigned Activities</th><th className="p-2 text-right">Allocation %</th><th className="p-2 text-right">Total Workload</th><th className="p-2 text-right">Utilization</th><th className="p-2 text-right">Monthly Cost Contribution</th><th className="p-2 text-left">Actions</th></tr></thead>
                  <tbody>
                    {involvedPeople.map((p) => (
                      <tr key={p.employee.id} className="border-t border-[#F1F5F9]">
                        <td className="p-2">{p.position}</td>
                        <td className="p-2">{p.employee.name}</td>
                        <td className="p-2">{p.roleInProcess}</td>
                        <td className="p-2 text-right">{p.activities}</td>
                        <td className="p-2 text-right">{Math.round(p.allocation)}%</td>
                        <td className="p-2 text-right">{Math.round(p.workload)}h</td>
                        <td className="p-2 text-right">{Math.round(p.utilization)}%</td>
                        <td className="p-2 text-right">{formatRupiah(Math.round(p.monthlyCostContribution))}</td>
                        <td className="p-2">
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
                <Button variant="outline" className="rounded-xl">Reassign Owner</Button>
                <Button variant="outline" className="rounded-xl">Add Supporting Position</Button>
              </div>
            </Section>
          </div>

          <div className="space-y-6 xl:col-span-4">
            <Section title="Linked KPI">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] text-xs text-[#94A3B8]"><tr><th className="p-2 text-left">KPI Name</th><th className="p-2 text-left">KPI Owner</th><th className="p-2 text-left">Unit</th><th className="p-2 text-right">Target</th><th className="p-2 text-right">Actual</th><th className="p-2 text-right">Variance</th><th className="p-2 text-left">Trend</th><th className="p-2 text-left">Status</th></tr></thead>
                  <tbody>
                    {processKpis.map((k) => {
                      const target = Number(k.target);
                      const actual = Number(k.actual);
                      const variance = actual - target;
                      return (
                        <tr key={k.kpiId} className="border-t border-[#F1F5F9]">
                          <td className="p-2">{k.kpiName}</td><td className="p-2">{process.owner}</td><td className="p-2">%</td>
                          <td className="p-2 text-right">{target}%</td><td className="p-2 text-right">{actual}%</td><td className="p-2 text-right">{variance > 0 ? "+" : ""}{variance}%</td>
                          <td className="p-2">Stable</td><td className="p-2"><span className={`rounded-full px-2 py-1 text-xs ${statusPill(variance < 0 ? "At Risk" : "On Track")}`}>{variance < 0 ? "At Risk" : "On Track"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-40 rounded-xl bg-[#F8FAFC] p-2">
                  <p className="text-xs font-semibold">KPI Trend</p>
                  <ResponsiveContainer width="100%" height="85%"><LineChart data={kpiTrend}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="target" stroke="#94A3B8" /><Line type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2} /></LineChart></ResponsiveContainer>
                </div>
                <div className="h-40 rounded-xl bg-[#F8FAFC] p-2">
                  <p className="text-xs font-semibold">Target vs Actual</p>
                  <ResponsiveContainer width="100%" height="85%"><BarChart data={[{ name: "KPI", target: Math.min(process.kpiScore + 6, 96), actual: process.kpiScore }]}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="target" fill="#94A3B8" /><Bar dataKey="actual" fill="#2563EB" /></BarChart></ResponsiveContainer>
                </div>
                <div className="h-40 rounded-xl bg-[#F8FAFC] p-2">
                  <p className="text-xs font-semibold">KPI Contribution by Activity</p>
                  <ResponsiveContainer width="100%" height="85%"><BarChart data={workloadByActivityChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis hide /><Tooltip /><Bar dataKey="workload" fill="#1D4ED8" /></BarChart></ResponsiveContainer>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setLinkKpiOpen(true)}>Link KPI</Button>
                <Button variant="outline" className="rounded-xl">Edit KPI Target</Button>
                <Button variant="outline" className="rounded-xl">Open KPI Drilldown</Button>
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
                <div className="h-40 rounded-xl bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Workload by Activity</p><ResponsiveContainer width="100%" height="85%"><BarChart data={workloadByActivityChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="workload" fill="#2563EB" /></BarChart></ResponsiveContainer></div>
                <div className="h-40 rounded-xl bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Utilization by Position</p><ResponsiveContainer width="100%" height="85%"><BarChart data={utilByPositionChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="util" fill="#0EA5E9" /></BarChart></ResponsiveContainer></div>
                <div className="h-40 rounded-xl bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Demand vs Capacity</p><ResponsiveContainer width="100%" height="85%"><BarChart data={demandCapacityChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#1D4ED8" /></BarChart></ResponsiveContainer></div>
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
                <div className="h-40 rounded-xl bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Cost by Activity</p><ResponsiveContainer width="100%" height="85%"><BarChart data={costByActivityChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis hide /><Tooltip formatter={(v: number) => formatRupiah(v)} /><Bar dataKey="value" fill="#2563EB" /></BarChart></ResponsiveContainer></div>
                <div className="h-40 rounded-xl bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Cost by Position</p><ResponsiveContainer width="100%" height="85%"><BarChart data={costByPositionChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis hide /><Tooltip formatter={(v: number) => formatRupiah(v)} /><Bar dataKey="value" fill="#0EA5E9" /></BarChart></ResponsiveContainer></div>
                <div className="h-40 rounded-xl bg-[#F8FAFC] p-2"><p className="text-xs font-semibold">Cost vs Utilization</p><ResponsiveContainer width="100%" height="85%"><BarChart data={costUtilChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="util" fill="#2563EB" /><Bar dataKey="cost" fill="#94A3B8" /></BarChart></ResponsiveContainer></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => router.push("/financial/breakdown")}>Open Financial Cost Breakdown</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setSimulateOpen(true)}>Simulate Cost in Scenario</Button>
              </div>
            </Section>

            <Section title="Process Health Analysis">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: "KPI Risk", status: process.kpiScore < 85 ? "At Risk" : "Healthy", evidence: `KPI score ${process.kpiScore}%`, rec: "Strengthen KPI ownership on critical activities." },
                  { key: "SLA Risk", status: process.actualTime > process.sla ? "At Risk" : "Healthy", evidence: `Actual ${process.actualTime}d vs SLA ${process.sla}d`, rec: "Reduce handoff delay between approvals." },
                  { key: "Workload Risk", status: avgUtil > 110 ? "At Risk" : "Healthy", evidence: `Average utilization ${Math.round(avgUtil)}%`, rec: "Redistribute workload from overloaded activities." },
                  { key: "Staffing Risk", status: hcGap > 0.05 ? "At Risk" : "Healthy", evidence: `HC gap ${hcGap.toFixed(2)} FTE`, rec: "Add support capacity or automate repetitive tasks." },
                  { key: "Cost Risk", status: costPerHour > 150_000 ? "At Risk" : "Healthy", evidence: `Cost/hour ${formatRupiah(Math.round(costPerHour))}`, rec: "Shift low-complexity tasks to lower-cost roles." },
                  { key: "Ownership Risk", status: ownerEmployee ? "Healthy" : "At Risk", evidence: ownerEmployee ? `Owner ${ownerEmployee.name} assigned` : "No clear owner employee", rec: "Assign explicit owner and backup owner." },
                ].map((card) => (
                  <div key={card.key} className="rounded-xl border border-[#E2E8F0] p-3 text-sm">
                    <p className="font-semibold text-[#0F172A]">{card.key}</p>
                    <p className="text-xs mt-1"><span className={`rounded-full px-2 py-0.5 ${statusPill(card.status)}`}>{card.status}</span></p>
                    <p className="mt-1 text-[#475569]"><b>Evidence:</b> {card.evidence}</p>
                    <p className="text-[#475569]"><b>Recommendation:</b> {card.rec}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Scenario Impact">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] text-xs text-[#94A3B8]"><tr><th className="p-2 text-left">Scenario Name</th><th className="p-2 text-left">Change Type</th><th className="p-2 text-left">Workload Impact</th><th className="p-2 text-left">Cost Impact</th><th className="p-2 text-left">KPI Impact</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Actions</th></tr></thead>
                  <tbody>
                    {processScenarios.map((s) => (
                      <tr key={s.name} className="border-t border-[#F1F5F9]">
                        <td className="p-2">{s.name}</td><td className="p-2">{s.changeType}</td><td className="p-2">{s.workloadImpact}</td><td className="p-2">{s.costImpact}</td><td className="p-2">{s.kpiImpact}</td><td className="p-2">{s.status}</td>
                        <td className="p-2"><div className="flex flex-wrap gap-1"><Button size="sm" variant="ghost" className="h-7 rounded-lg text-[#2563EB]" onClick={() => router.push("/scenario/directory")}>Open</Button><Button size="sm" variant="ghost" className="h-7 rounded-lg text-[#2563EB]" onClick={() => router.push("/scenario/comparison")}>Compare</Button><Button size="sm" variant="ghost" className="h-7 rounded-lg text-[#2563EB]" onClick={() => setSimulateOpen(true)}>Simulate</Button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <Section title="System Links">
              <div className="grid grid-cols-1 gap-2 text-sm lg:grid-cols-2">
                <Link className="text-[#2563EB] hover:underline" href="/business-process/process-chain">Process Chain</Link>
                <Link className="text-[#2563EB] hover:underline" href="/workload-activity/activity-directory">Activity Directory</Link>
                <Link className="text-[#2563EB] hover:underline" href="/workload-activity/workload-engine">Workload Engine</Link>
                <Link className="text-[#2563EB] hover:underline" href={ownerPosition ? `/organization/positions/${ownerPosition.id}` : "/organization/positions"}>Position Detail</Link>
                <Link className="text-[#2563EB] hover:underline" href={ownerEmployee ? `/organization/employees/${ownerEmployee.id}` : "/organization/employees"}>Employee Detail</Link>
                <Link className="text-[#2563EB] hover:underline" href="/financial/breakdown">Financial Cost Breakdown</Link>
                <Link className="text-[#2563EB] hover:underline" href="/scenario/builder">Scenario Planning</Link>
                <Link className="text-[#2563EB] hover:underline" href={processInsight ? `/ai/insights?insightId=${processInsight.id}` : "/ai/insights"}>AI Insights</Link>
              </div>
            </Section>
          </div>
          <div className="xl:col-span-4">
            <Section title="Audit & Version History">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] text-xs text-[#94A3B8]"><tr><th className="p-2 text-left">Date</th><th className="p-2 text-left">User</th><th className="p-2 text-left">Action</th><th className="p-2 text-left">Before</th><th className="p-2 text-left">After</th><th className="p-2 text-left">Approval</th></tr></thead>
                  <tbody>{auditRows.map((r) => <tr key={`${r.date}-${r.user}`} className="border-t border-[#F1F5F9]"><td className="p-2">{r.date}</td><td className="p-2">{r.user}</td><td className="p-2">{r.action}</td><td className="p-2">{r.before}</td><td className="p-2">{r.after}</td><td className="p-2">{r.approval}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setAuditOpen(true)}>View Audit Detail</Button>
                <Button variant="outline" className="rounded-xl">Compare Version</Button>
                <Button variant="outline" className="rounded-xl">Restore Previous Version</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setExportOpen(true)}>Export History</Button>
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
      <Dialog open={auditOpen} onOpenChange={setAuditOpen}>
        <DialogContent><DialogHeader><DialogTitle>Audit Detail</DialogTitle></DialogHeader><p className="text-sm text-[#475569]">Detailed audit log and previous versions are available in governance archive.</p><DialogFooter><Button className="bg-[#2563EB] text-white" onClick={() => setAuditOpen(false)}>Close</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
}
