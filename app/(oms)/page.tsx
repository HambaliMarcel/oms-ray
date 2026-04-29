"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/oms/topbar";
import { AiAssistant } from "@/components/oms/ai-assistant";
import { formatRupiah } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  baselineCompanyMetrics,
  unifiedAIGeneratedPositions,
  unifiedAIInsights,
  unifiedCostAnalysis,
  unifiedDepartments,
  unifiedEmployeesAll,
  unifiedKpiList,
  unifiedProcessKPIMaps,
  unifiedProcessList,
  unifiedWorkloadActivities,
} from "@/lib/om-metrics";
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CircleAlert,
  Cpu,
  DollarSign,
  GitBranch,
  Network,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();

  const totalKpiMapped = useMemo(() => new Set(unifiedProcessKPIMaps.map((k) => k.kpiId)).size, []);
  const totalKpi = useMemo(() => unifiedKpiList.length || 24, []);
  const kpiCoveragePct = Math.round((totalKpiMapped / Math.max(totalKpi, 1)) * 100);
  const overloadedEmployees = unifiedEmployeesAll.filter((e) => e.utilization > 100).length;
  const utilizationAvg = Math.round(unifiedEmployeesAll.reduce((s, e) => s + e.utilization, 0) / Math.max(unifiedEmployeesAll.length, 1));
  const underutilizedEmployees = unifiedEmployeesAll.filter((e) => e.utilization < 60).length;

  const kpiCoverageData = useMemo(() => {
    const countByKpi = new Map<string, number>();
    unifiedProcessKPIMaps.forEach((m) => countByKpi.set(m.kpiName, (countByKpi.get(m.kpiName) ?? 0) + 1));
    return Array.from(countByKpi.entries())
      .map(([kpi, processCount]) => ({ kpi, processCount }))
      .sort((a, b) => a.processCount - b.processCount)
      .slice(0, 8);
  }, []);

  const flowProcesses = unifiedProcessList.slice(0, 5);

  const workloadDistributionData = useMemo(
    () =>
      unifiedEmployeesAll
        .slice(0, 12)
        .map((e) => ({ name: e.name.split(" ").slice(0, 2).join(" "), workload: e.utilization })),
    [],
  );

  const costByDivisionData = useMemo(
    () =>
      unifiedCostAnalysis.slice(0, 8).map((c) => ({
        division: c.dept.replace("Divisi ", "").slice(0, 18),
        cost: Math.round(c.total / 1_000_000),
      })),
    [],
  );
  const costPerProcessData = useMemo(
    () =>
      unifiedProcessList
        .map((p) => {
          const processActs = unifiedWorkloadActivities.filter((a) => a.processId === p.id);
          const totalCost = processActs.reduce((s, a) => s + (a as any).activityMonthlyCost, 0);
          return { name: p.name.slice(0, 18), cost: Math.round(totalCost / 1_000_000), id: p.id };
        })
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 5),
    [],
  );

  const processEfficiencyInsights = useMemo(() => {
    const highestCost = costPerProcessData[0];
    const overloadedArea = unifiedProcessList
      .filter((p) => p.actualTime > p.sla)
      .sort((a, b) => b.actualTime - b.sla - (a.actualTime - a.sla))[0];
    const duplicate = unifiedWorkloadActivities.find((a, i, arr) => arr.findIndex((x) => x.name === a.name && x.processId !== a.processId) !== i);
    return [
      {
        title: "High Cost + Low Output",
        process: highestCost?.name ?? "-",
        severity: "High",
        summary: "Process cost is above peer benchmark while KPI remains below target.",
      },
      {
        title: "Overloaded Process Area",
        process: overloadedArea?.name ?? "-",
        severity: "Critical",
        summary: "Cycle time exceeds SLA and indicates execution bottlenecks.",
      },
      {
        title: "Duplicate Activities",
        process: duplicate?.processName ?? "-",
        severity: "Medium",
        summary: "Repeated activity pattern found across multiple processes.",
      },
    ];
  }, [costPerProcessData]);

  const aiPanelInsights = useMemo(() => unifiedAIInsights.slice(0, 4), []);
  const actionCenter = [
    { title: "Redistribute workload", reason: "Overloaded staff in operations and finance", area: "Workforce", priority: "High", route: "/workload-activity/assignment-management" },
    { title: "Optimize process", reason: "Cycle time exceeds SLA in key chain", area: "Process", priority: "High", route: "/business-process/process-chain" },
    { title: "Reduce cost", reason: "Top 5 processes consume disproportionate budget", area: "Financial", priority: "Medium", route: "/financial/breakdown" },
    { title: "Create new position", reason: "Role gap detected by AI for bottleneck areas", area: "Organization", priority: "Medium", route: "/organization/positions/create" },
  ];

  const orgSnapshot = useMemo(() => unifiedDepartments.slice(0, 6), []);
  const signatureFlow = {
    kpi: kpiCoverageData[0]?.kpi ?? "Operational Efficiency",
    process: flowProcesses[0]?.name ?? "-",
    activityCount: unifiedWorkloadActivities.filter((a) => a.processId === flowProcesses[0]?.id).length,
    employee: unifiedEmployeesAll.find((e) => e.position === flowProcesses[0]?.ownerPosition || e.position === flowProcesses[0]?.owner),
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        title="Executive OMS Dashboard"
        subtitle="— KPI, Process, Workforce, Cost"
        breadcrumb={["OM+", "Dashboard"]}
      />

      <main className="p-6 space-y-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "KPI Coverage", value: `${kpiCoveragePct}%`, hint: `${totalKpiMapped}/${totalKpi} mapped`, icon: Target, route: "/business-process/process-directory" },
            { label: "Business Processes", value: `${unifiedProcessList.length}`, hint: "active process map", icon: GitBranch, route: "/business-process/process-chain" },
            { label: "Activities", value: `${unifiedWorkloadActivities.length}`, hint: "execution workload units", icon: Network, route: "/workload-activity/activity-directory" },
            { label: "Workforce Utilization", value: `${utilizationAvg}%`, hint: "organization average", icon: Users, route: "/workload-activity/utilization-dashboard" },
            { label: "Overloaded Employees", value: `${overloadedEmployees}`, hint: "requires rebalancing", icon: AlertTriangle, route: "/workload-activity/assignment-management" },
            { label: "Total Workforce Cost", value: formatRupiah(baselineCompanyMetrics.totalMonthlyWorkforceCost), hint: "monthly", icon: DollarSign, route: "/financial/overview" },
          ].map((card) => (
            <button
              key={card.label}
              onClick={() => router.push(card.route)}
              className="rounded-2xl bg-white p-5 text-left shadow-[0_8px_22px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs text-[#94A3B8]">{card.label}</p>
                <span className="rounded-full bg-[#EFF6FF] p-2 text-[#2563EB]"><card.icon className="h-3.5 w-3.5" /></span>
              </div>
              <p className="mt-2 text-[30px] font-bold leading-none text-[#0F172A]">{card.value}</p>
              <p className="mt-1 text-xs text-[#64748B]">{card.hint}</p>
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8 space-y-6">
            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold">KPI {"->"} Process Coverage</h2>
                {kpiCoverageData.some((k) => k.processCount < 2) && (
                  <span className="rounded-full bg-[#FEF2F2] px-2 py-1 text-xs text-[#DC2626]">Uncovered KPI warning</span>
                )}
              </div>
              <div className="space-y-2">
                {kpiCoverageData.map((k) => (
                  <button key={k.kpi} onClick={() => router.push("/business-process/process-directory")} className="w-full text-left">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-[#334155]">{k.kpi}</span>
                      <span className={cn("font-semibold", k.processCount < 2 ? "text-[#DC2626]" : "text-[#2563EB]")}>{k.processCount} processes</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F1F5F9]">
                      <div className={cn("h-full rounded-full", k.processCount < 2 ? "bg-[#EF4444]" : "bg-[#2563EB]")} style={{ width: `${Math.min(100, k.processCount * 20)}%` }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <h2 className="mb-3 text-[18px] font-semibold">Process Flow Snapshot</h2>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {flowProcesses.map((p, idx) => {
                  const processActs = unifiedWorkloadActivities.filter((a) => a.processId === p.id);
                  const processWorkload = Math.round(processActs.reduce((s, a) => s + a.adjustedWorkload, 0));
                  const processCost = processActs.reduce((s, a) => s + ((a as any).activityMonthlyCost ?? 0), 0);
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <button onClick={() => router.push(`/business-process/process-directory/${p.id}`)} className="min-w-[220px] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-left hover:bg-white">
                        <p className="text-xs font-semibold text-[#0F172A]">{p.name}</p>
                        <p className="mt-1 text-[11px] text-[#64748B]">{p.dept}</p>
                        <p className="text-[11px] text-[#64748B]">Workload {processWorkload}h</p>
                        <p className="text-[11px] text-[#2563EB]">{formatRupiah(processCost)} / bulan</p>
                      </button>
                      {idx < flowProcesses.length - 1 && <ArrowRight className="h-4 w-4 text-[#94A3B8]" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                <h2 className="mb-3 text-[18px] font-semibold">Workload Distribution</h2>
                <div className="space-y-2">
                  {workloadDistributionData.map((w) => (
                    <button key={w.name} onClick={() => router.push("/organization/employees")} className="w-full text-left">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{w.name}</span><span>{w.workload}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#F1F5F9]">
                        <div
                          className={cn("h-full rounded-full", w.workload > 100 ? "bg-[#EF4444]" : w.workload >= 90 ? "bg-[#F59E0B]" : w.workload >= 60 ? "bg-[#22C55E]" : "bg-[#94A3B8]")}
                          style={{ width: `${Math.min(100, w.workload)}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[#DC2626]">Overloaded: {overloadedEmployees}</span>
                  <span className="text-[#64748B]">Underutilized: {underutilizedEmployees}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                <h2 className="mb-3 text-[18px] font-semibold">Cost Analysis Snapshot</h2>
                <div className="h-[170px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costByDivisionData}>
                      <CartesianGrid stroke="#EEF2F7" vertical={false} />
                      <XAxis dataKey="division" tick={{ fontSize: 10 }} interval={0} angle={-15} height={40} />
                      <YAxis hide />
                      <Tooltip formatter={(v: number) => `${v} Juta`} />
                      <Bar dataKey="cost" fill="#2563EB" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-1">
                  {costPerProcessData.map((p) => (
                    <button key={p.id} onClick={() => router.push(`/business-process/process-directory/${p.id}`)} className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs hover:bg-[#F8FAFC]">
                      <span>{p.name}</span><span className="font-semibold text-[#0F172A]">{p.cost} Juta</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <h2 className="mb-3 text-[18px] font-semibold">Process Efficiency Insight</h2>
              <div className="space-y-2">
                {processEfficiencyInsights.map((i) => (
                  <button key={i.title} onClick={() => router.push("/business-process/process-directory")} className="w-full rounded-xl border border-[#EEF2F7] p-3 text-left hover:bg-[#F8FAFC]">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">{i.title}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px]", i.severity === "Critical" ? "bg-[#FEE2E2] text-[#DC2626]" : i.severity === "High" ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#E2E8F0] text-[#475569]")}>{i.severity}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#64748B]">{i.process}</p>
                    <p className="text-[11px] text-[#475569]">{i.summary}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#EEF6FF] p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#2563EB]" />
                <h2 className="text-[18px] font-semibold">AI Insight Panel</h2>
              </div>
              <div className="space-y-2">
                {aiPanelInsights.map((insight) => (
                  <button key={insight.id} onClick={() => router.push(`/ai/insights?insightId=${insight.id}`)} className="w-full rounded-xl bg-white p-3 text-left hover:shadow-sm">
                    <p className="text-xs font-semibold text-[#0F172A]">{insight.title}</p>
                    <p className="mt-1 text-[11px] text-[#64748B]">{insight.summary}</p>
                    <p className="mt-1 text-[11px] text-[#2563EB]">Impact: {insight.dataEvidence.costImpact} / {insight.workloadImpact} / KPI {insight.kpiImpact}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <h2 className="mb-3 text-[18px] font-semibold">Action Center</h2>
              <div className="space-y-2">
                {actionCenter.map((a) => (
                  <button key={a.title} onClick={() => router.push(a.route)} className="w-full rounded-xl border border-[#EEF2F7] p-3 text-left hover:bg-[#F8FAFC]">
                    <p className="text-xs font-semibold">{a.title}</p>
                    <p className="text-[11px] text-[#64748B]">{a.reason}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-[#475569]">{a.area}</span>
                      <span className={cn("rounded-full px-2 py-0.5", a.priority === "High" ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#FEF3C7] text-[#D97706]")}>{a.priority}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-5 rounded-2xl bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
            <h2 className="mb-3 text-[18px] font-semibold">Organization Snapshot</h2>
            <div className="space-y-2">
              <button onClick={() => router.push("/organization/tree")} className="w-full rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-3 text-left">
                <p className="text-xs font-semibold">PT Pelabuhan Indonesia (Persero)</p>
                <p className="text-[11px] text-[#64748B]">{baselineCompanyMetrics.totalEmployees} HC • {baselineCompanyMetrics.averageUtilizationPct}% util</p>
              </button>
              {orgSnapshot.map((d) => (
                <button key={d.id} onClick={() => router.push("/organization/tree")} className="ml-4 w-[calc(100%-1rem)] rounded-xl border border-[#EEF2F7] p-2 text-left hover:bg-[#F8FAFC]">
                  <p className="text-xs font-medium">{d.name}</p>
                  <p className="text-[11px] text-[#64748B]">{d.hc} HC • KPI {d.kpi}%</p>
                </button>
              ))}
            </div>
          </div>

          <div className="xl:col-span-7 rounded-2xl bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
            <h2 className="mb-3 text-[18px] font-semibold">KPI {"->"} Process {"->"} Workload Flow</h2>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button onClick={() => router.push("/business-process/process-directory")} className="rounded-xl bg-[#EFF6FF] px-3 py-2 text-left">
                <p className="font-semibold">KPI</p><p>{signatureFlow.kpi}</p>
              </button>
              <ArrowRight className="h-3.5 w-3.5 text-[#94A3B8]" />
              <button onClick={() => router.push(`/business-process/process-directory/${flowProcesses[0]?.id ?? ""}`)} className="rounded-xl bg-[#F8FAFC] px-3 py-2 text-left">
                <p className="font-semibold">Process</p><p>{signatureFlow.process}</p>
              </button>
              <ArrowRight className="h-3.5 w-3.5 text-[#94A3B8]" />
              <button onClick={() => router.push("/workload-activity/activity-directory")} className="rounded-xl bg-[#F8FAFC] px-3 py-2 text-left">
                <p className="font-semibold">Activity</p><p>{signatureFlow.activityCount} activities</p>
              </button>
              <ArrowRight className="h-3.5 w-3.5 text-[#94A3B8]" />
              <button onClick={() => router.push(signatureFlow.employee ? `/organization/employees/${signatureFlow.employee.id}` : "/organization/employees")} className="rounded-xl bg-[#F8FAFC] px-3 py-2 text-left">
                <p className="font-semibold">Employee</p><p>{signatureFlow.employee?.name ?? "-"} • {signatureFlow.employee?.utilization ?? 0}%</p>
              </button>
            </div>
          </div>
        </section>
      </main>

      <AiAssistant />
    </div>
  );
}
