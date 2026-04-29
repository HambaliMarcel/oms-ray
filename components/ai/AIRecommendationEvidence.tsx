import { AIInsight } from "@/lib/om-metrics";

export function AIRecommendationEvidence({ insight }: { insight: AIInsight }) {
  const chips = [
    `Utilization ${insight.dataEvidence.utilization}`,
    `HC Gap ${insight.dataEvidence.hcGap}`,
    `KPI ${insight.dataEvidence.kpiImpact}`,
    `Cost ${insight.dataEvidence.costImpact}`,
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-medium text-[#475569]">
          {chip}
        </span>
      ))}
    </div>
  );
}
