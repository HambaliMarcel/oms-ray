"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AIModuleLayout } from "./AIModuleLayout";
import {
  unifiedAIGeneratedPositions as aiGeneratedPositions,
  unifiedAIScenarios as aiScenarios,
  AIGeneratedPosition,
  unifiedAIInsights as aiInsights,
  unifiedProcessList,
  unifiedWorkloadActivities,
} from "@/lib/om-metrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIPositionGeneratorForm, GeneratorPayload } from "./AIPositionGeneratorForm";
import { AIPositionLibraryTable } from "./AIPositionLibraryTable";
import { GeneratedPositionCard } from "./GeneratedPositionCard";
import { PositionDetailDrawer } from "./PositionDetailDrawer";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/currency";

export function AIJobPositionPage() {
  const router = useRouter();
  const params = useSearchParams();
  const insightId = params.get("insightId");
  const linkedInsight = aiInsights.find((i) => i.id === insightId);

  const [positions, setPositions] = useState<AIGeneratedPosition[]>(aiGeneratedPositions);
  const [selected, setSelected] = useState<AIGeneratedPosition | null>(aiGeneratedPositions[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [scenario, setScenario] = useState(aiScenarios[0]);
  const [confirmAddOpen, setConfirmAddOpen] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [targetPosition, setTargetPosition] = useState<AIGeneratedPosition | null>(null);

  const filtered = useMemo(
    () =>
      positions.filter((p) => {
        if (department !== "All" && p.department !== department) return false;
        if (status !== "All" && p.status !== status) return false;
        if (search && !`${p.positionName} ${p.department}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [positions, search, department, status]
  );

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const selectPositionById = (id: string, openDrawer = false) => {
    const found = positions.find((p) => p.id === id);
    if (!found) return;
    setSelected(found);
    if (openDrawer) {
      setDrawerOpen(true);
      return;
    }
    router.push(`/ai/job-position/${encodeURIComponent(id)}`);
  };

  const openLinkedProcess = (processName: string) => {
    const found = unifiedProcessList.find((p) => ((p as any).name ?? (p as any).processName) === processName);
    if (found && (found as any).id) {
      router.push(`/business-process/process-directory/${(found as any).id}`);
      return;
    }
    router.push(`/business-process/process-directory?search=${encodeURIComponent(processName)}`);
  };

  const openLinkedActivity = (activityName: string) => {
    const found = unifiedWorkloadActivities.find((a) => ((a as any).name ?? (a as any).activityName) === activityName);
    if (found && (found as any).id) {
      router.push(`/workload-activity/activity-directory/${(found as any).id}`);
      return;
    }
    router.push(`/workload-activity/activity-directory?search=${encodeURIComponent(activityName)}`);
  };

  const generatePosition = (payload: GeneratorPayload) => {
    const id = `AI-POS-${String(positions.length + 1).padStart(3, "0")}`;
    const generated: AIGeneratedPosition = {
      ...aiGeneratedPositions[0],
      id,
      positionName: `${payload.department.split(" ")[0]} Capacity Specialist`,
      nomenclature: `${payload.department} Capacity Specialist`,
      department: payload.department,
      jobLevel: payload.preferredLevel,
      employmentType: payload.employmentType,
      businessObjective: payload.businessObjective || "Improve operational continuity",
      reasonForCreation: payload.problemStatement || "AI detected cross-module workload and ownership bottlenecks.",
      sourceInsight: linkedInsight?.title ?? "Operations Overload Risk",
      scenarioReadiness: "Recommended for simulation",
      status: "Recommended",
    };
    setPositions((prev) => [generated, ...prev]);
    setSelected(generated);
    router.push(`/ai/job-position/${encodeURIComponent(id)}?insightId=${encodeURIComponent(insightId ?? "")}`);
    notify("AI generated position design successfully created.");
  };

  const submitToOrg = (position: AIGeneratedPosition) => {
    setPositions((prev) =>
      prev.map((p) =>
        p.id === position.id ? { ...p, status: "Submitted to Organization Management" as AIGeneratedPosition["status"] } : p
      )
    );
    setSelected((prev) => (prev && prev.id === position.id ? { ...prev, status: "Submitted to Organization Management" } : prev));
    notify("Position submitted to Organization Management for approval.");
  };

  const createScenario = (position: AIGeneratedPosition) => {
    setPositions((prev) =>
      prev.map((p) =>
        p.id === position.id
          ? {
              ...p,
              scenarioReadiness: "Scenario draft created and ready to simulate",
              status: p.status === "Recommended" ? "Ready for Scenario Simulation" : p.status,
            }
          : p
      )
    );
    setSelected((prev) => (prev && prev.id === position.id ? { ...prev, scenarioReadiness: "Scenario draft created and ready to simulate" } : prev));
    notify("Scenario draft created with AI position impact.");
  };

  return (
    <>
      <AIModuleLayout
        breadcrumb="OM+ > AI Module > AI Job Position"
        title="AI Job Position"
        subtitle="Generate, review, simulate, and implement AI-recommended job positions based on workload, process ownership, cost, and organization structure."
        toast={toast}
        actions={
          <>
            <Button className="rounded-xl bg-[#2563EB] text-white">Generate New Position</Button>
            <Button variant="outline" className="rounded-xl">Export Position Library</Button>
          </>
        }
        filters={
          <section className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option>All</option>{Array.from(new Set(positions.map((p) => p.department))).map((d) => <option key={d}>{d}</option>)}
              </select>
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm"><option>All Job Family</option></select>
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>All</option><option>Recommended</option><option>Ready for Scenario Simulation</option><option>Implemented</option><option>Submitted to Organization Management</option>
              </select>
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm"><option>All Source Insight</option>{aiInsights.map((i) => <option key={i.id}>{i.id}</option>)}</select>
              <select className="h-10 rounded-xl border border-[#CBD5E1] px-3 text-sm" value={scenario} onChange={(e) => setScenario(e.target.value)}>{aiScenarios.map((s) => <option key={s}>{s}</option>)}</select>
              <Input className="h-10 rounded-xl border-[#CBD5E1]" placeholder="Search position" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </section>
        }
        kpis={
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["AI Position Recommendations", "14"],
              ["Draft Positions", "8"],
              ["Ready to Simulate", "5"],
              ["Implemented Positions", "3"],
              ["Estimated Workload Relief", "2,420 hours/month"],
              ["Estimated Annual Cost", "Rp 5.6B"],
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
          <aside className="xl:col-span-3">
            <AIPositionGeneratorForm
              prefill={
                linkedInsight
                  ? {
                      department: linkedInsight.department,
                      problemStatement: linkedInsight.summary,
                      targetKpi: linkedInsight.kpiImpact,
                      businessObjective: linkedInsight.recommendation,
                    }
                  : undefined
              }
              onGenerate={generatePosition}
            />
          </aside>
          <div className="space-y-4 xl:col-span-6">
            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <h3 className="text-sm font-semibold text-[#0F172A]">AI Position Design Logic</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[#475569]">
                <li>Analyze workload gap</li>
                <li>Identify missing process ownership</li>
                <li>Map reporting hierarchy</li>
                <li>Estimate remuneration cost</li>
                <li>Calculate workload relief</li>
                <li>Generate position design</li>
              </ol>
            </div>
            <AIPositionLibraryTable
              positions={filtered}
              onView={(p) => selectPositionById(p.id)}
              onEdit={(p) => selectPositionById(p.id, true)}
              onSimulate={(p) => { setTargetPosition(p); setScenarioModalOpen(true); }}
              onAdd={(p) => { setTargetPosition(p); setConfirmAddOpen(true); }}
            />
          </div>
          <aside className="xl:col-span-3">
            <GeneratedPositionCard
              position={selected ?? filtered[0]}
              onAdd={() => { if (selected) { setTargetPosition(selected); setConfirmAddOpen(true); } }}
              onSimulate={() => { if (selected) { setTargetPosition(selected); setScenarioModalOpen(true); } }}
              onEdit={() => setDrawerOpen(true)}
              onViewDetails={() => { if (selected) router.push(`/ai/job-position/${encodeURIComponent(selected.id)}`); }}
              onExport={() => { setTargetPosition(selected); setExportModalOpen(true); }}
              onOpenProcess={openLinkedProcess}
              onOpenActivity={openLinkedActivity}
            />
          </aside>
        </section>
      </AIModuleLayout>

      <PositionDetailDrawer
        position={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSave={(p) => {
          setPositions((prev) => prev.map((x) => (x.id === p.id ? p : x)));
          setSelected(p);
          notify("Position detail updated and impact recalculated.");
        }}
        onSimulate={(p) => createScenario(p)}
        onAdd={(p) => submitToOrg(p)}
      />

      <Dialog open={confirmAddOpen} onOpenChange={setConfirmAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add AI Position to Organization?</DialogTitle></DialogHeader>
          {targetPosition && (
            <div className="space-y-1 text-sm text-[#475569]">
              <p><b>Position:</b> {targetPosition.positionName}</p>
              <p><b>Department:</b> {targetPosition.department}</p>
              <p><b>Reports to:</b> {targetPosition.reportsTo}</p>
              <p><b>Monthly cost:</b> {formatRupiah(targetPosition.costEstimate.totalMonthlyCost)}</p>
              <p><b>Activities transferred:</b> {targetPosition.linkedActivities.length} activities</p>
              <p><b>Approval:</b> Organization Management approval required</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAddOpen(false)}>Cancel</Button>
            <Button className="bg-[#2563EB] text-white" onClick={() => { if (targetPosition) submitToOrg(targetPosition); setConfirmAddOpen(false); }}>Confirm Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={scenarioModalOpen} onOpenChange={setScenarioModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Scenario from AI Position</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Input defaultValue={`AI Scenario - ${targetPosition?.positionName ?? ""}`} />
            <Input defaultValue="Workforce Impact Scenario" />
            <Input defaultValue={targetPosition?.positionName ?? ""} />
            <Input defaultValue="2026-07-01" />
            <label className="flex items-center gap-2 text-sm text-[#475569]"><input type="checkbox" defaultChecked /> Include cost impact</label>
            <label className="flex items-center gap-2 text-sm text-[#475569]"><input type="checkbox" defaultChecked /> Include workload impact</label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScenarioModalOpen(false)}>Cancel</Button>
            <Button className="bg-[#2563EB] text-white" onClick={() => { if (targetPosition) createScenario(targetPosition); setScenarioModalOpen(false); }}>Create Scenario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Export Position Design</DialogTitle></DialogHeader>
          <p className="text-sm text-[#475569]">
            {targetPosition ? `${targetPosition.positionName} can be exported as a detailed position design package.` : "Position design package is ready to export."}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>Cancel</Button>
            <Button className="bg-[#2563EB] text-white" onClick={() => { notify("Position design exported successfully."); setExportModalOpen(false); }}>
              Confirm Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
