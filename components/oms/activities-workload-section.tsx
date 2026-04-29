"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity, AlertTriangle, BarChart2, ChevronRight, Gauge as GaugeIcon,
  Layers, Plus, Target, TrendingDown, TrendingUp, UserMinus, X, Zap, Sparkles,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ACTIVITY_CATALOG,
  EmployeeActivity, KpiContribution, PositionActivity,
  STANDARD_MONTHLY_HOURS,
  aggregateEmployeeUtilization, aggregatePositionUtilization,
  getActivitiesForEmployee, getActivitiesForPosition,
  getKpiContributions, getProcessSplit, statusFromUtil,
} from "@/lib/oms-activities";
import { Button } from "@/components/ui/button";

type Props =
  | { kind: "position"; positionId: string; filled: number }
  | { kind: "employee"; employeeId: string };

const PROCESS_COLORS = ["#2563EB", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
const STATUS_BG: Record<string, string> = { Overloaded: "#FEE2E2", Balanced: "#DCFCE7", Underutilized: "#FEF3C7" };
const STATUS_FG: Record<string, string> = { Overloaded: "var(--destructive)", Balanced: "var(--success)", Underutilized: "var(--warning)" };
const KPI_BG: Record<string, string> = { "On Track": "#DCFCE7", "At Risk": "#FEF3C7", Critical: "#FEE2E2" };
const KPI_FG: Record<string, string> = { "On Track": "var(--success)", "At Risk": "var(--warning)", Critical: "var(--destructive)" };

function StatusPill({ s }: { s: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
      style={{ background: STATUS_BG[s] ?? "var(--muted)", color: STATUS_FG[s] ?? "var(--muted-foreground)" }}>
      {s}
    </span>
  );
}

function Gauge({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(150, value));
  const status = statusFromUtil(v);
  // arc 0..150 maps to 0..180 deg
  const angle = (v / 150) * 180;
  const r = 60, cx = 80, cy = 80;
  const rad = (deg: number) => ((180 - deg) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(0)), y1 = cy - r * Math.sin(rad(0));
  const x2 = cx + r * Math.cos(rad(180)), y2 = cy - r * Math.sin(rad(180));
  const xv = cx + r * Math.cos(rad(angle)), yv = cy - r * Math.sin(rad(angle));
  const large = angle > 180 ? 1 : 0;
  const color = STATUS_FG[status];
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="160" height="100" viewBox="0 0 160 100">
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke="var(--muted)" strokeWidth="14" strokeLinecap="round" />
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${xv} ${yv}`} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--foreground)">{v.toFixed(0)}%</text>
      </svg>
      <p className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</p>
    </div>
  );
}

export function ActivitiesWorkloadSection(props: Props) {
  // ---------- BASE ACTIVITIES ----------
  const base = useMemo<PositionActivity[] | EmployeeActivity[]>(
    () => props.kind === "position"
      ? getActivitiesForPosition(props.positionId)
      : getActivitiesForEmployee(props.employeeId),
    [props]
  );

  // ---------- SIMULATOR STATE ----------
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  type ExtraActivity = { id: string; name: string; hours: number; processId: string; processName: string; kpiId: string; kpiName: string };
  const [extras, setExtras] = useState<ExtraActivity[]>([]);
  const [removedEmployees, setRemovedEmployees] = useState(0);
  const [draftId, setDraftId] = useState<string>(ACTIVITY_CATALOG[0].id);
  const [draftHours, setDraftHours] = useState<number>(8);

  const filled = props.kind === "position" ? props.filled : 1;
  const effectiveFilled = Math.max(1, filled - removedEmployees);

  // active rows after removal toggles, plus extras as virtual rows
  const activeBase = useMemo(() => base.filter((a) => !removedIds.has(a.id)), [base, removedIds]);

  type Row = {
    id: string; name: string; processId: string; processName: string;
    kpiId: string; kpiName: string;
    frequency: number; duration: number;
    workloadHours: number; perEmployeeHours: number;
    assignedEmployees?: number;
    allocationPct?: number;
    utilization: number;
    status: "Overloaded" | "Balanced" | "Underutilized";
    hypothetical?: boolean;
  };

  const rows: Row[] = useMemo(() => {
    const realRows: Row[] = activeBase.map((a) => {
      if (props.kind === "position") {
        const r = a as PositionActivity;
        const newWorkload = r.workloadHours;
        const perEmp = Math.round((newWorkload / effectiveFilled) * 10) / 10;
        const util = Math.round((newWorkload / (effectiveFilled * STANDARD_MONTHLY_HOURS)) * 1000) / 10;
        return { ...r, perEmployeeHours: perEmp, assignedEmployees: effectiveFilled, utilization: util, status: statusFromUtil(util) };
      }
      const r = a as EmployeeActivity;
      return { ...r, allocationPct: r.allocationPct };
    });
    const extraRows: Row[] = extras.map((x) => {
      const totalHours = x.hours;
      const perEmp = props.kind === "position"
        ? Math.round((totalHours / effectiveFilled) * 10) / 10
        : totalHours;
      const util = props.kind === "position"
        ? Math.round((totalHours / (effectiveFilled * STANDARD_MONTHLY_HOURS)) * 1000) / 10
        : Math.round((totalHours / STANDARD_MONTHLY_HOURS) * 1000) / 10;
      return {
        id: x.id, name: x.name,
        processId: x.processId, processName: x.processName,
        kpiId: x.kpiId, kpiName: x.kpiName,
        frequency: 1, duration: totalHours,
        workloadHours: totalHours, perEmployeeHours: perEmp,
        assignedEmployees: props.kind === "position" ? effectiveFilled : undefined,
        allocationPct: props.kind === "employee" ? util : undefined,
        utilization: util,
        status: statusFromUtil(util),
        hypothetical: true,
      };
    });
    return [...realRows, ...extraRows];
  }, [activeBase, extras, effectiveFilled, props.kind]);

  // ---------- AGGREGATES ----------
  const totalHours = rows.reduce((s, r) => s + (props.kind === "position" ? r.workloadHours : r.perEmployeeHours), 0);
  const totalUtil = props.kind === "position"
    ? aggregatePositionUtilization(
        rows.map((r) => ({ ...r } as PositionActivity)) as PositionActivity[],
        effectiveFilled
      )
    : aggregateEmployeeUtilization(rows as unknown as EmployeeActivity[]);
  const overall = statusFromUtil(totalUtil);

  // baseline (no edits) for delta
  const baseTotal = base.reduce((s, r) => s + (props.kind === "position" ? r.workloadHours : (r as EmployeeActivity).perEmployeeHours), 0);
  const baseUtil = props.kind === "position"
    ? Math.round((baseTotal / (filled * STANDARD_MONTHLY_HOURS)) * 1000) / 10
    : Math.round((baseTotal / STANDARD_MONTHLY_HOURS) * 1000) / 10;
  const utilDelta = Math.round((totalUtil - baseUtil) * 10) / 10;

  const processSplit = useMemo(
    () => getProcessSplit(
      rows.map((r) => ({ processId: r.processId, processName: r.processName, workloadHours: r.workloadHours, perEmployeeHours: r.perEmployeeHours })),
      props.kind === "position" ? "team" : "self"
    ),
    [rows, props.kind]
  );
  const kpiContribs: KpiContribution[] = useMemo(
    () => getKpiContributions(
      rows.map((r) => ({ kpiId: r.kpiId, kpiName: r.kpiName, workloadHours: r.workloadHours, perEmployeeHours: r.perEmployeeHours })),
      props.kind === "position" ? "team" : "self"
    ),
    [rows, props.kind]
  );

  const radarData = kpiContribs.map((k) => ({ kpi: k.kpiName.length > 18 ? k.kpiName.slice(0, 16) + "…" : k.kpiName, contribution: k.contributionPct }));
  const barData = rows.map((r) => ({ name: r.name.length > 14 ? r.name.slice(0, 12) + "…" : r.name, hours: props.kind === "position" ? r.workloadHours : r.perEmployeeHours, hypothetical: r.hypothetical }));

  const linkedProcessCount = new Set(rows.map((r) => r.processId)).size;
  const linkedKpiCount = new Set(rows.map((r) => r.kpiId)).size;

  // ---------- HANDLERS ----------
  const toggleRemove = (id: string) => {
    setRemovedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const addExtra = () => {
    const tpl = ACTIVITY_CATALOG.find((t) => t.id === draftId);
    if (!tpl) return;
    const sid = `EXT-${Date.now().toString().slice(-6)}`;
    setExtras((p) => [...p, {
      id: sid, name: `+ ${tpl.name}`, hours: draftHours,
      processId: tpl.processId, processName: tpl.processName,
      kpiId: tpl.kpiId, kpiName: tpl.kpiName,
    }]);
  };
  const resetSim = () => { setRemovedIds(new Set()); setExtras([]); setRemovedEmployees(0); };

  const showSim = removedIds.size > 0 || extras.length > 0 || removedEmployees > 0;

  // ---------- RENDER ----------
  return (
    <div className="rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
            <Activity className="w-4 h-4" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Activities, Workload &amp; Performance</p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Live operational view linking processes, workload, and KPIs.</p>
          </div>
        </div>
        <StatusPill s={overall} />
      </div>

      {/* TOP SUMMARY KPI ROW */}
      <div className="grid grid-cols-5 gap-3 p-5 border-b" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "Activities",       value: rows.length,                   icon: Layers,     color: "var(--primary)" },
          { label: "Workload Hours",   value: `${totalHours.toFixed(0)} h`,  icon: BarChart2,  color: "var(--accent)"  },
          { label: "Utilization",      value: `${totalUtil.toFixed(1)}%`,    icon: GaugeIcon,  color: STATUS_FG[overall] },
          { label: "Processes",        value: linkedProcessCount,            icon: Activity,   color: "var(--success)" },
          { label: "KPIs Impacted",    value: linkedKpiCount,                icon: Target,     color: "var(--warning)" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-3 border flex items-center gap-3" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <s.icon className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
            <div>
              <p className="text-base font-bold leading-tight" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ACTIVITY TABLE */}
      <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
          Activity Catalog ({rows.length})
        </p>
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                {(props.kind === "position"
                  ? ["Activity","Process","KPI","Freq /mo","Dur (h)","Assigned","Workload (h)","Util","Status",""]
                  : ["Activity","Process","KPI","Freq /mo","Dur (h)","Workload (h)","Allocation","Util","Status",""]
                ).map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-semibold whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    No activities currently mapped to this {props.kind}.
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={`${r.id}-${i}`}
                    style={{ borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border)", background: r.hypothetical ? "rgba(37,99,235,0.04)" : undefined }}>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/workload-activity/activity-directory/${r.id}`} className="font-medium hover:underline" style={{ color: "var(--foreground)" }}>{r.name}</Link>
                      {r.hypothetical && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>HYPOTHETICAL</span>}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <Link href="/business-process/process-directory" className="hover:underline" style={{ color: "var(--primary)" }}>{r.processName}</Link>
                  </td>
                  <td className="py-2 px-3">
                    <Link href={`/process/directory`} className="hover:underline" style={{ color: "var(--accent)" }}>{r.kpiName}</Link>
                  </td>
                  <td className="py-2 px-3 tabular-nums" style={{ color: "var(--foreground)" }}>{r.frequency}</td>
                  <td className="py-2 px-3 tabular-nums" style={{ color: "var(--foreground)" }}>{r.duration}</td>
                  {props.kind === "position" && (<td className="py-2 px-3 tabular-nums" style={{ color: "var(--foreground)" }}>{r.assignedEmployees ?? effectiveFilled}</td>)}
                  <td className="py-2 px-3 tabular-nums font-semibold" style={{ color: "var(--foreground)" }}>
                    {(props.kind === "position" ? r.workloadHours : r.perEmployeeHours).toFixed(1)}
                  </td>
                  {props.kind === "employee" && (<td className="py-2 px-3 tabular-nums" style={{ color: "var(--muted-foreground)" }}>{(r.allocationPct ?? r.utilization).toFixed(1)}%</td>)}
                  <td className="py-2 px-3 tabular-nums font-semibold" style={{ color: STATUS_FG[r.status] }}>{r.utilization.toFixed(1)}%</td>
                  <td className="py-2 px-3"><StatusPill s={r.status} /></td>
                  <td className="py-2 px-3">
                    <button title="Remove from simulator" onClick={() => toggleRemove(r.id)}
                      className="p-1 rounded hover:bg-black/5 disabled:opacity-30"
                      disabled={r.hypothetical}>
                      <X className="w-3 h-3" style={{ color: "var(--muted-foreground)" }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {removedIds.size > 0 && (
          <p className="text-[11px] mt-2" style={{ color: "var(--muted-foreground)" }}>
            {removedIds.size} activity {removedIds.size === 1 ? "row" : "rows"} hidden by simulator.
            <button onClick={() => setRemovedIds(new Set())} className="ml-2 underline" style={{ color: "var(--primary)" }}>Restore all</button>
          </p>
        )}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-12 gap-4 p-5 border-b" style={{ borderColor: "var(--border)" }}>
        {/* Bar */}
        <div className="col-span-7 rounded-lg border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--foreground)" }}>Workload per Activity (hours / month)</p>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={barData}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} interval={0} angle={-15} textAnchor="end" height={50} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
                  {barData.map((d, i) => (<Cell key={i} fill={d.hypothetical ? "var(--accent)" : "var(--primary)"} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-40 flex items-center justify-center text-xs" style={{ color: "var(--muted-foreground)" }}>No activity data.</div>}
        </div>

        {/* Gauge */}
        <div className="col-span-2 rounded-lg border p-4 flex flex-col items-center justify-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold mb-1 self-start" style={{ color: "var(--foreground)" }}>Utilization</p>
          <Gauge value={totalUtil} label={`${totalHours.toFixed(0)} / ${(effectiveFilled * STANDARD_MONTHLY_HOURS).toFixed(0)} h`} />
          {showSim && (
            <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: utilDelta > 0 ? "var(--destructive)" : utilDelta < 0 ? "var(--success)" : "var(--muted-foreground)" }}>
              {utilDelta > 0 ? <TrendingUp className="w-3 h-3" /> : utilDelta < 0 ? <TrendingDown className="w-3 h-3" /> : null}
              {utilDelta > 0 ? "+" : ""}{utilDelta.toFixed(1)}% vs baseline
            </p>
          )}
        </div>

        {/* Process pie */}
        <div className="col-span-3 rounded-lg border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--foreground)" }}>Workload by Process</p>
          {processSplit.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={processSplit} dataKey="hours" nameKey="processName" cx="50%" cy="50%" outerRadius={60} innerRadius={30}>
                  {processSplit.map((_, i) => <Cell key={i} fill={PROCESS_COLORS[i % PROCESS_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} formatter={(v: number, _n, p: any) => [`${v.toFixed(1)} h (${p?.payload?.pct ?? 0}%)`, p?.payload?.processName ?? "Process"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-40 flex items-center justify-center text-xs" style={{ color: "var(--muted-foreground)" }}>—</div>}
        </div>
      </div>

      {/* KPI LINKAGE */}
      <div className="grid grid-cols-12 gap-4 p-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="col-span-7 rounded-lg border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: "var(--foreground)" }}>
            <Target className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} /> KPI Scorecard
          </p>
          <div className="overflow-x-auto rounded border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  {["KPI", "Target", "Actual", "Contribution", "Status"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpiContribs.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-4 text-xs" style={{ color: "var(--muted-foreground)" }}>No KPI links.</td></tr>
                )}
                {kpiContribs.map((k, i) => (
                  <tr key={k.kpiId} style={{ borderBottom: i === kpiContribs.length - 1 ? "none" : "1px solid var(--border)" }}>
                    <td className="py-2 px-3">
                      <Link href={`/process/directory`} className="hover:underline font-medium" style={{ color: "var(--foreground)" }}>
                        {k.kpiName}
                      </Link>
                    </td>
                    <td className="py-2 px-3 tabular-nums" style={{ color: "var(--muted-foreground)" }}>{k.target}{k.unit ? ` ${k.unit.replace("$", "Rp").replace("USD", "Rp")}` : ""}</td>
                    <td className="py-2 px-3 tabular-nums font-semibold" style={{ color: "var(--foreground)" }}>{k.actual}{k.unit ? ` ${k.unit.replace("$", "Rp").replace("USD", "Rp")}` : ""}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full" style={{ background: "var(--muted)" }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, k.contributionPct)}%`, background: "var(--primary)" }} />
                        </div>
                        <span className="text-[11px] tabular-nums" style={{ color: "var(--muted-foreground)" }}>{k.contributionPct}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
                        style={{ background: KPI_BG[k.status] ?? "var(--muted)", color: KPI_FG[k.status] ?? "var(--muted-foreground)" }}>
                        {k.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-5 rounded-lg border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--foreground)" }}>KPI Contribution Map</p>
          {radarData.length >= 3 ? (
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="kpi" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                <Radar name="Contribution" dataKey="contribution" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${v}%`, "Contribution"]} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="space-y-2 mt-2">
              {kpiContribs.map((k) => (
                <div key={k.kpiId}>
                  <div className="flex justify-between text-[11px]"><span style={{ color: "var(--foreground)" }}>{k.kpiName}</span><span style={{ color: "var(--muted-foreground)" }}>{k.contributionPct}%</span></div>
                  <div className="h-1.5 rounded-full mt-1" style={{ background: "var(--muted)" }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, k.contributionPct)}%`, background: "var(--primary)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* WORKLOAD IMPACT SIMULATOR */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} /> Workload Impact Simulator
          </p>
          {showSim && (
            <Button size="sm" variant="outline" className="text-xs gap-1" onClick={resetSim}>
              <X className="w-3 h-3" /> Reset
            </Button>
          )}
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Add hypothetical activity */}
          <div className="col-span-5 rounded-lg border p-4" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "var(--foreground)" }}>
              <Plus className="w-3.5 h-3.5" style={{ color: "var(--success)" }} /> Add Hypothetical Activity
            </p>
            <div className="flex flex-col gap-2">
              <select className="rounded border bg-white px-2 py-1.5 text-xs" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                value={draftId} onChange={(e) => setDraftId(e.target.value)}>
                {ACTIVITY_CATALOG.map((t) => (<option key={t.id} value={t.id}>{t.name} — {t.kpiName}</option>))}
              </select>
              <div className="flex items-center gap-2">
                <input type="range" min={1} max={80} value={draftHours} onChange={(e) => setDraftHours(Number(e.target.value))} className="flex-1" />
                <span className="text-xs font-bold tabular-nums w-14 text-right" style={{ color: "var(--foreground)" }}>{draftHours} h/mo</span>
              </div>
              <Button size="sm" className="text-xs gap-1 self-start" style={{ background: "var(--primary)", color: "white" }} onClick={addExtra}>
                <Plus className="w-3 h-3" /> Add to simulation
              </Button>
            </div>
          </div>

          {/* Remove employee (position only) */}
          {props.kind === "position" && (
            <div className="col-span-4 rounded-lg border p-4" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "var(--foreground)" }}>
                <UserMinus className="w-3.5 h-3.5" style={{ color: "var(--destructive)" }} /> Remove Employees
              </p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="range" min={0} max={Math.max(0, filled - 1)}
                  value={removedEmployees} onChange={(e) => setRemovedEmployees(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs font-bold tabular-nums w-20 text-right" style={{ color: "var(--foreground)" }}>
                  -{removedEmployees} of {filled}
                </span>
              </div>
              <p className="text-[10px] mt-2" style={{ color: "var(--muted-foreground)" }}>Remaining team: {effectiveFilled}</p>
            </div>
          )}

          {/* Net impact */}
          <div className={`rounded-lg border p-4 ${props.kind === "position" ? "col-span-3" : "col-span-7"}`} style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "var(--foreground)" }}>
              <Zap className="w-3.5 h-3.5" style={{ color: "var(--warning)" }} /> Net Impact
            </p>
            {showSim ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tabular-nums" style={{ color: utilDelta > 0 ? "var(--destructive)" : utilDelta < 0 ? "var(--success)" : "var(--muted-foreground)" }}>
                    {utilDelta > 0 ? "+" : ""}{utilDelta.toFixed(1)}%
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>util change</span>
                </div>
                <p className="text-[11px] mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Baseline: {baseUtil.toFixed(1)}% &middot; New: {totalUtil.toFixed(1)}%
                </p>
                {totalUtil > 110 && (
                  <p className="text-[11px] mt-2 flex items-start gap-1" style={{ color: "var(--destructive)" }}>
                    <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    Resulting load is overloaded — consider redistribution.
                  </p>
                )}
              </>
            ) : (
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                Adjust controls to see live utilization impact.
              </p>
            )}
            <Link href="/workload-activity/utilization-dashboard" className="text-[11px] inline-flex items-center gap-1 mt-3 hover:underline" style={{ color: "var(--primary)" }}>
              Open Utilization Dashboard <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
