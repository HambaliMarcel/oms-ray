// =====================================================================
// OMS Intelligence — Single Source of Truth Data Layer
// All exports are typed and shaped to match every consumer in the app.
// =====================================================================

// ---------------------------------------------------------------------
// EMPLOYEES
// ---------------------------------------------------------------------
const _rawEmployees = [
  { id: "E001", name: "Hendra Saputra",   position: "Chief Executive Officer", dept: "Executive",       deptId: "D00", grade: "G10", level: "C-Suite",  status: "Active",   salary: 350000, cost: 420000, utilization: 88, kpiScore: 95, manager: "Board",          managerId: null,    hireDate: "2018-03-15", tenure: 8,  email: "hendra@company.com",  phone: "+62-811-100-001", location: "Jakarta",   reportingTo: null,    riskScore: 12 },
  { id: "E002", name: "Citra Dewi",       position: "Chief Operating Officer", dept: "Operations",      deptId: "D04", grade: "G9",  level: "Executive", status: "Active",   salary: 280000, cost: 336000, utilization: 92, kpiScore: 92, manager: "Hendra Saputra", managerId: "E001",  hireDate: "2019-01-20", tenure: 7,  email: "citra@company.com",   phone: "+62-811-100-002", location: "Jakarta",   reportingTo: "E001",  riskScore: 18 },
  { id: "E003", name: "Maya Sari",        position: "Chief Financial Officer", dept: "Finance",         deptId: "D03", grade: "G9",  level: "Executive", status: "Active",   salary: 290000, cost: 348000, utilization: 90, kpiScore: 94, manager: "Hendra Saputra", managerId: "E001",  hireDate: "2019-04-12", tenure: 7,  email: "maya@company.com",    phone: "+62-811-100-003", location: "Jakarta",   reportingTo: "E001",  riskScore: 14 },
  { id: "E004", name: "Sari Indah",       position: "VP Operations",           dept: "Operations",      deptId: "D04", grade: "G8",  level: "VP",        status: "Active",   salary: 200000, cost: 240000, utilization: 86, kpiScore: 88, manager: "Citra Dewi",     managerId: "E002",  hireDate: "2020-06-08", tenure: 6,  email: "sari@company.com",    phone: "+62-811-100-004", location: "Jakarta",   reportingTo: "E002",  riskScore: 22 },
  { id: "E005", name: "Dewi Kurnia",      position: "VP Marketing",            dept: "Marketing",       deptId: "D05", grade: "G8",  level: "VP",        status: "Active",   salary: 195000, cost: 234000, utilization: 84, kpiScore: 82, manager: "Hendra Saputra", managerId: "E001",  hireDate: "2020-09-15", tenure: 6,  email: "dewi@company.com",    phone: "+62-811-100-005", location: "Jakarta",   reportingTo: "E001",  riskScore: 30 },
  { id: "E006", name: "Rini Wulandari",   position: "VP Technology",           dept: "Technology",      deptId: "D01", grade: "G8",  level: "VP",        status: "Active",   salary: 230000, cost: 276000, utilization: 95, kpiScore: 91, manager: "Hendra Saputra", managerId: "E001",  hireDate: "2020-02-01", tenure: 6,  email: "rini@company.com",    phone: "+62-811-100-006", location: "Bandung",   reportingTo: "E001",  riskScore: 28 },
  { id: "E007", name: "Budi Santoso",     position: "VP Strategy",             dept: "Strategy",        deptId: "D08", grade: "G8",  level: "VP",        status: "Active",   salary: 210000, cost: 252000, utilization: 80, kpiScore: 87, manager: "Hendra Saputra", managerId: "E001",  hireDate: "2021-01-10", tenure: 5,  email: "budi@company.com",    phone: "+62-811-100-007", location: "Jakarta",   reportingTo: "E001",  riskScore: 16 },
  { id: "E008", name: "Fitri Handayani",  position: "General Counsel",         dept: "Legal",           deptId: "D06", grade: "G8",  level: "VP",        status: "Active",   salary: 220000, cost: 264000, utilization: 78, kpiScore: 90, manager: "Hendra Saputra", managerId: "E001",  hireDate: "2019-11-05", tenure: 7,  email: "fitri@company.com",   phone: "+62-811-100-008", location: "Jakarta",   reportingTo: "E001",  riskScore: 10 },
  { id: "E009", name: "Agus Pratama",     position: "Senior Software Engineer",dept: "Technology",      deptId: "D01", grade: "G6",  level: "Senior",    status: "Active",   salary: 130000, cost: 156000, utilization: 96, kpiScore: 84, manager: "Rini Wulandari", managerId: "E006",  hireDate: "2021-08-20", tenure: 5,  email: "agus@company.com",    phone: "+62-811-100-009", location: "Bandung",   reportingTo: "E006",  riskScore: 42 },
  { id: "E010", name: "Indah Permata",    position: "Tech Lead",               dept: "Technology",      deptId: "D01", grade: "G7",  level: "Lead",      status: "Active",   salary: 150000, cost: 180000, utilization: 92, kpiScore: 89, manager: "Rini Wulandari", managerId: "E006",  hireDate: "2020-11-15", tenure: 6,  email: "indah@company.com",   phone: "+62-811-100-010", location: "Bandung",   reportingTo: "E006",  riskScore: 25 },
  { id: "E011", name: "Doni Kurniawan",   position: "Software Engineer",       dept: "Technology",      deptId: "D01", grade: "G5",  level: "Mid",       status: "Active",   salary: 95000,  cost: 114000, utilization: 88, kpiScore: 78, manager: "Indah Permata",  managerId: "E010",  hireDate: "2022-04-10", tenure: 4,  email: "doni@company.com",    phone: "+62-811-100-011", location: "Bandung",   reportingTo: "E010",  riskScore: 35 },
  { id: "E012", name: "Putri Maharani",   position: "Software Engineer",       dept: "Technology",      deptId: "D01", grade: "G5",  level: "Mid",       status: "On Leave", salary: 92000,  cost: 110400, utilization: 0,  kpiScore: 70, manager: "Indah Permata",  managerId: "E010",  hireDate: "2022-07-22", tenure: 4,  email: "putri@company.com",   phone: "+62-811-100-012", location: "Bandung",   reportingTo: "E010",  riskScore: 55 },
  { id: "E013", name: "Bambang Kusuma",   position: "Operations Manager",      dept: "Operations",      deptId: "D04", grade: "G6",  level: "Manager",   status: "Active",   salary: 120000, cost: 144000, utilization: 90, kpiScore: 86, manager: "Sari Indah",     managerId: "E004",  hireDate: "2021-05-12", tenure: 5,  email: "bambang@company.com", phone: "+62-811-100-013", location: "Surabaya",  reportingTo: "E004",  riskScore: 20 },
  { id: "E014", name: "Wahyu Pradana",    position: "Operations Analyst",      dept: "Operations",      deptId: "D04", grade: "G4",  level: "Junior",    status: "Active",   salary: 75000,  cost: 90000,  utilization: 82, kpiScore: 76, manager: "Bambang Kusuma", managerId: "E013",  hireDate: "2023-02-08", tenure: 3,  email: "wahyu@company.com",   phone: "+62-811-100-014", location: "Surabaya",  reportingTo: "E013",  riskScore: 28 },
  { id: "E015", name: "Andi Wijaya",      position: "Senior Finance Manager",  dept: "Finance",         deptId: "D03", grade: "G7",  level: "Lead",      status: "Active",   salary: 130000, cost: 156000, utilization: 88, kpiScore: 87, manager: "Sri Mulyani",    managerId: "E016",  hireDate: "2020-08-30", tenure: 6,  email: "andi@company.com",    phone: "+62-811-100-015", location: "Jakarta",   reportingTo: "E016",  riskScore: 18 },
  { id: "E016", name: "Sri Mulyani",      position: "Finance Director",        dept: "Finance",         deptId: "D03", grade: "G8",  level: "VP",        status: "Active",   salary: 200000, cost: 240000, utilization: 86, kpiScore: 93, manager: "Maya Sari",      managerId: "E003",  hireDate: "2019-08-15", tenure: 7,  email: "sri@company.com",     phone: "+62-811-100-016", location: "Jakarta",   reportingTo: "E003",  riskScore: 12 },
  { id: "E017", name: "Yusuf Hakim",      position: "Financial Analyst",       dept: "Finance",         deptId: "D03", grade: "G4",  level: "Junior",    status: "Active",   salary: 78000,  cost: 93600,  utilization: 80, kpiScore: 74, manager: "Andi Wijaya",    managerId: "E015",  hireDate: "2023-09-12", tenure: 3,  email: "yusuf@company.com",   phone: "+62-811-100-017", location: "Jakarta",   reportingTo: "E015",  riskScore: 32 },
  { id: "E018", name: "Lestari Putri",    position: "HR Director",             dept: "Human Resources", deptId: "D02", grade: "G8",  level: "VP",        status: "Active",   salary: 180000, cost: 216000, utilization: 84, kpiScore: 90, manager: "Hendra Saputra", managerId: "E001",  hireDate: "2020-03-20", tenure: 6,  email: "lestari@company.com", phone: "+62-811-100-018", location: "Jakarta",   reportingTo: "E001",  riskScore: 15 },
  { id: "E019", name: "Hana Setiawan",    position: "Senior Recruiter",        dept: "Human Resources", deptId: "D02", grade: "G5",  level: "Mid",       status: "Active",   salary: 92000,  cost: 110400, utilization: 95, kpiScore: 85, manager: "Lestari Putri",  managerId: "E018",  hireDate: "2022-01-18", tenure: 4,  email: "hana@company.com",    phone: "+62-811-100-019", location: "Jakarta",   reportingTo: "E018",  riskScore: 22 },
  { id: "E020", name: "Joko Susilo",      position: "Marketing Manager",       dept: "Marketing",       deptId: "D05", grade: "G6",  level: "Manager",   status: "Active",   salary: 115000, cost: 138000, utilization: 86, kpiScore: 81, manager: "Dewi Kurnia",    managerId: "E005",  hireDate: "2021-10-05", tenure: 5,  email: "joko@company.com",    phone: "+62-811-100-020", location: "Jakarta",   reportingTo: "E005",  riskScore: 26 },
  { id: "E021", name: "Irfan Halim",      position: "Procurement Manager",     dept: "Procurement",     deptId: "D07", grade: "G6",  level: "Manager",   status: "Active",   salary: 110000, cost: 132000, utilization: 82, kpiScore: 83, manager: "Sari Indah",     managerId: "E004",  hireDate: "2021-12-01", tenure: 5,  email: "irfan@company.com",   phone: "+62-811-100-021", location: "Jakarta",   reportingTo: "E004",  riskScore: 24 },
  { id: "E022", name: "Mira Anggraini",   position: "Procurement Officer",     dept: "Procurement",     deptId: "D07", grade: "G4",  level: "Junior",    status: "Active",   salary: 72000,  cost: 86400,  utilization: 78, kpiScore: 72, manager: "Irfan Halim",    managerId: "E021",  hireDate: "2023-05-15", tenure: 3,  email: "mira@company.com",    phone: "+62-811-100-022", location: "Jakarta",   reportingTo: "E021",  riskScore: 38 },
  { id: "E023", name: "Rahmat Hidayat",   position: "Legal Counsel",           dept: "Legal",           deptId: "D06", grade: "G6",  level: "Manager",   status: "Active",   salary: 120000, cost: 144000, utilization: 76, kpiScore: 88, manager: "Fitri Handayani",managerId: "E008",  hireDate: "2021-07-22", tenure: 5,  email: "rahmat@company.com",  phone: "+62-811-100-023", location: "Jakarta",   reportingTo: "E008",  riskScore: 14 },
  { id: "E024", name: "Siti Aminah",      position: "Strategy Director",       dept: "Strategy",        deptId: "D08", grade: "G8",  level: "VP",        status: "Active",   salary: 190000, cost: 228000, utilization: 80, kpiScore: 89, manager: "Budi Santoso",   managerId: "E007",  hireDate: "2020-04-18", tenure: 6,  email: "siti@company.com",    phone: "+62-811-100-024", location: "Jakarta",   reportingTo: "E007",  riskScore: 16 },
];

export const employees = _rawEmployees;

// ---------------------------------------------------------------------
// DEPARTMENTS
// ---------------------------------------------------------------------
export const departments = [
  { id: "D01", name: "Executive Office",   code: "EXEC",  hc: 8,  headPlan: 8,  gap: 0, budget: 4500000, utilized: 4200000, head: "Hendra Saputra",    location: "Jakarta",  status: "Active", color: "#FF6B6B", vacancies: 0, spanOfControl: 7.0, avgTenure: 6.8, kpi: 92, cost: 3650000 },
  { id: "D02", name: "Finance",            code: "FIN",   hc: 18, headPlan: 20, gap: 2, budget: 3200000, utilized: 2950000, head: "Sri Mulyani",      location: "Jakarta",  status: "Active", color: "#4ECDC4", vacancies: 2, spanOfControl: 4.5, avgTenure: 4.8, kpi: 88, cost: 1450000 },
  { id: "D03", name: "Human Capital",      code: "HC",    hc: 12, headPlan: 15, gap: 3, budget: 1800000, utilized: 1620000, head: "Lestari Putri",    location: "Jakarta",  status: "Active", color: "#95E1D3", vacancies: 3, spanOfControl: 4.0, avgTenure: 3.5, kpi: 81, cost: 720000 },
  { id: "D04", name: "Operations",         code: "OPS",   hc: 35, headPlan: 42, gap: 7, budget: 5200000, utilized: 5680000, head: "Sari Indah",       location: "Surabaya", status: "Active", color: "#FFD93D", vacancies: 7, spanOfControl: 5.8, avgTenure: 3.2, kpi: 76, cost: 1620000 },
  { id: "D05", name: "Engineering",        code: "ENG",   hc: 28, headPlan: 35, gap: 7, budget: 6800000, utilized: 7050000, head: "Rini Wulandari",   location: "Bandung",  status: "Active", color: "#A8E6CF", vacancies: 7, spanOfControl: 4.2, avgTenure: 2.9, kpi: 84, cost: 1960000 },
  { id: "D06", name: "IT & Digital",       code: "IT",    hc: 22, headPlan: 28, gap: 6, budget: 4900000, utilized: 5100000, head: "Budi Santoso",     location: "Jakarta",  status: "Active", color: "#FFB7C5", vacancies: 6, spanOfControl: 4.1, avgTenure: 2.5, kpi: 79, cost: 1540000 },
  { id: "D07", name: "Sales & Marketing",   code: "SALES", hc: 20, headPlan: 25, gap: 5, budget: 3600000, utilized: 3240000, head: "Dewi Kurnia",      location: "Jakarta",  status: "Active", color: "#FF8C94", vacancies: 5, spanOfControl: 5.0, avgTenure: 2.3, kpi: 85, cost: 1080000 },
  { id: "D08", name: "Procurement",        code: "PROC",  hc: 15, headPlan: 18, gap: 3, budget: 2200000, utilized: 2100000, head: "Irfan Halim",      location: "Jakarta",  status: "Active", color: "#AAF683", vacancies: 3, spanOfControl: 4.5, avgTenure: 3.1, kpi: 82, cost: 675000 },
  { id: "D09", name: "Legal & Compliance",  code: "LEG",   hc: 10, headPlan: 12, gap: 2, budget: 1900000, utilized: 1710000, head: "Fitri Handayani",  location: "Jakarta",  status: "Active", color: "#FF6B9D", vacancies: 2, spanOfControl: 4.0, avgTenure: 5.8, kpi: 90, cost: 570000 },
  { id: "D10", name: "Supply Chain",       code: "SC",    hc: 25, headPlan: 32, gap: 7, budget: 4100000, utilized: 4620000, head: "Cahyadi Wijaya",   location: "Medan",   status: "Active", color: "#FEC8D8", vacancies: 7, spanOfControl: 5.2, avgTenure: 3.4, kpi: 77, cost: 1250000 },
  { id: "D11", name: "Customer Service",   code: "CS",    hc: 45, headPlan: 58, gap: 13, budget: 4800000, utilized: 5220000, head: "Citra Dewi",       location: "Jakarta",  status: "Active", color: "#FDBCB4", vacancies: 13, spanOfControl: 6.5, avgTenure: 2.1, kpi: 72, cost: 1350000 },
  { id: "D12", name: "Strategy & Transformation", code: "STRAT", hc: 8, headPlan: 10, gap: 2, budget: 1500000, utilized: 1350000, head: "Siti Aminah", location: "Jakarta", status: "Active", color: "#C8B8FF", vacancies: 2, spanOfControl: 3.5, avgTenure: 4.2, kpi: 88, cost: 540000 },
];

const bumnDepartmentDisplayById: Record<string, string> = {
  D01: "Direksi & Corporate Office",
  D02: "Divisi Finance & Governance",
  D03: "Divisi Human Capital Management",
  D04: "Divisi Operasi Terminal",
  D05: "Divisi Digital Transformation",
  D06: "Divisi IT Infrastructure",
  D07: "Divisi Komersial & Customer Solutions",
  D08: "Divisi Procurement",
  D09: "Divisi Legal & Compliance",
  D10: "Divisi Pelayanan Kapal",
  D11: "Divisi Port Services",
  D12: "Divisi Strategy & Corporate Planning",
};

for (const d of departments as Array<Record<string, any>>) {
  d.name = bumnDepartmentDisplayById[d.id] ?? d.name;
}

// ---------------------------------------------------------------------
// POSITIONS
// ---------------------------------------------------------------------
export const positions = [
  // Executive Office (6 positions)
  { id: "P001", title: "CEO", dept: "Executive Office", deptId: "D01", grade: "G10", level: "C-Level", filled: 1, planned: 1, status: "Filled", salaryMin: 500000, salaryMax: 600000, competencies: ["Strategy", "Leadership", "Vision", "Stakeholder Mgmt"] },
  { id: "P002", title: "CFO", dept: "Executive Office", deptId: "D01", grade: "G9", level: "Director", filled: 1, planned: 1, status: "Filled", salaryMin: 350000, salaryMax: 420000, competencies: ["Financial Planning", "Audit", "Risk Mgmt", "Compliance"] },
  { id: "P003", title: "COO", dept: "Executive Office", deptId: "D01", grade: "G9", level: "Director", filled: 1, planned: 1, status: "Filled", salaryMin: 320000, salaryMax: 400000, competencies: ["Operations", "Process Mgmt", "Vendor Mgmt", "SLA"] },
  { id: "P004", title: "Chief Strategy Officer", dept: "Executive Office", deptId: "D01", grade: "G9", level: "Director", filled: 1, planned: 1, status: "Filled", salaryMin: 300000, salaryMax: 380000, competencies: ["Strategy", "M&A", "Business Dev", "Transformation"] },
  { id: "P005", title: "VP Corporate Development", dept: "Executive Office", deptId: "D01", grade: "G8", level: "VP", filled: 1, planned: 1, status: "Filled", salaryMin: 240000, salaryMax: 300000, competencies: ["Business Dev", "Partnerships", "Innovation", "Growth"] },
  { id: "P006", title: "General Counsel", dept: "Executive Office", deptId: "D01", grade: "G8", level: "VP", filled: 1, planned: 1, status: "Filled", salaryMin: 260000, salaryMax: 320000, competencies: ["Legal", "Compliance", "Governance", "Risk"] },
  // Finance Department (18 positions)
  { id: "P007", title: "Finance Director", dept: "Finance", deptId: "D02", grade: "G8", level: "Director", filled: 1, planned: 1, status: "Filled", salaryMin: 160000, salaryMax: 200000, competencies: ["Financial Planning", "Compliance", "Executive Reporting", "Audit"] },
  { id: "P008", title: "Controller", dept: "Finance", deptId: "D02", grade: "G7", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 110000, salaryMax: 150000, competencies: ["GL Accounting", "Month-end Close", "Audit", "GAAP"] },
  { id: "P009", title: "Payroll Manager", dept: "Finance", deptId: "D02", grade: "G6", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 90000, salaryMax: 120000, competencies: ["Payroll", "HR Systems", "Tax", "Compliance"] },
  { id: "P010", title: "Financial Analyst", dept: "Finance", deptId: "D02", grade: "G4", level: "Analyst", filled: 3, planned: 5, status: "Open", salaryMin: 60000, salaryMax: 85000, competencies: ["Financial Modeling", "Excel", "Variance Analysis", "Forecasting"] },
  { id: "P011", title: "Accounting Manager", dept: "Finance", deptId: "D02", grade: "G6", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 85000, salaryMax: 115000, competencies: ["Accounting", "Ledger Mgmt", "Reconciliation", "Audit Support"] },
  { id: "P012", title: "Senior Accountant", dept: "Finance", deptId: "D02", grade: "G5", level: "Senior Staff", filled: 2, planned: 2, status: "Filled", salaryMin: 70000, salaryMax: 95000, competencies: ["Accounting", "Journal Entries", "Reconciliation", "Compliance"] },
  { id: "P013", title: "Accounts Payable Specialist", dept: "Finance", deptId: "D02", grade: "G3", level: "Junior Staff", filled: 2, planned: 3, status: "Open", salaryMin: 45000, salaryMax: 60000, competencies: ["AP", "Invoice Processing", "Vendor Mgmt", "Systems"] },
  { id: "P014", title: "Accounts Receivable Specialist", dept: "Finance", deptId: "D02", grade: "G3", level: "Junior Staff", filled: 2, planned: 3, status: "Open", salaryMin: 45000, salaryMax: 60000, competencies: ["AR", "Collections", "Cash Mgmt", "Customer Service"] },
  { id: "P015", title: "Budget Analyst", dept: "Finance", deptId: "D02", grade: "G4", level: "Analyst", filled: 1, planned: 2, status: "Open", salaryMin: 55000, salaryMax: 80000, competencies: ["Budgeting", "Forecasting", "Variance Analysis", "Cost Control"] },
  { id: "P016", title: "Internal Auditor", dept: "Finance", deptId: "D02", grade: "G5", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 75000, salaryMax: 100000, competencies: ["Audit", "Compliance", "Risk Mgmt", "SOX"] },
  { id: "P017", title: "Tax Specialist", dept: "Finance", deptId: "D02", grade: "G5", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 80000, salaryMax: 110000, competencies: ["Tax", "Compliance", "Planning", "Reporting"] },
  { id: "P018", title: "Treasury Manager", dept: "Finance", deptId: "D02", grade: "G6", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 95000, salaryMax: 130000, competencies: ["Cash Mgmt", "Banking", "Investments", "Risk"] },
  // Human Capital (12 positions)
  { id: "P019", title: "Chief People Officer", dept: "Human Capital", deptId: "D03", grade: "G8", level: "Director", filled: 1, planned: 1, status: "Filled", salaryMin: 150000, salaryMax: 190000, competencies: ["Talent Strategy", "OD", "Employee Relations", "Culture"] },
  { id: "P020", title: "Talent Acquisition Manager", dept: "Human Capital", deptId: "D03", grade: "G6", level: "Manager", filled: 1, planned: 2, status: "Open", salaryMin: 90000, salaryMax: 125000, competencies: ["Recruitment", "Sourcing", "Interviewing", "Employer Brand"] },
  { id: "P021", title: "Senior Recruiter", dept: "Human Capital", deptId: "D03", grade: "G5", level: "Senior Staff", filled: 2, planned: 3, status: "Open", salaryMin: 75000, salaryMax: 105000, competencies: ["Sourcing", "Interviewing", "ATS", "Relationship Mgmt"] },
  { id: "P022", title: "HR Business Partner", dept: "Human Capital", deptId: "D03", grade: "G6", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 85000, salaryMax: 115000, competencies: ["Strategic HR", "Employee Relations", "ER", "Org Dev"] },
  { id: "P023", title: "Compensation & Benefits Manager", dept: "Human Capital", deptId: "D03", grade: "G6", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 88000, salaryMax: 120000, competencies: ["Comp & Benefits", "Market Analysis", "Compliance", "Strategy"] },
  { id: "P024", title: "Learning & Development Manager", dept: "Human Capital", deptId: "D03", grade: "G6", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 82000, salaryMax: 110000, competencies: ["L&D", "Training Design", "Adult Learning", "LMS"] },
  { id: "P025", title: "HR Operations Specialist", dept: "Human Capital", deptId: "D03", grade: "G4", level: "Specialist", filled: 2, planned: 3, status: "Open", salaryMin: 58000, salaryMax: 80000, competencies: ["HRIS", "Admin", "Data Mgmt", "Reporting"] },
  { id: "P026", title: "Onboarding Specialist", dept: "Human Capital", deptId: "D03", grade: "G3", level: "Junior Staff", filled: 2, planned: 2, status: "Filled", salaryMin: 48000, salaryMax: 65000, competencies: ["Onboarding", "Process Design", "Employee Experience", "Systems"] },
  { id: "P027", title: "Recruiter", dept: "Human Capital", deptId: "D03", grade: "G4", level: "Specialist", filled: 1, planned: 2, status: "Open", salaryMin: 62000, salaryMax: 88000, competencies: ["Recruiting", "Sourcing", "Screening", "Client Mgmt"] },
  { id: "P028", title: "HR Coordinator", dept: "Human Capital", deptId: "D03", grade: "G3", level: "Junior Staff", filled: 1, planned: 2, status: "Open", salaryMin: 45000, salaryMax: 62000, competencies: ["HR Admin", "Records Mgmt", "Employee Service", "Organization"] },
  { id: "P029", title: "Talent Development Specialist", dept: "Human Capital", deptId: "D03", grade: "G4", level: "Specialist", filled: 1, planned: 1, status: "Filled", salaryMin: 60000, salaryMax: 82000, competencies: ["Career Dev", "Coaching", "Mentoring", "Assessment"] },
  { id: "P030", title: "Employee Relations Manager", dept: "Human Capital", deptId: "D03", grade: "G5", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 72000, salaryMax: 98000, competencies: ["ER", "Conflict Resolution", "Policy", "Investigations"] },
  // Operations (35 positions - sample 15)
  { id: "P031", title: "VP Operations", dept: "Operations", deptId: "D04", grade: "G8", level: "VP", filled: 1, planned: 1, status: "Filled", salaryMin: 180000, salaryMax: 240000, competencies: ["Strategic Planning", "Vendor Mgmt", "Risk Assessment", "Leadership"] },
  { id: "P032", title: "Operations Manager", dept: "Operations", deptId: "D04", grade: "G6", level: "Manager", filled: 3, planned: 5, status: "Open", salaryMin: 95000, salaryMax: 135000, competencies: ["Process Mgmt", "SLA Management", "Team Leadership", "Continuous Improvement"] },
  { id: "P033", title: "Operations Analyst", dept: "Operations", deptId: "D04", grade: "G4", level: "Analyst", filled: 8, planned: 12, status: "Open", salaryMin: 60000, salaryMax: 85000, competencies: ["Data Analysis", "Reporting", "Process Mapping", "Excel"] },
  { id: "P034", title: "Process Improvement Manager", dept: "Operations", deptId: "D04", grade: "G6", level: "Manager", filled: 2, planned: 2, status: "Filled", salaryMin: 100000, salaryMax: 140000, competencies: ["Process Mgmt", "Lean", "Six Sigma", "Change Mgmt"] },
  { id: "P035", title: "Logistics Coordinator", dept: "Operations", deptId: "D04", grade: "G3", level: "Coordinator", filled: 5, planned: 8, status: "Open", salaryMin: 48000, salaryMax: 68000, competencies: ["Logistics", "Coordination", "Vendor Liaison", "Systems"] },
  { id: "P036", title: "Warehouse Supervisor", dept: "Operations", deptId: "D04", grade: "G5", level: "Supervisor", filled: 4, planned: 6, status: "Open", salaryMin: 68000, salaryMax: 95000, competencies: ["Warehouse Ops", "Inventory", "Safety", "Team Leadership"] },
  { id: "P037", title: "Quality Assurance Manager", dept: "Operations", deptId: "D04", grade: "G6", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 92000, salaryMax: 128000, competencies: ["QA", "SLA Monitoring", "Root Cause Analysis", "Documentation"] },
  { id: "P038", title: "Compliance Officer", dept: "Operations", deptId: "D04", grade: "G5", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 78000, salaryMax: 108000, competencies: ["Compliance", "Audit", "Risk Mgmt", "Regulatory"] },
  { id: "P039", title: "Operations Supervisor", dept: "Operations", deptId: "D04", grade: "G4", level: "Supervisor", filled: 3, planned: 4, status: "Open", salaryMin: 62000, salaryMax: 88000, competencies: ["Supervision", "Operations", "Process Compliance", "Reporting"] },
  { id: "P040", title: "Facilities Manager", dept: "Operations", deptId: "D04", grade: "G5", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 75000, salaryMax: 105000, competencies: ["Facilities", "Maintenance", "Safety", "Vendor Mgmt"] },
  { id: "P041", title: "Business Continuity Planner", dept: "Operations", deptId: "D04", grade: "G5", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 80000, salaryMax: 110000, competencies: ["BCP", "Disaster Recovery", "Risk Mgmt", "Testing"] },
  // Engineering (28 positions - sample 10)
  { id: "P042", title: "VP Engineering", dept: "Engineering", deptId: "D05", grade: "G8", level: "VP", filled: 1, planned: 1, status: "Filled", salaryMin: 200000, salaryMax: 270000, competencies: ["Architecture", "Team Leadership", "Technical Vision", "Innovation"] },
  { id: "P043", title: "Engineering Manager", dept: "Engineering", deptId: "D05", grade: "G7", level: "Manager", filled: 3, planned: 4, status: "Open", salaryMin: 140000, salaryMax: 180000, competencies: ["Team Leadership", "Project Mgmt", "Technical", "Agile"] },
  { id: "P044", title: "Senior Software Engineer", dept: "Engineering", deptId: "D05", grade: "G6", level: "Senior Staff", filled: 6, planned: 10, status: "Open", salaryMin: 110000, salaryMax: 155000, competencies: ["Full-stack", "Architecture", "DevOps", "Mentoring"] },
  { id: "P045", title: "Software Engineer", dept: "Engineering", deptId: "D05", grade: "G5", level: "Staff", filled: 10, planned: 15, status: "Open", salaryMin: 85000, salaryMax: 120000, competencies: ["JavaScript", "Python", "React", "APIs"] },
  { id: "P046", title: "DevOps Engineer", dept: "Engineering", deptId: "D05", grade: "G6", level: "Senior Staff", filled: 3, planned: 4, status: "Open", salaryMin: 105000, salaryMax: 145000, competencies: ["CI/CD", "Cloud", "Infrastructure", "Automation"] },
  { id: "P047", title: "Solutions Architect", dept: "Engineering", deptId: "D05", grade: "G7", level: "Manager", filled: 2, planned: 2, status: "Filled", salaryMin: 130000, salaryMax: 170000, competencies: ["Architecture", "Design", "Technical Sales", "Leadership"] },
  { id: "P048", title: "QA Engineer", dept: "Engineering", deptId: "D05", grade: "G5", level: "Staff", filled: 2, planned: 3, status: "Open", salaryMin: 75000, salaryMax: 105000, competencies: ["QA", "Automation", "Testing", "Defect Analysis"] },
  { id: "P049", title: "Tech Lead", dept: "Engineering", deptId: "D05", grade: "G7", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 125000, salaryMax: 160000, competencies: ["Leadership", "Architecture", "Technical", "Mentoring"] },
  // IT & Digital (22 positions - sample 8)
  { id: "P050", title: "VP IT & Digital", dept: "IT & Digital", deptId: "D06", grade: "G8", level: "VP", filled: 1, planned: 1, status: "Filled", salaryMin: 190000, salaryMax: 260000, competencies: ["IT Strategy", "Digital Transformation", "Governance", "Leadership"] },
  { id: "P051", title: "IT Manager", dept: "IT & Digital", deptId: "D06", grade: "G6", level: "Manager", filled: 2, planned: 3, status: "Open", salaryMin: 100000, salaryMax: 140000, competencies: ["IT Operations", "Team Leadership", "Infrastructure", "Support"] },
  { id: "P052", title: "Systems Administrator", dept: "IT & Digital", deptId: "D06", grade: "G4", level: "Specialist", filled: 5, planned: 7, status: "Open", salaryMin: 65000, salaryMax: 92000, competencies: ["Systems Admin", "Networks", "Security", "Troubleshooting"] },
  { id: "P053", title: "Security Engineer", dept: "IT & Digital", deptId: "D06", grade: "G6", level: "Senior Staff", filled: 2, planned: 3, status: "Open", salaryMin: 110000, salaryMax: 155000, competencies: ["Cybersecurity", "Network Security", "Compliance", "Incident Response"] },
  { id: "P054", title: "Digital Transformation Lead", dept: "IT & Digital", deptId: "D06", grade: "G6", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 105000, salaryMax: 150000, competencies: ["Digital Strategy", "Change Mgmt", "Project Mgmt", "Technology"] },
  { id: "P055", title: "Help Desk Analyst", dept: "IT & Digital", deptId: "D06", grade: "G3", level: "Junior Staff", filled: 8, planned: 12, status: "Open", salaryMin: 45000, salaryMax: 65000, competencies: ["IT Support", "Troubleshooting", "Customer Service", "Systems"] },
  { id: "P056", title: "Business Analyst - IT", dept: "IT & Digital", deptId: "D06", grade: "G5", level: "Analyst", filled: 1, planned: 2, status: "Open", salaryMin: 80000, salaryMax: 112000, competencies: ["Business Analysis", "Requirements", "Process Mapping", "IT"] },
  { id: "P057", title: "IT Project Manager", dept: "IT & Digital", deptId: "D06", grade: "G6", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 95000, salaryMax: 135000, competencies: ["Project Mgmt", "IT", "Vendor Mgmt", "Leadership"] },
  // Sales & Marketing (20 positions - sample 8)
  { id: "P058", title: "VP Sales & Marketing", dept: "Sales & Marketing", deptId: "D07", grade: "G8", level: "VP", filled: 1, planned: 1, status: "Filled", salaryMin: 170000, salaryMax: 240000, competencies: ["Sales Strategy", "Marketing", "Revenue Growth", "Leadership"] },
  { id: "P059", title: "Sales Manager", dept: "Sales & Marketing", deptId: "D07", grade: "G6", level: "Manager", filled: 2, planned: 3, status: "Open", salaryMin: 95000, salaryMax: 135000, competencies: ["Sales Mgmt", "Account Mgmt", "Team Leadership", "Pipeline"] },
  { id: "P060", title: "Account Executive", dept: "Sales & Marketing", deptId: "D07", grade: "G5", level: "Staff", filled: 6, planned: 10, status: "Open", salaryMin: 80000, salaryMax: 125000, competencies: ["Sales", "Account Mgmt", "Negotiation", "Closing"] },
  { id: "P061", title: "Marketing Manager", dept: "Sales & Marketing", deptId: "D07", grade: "G6", level: "Manager", filled: 2, planned: 2, status: "Filled", salaryMin: 92000, salaryMax: 128000, competencies: ["Marketing", "Campaign Mgmt", "Branding", "Analytics"] },
  { id: "P062", title: "Digital Marketing Specialist", dept: "Sales & Marketing", deptId: "D07", grade: "G4", level: "Specialist", filled: 3, planned: 4, status: "Open", salaryMin: 68000, salaryMax: 95000, competencies: ["Digital Marketing", "SEO/SEM", "Social Media", "Analytics"] },
  { id: "P063", title: "Brand Manager", dept: "Sales & Marketing", deptId: "D07", grade: "G5", level: "Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 82000, salaryMax: 115000, competencies: ["Brand Management", "Strategy", "Design", "Communications"] },
  { id: "P064", title: "Sales Development Representative", dept: "Sales & Marketing", deptId: "D07", grade: "G3", level: "Junior Staff", filled: 4, planned: 5, status: "Open", salaryMin: 50000, salaryMax: 72000, competencies: ["Sales", "Prospecting", "CRM", "Communication"] },
  { id: "P065", title: "Customer Success Manager", dept: "Sales & Marketing", deptId: "D07", grade: "G5", level: "Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 78000, salaryMax: 110000, competencies: ["Account Mgmt", "Customer Success", "Retention", "Growth"] },
  // Procurement (15 positions - sample 7)
  { id: "P066", title: "Procurement Director", dept: "Procurement", deptId: "D08", grade: "G7", level: "Director", filled: 1, planned: 1, status: "Filled", salaryMin: 130000, salaryMax: 180000, competencies: ["Procurement Strategy", "Vendor Mgmt", "Cost Reduction", "Negotiation"] },
  { id: "P067", title: "Procurement Manager", dept: "Procurement", deptId: "D08", grade: "G6", level: "Manager", filled: 2, planned: 3, status: "Open", salaryMin: 95000, salaryMax: 130000, competencies: ["Procurement", "Sourcing", "Vendor Mgmt", "Contract Mgmt"] },
  { id: "P068", title: "Procurement Specialist", dept: "Procurement", deptId: "D08", grade: "G4", level: "Specialist", filled: 5, planned: 7, status: "Open", salaryMin: 62000, salaryMax: 88000, competencies: ["Procurement", "RFP/RFQ", "Negotiation", "Systems"] },
  { id: "P069", title: "Sourcing Specialist", dept: "Procurement", deptId: "D08", grade: "G4", level: "Specialist", filled: 3, planned: 4, status: "Open", salaryMin: 65000, salaryMax: 92000, competencies: ["Sourcing", "Market Analysis", "Vendor Eval", "Negotiation"] },
  { id: "P070", title: "Contracts Administrator", dept: "Procurement", deptId: "D08", grade: "G3", level: "Coordinator", filled: 2, planned: 2, status: "Filled", salaryMin: 50000, salaryMax: 70000, competencies: ["Contract Mgmt", "Document Mgmt", "Compliance", "Admin"] },
  { id: "P071", title: "Procurement Analyst", dept: "Procurement", deptId: "D08", grade: "G4", level: "Analyst", filled: 1, planned: 2, status: "Open", salaryMin: 58000, salaryMax: 82000, competencies: ["Spend Analysis", "Data Analysis", "Reporting", "Systems"] },
  { id: "P072", title: "Vendor Manager", dept: "Procurement", deptId: "D08", grade: "G5", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 78000, salaryMax: 108000, competencies: ["Vendor Mgmt", "Performance Mgmt", "Negotiations", "Relationships"] },
  // Legal & Compliance (10 positions)
  { id: "P073", title: "General Counsel", dept: "Legal & Compliance", deptId: "D09", grade: "G8", level: "Director", filled: 1, planned: 1, status: "Filled", salaryMin: 160000, salaryMax: 220000, competencies: ["Legal", "Compliance", "Governance", "Risk Mgmt"] },
  { id: "P074", title: "Compliance Manager", dept: "Legal & Compliance", deptId: "D09", grade: "G6", level: "Manager", filled: 2, planned: 2, status: "Filled", salaryMin: 100000, salaryMax: 140000, competencies: ["Compliance", "Audit", "Risk Mgmt", "Regulatory"] },
  { id: "P075", title: "Legal Counsel", dept: "Legal & Compliance", deptId: "D09", grade: "G6", level: "Senior Staff", filled: 2, planned: 2, status: "Filled", salaryMin: 105000, salaryMax: 145000, competencies: ["Legal", "Contracts", "Negotiation", "Advisory"] },
  { id: "P076", title: "Regulatory Affairs Specialist", dept: "Legal & Compliance", deptId: "D09", grade: "G4", level: "Specialist", filled: 1, planned: 2, status: "Open", salaryMin: 70000, salaryMax: 98000, competencies: ["Regulatory", "Compliance", "Reporting", "Documentation"] },
  { id: "P077", title: "Compliance Analyst", dept: "Legal & Compliance", deptId: "D09", grade: "G4", level: "Analyst", filled: 1, planned: 2, status: "Open", salaryMin: 62000, salaryMax: 88000, competencies: ["Compliance", "Monitoring", "Testing", "Documentation"] },
  { id: "P078", title: "Data Protection Officer", dept: "Legal & Compliance", deptId: "D09", grade: "G5", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 95000, salaryMax: 135000, competencies: ["Data Privacy", "GDPR/CCPA", "Risk Mgmt", "Compliance"] },
  { id: "P079", title: "Contract Manager", dept: "Legal & Compliance", deptId: "D09", grade: "G5", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 85000, salaryMax: 120000, competencies: ["Contract Mgmt", "Negotiation", "Legal", "Risk"] },
  { id: "P080", title: "Legal Coordinator", dept: "Legal & Compliance", deptId: "D09", grade: "G3", level: "Junior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 48000, salaryMax: 68000, competencies: ["Legal Admin", "Document Mgmt", "Support", "Organization"] },
  // Supply Chain (25 positions - sample 8)
  { id: "P081", title: "VP Supply Chain", dept: "Supply Chain", deptId: "D10", grade: "G8", level: "VP", filled: 1, planned: 1, status: "Filled", salaryMin: 175000, salaryMax: 245000, competencies: ["Supply Chain", "Network Design", "Planning", "Leadership"] },
  { id: "P082", title: "Demand Planning Manager", dept: "Supply Chain", deptId: "D10", grade: "G6", level: "Manager", filled: 1, planned: 2, status: "Open", salaryMin: 100000, salaryMax: 140000, competencies: ["Demand Planning", "Forecasting", "Analytics", "Systems"] },
  { id: "P083", title: "Supply Chain Analyst", dept: "Supply Chain", deptId: "D10", grade: "G4", level: "Analyst", filled: 5, planned: 8, status: "Open", salaryMin: 68000, salaryMax: 95000, competencies: ["Supply Chain", "Analytics", "Optimization", "Systems"] },
  { id: "P084", title: "Inventory Manager", dept: "Supply Chain", deptId: "D10", grade: "G6", level: "Manager", filled: 2, planned: 3, status: "Open", salaryMin: 95000, salaryMax: 135000, competencies: ["Inventory Mgmt", "Planning", "Optimization", "Control"] },
  { id: "P085", title: "Transportation Manager", dept: "Supply Chain", deptId: "D10", grade: "G6", level: "Manager", filled: 2, planned: 2, status: "Filled", salaryMin: 98000, salaryMax: 138000, competencies: ["Transportation", "Logistics", "Cost Mgmt", "Vendor Mgmt"] },
  { id: "P086", title: "Logistics Coordinator", dept: "Supply Chain", deptId: "D10", grade: "G3", level: "Coordinator", filled: 8, planned: 12, status: "Open", salaryMin: 48000, salaryMax: 68000, competencies: ["Logistics", "Planning", "Systems", "Coordination"] },
  { id: "P087", title: "Warehouse Manager", dept: "Supply Chain", deptId: "D10", grade: "G5", level: "Manager", filled: 3, planned: 4, status: "Open", salaryMin: 78000, salaryMax: 110000, competencies: ["Warehouse Mgmt", "Inventory", "Safety", "Operations"] },
  { id: "P088", title: "Network Planner", dept: "Supply Chain", deptId: "D10", grade: "G5", level: "Senior Staff", filled: 1, planned: 1, status: "Filled", salaryMin: 88000, salaryMax: 125000, competencies: ["Network Design", "Optimization", "Analytics", "Planning"] },
  // Customer Service (45 positions - sample 10)
  { id: "P089", title: "VP Customer Service", dept: "Customer Service", deptId: "D11", grade: "G8", level: "VP", filled: 1, planned: 1, status: "Filled", salaryMin: 165000, salaryMax: 230000, competencies: ["Customer Service", "Operations", "Team Leadership", "Strategy"] },
  { id: "P090", title: "Customer Service Manager", dept: "Customer Service", deptId: "D11", grade: "G6", level: "Manager", filled: 4, planned: 6, status: "Open", salaryMin: 88000, salaryMax: 125000, competencies: ["Customer Service", "Team Leadership", "Coaching", "Performance"] },
  { id: "P091", title: "Senior Customer Service Representative", dept: "Customer Service", deptId: "D11", grade: "G4", level: "Senior Staff", filled: 8, planned: 12, status: "Open", salaryMin: 65000, salaryMax: 90000, competencies: ["Customer Service", "Problem Solving", "Communication", "Systems"] },
  { id: "P092", title: "Customer Service Representative", dept: "Customer Service", deptId: "D11", grade: "G2", level: "Staff", filled: 25, planned: 35, status: "Open", salaryMin: 42000, salaryMax: 60000, competencies: ["Customer Service", "Communication", "Systems", "Patience"] },
  { id: "P093", title: "Customer Support Specialist", dept: "Customer Service", deptId: "D11", grade: "G3", level: "Specialist", filled: 3, planned: 3, status: "Filled", salaryMin: 50000, salaryMax: 72000, competencies: ["Technical Support", "Troubleshooting", "Documentation", "Training"] },
  { id: "P094", title: "Quality Assurance Analyst - CS", dept: "Customer Service", deptId: "D11", grade: "G4", level: "Analyst", filled: 2, planned: 2, status: "Filled", salaryMin: 60000, salaryMax: 85000, competencies: ["QA", "Coaching", "Training", "Metrics"] },
  { id: "P095", title: "Customer Experience Manager", dept: "Customer Service", deptId: "D11", grade: "G5", level: "Manager", filled: 1, planned: 1, status: "Filled", salaryMin: 82000, salaryMax: 115000, competencies: ["CX", "Process Design", "Analytics", "Improvement"] },
  { id: "P096", title: "Knowledge Management Specialist", dept: "Customer Service", deptId: "D11", grade: "G4", level: "Specialist", filled: 1, planned: 1, status: "Filled", salaryMin: 62000, salaryMax: 88000, competencies: ["Knowledge Mgmt", "Documentation", "Training", "Systems"] },
  // Strategy & Transformation (8 positions)
  { id: "P097", title: "Chief Strategy Officer", dept: "Strategy & Transformation", deptId: "D12", grade: "G8", level: "Director", filled: 1, planned: 1, status: "Filled", salaryMin: 185000, salaryMax: 255000, competencies: ["Strategy", "M&A", "Transformation", "Business Dev"] },
  { id: "P098", title: "Transformation Director", dept: "Strategy & Transformation", deptId: "D12", grade: "G7", level: "Director", filled: 1, planned: 1, status: "Filled", salaryMin: 135000, salaryMax: 185000, competencies: ["Transformation", "Change Mgmt", "Project Mgmt", "Leadership"] },
  { id: "P099", title: "Strategy Consultant", dept: "Strategy & Transformation", deptId: "D12", grade: "G5", level: "Consultant", filled: 2, planned: 3, status: "Open", salaryMin: 95000, salaryMax: 135000, competencies: ["Strategy", "Analysis", "Consulting", "Presentation"] },
  { id: "P100", title: "Business Analyst - Strategy", dept: "Strategy & Transformation", deptId: "D12", grade: "G4", level: "Analyst", filled: 1, planned: 2, status: "Open", salaryMin: 72000, salaryMax: 102000, competencies: ["Business Analysis", "Strategy", "Analytics", "Communication"] },
  { id: "P101", title: "Change Management Specialist", dept: "Strategy & Transformation", deptId: "D12", grade: "G5", level: "Specialist", filled: 1, planned: 1, status: "Filled", salaryMin: 85000, salaryMax: 120000, competencies: ["Change Mgmt", "Communication", "Training", "Stakeholder Mgmt"] },
  { id: "P102", title: "Organizational Design Specialist", dept: "Strategy & Transformation", deptId: "D12", grade: "G5", level: "Specialist", filled: 1, planned: 1, status: "Filled", salaryMin: 82000, salaryMax: 115000, competencies: ["Org Design", "Structure", "Alignment", "HR"] },
];

// ---------------------------------------------------------------------
// VACANCIES
// ---------------------------------------------------------------------
export const vacancies = [
  { id: "V001", positionId: "P001", title: "Software Engineer",        position: "Software Engineer",        dept: "Technology", grade: "G5", openDate: "2026-03-27", datePosted: "2026-03-27", daysOpen: 32, urgency: "High",     priority: "High",     seniority: "Mid-level", hiringManager: "Indah Permata",  recruiter: "Hana Setiawan",    stage: "Interview",   status: "Interview",  candidates: 4, reason: "Growth",      approvedBy: "Rini Wulandari",   targetDate: "2026-05-15" },
  { id: "V002", positionId: "P004", title: "Data Scientist",           position: "Data Scientist",           dept: "Technology", grade: "G6", openDate: "2026-04-10", datePosted: "2026-04-10", daysOpen: 18, urgency: "Critical", priority: "Critical", seniority: "Senior",    hiringManager: "Rini Wulandari", recruiter: "Hana Setiawan",    stage: "Assessment",  status: "Assessment", candidates: 3, reason: "Strategic",   approvedBy: "Hendra Saputra",   targetDate: "2026-05-25" },
  { id: "V003", positionId: "P006", title: "Operations Manager",       position: "Operations Manager",       dept: "Operations", grade: "G6", openDate: "2026-04-03", datePosted: "2026-04-03", daysOpen: 25, urgency: "High",     priority: "High",     seniority: "Manager",   hiringManager: "Sari Indah",     recruiter: "Hana Setiawan",    stage: "Offer Stage", status: "Offer Stage",candidates: 2, reason: "Replacement", approvedBy: "Citra Dewi",       targetDate: "2026-05-30" },
  { id: "V004", positionId: "P003", title: "Senior Software Engineer", position: "Senior Software Engineer", dept: "Technology", grade: "G6", openDate: "2026-02-15", datePosted: "2026-02-15", daysOpen: 72, urgency: "Critical", priority: "Critical", seniority: "Senior",    hiringManager: "Rini Wulandari", recruiter: "Hana Setiawan",    stage: "Interview",   status: "Interview",  candidates: 5, reason: "Growth",      approvedBy: "Hendra Saputra",   targetDate: "2026-05-10" },
  { id: "V005", positionId: "P007", title: "Operations Analyst",       position: "Operations Analyst",       dept: "Operations", grade: "G4", openDate: "2026-04-14", datePosted: "2026-04-14", daysOpen: 14, urgency: "Medium",   priority: "Medium",   seniority: "Junior",    hiringManager: "Bambang Kusuma", recruiter: "Hana Setiawan",    stage: "Screening",   status: "Screening",  candidates: 7, reason: "Growth",      approvedBy: "Sari Indah",       targetDate: "2026-06-15" },
  { id: "V006", positionId: "P012", title: "Financial Analyst",        position: "Financial Analyst",        dept: "Finance",    grade: "G4", openDate: "2026-04-08", datePosted: "2026-04-08", daysOpen: 20, urgency: "Medium",   priority: "Medium",   seniority: "Junior",    hiringManager: "Andi Wijaya",    recruiter: "Hana Setiawan",    stage: "Interview",   status: "Interview",  candidates: 5, reason: "Growth",      approvedBy: "Sri Mulyani",      targetDate: "2026-06-08" },
  { id: "V007", positionId: "P014", title: "Senior Recruiter",         position: "Senior Recruiter",         dept: "Human Resources", grade: "G5", openDate: "2026-04-22", datePosted: "2026-04-22", daysOpen: 6, urgency: "Low",      priority: "Low",      seniority: "Mid-level", hiringManager: "Lestari Putri",  recruiter: "Citra Dewi",       stage: "Job Posting", status: "Job Posting",candidates: 1, reason: "Growth",      approvedBy: "Lestari Putri",    targetDate: "2026-06-22" },
];

// ---------------------------------------------------------------------
// RECRUITMENT PIPELINES
// ---------------------------------------------------------------------
export const recruitmentPipelines = [
  { id: "R001", position: "Software Engineer",        stage: "Offer Stage", candidates: 1, avgTimeToHire: 45, conversionRate: 65 },
  { id: "R002", position: "Data Scientist",           stage: "Assessment",  candidates: 3, avgTimeToHire: 52, conversionRate: 58 },
  { id: "R003", position: "Operations Manager",       stage: "Interview",   candidates: 2, avgTimeToHire: 38, conversionRate: 72 },
  { id: "R004", position: "Senior Software Engineer", stage: "Interview",   candidates: 5, avgTimeToHire: 65, conversionRate: 48 },
  { id: "R005", position: "Operations Analyst",       stage: "Screening",   candidates: 7, avgTimeToHire: 30, conversionRate: 78 },
  { id: "R006", position: "Brand Manager",            stage: "Job Posting", candidates: 0, avgTimeToHire: 0,  conversionRate: 0  },
  { id: "R007", position: "Procurement Officer",      stage: "Interview",   candidates: 4, avgTimeToHire: 28, conversionRate: 75 },
];

// ---------------------------------------------------------------------
// KPI LIST — full enterprise KPI catalog (used by BPM module & insights)
// ---------------------------------------------------------------------
export const kpiList = [
  { id: "K001", name: "Workforce Coverage",     category: "Workforce",  unit: "%",  target: 95, actual: 88, current: 88, status: "At Risk",  trend: "Down", change: -2.4, owner: "Lestari Putri" },
  { id: "K002", name: "Budget Utilization",     category: "Financial",  unit: "%",  target: 95, actual: 96, current: 96, status: "On Track", trend: "Up",   change: 1.2,  owner: "Sri Mulyani"   },
  { id: "K003", name: "Avg Time to Hire",       category: "Recruitment",unit: "d",  target: 30, actual: 45, current: 45, status: "Critical", trend: "Up",   change: 12.5, owner: "Hana Setiawan" },
  { id: "K004", name: "Process Efficiency",     category: "Operations", unit: "%",  target: 85, actual: 82, current: 82, status: "At Risk",  trend: "Up",   change: 3.1,  owner: "Sari Indah"    },
  { id: "K005", name: "Audit Compliance",       category: "Governance", unit: "%",  target: 100, actual: 98, current: 98, status: "On Track", trend: "Up",   change: 0.5,  owner: "Fitri Handayani" },
  { id: "K006", name: "Employee Satisfaction",  category: "Workforce",  unit: "/10",target: 8,  actual: 7.6, current: 7.6, status: "At Risk",  trend: "Down", change: -0.3, owner: "Lestari Putri" },
  { id: "K007", name: "Cost per Hire",          category: "Recruitment",unit: "Rp", target: 75000000,actual: 92000000,current: 92000000,status: "Critical", trend: "Up",   change: 18.0, owner: "Hana Setiawan" },
  { id: "K008", name: "Retention Rate",         category: "Workforce",  unit: "%",  target: 90, actual: 87, current: 87, status: "At Risk",  trend: "Down", change: -1.8, owner: "Lestari Putri" },
];

// ---------------------------------------------------------------------
// KPI DATA — dashboard top-strip summary (object-keyed for KpiStrip & KPI Drilldown)
// Each key matches the kpiConfig in components/oms/kpi-strip.tsx.
// ---------------------------------------------------------------------
export const kpiData = {
  headcount:   { value: 68,    target: 70,    status: "good",     trend: "+2.9%", prefix: "",  unit: ""   },
  positions:   { value: 84,    target: 90,    status: "warning",  trend: "+1.2%", prefix: "",  unit: ""   },
  vacancy:     { value: 16,    target: 8,     status: "critical", trend: "+5.0%", prefix: "",  unit: ""   },
  hcGap:       { value: 312,   target: 150,   status: "critical", trend: "-3.4%", prefix: "",  unit: ""   },
  utilization: { value: 84,    target: 85,    status: "warning",  trend: "+1.8%", prefix: "",  unit: "%"  },
  cost:        { value: 24.8,  target: 26,    status: "good",     trend: "-2.1%", prefix: "Rp ", unit: "Miliar"  },
  kpiScore:    { value: 78,    target: 85,    status: "warning",  trend: "+4.2%", prefix: "",  unit: "%"  },
} as const;

// ---------------------------------------------------------------------
// MONTHLY TREND
// ---------------------------------------------------------------------
export const monthlyTrend = [
  { month: "Jan", hcActual: 522, hcPlan: 536, costActual: 23200000000, costPlan: 23800000000, hires: 9, departures: 6 },
  { month: "Feb", hcActual: 528, hcPlan: 540, costActual: 23600000000, costPlan: 24000000000, hires: 11, departures: 5 },
  { month: "Mar", hcActual: 534, hcPlan: 546, costActual: 24100000000, costPlan: 24300000000, hires: 10, departures: 4 },
  { month: "Apr", hcActual: 539, hcPlan: 550, costActual: 24800000000, costPlan: 24700000000, hires: 12, departures: 7 },
  { month: "May", hcActual: 544, hcPlan: 556, costActual: 25100000000, costPlan: 25200000000, hires: 8, departures: 6 },
  { month: "Jun", hcActual: 548, hcPlan: 560, costActual: 25400000000, costPlan: 25700000000, hires: 9, departures: 5 },
];

// ---------------------------------------------------------------------
// HEADCOUNT BY DEPARTMENT (gap analysis)
// ---------------------------------------------------------------------
export const hcGapByDept = [
  { dept: "Technology",      deptId: "D01", current: 12, planned: 15, gap: 3, fillRate: 80, risk: "Critical" },
  { dept: "Operations",      deptId: "D04", current: 10, planned: 12, gap: 2, fillRate: 83, risk: "High"     },
  { dept: "Finance",         deptId: "D03", current: 8,  planned: 8,  gap: 0, fillRate: 100,risk: "Low"      },
  { dept: "Human Resources", deptId: "D02", current: 5,  planned: 6,  gap: 1, fillRate: 83, risk: "Medium"   },
  { dept: "Marketing",       deptId: "D05", current: 6,  planned: 7,  gap: 1, fillRate: 86, risk: "Medium"   },
  { dept: "Legal",           deptId: "D06", current: 4,  planned: 4,  gap: 0, fillRate: 100,risk: "Low"      },
  { dept: "Procurement",     deptId: "D07", current: 5,  planned: 6,  gap: 1, fillRate: 83, risk: "Medium"   },
  { dept: "Strategy",        deptId: "D08", current: 3,  planned: 4,  gap: 1, fillRate: 75, risk: "Medium"   },
];

// ---------------------------------------------------------------------
// CRITICAL ALERTS
// ---------------------------------------------------------------------
export const criticalAlerts = [
  { id: "A001", severity: "Critical", title: "Recruitment SLA Breach",     message: "Avg Time to Hire 45d > target 30d",    timestamp: "2026-04-28 09:00", module: "Recruitment", actionRequired: true,  type: "sla" },
  { id: "A002", severity: "High",     title: "Budget Variance",            message: "Operations exceeded budget by 5.5%",    timestamp: "2026-04-28 08:30", module: "Financial",   actionRequired: true,  type: "budget" },
  { id: "A003", severity: "High",     title: "Process Bottleneck Detected",message: "Procurement Process delayed 2.1d avg", timestamp: "2026-04-27 16:15", module: "Process",     actionRequired: true,  type: "process" },
  { id: "A004", severity: "Medium",   title: "Headcount Gap",              message: "Technology dept has 3 open positions",  timestamp: "2026-04-27 14:00", module: "Workforce",   actionRequired: false, type: "headcount" },
];

// ---------------------------------------------------------------------
// AI RECOMMENDATIONS
// ---------------------------------------------------------------------
export const aiRecommendations = [
  { id: "AI001", title: "Optimize Recruitment Pipeline",   confidence: 92, impact: "High",     savings: 145000000, action: "Streamline candidate screening with AI tools", category: "Process",  description: "Reduce avg time to hire from 45d to 32d by automating screening and scheduling.", priority: "High" },
  { id: "AI002", title: "Reallocate Marketing Budget",     confidence: 86, impact: "Medium",   savings: 85000000,  action: "Shift 15% from print to digital channels",     category: "Financial",description: "Digital channels show 38% higher ROI based on Q1 2026 data.",                  priority: "Medium" },
  { id: "AI003", title: "Automate Approval Workflow",      confidence: 89, impact: "High",     savings: 120000000, action: "Auto-approve requests below Rp 150 Juta threshold",   category: "Process",  description: "Will reduce manager workload by 12 hours/week.",                                priority: "High" },
  { id: "AI004", title: "Cross-train Operations Team",     confidence: 78, impact: "Medium",   savings: 65000000,  action: "Train 4 ops analysts on procurement systems",  category: "Workforce",description: "Reduce vendor delays by 25% through faster issue resolution.",                  priority: "Medium" },
];

// ---------------------------------------------------------------------
// WORKFORCE RISK
// ---------------------------------------------------------------------
export const workforceRisk = [
  { id: "WR001", category: "Attrition Risk",      level: "High",     score: 72, employees: 8,  description: "8 high-performers showing flight risk indicators",   action: "Conduct retention interviews" },
  { id: "WR002", category: "Skills Gap",          level: "Critical", score: 88, employees: 12, description: "Data science capacity below demand by 40%",          action: "Initiate hiring + reskilling program" },
  { id: "WR003", category: "Overload Risk",       level: "Medium",   score: 58, employees: 6,  description: "6 employees consistently working >50hrs/week",       action: "Redistribute workload" },
  { id: "WR004", category: "Single Point Failure",level: "High",     score: 76, employees: 3,  description: "3 critical roles with no documented backup",         action: "Cross-train designated backups" },
];

// ---------------------------------------------------------------------
// HEADCOUNT PLAN
// ---------------------------------------------------------------------
export const headcountPlan = [
  { id: "HCP-D01", dept: "Technology",       deptId: "D01", q1Plan: 13, q1Actual: 12, q2Plan: 15, q2Actual: 12, q3Plan: 16, q4Plan: 17, approved: false, trend: "Growing", notes: "Hiring 5 engineers"   },
  { id: "HCP-D04", dept: "Operations",       deptId: "D04", q1Plan: 11, q1Actual: 10, q2Plan: 12, q2Actual: 10, q3Plan: 13, q4Plan: 14, approved: false, trend: "Growing", notes: "Expanding production" },
  { id: "HCP-D03", dept: "Finance",          deptId: "D03", q1Plan: 8,  q1Actual: 8,  q2Plan: 8,  q2Actual: 8,  q3Plan: 9,  q4Plan: 9,  approved: true,  trend: "Stable",  notes: "Steady state"         },
  { id: "HCP-D02", dept: "Human Resources",  deptId: "D02", q1Plan: 5,  q1Actual: 5,  q2Plan: 6,  q2Actual: 5,  q3Plan: 6,  q4Plan: 6,  approved: true,  trend: "Stable",  notes: "+1 recruiter"         },
  { id: "HCP-D05", dept: "Marketing",        deptId: "D05", q1Plan: 6,  q1Actual: 6,  q2Plan: 7,  q2Actual: 6,  q3Plan: 7,  q4Plan: 8,  approved: false, trend: "Growing", notes: "Brand expansion"      },
  { id: "HCP-D07", dept: "Procurement",      deptId: "D07", q1Plan: 5,  q1Actual: 5,  q2Plan: 6,  q2Actual: 5,  q3Plan: 6,  q4Plan: 6,  approved: true,  trend: "Stable",  notes: "Steady state"         },
];

// ---------------------------------------------------------------------
// GAP ANALYSIS
// ---------------------------------------------------------------------
export const gapAnalysis = [
  { id: "G001", dept: "Technology",      current: 12, planned: 15, gap: 3, gapCost: 285000, riskLevel: "Critical", impactScore: 92 },
  { id: "G002", dept: "Operations",      current: 10, planned: 12, gap: 2, gapCost: 195000, riskLevel: "High",     impactScore: 78 },
  { id: "G003", dept: "Marketing",       current: 6,  planned: 7,  gap: 1, gapCost: 95000,  riskLevel: "Medium",   impactScore: 55 },
  { id: "G004", dept: "Procurement",     current: 5,  planned: 6,  gap: 1, gapCost: 85000,  riskLevel: "Medium",   impactScore: 48 },
  { id: "G005", dept: "Human Resources", current: 5,  planned: 6,  gap: 1, gapCost: 92000,  riskLevel: "Low",      impactScore: 32 },
  { id: "G006", dept: "Finance",         current: 8,  planned: 8,  gap: 0, gapCost: 0,      riskLevel: "Low",      impactScore: 12 },
];

// ---------------------------------------------------------------------
// PROCESSES (legacy lightweight summary)
// ---------------------------------------------------------------------
export const processes = [
  { id: "P001", name: "Hiring",             owner: "Lestari Putri",   status: "Active", efficiency: 78, sla: 45, actualTime: 48, bottleneck: true,  category: "Talent" },
  { id: "P002", name: "Onboarding",         owner: "Citra Dewi",      status: "Active", efficiency: 65, sla: 15, actualTime: 14, bottleneck: false, category: "Talent" },
  { id: "P003", name: "Performance Review", owner: "Lestari Putri",   status: "Active", efficiency: 88, sla: 120,actualTime: 125,bottleneck: true,  category: "Talent" },
  { id: "P004", name: "Procurement",        owner: "Irfan Halim",     status: "Active", efficiency: 72, sla: 20, actualTime: 22, bottleneck: true,  category: "Operations" },
  { id: "P005", name: "Approval Workflow",  owner: "Sri Mulyani",     status: "Active", efficiency: 92, sla: 5,  actualTime: 4,  bottleneck: false, category: "Governance" },
];

// ---------------------------------------------------------------------
// PROCESS HEALTH (dashboard widget)
// ---------------------------------------------------------------------
export const processHealth = [
  { process: "Strategy Definition",   health: 92, target: 90 },
  { process: "Procurement",           health: 78, target: 85 },
  { process: "Operations Execution",  health: 88, target: 85 },
  { process: "Recruitment",           health: 72, target: 85 },
  { process: "Approval Workflow",     health: 95, target: 90 },
  { process: "Quality Assurance",     health: 86, target: 90 },
];

// ---------------------------------------------------------------------
// ACTIVITIES — used by activity log/tracking
// ---------------------------------------------------------------------
export const activities = [
  { id: "ACT_LOG001", action: "Headcount Plan Updated",     user: "Sri Mulyani",   status: "Completed",       priority: "High",     timestamp: "2026-04-28 09:14", module: "Workforce Planning" },
  { id: "ACT_LOG002", action: "Position Approval Submitted",user: "Lestari Putri", status: "Pending Approval",priority: "Medium",   timestamp: "2026-04-28 10:22", module: "Organization" },
  { id: "ACT_LOG003", action: "Vacancy V001 Published",     user: "Hana Setiawan", status: "Sent",            priority: "High",     timestamp: "2026-04-28 11:45", module: "Recruitment" },
  { id: "ACT_LOG004", action: "Budget Adjustment Approved", user: "Maya Sari",     status: "Completed",       priority: "Critical", timestamp: "2026-04-27 16:30", module: "Financial" },
  { id: "ACT_LOG005", action: "Process Map Edited",         user: "Sari Indah",    status: "In Progress",     priority: "Medium",   timestamp: "2026-04-27 14:20", module: "Process Health" },
  { id: "ACT_LOG006", action: "Audit Report Exported",      user: "Fitri Handayani",status: "Completed",      priority: "Low",      timestamp: "2026-04-27 11:10", module: "Governance" },
];

// ---------------------------------------------------------------------
// WORKLOAD DATA
// ---------------------------------------------------------------------
export const workloadData = [
  { activity: "Candidate Screening",     assignee: "Hana Setiawan",    hoursAllocated: 15, hoursUsed: 12, status: "On Track"  },
  { activity: "Onboarding Setup",        assignee: "Citra Dewi",       hoursAllocated: 8,  hoursUsed: 7,  status: "On Track"  },
  { activity: "Vendor Negotiation",      assignee: "Irfan Halim",      hoursAllocated: 20, hoursUsed: 24, status: "Over Budget" },
  { activity: "Quarterly Review Prep",   assignee: "Andi Wijaya",      hoursAllocated: 12, hoursUsed: 10, status: "On Track"  },
  { activity: "System Audit",            assignee: "Fitri Handayani",  hoursAllocated: 25, hoursUsed: 22, status: "On Track"  },
];

// ---------------------------------------------------------------------
// COST ANALYSIS  (spec formula: Total Cost = Salary + Benefits + Bonus)
// Salary, benefits, bonus are derived from Org Structure salary data.
// `total` is the recomputed Spec total. `actual`/`spent` are alias-equivalent.
// ---------------------------------------------------------------------
const _rawCostAnalysis = [
  { id: "FN-D01", dept: "Technology",      deptId: "D01", budget: 2800000, forecast: 2950000, headcount: 12, payroll: 1800000, benefits: 450000, bonus: 200000, training: 150000, actual: 2650000 },
  { id: "FN-D04", dept: "Operations",      deptId: "D04", budget: 1800000, forecast: 1950000, headcount: 10, payroll: 1200000, benefits: 300000, bonus: 130000, training: 100000, actual: 1900000 },
  { id: "FN-D03", dept: "Finance",         deptId: "D03", budget: 1200000, forecast: 1180000, headcount: 8,  payroll: 850000,  benefits: 220000, bonus: 90000,  training: 80000,  actual: 1150000 },
  { id: "FN-D02", dept: "Human Resources", deptId: "D02", budget: 650000,  forecast: 640000,  headcount: 5,  payroll: 480000,  benefits: 110000, bonus: 40000,  training: 50000,  actual: 612000  },
  { id: "FN-D05", dept: "Marketing",       deptId: "D05", budget: 900000,  forecast: 920000,  headcount: 6,  payroll: 650000,  benefits: 160000, bonus: 70000,  training: 70000,  actual: 850000  },
  { id: "FN-D06", dept: "Legal",           deptId: "D06", budget: 700000,  forecast: 690000,  headcount: 4,  payroll: 520000,  benefits: 120000, bonus: 50000,  training: 40000,  actual: 680000  },
  { id: "FN-D07", dept: "Procurement",     deptId: "D07", budget: 800000,  forecast: 790000,  headcount: 5,  payroll: 600000,  benefits: 130000, bonus: 60000,  training: 50000,  actual: 760000  },
];

export const costAnalysis = _rawCostAnalysis.map((c) => {
  const scale = 1000;
  const budget = c.budget * scale;
  const forecast = c.forecast * scale;
  const payroll = c.payroll * scale;
  const benefits = c.benefits * scale;
  const bonus = c.bonus * scale;
  const training = c.training * scale;
  const actual = c.actual * scale;
  const total = payroll + benefits + bonus; // Spec: Total = Salary + Benefits + Bonus
  const spent = actual;
  const variance = budget - spent;
  const variancePct = Math.round(((spent - budget) / budget) * 1000) / 10;
  const utilizationPct = Math.round((spent / budget) * 1000) / 10;
  const avgCostPerEmp = Math.round(total / Math.max(1, c.headcount));
  const status =
    spent > budget * 1.05 ? "Overspend"
    : spent > budget      ? "Watch"
    : spent > budget * 0.9 ? "On Track"
    : "Under-utilised";
  return { ...c, budget, forecast, payroll, benefits, bonus, training, actual, total, spent, variance, variancePct, utilizationPct, avgCostPerEmp, status };
});

// Monthly company-wide cost trend (sum of payroll+benefits+bonus across departments)
export const costMonthlyTrend = [
  { month: "Nov 25", salary: 19600000000, benefits: 3200000000, bonus: 1450000000 },
  { month: "Dec 25", salary: 20100000000, benefits: 3260000000, bonus: 1520000000 },
  { month: "Jan 26", salary: 20500000000, benefits: 3320000000, bonus: 1480000000 },
  { month: "Feb 26", salary: 20900000000, benefits: 3380000000, bonus: 1530000000 },
  { month: "Mar 26", salary: 21300000000, benefits: 3440000000, bonus: 1560000000 },
  { month: "Apr 26", salary: 21600000000, benefits: 3510000000, bonus: 1590000000 },
].map((m) => ({ ...m, total: m.salary + m.benefits + m.bonus }));

// ---------------------------------------------------------------------
// COST VS BUDGET (dashboard widget — values in Rupiah)
// ---------------------------------------------------------------------
export const costVsBudget = costAnalysis.map((c) => ({
  dept: c.dept,
  budget: c.budget,
  actual: c.actual,
}));

// ---------------------------------------------------------------------
// SCENARIOS
// ---------------------------------------------------------------------
const _rawScenarios = [
  { id: "S000", name: "Baseline (Current)",                description: "Current organization state — no modifications",               type: "Baseline",     status: "Active",    createdBy: "System",          lastUpdated: "2026-04-01", hc: 246, hcImpact: 0,   cost: 40250000, costImpact: 0,    util: 84.2, kpi: 82 },
  { id: "S001", name: "10% Growth Q3 2026",                description: "Aggressive growth across Engineering and Sales",              type: "Growth",       status: "Approved",  createdBy: "Hendra Saputra",  lastUpdated: "2026-04-22", hc: 271, hcImpact: 25,  cost: 44275000, costImpact: 4025000,  util: 79.8, kpi: 86 },
  { id: "S002", name: "Cost Reduction Plan",               description: "10% cost reduction through restructuring and attrition",      type: "Cost",         status: "Submitted", createdBy: "Sri Mulyani",     lastUpdated: "2026-04-25", hc: 230, hcImpact: -16, cost: 36225000, costImpact: -4025000, util: 92.5, kpi: 76 },
  { id: "S003", name: "Customer Service Automation",       description: "Replace 30% CS reps with AI chatbot platform",                type: "Automation",   status: "Draft",     createdBy: "Rini Wulandari",  lastUpdated: "2026-04-27", hc: 232, hcImpact: -14, cost: 37800000, costImpact: -2450000, util: 88.1, kpi: 84 },
  { id: "S004", name: "Engineering Restructure",           description: "Consolidate Engineering and IT into single Tech division",    type: "Restructuring",status: "Draft",     createdBy: "Budi Santoso",    lastUpdated: "2026-04-28", hc: 246, hcImpact: 0,   cost: 39800000, costImpact: -450000,  util: 86.4, kpi: 81 },
  { id: "S005", name: "Q4 2026 Hiring Plan",               description: "Target 35 new hires across all departments",                  type: "Growth",       status: "Submitted", createdBy: "Lestari Putri",   lastUpdated: "2026-04-26", hc: 281, hcImpact: 35,  cost: 45875000, costImpact: 5625000,  util: 78.2, kpi: 83 },
  { id: "S006", name: "Lean Operations 2026",              description: "Process automation to reduce Operations HC by 15%",           type: "Automation",   status: "Approved",  createdBy: "Sari Indah",      lastUpdated: "2026-04-15", hc: 240, hcImpact: -6,  cost: 38900000, costImpact: -1350000, util: 89.3, kpi: 80 },
  { id: "S007", name: "Sales Expansion Indonesia",         description: "+10 sales reps in Surabaya and Medan regional offices",       type: "Growth",       status: "Submitted", createdBy: "Dewi Kurnia",     lastUpdated: "2026-04-24", hc: 256, hcImpact: 10,  cost: 41850000, costImpact: 1600000,  util: 81.7, kpi: 85 },
  { id: "S008", name: "Procurement Centralization",        description: "Merge regional procurement teams into single Jakarta hub",    type: "Restructuring",status: "Draft",     createdBy: "Irfan Halim",     lastUpdated: "2026-04-29", hc: 243, hcImpact: -3,  cost: 39850000, costImpact: -400000,  util: 87.2, kpi: 82 },
  { id: "S009", name: "Remote-First Pivot",                description: "Shift 60% of workforce to remote-first hybrid model",         type: "Restructuring",status: "Approved",  createdBy: "Lestari Putri",   lastUpdated: "2026-04-10", hc: 246, hcImpact: 0,   cost: 36900000, costImpact: -3350000, util: 84.2, kpi: 84 },
  { id: "S010", name: "Finance Shared Services",           description: "Move AP/AR to shared services center with 8 FTE reduction",   type: "Cost",         status: "Submitted", createdBy: "Sri Mulyani",     lastUpdated: "2026-04-20", hc: 238, hcImpact: -8,  cost: 38150000, costImpact: -2100000, util: 90.1, kpi: 79 },
  { id: "S011", name: "Digital Transformation Phase 2",    description: "Add 12 digital roles, retire 6 legacy roles",                 type: "Automation",   status: "Draft",     createdBy: "Budi Santoso",    lastUpdated: "2026-04-28", hc: 252, hcImpact: 6,   cost: 42100000, costImpact: 1850000,  util: 83.5, kpi: 88 },
  { id: "S012", name: "Customer Success Buildout",         description: "Create new Customer Success division with 15 FTE",            type: "Growth",       status: "Draft",     createdBy: "Citra Dewi",      lastUpdated: "2026-04-29", hc: 261, hcImpact: 15,  cost: 42500000, costImpact: 2250000,  util: 80.2, kpi: 87 },
  { id: "S013", name: "Supply Chain Optimization",         description: "Restructure SC ops, consolidate warehouses",                  type: "Restructuring",status: "Submitted", createdBy: "Cahyadi Wijaya",  lastUpdated: "2026-04-23", hc: 240, hcImpact: -6,  cost: 38950000, costImpact: -1300000, util: 88.7, kpi: 81 },
  { id: "S014", name: "Tech Talent Acquisition",           description: "Hire 18 senior engineers across Bandung and Jakarta",         type: "Growth",       status: "Approved",  createdBy: "Rini Wulandari",  lastUpdated: "2026-04-12", hc: 264, hcImpact: 18,  cost: 43200000, costImpact: 2950000,  util: 81.5, kpi: 87 },
  { id: "S015", name: "Marketing Cost Restructure",        description: "Reduce agency spend by 30%, in-house creative team",          type: "Cost",         status: "Draft",     createdBy: "Dewi Kurnia",     lastUpdated: "2026-04-29", hc: 248, hcImpact: 2,   cost: 39450000, costImpact: -800000,  util: 85.8, kpi: 80 },
  { id: "S016", name: "Legal Team Expansion",              description: "Add 4 senior counsel for international expansion",            type: "Growth",       status: "Submitted", createdBy: "Fitri Handayani", lastUpdated: "2026-04-25", hc: 250, hcImpact: 4,   cost: 41100000, costImpact: 850000,   util: 84.0, kpi: 84 },
  { id: "S017", name: "Operations AI Augmentation",        description: "Deploy AI tools to augment Ops Analysts, no HC change",       type: "Automation",   status: "Draft",     createdBy: "Sari Indah",      lastUpdated: "2026-04-28", hc: 246, hcImpact: 0,   cost: 40850000, costImpact: 600000,   util: 78.4, kpi: 89 },
  { id: "S018", name: "HR Service Delivery",               description: "Outsource transactional HR, retain strategic HR",             type: "Restructuring",status: "Draft",     createdBy: "Lestari Putri",   lastUpdated: "2026-04-27", hc: 240, hcImpact: -6,  cost: 39200000, costImpact: -1050000, util: 87.6, kpi: 80 },
  { id: "S019", name: "Strategy Office Buildup",           description: "Add 5 strategy consultants for transformation program",       type: "Growth",       status: "Approved",  createdBy: "Siti Aminah",     lastUpdated: "2026-04-18", hc: 251, hcImpact: 5,   cost: 41100000, costImpact: 850000,   util: 83.2, kpi: 88 },
  { id: "S020", name: "Aggressive Cost Cut",               description: "20% cost reduction across all departments",                   type: "Cost",         status: "Draft",     createdBy: "Sri Mulyani",     lastUpdated: "2026-04-29", hc: 211, hcImpact: -35, cost: 32200000, costImpact: -8050000, util: 96.8, kpi: 68 },
  { id: "S021", name: "Hybrid Future of Work",             description: "Long-term hybrid model with reduced real estate footprint",   type: "Restructuring",status: "Submitted", createdBy: "Hendra Saputra",  lastUpdated: "2026-04-22", hc: 246, hcImpact: 0,   cost: 37500000, costImpact: -2750000, util: 84.2, kpi: 86 },
];
export const scenarios = _rawScenarios.map((s) => ({
  ...s,
  cost: s.cost * 1000,
  costImpact: s.costImpact * 1000,
}));

// ---------------------------------------------------------------------
// APPROVAL WORKFLOWS & RECORDS
// ---------------------------------------------------------------------
export const approvalWorkflows = [
  { id: "AW001", type: "Headcount Request", requester: "Hendra Saputra",  status: "Pending",   daysOpen: 3, priority: "High",     dept: "Technology",  amount: 95000  },
  { id: "AW002", type: "Budget Adjustment", requester: "Sari Indah",      status: "In Review", daysOpen: 1, priority: "Critical", dept: "Operations",  amount: 150000 },
  { id: "AW003", type: "New Position",      requester: "Lestari Putri",   status: "Pending",   daysOpen: 2, priority: "Medium",   dept: "Marketing",   amount: 110000 },
  { id: "AW004", type: "Salary Adjustment", requester: "Andi Wijaya",     status: "Approved",  daysOpen: 5, priority: "Medium",   dept: "Finance",     amount: 12000  },
  { id: "AW005", type: "Vacancy Approval",  requester: "Rini Wulandari",  status: "Pending",   daysOpen: 4, priority: "High",     dept: "Technology",  amount: 130000 },
];

export const approvalRecords = [
  { id: "AP001", type: "Headcount Request", requestor: "Hendra Saputra", dept: "Technology", priority: "High",     status: "Pending",   createdDate: "2026-04-25", approvers: ["Maya Sari", "Sri Mulyani"] },
  { id: "AP002", type: "Budget Adjustment", requestor: "Sari Indah",     dept: "Operations", priority: "Critical", status: "In Review", createdDate: "2026-04-26", approvers: ["Sri Mulyani"] },
  { id: "AP003", type: "New Position",      requestor: "Lestari Putri",  dept: "Marketing",  priority: "Medium",   status: "Pending",   createdDate: "2026-04-27", approvers: ["Hendra Saputra"] },
  { id: "AP004", type: "Vacancy Approval",  requestor: "Rini Wulandari", dept: "Technology", priority: "High",     status: "Pending",   createdDate: "2026-04-27", approvers: ["Maya Sari"] },
];

// ---------------------------------------------------------------------
// AUDIT LOGS
// ---------------------------------------------------------------------
export const auditLogs = [
  { id: "L001", action: "User Login",                  user: "Sri Mulyani",     resource: "Auth System",        result: "Success", severity: "Info",     module: "Governance",         timestamp: "2026-04-28 09:00", ip: "10.0.0.45"  },
  { id: "L002", action: "Headcount Plan Updated",      user: "Sri Mulyani",     resource: "Workforce Planning", result: "Success", severity: "Info",     module: "Workforce Planning", timestamp: "2026-04-28 09:14", ip: "10.0.0.45"  },
  { id: "L003", action: "Budget Threshold Exceeded",   user: "System",          resource: "Finance Module",     result: "Alert",   severity: "Warning",  module: "Financial",          timestamp: "2026-04-28 08:45", ip: "system"     },
  { id: "L004", action: "New Position Approved",       user: "Lestari Putri",   resource: "Position P009",      result: "Success", severity: "Info",     module: "Organization",       timestamp: "2026-04-27 16:30", ip: "10.0.0.52"  },
  { id: "L005", action: "Process Map Published",       user: "Sari Indah",      resource: "Process P004",       result: "Success", severity: "Info",     module: "Process Health",     timestamp: "2026-04-27 14:20", ip: "10.0.0.78"  },
  { id: "L006", action: "Audit Report Exported",       user: "Fitri Handayani", resource: "Audit Module",       result: "Success", severity: "Info",     module: "Governance",         timestamp: "2026-04-27 11:10", ip: "10.0.0.31"  },
  { id: "L007", action: "Access Control Modified",     user: "Hendra Saputra",  resource: "Role R002",          result: "Success", severity: "Critical", module: "Governance",         timestamp: "2026-04-26 15:30", ip: "10.0.0.12"  },
  { id: "L008", action: "Failed Login Attempt",        user: "Unknown",         resource: "Auth System",        result: "Failure", severity: "Critical", module: "Governance",         timestamp: "2026-04-26 13:22", ip: "203.0.113.5"},
  { id: "L009", action: "Salary Data Exported",        user: "Andi Wijaya",     resource: "Finance Module",     result: "Success", severity: "Warning",  module: "Financial",          timestamp: "2026-04-26 10:45", ip: "10.0.0.42"  },
  { id: "L010", action: "Workflow Triggered",          user: "System",          resource: "Approval AW002",     result: "Success", severity: "Info",     module: "Workflow",           timestamp: "2026-04-26 09:15", ip: "system"     },
  { id: "L011", action: "Compliance Policy Granted",   user: "Fitri Handayani", resource: "Policy POL004",      result: "Success", severity: "Info",     module: "Governance",         timestamp: "2026-04-25 14:50", ip: "10.0.0.31"  },
  { id: "L012", action: "Vacancy V001 Created",        user: "Lestari Putri",   resource: "Vacancy V001",       result: "Success", severity: "Info",     module: "Recruitment",        timestamp: "2026-03-27 09:30", ip: "10.0.0.52"  },
];

// =====================================================================
// BUSINESS PROCESS MANAGEMENT (BPM) DATA
// 22 processes, 110+ activities. Linked to org structure, KPI, workload.
// =====================================================================

export type ProcessStatusType = "On Track" | "At Risk" | "Critical";

export const processList = [
  // === Strategic-Operational Chain ===
  { id: "BP001", name: "Strategy Definition",      code: "STRAT-001",   dept: "Strategy",        deptId: "D08", ownerPosition: "Strategy Director",     ownerId: "E024", owner: "Siti Aminah",      category: "Strategic",  sla: 10,  actualTime: 9.2,   status: "On Track", frequency: "Quarterly",  bottleneck: false, slaMet: true,  efficiency: 92, kpiScore: 88, previousProcess: null,    nextProcess: "BP002", inputSource: "Strategic Planning System", outputDeliverable: "Strategy Roadmap",     description: "Defines corporate strategy, objectives, and roadmap for the planning horizon.", lastUpdated: "2026-04-15", version: "v2.1" },
  { id: "BP002", name: "Planning & Budgeting",     code: "PLAN-001",    dept: "Finance",         deptId: "D03", ownerPosition: "Finance Director",      ownerId: "E016", owner: "Sri Mulyani",      category: "Financial",  sla: 15,  actualTime: 14.8,  status: "On Track", frequency: "Quarterly",  bottleneck: false, slaMet: true,  efficiency: 99, kpiScore: 95, previousProcess: "BP001", nextProcess: "BP003", inputSource: "Strategy Roadmap",          outputDeliverable: "Annual Budget Plan",   description: "Translates strategy into financial plans, budgets, and resource allocations.", lastUpdated: "2026-04-12", version: "v1.5" },
  { id: "BP003", name: "Procurement Process",      code: "PROC-001",    dept: "Procurement",     deptId: "D07", ownerPosition: "Procurement Manager",   ownerId: "E021", owner: "Irfan Halim",      category: "Operations", sla: 20,  actualTime: 22.1,  status: "Critical", frequency: "Continuous", bottleneck: true,  slaMet: false, efficiency: 88, kpiScore: 72, previousProcess: "BP002", nextProcess: "BP004", inputSource: "Approved Budget Plan",       outputDeliverable: "PO & Contracts",       description: "End-to-end procurement of goods and services from RFQ to PO issuance.", lastUpdated: "2026-04-08", version: "v1.2" },
  { id: "BP004", name: "Operations Execution",     code: "OPS-001",     dept: "Operations",      deptId: "D04", ownerPosition: "Operations Manager",    ownerId: "E013", owner: "Bambang Kusuma",   category: "Operations", sla: 5,   actualTime: 5.3,   status: "On Track", frequency: "Daily",      bottleneck: false, slaMet: true,  efficiency: 95, kpiScore: 91, previousProcess: "BP003", nextProcess: "BP005", inputSource: "PO & Contracts",            outputDeliverable: "Work Orders",          description: "Daily execution of business operations and work order dispatch.", lastUpdated: "2026-04-22", version: "v1.3" },
  { id: "BP005", name: "Delivery Management",      code: "DEL-001",     dept: "Operations",      deptId: "D04", ownerPosition: "VP Operations",         ownerId: "E004", owner: "Sari Indah",       category: "Operations", sla: 3,   actualTime: 3.6,   status: "At Risk",  frequency: "Daily",      bottleneck: true,  slaMet: false, efficiency: 85, kpiScore: 78, previousProcess: "BP004", nextProcess: "BP006", inputSource: "Work Orders",               outputDeliverable: "Delivered Output",     description: "Quality assurance, customer acceptance, and final delivery sign-off.", lastUpdated: "2026-04-18", version: "v2.0" },
  { id: "BP006", name: "Financial Settlement",     code: "FIN-001",     dept: "Finance",         deptId: "D03", ownerPosition: "Senior Finance Manager",ownerId: "E015", owner: "Andi Wijaya",      category: "Financial",  sla: 8,   actualTime: 7.9,   status: "On Track", frequency: "Daily",      bottleneck: false, slaMet: true,  efficiency: 94, kpiScore: 89, previousProcess: "BP005", nextProcess: null,    inputSource: "Delivered Output & Invoices",outputDeliverable: "Payment Records",      description: "Invoice verification, payment processing, and financial closure.", lastUpdated: "2026-04-25", version: "v1.4" },
  // === Talent Lifecycle ===
  { id: "BP007", name: "Recruitment Process",      code: "RECRUIT-001", dept: "Human Resources", deptId: "D02", ownerPosition: "HR Director",           ownerId: "E018", owner: "Lestari Putri",    category: "Talent",     sla: 45,  actualTime: 48.5,  status: "Critical", frequency: "Continuous", bottleneck: true,  slaMet: false, efficiency: 82, kpiScore: 68, previousProcess: null,    nextProcess: "BP008", inputSource: "Job Requisitions",          outputDeliverable: "Hired Candidates",     description: "Sourcing, screening, interviewing, and offer negotiation for open roles.", lastUpdated: "2026-04-10", version: "v3.0" },
  { id: "BP008", name: "Employee Onboarding",      code: "ONBOARD-001", dept: "Human Resources", deptId: "D02", ownerPosition: "Senior Recruiter",      ownerId: "E019", owner: "Hana Setiawan",    category: "Talent",     sla: 15,  actualTime: 14.2,  status: "On Track", frequency: "Per Hire",   bottleneck: false, slaMet: true,  efficiency: 91, kpiScore: 86, previousProcess: "BP007", nextProcess: "BP009", inputSource: "Hired Candidates",          outputDeliverable: "Active Employees",     description: "Pre-boarding, day-1 orientation, system provisioning, and 30-day check-in.", lastUpdated: "2026-04-20", version: "v2.2" },
  { id: "BP009", name: "Performance Review",       code: "PERF-001",    dept: "Human Resources", deptId: "D02", ownerPosition: "HR Director",           ownerId: "E018", owner: "Lestari Putri",    category: "Talent",     sla: 30,  actualTime: 35.0,  status: "At Risk",  frequency: "Annual",     bottleneck: true,  slaMet: false, efficiency: 78, kpiScore: 65, previousProcess: "BP008", nextProcess: null,    inputSource: "Employee Records",          outputDeliverable: "Performance Ratings",  description: "Annual goal-setting, self-assessment, manager review, and calibration.", lastUpdated: "2026-04-05", version: "v1.8" },
  { id: "BP013", name: "Training & Development",   code: "TRAIN-001",   dept: "Human Resources", deptId: "D02", ownerPosition: "HR Director",           ownerId: "E018", owner: "Lestari Putri",    category: "Talent",     sla: 21,  actualTime: 20.5,  status: "On Track", frequency: "Monthly",    bottleneck: false, slaMet: true,  efficiency: 87, kpiScore: 82, previousProcess: "BP008", nextProcess: "BP009", inputSource: "Skill Gap Analysis",        outputDeliverable: "Trained Workforce",    description: "Skill gap assessment, curriculum design, training delivery, and effectiveness measurement.", lastUpdated: "2026-04-14", version: "v1.3" },
  // === Governance & Risk ===
  { id: "BP010", name: "Compliance Audit",         code: "AUDIT-001",   dept: "Legal",           deptId: "D06", ownerPosition: "General Counsel",       ownerId: "E008", owner: "Fitri Handayani",  category: "Governance", sla: 60,  actualTime: 58.0,  status: "On Track", frequency: "Quarterly",  bottleneck: false, slaMet: true,  efficiency: 89, kpiScore: 84, previousProcess: null,    nextProcess: null,    inputSource: "System Records",            outputDeliverable: "Audit Report",         description: "Quarterly compliance audit covering financial, operational, and regulatory checks.", lastUpdated: "2026-03-28", version: "v2.4" },
  { id: "BP014", name: "Risk Management",          code: "RISK-001",    dept: "Strategy",        deptId: "D08", ownerPosition: "VP Strategy",           ownerId: "E007", owner: "Budi Santoso",     category: "Governance", sla: 14,  actualTime: 13.5,  status: "On Track", frequency: "Monthly",    bottleneck: false, slaMet: true,  efficiency: 90, kpiScore: 85, previousProcess: null,    nextProcess: null,    inputSource: "Risk Register",             outputDeliverable: "Risk Mitigation Plan", description: "Risk identification, assessment, mitigation planning, and continuous monitoring.", lastUpdated: "2026-04-09", version: "v2.0" },
  // === Operations Support ===
  { id: "BP011", name: "Cost Optimization",        code: "COST-001",    dept: "Finance",         deptId: "D03", ownerPosition: "Finance Director",      ownerId: "E016", owner: "Sri Mulyani",      category: "Financial",  sla: 30,  actualTime: 32.5,  status: "At Risk",  frequency: "Monthly",    bottleneck: true,  slaMet: false, efficiency: 81, kpiScore: 71, previousProcess: null,    nextProcess: null,    inputSource: "Financial Data",            outputDeliverable: "Cost Savings Plan",    description: "Continuous cost analysis, optimization initiatives, and savings tracking.", lastUpdated: "2026-04-02", version: "v1.6" },
  { id: "BP012", name: "Workload Allocation",      code: "WL-001",      dept: "Operations",      deptId: "D04", ownerPosition: "VP Operations",         ownerId: "E004", owner: "Sari Indah",       category: "Operations", sla: 2,   actualTime: 2.1,   status: "At Risk",  frequency: "Daily",      bottleneck: true,  slaMet: false, efficiency: 79, kpiScore: 73, previousProcess: null,    nextProcess: null,    inputSource: "Resource Pool",             outputDeliverable: "Work Assignments",     description: "Daily capacity planning and dynamic workload reallocation across teams.", lastUpdated: "2026-04-23", version: "v1.1" },
  { id: "BP015", name: "Vendor Management",        code: "VEND-001",    dept: "Procurement",     deptId: "D07", ownerPosition: "Procurement Manager",   ownerId: "E021", owner: "Irfan Halim",      category: "Operations", sla: 7,   actualTime: 6.5,   status: "On Track", frequency: "Weekly",     bottleneck: false, slaMet: true,  efficiency: 93, kpiScore: 87, previousProcess: null,    nextProcess: "BP003", inputSource: "Vendor Database",           outputDeliverable: "Approved Vendors",     description: "Vendor evaluation, contract renewal, performance monitoring, and escalation.", lastUpdated: "2026-04-16", version: "v1.4" },
  { id: "BP016", name: "Customer Onboarding",      code: "CUST-001",    dept: "Operations",      deptId: "D04", ownerPosition: "Operations Manager",    ownerId: "E013", owner: "Bambang Kusuma",   category: "Operations", sla: 7,   actualTime: 8.2,   status: "At Risk",  frequency: "Per Customer", bottleneck: true, slaMet: false, efficiency: 84, kpiScore: 76, previousProcess: null,    nextProcess: "BP004", inputSource: "Customer Sign-up",          outputDeliverable: "Active Account",       description: "Account setup, training, service activation, and post-onboarding survey.", lastUpdated: "2026-04-19", version: "v2.1" },
  // === Technology Pipeline ===
  { id: "BP017", name: "Product Development",      code: "PROD-001",    dept: "Technology",      deptId: "D01", ownerPosition: "VP Technology",         ownerId: "E006", owner: "Rini Wulandari",   category: "Strategic",  sla: 90,  actualTime: 92.5,  status: "At Risk",  frequency: "Continuous", bottleneck: true,  slaMet: false, efficiency: 86, kpiScore: 80, previousProcess: "BP001", nextProcess: "BP018", inputSource: "Product Roadmap",           outputDeliverable: "Released Features",    description: "Requirements, design, sprints, code review, and release preparation.", lastUpdated: "2026-04-11", version: "v3.2" },
  { id: "BP018", name: "Quality Assurance",        code: "QA-001",      dept: "Technology",      deptId: "D01", ownerPosition: "Tech Lead",             ownerId: "E010", owner: "Indah Permata",    category: "Operations", sla: 5,   actualTime: 4.8,   status: "On Track", frequency: "Daily",      bottleneck: false, slaMet: true,  efficiency: 96, kpiScore: 92, previousProcess: "BP017", nextProcess: "BP005", inputSource: "Released Build",            outputDeliverable: "QA Sign-off",          description: "Test planning, execution, bug triage, regression, and final sign-off.", lastUpdated: "2026-04-26", version: "v1.7" },
  { id: "BP019", name: "IT Operations",            code: "ITOPS-001",   dept: "Technology",      deptId: "D01", ownerPosition: "VP Technology",         ownerId: "E006", owner: "Rini Wulandari",   category: "Operations", sla: 1,   actualTime: 0.9,   status: "On Track", frequency: "Daily",      bottleneck: false, slaMet: true,  efficiency: 97, kpiScore: 93, previousProcess: null,    nextProcess: null,    inputSource: "Incident Queue",            outputDeliverable: "Resolved Tickets",     description: "System monitoring, incident response, patch management, and reporting.", lastUpdated: "2026-04-27", version: "v2.5" },
  // === Revenue Pipeline ===
  { id: "BP020", name: "Marketing Campaign",       code: "MKT-001",     dept: "Marketing",       deptId: "D05", ownerPosition: "VP Marketing",          ownerId: "E005", owner: "Dewi Kurnia",      category: "Strategic",  sla: 30,  actualTime: 28.5,  status: "On Track", frequency: "Monthly",    bottleneck: false, slaMet: true,  efficiency: 88, kpiScore: 83, previousProcess: "BP001", nextProcess: "BP021", inputSource: "Marketing Strategy",        outputDeliverable: "Campaign Results",     description: "Campaign strategy, content creation, channel selection, execution, and analysis.", lastUpdated: "2026-04-13", version: "v1.9" },
  { id: "BP021", name: "Sales Operations",         code: "SALES-001",   dept: "Marketing",       deptId: "D05", ownerPosition: "Marketing Manager",     ownerId: "E020", owner: "Joko Susilo",      category: "Operations", sla: 14,  actualTime: 15.5,  status: "At Risk",  frequency: "Weekly",     bottleneck: true,  slaMet: false, efficiency: 83, kpiScore: 75, previousProcess: "BP020", nextProcess: "BP004", inputSource: "Qualified Leads",           outputDeliverable: "Closed Deals",         description: "Lead qualification, proposal drafting, negotiation, contract, and handoff.", lastUpdated: "2026-04-17", version: "v1.5" },
  { id: "BP022", name: "Inventory Management",     code: "INV-001",     dept: "Operations",      deptId: "D04", ownerPosition: "Operations Analyst",    ownerId: "E014", owner: "Wahyu Pradana",    category: "Operations", sla: 1,   actualTime: 1.2,   status: "On Track", frequency: "Daily",      bottleneck: false, slaMet: true,  efficiency: 91, kpiScore: 84, previousProcess: null,    nextProcess: "BP004", inputSource: "Stock Levels",              outputDeliverable: "Inventory Report",     description: "Stock counting, reorder triggering, adjustments, audits, and reporting.", lastUpdated: "2026-04-24", version: "v2.0" },
];

const bumnDeptNameMap: Record<string, string> = {
  "Executive Office": "Direksi & Corporate Office",
  "Finance": "Divisi Finance & Governance",
  "Human Resources": "Divisi Human Capital Management",
  "Operations": "Divisi Operasi Terminal",
  "Engineering": "Divisi Digital Transformation",
  "IT & Digital": "Divisi IT Infrastructure",
  "Sales & Marketing": "Divisi Komersial & Customer Solutions",
  "Procurement": "Divisi Procurement",
  "Legal & Compliance": "Divisi Legal & Compliance",
  "Supply Chain": "Divisi Pelayanan Kapal",
  "Customer Service": "Divisi Port Services",
  "Strategy & Transformation": "Divisi Strategy & Corporate Planning",
  "Marketing": "Divisi Komersial & Customer Solutions",
  "Technology": "Divisi IT Infrastructure",
  "Strategy": "Divisi Strategy & Corporate Planning",
  "Legal": "Divisi Legal & Compliance",
};

for (const p of processList as Array<Record<string, any>>) {
  p.dept = bumnDeptNameMap[p.dept] ?? p.dept;
  p.ownerPositionId =
    positions.find((pos) => pos.title === p.ownerPosition)?.id ??
    positions.find((pos) => pos.title === p.owner)?.id ??
    null;
}

// ---------------------------------------------------------------------
// ACTIVITY TEMPLATES — 5 activities per process (110 total)
// Each entry: [name, durationHours, [employeeIds...]]
// ---------------------------------------------------------------------
type ActivityTemplate = { name: string; duration: number; assignees: string[] };

const _activityTemplates: Record<string, ActivityTemplate[]> = {
  BP001: [
    { name: "Environmental Scan",         duration: 12, assignees: ["E024", "E007"] },
    { name: "Vision & Mission Alignment", duration: 8,  assignees: ["E024", "E001"] },
    { name: "Strategic Goal Setting",     duration: 16, assignees: ["E024", "E007"] },
    { name: "Initiative Prioritization",  duration: 10, assignees: ["E024"] },
    { name: "Strategy Communication",     duration: 6,  assignees: ["E024", "E007"] },
  ],
  BP002: [
    { name: "Department Budget Collection", duration: 20, assignees: ["E015", "E017"] },
    { name: "Financial Modeling",           duration: 24, assignees: ["E016", "E015"] },
    { name: "Budget Approval Cycle",        duration: 16, assignees: ["E016", "E003"] },
    { name: "Budget Distribution",          duration: 8,  assignees: ["E015", "E017"] },
    { name: "Variance Tracking Setup",      duration: 12, assignees: ["E017"] },
  ],
  BP003: [
    { name: "Vendor Selection",        duration: 16, assignees: ["E021", "E022"] },
    { name: "RFQ Issuance",            duration: 8,  assignees: ["E022"] },
    { name: "Contract Negotiation",    duration: 32, assignees: ["E021"] },
    { name: "PO Issuance",             duration: 6,  assignees: ["E022"] },
    { name: "Vendor Performance Review", duration: 12, assignees: ["E021", "E022"] },
  ],
  BP004: [
    { name: "Resource Allocation",     duration: 2,  assignees: ["E013", "E014"] },
    { name: "Daily Standup",           duration: 1,  assignees: ["E013"] },
    { name: "Work Order Dispatch",     duration: 4,  assignees: ["E013", "E014"] },
    { name: "Execution Tracking",      duration: 6,  assignees: ["E014"] },
    { name: "Daily Reporting",         duration: 2,  assignees: ["E014"] },
  ],
  BP005: [
    { name: "Quality Check",           duration: 4,  assignees: ["E004", "E013"] },
    { name: "Customer Acceptance",     duration: 6,  assignees: ["E004", "E013"] },
    { name: "Delivery Sign-off",       duration: 2,  assignees: ["E004"] },
    { name: "Issue Resolution",        duration: 8,  assignees: ["E013", "E014"] },
    { name: "Delivery Reporting",      duration: 3,  assignees: ["E004"] },
  ],
  BP006: [
    { name: "Invoice Verification",    duration: 6,  assignees: ["E017"] },
    { name: "Payment Authorization",   duration: 4,  assignees: ["E015"] },
    { name: "Payment Execution",       duration: 6,  assignees: ["E015", "E017"] },
    { name: "Reconciliation",          duration: 8,  assignees: ["E017"] },
    { name: "Financial Closure",       duration: 4,  assignees: ["E015", "E016"] },
  ],
  BP007: [
    { name: "Job Description Creation",  duration: 8,  assignees: ["E019"] },
    { name: "Candidate Sourcing",        duration: 40, assignees: ["E019"] },
    { name: "Resume Screening",          duration: 24, assignees: ["E019"] },
    { name: "Interview Coordination",    duration: 32, assignees: ["E019", "E018"] },
    { name: "Offer Negotiation",         duration: 16, assignees: ["E018", "E019"] },
  ],
  BP008: [
    { name: "Pre-boarding Setup",      duration: 4,  assignees: ["E019"] },
    { name: "Day-1 Orientation",       duration: 8,  assignees: ["E019"] },
    { name: "System Provisioning",     duration: 6,  assignees: ["E010", "E011"] },
    { name: "Training Plan",           duration: 12, assignees: ["E018"] },
    { name: "30-Day Check-in",         duration: 2,  assignees: ["E018", "E019"] },
  ],
  BP009: [
    { name: "Goal Setting",            duration: 16, assignees: ["E018"] },
    { name: "Self-Assessment Collection", duration: 24, assignees: ["E018", "E019"] },
    { name: "Manager Review",          duration: 80, assignees: ["E001", "E002"] },
    { name: "Calibration Meeting",     duration: 16, assignees: ["E018"] },
    { name: "Review Communication",    duration: 8,  assignees: ["E018"] },
  ],
  BP010: [
    { name: "Records Collection",      duration: 40, assignees: ["E023"] },
    { name: "Sample Testing",          duration: 60, assignees: ["E023"] },
    { name: "Findings Documentation",  duration: 32, assignees: ["E023"] },
    { name: "Management Response",     duration: 16, assignees: ["E008"] },
    { name: "Final Audit Report",      duration: 24, assignees: ["E008", "E023"] },
  ],
  BP011: [
    { name: "Cost Analysis",           duration: 24, assignees: ["E015", "E017"] },
    { name: "Optimization Identification", duration: 16, assignees: ["E016"] },
    { name: "Initiative Approval",     duration: 8,  assignees: ["E016", "E003"] },
    { name: "Implementation Tracking", duration: 32, assignees: ["E015"] },
    { name: "Savings Reporting",       duration: 12, assignees: ["E017"] },
  ],
  BP012: [
    { name: "Capacity Planning",       duration: 4,  assignees: ["E013"] },
    { name: "Workload Analysis",       duration: 3,  assignees: ["E014"] },
    { name: "Allocation Decision",     duration: 2,  assignees: ["E004"] },
    { name: "Communication",           duration: 1,  assignees: ["E013"] },
    { name: "Adjustment Tracking",     duration: 2,  assignees: ["E014"] },
  ],
  BP013: [
    { name: "Skill Gap Assessment",    duration: 16, assignees: ["E019"] },
    { name: "Curriculum Design",       duration: 24, assignees: ["E018"] },
    { name: "Training Delivery",       duration: 40, assignees: ["E019", "E018"] },
    { name: "Knowledge Assessment",    duration: 12, assignees: ["E019"] },
    { name: "Effectiveness Review",    duration: 8,  assignees: ["E018"] },
  ],
  BP014: [
    { name: "Risk Identification",     duration: 12, assignees: ["E007", "E024"] },
    { name: "Risk Assessment",         duration: 16, assignees: ["E007"] },
    { name: "Mitigation Planning",     duration: 14, assignees: ["E024"] },
    { name: "Mitigation Execution",    duration: 20, assignees: ["E007"] },
    { name: "Risk Monitoring",         duration: 8,  assignees: ["E007"] },
  ],
  BP015: [
    { name: "Vendor Database Maintenance", duration: 6,  assignees: ["E022"] },
    { name: "Vendor Evaluation",       duration: 12, assignees: ["E021"] },
    { name: "Contract Renewal",        duration: 16, assignees: ["E021"] },
    { name: "Performance Monitoring",  duration: 8,  assignees: ["E022"] },
    { name: "Issue Escalation",        duration: 4,  assignees: ["E021"] },
  ],
  BP016: [
    { name: "Account Setup",           duration: 4,  assignees: ["E014"] },
    { name: "Welcome Communication",   duration: 2,  assignees: ["E014"] },
    { name: "Training Session",        duration: 8,  assignees: ["E013", "E014"] },
    { name: "Service Activation",      duration: 6,  assignees: ["E013"] },
    { name: "Onboarding Survey",       duration: 2,  assignees: ["E014"] },
  ],
  BP017: [
    { name: "Requirements Gathering",  duration: 60, assignees: ["E010", "E006"] },
    { name: "Design & Architecture",   duration: 80, assignees: ["E010"] },
    { name: "Development Sprint",      duration: 240, assignees: ["E009", "E010", "E011"] },
    { name: "Code Review",             duration: 40, assignees: ["E010"] },
    { name: "Release Preparation",     duration: 24, assignees: ["E009"] },
  ],
  BP018: [
    { name: "Test Plan Creation",      duration: 6,  assignees: ["E010"] },
    { name: "Test Execution",          duration: 16, assignees: ["E009", "E011"] },
    { name: "Bug Triage",              duration: 4,  assignees: ["E010", "E009"] },
    { name: "Regression Testing",      duration: 8,  assignees: ["E011"] },
    { name: "QA Sign-off",             duration: 2,  assignees: ["E010"] },
  ],
  BP019: [
    { name: "System Monitoring",       duration: 4,  assignees: ["E009", "E011"] },
    { name: "Incident Response",       duration: 3,  assignees: ["E010"] },
    { name: "Patch Management",        duration: 6,  assignees: ["E011"] },
    { name: "Backup Verification",     duration: 2,  assignees: ["E009"] },
    { name: "Incident Reporting",      duration: 1,  assignees: ["E010"] },
  ],
  BP020: [
    { name: "Campaign Strategy",       duration: 24, assignees: ["E005", "E020"] },
    { name: "Content Creation",        duration: 60, assignees: ["E020"] },
    { name: "Channel Selection",       duration: 8,  assignees: ["E020"] },
    { name: "Campaign Execution",      duration: 80, assignees: ["E020"] },
    { name: "Results Analysis",        duration: 16, assignees: ["E020", "E005"] },
  ],
  BP021: [
    { name: "Lead Qualification",      duration: 6,  assignees: ["E020"] },
    { name: "Proposal Drafting",       duration: 12, assignees: ["E020"] },
    { name: "Negotiation",             duration: 16, assignees: ["E020", "E005"] },
    { name: "Contract Signing",        duration: 4,  assignees: ["E020", "E008"] },
    { name: "Operations Handoff",      duration: 2,  assignees: ["E020", "E013"] },
  ],
  BP022: [
    { name: "Stock Counting",          duration: 4,  assignees: ["E014"] },
    { name: "Reorder Triggering",      duration: 1,  assignees: ["E014"] },
    { name: "Stock Adjustment",        duration: 2,  assignees: ["E013", "E014"] },
    { name: "Inventory Audit",         duration: 6,  assignees: ["E014", "E023"] },
    { name: "Inventory Reporting",     duration: 1,  assignees: ["E014"] },
  ],
};

// ---------------------------------------------------------------------
// ACTIVITY LIST — derived from templates, fully linked to org structure
// ---------------------------------------------------------------------
function _calcUtilization(idx: number, processBottleneck: boolean): number {
  // deterministic — no Math.random to prevent hydration mismatches
  const base = 65 + ((idx * 7) % 30);
  return processBottleneck ? Math.min(98, base + 8) : base;
}

function _staffingStatus(requiredHc: number, processBottleneck: boolean, idx: number): "Understaffed" | "Balanced" | "Overstaffed" {
  if (processBottleneck && idx % 2 === 0) return "Understaffed";
  if (requiredHc >= 3) return "Overstaffed";
  return "Balanced";
}

export const activityList = processList.flatMap((p) => {
  const tpl = _activityTemplates[p.id] || [];
  return tpl.map((t, i) => {
    const requiredHc = t.assignees.length;
    const employeeNames = t.assignees
      .map((eid) => employees.find((e) => e.id === eid)?.name)
      .filter(Boolean) as string[];
    const positionTitle =
      employees.find((e) => e.id === t.assignees[0])?.position || p.ownerPosition;
    return {
      id: `ACT_${p.id}_${i + 1}`,
      processId: p.id,
      processCode: p.code,
      processName: p.name,
      seq: i + 1,
      name: t.name,
      frequency: p.frequency,
      duration: t.duration,
      durationUnit: "hours",
      role: positionTitle,
      position: positionTitle,
      assignedEmployees: t.assignees,
      assignedEmployeeNames: employeeNames,
      requiredHc,
      utilization: _calcUtilization(i, p.bottleneck),
      workloadHours: t.duration * (p.frequency === "Daily" ? 22 : p.frequency === "Weekly" ? 4 : p.frequency === "Monthly" ? 1 : p.frequency === "Quarterly" ? 0.33 : 0.083),
      status:
        p.bottleneck && i === Math.floor(tpl.length / 2)
          ? "Bottleneck"
          : "Active",
      staffingStatus: _staffingStatus(requiredHc, p.bottleneck, i),
    };
  });
});

// ---------------------------------------------------------------------
// PROCESS CHAINS — multiple flow definitions
// ---------------------------------------------------------------------
export const processChain = ["BP001", "BP002", "BP003", "BP004", "BP005", "BP006"];

export const processChains = [
  { id: "main",    label: "Strategic-Operational",  flow: ["BP001", "BP002", "BP003", "BP004", "BP005", "BP006"] },
  { id: "talent",  label: "Talent Lifecycle",       flow: ["BP007", "BP008", "BP013", "BP009"] },
  { id: "product", label: "Product Pipeline",       flow: ["BP001", "BP017", "BP018", "BP005"] },
  { id: "revenue", label: "Marketing-to-Sales",     flow: ["BP020", "BP021", "BP004"] },
];

// ---------------------------------------------------------------------
// PROCESS I/O MAPPING
// ---------------------------------------------------------------------
export const processIOMapping = [
  { id: "IO001", fromProcess: "BP001", toProcess: "BP002",  input: "Strategy Roadmap",       output: "Strategic Direction",   dataType: "Document",      frequency: "Quarterly"   },
  { id: "IO002", fromProcess: "BP002", toProcess: "BP003",  input: "Approved Budget",        output: "Financial Constraints", dataType: "Spreadsheet",   frequency: "Quarterly"   },
  { id: "IO003", fromProcess: "BP003", toProcess: "BP004",  input: "PO & Contracts",         output: "Procurement Data",      dataType: "System Record", frequency: "Continuous"  },
  { id: "IO004", fromProcess: "BP004", toProcess: "BP005",  input: "Work Orders",            output: "Execution Status",      dataType: "System Record", frequency: "Daily"       },
  { id: "IO005", fromProcess: "BP005", toProcess: "BP006",  input: "Delivered Output",       output: "Settlement Trigger",    dataType: "Document",      frequency: "Daily"       },
  { id: "IO006", fromProcess: "BP007", toProcess: "BP008",  input: "Hired Candidates",       output: "Onboarding Queue",      dataType: "Database Record",frequency: "Per Hire"   },
  { id: "IO007", fromProcess: "BP008", toProcess: "BP009",  input: "Active Employees",       output: "Review Pool",           dataType: "Database Record",frequency: "Annual"     },
  { id: "IO008", fromProcess: "BP008", toProcess: "BP013",  input: "New Hires",              output: "Training Cohort",       dataType: "Database Record",frequency: "Monthly"    },
  { id: "IO009", fromProcess: "BP015", toProcess: "BP003",  input: "Approved Vendors",       output: "Procurement Pipeline",  dataType: "Database Record",frequency: "Weekly"     },
  { id: "IO010", fromProcess: "BP017", toProcess: "BP018",  input: "Released Build",         output: "QA Queue",              dataType: "System Record", frequency: "Daily"       },
  { id: "IO011", fromProcess: "BP018", toProcess: "BP005",  input: "QA Sign-off",            output: "Production Release",    dataType: "Document",      frequency: "Weekly"      },
  { id: "IO012", fromProcess: "BP020", toProcess: "BP021",  input: "Qualified Leads",        output: "Sales Pipeline",        dataType: "Database Record",frequency: "Weekly"      },
  { id: "IO013", fromProcess: "BP021", toProcess: "BP004",  input: "Closed Deals",           output: "Customer Orders",       dataType: "System Record", frequency: "Continuous"  },
  { id: "IO014", fromProcess: "BP022", toProcess: "BP004",  input: "Stock Levels",           output: "Available Inventory",   dataType: "System Record", frequency: "Daily"       },
  { id: "IO015", fromProcess: "BP016", toProcess: "BP004",  input: "Active Accounts",        output: "Service Requests",      dataType: "Database Record",frequency: "Per Customer"},
];

// ---------------------------------------------------------------------
// PROCESS DEPENDENCIES
// ---------------------------------------------------------------------
export const processDependencies = [
  { fromProcess: "BP001", toProcess: "BP002", criticality: "High",     delay: 2 },
  { fromProcess: "BP002", toProcess: "BP003", criticality: "Critical", delay: 1 },
  { fromProcess: "BP003", toProcess: "BP004", criticality: "High",     delay: 3 },
  { fromProcess: "BP004", toProcess: "BP005", criticality: "Critical", delay: 0 },
  { fromProcess: "BP005", toProcess: "BP006", criticality: "High",     delay: 1 },
  { fromProcess: "BP007", toProcess: "BP008", criticality: "Critical", delay: 0 },
  { fromProcess: "BP008", toProcess: "BP009", criticality: "Medium",   delay: 5 },
  { fromProcess: "BP008", toProcess: "BP013", criticality: "Medium",   delay: 2 },
  { fromProcess: "BP013", toProcess: "BP009", criticality: "Low",      delay: 0 },
  { fromProcess: "BP015", toProcess: "BP003", criticality: "High",     delay: 1 },
  { fromProcess: "BP017", toProcess: "BP018", criticality: "Critical", delay: 0 },
  { fromProcess: "BP018", toProcess: "BP005", criticality: "High",     delay: 1 },
  { fromProcess: "BP020", toProcess: "BP021", criticality: "Medium",   delay: 2 },
  { fromProcess: "BP021", toProcess: "BP004", criticality: "High",     delay: 0 },
  { fromProcess: "BP022", toProcess: "BP004", criticality: "Medium",   delay: 0 },
  { fromProcess: "BP016", toProcess: "BP004", criticality: "Medium",   delay: 1 },
];

// ---------------------------------------------------------------------
// PROCESS KPI MAPPING
// ---------------------------------------------------------------------
export const processKPIMaps = [
  { processId: "BP001", kpiId: "K001", processName: "Strategy Definition",  kpiName: "Strategy Score",        impact: "High",     weightage: 15, target: 90,  actual: 88,  trend: "Stable" },
  { processId: "BP002", kpiId: "K002", processName: "Planning & Budgeting", kpiName: "Budget Utilization",    impact: "Critical", weightage: 20, target: 95,  actual: 96,  trend: "Up"     },
  { processId: "BP003", kpiId: "K003", processName: "Procurement Process",  kpiName: "PO Cycle Time",         impact: "High",     weightage: 12, target: 20,  actual: 22.1,trend: "Down"   },
  { processId: "BP004", kpiId: "K004", processName: "Operations Execution", kpiName: "Operational Efficiency",impact: "High",     weightage: 18, target: 85,  actual: 95,  trend: "Up"     },
  { processId: "BP005", kpiId: "K005", processName: "Delivery Management",  kpiName: "On-Time Delivery",      impact: "Critical", weightage: 15, target: 95,  actual: 85,  trend: "Down"   },
  { processId: "BP007", kpiId: "K003", processName: "Recruitment Process",  kpiName: "Time to Hire",          impact: "High",     weightage: 10, target: 30,  actual: 45,  trend: "Down"   },
  { processId: "BP008", kpiId: "K006", processName: "Employee Onboarding",  kpiName: "Onboarding Quality",    impact: "Medium",   weightage: 10, target: 8,   actual: 7.6, trend: "Stable" },
  { processId: "BP009", kpiId: "K008", processName: "Performance Review",   kpiName: "Retention Rate",        impact: "High",     weightage: 12, target: 90,  actual: 87,  trend: "Down"   },
  { processId: "BP010", kpiId: "K005", processName: "Compliance Audit",     kpiName: "Audit Compliance",      impact: "Critical", weightage: 15, target: 100, actual: 98,  trend: "Up"     },
  { processId: "BP011", kpiId: "K002", processName: "Cost Optimization",    kpiName: "Cost Savings",          impact: "High",     weightage: 14, target: 5,   actual: 3.2, trend: "Up"     },
  { processId: "BP017", kpiId: "K004", processName: "Product Development",  kpiName: "Release Velocity",      impact: "High",     weightage: 16, target: 90,  actual: 86,  trend: "Stable" },
  { processId: "BP018", kpiId: "K004", processName: "Quality Assurance",    kpiName: "Defect Density",        impact: "Critical", weightage: 18, target: 95,  actual: 96,  trend: "Up"     },
  { processId: "BP020", kpiId: "K004", processName: "Marketing Campaign",   kpiName: "Marketing ROI",         impact: "Medium",   weightage: 10, target: 85,  actual: 88,  trend: "Up"     },
  { processId: "BP021", kpiId: "K004", processName: "Sales Operations",     kpiName: "Win Rate",              impact: "High",     weightage: 14, target: 30,  actual: 25,  trend: "Down"   },
];

const _kpiByCategory: Record<string, { id: string; name: string }> = {
  Strategic: { id: "K001", name: "Strategy Score" },
  Financial: { id: "K002", name: "Budget Utilization" },
  Operations: { id: "K004", name: "Operational Efficiency" },
  Talent: { id: "K008", name: "Retention Rate" },
  Governance: { id: "K005", name: "Audit Compliance" },
};

for (const p of processList as Array<Record<string, any>>) {
  if (processKPIMaps.some((m) => m.processId === p.id)) continue;
  const mapped = _kpiByCategory[p.category] ?? { id: "K004", name: "Operational Efficiency" };
  const target = mapped.id === "K002" ? 95 : mapped.id === "K005" ? 100 : 90;
  processKPIMaps.push({
    processId: p.id,
    kpiId: mapped.id,
    processName: p.name,
    kpiName: mapped.name,
    impact: p.bottleneck ? "High" : "Medium",
    weightage: 10,
    target,
    actual: Math.max(60, Math.min(99, p.kpiScore)),
    trend: p.kpiScore < target - 3 ? "Down" : p.kpiScore > target ? "Up" : "Stable",
  });
}

// ---------------------------------------------------------------------
// PROCESS VERSIONS — change history
// ---------------------------------------------------------------------
export const processVersions: Record<string, { version: string; date: string; changes: string; author: string; status: string }[]> = {
  BP001: [
    { version: "v2.1", date: "2026-04-15", changes: "Added stakeholder alignment step",       author: "Siti Aminah",  status: "Active"   },
    { version: "v2.0", date: "2026-01-10", changes: "Process restructure for Q1 2026",        author: "Siti Aminah",  status: "Archived" },
    { version: "v1.5", date: "2025-09-22", changes: "Initial 2025 framework",                 author: "Budi Santoso", status: "Archived" },
  ],
  BP002: [
    { version: "v1.5", date: "2026-04-12", changes: "Added quarterly recurring approval",     author: "Sri Mulyani",  status: "Active"   },
    { version: "v1.4", date: "2026-02-28", changes: "Streamlined budget collection",          author: "Andi Wijaya",  status: "Archived" },
  ],
  BP003: [
    { version: "v1.2", date: "2026-04-08", changes: "Added vendor pre-qualification",         author: "Irfan Halim",  status: "Active"   },
    { version: "v1.1", date: "2025-11-30", changes: "Streamlined PO issuance",                author: "Irfan Halim",  status: "Archived" },
  ],
  BP004: [
    { version: "v1.3", date: "2026-04-22", changes: "Added daily standup",                    author: "Bambang Kusuma", status: "Active" },
  ],
  BP005: [
    { version: "v2.0", date: "2026-04-18", changes: "New quality check protocol",             author: "Sari Indah",   status: "Active"   },
    { version: "v1.5", date: "2026-01-05", changes: "Customer acceptance workflow added",     author: "Sari Indah",   status: "Archived" },
  ],
  BP006: [
    { version: "v1.4", date: "2026-04-25", changes: "Automated payment authorization",        author: "Andi Wijaya",  status: "Active"   },
  ],
  BP007: [
    { version: "v3.0", date: "2026-04-10", changes: "Major restructure; added AI screening",  author: "Lestari Putri",status: "Active"   },
    { version: "v2.5", date: "2025-12-15", changes: "Added candidate sourcing automation",    author: "Hana Setiawan",status: "Archived" },
  ],
  BP008: [
    { version: "v2.2", date: "2026-04-20", changes: "30-day check-in added",                  author: "Hana Setiawan",status: "Active"   },
  ],
  BP009: [
    { version: "v1.8", date: "2026-04-05", changes: "Calibration meeting added",              author: "Lestari Putri",status: "Active"   },
  ],
  BP010: [
    { version: "v2.4", date: "2026-03-28", changes: "Risk-based audit selection",             author: "Fitri Handayani",status: "Active" },
  ],
  BP011: [
    { version: "v1.6", date: "2026-04-02", changes: "Monthly cadence",                        author: "Sri Mulyani",  status: "Active"   },
  ],
  BP012: [
    { version: "v1.1", date: "2026-04-23", changes: "Daily allocation cycle",                 author: "Sari Indah",   status: "Active"   },
  ],
  BP013: [
    { version: "v1.3", date: "2026-04-14", changes: "Skill assessment automation",            author: "Lestari Putri",status: "Active"   },
  ],
  BP014: [
    { version: "v2.0", date: "2026-04-09", changes: "Risk register modernization",            author: "Budi Santoso", status: "Active"   },
  ],
  BP015: [
    { version: "v1.4", date: "2026-04-16", changes: "Vendor evaluation scorecard",            author: "Irfan Halim",  status: "Active"   },
  ],
  BP016: [
    { version: "v2.1", date: "2026-04-19", changes: "Self-service onboarding option",         author: "Bambang Kusuma",status: "Active"  },
  ],
  BP017: [
    { version: "v3.2", date: "2026-04-11", changes: "Sprint cadence aligned to quarterly OKRs",author: "Rini Wulandari",status: "Active" },
  ],
  BP018: [
    { version: "v1.7", date: "2026-04-26", changes: "Automated regression suite",             author: "Indah Permata",status: "Active"   },
  ],
  BP019: [
    { version: "v2.5", date: "2026-04-27", changes: "AIOps incident routing",                 author: "Rini Wulandari",status: "Active"  },
  ],
  BP020: [
    { version: "v1.9", date: "2026-04-13", changes: "Multi-channel attribution",              author: "Dewi Kurnia",  status: "Active"   },
  ],
  BP021: [
    { version: "v1.5", date: "2026-04-17", changes: "Lead qualification framework",           author: "Joko Susilo",  status: "Active"   },
  ],
  BP022: [
    { version: "v2.0", date: "2026-04-24", changes: "Daily counting cadence",                 author: "Wahyu Pradana",status: "Active"   },
  ],
};

// ---------------------------------------------------------------------
// PROCESS SIMULATIONS
// ---------------------------------------------------------------------
export const processSimulations = [
  { id: "SIM001", name: "30% Volume Increase",   scenarioType: "Growth",        impactedTime: 18.5, impactedCost: 145000, riskLevel: "High",    affectedProcesses: ["BP003", "BP004"] },
  { id: "SIM002", name: "Lean Operations",       scenarioType: "Optimization",  impactedTime: -8.2, impactedCost: -85000, riskLevel: "Medium",  affectedProcesses: ["BP004", "BP005"] },
  { id: "SIM003", name: "Compliance Tightening", scenarioType: "Regulatory",    impactedTime: 12.0, impactedCost: 65000,  riskLevel: "Low",     affectedProcesses: ["BP010"] },
];

// ---------------------------------------------------------------------
// PROCESS METRICS — derived from processList for consumer compatibility
// ---------------------------------------------------------------------
export const processMetrics: Record<string, { slaCompliance: number; avgDuration: number; delayFrequency: number; costImpact: number; resourceCount: number; criticalityScore: number; lastOptimized: string }> = Object.fromEntries(
  processList.map((p) => {
    const acts = activityList.filter((a) => a.processId === p.id);
    const totalAssigned = acts.reduce((sum, a) => sum + a.requiredHc, 0);
    return [
      p.id,
      {
        slaCompliance: Math.max(50, Math.min(100, Math.round((p.sla / Math.max(p.actualTime, p.sla)) * 100))),
        avgDuration: p.actualTime,
        delayFrequency: p.bottleneck ? Math.max(1, Math.round((p.actualTime - p.sla) * 1.5)) : 0,
        costImpact: Math.round(p.actualTime * 5000),
        resourceCount: totalAssigned,
        criticalityScore: p.kpiScore,
        lastOptimized: p.lastUpdated,
      },
    ];
  }),
);

// ---------------------------------------------------------------------
// PROCESS ACTIVITIES — derived view (used by detail pages)
// ---------------------------------------------------------------------
export const processActivities: Record<string, { seq: number; name: string; duration: number; owner: string; status: string }[]> = Object.fromEntries(
  processList.map((p) => {
    const acts = activityList
      .filter((a) => a.processId === p.id)
      .sort((x, y) => x.seq - y.seq);
    return [
      p.id,
      acts.map((a) => ({
        seq: a.seq,
        name: a.name,
        duration: a.duration,
        owner: a.assignedEmployeeNames[0] || a.role,
        status: a.status,
      })),
    ];
  }),
);

// =====================================================================
// NAVIGATION — paths match actual route files
// Business Process module has ONLY 2 submodules per OMS spec
// =====================================================================
export const navModules = [
  {
    id: "org",
    label: "Organization Management",
    icon: "Building2",
    submodules: [
      { label: "Organization Tree",  path: "/organization/tree" },
      { label: "Position Directory", path: "/organization/positions" },
      { label: "Employee Directory", path: "/organization/employees" },
    ],
  },
  {
    id: "bpm",
    label: "Business Process Management",
    icon: "GitBranch",
    submodules: [
      { label: "Process Chain",     path: "/business-process/process-chain" },
      { label: "Process Directory", path: "/business-process/process-directory" },
    ],
  },
  {
    id: "workload",
    label: "Workload & Activity Management",
    icon: "Clock",
    submodules: [
      { label: "Activity Directory",    path: "/workload-activity/activity-directory" },
      { label: "Utilization Dashboard", path: "/workload-activity/utilization-dashboard" },
      { label: "Alignment Management",  path: "/workload-activity/assignment-management" },
    ],
  },
  {
    id: "scenario",
    label: "Scenario Planning",
    icon: "BarChart3",
    submodules: [
      { label: "Scenario Directory",  path: "/scenario/directory" },
      { label: "Scenario Builder",    path: "/scenario/builder" },
      { label: "Scenario Comparison", path: "/scenario/comparison" },
    ],
  },
  {
    id: "finance",
    label: "Financial",
    icon: "DollarSign",
    submodules: [
      { label: "Cost Overview",  path: "/financial/overview" },
      { label: "Cost Breakdown", path: "/financial/breakdown" },
    ],
  },
  {
    id: "ai",
    label: "AI Module",
    icon: "BrainCircuit",
    submodules: [
      { label: "AI Insights", path: "/ai/insights" },
      { label: "AI Job Position", path: "/ai/job-position" },
    ],
  },
];

// =====================================================================
// EXTENDED EMPLOYEES (E025–E224) — generated to provide 200+ workforce
// for the Workload & Activities module. Existing E001–E024 remain
// untouched at the top of the file (referenced by activityList).
// =====================================================================
const _firstNames = [
  "Adi","Bayu","Cahyo","Dimas","Eka","Fajar","Galih","Hadi","Iwan","Jaya",
  "Kiki","Lukman","Mira","Nia","Okta","Putra","Rian","Surya","Tegar","Umar",
  "Vina","Wati","Yana","Zahra","Aulia","Beni","Chandra","Dian","Erni","Farhan",
];
const _lastNames = [
  "Pratama","Wijaya","Sari","Kusuma","Hidayat","Santoso","Permata","Susilo",
  "Wibowo","Anggraini","Putri","Halim","Setiawan","Maharani","Pradana","Aminah",
  "Kurniawan","Mulyani","Saputra","Handayani","Lestari","Hakim","Indah","Dewi",
];
const _deptIds = ["D01","D02","D03","D04","D05","D06","D07","D08","D09","D10","D11","D12"];
const _gradeMap: Record<string, { grade: string; level: string; salary: number }> = {
  Junior:  { grade: "G3", level: "Junior",  salary: 70000  },
  Mid:     { grade: "G5", level: "Mid",     salary: 95000  },
  Senior:  { grade: "G6", level: "Senior",  salary: 125000 },
  Lead:    { grade: "G7", level: "Lead",    salary: 155000 },
  Manager: { grade: "G7", level: "Manager", salary: 145000 },
};
const _levels = ["Junior","Mid","Senior","Lead","Manager"] as const;
const _positions: Record<string, string[]> = {
  D01: ["Software Engineer","DevOps Engineer","QA Engineer","System Analyst","Data Engineer"],
  D02: ["HR Specialist","HR Business Partner","Talent Acquisition","L&D Specialist"],
  D03: ["Financial Analyst","Accountant","Treasury Officer","Tax Specialist"],
  D04: ["Operations Analyst","Production Supervisor","Logistics Coordinator","Plant Engineer"],
  D05: ["Marketing Specialist","Brand Executive","Digital Marketer","Content Strategist"],
  D06: ["Legal Counsel","Compliance Officer","Contract Specialist"],
  D07: ["Procurement Officer","Sourcing Specialist","Vendor Manager"],
  D08: ["Strategy Analyst","Business Analyst","Project Manager"],
  D09: ["Compliance Analyst","Legal Officer","Risk Analyst"],
  D10: ["Fleet Planner","Vessel Operations Analyst","Marine Coordinator"],
  D11: ["Service Desk Officer","Customer Relations Officer","Terminal Service Analyst"],
  D12: ["Corporate Planning Analyst","PMO Analyst","Transformation Officer"],
};
const _deptNameMap: Record<string, string> = {
  D01: "Direksi & Corporate Office",
  D02: "Divisi Finance & Governance",
  D03: "Divisi Human Capital Management",
  D04: "Divisi Operasi Terminal",
  D05: "Divisi Digital Transformation",
  D06: "Divisi IT Infrastructure",
  D07: "Divisi Komersial & Customer Solutions",
  D08: "Divisi Procurement",
  D09: "Divisi Legal & Compliance",
  D10: "Divisi Pelayanan Kapal",
  D11: "Divisi Port Services",
  D12: "Divisi Strategy & Corporate Planning",
};
const _locations = ["Jakarta","Bandung","Surabaya","Medan","Yogyakarta"];
const _statusOptions = ["Active","Active","Active","Active","Active","On Leave"];

function _hashIdx(seed: number, mod: number): number {
  return Math.abs(Math.sin(seed) * 10000) % 1 * mod | 0;
}

const _extendedEmployees = Array.from({ length: 200 }, (_, i) => {
  const idNum = 25 + i;
  const id = `E${String(idNum).padStart(3, "0")}`;
  const fnIdx = _hashIdx(idNum * 1.3, _firstNames.length);
  const lnIdx = _hashIdx(idNum * 2.7, _lastNames.length);
  const deptId = _deptIds[_hashIdx(idNum * 3.1, _deptIds.length)];
  const dept = _deptNameMap[deptId];
  const positionPool = _positions[deptId];
  const positionTitle = positionPool[_hashIdx(idNum * 4.3, positionPool.length)];
  const lvl = _levels[_hashIdx(idNum * 5.7, _levels.length)];
  const gm = _gradeMap[lvl];
  const status = _statusOptions[_hashIdx(idNum * 6.1, _statusOptions.length)];
  const utilization = status === "On Leave" ? 0 : 60 + _hashIdx(idNum * 7.3, 40);
  const kpiScore = 65 + _hashIdx(idNum * 8.1, 30);
  const tenure = 1 + _hashIdx(idNum * 9.5, 7);
  const hireYear = 2026 - tenure;
  const hireMonth = String(1 + _hashIdx(idNum * 10.7, 12)).padStart(2, "0");
  const hireDay = String(1 + _hashIdx(idNum * 11.3, 27)).padStart(2, "0");
  return {
    id,
    name: `${_firstNames[fnIdx]} ${_lastNames[lnIdx]}`,
    position: `${lvl} ${positionTitle}`,
    dept,
    deptId,
    grade: gm.grade,
    level: lvl,
    status,
    salary: gm.salary,
    cost: Math.round(gm.salary * 1.2),
    utilization,
    kpiScore,
    manager: "Department Head",
    managerId: null as string | null,
    hireDate: `${hireYear}-${hireMonth}-${hireDay}`,
    tenure,
    email: `${_firstNames[fnIdx].toLowerCase()}.${_lastNames[lnIdx].toLowerCase()}@company.com`,
    phone: `+62-811-${String(200 + idNum).padStart(3, "0")}-${String(100 + (idNum % 1000)).padStart(4, "0")}`,
    location: _locations[_hashIdx(idNum * 12.7, _locations.length)],
    reportingTo: null as string | null,
    riskScore: 10 + _hashIdx(idNum * 13.1, 50),
  };
});

// employeesAll exposes the full 224-person roster; the named E001–E024 stay
// available via the original `employees` export for legacy pages.
export const employeesAll = [..._rawEmployees, ..._extendedEmployees];

// ---------------------------------------------------------------------
// FLOW NORMALIZATION: Org -> Process+KPI -> Activities -> Workload
// Keeps data believable and connected for BUMN-style operating model.
// ---------------------------------------------------------------------
for (const process of processList as Array<Record<string, any>>) {
  const processKpi = processKPIMaps.find((m) => m.processId === process.id);
  const processActivitiesRows = activityList.filter((a) => a.processId === process.id);
  const ownerCandidate =
    employeesAll.find((e) => e.position === process.ownerPosition) ??
    employeesAll.find((e) => e.position === process.owner) ??
    employeesAll.find((e) => e.id === process.ownerId);
  const deptEmployees = employeesAll.filter((e) => e.deptId === process.deptId && e.status === "Active");
  const fallbackPool = deptEmployees.length > 0 ? deptEmployees : employeesAll.filter((e) => e.status === "Active");
  process.ownerId = ownerCandidate?.id ?? process.ownerId;
  process.owner = ownerCandidate?.name ?? process.owner;
  if (processKpi) {
    process.kpiScore = Math.max(60, Math.min(98, Math.round(Number(processKpi.actual))));
  }

  processActivitiesRows.forEach((activity, idx) => {
    const requiredHc = Math.max(activity.requiredHc ?? 1, 1);
    const selected: string[] = [];
    if (ownerCandidate?.id) selected.push(ownerCandidate.id);
    for (const candidate of fallbackPool) {
      if (selected.length >= requiredHc) break;
      if (!selected.includes(candidate.id)) selected.push(candidate.id);
    }
    const finalAssignees = selected.length ? selected : [fallbackPool[0]?.id ?? "E001"];
    activity.assignedEmployees = finalAssignees;
    activity.assignedEmployeeNames = finalAssignees
      .map((id) => employeesAll.find((e) => e.id === id)?.name)
      .filter(Boolean) as string[];
    activity.requiredHc = Math.max(activity.requiredHc ?? finalAssignees.length, finalAssignees.length);
    activity.role = process.ownerPosition;
    activity.position = process.ownerPosition;
    const monthlyFrequency =
      activity.frequency === "Daily" ? 22 :
      activity.frequency === "Weekly" ? 4 :
      activity.frequency === "Monthly" ? 1 :
      activity.frequency === "Quarterly" ? 0.33 : 1;
    activity.workloadHours = Math.round(activity.duration * monthlyFrequency * 100) / 100;
    const utilBase = process.bottleneck ? 98 : 82;
    activity.utilization = Math.max(55, Math.min(130, utilBase + (idx % 4) * 6 - 6));
    activity.status = process.bottleneck && idx === Math.floor(processActivitiesRows.length / 2) ? "Bottleneck" : "Active";
    activity.staffingStatus = activity.requiredHc > finalAssignees.length ? "Understaffed" : "Balanced";
  });
}

// =====================================================================
// WORKLOAD MODULE — calculation engine constants & derived datasets
// =====================================================================
export const WORKLOAD_CONSTANTS = {
  monthlyHours: 160,           // standard monthly hours
  productivityFactor: 0.85,    // adjustment factor
};

// Frequency multiplier → executions per month
export const _freqPerMonth: Record<string, number> = {
  Daily: 22,
  Weekly: 4,
  Monthly: 1,
  Quarterly: 1 / 3,
  "Semi-Annual": 1 / 6,
  Annual: 1 / 12,
  "Per Hire": 1,
  "Per Customer": 4,
  Continuous: 22,
};

export type ComplexityLevel = "Low" | "Medium" | "High" | "Critical";
export type Criticality = "Critical" | "High" | "Medium" | "Low";
export type StaffingStatus =
  | "Overloaded"
  | "Balanced"
  | "Underutilized"
  | "Significantly Underutilized"
  | "Understaffed";

export const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, number> = {
  Low: 1.0,
  Medium: 1.25,
  High: 1.5,
  Critical: 1.75,
};

export type WorkloadActivity = {
  id: string;
  activityCode: string;
  processId: string;
  processCode: string;
  processName: string;
  processCategory: string;
  seq: number;
  name: string;
  description: string;
  // Frequency
  frequency: string;            // legacy: "Daily" | "Weekly" | ...
  frequencyType: "Daily" | "Weekly" | "Monthly" | "Event-based";
  frequencyValue: number;       // executions per month (resolved)
  duration: number;             // hours per execution
  durationUnit: string;
  // People
  role: string;
  position: string;
  responsiblePosition: string;
  assignedEmployees: string[];
  assignedEmployeeNames: string[];
  // Calculation inputs
  complexityLevel: ComplexityLevel;
  complexityMultiplier: number;
  reworkRate: number;           // 0..1
  qualityReviewFactor: number;
  seasonalPeakFactor: number;
  productivityFactor: number;
  monthlyCapacity: number;
  effectiveCapacityPerFte: number;
  // Workload outputs
  baseWorkload: number;         // hours/month before adjustments
  adjustedWorkload: number;     // hours/month after multipliers
  workloadDemand: number;       // alias of adjustedWorkload, kept for back-compat
  requiredHc: number;
  assignedHc: number;
  hcGap: number;
  utilization: number;          // 0..150 percent
  // Status
  status: "Overloaded" | "Balanced" | "Underutilized";
  staffingStatus: StaffingStatus;
  criticality: Criticality;
  // Org links
  department: string;
  departmentId: string;
  // Process chain
  linkedKpiId: string;
  linkedKpi: string;
  previousActivityId: string | null;
  previousActivityName: string | null;
  nextActivityId: string | null;
  nextActivityName: string | null;
  // Time series (last 6 months trend)
  trend: number[];
};

function _statusFromUtil(u: number): "Overloaded" | "Balanced" | "Underutilized" {
  if (u > 100) return "Overloaded";
  if (u >= 70) return "Balanced";
  return "Underutilized";
}

function _staffingStatusFor(util: number, requiredHc: number, assignedHc: number): StaffingStatus {
  // Required HC > Assigned HC takes priority — surfaces understaffed condition
  if (requiredHc > assignedHc + 0.05 && util > 100) return "Understaffed";
  if (util > 110) return "Overloaded";
  if (util >= 90) return "Balanced";
  if (util >= 70) return "Underutilized";
  return "Significantly Underutilized";
}

function _frequencyTypeFor(freq: string): "Daily" | "Weekly" | "Monthly" | "Event-based" {
  if (freq === "Daily") return "Daily";
  if (freq === "Weekly") return "Weekly";
  if (freq === "Monthly") return "Monthly";
  return "Event-based";
}

// Map process category to default complexity / quality / seasonal factors.
function _processWorkloadAttrs(p: (typeof processList)[number], idx: number) {
  const isStrategic = p.category === "Strategic" || p.category === "Governance";
  const isBottleneck = p.bottleneck;
  const baseComplexity: ComplexityLevel =
    isStrategic && isBottleneck ? "Critical"
    : isStrategic ? "High"
    : isBottleneck ? "High"
    : p.efficiency < 85 ? "Medium"
    : "Low";
  // small per-activity rotation so within a process not all are identical
  const rotation: ComplexityLevel[] =
    baseComplexity === "Low" ? ["Low", "Medium", "Low", "Medium", "Low"]
    : baseComplexity === "Medium" ? ["Medium", "High", "Medium", "Low", "Medium"]
    : baseComplexity === "High" ? ["High", "High", "Medium", "Critical", "High"]
    : ["Critical", "High", "Critical", "High", "Critical"];
  const complexityLevel = rotation[idx % rotation.length];

  const reworkRate = isBottleneck ? 0.12 : p.efficiency < 85 ? 0.08 : 0.05;
  const qualityReviewFactor = p.category === "Governance" ? 1.15 : 1.1;
  const seasonalPeakFactor =
    p.frequency === "Annual" || p.frequency === "Quarterly" ? 1.3
    : p.frequency === "Daily" || p.frequency === "Continuous" ? 1.1
    : 1.2;

  const criticality: Criticality =
    p.kpiScore < 70 ? "Critical"
    : p.kpiScore < 80 ? "High"
    : p.kpiScore < 90 ? "Medium"
    : "Low";

  return { complexityLevel, reworkRate, qualityReviewFactor, seasonalPeakFactor, criticality };
}

// Map process category → linked KPI label (deterministic, derived from kpiList where possible).
const _processCategoryToKpiCategory: Record<string, string> = {
  Strategic: "Operations",
  Financial: "Financial",
  Operations: "Operations",
  Talent: "Workforce",
  Governance: "Governance",
};
function _kpiForProcess(p: (typeof processList)[number]): { id: string; name: string } {
  const cat = _processCategoryToKpiCategory[p.category] ?? p.category;
  const candidate = kpiList.find((k) => k.category === cat);
  if (candidate) return { id: candidate.id, name: candidate.name };
  return { id: kpiList[0]?.id ?? "KPI-GEN", name: kpiList[0]?.name ?? "Operational Excellence" };
}

// Each activity gets the full Spec workload formula:
//   Base Workload Hours = Frequency × Duration
//   Adjusted Workload = Base × Complexity × Quality × Seasonal × (1 + Rework)
//   Effective Capacity per FTE = Standard Monthly Capacity × Productivity Factor
//   Required HC = Adjusted Workload / Effective Capacity per FTE
//   Utilization = Adjusted Workload / Total Assigned Effective Capacity
export const workloadActivities: WorkloadActivity[] = activityList.map((a) => {
  const proc = processList.find((p) => p.id === a.processId)!;
  const dept = departments.find((d) => d.name === proc?.dept);
  const execPerMonth = _freqPerMonth[a.frequency] ?? 1;
  const attrs = _processWorkloadAttrs(proc, a.seq - 1);
  const kpi = _kpiForProcess(proc);

  const monthlyCapacity = WORKLOAD_CONSTANTS.monthlyHours;
  const productivityFactor = WORKLOAD_CONSTANTS.productivityFactor;
  const effectiveCapacityPerFte = monthlyCapacity * productivityFactor;

  const baseWorkload = a.duration * execPerMonth;
  const adjustedWorkloadRaw =
    baseWorkload *
    COMPLEXITY_MULTIPLIERS[attrs.complexityLevel] *
    attrs.qualityReviewFactor *
    attrs.seasonalPeakFactor *
    (1 + attrs.reworkRate);
  // Normalize to realistic monthly workload band so activity-level values remain believable.
  const adjustedWorkload = Math.max(8, Math.min(220, adjustedWorkloadRaw));

  const requiredHcRaw = adjustedWorkload / effectiveCapacityPerFte;
  const requiredHc = Math.max(0.3, Math.round(requiredHcRaw * 100) / 100);
  const baselineAssignmentFactor =
    attrs.criticality === "Critical" ? 0.88 :
    attrs.criticality === "High" ? 0.95 :
    attrs.criticality === "Medium" ? 1.0 : 1.08;
  const seqAdjustment = ((a.seq % 5) - 2) * 0.03; // deterministic -0.06 .. +0.06
  const assignedHc = Math.max(0.3, Math.round(requiredHc * (baselineAssignmentFactor + seqAdjustment) * 10) / 10);
  const totalAssignedEffectiveCap = assignedHc * effectiveCapacityPerFte;
  const utilizationRaw = totalAssignedEffectiveCap > 0
    ? Math.round((adjustedWorkload / totalAssignedEffectiveCap) * 100)
    : 0;
  const utilization = Math.max(55, Math.min(135, utilizationRaw));

  // 6-month trend (deterministic, derived from utilization)
  const trend = [-5, -2, 0, 3, 5, 0].map((delta, i) =>
    Math.max(40, Math.min(140, utilization + delta + ((a.seq + i) % 4))),
  );

  // Resolve previous/next activity by sequence within process
  const sibs = activityList.filter((s) => s.processId === a.processId);
  const prev = sibs.find((s) => s.seq === a.seq - 1);
  const next = sibs.find((s) => s.seq === a.seq + 1);

  return {
    ...a,
    activityCode: `ACT-${proc.code}-${String(a.seq).padStart(2, "0")}`,
    processCategory: proc.category,
    description: `${a.name} for ${proc.name}, executed ${proc.frequency.toLowerCase()} by the ${a.role} role.`,
    frequencyType: _frequencyTypeFor(a.frequency),
    frequencyValue: Math.round(execPerMonth * 100) / 100,
    durationUnit: a.durationUnit ?? "hours",
    responsiblePosition: a.position,
    complexityLevel: attrs.complexityLevel,
    complexityMultiplier: COMPLEXITY_MULTIPLIERS[attrs.complexityLevel],
    reworkRate: attrs.reworkRate,
    qualityReviewFactor: attrs.qualityReviewFactor,
    seasonalPeakFactor: attrs.seasonalPeakFactor,
    productivityFactor,
    monthlyCapacity,
    effectiveCapacityPerFte,
    baseWorkload: Math.round(baseWorkload * 100) / 100,
    adjustedWorkload: Math.round(adjustedWorkload * 100) / 100,
    workloadDemand: Math.round(adjustedWorkload * 100) / 100,
    requiredHc,
    assignedHc,
    hcGap: Math.round((requiredHc - assignedHc) * 100) / 100,
    utilization,
    status: _statusFromUtil(utilization),
    staffingStatus: _staffingStatusFor(utilization, requiredHc, assignedHc),
    criticality: attrs.criticality,
    department: proc?.dept || "Unassigned",
    departmentId: dept?.id || "D00",
    linkedKpiId: kpi.id,
    linkedKpi: kpi.name,
    previousActivityId: prev ? `ACT_${proc.id}_${prev.seq}` : null,
    previousActivityName: prev ? prev.name : null,
    nextActivityId: next ? `ACT_${proc.id}_${next.seq}` : null,
    nextActivityName: next ? next.name : null,
    trend,
  };
});

// Aggregated: workload per role (position title).
export const workloadByRole = (() => {
  const map = new Map<string, { role: string; demand: number; assignedHc: number }>();
  workloadActivities.forEach((w) => {
    const cur = map.get(w.role) ?? { role: w.role, demand: 0, assignedHc: 0 };
    cur.demand += w.workloadDemand;
    cur.assignedHc = Math.max(cur.assignedHc, w.assignedHc);
    map.set(w.role, cur);
  });
  return Array.from(map.values()).map((r) => {
    const capacity = r.assignedHc * WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor;
    const util = capacity > 0 ? Math.round((r.demand / capacity) * 100) : 0;
    const requiredHc = Math.max(1, Math.round(r.demand / (WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor) * 10) / 10);
    return {
      role: r.role,
      demand: Math.round(r.demand),
      capacity: Math.round(capacity),
      gap: Math.round((requiredHc - r.assignedHc) * 10) / 10,
      utilization: util,
      assignedHc: r.assignedHc,
      requiredHc,
    };
  }).sort((a, b) => b.demand - a.demand);
})();

// Aggregated: workload per department.
export const workloadByDepartment = (() => {
  const map = new Map<string, { dept: string; demand: number; activities: number }>();
  workloadActivities.forEach((w) => {
    const cur = map.get(w.department) ?? { dept: w.department, demand: 0, activities: 0 };
    cur.demand += w.workloadDemand;
    cur.activities += 1;
    map.set(w.department, cur);
  });
  return Array.from(map.values()).map((d) => {
    const headcount = employeesAll.filter((e) => e.dept === d.dept && e.status === "Active").length;
    const capacity = headcount * WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor;
    const util = capacity > 0 ? Math.round((d.demand / capacity) * 100) : 0;
    return {
      dept: d.dept,
      demand: Math.round(d.demand),
      capacity: Math.round(capacity),
      headcount,
      utilization: util,
      activities: d.activities,
      status: _statusFromUtil(util),
    };
  }).sort((a, b) => b.demand - a.demand);
})();

// Heatmap matrix: rows = role, cols = department, value = utilization %.
export const workloadHeatmap = (() => {
  const cells: { dept: string; role: string; utilization: number; demand: number }[] = [];
  const deptList = workloadByDepartment.map((d) => d.dept);
  const roleSet = new Set<string>();
  workloadActivities.forEach((w) => roleSet.add(w.role));
  const roleList = Array.from(roleSet).slice(0, 14);
  deptList.forEach((dept) => {
    roleList.forEach((role) => {
      const acts = workloadActivities.filter((w) => w.department === dept && w.role === role);
      if (acts.length === 0) return;
      const demand = acts.reduce((s, a) => s + a.workloadDemand, 0);
      const assigned = Math.max(...acts.map((a) => a.assignedHc));
      const cap = assigned * WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor;
      const util = cap > 0 ? Math.round((demand / cap) * 100) : 0;
      cells.push({ dept, role, utilization: util, demand: Math.round(demand) });
    });
  });
  return { cells, departments: deptList, roles: roleList };
})();

// Per-employee load (real assignments). Inactive/unassigned employees still
// appear with demand 0 so the assignment grid covers the whole workforce.
export const employeeLoad = (() => {
  const loadMap = new Map<string, { activityIds: string[]; demand: number }>();
  workloadActivities.forEach((w) => {
    const perPerson = w.assignedHc > 0 ? w.workloadDemand / w.assignedHc : 0;
    w.assignedEmployees.forEach((eid) => {
      const cur = loadMap.get(eid) ?? { activityIds: [], demand: 0 };
      cur.activityIds.push(w.id);
      cur.demand += perPerson;
      loadMap.set(eid, cur);
    });
  });
  return employeesAll.map((emp) => {
    const load = loadMap.get(emp.id) ?? { activityIds: [], demand: 0 };
    const capacity = WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor;
    const util = Math.round((load.demand / capacity) * 100);
    return {
      employeeId: emp.id,
      employeeName: emp.name,
      role: emp.position,
      department: emp.dept,
      assignedActivityIds: load.activityIds,
      assignedActivities: load.activityIds.length,
      totalLoad: Math.round(load.demand),
      capacity: Math.round(capacity),
      utilization: util,
      status: emp.status === "On Leave" ? "On Leave" : _statusFromUtil(util),
    };
  });
})();

// Monthly utilization trend (for Utilization Dashboard).
export const utilizationTrend = [
  { month: "Nov 25", utilization: 78 },
  { month: "Dec 25", utilization: 81 },
  { month: "Jan 26", utilization: 85 },
  { month: "Feb 26", utilization: 88 },
  { month: "Mar 26", utilization: 91 },
  { month: "Apr 26", utilization: 87 },
];

// =====================================================================
// WORKFORCE PLANNING — derived from workload + employees
// =====================================================================

// Annual attrition assumption per department (%, used by HC Planning).
export const attritionAssumption: Record<string, number> = {
  "Technology":      8,
  "Operations":      6,
  "Finance":         4,
  "Human Resources": 5,
  "Marketing":       12,
  "Procurement":     5,
  "Legal":           3,
  "Strategy":        7,
};

// Recruitment SLA targets (days-to-fill) per priority level.
export const recruitmentSLA: Record<string, number> = {
  Critical: 30,
  High:     45,
  Medium:   60,
  Low:      90,
};

// Required HC by department (Workload demand → headcount need).
export const requiredHcByDept = (() => {
  return workloadByDepartment.map((w) => {
    const requiredHc = Math.max(
      1,
      Math.round(
        (w.demand /
          (WORKLOAD_CONSTANTS.monthlyHours * WORKLOAD_CONSTANTS.productivityFactor)) * 10,
      ) / 10,
    );
    const currentHc = w.headcount;
    const attrition = attritionAssumption[w.dept] ?? 6;
    // Effective current HC after annual attrition
    const effectiveCurrent = Math.round((currentHc * (1 - attrition / 100)) * 10) / 10;
    const gap = Math.round((requiredHc - effectiveCurrent) * 10) / 10;
    return {
      dept: w.dept,
      requiredHc,
      currentHc,
      effectiveCurrent,
      attrition,
      gap,
      status: gap > 5 ? "Critical" : gap > 2 ? "High" : gap > 0 ? "Medium" : "OK",
    };
  });
})();

// =====================================================================
// HC PLANNING — HcPlanRow type + 50+ rows
// =====================================================================
export type HcPlanRow = {
  id: string;
  dept: string;
  role: string;
  workloadHours: number;
  requiredHc: number;
  currentHc: number;
  plannedHc: number;
  hcGap: number;
  plannedGapCoverage: number;
  remainingGap: number;
  utilizationForecast: number;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  hiringPriority: "Critical" | "High" | "Medium" | "Low";
  hiringTimeline: "Immediate" | "3 months" | "6 months";
  workforceType: "Full-time" | "Contractor" | "Outsourced";
  linkedProcesses: string[];
  status: "Draft" | "Approved" | "Active";
};

export const hcPlanRows: HcPlanRow[] = [
  { id: "HC001", dept: "Technology",      role: "Software Engineer",                workloadHours: 1280, requiredHc: 9,  currentHc: 6,  plannedHc: 8,  hcGap: 3,  plannedGapCoverage: 2,  remainingGap: 1,  utilizationForecast: 113, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["Product Dev Cycle","Software Delivery"],     status: "Active" },
  { id: "HC002", dept: "Technology",      role: "Senior Software Engineer",         workloadHours: 960,  requiredHc: 7,  currentHc: 4,  plannedHc: 6,  hcGap: 3,  plannedGapCoverage: 2,  remainingGap: 1,  utilizationForecast: 117, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["Tech Lead Review","Architecture Planning"],  status: "Active" },
  { id: "HC003", dept: "Technology",      role: "Data Scientist",                   workloadHours: 620,  requiredHc: 5,  currentHc: 2,  plannedHc: 4,  hcGap: 3,  plannedGapCoverage: 2,  remainingGap: 1,  utilizationForecast: 125, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["Analytics Pipeline","AI Model Dev"],         status: "Draft" },
  { id: "HC004", dept: "Technology",      role: "DevOps Engineer",                  workloadHours: 480,  requiredHc: 4,  currentHc: 2,  plannedHc: 3,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 107, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["CI/CD Pipeline","Infrastructure Mgmt"],      status: "Draft" },
  { id: "HC005", dept: "Technology",      role: "QA Engineer",                      workloadHours: 320,  requiredHc: 3,  currentHc: 2,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 0,  remainingGap: 1,  utilizationForecast: 95,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["QA Cycle","Regression Testing"],             status: "Approved" },
  { id: "HC006", dept: "Technology",      role: "System Analyst",                   workloadHours: 280,  requiredHc: 2,  currentHc: 2,  plannedHc: 2,  hcGap: 0,  plannedGapCoverage: 0,  remainingGap: 0,  utilizationForecast: 88,  riskLevel: "Low",      hiringPriority: "Low",      hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Requirements Analysis"],                     status: "Approved" },
  { id: "HC007", dept: "Technology",      role: "Tech Lead",                        workloadHours: 240,  requiredHc: 2,  currentHc: 1,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 90,  riskLevel: "Medium",   hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Tech Planning","Sprint Management"],         status: "Draft" },
  { id: "HC008", dept: "Operations",      role: "Operations Analyst",               workloadHours: 1040, requiredHc: 8,  currentHc: 5,  plannedHc: 7,  hcGap: 3,  plannedGapCoverage: 2,  remainingGap: 1,  utilizationForecast: 115, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["Ops Monitoring","Process Control"],          status: "Active" },
  { id: "HC009", dept: "Operations",      role: "Operations Manager",               workloadHours: 560,  requiredHc: 4,  currentHc: 3,  plannedHc: 4,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 92,  riskLevel: "Medium",   hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Ops Planning","KPI Monitoring"],             status: "Approved" },
  { id: "HC010", dept: "Operations",      role: "Logistics Coordinator",            workloadHours: 440,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 89,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Logistics Planning","Vendor Liaison"],       status: "Draft" },
  { id: "HC011", dept: "Operations",      role: "Production Supervisor",            workloadHours: 380,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 87,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Production Control"],                        status: "Draft" },
  { id: "HC012", dept: "Operations",      role: "Port Operations Analyst",          workloadHours: 850,  requiredHc: 6,  currentHc: 3,  plannedHc: 5,  hcGap: 3,  plannedGapCoverage: 2,  remainingGap: 1,  utilizationForecast: 120, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["Vessel Scheduling","Berthing Process"],      status: "Active" },
  { id: "HC013", dept: "Finance",         role: "Financial Analyst",                workloadHours: 720,  requiredHc: 5,  currentHc: 4,  plannedHc: 5,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 90,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Financial Reporting","Budget Planning"],     status: "Approved" },
  { id: "HC014", dept: "Finance",         role: "Senior Finance Manager",           workloadHours: 400,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 88,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Finance Control","Budget Review"],           status: "Active" },
  { id: "HC015", dept: "Finance",         role: "Treasury Officer",                 workloadHours: 280,  requiredHc: 2,  currentHc: 2,  plannedHc: 2,  hcGap: 0,  plannedGapCoverage: 0,  remainingGap: 0,  utilizationForecast: 83,  riskLevel: "Low",      hiringPriority: "Low",      hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Cash Management"],                           status: "Approved" },
  { id: "HC016", dept: "Finance",         role: "Tax Specialist",                   workloadHours: 240,  requiredHc: 2,  currentHc: 1,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 91,  riskLevel: "Medium",   hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Tax Filing","Compliance Review"],            status: "Draft" },
  { id: "HC017", dept: "Finance",         role: "Accountant",                       workloadHours: 320,  requiredHc: 3,  currentHc: 2,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 0,  remainingGap: 1,  utilizationForecast: 106, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["GL Accounting","Month-End Close"],           status: "Draft" },
  { id: "HC018", dept: "Human Resources", role: "HR Specialist",                    workloadHours: 480,  requiredHc: 4,  currentHc: 3,  plannedHc: 4,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 88,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["HR Operations","Employee Relations"],        status: "Approved" },
  { id: "HC019", dept: "Human Resources", role: "Talent Acquisition Specialist",    workloadHours: 520,  requiredHc: 4,  currentHc: 2,  plannedHc: 4,  hcGap: 2,  plannedGapCoverage: 2,  remainingGap: 0,  utilizationForecast: 95,  riskLevel: "Medium",   hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Recruitment Cycle","Onboarding"],            status: "Active" },
  { id: "HC020", dept: "Human Resources", role: "L&D Specialist",                   workloadHours: 280,  requiredHc: 2,  currentHc: 1,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 86,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Training Delivery","Development Plans"],     status: "Draft" },
  { id: "HC021", dept: "Human Resources", role: "Workforce Planning Analyst",       workloadHours: 680,  requiredHc: 5,  currentHc: 2,  plannedHc: 4,  hcGap: 3,  plannedGapCoverage: 2,  remainingGap: 1,  utilizationForecast: 126, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["HC Planning Cycle","Workforce Analytics"],   status: "Active" },
  { id: "HC022", dept: "Human Resources", role: "HR Business Partner",              workloadHours: 340,  requiredHc: 3,  currentHc: 2,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 0,  remainingGap: 1,  utilizationForecast: 108, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Business Partnering","Org Dev Support"],     status: "Draft" },
  { id: "HC023", dept: "Marketing",       role: "Digital Marketer",                 workloadHours: 400,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 85,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Digital Campaigns","SEO/SEM"],               status: "Approved" },
  { id: "HC024", dept: "Marketing",       role: "Brand Executive",                  workloadHours: 320,  requiredHc: 2,  currentHc: 2,  plannedHc: 2,  hcGap: 0,  plannedGapCoverage: 0,  remainingGap: 0,  utilizationForecast: 82,  riskLevel: "Low",      hiringPriority: "Low",      hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Brand Strategy","Campaign Planning"],        status: "Approved" },
  { id: "HC025", dept: "Marketing",       role: "Content Strategist",               workloadHours: 280,  requiredHc: 2,  currentHc: 1,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 90,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Content Planning","Social Media Mgmt"],      status: "Draft" },
  { id: "HC026", dept: "Marketing",       role: "Marketing Specialist",             workloadHours: 360,  requiredHc: 3,  currentHc: 2,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 0,  remainingGap: 1,  utilizationForecast: 103, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Market Research","Campaign Execution"],      status: "Draft" },
  { id: "HC027", dept: "Marketing",       role: "Marketing Analytics Lead",         workloadHours: 540,  requiredHc: 4,  currentHc: 1,  plannedHc: 3,  hcGap: 3,  plannedGapCoverage: 2,  remainingGap: 1,  utilizationForecast: 135, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["Mktg Performance","Attribution Analytics"],  status: "Active" },
  { id: "HC028", dept: "Procurement",     role: "Procurement Officer",              workloadHours: 480,  requiredHc: 4,  currentHc: 3,  plannedHc: 4,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 88,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Procurement Cycle","Vendor Eval"],           status: "Approved" },
  { id: "HC029", dept: "Procurement",     role: "Sourcing Specialist",              workloadHours: 360,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 86,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Sourcing Strategy","RFP Management"],        status: "Draft" },
  { id: "HC030", dept: "Procurement",     role: "Vendor Manager",                   workloadHours: 280,  requiredHc: 2,  currentHc: 2,  plannedHc: 2,  hcGap: 0,  plannedGapCoverage: 0,  remainingGap: 0,  utilizationForecast: 82,  riskLevel: "Low",      hiringPriority: "Low",      hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Vendor Relations"],                          status: "Approved" },
  { id: "HC031", dept: "Procurement",     role: "Procurement Analyst",              workloadHours: 480,  requiredHc: 4,  currentHc: 2,  plannedHc: 3,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 115, riskLevel: "Critical", hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Spend Analysis","Contract Management"],      status: "Active" },
  { id: "HC032", dept: "Legal",           role: "Legal Counsel",                    workloadHours: 480,  requiredHc: 4,  currentHc: 3,  plannedHc: 4,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 89,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Legal Advisory","Contract Review"],          status: "Approved" },
  { id: "HC033", dept: "Legal",           role: "Compliance Officer",               workloadHours: 320,  requiredHc: 3,  currentHc: 2,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 0,  remainingGap: 1,  utilizationForecast: 104, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Regulatory Compliance","Risk Audit"],        status: "Draft" },
  { id: "HC034", dept: "Legal",           role: "Contract Specialist",              workloadHours: 280,  requiredHc: 2,  currentHc: 2,  plannedHc: 2,  hcGap: 0,  plannedGapCoverage: 0,  remainingGap: 0,  utilizationForecast: 82,  riskLevel: "Low",      hiringPriority: "Low",      hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Contract Management"],                       status: "Approved" },
  { id: "HC035", dept: "Strategy",        role: "Strategy Analyst",                 workloadHours: 400,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 88,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Strategy Formulation","OKR Planning"],       status: "Approved" },
  { id: "HC036", dept: "Strategy",        role: "Business Analyst",                 workloadHours: 360,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 86,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Business Case Dev","Requirements"],          status: "Draft" },
  { id: "HC037", dept: "Strategy",        role: "Project Manager",                  workloadHours: 480,  requiredHc: 4,  currentHc: 2,  plannedHc: 3,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 108, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Project Delivery","PMO Governance"],         status: "Active" },
  { id: "HC038", dept: "Operations",      role: "Plant Engineer",                   workloadHours: 340,  requiredHc: 3,  currentHc: 2,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 0,  remainingGap: 1,  utilizationForecast: 102, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Plant Operations","Maintenance Planning"],   status: "Draft" },
  { id: "HC039", dept: "Technology",      role: "Data Engineer",                    workloadHours: 560,  requiredHc: 4,  currentHc: 2,  plannedHc: 3,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 119, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["Data Pipeline","ETL Management"],            status: "Active" },
  { id: "HC040", dept: "Finance",         role: "Budget Controller",                workloadHours: 360,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 88,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Budget Control","Variance Analysis"],        status: "Draft" },
  { id: "HC041", dept: "Human Resources", role: "HR Data Officer",                  workloadHours: 620,  requiredHc: 5,  currentHc: 2,  plannedHc: 3,  hcGap: 3,  plannedGapCoverage: 1,  remainingGap: 2,  utilizationForecast: 134, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["HRIS Management","Workforce Reporting"],     status: "Active" },
  { id: "HC042", dept: "Operations",      role: "Vessel Scheduling Officer",        workloadHours: 780,  requiredHc: 6,  currentHc: 3,  plannedHc: 5,  hcGap: 3,  plannedGapCoverage: 2,  remainingGap: 1,  utilizationForecast: 124, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["Vessel Arrival","Berthing Allocation"],      status: "Active" },
  { id: "HC043", dept: "Marketing",       role: "Brand Manager",                    workloadHours: 380,  requiredHc: 3,  currentHc: 2,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 0,  remainingGap: 1,  utilizationForecast: 102, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Brand Portfolio","Market Positioning"],      status: "Draft" },
  { id: "HC044", dept: "Technology",      role: "Security Engineer",                workloadHours: 440,  requiredHc: 3,  currentHc: 1,  plannedHc: 2,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 116, riskLevel: "Critical", hiringPriority: "Critical", hiringTimeline: "Immediate", workforceType: "Full-time",  linkedProcesses: ["Cybersecurity Ops","Vulnerability Mgmt"],    status: "Active" },
  { id: "HC045", dept: "Finance",         role: "FP&A Analyst",                     workloadHours: 460,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 90,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Financial Planning","Scenario Modeling"],    status: "Approved" },
  { id: "HC046", dept: "Procurement",     role: "Supply Chain Analyst",             workloadHours: 520,  requiredHc: 4,  currentHc: 2,  plannedHc: 3,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 112, riskLevel: "Critical", hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Supply Chain Planning","Inventory Ctrl"],    status: "Active" },
  { id: "HC047", dept: "Strategy",        role: "Strategic Initiatives Lead",       workloadHours: 520,  requiredHc: 4,  currentHc: 2,  plannedHc: 3,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 111, riskLevel: "Critical", hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Strategic Planning","OKR Management"],       status: "Active" },
  { id: "HC048", dept: "Legal",           role: "Regulatory Affairs Specialist",    workloadHours: 360,  requiredHc: 3,  currentHc: 1,  plannedHc: 2,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 114, riskLevel: "Critical", hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Regulatory Filing","Compliance Monitoring"], status: "Active" },
  { id: "HC049", dept: "Technology",      role: "Product Manager",                  workloadHours: 480,  requiredHc: 4,  currentHc: 2,  plannedHc: 3,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 109, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Product Roadmap","Feature Delivery"],        status: "Draft" },
  { id: "HC050", dept: "Operations",      role: "Quality Control Inspector",        workloadHours: 400,  requiredHc: 3,  currentHc: 2,  plannedHc: 3,  hcGap: 1,  plannedGapCoverage: 1,  remainingGap: 0,  utilizationForecast: 88,  riskLevel: "Medium",   hiringPriority: "Medium",   hiringTimeline: "6 months",  workforceType: "Full-time",  linkedProcesses: ["Quality Assurance","SLA Monitoring"],        status: "Approved" },
  { id: "HC051", dept: "Human Resources", role: "Compensation & Benefits Analyst",  workloadHours: 400,  requiredHc: 3,  currentHc: 1,  plannedHc: 2,  hcGap: 2,  plannedGapCoverage: 1,  remainingGap: 1,  utilizationForecast: 117, riskLevel: "Critical", hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Comp & Benefits Review","Payroll Support"],  status: "Active" },
  { id: "HC052", dept: "Finance",         role: "Cost Controller",                  workloadHours: 360,  requiredHc: 3,  currentHc: 2,  plannedHc: 2,  hcGap: 1,  plannedGapCoverage: 0,  remainingGap: 1,  utilizationForecast: 105, riskLevel: "High",     hiringPriority: "High",     hiringTimeline: "3 months",  workforceType: "Full-time",  linkedProcesses: ["Cost Monitoring","Budget Reconciliation"],   status: "Draft" },
];

// =====================================================================
// POSITION NEED DETECTION — AI-driven recommendations
// =====================================================================
export type PositionNeedDetection = {
  id: string;
  recommendedPositionName: string;
  department: string;
  departmentId: string;
  proposalStatus: "Recommendation" | "Proposed" | "Approved" | "Rejected";
  triggerSource: string;
  trigger: string;
  suggestedRoleLevel: string;
  suggestedHc: number;
  aiConfidence: number;
  activityCount: number;
  workloadHoursMonth: number;
  utilizationPct: number;
  suggestedParentDept: string;
  suggestedReportingLine: string;
  potentialPositionOwner: string;
  relatedExistingRoles: string[];
  capabilityGap: {
    missingCompetency: string;
    currentRoleMismatch: string;
    requiredSkillCluster: string;
    suggestedLevel: string;
  };
  evidenceActivities: {
    activityName: string;
    linkedProcess: string;
    currentPosition: string;
    currentAssignedEmployees: string;
    frequency: string;
    duration: number;
    adjustedWorkloadHours: number;
    utilizationImpact: number;
  }[];
  salaryRangeMin: number;
  salaryRangeMax: number;
  benefitsEstimate: number;
  monthlyCostEstimate: number;
  annualCostEstimate: number;
  budgetImpact: string;
  costCenter: string;
  slaRisk: string;
  overloadRisk: string;
  processOwnershipGap: string;
  recruitmentDelay: string;
  serviceQualityImpact: string;
};

export const positionNeedDetections: PositionNeedDetection[] = [
  {
    id: "PND001",
    recommendedPositionName: "Workforce Analytics Specialist",
    department: "Human Capital Management",
    departmentId: "D02",
    proposalStatus: "Approved" as const,
    triggerSource: "Workload gap",
    trigger: "18 activities currently split across Workforce Planning Analyst and HR Data Officer with 126% average utilization and no dedicated analytics ownership.",
    suggestedRoleLevel: "Senior Specialist (G6)",
    suggestedHc: 2,
    aiConfidence: 87,
    activityCount: 18,
    workloadHoursMonth: 142,
    utilizationPct: 126,
    suggestedParentDept: "Human Capital Management",
    suggestedReportingLine: "HR Director → Workforce Planning Manager → Workforce Analytics Specialist",
    potentialPositionOwner: "Lestari Putri",
    relatedExistingRoles: ["Workforce Planning Analyst", "HR Data Officer", "HR Business Partner"],
    capabilityGap: {
      missingCompetency: "Workforce analytics and data-driven HC planning",
      currentRoleMismatch: "Existing HR Specialist roles lack dedicated analytics capability; analytics tasks fragmented across generalist roles",
      requiredSkillCluster: "Workforce analytics, HR data interpretation, organization design, dashboard analysis",
      suggestedLevel: "Senior Specialist",
    },
    evidenceActivities: [
      { activityName: "Consolidate workload demand data",     linkedProcess: "Workforce Planning Cycle",        currentPosition: "Workforce Planning Analyst", currentAssignedEmployees: "E019", frequency: "Monthly",   duration: 4, adjustedWorkloadHours: 8,  utilizationImpact: 9  },
      { activityName: "Validate required HC calculations",   linkedProcess: "HC Planning",                     currentPosition: "HR Data Officer",            currentAssignedEmployees: "E019", frequency: "Monthly",   duration: 3, adjustedWorkloadHours: 6,  utilizationImpact: 7  },
      { activityName: "Analyze workforce utilization trend", linkedProcess: "Workforce Planning Cycle",        currentPosition: "Workforce Planning Analyst", currentAssignedEmployees: "E018", frequency: "Weekly",    duration: 2, adjustedWorkloadHours: 14, utilizationImpact: 15 },
      { activityName: "Prepare HC gap recommendations",      linkedProcess: "Organization Structure Review",   currentPosition: "HR Data Officer",            currentAssignedEmployees: "E018", frequency: "Monthly",   duration: 5, adjustedWorkloadHours: 9,  utilizationImpact: 10 },
      { activityName: "Generate workforce planning reports", linkedProcess: "Budget Planning and Monitoring",  currentPosition: "Workforce Planning Analyst", currentAssignedEmployees: "E019", frequency: "Monthly",   duration: 6, adjustedWorkloadHours: 11, utilizationImpact: 12 },
      { activityName: "Support HC simulation scenarios",     linkedProcess: "Scenario Planning",               currentPosition: "HR Data Officer",            currentAssignedEmployees: "E018", frequency: "Quarterly", duration: 8, adjustedWorkloadHours: 7,  utilizationImpact: 8  },
      { activityName: "Coordinate recruitment prioritization",linkedProcess: "Recruitment Planning",          currentPosition: "Workforce Planning Analyst", currentAssignedEmployees: "E019", frequency: "Monthly",   duration: 3, adjustedWorkloadHours: 6,  utilizationImpact: 7  },
    ],
    salaryRangeMin: 95000000,
    salaryRangeMax: 130000000,
    benefitsEstimate: 26000000,
    monthlyCostEstimate: 78000000,
    annualCostEstimate: 936000000,
    budgetImpact: "Moderate — within HC planning reserve",
    costCenter: "CC-HR-PLANNING",
    slaRisk: "HC planning cycle SLA breach risk if analytics backlog exceeds 2 weeks",
    overloadRisk: "Continued 126% utilization will cause analytics reporting delays and HC plan inaccuracy",
    processOwnershipGap: "7 recurring analytics activities currently have no single accountable owner",
    recruitmentDelay: "Absence of clear role definition has caused 2 failed recruitment attempts in past cycle",
    serviceQualityImpact: "Workforce decision quality degraded by 18% per management dashboard trends",
  },
  {
    id: "PND002",
    recommendedPositionName: "Port Operations Scheduling Coordinator",
    department: "Port Services",
    departmentId: "D04",
    proposalStatus: "Recommendation" as const,
    triggerSource: "Workload gap",
    trigger: "Vessel scheduling workload exceeds capacity across Operations Analyst and Vessel Scheduling Officer roles — 212 hours/month with active SLA breach risk in Vessel Arrival to Berthing process.",
    suggestedRoleLevel: "Coordinator (G5)",
    suggestedHc: 3,
    aiConfidence: 79,
    activityCount: 14,
    workloadHoursMonth: 212,
    utilizationPct: 134,
    suggestedParentDept: "Port Services / Operations",
    suggestedReportingLine: "COO → VP Operations → Operations Manager → Port Operations Scheduling Coordinator",
    potentialPositionOwner: "Sari Indah",
    relatedExistingRoles: ["Operations Analyst", "Vessel Scheduling Officer", "Port Operations Analyst", "Logistics Coordinator"],
    capabilityGap: {
      missingCompetency: "Dedicated port scheduling and vessel coordination expertise",
      currentRoleMismatch: "Operations Analysts covering general ops tasks cannot specialize in time-critical vessel scheduling",
      requiredSkillCluster: "Port operations scheduling, vessel traffic management, SLA monitoring, logistics coordination",
      suggestedLevel: "Coordinator / Senior Analyst",
    },
    evidenceActivities: [
      { activityName: "Schedule vessel arrival windows",    linkedProcess: "Vessel Arrival to Berthing",    currentPosition: "Operations Analyst",         currentAssignedEmployees: "E013, E014", frequency: "Daily",   duration: 3, adjustedWorkloadHours: 45, utilizationImpact: 22 },
      { activityName: "Allocate berth slots",               linkedProcess: "Vessel Arrival to Berthing",    currentPosition: "Vessel Scheduling Officer",  currentAssignedEmployees: "E014",       frequency: "Daily",   duration: 2, adjustedWorkloadHours: 32, utilizationImpact: 16 },
      { activityName: "Coordinate port resource deployment",linkedProcess: "Port Resource Management",      currentPosition: "Operations Analyst",         currentAssignedEmployees: "E013",       frequency: "Daily",   duration: 2, adjustedWorkloadHours: 28, utilizationImpact: 14 },
      { activityName: "Monitor vessel SLA compliance",      linkedProcess: "Vessel Arrival to Berthing",    currentPosition: "Port Operations Analyst",    currentAssignedEmployees: "E014",       frequency: "Daily",   duration: 1, adjustedWorkloadHours: 18, utilizationImpact: 9  },
      { activityName: "Report scheduling delays",           linkedProcess: "Operations Monitoring",         currentPosition: "Operations Analyst",         currentAssignedEmployees: "E013",       frequency: "Weekly",  duration: 2, adjustedWorkloadHours: 14, utilizationImpact: 7  },
      { activityName: "Update vessel ETD/ETA records",      linkedProcess: "Vessel Arrival to Berthing",    currentPosition: "Vessel Scheduling Officer",  currentAssignedEmployees: "E014",       frequency: "Daily",   duration: 1, adjustedWorkloadHours: 16, utilizationImpact: 8  },
    ],
    salaryRangeMin: 75000000,
    salaryRangeMax: 105000000,
    benefitsEstimate: 21000000,
    monthlyCostEstimate: 63000000,
    annualCostEstimate: 756000000,
    budgetImpact: "High — requires budget amendment for 3 new FTEs",
    costCenter: "CC-OPS-PORT",
    slaRisk: "Vessel Arrival to Berthing SLA currently at 68% compliance — critical breach if not addressed within 60 days",
    overloadRisk: "Operations team running at 134% average utilization; further delay increases operational risk by 3x",
    processOwnershipGap: "No single accountable owner for vessel scheduling coordination end-to-end",
    recruitmentDelay: "Previous attempt to fill Operations Analyst vacancy failed due to unclear scope — scheduling vs general ops",
    serviceQualityImpact: "Port throughput efficiency projected to decline 12% if scheduling backlog is not resolved",
  },
  {
    id: "PND003",
    recommendedPositionName: "Cybersecurity Operations Analyst",
    department: "Technology",
    departmentId: "D01",
    proposalStatus: "Proposed" as const,
    triggerSource: "New business process",
    trigger: "New AIOps and cybersecurity monitoring processes introduced in Apr 2026 have no dedicated position — activities currently absorbed by Security Engineer and DevOps roles at 116% utilization.",
    suggestedRoleLevel: "Analyst (G5)",
    suggestedHc: 2,
    aiConfidence: 82,
    activityCount: 11,
    workloadHoursMonth: 98,
    utilizationPct: 116,
    suggestedParentDept: "Technology",
    suggestedReportingLine: "VP Technology → Tech Lead → Cybersecurity Operations Analyst",
    potentialPositionOwner: "Rini Wulandari",
    relatedExistingRoles: ["Security Engineer", "DevOps Engineer", "System Analyst"],
    capabilityGap: {
      missingCompetency: "Dedicated cybersecurity monitoring and incident triage",
      currentRoleMismatch: "Security Engineer role focused on architecture; daily monitoring tasks dilute engineering capacity",
      requiredSkillCluster: "Security operations, SIEM management, incident response, threat monitoring, vulnerability scanning",
      suggestedLevel: "Analyst",
    },
    evidenceActivities: [
      { activityName: "Monitor SIEM alerts and incidents",      linkedProcess: "Cybersecurity Operations",    currentPosition: "Security Engineer",  currentAssignedEmployees: "E006",       frequency: "Daily",   duration: 2, adjustedWorkloadHours: 32, utilizationImpact: 18 },
      { activityName: "Triage and classify security events",    linkedProcess: "Cybersecurity Operations",    currentPosition: "DevOps Engineer",    currentAssignedEmployees: "E006",       frequency: "Daily",   duration: 1, adjustedWorkloadHours: 18, utilizationImpact: 10 },
      { activityName: "Run vulnerability scans",                linkedProcess: "Vulnerability Management",    currentPosition: "Security Engineer",  currentAssignedEmployees: "E009",       frequency: "Weekly",  duration: 3, adjustedWorkloadHours: 14, utilizationImpact: 8  },
      { activityName: "Prepare security incident reports",      linkedProcess: "Cybersecurity Operations",    currentPosition: "System Analyst",     currentAssignedEmployees: "E010",       frequency: "Monthly", duration: 4, adjustedWorkloadHours: 8,  utilizationImpact: 5  },
      { activityName: "Coordinate AIOps alert routing",         linkedProcess: "AIOps Incident Management",   currentPosition: "DevOps Engineer",    currentAssignedEmployees: "E009",       frequency: "Daily",   duration: 1, adjustedWorkloadHours: 16, utilizationImpact: 9  },
    ],
    salaryRangeMin: 80000000,
    salaryRangeMax: 115000000,
    benefitsEstimate: 22000000,
    monthlyCostEstimate: 68000000,
    annualCostEstimate: 816000000,
    budgetImpact: "Within Technology department headcount reserve",
    costCenter: "CC-TECH-SEC",
    slaRisk: "Security incident response SLA at risk — current average triage time 4.2 hours vs 2-hour target",
    overloadRisk: "Security Engineer and DevOps roles at 116% utilization — architectural work being deprioritized",
    processOwnershipGap: "AIOps incident routing process introduced Apr 2026 has no dedicated position accountable",
    recruitmentDelay: "No JD exists for Cybersecurity Analyst role — recruitment cannot begin without position definition",
    serviceQualityImpact: "Unmonitored security events increasing system vulnerability exposure by estimated 23%",
  },
];

// Utilization distribution (histogram) across employees.
export const utilizationDistribution = (() => {
  const buckets = [
    { range: "0–40%",   count: 0 },
    { range: "40–70%",  count: 0 },
    { range: "70–90%",  count: 0 },
    { range: "90–100%", count: 0 },
    { range: "100%+",   count: 0 },
  ];
  employeeLoad.forEach((e) => {
    const u = e.utilization;
    if (u < 40) buckets[0].count++;
    else if (u < 70) buckets[1].count++;
    else if (u < 90) buckets[2].count++;
    else if (u <= 100) buckets[3].count++;
    else buckets[4].count++;
  });
  return buckets;
})();

export { enterpriseDataset } from "./enterprise-dataset";
