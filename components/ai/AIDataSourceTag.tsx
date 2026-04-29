import { AIModuleTag } from "@/lib/om-metrics";

const labelStyles: Record<AIModuleTag, string> = {
  "Org Data": "bg-[#EFF6FF] text-[#1D4ED8]",
  "Process Data": "bg-[#ECFEFF] text-[#0F766E]",
  "Workload Data": "bg-[#EEF2FF] text-[#4338CA]",
  "Cost Data": "bg-[#FFF7ED] text-[#C2410C]",
  "Scenario Data": "bg-[#F5F3FF] text-[#6D28D9]",
};

export function AIDataSourceTag({ tag }: { tag: AIModuleTag }) {
  return <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${labelStyles[tag]}`}>{tag}</span>;
}
