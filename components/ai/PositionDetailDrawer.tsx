"use client";

import { useEffect, useState } from "react";
import { AIGeneratedPosition } from "@/lib/om-metrics";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/lib/currency";

type PositionDetailDrawerProps = {
  position: AIGeneratedPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (position: AIGeneratedPosition) => void;
  onSimulate: (position: AIGeneratedPosition) => void;
  onAdd: (position: AIGeneratedPosition) => void;
};

export function PositionDetailDrawer({ position, open, onOpenChange, onSave, onSimulate, onAdd }: PositionDetailDrawerProps) {
  const [draft, setDraft] = useState<AIGeneratedPosition | null>(position);

  useEffect(() => setDraft(position), [position]);
  if (!draft) return null;

  const recalc = (next: AIGeneratedPosition): AIGeneratedPosition => {
    const salary = next.costEstimate.baseSalary || 0;
    const allowances = next.costEstimate.allowances || 0;
    const benefits = next.costEstimate.benefits || 0;
    const bonus = next.costEstimate.bonusAllocation || 0;
    const monthlyTotal = salary + allowances + benefits + bonus;
    const adjusted = Number(
      (
        next.workloadAnalysis.baseWorkloadHours *
        next.workloadAnalysis.complexityMultiplier *
        next.workloadAnalysis.qualityFactor *
        (1 + next.workloadAnalysis.reworkRate)
      ).toFixed(1)
    );
    const hc = Number((adjusted / Math.max(next.workloadAnalysis.effectiveMonthlyCapacity, 1)).toFixed(2));
    return {
      ...next,
      workloadAnalysis: { ...next.workloadAnalysis, adjustedWorkloadHours: adjusted, requiredHC: hc },
      costEstimate: {
        ...next.costEstimate,
        totalMonthlyCost: monthlyTotal,
        totalAnnualCost: monthlyTotal * 12,
        costPerWorkloadHour: adjusted > 0 ? Math.round(monthlyTotal / adjusted) : 0,
      },
    };
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="max-w-[520px] sm:max-w-[520px] p-0">
        <DrawerTitle className="sr-only">Edit Position Details</DrawerTitle>
        <DrawerDescription className="sr-only">
          Drawer untuk mengubah profil posisi, biaya, workload, dan simulasi implementasi.
        </DrawerDescription>
        <div className="h-full overflow-y-auto bg-white p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#0F172A]">Edit Position Details</h3>
          <Input value={draft.positionName} onChange={(e) => setDraft(recalc({ ...draft, positionName: e.target.value }))} />
          <Input value={draft.nomenclature} onChange={(e) => setDraft(recalc({ ...draft, nomenclature: e.target.value }))} />
          <Input value={draft.department} onChange={(e) => setDraft(recalc({ ...draft, department: e.target.value }))} />
          <Input value={draft.jobFamily} onChange={(e) => setDraft(recalc({ ...draft, jobFamily: e.target.value }))} />
          <Input value={draft.jobLevel} onChange={(e) => setDraft(recalc({ ...draft, jobLevel: e.target.value }))} />
          <Input value={draft.employmentType} onChange={(e) => setDraft(recalc({ ...draft, employmentType: e.target.value }))} />
          <Input value={draft.reportsTo} onChange={(e) => setDraft(recalc({ ...draft, reportsTo: e.target.value }))} />
          <Textarea value={draft.roleSummary} onChange={(e) => setDraft(recalc({ ...draft, roleSummary: e.target.value }))} />
          <Textarea value={draft.reasonForCreation} onChange={(e) => setDraft(recalc({ ...draft, reasonForCreation: e.target.value }))} />
          <Textarea value={draft.businessObjective} onChange={(e) => setDraft(recalc({ ...draft, businessObjective: e.target.value }))} />
          <Input type="number" value={draft.costEstimate.baseSalary} onChange={(e) => setDraft(recalc({ ...draft, costEstimate: { ...draft.costEstimate, baseSalary: Number(e.target.value) || 0 } }))} />
          <Input type="number" value={draft.costEstimate.allowances} onChange={(e) => setDraft(recalc({ ...draft, costEstimate: { ...draft.costEstimate, allowances: Number(e.target.value) || 0 } }))} />
          <Input type="number" value={draft.costEstimate.benefits} onChange={(e) => setDraft(recalc({ ...draft, costEstimate: { ...draft.costEstimate, benefits: Number(e.target.value) || 0 } }))} />
          <Input type="number" value={draft.costEstimate.bonusAllocation} onChange={(e) => setDraft(recalc({ ...draft, costEstimate: { ...draft.costEstimate, bonusAllocation: Number(e.target.value) || 0 } }))} />
          <Input type="number" value={draft.workloadAnalysis.baseWorkloadHours} onChange={(e) => setDraft(recalc({ ...draft, workloadAnalysis: { ...draft.workloadAnalysis, baseWorkloadHours: Number(e.target.value) || 0 } }))} />
          <Input type="number" step="0.01" value={draft.workloadAnalysis.complexityMultiplier} onChange={(e) => setDraft(recalc({ ...draft, workloadAnalysis: { ...draft.workloadAnalysis, complexityMultiplier: Number(e.target.value) || 1 } }))} />
          <Input type="number" step="0.01" value={draft.workloadAnalysis.qualityFactor} onChange={(e) => setDraft(recalc({ ...draft, workloadAnalysis: { ...draft.workloadAnalysis, qualityFactor: Number(e.target.value) || 1 } }))} />
          <Input type="number" step="0.01" value={draft.workloadAnalysis.reworkRate} onChange={(e) => setDraft(recalc({ ...draft, workloadAnalysis: { ...draft.workloadAnalysis, reworkRate: Number(e.target.value) || 0 } }))} />
          <Textarea value={draft.coreResponsibilities.join("\n")} onChange={(e) => setDraft(recalc({ ...draft, coreResponsibilities: e.target.value.split("\n").map((v) => v.trim()).filter(Boolean) }))} />
          <Textarea value={draft.keyDeliverables.join("\n")} onChange={(e) => setDraft(recalc({ ...draft, keyDeliverables: e.target.value.split("\n").map((v) => v.trim()).filter(Boolean) }))} />
          <Textarea value={draft.implementationPlan.join("\n")} onChange={(e) => setDraft(recalc({ ...draft, implementationPlan: e.target.value.split("\n").map((v) => v.trim()).filter(Boolean) }))} />
          <Textarea value={draft.risksIfNotCreated.join("\n")} onChange={(e) => setDraft(recalc({ ...draft, risksIfNotCreated: e.target.value.split("\n").map((v) => v.trim()).filter(Boolean) }))} />
          <div className="rounded-xl bg-[#F8FAFC] p-3 text-xs text-[#334155]">
            Recalculated: required HC {draft.workloadAnalysis.requiredHC} · monthly {formatRupiah(draft.costEstimate.totalMonthlyCost)} · annual {formatRupiah(draft.costEstimate.totalAnnualCost)} · cost/hour {formatRupiah(draft.costEstimate.costPerWorkloadHour)}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onSave(draft)} className="rounded-xl bg-[#2563EB] text-white">Save Changes</Button>
            <Button onClick={() => onSimulate(draft)} variant="outline" className="rounded-xl">Simulate Updated Position</Button>
            <Button onClick={() => onAdd(draft)} variant="outline" className="rounded-xl">Add to Organization</Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
