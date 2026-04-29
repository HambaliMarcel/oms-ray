"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PositionDetailDrawer } from "./PositionDetailDrawer";
import { AIModuleLayout } from "./AIModuleLayout";
import { AIGeneratedPosition, unifiedAIGeneratedPositions, unifiedAIInsights } from "@/lib/om-metrics";
import { formatRupiah } from "@/lib/currency";

type AIPositionDetailPageProps = {
  positionId: string;
};

export function AIPositionDetailPage({ positionId }: AIPositionDetailPageProps) {
  const router = useRouter();
  const params = useSearchParams();
  const insightId = params.get("insightId");

  const initial = useMemo(() => {
    const exact = unifiedAIGeneratedPositions.find((p) => p.id === positionId);
    if (exact) return exact;

    const insight = unifiedAIInsights.find((i) => i.id === insightId);
    if (!insight) return unifiedAIGeneratedPositions[0];

    return (
      unifiedAIGeneratedPositions.find((p) => p.sourceInsight.toLowerCase().includes(insight.title.toLowerCase())) ||
      unifiedAIGeneratedPositions.find((p) => p.department === insight.department) ||
      unifiedAIGeneratedPositions[0]
    );
  }, [insightId, positionId]);

  const [position, setPosition] = useState<AIGeneratedPosition>(initial);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmAddOpen, setConfirmAddOpen] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const impactScoreLabel = position.impactAnalysis.riskReduction.toLowerCase().includes("high") ? "High Impact" : "Moderate Impact";
  const roundedHC = Math.max(1, Math.round(position.workloadAnalysis.requiredHC));

  const activityChart = position.linkedActivities.map((a) => ({ name: a.activityName.split(" ").slice(0, 2).join(" "), hours: a.monthlyWorkloadHours }));
  const processChart = position.linkedBusinessProcesses.map((p) => ({ name: p.processName.split(" ").slice(0, 2).join(" "), value: Number(p.currentKpi.replace("%", "")) || 0 }));

  return (
    <>
      <AIModuleLayout
        breadcrumb={`AI Module > AI Job Position > ${position.positionName}`}
        title={`AI Position Detail — ${position.positionName}`}
        subtitle="AI-generated organizational role design based on workload, business processes, and operational requirements"
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => setDrawerOpen(true)}>Edit Position</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setConfirmAddOpen(true)}>Add to Organization</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setScenarioModalOpen(true)}>Simulate in Scenario</Button>
            <Button className="rounded-xl bg-[#2563EB] text-white" onClick={() => setExportModalOpen(true)}>Export Position Design</Button>
          </>
        }
        kpis={
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["Required Headcount", `${position.workloadAnalysis.requiredHC} FTE (rounded ${roundedHC})`],
              ["Estimated Utilization", position.workloadAnalysis.expectedUtilization],
              ["Monthly Cost", formatRupiah(position.costEstimate.totalMonthlyCost)],
              ["Impact Score", impactScoreLabel],
            ].map(([label, value]) => (
              <article key={label} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <p className="text-xs text-[#94A3B8]">{label}</p>
                <p className="mt-1 text-xl font-bold text-[#0F172A]">{value}</p>
              </article>
            ))}
          </section>
        }
      >
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <h3 className="text-[18px] font-semibold text-[#0F172A]">Responsibilities</h3>
              <p className="mt-3 text-sm font-semibold text-[#0F172A]">Core Responsibilities</p>
              <div className="mt-2 space-y-1">{position.coreResponsibilities.map((item) => <p key={item} className="text-sm text-[#334155]">- {item}</p>)}</div>
              <p className="mt-4 text-sm font-semibold text-[#0F172A]">Key Deliverables</p>
              <div className="mt-2 space-y-1">{position.keyDeliverables.map((item) => <p key={item} className="text-sm text-[#334155]">- {item}</p>)}</div>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <h3 className="text-[18px] font-semibold text-[#0F172A]">Business Processes</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="text-left text-xs text-[#94A3B8]"><th className="py-2">Process Name</th><th>Role in Process</th><th>KPI Supported</th><th>KPI Target</th><th>Current KPI</th></tr></thead>
                  <tbody>
                    {position.linkedBusinessProcesses.map((p) => (
                      <tr key={p.processName} className="border-t border-[#F1F5F9] text-sm text-[#334155]">
                        <td className="py-2">{p.processName}</td><td>{p.roleInProcess}</td><td>{p.kpiSupported}</td><td>{p.targetKpi}</td><td>{p.currentKpi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <h3 className="text-[18px] font-semibold text-[#0F172A]">Activities</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="text-left text-xs text-[#94A3B8]"><th className="py-2">Activity Name</th><th>Frequency</th><th>Duration</th><th>Workload Hours</th><th>Assigned Role</th></tr></thead>
                  <tbody>
                    {position.linkedActivities.map((a) => (
                      <tr key={a.activityName} className="border-t border-[#F1F5F9] text-sm text-[#334155]">
                        <td className="py-2">{a.activityName}</td><td>{a.frequency}</td><td>{a.durationHours}h</td><td>{a.monthlyWorkloadHours}</td><td>{a.responsibleRole}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <h3 className="text-[18px] font-semibold text-[#0F172A]">Workload Analysis</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-[#334155]">
                <p>Base workload: {position.workloadAnalysis.baseWorkloadHours} hours</p>
                <p>Adjusted workload: {position.workloadAnalysis.adjustedWorkloadHours} hours</p>
                <p>Capacity: {position.workloadAnalysis.effectiveMonthlyCapacity} hours</p>
                <p>Required HC: {position.workloadAnalysis.requiredHC} FTE</p>
                <p>Expected utilization: {position.workloadAnalysis.expectedUtilization}</p>
                <p>Formula: Base x Complexity x Quality x (1+Rework)</p>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-56 rounded-xl bg-[#F8FAFC] p-3">
                  <p className="text-xs font-semibold text-[#0F172A]">Workload Distribution by Activity</p>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={activityChart}><CartesianGrid stroke="#E2E8F0" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="hours" fill="#2563EB" radius={[6, 6, 0, 0]} /></BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-56 rounded-xl bg-[#F8FAFC] p-3">
                  <p className="text-xs font-semibold text-[#0F172A]">Workload Distribution by Process</p>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart><Pie data={processChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#1D4ED8" /></PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </article>
          </div>

          <div className="space-y-6 xl:col-span-4">
            <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] text-sm text-[#334155]">
              <h3 className="text-[18px] font-semibold text-[#0F172A]">Position Overview</h3>
              <p className="mt-3"><b>Position Name:</b> {position.positionName}</p>
              <p><b>Nomenklatur Jabatan:</b> {position.nomenclature}</p>
              <p><b>Department:</b> {position.department}</p>
              <p><b>Job Family:</b> {position.jobFamily}</p>
              <p><b>Job Level:</b> {position.jobLevel}</p>
              <p><b>Reports To:</b> {position.reportsTo}</p>
              <p><b>Subordinates:</b> {position.directSubordinates.length ? position.directSubordinates.join(", ") : "None"}</p>
              <p><b>Employment Type:</b> {position.employmentType}</p>
              <p><b>Position Status:</b> {position.status}</p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] text-sm text-[#334155]">
              <h3 className="text-[18px] font-semibold text-[#0F172A]">Cost Estimate</h3>
              <p className="mt-3"><b>Base Salary:</b> {formatRupiah(position.costEstimate.baseSalary)}</p>
              <p><b>Allowances:</b> {formatRupiah(position.costEstimate.allowances)}</p>
              <p><b>Benefits:</b> {formatRupiah(position.costEstimate.benefits)}</p>
              <p><b>Bonus Allocation:</b> {formatRupiah(position.costEstimate.bonusAllocation)}</p>
              <p className="mt-2"><b>Monthly Cost:</b> {formatRupiah(position.costEstimate.totalMonthlyCost)}</p>
              <p><b>Annual Cost:</b> {formatRupiah(position.costEstimate.totalAnnualCost)}</p>
              <p><b>Cost per workload hour:</b> {formatRupiah(position.costEstimate.costPerWorkloadHour)}</p>
              <p><b>Cost efficiency:</b> {position.costEstimate.costPerWorkloadHour < 150000 ? "Efficient" : "Needs optimization"}</p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] text-sm text-[#334155]">
              <h3 className="text-[18px] font-semibold text-[#0F172A]">Impact Analysis</h3>
              <p className="mt-3"><b>Workload Reduction:</b> {position.impactAnalysis.workloadReduction}</p>
              <p><b>KPI Improvement:</b> {position.impactAnalysis.kpiImprovement}</p>
              <p><b>Cost Impact:</b> {position.impactAnalysis.costImpact}</p>
              <p><b>Risk Reduction:</b> {position.impactAnalysis.riskReduction}</p>
              <p><b>Affected Departments:</b> {position.impactAnalysis.affectedDepartments.join(", ")}</p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] text-sm text-[#334155]">
              <h3 className="text-[18px] font-semibold text-[#0F172A]">Implementation Plan</h3>
              <div className="mt-3 space-y-1">{position.implementationPlan.map((step, idx) => <p key={step}>{idx + 1}. {step}</p>)}</div>
            </article>
          </div>
        </section>
      </AIModuleLayout>

      <PositionDetailDrawer
        position={position}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSave={(next) => setPosition(next)}
        onAdd={() => setConfirmAddOpen(true)}
        onSimulate={() => setScenarioModalOpen(true)}
      />

      <Dialog open={confirmAddOpen} onOpenChange={setConfirmAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add to Organization</DialogTitle></DialogHeader>
          <p className="text-sm text-[#475569]">{position.positionName} will be submitted to Organization Management.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAddOpen(false)}>Cancel</Button>
            <Button className="bg-[#2563EB] text-white" onClick={() => { setPosition((p) => ({ ...p, status: "Submitted to Organization Management" })); setConfirmAddOpen(false); }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={scenarioModalOpen} onOpenChange={setScenarioModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Simulate in Scenario</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Input defaultValue={`AI Scenario - ${position.positionName}`} />
            <Input defaultValue="Workforce Impact Scenario" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScenarioModalOpen(false)}>Cancel</Button>
            <Button className="bg-[#2563EB] text-white" onClick={() => { setPosition((p) => ({ ...p, status: p.status === "Recommended" ? "Ready for Scenario Simulation" : p.status })); setScenarioModalOpen(false); }}>Create Scenario Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Export Position Design</DialogTitle></DialogHeader>
          <p className="text-sm text-[#475569]">PDF-style position summary for {position.positionName} is ready for export.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>Close</Button>
            <Button className="bg-[#2563EB] text-white" onClick={() => setExportModalOpen(false)}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="px-8 pb-8">
        <Button variant="ghost" className="rounded-xl text-[#2563EB]" onClick={() => router.push("/ai/job-position")}>Back to AI Job Position Library</Button>
      </div>
    </>
  );
}
