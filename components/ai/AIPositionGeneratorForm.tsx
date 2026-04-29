"use client";

import { FormEvent, useState } from "react";
import { unifiedAIDepartments as aiDepartments, unifiedAIScenarios as aiScenarios } from "@/lib/om-metrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export type GeneratorPayload = {
  department: string;
  businessObjective: string;
  problemStatement: string;
  targetKpi: string;
  budgetLimit: string;
  preferredLevel: string;
  employmentType: string;
  scenarioContext: string;
  includeWorkload: boolean;
  includeCost: boolean;
  includeProcess: boolean;
  includeReporting: boolean;
  includeActivity: boolean;
};

type AIPositionGeneratorFormProps = {
  onGenerate: (payload: GeneratorPayload) => void;
  prefill?: Partial<GeneratorPayload>;
};

export function AIPositionGeneratorForm({ onGenerate, prefill }: AIPositionGeneratorFormProps) {
  const [form, setForm] = useState<GeneratorPayload>({
    department: prefill?.department ?? "Operations",
    businessObjective: prefill?.businessObjective ?? "",
    problemStatement: prefill?.problemStatement ?? "",
    targetKpi: prefill?.targetKpi ?? "",
    budgetLimit: prefill?.budgetLimit ?? "Rp 450,000,000/year",
    preferredLevel: prefill?.preferredLevel ?? "Specialist",
    employmentType: prefill?.employmentType ?? "Permanent",
    scenarioContext: prefill?.scenarioContext ?? aiScenarios[0],
    includeWorkload: prefill?.includeWorkload ?? true,
    includeCost: prefill?.includeCost ?? true,
    includeProcess: prefill?.includeProcess ?? true,
    includeReporting: prefill?.includeReporting ?? true,
    includeActivity: prefill?.includeActivity ?? true,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onGenerate(form);
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <h3 className="text-sm font-semibold text-[#0F172A]">AI Position Generator</h3>
      <select className="h-10 w-full rounded-xl border border-[#CBD5E1] px-3 text-sm" value={form.department} onChange={(e) => setForm((s) => ({ ...s, department: e.target.value }))}>
        {aiDepartments.map((d) => <option key={d}>{d}</option>)}
      </select>
      <Input className="h-10 rounded-xl border-[#CBD5E1]" placeholder="Business objective" value={form.businessObjective} onChange={(e) => setForm((s) => ({ ...s, businessObjective: e.target.value }))} />
      <Input className="h-10 rounded-xl border-[#CBD5E1]" placeholder="Problem statement" value={form.problemStatement} onChange={(e) => setForm((s) => ({ ...s, problemStatement: e.target.value }))} />
      <Input className="h-10 rounded-xl border-[#CBD5E1]" placeholder="Target KPI" value={form.targetKpi} onChange={(e) => setForm((s) => ({ ...s, targetKpi: e.target.value }))} />
      <Input className="h-10 rounded-xl border-[#CBD5E1]" placeholder="Budget limit" value={form.budgetLimit} onChange={(e) => setForm((s) => ({ ...s, budgetLimit: e.target.value }))} />
      <Input className="h-10 rounded-xl border-[#CBD5E1]" placeholder="Preferred level" value={form.preferredLevel} onChange={(e) => setForm((s) => ({ ...s, preferredLevel: e.target.value }))} />
      <Input className="h-10 rounded-xl border-[#CBD5E1]" placeholder="Employment type" value={form.employmentType} onChange={(e) => setForm((s) => ({ ...s, employmentType: e.target.value }))} />
      <select className="h-10 w-full rounded-xl border border-[#CBD5E1] px-3 text-sm" value={form.scenarioContext} onChange={(e) => setForm((s) => ({ ...s, scenarioContext: e.target.value }))}>
        {aiScenarios.map((s) => <option key={s}>{s}</option>)}
      </select>
      <div className="space-y-2 rounded-xl bg-[#F8FAFC] p-3 text-xs text-[#334155]">
        {[
          ["includeWorkload", "Include workload analysis"],
          ["includeCost", "Include cost estimate"],
          ["includeProcess", "Include process linkage"],
          ["includeReporting", "Include reporting structure"],
          ["includeActivity", "Include activity assignment"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <Checkbox checked={Boolean(form[key as keyof GeneratorPayload])} onCheckedChange={(v) => setForm((s) => ({ ...s, [key]: Boolean(v) }))} />
            {label}
          </label>
        ))}
      </div>
      <Button type="submit" className="w-full rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8]">Generate Position</Button>
    </form>
  );
}
