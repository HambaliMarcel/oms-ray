import { AIGeneratedPosition } from "@/lib/om-metrics";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/currency";

type GeneratedPositionCardProps = {
  position: AIGeneratedPosition;
  onAdd: () => void;
  onSimulate: () => void;
  onEdit: () => void;
  onViewDetails: () => void;
  onExport: () => void;
  onOpenProcess: (processName: string) => void;
  onOpenActivity: (activityName: string) => void;
};

export function GeneratedPositionCard({ position, onAdd, onSimulate, onEdit, onViewDetails, onExport, onOpenProcess, onOpenActivity }: GeneratedPositionCardProps) {
  return (
    <article className="space-y-4 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <section>
        <p className="text-xs uppercase tracking-[0.12em] text-[#94A3B8]">Position Overview</p>
        <h3 className="text-lg font-bold text-[#0F172A]">{position.positionName}</h3>
        <p className="text-sm text-[#64748B]">{position.nomenclature}</p>
        <p className="text-xs text-[#64748B]">{position.department} · {position.jobFamily} · {position.jobLevel}</p>
        <p className="mt-1 text-xs text-[#64748B]">{position.employmentType} · Reports to {position.reportsTo} · Status {position.status}</p>
      </section>

      <section className="rounded-xl bg-[#F8FAFC] p-3">
        <p className="text-sm font-semibold text-[#0F172A]">Why This Position Is Needed</p>
        <p className="mt-1 text-sm text-[#475569]">{position.reasonForCreation}</p>
        <p className="mt-2 text-xs text-[#64748B]"><span className="font-semibold">Business objective:</span> {position.businessObjective}</p>
        <p className="mt-1 text-xs text-[#64748B]"><span className="font-semibold">Source insight:</span> {position.sourceInsight}</p>
      </section>

      <section>
        <p className="text-sm font-semibold text-[#0F172A]">Responsibilities</p>
        <div className="mt-2 space-y-2">
          {position.coreResponsibilities.map((item) => <p key={item} className="text-xs text-[#334155]">- {item}</p>)}
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold text-[#0F172A]">Key Deliverables</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {position.keyDeliverables.map((item) => <span key={item} className="rounded-full bg-[#EFF6FF] px-2 py-1 text-xs text-[#2563EB]">{item}</span>)}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-semibold text-[#0F172A]">Business Process Linkage</p>
        {position.linkedBusinessProcesses.map((p) => (
          <div key={p.processName} className="rounded-xl border border-[#E2E8F0] p-3 text-xs">
            <p className="font-semibold text-[#0F172A]">{p.processName}</p>
            <p className="text-[#64748B]">{p.roleInProcess} · KPI {p.kpiSupported} ({p.currentKpi} {"->"} {p.targetKpi})</p>
            <Button variant="ghost" size="sm" className="mt-1 h-7 rounded-lg px-2 text-[#2563EB]" onClick={() => onOpenProcess(p.processName)}>Open Linked Process</Button>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <p className="text-sm font-semibold text-[#0F172A]">KPI Linkage</p>
        {position.linkedKPIs.map((kpi) => (
          <div key={kpi.kpiName} className="rounded-xl border border-[#E2E8F0] p-3 text-xs text-[#334155]">
            <p className="font-semibold text-[#0F172A]">{kpi.kpiName}</p>
            <p>{kpi.currentValue} {"->"} {kpi.targetValue} ({kpi.expectedImprovement})</p>
          </div>
        ))}
      </section>

      <section>
        <p className="mb-2 text-sm font-semibold text-[#0F172A]">Linked Activities</p>
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
        <table className="w-full">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-3 py-2 text-left text-xs text-[#94A3B8]">Activity</th>
              <th className="px-3 py-2 text-left text-xs text-[#94A3B8]">Frequency</th>
              <th className="px-3 py-2 text-left text-xs text-[#94A3B8]">Duration</th>
              <th className="px-3 py-2 text-left text-xs text-[#94A3B8]">Workload</th>
            </tr>
          </thead>
          <tbody>
            {position.linkedActivities.map((a) => (
              <tr key={a.activityName} className="border-t border-[#F1F5F9]">
                <td className="px-3 py-2 text-xs text-[#334155]">
                  {a.activityName}
                  <Button variant="ghost" size="sm" className="ml-1 h-6 rounded-lg px-1 text-[11px] text-[#2563EB]" onClick={() => onOpenActivity(a.activityName)}>Open Linked Activity</Button>
                </td>
                <td className="px-3 py-2 text-xs text-[#334155]">{a.frequency}</td>
                <td className="px-3 py-2 text-xs text-[#334155]">{a.durationHours}h</td>
                <td className="px-3 py-2 text-xs text-[#334155]">{a.monthlyWorkloadHours}h · {a.complexityLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>

      <section>
        <p className="mb-2 text-sm font-semibold text-[#0F172A]">Workload Analysis</p>
        <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#F8FAFC] p-3">
          <p className="text-[11px] text-[#94A3B8]">Base Workload</p>
          <p className="text-sm font-semibold text-[#0F172A]">{position.workloadAnalysis.baseWorkloadHours} h/month</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-3">
          <p className="text-[11px] text-[#94A3B8]">Adjusted Workload</p>
          <p className="text-sm font-semibold text-[#0F172A]">{position.workloadAnalysis.adjustedWorkloadHours} h/month</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-3">
          <p className="text-[11px] text-[#94A3B8]">Complexity / Quality / Rework</p>
          <p className="text-sm font-semibold text-[#0F172A]">{position.workloadAnalysis.complexityMultiplier} / {position.workloadAnalysis.qualityFactor} / {Math.round(position.workloadAnalysis.reworkRate * 100)}%</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-3">
          <p className="text-[11px] text-[#94A3B8]">Required HC</p>
          <p className="text-sm font-semibold text-[#0F172A]">{position.workloadAnalysis.requiredHC} FTE (rec {position.workloadAnalysis.recommendedHC})</p>
        </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] p-3 text-xs text-[#334155]">
        <p className="font-semibold text-[#0F172A]">Cost Estimate</p>
        <p className="mt-1">Base salary: {formatRupiah(position.costEstimate.baseSalary)}</p>
        <p>Allowances: {formatRupiah(position.costEstimate.allowances)}</p>
        <p>Benefits: {formatRupiah(position.costEstimate.benefits)}</p>
        <p>Bonus allocation: {formatRupiah(position.costEstimate.bonusAllocation)}</p>
        <p>Total monthly cost: {formatRupiah(position.costEstimate.totalMonthlyCost)}</p>
        <p>Total annual cost: {formatRupiah(position.costEstimate.totalAnnualCost)}</p>
        <p>Cost per workload hour: {formatRupiah(position.costEstimate.costPerWorkloadHour)}</p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] p-3 text-xs text-[#334155]">
        <p className="font-semibold text-[#0F172A]">Competency Requirements</p>
        <p className="mt-1"><span className="font-semibold">Education:</span> {position.competencyRequirements.education}</p>
        <p><span className="font-semibold">Experience:</span> {position.competencyRequirements.minimumExperience}</p>
        <p className="mt-1"><span className="font-semibold">Technical:</span> {position.competencyRequirements.technicalCompetencies.join(", ")}</p>
        <p><span className="font-semibold">Behavioral:</span> {position.competencyRequirements.behavioralCompetencies.join(", ")}</p>
        <p><span className="font-semibold">Certifications:</span> {position.competencyRequirements.certifications.join(", ")}</p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] p-3 text-xs text-[#334155]">
        <p className="font-semibold text-[#0F172A]">Impact Analysis</p>
        <p className="mt-1">{position.impactAnalysis.workloadReduction}</p>
        <p>{position.impactAnalysis.kpiImprovement}</p>
        <p>{position.impactAnalysis.riskReduction}</p>
        <p>{position.impactAnalysis.costImpact}</p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] p-3 text-xs text-[#334155]">
        <p className="font-semibold text-[#0F172A]">Risks If Not Created</p>
        {position.risksIfNotCreated.map((risk) => <p key={risk}>- {risk}</p>)}
      </section>

      <section className="rounded-xl border border-[#E2E8F0] p-3 text-xs text-[#334155]">
        <p className="font-semibold text-[#0F172A]">Implementation Plan</p>
        {position.implementationPlan.map((step, idx) => <p key={step}>{idx + 1}. {step}</p>)}
        <p className="mt-2"><span className="font-semibold">Scenario readiness:</span> {position.scenarioReadiness}</p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onViewDetails} variant="outline" className="rounded-xl border-[#CBD5E1]">View Details</Button>
        <Button onClick={onAdd} className="rounded-xl bg-[#2563EB] text-white">Add to Organization</Button>
        <Button onClick={onSimulate} variant="outline" className="rounded-xl">Simulate in Scenario</Button>
        <Button onClick={onEdit} variant="ghost" className="rounded-xl text-[#2563EB]">Edit Details</Button>
        <Button variant="ghost" className="rounded-xl text-[#2563EB]" onClick={onExport}>Export Position Design</Button>
      </div>
    </article>
  );
}
