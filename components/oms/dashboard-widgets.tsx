"use client";

import { useRouter } from "next/navigation";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import {
  processHealth, workforceRisk, hcGapByDept, costVsBudget,
  monthlyTrend, approvalRecords,
} from "@/lib/oms-data";
import { AlertTriangle, ArrowUpRight, Clock } from "lucide-react";
import { formatRupiah } from "@/lib/currency";
import { unifiedProcessList as processList } from "@/lib/om-metrics";

function WidgetCard({
  title,
  subtitle,
  linkTo,
  children,
}: {
  title: string;
  subtitle?: string;
  linkTo: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={() => router.push(linkTo)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      {children}
    </div>
  );
}

// 1. Process Health
export function ProcessHealthWidget() {
  const router = useRouter();
  return (
    <WidgetCard title="Process Health" subtitle="All business processes" linkTo="/business-process/process-chain">
      <div className="space-y-2.5">
        {processHealth.map((p) => (
          <button
            key={p.process}
            type="button"
            className="w-full text-left"
            onClick={() => {
              const match = processList.find((x) => x.name === p.process || x.code === p.process);
              if (match) {
                router.push(`/business-process/process-directory/${match.id}`);
                return;
              }
              router.push("/business-process/process-chain");
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-foreground">{p.process}</span>
              <span className={`text-xs font-semibold ${p.health >= p.target ? "text-green-600" : p.health >= 75 ? "text-amber-600" : "text-red-600"}`}>
                {p.health}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${p.health}%`,
                  background: p.health >= p.target ? "var(--chart-3)" : p.health >= 75 ? "var(--warning)" : "var(--chart-5)",
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </WidgetCard>
  );
}

// 2. Workforce Risk
export function WorkforceRiskWidget() {
  const data = workforceRisk.map((r) => ({ subject: r.category.replace(" Risk", "").replace(" Gap", ""), score: r.score }));
  return (
    <WidgetCard title="Workforce Risk" subtitle="Risk index by category" linkTo="/scenario/builder">
      <ResponsiveContainer width="100%" height={160}>
        <RadarChart data={data}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.18} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-1.5">
        {workforceRisk.filter((r) => r.level === "High").map((r) => (
          <div key={r.category} className="flex items-center gap-1.5 bg-red-50 rounded-lg px-2 py-1.5">
            <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
            <span className="text-xs text-red-700 font-medium">{r.category}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

// 3. HC Gap Heatmap
export function HcGapHeatmapWidget() {
  return (
    <WidgetCard title="HC Gap Heatmap" subtitle="Vacancy gap by department" linkTo="/organization/positions?status=Open">
      <div className="grid grid-cols-2 gap-2">
        {hcGapByDept.map((d) => (
          <div
            key={d.dept}
            className="rounded-lg p-3 text-center cursor-pointer hover:opacity-90 transition-opacity"
            style={{
              background:
                d.risk === "High" ? "#FEF2F2" :
                d.risk === "Medium" ? "#FEF9EC" : "#EDF7F0",
            }}
          >
            <p className="text-lg font-bold"
              style={{ color: d.risk === "High" ? "#DC2626" : d.risk === "Medium" ? "#D97706" : "#16A34A" }}>
              -{d.gap}
            </p>
            <p className="text-xs font-medium text-foreground">{d.dept}</p>
            <p className="text-xs text-muted-foreground">{d.risk} risk</p>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

// 4. Cost vs Budget
export function CostVsBudgetWidget() {
  return (
    <WidgetCard title="Cost vs Budget" subtitle="Rupiah — current month" linkTo="/financial/overview">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={costVsBudget} barGap={2} barSize={10}>
          <XAxis dataKey="dept" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
            formatter={(v: number) => [formatRupiah(v), ""]}
          />
          <Bar dataKey="budget" fill="var(--muted)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-muted border border-border" />
          <span className="text-xs text-muted-foreground">Budget</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--primary)" }} />
          <span className="text-xs text-muted-foreground">Actual</span>
        </div>
      </div>
    </WidgetCard>
  );
}

// 5. Pending Approvals
export function PendingApprovalsWidget() {
  const pending = approvalRecords.filter((a) => a.status === "Pending" || a.status === "In Review");
  const router = useRouter();
  return (
    <WidgetCard title="Pending Approvals" subtitle={`${pending.length} require action`} linkTo="/scenario/directory">
      <div className="space-y-2">
        {pending.slice(0, 4).map((a) => (
          <div
            key={a.id}
            onClick={() => router.push(`/scenario/directory`)}
            className="flex items-center justify-between p-2.5 rounded-lg bg-muted hover:bg-secondary cursor-pointer transition-colors"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{a.type}</p>
              <p className="text-xs text-muted-foreground">{a.requestor} · {a.dept}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                a.priority === "Critical" ? "bg-red-100 text-red-700" :
                a.priority === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
              }`}>
                {a.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

// 6. Growth Trend
export function GrowthTrendWidget() {
  return (
    <WidgetCard title="Growth Trend" subtitle="Headcount vs cost trajectory" linkTo="/scenario/builder">
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={monthlyTrend}>
          <XAxis dataKey="month" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="hc" hide domain={["auto", "auto"]} />
          <YAxis yAxisId="cost" hide domain={["auto", "auto"]} orientation="right" />
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
            formatter={(v: number, name: string) => name === "budget" ? [formatRupiah(v), "Cost"] : [v, "Headcount"]}
          />
          <Line yAxisId="hc" dataKey="headcount" stroke="var(--primary)" strokeWidth={2} dot={false} />
          <Line yAxisId="cost" dataKey="budget" stroke="var(--chart-4)" strokeWidth={2} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Headcount MoM</p>
          <p className="text-sm font-semibold text-green-600">+20 <span className="text-xs font-normal text-muted-foreground">this month</span></p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Cost MoM</p>
          <p className="text-sm font-semibold text-foreground">{formatRupiah(0)} <span className="text-xs font-normal text-muted-foreground">stable</span></p>
        </div>
      </div>
    </WidgetCard>
  );
}
