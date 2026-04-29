"use client";

import { AIInsight } from "@/lib/om-metrics";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { AIScoreBadge } from "./AIScoreBadge";
import { AIImpactProjection } from "./AIImpactProjection";

type InsightDetailDrawerProps = {
  insight: AIInsight | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGeneratePosition: (insight: AIInsight) => void;
  onSendToScenario: (insight: AIInsight) => void;
  onOpenRelatedProcess: (insight: AIInsight) => void;
  onOpenActivityDetail: (insight: AIInsight) => void;
};

export function InsightDetailDrawer({
  insight,
  open,
  onOpenChange,
  onGeneratePosition,
  onSendToScenario,
  onOpenRelatedProcess,
  onOpenActivityDetail,
}: InsightDetailDrawerProps) {
  if (!insight) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="max-w-[520px] sm:max-w-[520px] p-0">
        <DrawerTitle className="sr-only">{insight.title}</DrawerTitle>
        <DrawerDescription className="sr-only">
          Detail insight AI untuk {insight.department} dengan rekomendasi tindakan dan dampak.
        </DrawerDescription>
        <div className="h-full overflow-y-auto bg-white p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#94A3B8]">Insight Summary</p>
              <h3 className="text-lg font-bold text-[#0F172A]">{insight.title}</h3>
              <p className="text-xs text-[#64748B]">{insight.department} · {insight.createdAt}</p>
            </div>
            <AIScoreBadge severity={insight.severity} confidence={insight.confidenceScore} />
          </div>

          <section className="rounded-2xl bg-[#F8FAFC] p-4">
            <p className="text-sm font-semibold text-[#0F172A]">Why AI flagged this</p>
            <p className="mt-2 text-sm text-[#475569]">{insight.reasoning}</p>
          </section>

          <section>
            <p className="mb-2 text-sm font-semibold text-[#0F172A]">Data Evidence</p>
            <AIImpactProjection insight={insight} />
          </section>

          <section>
            <p className="mb-2 text-sm font-semibold text-[#0F172A]">Affected Business Processes</p>
            <div className="space-y-2">
              {insight.affectedProcesses.map((process) => (
                <div key={process} className="rounded-xl border border-[#E2E8F0] p-3 text-sm text-[#334155]">{process}</div>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 text-sm font-semibold text-[#0F172A]">Affected Activities</p>
            <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
              <table className="w-full">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs text-[#94A3B8]">Activity</th>
                    <th className="px-3 py-2 text-left text-xs text-[#94A3B8]">Hours</th>
                    <th className="px-3 py-2 text-left text-xs text-[#94A3B8]">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {insight.affectedActivities.map((a) => (
                    <tr key={a.name} className="border-t border-[#F1F5F9]">
                      <td className="px-3 py-2 text-xs text-[#334155]">{a.name}</td>
                      <td className="px-3 py-2 text-xs text-[#334155]">{a.workloadHours}</td>
                      <td className="px-3 py-2 text-xs text-[#334155]">{a.utilization}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl bg-[#F8FAFC] p-4">
            <p className="text-sm font-semibold text-[#0F172A]">Financial Impact</p>
            <p className="mt-1 text-xs text-[#64748B]">Current: {insight.financialImpact.currentMonthlyCost}</p>
            <p className="text-xs text-[#64748B]">Projected: {insight.financialImpact.projectedMonthlyCost}</p>
            <p className="text-xs font-semibold text-[#0F172A]">Delta: {insight.financialImpact.delta}</p>
          </section>

          <section>
            <p className="mb-2 text-sm font-semibold text-[#0F172A]">Recommended Action Plan</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-[#475569]">
              <li>Create or redesign affected position</li>
              <li>Adjust activity assignment and owner</li>
              <li>Simulate scenario impact</li>
              <li>Submit implementation for approval</li>
            </ol>
          </section>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onGeneratePosition(insight)} className="rounded-xl bg-[#2563EB] text-white">Generate Position</Button>
            <Button onClick={() => onSendToScenario(insight)} variant="outline" className="rounded-xl">Send to Scenario</Button>
            <Button variant="ghost" className="rounded-xl text-[#2563EB]" onClick={() => onOpenRelatedProcess(insight)}>Open Related Process</Button>
            <Button variant="ghost" className="rounded-xl text-[#2563EB]" onClick={() => onOpenActivityDetail(insight)}>Open Activity Detail</Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl text-[#64748B]">Close</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
