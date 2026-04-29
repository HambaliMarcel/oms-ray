"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  unifiedAIDepartments as aiDepartments,
  unifiedAIInsights as aiInsights,
  unifiedAIScenarios as aiScenarios,
  unifiedAIGeneratedPositions as aiGeneratedPositions,
  unifiedProcessList,
  unifiedWorkloadActivities,
  AIInsight,
} from "@/lib/om-metrics";
import { AIModuleLayout } from "./AIModuleLayout";
import { AIProcessingSteps } from "./AIProcessingSteps";
import { InsightCard } from "./InsightCard";
import { InsightDetailDrawer } from "./InsightDetailDrawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type Filters = { department: string; category: string; severity: string; scenario: string; horizon: string; search: string };

export function AIInsightsPage() {
  const router = useRouter();
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    department: "All Departments",
    category: "All Categories",
    severity: "All Severity",
    scenario: aiScenarios[0],
    horizon: "Now",
    search: "",
  });

  const [scope, setScope] = useState({
    workload: true,
    positionGap: true,
    process: true,
    activity: true,
    financial: true,
    scenario: true,
    focus: "Efficiency",
  });

  const filteredInsights = useMemo(
    () =>
      aiInsights.filter((insight) => {
        if (filters.department !== "All Departments" && insight.department !== filters.department) return false;
        if (filters.category !== "All Categories" && insight.category !== filters.category) return false;
        if (filters.severity !== "All Severity" && insight.severity !== filters.severity) return false;
        if (filters.search && !`${insight.title} ${insight.summary}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      }),
    [filters]
  );

  const updateToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const gotoJobPosition = (insight: AIInsight) => {
    const matched =
      aiGeneratedPositions.find((p) => p.sourceInsight.toLowerCase().includes(insight.title.toLowerCase())) ||
      aiGeneratedPositions.find((p) => p.department === insight.department) ||
      aiGeneratedPositions[0];

    router.push(`/ai/job-position/${matched.id}?insightId=${insight.id}`);
  };

  const openRelatedProcess = (insight: AIInsight) => {
    const processName = insight.affectedProcesses[0];
    const found = unifiedProcessList.find((p) => p.name === processName || p.id === processName || p.code === processName);
    if (found) {
      router.push(`/business-process/process-directory/${found.id}`);
      return;
    }
    router.push("/business-process/process-chain");
  };

  const openActivityDetail = (insight: AIInsight) => {
    const activityName = insight.affectedActivities[0]?.name;
    const found = unifiedWorkloadActivities.find((a) => a.name === activityName || a.id === activityName);
    if (found) {
      router.push(`/workload-activity/activity-directory/${found.id}`);
      return;
    }
    router.push("/workload-activity/activity-directory");
  };

  return (
    <>
      <AIModuleLayout
        breadcrumb="OM+ > AI Module > AI Insights"
        title="AI Organizational Insights"
        subtitle="AI-powered recommendations for organization design, workforce capacity, process ownership, workload balance, and workforce cost optimization."
        toast={toast}
        actions={
          <>
            <Button variant="outline" className="rounded-xl">Refresh Insights</Button>
            <Button variant="outline" className="rounded-xl">Export AI Report</Button>
            <Button className="rounded-xl bg-[#2563EB] text-white">Generate Scenario</Button>
          </>
        }
        filters={
          <section className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-7">
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm" value={filters.department} onChange={(e) => setFilters((s) => ({ ...s, department: e.target.value }))}>
                <option>All Departments</option>{aiDepartments.map((d) => <option key={d}>{d}</option>)}
              </select>
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm" value={filters.category} onChange={(e) => setFilters((s) => ({ ...s, category: e.target.value }))}>
                <option>All Categories</option>{Array.from(new Set(aiInsights.map((i) => i.category))).map((c) => <option key={c}>{c}</option>)}
              </select>
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm" value={filters.severity} onChange={(e) => setFilters((s) => ({ ...s, severity: e.target.value }))}>
                <option>All Severity</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm" value={filters.scenario} onChange={(e) => setFilters((s) => ({ ...s, scenario: e.target.value }))}>
                {aiScenarios.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm" value={filters.horizon} onChange={(e) => setFilters((s) => ({ ...s, horizon: e.target.value }))}>
                <option>Now</option><option>3 months</option><option>6 months</option>
              </select>
              <div className="xl:col-span-2"><Input className="h-10 rounded-xl border-[#CBD5E1]" placeholder="Search insight" value={filters.search} onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))} /></div>
            </div>
          </section>
        }
        kpis={
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["Total AI Insights", "24"],
              ["Critical Recommendations", "5"],
              ["Estimated HC Gap", "18.4 FTE"],
              ["Potential Cost Optimization", "Rp 7.8B/year"],
              ["Process Risks Detected", "11"],
              ["Confidence Average", "87%"],
            ].map(([label, value]) => (
              <article key={label} className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <p className="text-xs text-[#94A3B8]">{label}</p>
                <p className="mt-1 text-xl font-bold text-[#0F172A]">{value}</p>
              </article>
            ))}
          </section>
        }
      >
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <aside className="space-y-4 xl:col-span-3">
            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <h3 className="text-sm font-semibold text-[#0F172A]">Analysis Scope</h3>
              <div className="mt-3 space-y-2 text-sm text-[#475569]">
                {[
                  ["workload", "Workload analysis"],
                  ["positionGap", "Position gap analysis"],
                  ["process", "Business process analysis"],
                  ["activity", "Activity workload analysis"],
                  ["financial", "Financial cost analysis"],
                  ["scenario", "Scenario impact analysis"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <Checkbox checked={Boolean(scope[key as keyof typeof scope])} onCheckedChange={(v) => setScope((s) => ({ ...s, [key]: Boolean(v) }))} />
                    {label}
                  </label>
                ))}
              </div>
              <select className="mt-4 h-10 w-full rounded-xl border border-[#CBD5E1] px-3 text-sm" value={scope.focus} onChange={(e) => setScope((s) => ({ ...s, focus: e.target.value }))}>
                {["Efficiency", "Cost Reduction", "Growth Enablement", "Risk Reduction", "Org Simplification"].map((f) => <option key={f}>{f}</option>)}
              </select>
              <Button className="mt-4 w-full rounded-xl bg-[#2563EB] text-white">Re-run AI</Button>
            </div>
          </aside>

          <div className="space-y-4 xl:col-span-6">
            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <h3 className="mb-3 text-sm font-semibold text-[#0F172A]">AI Detection Engine</h3>
              <AIProcessingSteps />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredInsights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onViewDetail={() => { setSelectedInsight(insight); setDrawerOpen(true); }}
                  onGeneratePosition={() => gotoJobPosition(insight)}
                  onSendScenario={() => updateToast("Scenario draft created from AI Insight")}
                />
              ))}
            </div>
          </div>

          <aside className="space-y-4 xl:col-span-3">
            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <h3 className="text-sm font-semibold text-[#0F172A]">Priority Recommendations</h3>
              <div className="mt-3 space-y-2">
                {filteredInsights.slice(0, 5).map((i) => (
                  <button key={i.id} className="w-full rounded-xl border border-[#E2E8F0] p-3 text-left hover:bg-[#F8FAFC]" onClick={() => { setSelectedInsight(i); setDrawerOpen(true); }}>
                    <p className="text-sm font-semibold text-[#0F172A]">{i.title}</p>
                    <p className="text-xs text-[#64748B]">{i.department}</p>
                    <p className="text-xs font-medium text-[#2563EB]">Impact score {i.confidenceScore}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-[#EFF6FF] p-5">
              <p className="text-sm font-semibold text-[#1E3A8A]">AI Summary</p>
              <p className="mt-2 text-sm text-[#334155]">
                OM+ AI detected that Operations, Procurement, and Digital Transformation account for 72% of current organizational capacity risk.
              </p>
            </div>
          </aside>
        </section>
      </AIModuleLayout>

      <InsightDetailDrawer
        insight={selectedInsight}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onGeneratePosition={gotoJobPosition}
        onSendToScenario={() => updateToast("Scenario draft created from AI Insight")}
        onOpenRelatedProcess={openRelatedProcess}
        onOpenActivityDetail={openActivityDetail}
      />
    </>
  );
}
