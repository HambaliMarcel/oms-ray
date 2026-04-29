import { formatRupiah } from "@/lib/currency";
import * as oms from "@/lib/oms-data";
import * as ai from "@/lib/ai-mock-data";

const legacyDepartments = oms.departments;
const legacyPositions = oms.positions;
const legacyScenarios = oms.scenarios;
const legacyProcesses = oms.processes;
const legacyProcessList = oms.processList;
const legacyActivityList = oms.activityList;
const legacyWorkloadByDepartment = oms.workloadByDepartment;

export const STANDARD_MONTHLY_CAPACITY = 160;
export const PRODUCTIVITY_FACTOR = 0.85;
export const EFFECTIVE_CAPACITY_PER_EMPLOYEE = STANDARD_MONTHLY_CAPACITY * PRODUCTIVITY_FACTOR; // 136

export type DepartmentBaseline = {
  id: string;
  name: string;
  employees: number;
  positions: number;
  vacancies: number;
  overstaffedAllocation: number;
  avgUtilizationPct: number;
  monthlyCost: number;
};

export const departmentBaseline: DepartmentBaseline[] = [
  { id: "D01", name: "Divisi Operasi Terminal", employees: 95, positions: 112, vacancies: 17, overstaffedAllocation: 0, avgUtilizationPct: 108, monthlyCost: 4_250_000_000 },
  { id: "D02", name: "Divisi Pelayanan Kapal", employees: 72, positions: 84, vacancies: 12, overstaffedAllocation: 0, avgUtilizationPct: 103, monthlyCost: 3_080_000_000 },
  { id: "D03", name: "Divisi Perencanaan Operasi", employees: 48, positions: 55, vacancies: 7, overstaffedAllocation: 0, avgUtilizationPct: 96, monthlyCost: 1_920_000_000 },
  { id: "D04", name: "Divisi Komersial & Customer Solutions", employees: 44, positions: 50, vacancies: 6, overstaffedAllocation: 0, avgUtilizationPct: 88, monthlyCost: 1_760_000_000 },
  { id: "D05", name: "Divisi Finance & Governance", employees: 58, positions: 64, vacancies: 6, overstaffedAllocation: 0, avgUtilizationPct: 91, monthlyCost: 2_640_000_000 },
  { id: "D06", name: "Divisi Procurement", employees: 36, positions: 43, vacancies: 7, overstaffedAllocation: 0, avgUtilizationPct: 113, monthlyCost: 1_440_000_000 },
  { id: "D07", name: "Divisi Legal & Compliance", employees: 28, positions: 31, vacancies: 3, overstaffedAllocation: 0, avgUtilizationPct: 68, monthlyCost: 1_260_000_000 },
  { id: "D08", name: "Divisi Human Capital Management", employees: 46, positions: 52, vacancies: 6, overstaffedAllocation: 0, avgUtilizationPct: 84, monthlyCost: 1_720_000_000 },
  { id: "D09", name: "Divisi Digital Transformation", employees: 38, positions: 47, vacancies: 9, overstaffedAllocation: 0, avgUtilizationPct: 97, monthlyCost: 2_180_000_000 },
  { id: "D10", name: "Divisi IT Infrastructure", employees: 41, positions: 46, vacancies: 5, overstaffedAllocation: 0, avgUtilizationPct: 89, monthlyCost: 1_720_000_000 },
  { id: "D11", name: "Divisi Risk Management & Internal Audit", employees: 29, positions: 34, vacancies: 5, overstaffedAllocation: 0, avgUtilizationPct: 82, monthlyCost: 1_170_000_000 },
  { id: "D12", name: "Divisi Strategy & Corporate Planning", employees: 33, positions: 24, vacancies: 0, overstaffedAllocation: 9, avgUtilizationPct: 78, monthlyCost: 1_660_000_000 },
];

export const baselineCompanyMetrics = {
  totalEmployees: 568,
  totalPositions: 642,
  filledPositions: 568,
  vacantPositions: 74,
  departments: 12,
  businessProcesses: 24,
  activities: 180,
  averageUtilizationPct: 91.6,
  totalMonthlyWorkforceCost: 24_800_000_000,
  totalAnnualWorkforceCost: 297_600_000_000,
  averageMonthlyCostPerEmployee: 41_300_000,
  activeScenarios: 12,
  aiInsights: 24,
  processKpiScore: 87.3,
} as const;

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

export const scenarioBaseline = [
  { id: "SCN-01", name: "Ekspansi Terminal Petikemas", addPositions: 38, monthlyCostDelta: 1_450_000_000, annualCostDelta: 17_400_000_000, utilizationFrom: 108, utilizationTo: 94, kpiImpact: 5.2 },
  { id: "SCN-02", name: "Automasi Procurement", addPositions: -12, monthlyCostDelta: -420_000_000, annualCostDelta: -5_040_000_000, utilizationFrom: 113, utilizationTo: 92, kpiImpact: 4.1 },
  { id: "SCN-03", name: "Restrukturisasi Legal & Compliance", addPositions: -6, monthlyCostDelta: -210_000_000, annualCostDelta: -2_520_000_000, utilizationFrom: 68, utilizationTo: 84, kpiImpact: 0.8 },
  { id: "SCN-04", name: "Digital Transformation Expansion", addPositions: 14, monthlyCostDelta: 820_000_000, annualCostDelta: 9_840_000_000, utilizationFrom: 97, utilizationTo: 89, kpiImpact: 6.7 },
] as const;

export function validateHeadcountConsistency() {
  const sum = departmentBaseline.reduce((acc, d) => acc + d.employees, 0);
  const ok = sum === baselineCompanyMetrics.totalEmployees;
  if (!ok) console.warn("[OM+ validation] headcount mismatch", { expected: baselineCompanyMetrics.totalEmployees, actual: sum });
  return ok;
}

export function validatePositionConsistency() {
  const total = departmentBaseline.reduce((acc, d) => acc + d.positions, 0);
  const vacancies = departmentBaseline.reduce((acc, d) => acc + d.vacancies, 0);
  const overstaffed = departmentBaseline.reduce((acc, d) => acc + d.overstaffedAllocation, 0);
  // Temporary assignments (overstaffed allocations) offset open vacancies at enterprise level.
  const effectiveVacancies = Math.max(vacancies - overstaffed, 0);
  const filled = total - effectiveVacancies;
  const ok =
    total === baselineCompanyMetrics.totalPositions &&
    filled === baselineCompanyMetrics.filledPositions &&
    effectiveVacancies === baselineCompanyMetrics.vacantPositions;
  if (!ok) console.warn("[OM+ validation] position mismatch", { total, filled, vacancies, overstaffed, effectiveVacancies });
  return ok;
}

export function validateUtilizationConsistency() {
  const weightedUtil =
    departmentBaseline.reduce((acc, d) => acc + d.avgUtilizationPct * d.employees, 0) /
    baselineCompanyMetrics.totalEmployees;
  const ok = Math.abs(weightedUtil - baselineCompanyMetrics.averageUtilizationPct) <= 0.5;
  if (!ok) console.warn("[OM+ validation] utilization mismatch", { expected: baselineCompanyMetrics.averageUtilizationPct, actual: weightedUtil });
  return ok;
}

export function validateFinancialConsistency() {
  const sum = departmentBaseline.reduce((acc, d) => acc + d.monthlyCost, 0);
  const ok = Math.abs(sum - baselineCompanyMetrics.totalMonthlyWorkforceCost) <= 500_000_000;
  if (!ok) console.warn("[OM+ validation] financial mismatch", { expected: baselineCompanyMetrics.totalMonthlyWorkforceCost, actual: sum });
  return ok;
}

export function validateDashboardConsistency() {
  return (
    validateHeadcountConsistency() &&
    validatePositionConsistency() &&
    validateUtilizationConsistency() &&
    validateFinancialConsistency()
  );
}

export const normalizedFinancialKpi = {
  totalWorkforceCost: `${formatRupiah(baselineCompanyMetrics.totalMonthlyWorkforceCost)} / bulan`,
  annualWorkforceCost: `${formatRupiah(baselineCompanyMetrics.totalAnnualWorkforceCost)} / tahun`,
  averageCostPerEmployee: `${formatRupiah(41_300_000)} / bulan`,
  averageCostPerPosition: `${formatRupiah(37_900_000)} / bulan`,
  highestCostDepartment: `Divisi Operasi Terminal — ${formatRupiah(4_250_000_000)} / bulan`,
  highestCostPerEmployee: `Digital Transformation — ${formatRupiah(57_300_000)} / bulan`,
  potentialCostOptimization: `${formatRupiah(1_900_000_000)} / bulan`,
};

export const unifiedScenarioData = scenarioBaseline.map((scenario) => ({
  ...scenario,
  monthlyWorkforceCostAfter: baselineCompanyMetrics.totalMonthlyWorkforceCost + scenario.monthlyCostDelta,
  annualWorkforceCostAfter: baselineCompanyMetrics.totalAnnualWorkforceCost + scenario.annualCostDelta,
}));

export const unifiedDepartmentMetrics = departmentBaseline.map((dept) => ({
  ...dept,
  effectiveCapacityHours: dept.employees * EFFECTIVE_CAPACITY_PER_EMPLOYEE,
  workloadHours: Math.round((dept.avgUtilizationPct / 100) * dept.employees * EFFECTIVE_CAPACITY_PER_EMPLOYEE),
  vacancyDisplay: Math.max(dept.positions - dept.employees, 0),
  overstaffedDisplay: Math.max(dept.employees - dept.positions, 0),
}));

export const unifiedProcessMetrics = legacyProcessList.slice(0, baselineCompanyMetrics.businessProcesses).map((process, idx) => {
  const dept = unifiedDepartmentMetrics[idx % unifiedDepartmentMetrics.length];
  const utilization = Math.max(60, Math.min(128, dept.avgUtilizationPct + ((idx % 5) - 2) * 3));
  const kpiScore = utilization > 115 ? 74 + (idx % 6) : utilization >= 90 && utilization <= 105 ? 86 + (idx % 8) : 72 + (idx % 14);
  return {
    ...process,
    department: dept.name,
    utilization,
    kpiScore: Math.max(60, Math.min(98, kpiScore)),
  };
});

export const unifiedWorkloadMetrics = legacyWorkloadByDepartment.map((w, idx) => {
  const dept = unifiedDepartmentMetrics[idx % unifiedDepartmentMetrics.length];
  return {
    ...w,
    department: dept.name,
    utilization: dept.avgUtilizationPct,
    totalWorkloadHours: dept.workloadHours,
    effectiveCapacityHours: dept.effectiveCapacityHours,
  };
});

export const unifiedAIMetrics = {
  totalInsights: baselineCompanyMetrics.aiInsights,
  linkedDepartments: unifiedDepartmentMetrics.length,
  scenarioBackedRecommendations: unifiedScenarioData.length,
};

export const unifiedDepartments = legacyDepartments.map((d) => ({ ...d }));
export const unifiedPositions = legacyPositions.map((p) => ({ ...p }));
export const globalPositions = unifiedPositions;
export const unifiedScenarios = legacyScenarios.map((s) => ({ ...s }));
export const unifiedProcesses = legacyProcesses.map((p) => ({ ...p }));
export const unifiedProcessList = legacyProcessList.map((p) => ({ ...p }));
export const unifiedActivityList = legacyActivityList.map((a) => ({ ...a }));
export const unifiedWorkloadByDepartment = legacyWorkloadByDepartment.map((w) => ({ ...w }));
export const unifiedWorkloadActivities = oms.workloadActivities.map((a) => ({ ...a }));
export const unifiedWorkloadByRole = oms.workloadByRole.map((r) => ({ ...r }));
export const unifiedWorkloadHeatmap = {
  cells: oms.workloadHeatmap.cells.map((c) => ({ ...c })),
  departments: [...oms.workloadHeatmap.departments],
  roles: [...oms.workloadHeatmap.roles],
};
export const unifiedEmployeesAll = oms.employeesAll.map((e) => ({ ...e }));
export const unifiedEmployees = oms.employees.map((e) => ({ ...e }));
export const unifiedKpiList = oms.kpiList.map((k) => ({ ...k }));
export const unifiedProcessChains = oms.processChains.map((c) => ({ ...c }));
export const unifiedProcessIOMapping = oms.processIOMapping.map((m) => ({ ...m }));
export const unifiedProcessDependencies = oms.processDependencies.map((d) => ({ ...d }));
export const unifiedProcessKPIMaps = oms.processKPIMaps.map((k) => ({ ...k }));
export const unifiedCostAnalysis = oms.costAnalysis.map((c) => ({ ...c }));
export const unifiedCostMonthlyTrend = oms.costMonthlyTrend.map((m) => ({ ...m }));
export const unifiedCriticalAlerts = oms.criticalAlerts.map((a) => ({ ...a }));
export const unifiedWORKLOAD_CONSTANTS = { ...oms.WORKLOAD_CONSTANTS };
export const unifiedFreqPerMonth = { ...oms._freqPerMonth };
export const unifiedComplexityMultipliers = { ...oms.COMPLEXITY_MULTIPLIERS };

export const unifiedAIDepartments = [...ai.aiDepartments];
export const unifiedAIScenarios = [...ai.aiScenarios];
export const unifiedAIInsights = [...ai.aiInsights];
export const unifiedAIGeneratedPositions = [...ai.aiGeneratedPositions];

export type AISeverity = ai.AISeverity;
export type AIModuleTag = ai.AIModuleTag;
export type AIInsight = ai.AIInsight;
export type AIGeneratedPosition = ai.AIGeneratedPosition;
export type WorkloadActivity = oms.WorkloadActivity;

export type OrgUnitType = "company" | "directorate" | "department";
export type OrganizationUnitNode = {
  id: string;
  name: string;
  type: OrgUnitType;
  parentId: string | null;
};

export const organizationUnits: OrganizationUnitNode[] = [
  { id: "COMP-PELINDO", name: "PT Pelabuhan Indonesia (Persero)", type: "company", parentId: null },
  { id: "DIR-OPS", name: "Direktorat Operasi", type: "directorate", parentId: "COMP-PELINDO" },
  { id: "DIR-COM", name: "Direktorat Komersial", type: "directorate", parentId: "COMP-PELINDO" },
  { id: "DIR-FINRISK", name: "Direktorat Keuangan & Manajemen Risiko", type: "directorate", parentId: "COMP-PELINDO" },
  { id: "DIR-HRGA", name: "Direktorat SDM & Umum", type: "directorate", parentId: "COMP-PELINDO" },
  { id: "DIR-DIGI", name: "Direktorat Transformasi Digital", type: "directorate", parentId: "COMP-PELINDO" },
  { id: "DIR-STRAT", name: "Direktorat Strategi & Pengembangan Usaha", type: "directorate", parentId: "COMP-PELINDO" },
  { id: "D01", name: "Divisi Operasi Terminal", type: "department", parentId: "DIR-OPS" },
  { id: "D02", name: "Divisi Pelayanan Kapal", type: "department", parentId: "DIR-OPS" },
  { id: "D03", name: "Divisi Perencanaan Operasi", type: "department", parentId: "DIR-OPS" },
  { id: "D04", name: "Divisi Komersial & Customer Solutions", type: "department", parentId: "DIR-COM" },
  { id: "D05", name: "Divisi Finance & Governance", type: "department", parentId: "DIR-FINRISK" },
  { id: "D06", name: "Divisi Procurement", type: "department", parentId: "DIR-FINRISK" },
  { id: "D07", name: "Divisi Legal & Compliance", type: "department", parentId: "DIR-FINRISK" },
  { id: "D08", name: "Divisi Human Capital Management", type: "department", parentId: "DIR-HRGA" },
  { id: "D09", name: "Divisi Digital Transformation", type: "department", parentId: "DIR-DIGI" },
  { id: "D10", name: "Divisi IT Infrastructure", type: "department", parentId: "DIR-DIGI" },
  { id: "D11", name: "Divisi Risk Management & Internal Audit", type: "department", parentId: "DIR-FINRISK" },
  { id: "D12", name: "Divisi Strategy & Corporate Planning", type: "department", parentId: "DIR-STRAT" },
];

const departmentBaselineMap = new Map(departmentBaseline.map((d) => [d.id, d]));

export function calculateDepartmentSummary(departmentId: string) {
  const baseline = departmentBaselineMap.get(departmentId);
  if (!baseline) {
    return {
      employees: 0,
      positions: 0,
      vacancies: 0,
      overstaffedAllocation: 0,
      monthlyCost: 0,
      utilization: 0,
    };
  }

  return {
    employees: baseline.employees,
    positions: baseline.positions,
    vacancies: Math.max(baseline.positions - baseline.employees, 0),
    overstaffedAllocation: Math.max(baseline.employees - baseline.positions, 0),
    monthlyCost: baseline.monthlyCost,
    utilization: baseline.avgUtilizationPct,
  };
}

export function calculateDirectorateSummary(directorateId: string) {
  const deptIds = organizationUnits.filter((u) => u.parentId === directorateId && u.type === "department").map((d) => d.id);
  const rolled = deptIds.map(calculateDepartmentSummary);
  const employees = rolled.reduce((s, d) => s + d.employees, 0);
  const positions = rolled.reduce((s, d) => s + d.positions, 0);
  const vacancies = rolled.reduce((s, d) => s + d.vacancies, 0);
  const overstaffedAllocation = rolled.reduce((s, d) => s + d.overstaffedAllocation, 0);
  const monthlyCost = rolled.reduce((s, d) => s + d.monthlyCost, 0);
  const utilization = employees > 0 ? Number((rolled.reduce((s, d) => s + d.utilization * d.employees, 0) / employees).toFixed(1)) : 0;
  return { employees, positions, vacancies, overstaffedAllocation, monthlyCost, utilization };
}

export function calculateCompanySummary() {
  return {
    employees: baselineCompanyMetrics.totalEmployees,
    positions: baselineCompanyMetrics.totalPositions,
    vacancies: baselineCompanyMetrics.vacantPositions,
    monthlyCost: baselineCompanyMetrics.totalMonthlyWorkforceCost,
    utilization: baselineCompanyMetrics.averageUtilizationPct,
  };
}

export function validateOrgTreeData() {
  const deptNodes = organizationUnits.filter((u) => u.type === "department");
  const hasInvalidDept = deptNodes.some((d) => !organizationUnits.find((p) => p.id === d.parentId && p.type === "directorate"));
  const posInvalid = unifiedPositions.some((p) => !deptNodes.find((d) => d.id === p.deptId));
  const employeeInvalid = unifiedEmployeesAll.some((e) => e.deptId !== "D00" && !deptNodes.find((d) => d.id === e.deptId));
  const company = calculateCompanySummary();
  const totalsOk = company.employees === baselineCompanyMetrics.totalEmployees && company.positions === baselineCompanyMetrics.totalPositions && company.vacancies === baselineCompanyMetrics.vacantPositions;

  if (hasInvalidDept) console.warn("[OM+ org-tree] invalid department->directorate mapping");
  if (posInvalid) console.warn("[OM+ org-tree] some positions have invalid department");
  if (employeeInvalid) console.warn("[OM+ org-tree] some employees have invalid department");
  if (!totalsOk) console.warn("[OM+ org-tree] company totals mismatch", company);

  return !hasInvalidDept && !posInvalid && !employeeInvalid && totalsOk;
}

export function buildOrganizationTree(
  units: OrganizationUnitNode[],
  pos: typeof unifiedPositions,
  emp: typeof unifiedEmployeesAll,
) {
  const company = units.find((u) => u.type === "company");
  const directorates = units.filter((u) => u.type === "directorate");
  const departmentsByDir = new Map<string, OrganizationUnitNode[]>();
  directorates.forEach((dir) => {
    departmentsByDir.set(dir.id, units.filter((u) => u.parentId === dir.id && u.type === "department"));
  });

  const employeePool = emp.filter((e) => e.status === "Active");
  let employeeCursor = 0;

  const makeEmployees = (count: number, positionId: string, departmentId: string, positionTitle: string) => {
    const rows: Array<typeof employeePool[number] & { positionId: string; employmentType: string; allocationPercentage: number; monthlyRemuneration: number }> = [];
    for (let i = 0; i < count; i++) {
      const src = employeePool[employeeCursor % employeePool.length];
      employeeCursor++;
      rows.push({
        ...src,
        id: `${src.id}-${positionId}-${i + 1}`,
        position: positionTitle,
        deptId: departmentId,
        positionId,
        employmentType: i % 5 === 0 ? "Kontrak" : "Tetap",
        allocationPercentage: 100,
        monthlyRemuneration: normalizeCurrency((src as any).totalMonthlyCost ?? src.cost),
      });
    }
    return rows;
  };

  const companyTree = {
    company,
    directorates: directorates.map((dir) => {
      const departments = (departmentsByDir.get(dir.id) ?? []).map((dept) => {
        const summary = calculateDepartmentSummary(dept.id);
        const sourcePositions = pos.filter((p) => p.deptId === dept.id);
        const sourceWithFallback = sourcePositions.length > 0 ? sourcePositions : [pos.find((p) => p.deptId === dept.id) ?? pos[0]];
        const generated = sourceWithFallback.map((src, idx) => {
          const planned = Math.max((src as any).planned ?? 1, 1);
          const filled = Math.max((src as any).filled ?? 0, 0);
          const plannedMonthlyCost = normalizeCurrency((src as any).plannedMonthlyCost ?? (src as any).salaryMin ?? 25_000_000);
          const positionEmployees = makeEmployees(filled, src.id, dept.id, src.title);
          const actualMonthlyCost = positionEmployees.reduce((s, e) => s + e.monthlyRemuneration, 0);
          const utilization = Math.max(55, Math.min(140, summary.utilization + (idx % 4) * 3 - 4));
          return {
            id: src.id,
            title: src.title,
            grade: src.grade ?? "G6",
            departmentId: dept.id,
            reportsToPositionId: null as string | null,
            headcountRequired: planned,
            headcountActual: filled,
            vacancyCount: Math.max(planned - filled, 0),
            plannedMonthlyCost,
            actualMonthlyCost,
            utilization,
            status: (filled <= 0 ? "Vacant" : filled < planned ? "Partial" : utilization > 110 ? "Overloaded" : "Filled") as
              | "Filled"
              | "Vacant"
              | "Partial"
              | "Overloaded",
            employees: positionEmployees,
          };
        });
        if (generated.length > 1) {
          const parentId = generated[0].id;
          for (let i = 1; i < generated.length; i++) {
            generated[i].reportsToPositionId = parentId;
          }
        }

        const departmentRollup = {
          employees: generated.reduce((s, g) => s + g.headcountActual, 0),
          positions: generated.reduce((s, g) => s + g.headcountRequired, 0),
          vacancies: generated.reduce((s, g) => s + g.vacancyCount, 0),
          overstaffedAllocation: Math.max(generated.reduce((s, g) => s + g.headcountActual, 0) - generated.reduce((s, g) => s + g.headcountRequired, 0), 0),
          monthlyCost:
            generated.reduce((s, g) => s + g.actualMonthlyCost, 0) +
            generated.reduce((s, g) => s + g.plannedMonthlyCost * g.vacancyCount, 0),
          utilization:
            generated.reduce((s, g) => s + g.utilization * g.headcountRequired, 0) /
            Math.max(1, generated.reduce((s, g) => s + g.headcountRequired, 0)),
        };

        return { ...dept, summary: departmentRollup, positions: generated };
      });
      const dirSummary = {
        employees: departments.reduce((s, d) => s + d.summary.employees, 0),
        positions: departments.reduce((s, d) => s + d.summary.positions, 0),
        vacancies: departments.reduce((s, d) => s + d.summary.vacancies, 0),
        overstaffedAllocation: departments.reduce((s, d) => s + d.summary.overstaffedAllocation, 0),
        monthlyCost: departments.reduce((s, d) => s + d.summary.monthlyCost, 0),
        utilization:
          departments.reduce((s, d) => s + d.summary.utilization * d.summary.employees, 0) /
          Math.max(1, departments.reduce((s, d) => s + d.summary.employees, 0)),
      };
      return { ...dir, summary: dirSummary, departments };
    }),
    summary: {
      employees: baselineCompanyMetrics.totalEmployees,
      positions: baselineCompanyMetrics.totalPositions,
      vacancies: baselineCompanyMetrics.vacantPositions,
      monthlyCost: baselineCompanyMetrics.totalMonthlyWorkforceCost,
      utilization: baselineCompanyMetrics.averageUtilizationPct,
    },
  };

  return companyTree;
}

function normalizeCurrency(v: number) {
  return v < 1_000_000 ? v * 1000 : v;
}
