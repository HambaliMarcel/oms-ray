import { CheckCircle2, Database, GitBranch, LoaderCircle, Users, Wallet } from "lucide-react";
import { AIDataSourceTag } from "./AIDataSourceTag";

const steps = [
  { id: 1, title: "Read organization structure", records: "1,376 positions · 1,248 employees", tag: "Org Data" as const, icon: Users },
  { id: 2, title: "Map positions to processes", records: "10 strategic process maps", tag: "Process Data" as const, icon: GitBranch },
  { id: 3, title: "Analyze activity workload", records: "180 activities analyzed", tag: "Workload Data" as const, icon: LoaderCircle },
  { id: 4, title: "Detect HC gaps and utilization risks", records: "72 anomalies detected", tag: "Org Data" as const, icon: CheckCircle2 },
  { id: 5, title: "Calculate cost efficiency", records: "Rp 18.3B annual workload cost", tag: "Cost Data" as const, icon: Wallet },
  { id: 6, title: "Generate recommendations", records: "24 active recommendations", tag: "Scenario Data" as const, icon: Database },
];

export function AIProcessingSteps() {
  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <div key={step.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <step.icon className="h-4 w-4 text-[#2563EB]" />
              <p className="text-sm font-semibold text-[#0F172A]">{step.id}. {step.title}</p>
            </div>
            <AIDataSourceTag tag={step.tag} />
          </div>
          <p className="text-xs text-[#64748B]">{step.records}</p>
          <p className="mt-1 text-[11px] text-[#94A3B8]">Last processed: 2026-04-29 08:14 WIB</p>
        </div>
      ))}
    </div>
  );
}
