"use client";

import { useRouter } from "next/navigation";
import { baselineCompanyMetrics, formatNumber, formatPercent } from "@/lib/om-metrics";
import { formatRupiah } from "@/lib/currency";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const kpiConfig = [
  { key: "headcount", label: "Headcount", icon: "HC" },
  { key: "positions", label: "Positions", icon: "POS" },
  { key: "vacancy", label: "Vacancy", icon: "VAC" },
  { key: "hcGap", label: "HC Gap", icon: "GAP" },
  { key: "utilization", label: "Utilization", icon: "UTL" },
  { key: "cost", label: "Total Cost", icon: "CST" },
  { key: "kpiScore", label: "KPI Score", icon: "KPI" },
] as const;

type KpiKey = "headcount" | "positions" | "vacancy" | "hcGap" | "utilization" | "cost" | "kpiScore";

const kpiRouteMap: Record<string, string> = {
  headcount: "/organization/employees",
  positions: "/organization/positions",
  vacancy: "/organization/positions?status=Open",
  hcGap: "/scenario/builder",
  utilization: "/workload-activity/utilization-dashboard",
  cost: "/financial/overview",
  kpiScore: "/business-process/process-directory",
};

function statusColor(status: string) {
  if (status === "good") return { bg: "#EDF7F0", text: "#16A34A", dot: "#16A34A" };
  if (status === "warning") return { bg: "#FEF9EC", text: "#D97706", dot: "#D97706" };
  return { bg: "#FEF2F2", text: "#DC2626", dot: "#DC2626" };
}

export function KpiStrip() {
  const router = useRouter();
  const kpiData = {
    headcount: { value: baselineCompanyMetrics.totalEmployees, target: 580, status: "good", trend: "+1.8%", prefix: "", unit: "" },
    positions: { value: baselineCompanyMetrics.totalPositions, target: 650, status: "warning", trend: "+0.9%", prefix: "", unit: "" },
    vacancy: { value: baselineCompanyMetrics.vacantPositions, target: 60, status: "warning", trend: "-1.2%", prefix: "", unit: "" },
    hcGap: { value: 18.4, target: 12, status: "critical", trend: "-0.6%", prefix: "", unit: " FTE" },
    utilization: { value: baselineCompanyMetrics.averageUtilizationPct, target: 92, status: "good", trend: "+0.7%", prefix: "", unit: "%" },
    cost: { value: baselineCompanyMetrics.totalMonthlyWorkforceCost, target: 26_000_000_000, status: "good", trend: "-1.5%", prefix: "", unit: "" },
    kpiScore: { value: baselineCompanyMetrics.processKpiScore, target: 88, status: "warning", trend: "+0.4%", prefix: "", unit: "%" },
  } as const;

  return (
    <div className="grid grid-cols-7 gap-3">
      {kpiConfig.map(({ key, label }) => {
        const kpi = kpiData[key as KpiKey];
        const colors = statusColor(kpi.status);
        const isUp = kpi.trend.startsWith("+");
        const isDown = kpi.trend.startsWith("-");

        return (
          <button
            key={key}
            onClick={() => router.push(kpiRouteMap[key] || "/")}
            className="bg-card rounded-xl p-4 border border-border hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
          >
            {/* Status dot + trend */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: colors.dot }}
              />
              <span
                className="text-xs font-medium flex items-center gap-0.5"
                style={{ color: colors.text }}
              >
                {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                {kpi.trend}
              </span>
            </div>

            {/* Value */}
            <p className="text-2xl font-bold text-foreground leading-none mb-1">
              {key === "cost"
                ? formatRupiah(kpi.value)
                : key === "utilization" || key === "kpiScore"
                ? formatPercent(kpi.value)
                : key === "hcGap"
                ? `${kpi.value.toLocaleString("id-ID")} FTE`
                : formatNumber(kpi.value)}
            </p>

            {/* Label */}
            <p className="text-xs text-muted-foreground font-medium">{label}</p>

            {/* Target */}
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Target</span>
                <span className="text-xs font-medium text-foreground">
                  {key === "cost"
                    ? formatRupiah(kpi.target)
                    : key === "utilization" || key === "kpiScore"
                    ? formatPercent(kpi.target)
                    : key === "hcGap"
                    ? `${kpi.target.toLocaleString("id-ID")} FTE`
                    : formatNumber(kpi.target)}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
