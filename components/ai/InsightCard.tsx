"use client";

import { AIInsight } from "@/lib/om-metrics";
import { AIScoreBadge } from "./AIScoreBadge";
import { AIRecommendationEvidence } from "./AIRecommendationEvidence";
import { AIDataSourceTag } from "./AIDataSourceTag";
import { Button } from "@/components/ui/button";

type InsightCardProps = {
  insight: AIInsight;
  onViewDetail: () => void;
  onGeneratePosition: () => void;
  onSendScenario: () => void;
};

export function InsightCard({ insight, onViewDetail, onGeneratePosition, onSendScenario }: InsightCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <AIScoreBadge severity={insight.severity} confidence={insight.confidenceScore} />
        <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#1D4ED8]">{insight.category}</span>
      </div>
      <h3 className="text-base font-semibold text-[#0F172A]">{insight.title}</h3>
      <p className="mt-1 text-xs font-medium text-[#64748B]">{insight.department}</p>
      <p className="mt-2 text-sm text-[#475569]">{insight.summary}</p>
      <div className="mt-3">
        <AIRecommendationEvidence insight={insight} />
      </div>
      <p className="mt-3 rounded-xl bg-[#F8FAFC] p-3 text-sm text-[#334155]">
        <span className="font-semibold text-[#0F172A]">Recommendation:</span> {insight.recommendation}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {insight.sourceModules.map((tag) => <AIDataSourceTag key={tag} tag={tag} />)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onViewDetail} variant="outline" className="rounded-xl border-[#CBD5E1]">View Details</Button>
        <Button onClick={onGeneratePosition} className="rounded-xl bg-[#2563EB] text-white">Generate Position</Button>
        <Button onClick={onSendScenario} variant="ghost" className="rounded-xl text-[#2563EB]">Send to Scenario</Button>
      </div>
    </article>
  );
}
