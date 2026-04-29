import { AISeverity } from "@/lib/om-metrics";

const severityMap: Record<AISeverity, { bg: string; text: string }> = {
  Critical: { bg: "#FEE2E2", text: "#B91C1C" },
  High: { bg: "#FFEDD5", text: "#C2410C" },
  Medium: { bg: "#FEF3C7", text: "#B45309" },
  Low: { bg: "#DCFCE7", text: "#15803D" },
};

export function AIScoreBadge({ severity, confidence }: { severity: AISeverity; confidence?: number }) {
  const c = severityMap[severity];
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: c.bg, color: c.text }}>
        {severity}
      </span>
      {confidence !== undefined && (
        <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#1D4ED8]">Confidence {confidence}%</span>
      )}
    </div>
  );
}
