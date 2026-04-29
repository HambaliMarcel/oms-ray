"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Maximize2, Minimize2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildOrganizationTree, formatPercent, organizationUnits, unifiedEmployeesAll, unifiedPositions } from "@/lib/om-metrics";
import { formatRupiah } from "@/lib/currency";

type OverlayMode = "none" | "cost" | "utilization";

function utilClass(u: number) {
  if (u > 110) return "text-red-600";
  if (u >= 90) return "text-emerald-600";
  return "text-amber-600";
}

function overlayClass(overlay: OverlayMode, util = 0) {
  if (overlay === "cost") return "ring-1 ring-[#BFDBFE]";
  if (overlay === "utilization") {
    if (util > 110) return "ring-1 ring-[#FECACA]";
    if (util >= 90) return "ring-1 ring-[#BBF7D0]";
    return "ring-1 ring-[#FDE68A]";
  }
  return "";
}

function nodeTone(subtitle: string) {
  if (subtitle === "Company") {
    return {
      header: "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white",
      chip: "bg-[#DBEAFE] text-[#1E3A8A]",
    };
  }
  if (subtitle === "Directorate") {
    return {
      header: "bg-[#EFF6FF] text-[#1D4ED8]",
      chip: "bg-[#E0E7FF] text-[#3730A3]",
    };
  }
  if (subtitle === "Department") {
    return {
      header: "bg-[#F1F5F9] text-[#0F172A]",
      chip: "bg-[#F8FAFC] text-[#334155]",
    };
  }
  return {
    header: "bg-[#F8FAFC] text-[#0F172A]",
    chip: "bg-[#F1F5F9] text-[#334155]",
  };
}

function Node({
  title,
  subtitle,
  lines,
  large,
  overlay,
  util,
  expanded,
  onToggle,
  link,
}: {
  title: string;
  subtitle: string;
  lines: string[];
  large?: boolean;
  overlay: OverlayMode;
  util?: number;
  expanded?: boolean;
  onToggle?: () => void;
  link?: React.ReactNode;
}) {
  const tone = nodeTone(subtitle);
  return (
    <div className={`rounded-2xl bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)] ${overlayClass(overlay, util)}`}>
      <div className={`flex items-start justify-between gap-2 rounded-xl px-3 py-2 ${tone.header}`}>
        <button type="button" onClick={onToggle} className="flex items-start gap-2 text-left">
          {onToggle ? expanded ? <ChevronDown className="mt-0.5 h-4 w-4 opacity-70" /> : <ChevronRight className="mt-0.5 h-4 w-4 opacity-70" /> : null}
          <div>
            <p className={large ? "text-base font-bold" : "text-sm font-semibold"}>{title}</p>
            <p className="text-[11px] opacity-75">{subtitle}</p>
          </div>
        </button>
        {link}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
        {lines.map((line) => (
          <div key={line} className={`rounded-lg px-2 py-1.5 ${tone.chip}`}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrgTreePage() {
  const tree = useMemo(() => buildOrganizationTree(organizationUnits, unifiedPositions, unifiedEmployeesAll), []);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["COMP-PELINDO", ...tree.directorates.map((d) => d.id)]));
  const [search, setSearch] = useState("");
  const [overlay, setOverlay] = useState<OverlayMode>("none");

  const q = search.trim().toLowerCase();
  const toggle = (id: string) => setExpanded((p) => new Set(p.has(id) ? [...p].filter((x) => x !== id) : [...p, id]));

  const expandAll = () => {
    const ids = new Set<string>(["COMP-PELINDO"]);
    tree.directorates.forEach((d) => {
      ids.add(d.id);
      d.departments.forEach((dept) => {
        ids.add(dept.id);
        dept.positions.forEach((p) => ids.add(`POS-${p.id}`));
      });
    });
    setExpanded(ids);
  };
  const collapseAll = () => setExpanded(new Set(["COMP-PELINDO"]));

  const shownDirectorates = tree.directorates.filter((dir) => {
    if (!q) return true;
    return (
      dir.name.toLowerCase().includes(q) ||
      dir.departments.some((d) => d.name.toLowerCase().includes(q)) ||
      dir.departments.some((d) => d.positions.some((p) => p.title.toLowerCase().includes(q))) ||
      dir.departments.some((d) => d.positions.some((p) => p.employees.some((e) => e.name.toLowerCase().includes(q))))
    );
  });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.07)]">
        <h1 className="text-2xl font-bold text-[#0F172A]">Organization Tree Chart</h1>
        <p className="text-xs text-[#64748B]">PT Pelabuhan Indonesia (Persero) · Company Hierarchy View</p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.07)]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 md:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search in tree..." />
          </div>
          <select className="h-8 rounded-xl border-0 bg-[#F8FAFC] px-2.5 text-xs shadow-[inset_0_0_0_1px_rgba(148,163,184,0.22)]" value={overlay} onChange={(e) => setOverlay(e.target.value as OverlayMode)}>
            <option value="none">Default View</option>
            <option value="cost">Cost Overlay</option>
            <option value="utilization">Utilization Overlay</option>
          </select>
          <Button size="sm" variant="outline" onClick={expandAll}><Maximize2 className="mr-1.5 h-3.5 w-3.5" />Expand All</Button>
          <Button size="sm" variant="outline" onClick={collapseAll}><Minimize2 className="mr-1.5 h-3.5 w-3.5" />Collapse All</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] p-6 shadow-[0_10px_26px_rgba(15,23,42,0.07)]">
        <div className="mx-auto min-w-[1280px] space-y-6">
          <div className="flex justify-center">
            <div className="w-[520px]">
              <Node
                title="PT Pelabuhan Indonesia (Persero)"
                subtitle="Company"
                large
                overlay={overlay}
                util={tree.summary.utilization}
                expanded={expanded.has("COMP-PELINDO")}
                onToggle={() => toggle("COMP-PELINDO")}
                lines={[
                  `Employees ${tree.summary.employees}`,
                  `Positions ${tree.summary.positions}`,
                  `Vacancies ${tree.summary.vacancies}`,
                  `${formatRupiah(tree.summary.monthlyCost)} / bulan`,
                  `Util ${formatPercent(tree.summary.utilization)}`,
                ]}
              />
            </div>
          </div>

          {expanded.has("COMP-PELINDO") && (
            <>
              <div className="mx-auto h-6 w-px bg-[#93C5FD]" />
              <div className="mx-auto h-px w-[85%] bg-[#BFDBFE]" />

              <div className="grid grid-cols-3 gap-4">
                {shownDirectorates.map((dir) => (
                  <div key={dir.id} className="space-y-3">
                    <div className="mx-auto h-4 w-px bg-[#BFDBFE]" />
                    <Node
                      title={dir.name}
                      subtitle="Directorate"
                      overlay={overlay}
                      util={dir.summary.utilization}
                      expanded={expanded.has(dir.id)}
                      onToggle={() => toggle(dir.id)}
                      lines={[
                        `Emp ${dir.summary.employees}`,
                        `Pos ${dir.summary.positions}`,
                        `Vac ${dir.summary.vacancies}`,
                        `${formatRupiah(dir.summary.monthlyCost)} / bulan`,
                      ]}
                    />

                    {expanded.has(dir.id) && (
                      <>
                        <div className="mx-auto h-4 w-px bg-[#BFDBFE]" />
                        <div className="space-y-3">
                          {dir.departments.map((dept) => (
                            <div key={dept.id} className="space-y-2">
                              <Node
                                title={dept.name}
                                subtitle="Department"
                                overlay={overlay}
                                util={dept.summary.utilization}
                                expanded={expanded.has(dept.id)}
                                onToggle={() => toggle(dept.id)}
                                lines={[
                                  `Emp ${dept.summary.employees}`,
                                  `Pos ${dept.summary.positions}`,
                                  dept.summary.overstaffedAllocation > 0 ? `Overstaffed ${dept.summary.overstaffedAllocation}` : `Vac ${dept.summary.vacancies}`,
                                  `${formatPercent(dept.summary.utilization)}`,
                                  `${formatRupiah(dept.summary.monthlyCost)} / bulan`,
                                ]}
                              />

                              {expanded.has(dept.id) && (
                                <div className="ml-5 space-y-2 border-l border-[#BFDBFE] pl-3">
                                  {dept.positions.slice(0, 6).map((p) => (
                                    <div key={p.id} className="space-y-1.5">
                                      <Node
                                        title={p.title}
                                        subtitle={`Position · ${p.grade}`}
                                        overlay={overlay}
                                        util={p.utilization}
                                        expanded={expanded.has(`POS-${p.id}`)}
                                        onToggle={() => toggle(`POS-${p.id}`)}
                                        link={<Link href={`/organization/positions/${p.id}`} className="text-xs text-[#2563EB] hover:underline">Open</Link>}
                                        lines={[
                                          `${p.headcountActual}/${p.headcountRequired} HC`,
                                          `Vac ${p.vacancyCount}`,
                                          `${formatPercent(p.utilization)}`,
                                          `${formatRupiah(p.actualMonthlyCost)} / bulan`,
                                        ]}
                                      />

                                      {expanded.has(`POS-${p.id}`) && (
                                        <div className="ml-5 space-y-1.5 border-l border-[#DBEAFE] pl-3">
                                          {p.employees.slice(0, 4).map((e) => (
                                            <div key={e.id} className="rounded-xl bg-white p-3 shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(15,23,42,0.1)]">
                                              <div className="flex items-center justify-between gap-2">
                                                <div>
                                                  <Link href={`/organization/employees/${e.id}`} className="text-sm font-semibold hover:underline">{e.name}</Link>
                                                  <p className="text-[11px] text-[#64748B]">{e.position}</p>
                                                </div>
                                                <div className="text-right text-xs">
                                                  <p className={`font-semibold ${utilClass(e.utilization)}`}>{e.utilization}%</p>
                                                  <p className="text-[#64748B]">{formatRupiah((e as any).monthlyRemuneration ?? (e as any).totalMonthlyCost ?? e.cost)}</p>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
