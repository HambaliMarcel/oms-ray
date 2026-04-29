/* eslint-disable max-lines */
export type OrganizationUnit = {
  id: string
  name: string
  type: 'directorate' | 'division' | 'department'
  parentId?: string
  headPositionId: string
  location: string
}

export type Position = {
  id: string
  namaJabatan: string
  jobGrade: number
  unitId: string
  reportsTo?: string
  subordinateIds: string[]
  headcountRequired: number
  headcountActual: number
  status: 'filled' | 'vacant' | 'partial'
  plannedCostMonthly: number
  plannedBaseSalary: number
  plannedAllowance: number
  plannedBenefits: number
  plannedBonusMonthlyEquivalent: number
  plannedMonthlyCost: number
  plannedAnnualCost: number
}

export type Employee = {
  id: string
  nama: string
  nik: string
  positionId: string
  unitId: string
  employmentType: 'tetap' | 'kontrak'
  masaKerjaTahun: number
  baseSalary: number
  fixedAllowance: number
  transportAllowance: number
  mealAllowance: number
  housingAllowance: number
  insuranceBenefit: number
  pensionBenefit: number
  bonusMonthlyEquivalent: number
  overtimeCost: number
  totalMonthlyCost: number
  totalAnnualCost: number
  performanceScore: number
  utilization: number
}

export type BusinessProcess = {
  id: string
  name: string
  ownerPositionId: string
  departmentId: string
  kpiName: string
  kpiTarget: number
  kpiActual: number
}

export type Activity = {
  id: string
  name: string
  processId: string
  positionId: string
  employeeIds: string[]
  frequencyPerMonth: number
  durationHours: number
  complexity: number
  reworkRate: number
  workloadHours: number
  requiredHC: number
  assignedHC: number
  utilization: number
}

export type Scenario = {
  id: string
  name: string
  type: string
  headcountDelta: number
  costDelta: number
  workloadDelta: number
  kpiImpact: number
}

export type AIInsight = {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  departmentId: string
  relatedPositionIds: string[]
  relatedProcessIds: string[]
  relatedActivityIds: string[]
  summary: string
  recommendation: string
  impact: {
    workloadChange: number
    costChange: number
    kpiChange: number
  }
}

export type AIGeneratedPosition = {
  id: string
  namaJabatan: string
  unitId: string
  reportsTo: string
  processes: string[]
  activities: string[]
  requiredHC: number
  workloadHours: number
  costMonthly: number
  impactSummary: string
}

const directorateBlueprint = [
  {
    name: 'Direktorat Operasi',
    location: 'Jakarta',
    divisions: [
      { name: 'Divisi Operasi Terminal', departments: ['Departemen Perencanaan Operasi Terminal', 'Departemen Pengendalian Lapangan Terminal'] },
      { name: 'Divisi Marine & Vessel', departments: ['Departemen Penjadwalan Kapal', 'Departemen Pelayanan Marine'] },
      { name: 'Divisi Asset Operations', departments: ['Departemen Pemeliharaan Peralatan', 'Departemen Reliability Operasi'] },
    ],
  },
  {
    name: 'Direktorat Komersial',
    location: 'Jakarta',
    divisions: [
      { name: 'Divisi Sales & Account', departments: ['Departemen Pengelolaan Key Account', 'Departemen Akuisisi Pelanggan'] },
      { name: 'Divisi Customer Solutions', departments: ['Departemen Desain Layanan Pelanggan', 'Departemen Billing & Revenue Assurance'] },
      { name: 'Divisi Port Business Development', departments: ['Departemen Pengembangan Jasa Pelabuhan', 'Departemen Kemitraan Komersial'] },
    ],
  },
  {
    name: 'Direktorat Keuangan & Risiko',
    location: 'Jakarta',
    divisions: [
      { name: 'Divisi Keuangan Korporat', departments: ['Departemen Perencanaan Keuangan', 'Departemen Cost Control'] },
      { name: 'Divisi Treasury & Investasi', departments: ['Departemen Treasury', 'Departemen Pengendalian Investasi'] },
      { name: 'Divisi Risiko & Kepatuhan', departments: ['Departemen Manajemen Risiko', 'Departemen Legal & Kepatuhan Korporat'] },
    ],
  },
  {
    name: 'Direktorat SDM & Umum',
    location: 'Jakarta',
    divisions: [
      { name: 'Divisi Human Capital Strategy', departments: ['Departemen Perencanaan SDM', 'Departemen Organisasi & Talent'] },
      { name: 'Divisi HC Operations', departments: ['Departemen Rekrutmen & Employer Branding', 'Departemen Payroll & People Services'] },
      { name: 'Divisi General Affairs', departments: ['Departemen Fasilitas & Aset Umum', 'Departemen Layanan Korporat'] },
    ],
  },
  {
    name: 'Direktorat Transformasi Digital',
    location: 'Jakarta',
    divisions: [
      { name: 'Divisi Digital Product', departments: ['Departemen Digital Product Management', 'Departemen User Experience & Adoption'] },
      { name: 'Divisi IT Infrastructure', departments: ['Departemen Infrastruktur TI', 'Departemen IT Service Management'] },
      { name: 'Divisi Data & Automation', departments: ['Departemen Data Engineering', 'Departemen Process Automation'] },
    ],
  },
  {
    name: 'Direktorat Strategi',
    location: 'Jakarta',
    divisions: [
      { name: 'Divisi Corporate Planning', departments: ['Departemen Perencanaan Korporat', 'Departemen PMO Strategis'] },
      { name: 'Divisi Strategic Portfolio', departments: ['Departemen Tata Kelola Portofolio', 'Departemen Monitoring Inisiatif Strategis'] },
      { name: 'Divisi Performance Excellence', departments: ['Departemen Enterprise KPI', 'Departemen Continuous Improvement'] },
    ],
  },
] as const

const organizationUnits: OrganizationUnit[] = []
const departmentIds: string[] = []

let dirCounter = 1
let divCounter = 1
let depCounter = 1

for (const d of directorateBlueprint) {
  const dirId = `DIR-${String(dirCounter++).padStart(2, '0')}`
  organizationUnits.push({
    id: dirId,
    name: d.name,
    type: 'directorate',
    location: d.location,
    headPositionId: `POS-H-${dirId}`,
  })

  for (const div of d.divisions) {
    const divId = `DIV-${String(divCounter++).padStart(2, '0')}`
    organizationUnits.push({
      id: divId,
      name: div.name,
      type: 'division',
      parentId: dirId,
      location: d.location,
      headPositionId: `POS-H-${divId}`,
    })
    for (const depName of div.departments) {
      const depId = `DEP-${String(depCounter++).padStart(2, '0')}`
      departmentIds.push(depId)
      organizationUnits.push({
        id: depId,
        name: depName,
        type: 'department',
        parentId: divId,
        location: d.location,
        headPositionId: `POS-H-${depId}`,
      })
    }
  }
}

const positionTemplates = {
  directorate: ['VP', 'Senior Manager', 'Sekretaris Direktorat', 'Analis Strategis Direktorat'],
  division: ['Manager', 'Senior Officer', 'Officer'],
  department: ['Supervisor', 'Staff'],
} as const

const roleKeywords = [
  'Operasi Terminal',
  'Vessel Scheduling',
  'Cost Control',
  'Procurement',
  'HR Services',
  'Digital Delivery',
  'Legal Compliance',
  'Risk Monitoring',
  'Strategic Planning',
  'Asset Maintenance',
]

function seededNumber(seed: string, min: number, max: number) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return min + (hash % (max - min + 1))
}

function plannedCostByTitle(title: string) {
  if (title.includes('VP')) return 92000000
  if (title.includes('Senior Manager')) return 62000000
  if (title.includes('Manager')) return 42000000
  if (title.includes('Supervisor')) return 26000000
  if (title.includes('Senior Officer')) return 21000000
  if (title.includes('Officer')) return 17000000
  return 12000000
}

function plannedCompByTitle(title: string) {
  if (title.includes('VP')) return { base: 98000000, allowance: 32000000, benefits: 22000000, bonus: 18000000 }
  if (title.includes('Senior Manager')) return { base: 62000000, allowance: 21000000, benefits: 15000000, bonus: 12000000 }
  if (title.includes('Manager')) return { base: 43000000, allowance: 14000000, benefits: 10000000, bonus: 7000000 }
  if (title.includes('Supervisor')) return { base: 26000000, allowance: 9000000, benefits: 7000000, bonus: 5000000 }
  if (title.includes('Senior Officer')) return { base: 19000000, allowance: 6500000, benefits: 5000000, bonus: 3500000 }
  if (title.includes('Officer')) return { base: 13000000, allowance: 4500000, benefits: 3500000, bonus: 2200000 }
  return { base: 11000000, allowance: 3500000, benefits: 2800000, bonus: 1800000 }
}

function requiredHcByTitle(title: string, seed: string) {
  if (title.includes('VP')) return 1
  if (title.includes('Senior Manager')) return seededNumber(seed, 1, 2)
  if (title.includes('Manager')) return seededNumber(seed, 2, 4)
  if (title.includes('Supervisor')) return seededNumber(seed, 3, 6)
  if (title.includes('Senior Officer')) return seededNumber(seed, 2, 4)
  if (title.includes('Officer')) return seededNumber(seed, 3, 6)
  return seededNumber(seed, 4, 8)
}

function actualHc(required: number, seed: string) {
  const delta = seededNumber(seed, -2, 1)
  return Math.max(0, required + delta)
}

const positions: Position[] = []
const unitHeadPositionMap = new Map<string, string>()

const directorates = organizationUnits.filter((u) => u.type === 'directorate')
const divisions = organizationUnits.filter((u) => u.type === 'division')
const departments = organizationUnits.filter((u) => u.type === 'department')

for (const unit of directorates) {
  const baseKeyword = roleKeywords[seededNumber(unit.id, 0, roleKeywords.length - 1)]
  let vpId = ''
  for (const [idx, tmpl] of positionTemplates.directorate.entries()) {
    const id = idx === 0 ? unit.headPositionId : `POS-${unit.id}-${idx + 1}`
    const namaJabatan = `${tmpl} ${baseKeyword}`
    const required = requiredHcByTitle(namaJabatan, id)
    const actual = actualHc(required, id)
    const reportsTo = idx === 0 ? undefined : vpId
    const status: Position['status'] = actual === 0 ? 'vacant' : actual < required ? 'partial' : 'filled'
    const planned = plannedCompByTitle(namaJabatan)
    positions.push({
      id,
      namaJabatan,
      jobGrade: idx === 0 ? 17 : idx === 1 ? 16 : 14,
      unitId: unit.id,
      reportsTo,
      subordinateIds: [],
      headcountRequired: required,
      headcountActual: actual,
      status,
      plannedCostMonthly: plannedCostByTitle(namaJabatan),
      plannedBaseSalary: planned.base,
      plannedAllowance: planned.allowance,
      plannedBenefits: planned.benefits,
      plannedBonusMonthlyEquivalent: planned.bonus,
      plannedMonthlyCost: planned.base + planned.allowance + planned.benefits + planned.bonus,
      plannedAnnualCost: (planned.base + planned.allowance + planned.benefits + planned.bonus) * 12,
    })
    if (idx === 0) {
      vpId = id
      unitHeadPositionMap.set(unit.id, id)
    }
  }
}

for (const unit of divisions) {
  const parentHead = unitHeadPositionMap.get(unit.parentId || '') || positions[0].id
  const baseKeyword = roleKeywords[seededNumber(unit.id, 0, roleKeywords.length - 1)]
  let managerId = ''
  for (const [idx, tmpl] of positionTemplates.division.entries()) {
    const id = idx === 0 ? unit.headPositionId : `POS-${unit.id}-${idx + 1}`
    const namaJabatan = `${tmpl} ${baseKeyword}`
    const required = requiredHcByTitle(namaJabatan, id)
    const actual = actualHc(required, id)
    const reportsTo = idx === 0 ? parentHead : managerId
    const status: Position['status'] = actual === 0 ? 'vacant' : actual < required ? 'partial' : 'filled'
    const planned = plannedCompByTitle(namaJabatan)
    positions.push({
      id,
      namaJabatan,
      jobGrade: idx === 0 ? 15 : idx === 1 ? 13 : 12,
      unitId: unit.id,
      reportsTo,
      subordinateIds: [],
      headcountRequired: required,
      headcountActual: actual,
      status,
      plannedCostMonthly: plannedCostByTitle(namaJabatan),
      plannedBaseSalary: planned.base,
      plannedAllowance: planned.allowance,
      plannedBenefits: planned.benefits,
      plannedBonusMonthlyEquivalent: planned.bonus,
      plannedMonthlyCost: planned.base + planned.allowance + planned.benefits + planned.bonus,
      plannedAnnualCost: (planned.base + planned.allowance + planned.benefits + planned.bonus) * 12,
    })
    if (idx === 0) {
      managerId = id
      unitHeadPositionMap.set(unit.id, id)
    }
  }
}

for (const unit of departments) {
  const parentHead = unitHeadPositionMap.get(unit.parentId || '') || positions[0].id
  const keyword = roleKeywords[seededNumber(unit.id, 0, roleKeywords.length - 1)]
  for (const [idx, tmpl] of positionTemplates.department.entries()) {
    const id = idx === 0 ? unit.headPositionId : `POS-${unit.id}-${idx + 1}`
    const namaJabatan = `${tmpl} ${keyword}`
    const required = requiredHcByTitle(namaJabatan, id)
    const actual = actualHc(required, id)
    const reportsTo = idx === 0 ? parentHead : unit.headPositionId
    const status: Position['status'] = actual === 0 ? 'vacant' : actual < required ? 'partial' : 'filled'
    const planned = plannedCompByTitle(namaJabatan)
    positions.push({
      id,
      namaJabatan,
      jobGrade: idx === 0 ? 11 : 9,
      unitId: unit.id,
      reportsTo,
      subordinateIds: [],
      headcountRequired: required,
      headcountActual: actual,
      status,
      plannedCostMonthly: plannedCostByTitle(namaJabatan),
      plannedBaseSalary: planned.base,
      plannedAllowance: planned.allowance,
      plannedBenefits: planned.benefits,
      plannedBonusMonthlyEquivalent: planned.bonus,
      plannedMonthlyCost: planned.base + planned.allowance + planned.benefits + planned.bonus,
      plannedAnnualCost: (planned.base + planned.allowance + planned.benefits + planned.bonus) * 12,
    })
  }
  unitHeadPositionMap.set(unit.id, unit.headPositionId)
}

const byId = new Map(positions.map((p) => [p.id, p]))
for (const p of positions) {
  if (!p.reportsTo) continue
  const parent = byId.get(p.reportsTo)
  if (parent) parent.subordinateIds.push(p.id)
}

const firstNames = [
  'Budi', 'Citra', 'Andi', 'Siti', 'Bambang', 'Raka', 'Arya', 'Dewi', 'Dimas', 'Nabila',
  'Fajar', 'Maya', 'Rizky', 'Aulia', 'Yusuf', 'Putri', 'Galang', 'Nur', 'Wahyu', 'Adit',
  'Tegar', 'Laras', 'Intan', 'Reno', 'Adinda', 'Farhan', 'Rini', 'Naufal', 'Mega', 'Rafi',
]
const lastNames = [
  'Santoso', 'Wijaya', 'Pratama', 'Lestari', 'Rahmawati', 'Hidayat', 'Purnama', 'Saputra', 'Kusuma', 'Mahendra',
  'Nugroho', 'Suryani', 'Anindita', 'Wibowo', 'Herlambang', 'Saraswati', 'Putra', 'Siregar', 'Kurniawan', 'Halim',
]

function salaryForTitle(title: string, seed: string) {
  if (title.includes('VP')) return seededNumber(seed, 50000000, 120000000)
  if (title.includes('Manager') || title.includes('Senior Manager')) return seededNumber(seed, 25000000, 45000000)
  if (title.includes('Supervisor')) return seededNumber(seed, 15000000, 25000000)
  return seededNumber(seed, 8000000, 15000000)
}

const employees: Employee[] = []
let employeeCounter = 1

for (const position of positions) {
  for (let i = 0; i < position.headcountActual; i += 1) {
    const seed = `${position.id}-${i}`
    const baseSalary = salaryForTitle(position.namaJabatan, seed)
    const fixedAllowance = Math.round(baseSalary * (seededNumber(seed, 10, 18) / 100))
    const transportAllowance = seededNumber(seed, 900000, 2200000)
    const mealAllowance = seededNumber(seed, 700000, 1800000)
    const housingAllowance = seededNumber(seed, 1200000, 4200000)
    const insuranceBenefit = seededNumber(seed, 1300000, 3600000)
    const pensionBenefit = seededNumber(seed, 1100000, 3000000)
    const bonusMonthlyEquivalent = Math.round(baseSalary * (seededNumber(seed, 5, 15) / 100))
    const overtimeCost = seededNumber(seed, 250000, 2200000)
    const totalMonthlyCost =
      baseSalary +
      fixedAllowance +
      transportAllowance +
      mealAllowance +
      housingAllowance +
      insuranceBenefit +
      pensionBenefit +
      bonusMonthlyEquivalent +
      overtimeCost
    const name = `${firstNames[seededNumber(seed, 0, firstNames.length - 1)]} ${lastNames[seededNumber(`${seed}-ln`, 0, lastNames.length - 1)]}`
    const nik = `3174${String(202000000 + employeeCounter).slice(-9)}`
    let utilization = seededNumber(seed, 76, 102)
    const unitName = organizationUnits.find((u) => u.id === position.unitId)?.name.toLowerCase() || ''
    if (unitName.includes('operasi') || unitName.includes('terminal') || unitName.includes('marine')) utilization = seededNumber(seed, 118, 138)
    if (unitName.includes('keuangan') || unitName.includes('cost control') || unitName.includes('treasury')) utilization = seededNumber(seed, 86, 94)
    if (unitName.includes('legal') || unitName.includes('kepatuhan')) utilization = seededNumber(seed, 56, 66)
    employees.push({
      id: `EMP-${String(employeeCounter).padStart(4, '0')}`,
      nama: name,
      nik,
      positionId: position.id,
      unitId: position.unitId,
      employmentType: seededNumber(seed, 1, 100) <= 76 ? 'tetap' : 'kontrak',
      masaKerjaTahun: seededNumber(seed, 1, 21),
      baseSalary,
      fixedAllowance,
      transportAllowance,
      mealAllowance,
      housingAllowance,
      insuranceBenefit,
      pensionBenefit,
      bonusMonthlyEquivalent,
      overtimeCost,
      totalMonthlyCost,
      totalAnnualCost: totalMonthlyCost * 12,
      performanceScore: seededNumber(seed, 68, 97),
      utilization,
    })
    employeeCounter += 1
  }
}

const processBlueprint: Array<{ name: string; deptKeyword: string; kpi: string; target: number; actual: number }> = [
  { name: 'Kedatangan Kapal', deptKeyword: 'Penjadwalan Kapal', kpi: 'On-Time Berthing', target: 95, actual: 86 },
  { name: 'Bongkar Muat', deptKeyword: 'Operasi Terminal', kpi: 'Turnaround Time', target: 93, actual: 84 },
  { name: 'Perencanaan Yard', deptKeyword: 'Perencanaan Operasi', kpi: 'Yard Utilization Accuracy', target: 92, actual: 83 },
  { name: 'Asset Maintenance Planning', deptKeyword: 'Pemeliharaan', kpi: 'Equipment Availability', target: 98, actual: 91 },
  { name: 'Procurement Request to Payment', deptKeyword: 'Cost Control', kpi: 'Procurement SLA', target: 90, actual: 78 },
  { name: 'Evaluasi Vendor', deptKeyword: 'Cost Control', kpi: 'Vendor Compliance Rate', target: 96, actual: 82 },
  { name: 'Contract Lifecycle Management', deptKeyword: 'Legal', kpi: 'Contract Turnaround', target: 92, actual: 79 },
  { name: 'Customer Order to Billing', deptKeyword: 'Billing', kpi: 'Billing Accuracy', target: 97, actual: 90 },
  { name: 'Monthly Financial Closing', deptKeyword: 'Perencanaan Keuangan', kpi: 'Close Timeliness', target: 95, actual: 88 },
  { name: 'Cash & Treasury Monitoring', deptKeyword: 'Treasury', kpi: 'Cash Forecast Accuracy', target: 94, actual: 89 },
  { name: 'Recruitment to Onboarding', deptKeyword: 'Rekrutmen', kpi: 'Time to Fill', target: 88, actual: 74 },
  { name: 'Payroll Processing', deptKeyword: 'Payroll', kpi: 'Payroll Accuracy', target: 99, actual: 97 },
  { name: 'Workforce Roster Review', deptKeyword: 'Perencanaan SDM', kpi: 'Roster Balance Index', target: 90, actual: 80 },
  { name: 'Operational Risk Review', deptKeyword: 'Manajemen Risiko', kpi: 'Risk Closure Rate', target: 93, actual: 82 },
  { name: 'Incident Reporting and Resolution', deptKeyword: 'IT Service', kpi: 'Incident SLA', target: 92, actual: 81 },
  { name: 'Digital Initiative Prioritization', deptKeyword: 'Digital Product', kpi: 'Digital Delivery Index', target: 90, actual: 77 },
  { name: 'Automation Backlog Management', deptKeyword: 'Automation', kpi: 'Automation Throughput', target: 88, actual: 73 },
  { name: 'Portofolio Strategis Monitoring', deptKeyword: 'Portofolio', kpi: 'Strategic Initiative Health', target: 91, actual: 84 },
  { name: 'Enterprise KPI Assurance', deptKeyword: 'Enterprise KPI', kpi: 'KPI Compliance', target: 97, actual: 89 },
  { name: 'Continuous Improvement Governance', deptKeyword: 'Continuous Improvement', kpi: 'Improvement Delivery Rate', target: 90, actual: 83 },
  { name: 'Kemitraan Komersial Review', deptKeyword: 'Kemitraan', kpi: 'Partner Growth Index', target: 89, actual: 81 },
  { name: 'General Affairs Service Management', deptKeyword: 'Layanan Korporat', kpi: 'Internal SLA', target: 92, actual: 87 },
]

const processes: BusinessProcess[] = processBlueprint.map((pb, idx) => {
  const dept = departments.find((d) => d.name.includes(pb.deptKeyword)) || departments[seededNumber(pb.name, 0, departments.length - 1)]
  const owner = positions.find((p) => p.unitId === dept.id && (p.namaJabatan.includes('Supervisor') || p.namaJabatan.includes('Manager'))) || positions.find((p) => p.unitId === dept.id) || positions[0]
  return {
    id: `PRC-${String(idx + 1).padStart(3, '0')}`,
    name: pb.name,
    ownerPositionId: owner.id,
    departmentId: dept.id,
    kpiName: pb.kpi,
    kpiTarget: pb.target,
    kpiActual: pb.actual,
  }
})

export function calculateWorkload(activity: Pick<Activity, 'frequencyPerMonth' | 'durationHours' | 'complexity' | 'reworkRate' | 'assignedHC'>) {
  const baseWorkload = activity.frequencyPerMonth * activity.durationHours
  const adjustedWorkload = baseWorkload * activity.complexity * (1 + activity.reworkRate)
  const effectiveCapacity = 160
  const requiredHC = adjustedWorkload / effectiveCapacity
  const utilization = activity.assignedHC > 0 ? adjustedWorkload / (activity.assignedHC * effectiveCapacity) : 0
  return {
    workloadHours: Number(adjustedWorkload.toFixed(2)),
    requiredHC: Number(requiredHC.toFixed(2)),
    utilization: Number((utilization * 100).toFixed(2)),
  }
}

const activities: Activity[] = []
let activityCounter = 1

for (const process of processes) {
  const candidatePositions = positions.filter((p) => p.unitId === process.departmentId && !p.namaJabatan.includes('VP'))
  const fallbackPositions = positions.filter((p) => p.unitId === process.departmentId)
  const pool = candidatePositions.length ? candidatePositions : fallbackPositions

  for (let i = 0; i < 8; i += 1) {
    const pos = pool[i % pool.length]
    const employeePool = employees.filter((e) => e.positionId === pos.id)
    const deptName = organizationUnits.find((u) => u.id === process.departmentId)?.name.toLowerCase() || ''
    let frequency = seededNumber(`${process.id}-${i}-f`, 12, 55)
    let duration = seededNumber(`${process.id}-${i}-d`, 1, 4)
    let complexity = seededNumber(`${process.id}-${i}-c`, 10, 16) / 10
    let reworkRate = seededNumber(`${process.id}-${i}-r`, 3, 18) / 100

    if (deptName.includes('operasi') || deptName.includes('terminal') || deptName.includes('marine')) {
      frequency = seededNumber(`${process.id}-${i}-of`, 28, 70)
      duration = seededNumber(`${process.id}-${i}-od`, 2, 5)
      complexity = seededNumber(`${process.id}-${i}-oc`, 12, 17) / 10
      reworkRate = seededNumber(`${process.id}-${i}-or`, 8, 24) / 100
    }
    if (deptName.includes('keuangan') || deptName.includes('cost control') || deptName.includes('treasury')) {
      frequency = seededNumber(`${process.id}-${i}-ff`, 18, 40)
      duration = seededNumber(`${process.id}-${i}-fd`, 2, 4)
      complexity = seededNumber(`${process.id}-${i}-fc`, 10, 13) / 10
      reworkRate = seededNumber(`${process.id}-${i}-fr`, 2, 8) / 100
    }
    if (deptName.includes('legal') || deptName.includes('kepatuhan')) {
      frequency = seededNumber(`${process.id}-${i}-lf`, 8, 22)
      duration = seededNumber(`${process.id}-${i}-ld`, 1, 3)
      complexity = seededNumber(`${process.id}-${i}-lc`, 8, 11) / 10
      reworkRate = seededNumber(`${process.id}-${i}-lr`, 1, 5) / 100
    }

    const assigned = Math.max(1, employeePool.length ? Math.min(employeePool.length, seededNumber(`${process.id}-${i}-a`, 1, 3)) : 1)
    const assignedIds = employeePool.slice(0, assigned).map((e) => e.id)
    const calc = calculateWorkload({
      frequencyPerMonth: frequency,
      durationHours: duration,
      complexity,
      reworkRate,
      assignedHC: assigned,
    })
    activities.push({
      id: `ACT-${String(activityCounter++).padStart(4, '0')}`,
      name: `${process.name} - Aktivitas ${i + 1}`,
      processId: process.id,
      positionId: pos.id,
      employeeIds: assignedIds,
      frequencyPerMonth: frequency,
      durationHours: duration,
      complexity,
      reworkRate,
      workloadHours: calc.workloadHours,
      requiredHC: calc.requiredHC,
      assignedHC: assigned,
      utilization: calc.utilization,
    })
  }
}

const scenarios: Scenario[] = [
  { id: 'SCN-01', name: 'Ekspansi Terminal', type: 'growth', headcountDelta: 52, costDelta: 2850000000, workloadDelta: -18, kpiImpact: 9 },
  { id: 'SCN-02', name: 'Efisiensi Cost', type: 'efficiency', headcountDelta: -24, costDelta: -1980000000, workloadDelta: 6, kpiImpact: -2 },
  { id: 'SCN-03', name: 'Automasi Procurement', type: 'automation', headcountDelta: -6, costDelta: -620000000, workloadDelta: -14, kpiImpact: 6 },
  { id: 'SCN-04', name: 'Digital Transformation', type: 'digital', headcountDelta: 18, costDelta: 1240000000, workloadDelta: -11, kpiImpact: 8 },
  { id: 'SCN-05', name: 'Restrukturisasi SDM', type: 'restructure', headcountDelta: -12, costDelta: -740000000, workloadDelta: 2, kpiImpact: 3 },
]

function pickOverloadedActivities(limit: number) {
  return activities
    .filter((a) => a.utilization >= 120)
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, limit)
}
function pickUnderutilizedActivities(limit: number) {
  return activities
    .filter((a) => a.utilization <= 65)
    .sort((a, b) => a.utilization - b.utilization)
    .slice(0, limit)
}

const overloadedActs = pickOverloadedActivities(8)
const underutilizedActs = pickUnderutilizedActivities(4)

const aiInsights: AIInsight[] = [
  ...overloadedActs.slice(0, 6).map((a, idx): AIInsight => {
    const process = processes.find((p) => p.id === a.processId)!
    return {
      id: `AIS-${String(idx + 1).padStart(3, '0')}`,
      title: `Overload ${process.name}`,
      severity: idx < 2 ? 'critical' : 'high',
      category: 'Workload Overload',
      departmentId: process.departmentId,
      relatedPositionIds: [a.positionId],
      relatedProcessIds: [process.id],
      relatedActivityIds: [a.id],
      summary: `Utilisasi aktivitas ${a.name} mencapai ${a.utilization.toFixed(1)}% di atas ambang 110%.`,
      recommendation: 'Tambah headcount, redistribusi aktivitas, dan jalankan simulasi skenario.',
      impact: { workloadChange: -24, costChange: 38000000, kpiChange: 5 },
    }
  }),
  ...underutilizedActs.slice(0, 3).map((a, idx): AIInsight => {
    const process = processes.find((p) => p.id === a.processId)!
    return {
      id: `AIS-${String(idx + 7).padStart(3, '0')}`,
      title: `Underutilization ${process.name}`,
      severity: 'medium',
      category: 'Capacity Rebalance',
      departmentId: process.departmentId,
      relatedPositionIds: [a.positionId],
      relatedProcessIds: [process.id],
      relatedActivityIds: [a.id],
      summary: `Utilisasi aktivitas ${a.name} hanya ${a.utilization.toFixed(1)}%, kapasitas belum dimanfaatkan.`,
      recommendation: 'Alihkan aktivitas lintas fungsi dan optimalkan peran legal/kepatuhan.',
      impact: { workloadChange: 12, costChange: -14000000, kpiChange: 3 },
    }
  }),
  {
    id: 'AIS-010',
    title: 'Cost Inefficiency Finance Validation',
    severity: 'high',
    category: 'Cost Optimization',
    departmentId: processes.find((p) => p.name === 'Monthly Financial Closing')!.departmentId,
    relatedPositionIds: positions.filter((p) => p.namaJabatan.includes('Manager') && p.unitId === processes.find((p) => p.name === 'Monthly Financial Closing')!.departmentId).slice(0, 2).map((p) => p.id),
    relatedProcessIds: [processes.find((p) => p.name === 'Monthly Financial Closing')!.id],
    relatedActivityIds: activities.filter((a) => a.processId === processes.find((p) => p.name === 'Monthly Financial Closing')!.id).slice(0, 2).map((a) => a.id),
    summary: 'Biaya per aktivitas keuangan 22% di atas benchmark internal.',
    recommendation: 'Pindahkan validasi rutin ke level officer dan fokus manager pada analisis.',
    impact: { workloadChange: -10, costChange: -48000000, kpiChange: 4 },
  },
  {
    id: 'AIS-011',
    title: 'Procurement Process Ownership Gap',
    severity: 'high',
    category: 'Process Ownership',
    departmentId: processes.find((p) => p.name === 'Procurement Request to Payment')!.departmentId,
    relatedPositionIds: [processes.find((p) => p.name === 'Procurement Request to Payment')!.ownerPositionId],
    relatedProcessIds: [
      processes.find((p) => p.name === 'Procurement Request to Payment')!.id,
      processes.find((p) => p.name === 'Evaluasi Vendor')!.id,
    ],
    relatedActivityIds: activities.filter((a) => {
      const pid = processes.find((p) => p.id === a.processId)?.name
      return pid === 'Procurement Request to Payment' || pid === 'Evaluasi Vendor'
    }).slice(0, 3).map((a) => a.id),
    summary: 'Terdapat aktivitas evaluasi vendor tanpa accountable owner tunggal.',
    recommendation: 'Bentuk Spesialis Tata Kelola Vendor dan tetapkan RACI proses.',
    impact: { workloadChange: -16, costChange: 31800000, kpiChange: 7 },
  },
  {
    id: 'AIS-012',
    title: 'Digital Program Delay Risk',
    severity: 'critical',
    category: 'Program Risk',
    departmentId: processes.find((p) => p.name === 'Digital Initiative Prioritization')!.departmentId,
    relatedPositionIds: [processes.find((p) => p.name === 'Digital Initiative Prioritization')!.ownerPositionId],
    relatedProcessIds: [processes.find((p) => p.name === 'Digital Initiative Prioritization')!.id],
    relatedActivityIds: activities.filter((a) => a.processId === processes.find((p) => p.name === 'Digital Initiative Prioritization')!.id).slice(0, 2).map((a) => a.id),
    summary: 'Backlog inisiatif digital meningkat 31% karena kapasitas analis otomasi terbatas.',
    recommendation: 'Tambahkan peran Spesialis Automasi Proses dan lakukan skenario prioritisasi.',
    impact: { workloadChange: -20, costChange: 34000000, kpiChange: 8 },
  },
  {
    id: 'AIS-013',
    title: 'Risk Governance Throughput Gap',
    severity: 'high',
    category: 'Governance Risk',
    departmentId: processes.find((p) => p.name === 'Operational Risk Review')!.departmentId,
    relatedPositionIds: [processes.find((p) => p.name === 'Operational Risk Review')!.ownerPositionId],
    relatedProcessIds: [processes.find((p) => p.name === 'Operational Risk Review')!.id],
    relatedActivityIds: activities.filter((a) => a.processId === processes.find((p) => p.name === 'Operational Risk Review')!.id).slice(0, 2).map((a) => a.id),
    summary: 'Tingkat penutupan risiko turun ke 82% dengan backlog review pada unit operasi.',
    recommendation: 'Tambahkan analis risiko dan otomatisasi prioritas mitigasi.',
    impact: { workloadChange: -14, costChange: 26000000, kpiChange: 6 },
  },
  {
    id: 'AIS-014',
    title: 'Legal Capacity Redeployment Opportunity',
    severity: 'medium',
    category: 'Underutilization',
    departmentId: processes.find((p) => p.name === 'Contract Lifecycle Management')!.departmentId,
    relatedPositionIds: [processes.find((p) => p.name === 'Contract Lifecycle Management')!.ownerPositionId],
    relatedProcessIds: [processes.find((p) => p.name === 'Contract Lifecycle Management')!.id],
    relatedActivityIds: activities.filter((a) => a.processId === processes.find((p) => p.name === 'Contract Lifecycle Management')!.id).slice(0, 2).map((a) => a.id),
    summary: 'Kapasitas legal masih longgar sekitar 40%, dapat menyerap review kontrak procurement.',
    recommendation: 'Realokasi aktivitas review kontrak dan kurangi bottleneck procurement.',
    impact: { workloadChange: 10, costChange: -6000000, kpiChange: 3 },
  },
]

const aiGeneratedPositions: AIGeneratedPosition[] = [
  {
    id: 'AIP-001',
    namaJabatan: 'Spesialis Tata Kelola Vendor',
    unitId: processes.find((p) => p.name === 'Evaluasi Vendor')!.departmentId,
    reportsTo: processes.find((p) => p.name === 'Procurement Request to Payment')!.ownerPositionId,
    processes: [processes.find((p) => p.name === 'Evaluasi Vendor')!.id, processes.find((p) => p.name === 'Contract Lifecycle Management')!.id],
    activities: activities.filter((a) => ['Evaluasi Vendor', 'Contract Lifecycle Management'].includes(processes.find((p) => p.id === a.processId)!.name)).slice(0, 4).map((a) => a.id),
    requiredHC: 1.23,
    workloadHours: 167.3,
    costMonthly: 31800000,
    impactSummary: 'Memperbaiki SLA procurement +14% dan menutup gap ownership aktivitas vendor.',
  },
  {
    id: 'AIP-002',
    namaJabatan: 'Analis Kapasitas Operasi',
    unitId: processes.find((p) => p.name === 'Kedatangan Kapal')!.departmentId,
    reportsTo: processes.find((p) => p.name === 'Kedatangan Kapal')!.ownerPositionId,
    processes: [processes.find((p) => p.name === 'Kedatangan Kapal')!.id, processes.find((p) => p.name === 'Bongkar Muat')!.id],
    activities: overloadedActs.slice(0, 4).map((a) => a.id),
    requiredHC: 1.4,
    workloadHours: 186.2,
    costMonthly: 37200000,
    impactSummary: 'Menurunkan overload operasi ke kisaran 92% dan mendorong KPI turnaround.',
  },
  {
    id: 'AIP-003',
    namaJabatan: 'Spesialis Automasi Proses',
    unitId: processes.find((p) => p.name === 'Automation Backlog Management')!.departmentId,
    reportsTo: processes.find((p) => p.name === 'Digital Initiative Prioritization')!.ownerPositionId,
    processes: [processes.find((p) => p.name === 'Automation Backlog Management')!.id, processes.find((p) => p.name === 'Digital Initiative Prioritization')!.id],
    activities: activities.filter((a) => {
      const n = processes.find((p) => p.id === a.processId)!.name
      return n.includes('Automation') || n.includes('Digital')
    }).slice(0, 4).map((a) => a.id),
    requiredHC: 1.1,
    workloadHours: 158.1,
    costMonthly: 34000000,
    impactSummary: 'Mempercepat inisiatif digital dan mengurangi backlog automasi 20%.',
  },
  {
    id: 'AIP-004',
    namaJabatan: 'Analis Efisiensi Biaya Operasional',
    unitId: processes.find((p) => p.name === 'Monthly Financial Closing')!.departmentId,
    reportsTo: processes.find((p) => p.name === 'Monthly Financial Closing')!.ownerPositionId,
    processes: [processes.find((p) => p.name === 'Monthly Financial Closing')!.id],
    activities: activities.filter((a) => a.processId === processes.find((p) => p.name === 'Monthly Financial Closing')!.id).slice(0, 3).map((a) => a.id),
    requiredHC: 1,
    workloadHours: 149.6,
    costMonthly: 30000000,
    impactSummary: 'Menurunkan cost per activity finance 15% melalui redistribusi kerja.',
  },
  {
    id: 'AIP-005',
    namaJabatan: 'Koordinator Service Recovery TI',
    unitId: processes.find((p) => p.name === 'Incident Reporting and Resolution')!.departmentId,
    reportsTo: processes.find((p) => p.name === 'Incident Reporting and Resolution')!.ownerPositionId,
    processes: [processes.find((p) => p.name === 'Incident Reporting and Resolution')!.id],
    activities: activities.filter((a) => a.processId === processes.find((p) => p.name === 'Incident Reporting and Resolution')!.id).slice(0, 3).map((a) => a.id),
    requiredHC: 1.05,
    workloadHours: 152.4,
    costMonthly: 29000000,
    impactSummary: 'Meningkatkan SLA incident sebesar 9% dan mempercepat triage kritikal.',
  },
  {
    id: 'AIP-006',
    namaJabatan: 'Lead Ownership Proses',
    unitId: processes.find((p) => p.name === 'Continuous Improvement Governance')!.departmentId,
    reportsTo: processes.find((p) => p.name === 'Continuous Improvement Governance')!.ownerPositionId,
    processes: [processes.find((p) => p.name === 'Continuous Improvement Governance')!.id, processes.find((p) => p.name === 'Operational Risk Review')!.id],
    activities: activities.filter((a) => {
      const n = processes.find((p) => p.id === a.processId)!.name
      return n.includes('Governance') || n.includes('Risk')
    }).slice(0, 4).map((a) => a.id),
    requiredHC: 1.06,
    workloadHours: 144,
    costMonthly: 39000000,
    impactSummary: 'Menutup gap ownership proses dan menurunkan temuan audit berulang.',
  },
  {
    id: 'AIP-007',
    namaJabatan: 'Planner Sumber Daya Terminal',
    unitId: processes.find((p) => p.name === 'Perencanaan Yard')!.departmentId,
    reportsTo: processes.find((p) => p.name === 'Perencanaan Yard')!.ownerPositionId,
    processes: [processes.find((p) => p.name === 'Perencanaan Yard')!.id, processes.find((p) => p.name === 'Kedatangan Kapal')!.id],
    activities: overloadedActs.slice(2, 6).map((a) => a.id),
    requiredHC: 1.08,
    workloadHours: 146.9,
    costMonthly: 29300000,
    impactSummary: 'Menyeimbangkan shift planning dan menurunkan bottleneck operasional malam.',
  },
  {
    id: 'AIP-008',
    namaJabatan: 'Analis Workforce Cost',
    unitId: processes.find((p) => p.name === 'Workforce Roster Review')!.departmentId,
    reportsTo: processes.find((p) => p.name === 'Workforce Roster Review')!.ownerPositionId,
    processes: [processes.find((p) => p.name === 'Workforce Roster Review')!.id, processes.find((p) => p.name === 'Monthly Financial Closing')!.id],
    activities: activities.filter((a) => {
      const n = processes.find((p) => p.id === a.processId)!.name
      return n.includes('Roster') || n.includes('Financial')
    }).slice(0, 4).map((a) => a.id),
    requiredHC: 1.08,
    workloadHours: 146.3,
    costMonthly: 30000000,
    impactSummary: 'Meningkatkan akurasi planning SDM dan transparansi biaya tenaga kerja.',
  },
]

export function calculateUtilization(positionId: string) {
  const related = activities.filter((a) => a.positionId === positionId)
  if (!related.length) return 0
  const avg = related.reduce((sum, a) => sum + a.utilization, 0) / related.length
  return Number(avg.toFixed(2))
}

function collectUnitDescendants(unitId: string): string[] {
  const children = organizationUnits.filter((u) => u.parentId === unitId)
  return children.flatMap((c) => [c.id, ...collectUnitDescendants(c.id)])
}

export function calculateDepartmentCost(unitId: string) {
  const allUnitIds = [unitId, ...collectUnitDescendants(unitId)]
  const posInUnit = positions.filter((p) => allUnitIds.includes(p.unitId))
  return posInUnit.reduce((sum, position) => {
    const emps = employees.filter((e) => e.positionId === position.id)
    if (emps.length === 0) return sum + position.plannedCostMonthly
    return sum + emps.reduce((s, e) => s + e.totalMonthlyCost, 0)
  }, 0)
}

export function applyScenario(scenarioId: string) {
  const scenario = scenarios.find((s) => s.id === scenarioId)
  if (!scenario) return null
  const baselineCost = calculateDepartmentCost('DIR-01') + calculateDepartmentCost('DIR-02') + calculateDepartmentCost('DIR-03') + calculateDepartmentCost('DIR-04') + calculateDepartmentCost('DIR-05') + calculateDepartmentCost('DIR-06')
  return {
    ...scenario,
    projectedCost: baselineCost + scenario.costDelta,
    projectedKpiLift: scenario.kpiImpact,
    projectedHeadcount: employees.length + scenario.headcountDelta,
  }
}

export function getAIInsights() {
  const rank = { critical: 4, high: 3, medium: 2, low: 1 }
  return [...aiInsights].sort((a, b) => rank[b.severity] - rank[a.severity])
}

function validateRelationships() {
  const unitIds = new Set(organizationUnits.map((u) => u.id))
  const posIds = new Set(positions.map((p) => p.id))
  const procIds = new Set(processes.map((p) => p.id))
  const actIds = new Set(activities.map((a) => a.id))

  for (const p of positions) {
    if (!unitIds.has(p.unitId)) throw new Error(`Invalid position.unitId: ${p.id}`)
    if (p.reportsTo && !posIds.has(p.reportsTo)) throw new Error(`Invalid position.reportsTo: ${p.id}`)
  }
  for (const e of employees) {
    if (!posIds.has(e.positionId)) throw new Error(`Invalid employee.positionId: ${e.id}`)
    if (!unitIds.has(e.unitId)) throw new Error(`Invalid employee.unitId: ${e.id}`)
  }
  for (const p of processes) {
    if (!unitIds.has(p.departmentId)) throw new Error(`Invalid process.departmentId: ${p.id}`)
    if (!posIds.has(p.ownerPositionId)) throw new Error(`Invalid process.ownerPositionId: ${p.id}`)
  }
  for (const a of activities) {
    if (!procIds.has(a.processId)) throw new Error(`Invalid activity.processId: ${a.id}`)
    if (!posIds.has(a.positionId)) throw new Error(`Invalid activity.positionId: ${a.id}`)
    for (const eid of a.employeeIds) {
      if (!employees.some((e) => e.id === eid)) throw new Error(`Invalid activity.employeeId: ${a.id}`)
    }
  }
  for (const i of aiInsights) {
    if (!unitIds.has(i.departmentId)) throw new Error(`Invalid aiInsight.departmentId: ${i.id}`)
    if (!i.relatedPositionIds.every((id) => posIds.has(id))) throw new Error(`Invalid aiInsight.position ref: ${i.id}`)
    if (!i.relatedProcessIds.every((id) => procIds.has(id))) throw new Error(`Invalid aiInsight.process ref: ${i.id}`)
    if (!i.relatedActivityIds.every((id) => actIds.has(id))) throw new Error(`Invalid aiInsight.activity ref: ${i.id}`)
  }
}

validateRelationships()

export const omData = {
  organizationUnits,
  positions,
  employees,
  processes,
  activities,
  scenarios,
  aiInsights,
  aiGeneratedPositions,
}
