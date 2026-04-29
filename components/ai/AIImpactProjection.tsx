import { AIInsight } from "@/lib/om-metrics";

export function AIImpactProjection({ insight }: { insight: AIInsight }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-xl bg-[#F8FAFC] p-3">
        <p className="text-[11px] text-[#94A3B8]">Workload</p>
        <p className="text-xs font-semibold text-[#0F172A]">{insight.impactProjection.workloadImprovement}</p>
      </div>
      <div className="rounded-xl bg-[#F8FAFC] p-3">
        <p className="text-[11px] text-[#94A3B8]">Cost</p>
        <p className="text-xs font-semibold text-[#0F172A]">{insight.impactProjection.costChange}</p>
      </div>
      <div className="rounded-xl bg-[#F8FAFC] p-3">
        <p className="text-[11px] text-[#94A3B8]">KPI</p>
        <p className="text-xs font-semibold text-[#0F172A]">{insight.impactProjection.kpiImprovement}</p>
      </div>
    </div>
  );
}
