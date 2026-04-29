export type AISeverity = "Critical" | "High" | "Medium" | "Low";
export type AIInsightCategory =
  | "Hiring Recommendation"
  | "Workload Risk"
  | "Missing Business Process"
  | "Role Redesign"
  | "Cost Optimization"
  | "Underutilization"
  | "Governance Risk"
  | "Process Ownership Gap";

export type AIModuleTag = "Org Data" | "Process Data" | "Workload Data" | "Cost Data" | "Scenario Data";

export type AIInsight = {
  id: string;
  title: string;
  category: AIInsightCategory;
  severity: AISeverity;
  confidenceScore: number;
  department: string;
  affectedPositions: string[];
  affectedProcesses: string[];
  affectedActivities: { name: string; workloadHours: number; responsiblePosition: string; utilization: number; status: string }[];
  summary: string;
  recommendation: string;
  reasoning: string;
  dataEvidence: {
    utilization: string;
    hcGap: string;
    kpiImpact: string;
    costImpact: string;
    requiredHC: number;
    assignedHC: number;
  };
  impactProjection: { workloadImprovement: string; costChange: string; kpiImprovement: string };
  financialImpact: { currentMonthlyCost: string; projectedMonthlyCost: string; delta: string };
  workloadImpact: string;
  kpiImpact: string;
  suggestedActions: string[];
  status: "New" | "In Review" | "Scenario Drafted" | "Implemented";
  createdAt: string;
  sourceModules: AIModuleTag[];
};

export type AIGeneratedPosition = {
  id: string;
  positionName: string;
  nomenclature: string;
  department: string;
  jobFamily: string;
  jobLevel: string;
  employmentType: string;
  status: "Recommended" | "Ready for Scenario Simulation" | "Submitted to Organization Management" | "Implemented";
  reportsTo: string;
  directSubordinates: string[];
  reasonForCreation: string;
  businessObjective: string;
  roleSummary: string;
  coreResponsibilities: string[];
  keyDeliverables: string[];
  linkedBusinessProcesses: {
    processName: string;
    roleInProcess: string;
    kpiSupported: string;
    currentKpi: string;
    targetKpi: string;
  }[];
  linkedKPIs: {
    kpiName: string;
    currentValue: string;
    targetValue: string;
    expectedImprovement: string;
  }[];
  linkedActivities: {
    activityName: string;
    frequency: string;
    durationHours: number;
    monthlyWorkloadHours: number;
    complexityLevel: "Low" | "Medium" | "High";
    responsibleRole: string;
  }[];
  workloadAnalysis: {
    baseWorkloadHours: number;
    complexityMultiplier: number;
    qualityFactor: number;
    reworkRate: number;
    adjustedWorkloadHours: number;
    effectiveMonthlyCapacity: number;
    requiredHC: number;
    recommendedHC: number;
    expectedUtilization: string;
  };
  costEstimate: {
    baseSalary: number;
    allowances: number;
    benefits: number;
    bonusAllocation: number;
    totalMonthlyCost: number;
    totalAnnualCost: number;
    costPerWorkloadHour: number;
  };
  competencyRequirements: {
    technicalCompetencies: string[];
    behavioralCompetencies: string[];
    certifications: string[];
    minimumExperience: string;
    education: string;
  };
  reportingStructure: {
    reportsToPosition: string;
    peerPositions: string[];
    subordinatePositions: string[];
  };
  implementationPlan: string[];
  impactAnalysis: {
    workloadReduction: string;
    kpiImprovement: string;
    riskReduction: string;
    costImpact: string;
    affectedDepartments: string[];
  };
  risksIfNotCreated: string[];
  sourceInsight: string;
  scenarioReadiness: string;
};

export const aiDepartments = [
  "Operations",
  "Port Services",
  "Commercial & Customer Solutions",
  "Finance & Governance",
  "Human Capital Management",
  "Digital Transformation",
  "Procurement",
  "Legal & Compliance",
  "Risk Management",
  "Process Excellence",
  "IT Infrastructure",
  "Strategy & Corporate Planning",
];

export const aiBusinessProcesses = [
  "Vessel Arrival to Berthing",
  "Procurement Request to Payment",
  "Contract Lifecycle Management",
  "Customer Order to Billing",
  "Monthly Financial Closing",
  "Workforce Roster Review",
  "Operational Risk Review",
  "Incident Reporting and Resolution",
  "Asset Maintenance Planning",
  "Digital Initiative Prioritization",
];

export const aiInsights: AIInsight[] = [
  {
    id: "INS-001",
    title: "Operations Overload Risk",
    category: "Workload Risk",
    severity: "Critical",
    confidenceScore: 94,
    department: "Operations",
    affectedPositions: ["Port Operations Analyst", "Vessel Scheduling Coordinator"],
    affectedProcesses: ["Vessel Arrival to Berthing", "Asset Maintenance Planning"],
    affectedActivities: [
      { name: "Berthing Slot Allocation", workloadHours: 128, responsiblePosition: "Port Operations Analyst", utilization: 124, status: "Overloaded" },
      { name: "Vessel Arrival Notification", workloadHours: 96, responsiblePosition: "Vessel Scheduling Coordinator", utilization: 118, status: "Overloaded" },
      { name: "Yard Capacity Coordination", workloadHours: 74, responsiblePosition: "Port Operations Analyst", utilization: 112, status: "At Risk" },
    ],
    summary: "Operations berthing activities exceed available headcount by 380 hours per month.",
    recommendation: "Create 2 additional Port Operations Analyst positions and redistribute berth planning activities.",
    reasoning: "AI engine mapped 3 high-frequency activities to 2 roles with sustained utilization above 110% across 8 weeks.",
    dataEvidence: {
      utilization: "124%",
      hcGap: "1.9 FTE",
      kpiImpact: "On-Time Berthing fell 91% -> 84%",
      costImpact: "+Rp 58M/month investment",
      requiredHC: 8.4,
      assignedHC: 6.5,
    },
    impactProjection: { workloadImprovement: "-32% utilization", costChange: "+Rp 58M/month", kpiImprovement: "+7%" },
    financialImpact: { currentMonthlyCost: "Rp 1.02B", projectedMonthlyCost: "Rp 1.08B", delta: "+Rp 58M" },
    workloadImpact: "Utilization drops to 92% after redistribution",
    kpiImpact: "On-Time Berthing KPI projected to recover to 91%",
    suggestedActions: ["Generate Position", "Send to Scenario", "Open Activity Detail"],
    status: "New",
    createdAt: "2026-04-28",
    sourceModules: ["Org Data", "Workload Data", "Process Data", "Cost Data", "Scenario Data"],
  },
  {
    id: "INS-002",
    title: "Procurement Process Ownership Gap",
    category: "Process Ownership Gap",
    severity: "High",
    confidenceScore: 90,
    department: "Procurement",
    affectedPositions: ["Procurement Analyst", "Vendor Management Officer"],
    affectedProcesses: ["Procurement Request to Payment", "Contract Lifecycle Management"],
    affectedActivities: [
      { name: "Vendor Evaluation Gate", workloadHours: 68, responsiblePosition: "Unassigned", utilization: 0, status: "Ownership Gap" },
      { name: "Compliance Scoring Review", workloadHours: 44, responsiblePosition: "Procurement Analyst", utilization: 108, status: "At Risk" },
    ],
    summary: "Four procurement governance activities have no single accountable owner, delaying vendor SLA by 18%.",
    recommendation: "Create Vendor Governance Specialist position and assign ownership for vendor evaluation and contract compliance.",
    reasoning: "Process graph found 4 orphan activities and duplicated approvals across two departments.",
    dataEvidence: { utilization: "108%", hcGap: "1.2 FTE", kpiImpact: "Vendor SLA -18%", costImpact: "Avoided rework Rp 22M/month", requiredHC: 3.2, assignedHC: 2.0 },
    impactProjection: { workloadImprovement: "-24% overload", costChange: "+Rp 31.8M/month", kpiImprovement: "+14% SLA" },
    financialImpact: { currentMonthlyCost: "Rp 488M", projectedMonthlyCost: "Rp 519.8M", delta: "+Rp 31.8M" },
    workloadImpact: "Ownership clarity removes 112 hours/month duplicate work",
    kpiImpact: "Vendor evaluation lead time improves 28%",
    suggestedActions: ["Generate Position", "Open Related Process", "Send to Scenario"],
    status: "In Review",
    createdAt: "2026-04-27",
    sourceModules: ["Process Data", "Org Data", "Cost Data", "Workload Data"],
  },
  {
    id: "INS-003",
    title: "Finance Cost Inefficiency in Invoice Validation",
    category: "Cost Optimization",
    severity: "Medium",
    confidenceScore: 86,
    department: "Finance & Governance",
    affectedPositions: ["Cost Control Specialist", "Finance Planning Specialist"],
    affectedProcesses: ["Monthly Financial Closing", "Customer Order to Billing"],
    affectedActivities: [{ name: "Recurring Invoice Validation", workloadHours: 122, responsiblePosition: "Finance Planning Specialist", utilization: 63, status: "Inefficient Allocation" }],
    summary: "Senior finance roles are spending 122 hours/month on repeatable tasks with 22% above-average cost per activity.",
    recommendation: "Shift recurring invoice validation tasks from senior finance managers to finance analysts.",
    reasoning: "Cost engine found high-rate roles attached to low-complexity activities.",
    dataEvidence: { utilization: "63%", hcGap: "0.0 FTE", kpiImpact: "Close cycle +2 days", costImpact: "Potential savings Rp 48M/month", requiredHC: 4.0, assignedHC: 4.1 },
    impactProjection: { workloadImprovement: "+18% high-value focus", costChange: "-Rp 48M/month", kpiImprovement: "+4% closing timeliness" },
    financialImpact: { currentMonthlyCost: "Rp 772M", projectedMonthlyCost: "Rp 724M", delta: "-Rp 48M" },
    workloadImpact: "Senior time shifted to forecasting and risk controls",
    kpiImpact: "Financial close punctuality projected from 86% to 90%",
    suggestedActions: ["Adjust Assignment", "Send to Scenario"],
    status: "New",
    createdAt: "2026-04-26",
    sourceModules: ["Cost Data", "Workload Data", "Process Data"],
  },
  {
    id: "INS-004",
    title: "Legal Underutilization Opportunity",
    category: "Underutilization",
    severity: "Medium",
    confidenceScore: 84,
    department: "Legal & Compliance",
    affectedPositions: ["Legal Compliance Officer"],
    affectedProcesses: ["Contract Lifecycle Management"],
    affectedActivities: [{ name: "Contract Review Backlog Support", workloadHours: 42, responsiblePosition: "Legal Compliance Officer", utilization: 58, status: "Available Capacity" }],
    summary: "Legal Compliance team has 42 spare hours/month while procurement contract review queue is delayed.",
    recommendation: "Reassign contract review workload from Procurement to Legal Compliance.",
    reasoning: "Cross-module utilization map shows idle legal capacity and procurement bottleneck on same process.",
    dataEvidence: { utilization: "58%", hcGap: "-0.3 FTE", kpiImpact: "Contract cycle +11%", costImpact: "No additional cost", requiredHC: 2.3, assignedHC: 2.6 },
    impactProjection: { workloadImprovement: "Procurement utilization -9%", costChange: "0", kpiImprovement: "+6% cycle-time" },
    financialImpact: { currentMonthlyCost: "Rp 214M", projectedMonthlyCost: "Rp 214M", delta: "0" },
    workloadImpact: "Balanced utilization between Legal and Procurement",
    kpiImpact: "Contract turnaround from 73% to 79%",
    suggestedActions: ["Redistribute Workload", "Open Activity Detail"],
    status: "In Review",
    createdAt: "2026-04-25",
    sourceModules: ["Org Data", "Process Data", "Workload Data"],
  },
  {
    id: "INS-005",
    title: "Digital Transformation Capacity Gap",
    category: "Hiring Recommendation",
    severity: "High",
    confidenceScore: 92,
    department: "Digital Transformation",
    affectedPositions: ["Digital Transformation Lead", "IT Service Delivery Analyst"],
    affectedProcesses: ["Digital Initiative Prioritization", "Incident Reporting and Resolution"],
    affectedActivities: [{ name: "Automation Opportunity Mapping", workloadHours: 88, responsiblePosition: "Digital Transformation Lead", utilization: 119, status: "Overloaded" }],
    summary: "Three strategic automation initiatives are delayed due to missing analysis capacity.",
    recommendation: "Create Automation Business Analyst position to support process automation mapping.",
    reasoning: "Scenario model indicates 20% workload reduction if automation pipeline starts within current quarter.",
    dataEvidence: { utilization: "119%", hcGap: "1.0 FTE", kpiImpact: "Automation roadmap delay 9 weeks", costImpact: "+Rp 34M/month", requiredHC: 3.5, assignedHC: 2.5 },
    impactProjection: { workloadImprovement: "-27% workload", costChange: "+Rp 34M/month", kpiImprovement: "+11% digital delivery" },
    financialImpact: { currentMonthlyCost: "Rp 431M", projectedMonthlyCost: "Rp 465M", delta: "+Rp 34M" },
    workloadImpact: "Initiative backlog reduced by 3 major streams",
    kpiImpact: "Digital program execution projected 78% -> 89%",
    suggestedActions: ["Generate Position", "Send to Scenario"],
    status: "New",
    createdAt: "2026-04-24",
    sourceModules: ["Scenario Data", "Workload Data", "Process Data", "Cost Data"],
  },
  {
    id: "INS-006",
    title: "IT Infrastructure Incident Escalation Risk",
    category: "Governance Risk",
    severity: "High",
    confidenceScore: 88,
    department: "IT Infrastructure",
    affectedPositions: ["IT Service Delivery Analyst"],
    affectedProcesses: ["Incident Reporting and Resolution"],
    affectedActivities: [{ name: "L2 Escalation Triage", workloadHours: 102, responsiblePosition: "IT Service Delivery Analyst", utilization: 116, status: "At Risk" }],
    summary: "Incident escalation throughput is constrained by one overloaded role.",
    recommendation: "Introduce Digital Service Operations Coordinator and redefine L2 triage ownership.",
    reasoning: "Escalation queue exceeded SLA in 6 out of last 8 weeks.",
    dataEvidence: { utilization: "116%", hcGap: "0.8 FTE", kpiImpact: "Incident SLA down 12%", costImpact: "+Rp 29M/month", requiredHC: 4.1, assignedHC: 3.3 },
    impactProjection: { workloadImprovement: "-22% overload", costChange: "+Rp 29M/month", kpiImprovement: "+9% SLA recovery" },
    financialImpact: { currentMonthlyCost: "Rp 368M", projectedMonthlyCost: "Rp 397M", delta: "+Rp 29M" },
    workloadImpact: "Balanced incident routing across L1-L2",
    kpiImpact: "Resolution SLA projected from 81% to 90%",
    suggestedActions: ["Generate Position", "Open Related Process"],
    status: "New",
    createdAt: "2026-04-24",
    sourceModules: ["Workload Data", "Process Data", "Org Data"],
  },
  {
    id: "INS-007",
    title: "Process Excellence Missing Governance Node",
    category: "Missing Business Process",
    severity: "Medium",
    confidenceScore: 85,
    department: "Process Excellence",
    affectedPositions: ["Process Excellence Manager"],
    affectedProcesses: ["Operational Risk Review", "Workforce Roster Review"],
    affectedActivities: [{ name: "Process RACI Validation", workloadHours: 56, responsiblePosition: "Unassigned", utilization: 0, status: "Unowned" }],
    summary: "RACI checks are missing for quarterly process audits across 2 strategic workflows.",
    recommendation: "Create Process Ownership Lead and assign quarterly governance checkpoints.",
    reasoning: "AI found recurring compliance findings tied to missing process owner records.",
    dataEvidence: { utilization: "N/A", hcGap: "0.7 FTE", kpiImpact: "Audit findings +13%", costImpact: "+Rp 27M/month", requiredHC: 1.7, assignedHC: 1.0 },
    impactProjection: { workloadImprovement: "Standardized ownership cadence", costChange: "+Rp 27M/month", kpiImprovement: "-13% audit findings" },
    financialImpact: { currentMonthlyCost: "Rp 198M", projectedMonthlyCost: "Rp 225M", delta: "+Rp 27M" },
    workloadImpact: "56 hours/month assigned with clear ownership",
    kpiImpact: "Process compliance score +8%",
    suggestedActions: ["Generate Position", "Open Related Process"],
    status: "In Review",
    createdAt: "2026-04-23",
    sourceModules: ["Process Data", "Org Data", "Scenario Data"],
  },
  {
    id: "INS-008",
    title: "Commercial Billing Rework Concentration",
    category: "Role Redesign",
    severity: "High",
    confidenceScore: 87,
    department: "Commercial & Customer Solutions",
    affectedPositions: ["Customer Billing Specialist", "Finance Planning Specialist"],
    affectedProcesses: ["Customer Order to Billing"],
    affectedActivities: [{ name: "Billing Exception Reconciliation", workloadHours: 76, responsiblePosition: "Finance Planning Specialist", utilization: 109, status: "Cross-Function Misfit" }],
    summary: "Billing rework is being handled outside commercial function, increasing cycle time and error loops.",
    recommendation: "Create Customer Billing Quality Specialist under Commercial to own exception queue.",
    reasoning: "Role-process mismatch detected across 1,840 monthly billing transactions.",
    dataEvidence: { utilization: "109%", hcGap: "0.9 FTE", kpiImpact: "Billing accuracy at 92%", costImpact: "+Rp 24M/month with -Rp 19M rework", requiredHC: 2.9, assignedHC: 2.0 },
    impactProjection: { workloadImprovement: "-18% finance overload", costChange: "+Rp 5M net/month", kpiImprovement: "+5% billing accuracy" },
    financialImpact: { currentMonthlyCost: "Rp 512M", projectedMonthlyCost: "Rp 517M", delta: "+Rp 5M net" },
    workloadImpact: "Cross-functional handoff reduced by 31 hours/month",
    kpiImpact: "Billing first-pass rate from 92% to 97%",
    suggestedActions: ["Generate Position", "Send to Scenario"],
    status: "New",
    createdAt: "2026-04-22",
    sourceModules: ["Cost Data", "Process Data", "Workload Data"],
  },
  {
    id: "INS-009",
    title: "Risk Management Review Under-Coverage",
    category: "Governance Risk",
    severity: "Critical",
    confidenceScore: 91,
    department: "Risk Management",
    affectedPositions: ["Risk Management Analyst"],
    affectedProcesses: ["Operational Risk Review"],
    affectedActivities: [{ name: "Risk Register Refresh", workloadHours: 92, responsiblePosition: "Risk Management Analyst", utilization: 121, status: "Backlog Risk" }],
    summary: "Risk review cadence cannot cover all operational units, leaving 3 units without quarterly assessment.",
    recommendation: "Create one additional Risk Management Analyst and automate risk register updates.",
    reasoning: "Coverage gap tracked in last 3 review cycles with unresolved high-risk findings.",
    dataEvidence: { utilization: "121%", hcGap: "1.1 FTE", kpiImpact: "Risk closure rate -9%", costImpact: "+Rp 26M/month", requiredHC: 3.1, assignedHC: 2.0 },
    impactProjection: { workloadImprovement: "-29% overload", costChange: "+Rp 26M/month", kpiImprovement: "+10% closure rate" },
    financialImpact: { currentMonthlyCost: "Rp 246M", projectedMonthlyCost: "Rp 272M", delta: "+Rp 26M" },
    workloadImpact: "Quarterly coverage restored to 100%",
    kpiImpact: "Risk closure back to 92%",
    suggestedActions: ["Generate Position", "Generate Scenario"],
    status: "New",
    createdAt: "2026-04-22",
    sourceModules: ["Scenario Data", "Org Data", "Workload Data"],
  },
  {
    id: "INS-010",
    title: "Port Services Shift Allocation Imbalance",
    category: "Workload Risk",
    severity: "High",
    confidenceScore: 88,
    department: "Port Services",
    affectedPositions: ["Terminal Resource Planner", "Vessel Scheduling Coordinator"],
    affectedProcesses: ["Vessel Arrival to Berthing", "Workforce Roster Review"],
    affectedActivities: [{ name: "Night Shift Resource Allocation", workloadHours: 84, responsiblePosition: "Terminal Resource Planner", utilization: 114, status: "Shift Imbalance" }],
    summary: "Night shift planning load has grown 26% with no planner adjustment.",
    recommendation: "Create Terminal Resource Planner role variant focused on shift balancing.",
    reasoning: "Roster model indicates chronic imbalance over 12-week horizon.",
    dataEvidence: { utilization: "114%", hcGap: "0.8 FTE", kpiImpact: "Yard turnaround -6%", costImpact: "+Rp 28M/month", requiredHC: 2.8, assignedHC: 2.0 },
    impactProjection: { workloadImprovement: "-21% load", costChange: "+Rp 28M/month", kpiImprovement: "+6% turnaround" },
    financialImpact: { currentMonthlyCost: "Rp 364M", projectedMonthlyCost: "Rp 392M", delta: "+Rp 28M" },
    workloadImpact: "Shift workload normalized across planner pool",
    kpiImpact: "Night operation punctuality 82% -> 88%",
    suggestedActions: ["Generate Position", "Open Activity Detail"],
    status: "In Review",
    createdAt: "2026-04-21",
    sourceModules: ["Workload Data", "Scenario Data", "Org Data"],
  },
  {
    id: "INS-011",
    title: "Strategy Planning Analyst Underutilization",
    category: "Underutilization",
    severity: "Low",
    confidenceScore: 79,
    department: "Strategy & Corporate Planning",
    affectedPositions: ["Corporate Planning Analyst"],
    affectedProcesses: ["Digital Initiative Prioritization"],
    affectedActivities: [{ name: "Initiative Portfolio Review", workloadHours: 34, responsiblePosition: "Corporate Planning Analyst", utilization: 61, status: "Underutilized" }],
    summary: "Planning analysts have available capacity while digital transformation needs portfolio governance support.",
    recommendation: "Temporarily assign strategy analyst to digital prioritization PMO.",
    reasoning: "Skill adjacency and utilization model indicate near-zero transition risk.",
    dataEvidence: { utilization: "61%", hcGap: "-0.4 FTE", kpiImpact: "Portfolio governance lag", costImpact: "No net cost", requiredHC: 1.6, assignedHC: 2.0 },
    impactProjection: { workloadImprovement: "+34 hours support", costChange: "0", kpiImprovement: "+3% initiative governance" },
    financialImpact: { currentMonthlyCost: "Rp 190M", projectedMonthlyCost: "Rp 190M", delta: "0" },
    workloadImpact: "Available capacity utilized for strategic oversight",
    kpiImpact: "Prioritization cycle-time improved by 6 days",
    suggestedActions: ["Reassign Talent", "Send to Scenario"],
    status: "New",
    createdAt: "2026-04-20",
    sourceModules: ["Org Data", "Scenario Data", "Workload Data"],
  },
  {
    id: "INS-012",
    title: "HC Planning Data Stewardship Gap",
    category: "Role Redesign",
    severity: "Medium",
    confidenceScore: 83,
    department: "Human Capital Management",
    affectedPositions: ["Organization Development Specialist"],
    affectedProcesses: ["Workforce Roster Review"],
    affectedActivities: [{ name: "HC Data Validation and Consolidation", workloadHours: 66, responsiblePosition: "Organization Development Specialist", utilization: 111, status: "Overloaded" }],
    summary: "Roster and HC data quality checks are concentrated in one specialist role.",
    recommendation: "Create Workforce Cost Analyst to split HC data stewardship and cost forecasting.",
    reasoning: "Data quality defects correlate with single-point accountability.",
    dataEvidence: { utilization: "111%", hcGap: "0.9 FTE", kpiImpact: "Workforce plan accuracy -8%", costImpact: "+Rp 30M/month", requiredHC: 2.9, assignedHC: 2.0 },
    impactProjection: { workloadImprovement: "-20% overload", costChange: "+Rp 30M/month", kpiImprovement: "+8% planning accuracy" },
    financialImpact: { currentMonthlyCost: "Rp 302M", projectedMonthlyCost: "Rp 332M", delta: "+Rp 30M" },
    workloadImpact: "Planning cycle stabilized with dual ownership",
    kpiImpact: "HC planning precision projected to recover to 93%",
    suggestedActions: ["Generate Position", "Open Related Process"],
    status: "New",
    createdAt: "2026-04-20",
    sourceModules: ["Org Data", "Cost Data", "Process Data", "Workload Data"],
  },
];

export const aiGeneratedPositions: AIGeneratedPosition[] = [
  {
    id: "AI-POS-001",
    positionName: "Vendor Governance Specialist",
    nomenclature: "Vendor Governance Specialist",
    department: "Procurement",
    jobFamily: "Procurement Governance",
    jobLevel: "Senior Officer",
    employmentType: "Permanent",
    status: "Recommended",
    reportsTo: "Procurement Manager",
    directSubordinates: [],
    reasonForCreation: "AI detected fragmented ownership across vendor evaluation, vendor compliance monitoring, and contract follow-up activities, resulting in procurement SLA delays and audit risk.",
    businessObjective: "Strengthen vendor governance, improve procurement SLA compliance, and reduce vendor evaluation delays.",
    roleSummary: "Own vendor lifecycle governance, coordinate compliance checks, and maintain procurement audit readiness.",
    coreResponsibilities: ["Manage governance standards for vendor onboarding and evaluation.", "Lead monthly vendor compliance review with Legal and Finance.", "Track vendor SLA adherence and escalate delayed approvals.", "Maintain vendor performance documentation and evidence logs.", "Monitor contract compliance exceptions and closure progress.", "Coordinate corrective action plans with vendor owners.", "Publish vendor governance dashboard for leadership.", "Standardize control checkpoints across procurement workflows."],
    keyDeliverables: ["Monthly vendor governance performance report", "Vendor SLA compliance dashboard", "Updated vendor evaluation records", "Contract compliance exception log", "Procurement audit readiness documentation"],
    linkedBusinessProcesses: [{ processName: "Vendor Registration and Evaluation", roleInProcess: "Owner", kpiSupported: "Vendor Evaluation SLA Compliance", currentKpi: "82%", targetKpi: "95%" }, { processName: "Procurement Request to Payment", roleInProcess: "Reviewer", kpiSupported: "Procurement Cycle Time", currentKpi: "78%", targetKpi: "90%" }, { processName: "Contract Lifecycle Management", roleInProcess: "Compliance Monitor", kpiSupported: "Contract Compliance Rate", currentKpi: "86%", targetKpi: "96%" }],
    linkedKPIs: [{ kpiName: "Vendor Evaluation SLA Compliance", currentValue: "82%", targetValue: "95%", expectedImprovement: "+13%" }, { kpiName: "Procurement Cycle Time", currentValue: "78%", targetValue: "90%", expectedImprovement: "+12%" }],
    linkedActivities: [{ activityName: "Vendor Compliance Review", frequency: "40 times/month", durationHours: 1.2, monthlyWorkloadHours: 48, complexityLevel: "Medium", responsibleRole: "Vendor Governance Specialist" }, { activityName: "Vendor Performance Evaluation", frequency: "25 times/month", durationHours: 1.5, monthlyWorkloadHours: 37.5, complexityLevel: "High", responsibleRole: "Vendor Governance Specialist" }, { activityName: "Contract Compliance Monitoring", frequency: "30 times/month", durationHours: 1, monthlyWorkloadHours: 30, complexityLevel: "Medium", responsibleRole: "Vendor Governance Specialist" }, { activityName: "Procurement SLA Follow-up", frequency: "60 times/month", durationHours: 0.5, monthlyWorkloadHours: 30, complexityLevel: "Low", responsibleRole: "Vendor Governance Specialist" }, { activityName: "Vendor Issue Escalation Coordination", frequency: "18 times/month", durationHours: 1.1, monthlyWorkloadHours: 19.8, complexityLevel: "Medium", responsibleRole: "Vendor Governance Specialist" }],
    workloadAnalysis: { baseWorkloadHours: 165.3, complexityMultiplier: 1.15, qualityFactor: 1.1, reworkRate: 0.08, adjustedWorkloadHours: 225.7, effectiveMonthlyCapacity: 136, requiredHC: 1.66, recommendedHC: 2, expectedUtilization: "83%" },
    costEstimate: { baseSalary: 22000000, allowances: 4500000, benefits: 3200000, bonusAllocation: 2100000, totalMonthlyCost: 31800000, totalAnnualCost: 381600000, costPerWorkloadHour: 140895 },
    competencyRequirements: { education: "Bachelor's degree in Business Administration, Supply Chain Management, Law, or related field", minimumExperience: "5 years in procurement, vendor management, contract administration, or governance", technicalCompetencies: ["Vendor governance", "Procurement process management", "Contract compliance", "SLA monitoring", "Audit documentation"], behavioralCompetencies: ["Analytical thinking", "Stakeholder coordination", "Attention to detail", "Problem solving", "Integrity"], certifications: ["Procurement Management Certification", "Contract Management Certification preferred"] },
    reportingStructure: { reportsToPosition: "Procurement Manager", peerPositions: ["Vendor Management Officer", "Procurement Analyst"], subordinatePositions: [] },
    implementationPlan: ["Create position under Procurement division", "Assign reporting line to Procurement Manager", "Transfer vendor governance activities from Procurement Manager and Vendor Officers", "Configure KPI ownership for vendor evaluation SLA", "Monitor workload and KPI impact for 3 months after implementation"],
    impactAnalysis: { workloadReduction: "31 hours/month removed from Procurement Manager", kpiImprovement: "+12% procurement cycle performance", riskReduction: "High reduction in vendor audit risk", costImpact: "Rp 31,8 Juta/month additional workforce cost", affectedDepartments: ["Procurement", "Legal & Compliance", "Finance & Governance"] },
    risksIfNotCreated: ["Vendor evaluation delays remain above SLA threshold", "Procurement Manager remains overloaded with governance tasks", "Audit documentation gaps continue", "Contract compliance exceptions increase"],
    sourceInsight: "Procurement Process Ownership Gap",
    scenarioReadiness: "Ready for Scenario Simulation",
  },
  {
    id: "AI-POS-002", positionName: "Port Operations Capacity Planner", nomenclature: "Port Operations Capacity Planner", department: "Operations", jobFamily: "Operations Planning", jobLevel: "Senior Officer", employmentType: "Permanent", status: "Ready for Scenario Simulation", reportsTo: "Head of Operations", directSubordinates: ["Shift Scheduling Analyst"], reasonForCreation: "Berth and yard planning workload exceeds available planning capacity, creating recurring delay risk.", businessObjective: "Improve berth plan reliability, increase on-time berthing, and stabilize shift capacity decisions.", roleSummary: "Design monthly capacity plans for berth, yard, and shift resources to sustain operational throughput.", coreResponsibilities: ["Build integrated berth and yard capacity plan.", "Monitor vessel volume forecast and peak utilization windows.", "Lead weekly shift rebalancing with terminal supervisors.", "Model resource bottlenecks and mitigation options.", "Coordinate maintenance slots with operations teams.", "Set recovery plan for delayed vessel windows.", "Track planning execution variance against baseline.", "Publish operational capacity briefing to directorate."], keyDeliverables: ["Monthly berth capacity plan", "Weekly shift balancing report", "Peak-period contingency plan", "On-time berthing variance dashboard", "Capacity utilization heatmap"], linkedBusinessProcesses: [{ processName: "Vessel Arrival to Berthing", roleInProcess: "Planning Owner", kpiSupported: "On-Time Berthing", currentKpi: "84%", targetKpi: "92%" }, { processName: "Workforce Roster Review", roleInProcess: "Demand Input Provider", kpiSupported: "Shift Fulfillment Rate", currentKpi: "87%", targetKpi: "95%" }], linkedKPIs: [{ kpiName: "On-Time Berthing", currentValue: "84%", targetValue: "92%", expectedImprovement: "+8%" }, { kpiName: "Shift Fulfillment Rate", currentValue: "87%", targetValue: "95%", expectedImprovement: "+8%" }], linkedActivities: [{ activityName: "Berth Slot Optimization", frequency: "65 times/month", durationHours: 1.3, monthlyWorkloadHours: 84.5, complexityLevel: "High", responsibleRole: "Port Operations Capacity Planner" }, { activityName: "Yard Congestion Forecast", frequency: "22 times/month", durationHours: 2, monthlyWorkloadHours: 44, complexityLevel: "High", responsibleRole: "Port Operations Capacity Planner" }, { activityName: "Shift Balancing Meeting", frequency: "26 times/month", durationHours: 1.2, monthlyWorkloadHours: 31.2, complexityLevel: "Medium", responsibleRole: "Port Operations Capacity Planner" }, { activityName: "Resource Reallocation Approval", frequency: "34 times/month", durationHours: 0.8, monthlyWorkloadHours: 27.2, complexityLevel: "Medium", responsibleRole: "Port Operations Capacity Planner" }, { activityName: "Disruption Recovery Planning", frequency: "10 times/month", durationHours: 2.3, monthlyWorkloadHours: 23, complexityLevel: "High", responsibleRole: "Port Operations Capacity Planner" }], workloadAnalysis: { baseWorkloadHours: 209.9, complexityMultiplier: 1.12, qualityFactor: 1.08, reworkRate: 0.06, adjustedWorkloadHours: 266.8, effectiveMonthlyCapacity: 136, requiredHC: 1.96, recommendedHC: 2, expectedUtilization: "98%" }, costEstimate: { baseSalary: 25000000, allowances: 5600000, benefits: 3500000, bonusAllocation: 2800000, totalMonthlyCost: 36900000, totalAnnualCost: 442800000, costPerWorkloadHour: 138306 }, competencyRequirements: { education: "Bachelor's degree in Industrial Engineering, Maritime Management, or related field", minimumExperience: "6 years in port operations planning or terminal operations", technicalCompetencies: ["Port capacity planning", "Operational analytics", "Resource optimization", "Berthing coordination", "Scenario simulation"], behavioralCompetencies: ["Decision making", "Cross-unit collaboration", "Composure under pressure", "Communication", "Execution discipline"], certifications: ["Supply Chain Planning Certification preferred", "Port Operations Professional Certificate"] }, reportingStructure: { reportsToPosition: "Head of Operations", peerPositions: ["Terminal Operations Manager", "Vessel Scheduling Coordinator"], subordinatePositions: ["Shift Scheduling Analyst"] }, implementationPlan: ["Approve role under Operations directorate", "Define berth and shift planning ownership matrix", "Migrate planning decisions from reactive to weekly cadence", "Integrate planning dashboard with operational command center", "Review KPI uplift after first 12 weeks"], impactAnalysis: { workloadReduction: "58 hours/month removed from Head of Operations and terminal supervisors", kpiImprovement: "+8% on-time berthing", riskReduction: "Reduced congestion and delay risk during peak windows", costImpact: "Rp 36,9 Juta/month additional workforce cost", affectedDepartments: ["Operations", "Port Services"] }, risksIfNotCreated: ["Berthing punctuality remains below target", "Shift imbalance continues in night operations", "Reactive resource decisions increase delay penalties", "Peak season congestion risk persists"], sourceInsight: "Operations Overload Risk", scenarioReadiness: "Ready for Scenario Simulation" },
  {
    id: "AI-POS-003", positionName: "Automation Business Analyst", nomenclature: "Automation Business Analyst", department: "Digital Transformation", jobFamily: "Digital Strategy", jobLevel: "Officer", employmentType: "Permanent", status: "Recommended", reportsTo: "Digital Transformation Lead", directSubordinates: [], reasonForCreation: "Automation backlog and delayed process redesign indicate missing analysis capacity between business and digital teams.", businessObjective: "Accelerate automation pipeline and reduce manual process workload in high-volume operations.", roleSummary: "Bridge business process owners and digital squads to define automation use cases and quantify value realization.", coreResponsibilities: ["Map current-state workflows and pain points.", "Prioritize automation opportunities using value and feasibility scoring.", "Define business requirements for automation squads.", "Coordinate user acceptance and pilot rollout.", "Track automation benefit realization post-go-live.", "Align automation roadmap with department KPIs.", "Document process changes and governance controls.", "Facilitate stakeholder workshops for adoption readiness."], keyDeliverables: ["Automation opportunity backlog", "Business case for automation initiatives", "Approved requirement packs", "Pilot realization report", "Quarterly automation value dashboard"], linkedBusinessProcesses: [{ processName: "Digital Initiative Prioritization", roleInProcess: "Opportunity Lead", kpiSupported: "Automation Delivery On-Time", currentKpi: "78%", targetKpi: "90%" }, { processName: "Incident Reporting and Resolution", roleInProcess: "Improvement Analyst", kpiSupported: "Incident Repeat Rate", currentKpi: "74%", targetKpi: "88%" }], linkedKPIs: [{ kpiName: "Automation Delivery On-Time", currentValue: "78%", targetValue: "90%", expectedImprovement: "+12%" }, { kpiName: "Manual Rework Rate", currentValue: "18%", targetValue: "10%", expectedImprovement: "-8%" }], linkedActivities: [{ activityName: "Automation Use-Case Assessment", frequency: "32 times/month", durationHours: 2.1, monthlyWorkloadHours: 67.2, complexityLevel: "High", responsibleRole: "Automation Business Analyst" }, { activityName: "Process Mapping Workshop", frequency: "14 times/month", durationHours: 2.4, monthlyWorkloadHours: 33.6, complexityLevel: "Medium", responsibleRole: "Automation Business Analyst" }, { activityName: "Benefit Modeling", frequency: "18 times/month", durationHours: 1.8, monthlyWorkloadHours: 32.4, complexityLevel: "High", responsibleRole: "Automation Business Analyst" }, { activityName: "User Acceptance Coordination", frequency: "24 times/month", durationHours: 1, monthlyWorkloadHours: 24, complexityLevel: "Medium", responsibleRole: "Automation Business Analyst" }, { activityName: "Post-Go-Live Performance Review", frequency: "12 times/month", durationHours: 1.5, monthlyWorkloadHours: 18, complexityLevel: "Medium", responsibleRole: "Automation Business Analyst" }], workloadAnalysis: { baseWorkloadHours: 175.2, complexityMultiplier: 1.18, qualityFactor: 1.08, reworkRate: 0.07, adjustedWorkloadHours: 239.3, effectiveMonthlyCapacity: 136, requiredHC: 1.76, recommendedHC: 2, expectedUtilization: "88%" }, costEstimate: { baseSalary: 24000000, allowances: 4200000, benefits: 3000000, bonusAllocation: 2700000, totalMonthlyCost: 33900000, totalAnnualCost: 406800000, costPerWorkloadHour: 141663 }, competencyRequirements: { education: "Bachelor's degree in Information Systems, Industrial Engineering, or related field", minimumExperience: "4 years in business analysis and process transformation", technicalCompetencies: ["Business process modeling", "Automation use-case discovery", "Benefit quantification", "Requirements management", "Data analysis"], behavioralCompetencies: ["Facilitation", "Critical thinking", "Influence without authority", "Structured communication", "Adaptability"], certifications: ["CBAP or equivalent preferred", "Lean Six Sigma Green Belt preferred"] }, reportingStructure: { reportsToPosition: "Digital Transformation Lead", peerPositions: ["IT Service Delivery Analyst", "Process Excellence Analyst"], subordinatePositions: [] }, implementationPlan: ["Approve role in Digital Transformation team", "Define quarterly automation target and value baseline", "Assign top-10 backlog initiatives to new role", "Establish weekly design governance with IT and Process Excellence", "Measure realized savings and KPI movement for 3 months"], impactAnalysis: { workloadReduction: "52 hours/month removed from Digital Transformation Lead", kpiImprovement: "+11% automation execution performance", riskReduction: "Reduced risk of failed automation prioritization", costImpact: "Rp 33,9 Juta/month additional workforce cost", affectedDepartments: ["Digital Transformation", "Process Excellence", "IT Infrastructure"] }, risksIfNotCreated: ["Automation pipeline remains bottlenecked", "Manual rework persists in core processes", "Digital initiatives miss delivery timeline", "Business teams lose trust in transformation roadmap"], sourceInsight: "Digital Transformation Capacity Gap", scenarioReadiness: "Recommended for Scenario A and Aggressive Growth" },
  {
    id: "AI-POS-004", positionName: "Workforce Cost Analyst", nomenclature: "Workforce Cost Analyst", department: "Human Capital Management", jobFamily: "Workforce Planning", jobLevel: "Officer", employmentType: "Permanent", status: "Recommended", reportsTo: "Organization Development Specialist", directSubordinates: [], reasonForCreation: "HC cost planning and validation activities are concentrated in one overloaded specialist role.", businessObjective: "Improve workforce planning accuracy and provide transparent cost simulation for management decisions.", roleSummary: "Develop headcount-cost forecasts, validate compensation assumptions, and support scenario-based workforce decisions.", coreResponsibilities: ["Build monthly workforce cost forecast by department.", "Validate remuneration assumptions against grade standards.", "Analyze variance between planned and actual HC cost.", "Support scenario cost simulation for organization redesign.", "Coordinate data quality checks with HR operations.", "Develop unit-level productivity and cost insights.", "Prepare executive workforce cost briefing pack.", "Recommend optimization opportunities with quantified impact."], keyDeliverables: ["Department workforce cost forecast", "HC cost variance dashboard", "Scenario simulation pack", "Compensation assumption register", "Quarterly workforce productivity-cost report"], linkedBusinessProcesses: [{ processName: "Workforce Roster Review", roleInProcess: "Cost Model Owner", kpiSupported: "Workforce Plan Accuracy", currentKpi: "85%", targetKpi: "94%" }, { processName: "Monthly Financial Closing", roleInProcess: "Workforce Cost Validator", kpiSupported: "Cost Forecast Accuracy", currentKpi: "83%", targetKpi: "93%" }], linkedKPIs: [{ kpiName: "Workforce Plan Accuracy", currentValue: "85%", targetValue: "94%", expectedImprovement: "+9%" }, { kpiName: "Cost Forecast Accuracy", currentValue: "83%", targetValue: "93%", expectedImprovement: "+10%" }], linkedActivities: [{ activityName: "HC Cost Projection Modeling", frequency: "20 times/month", durationHours: 2.8, monthlyWorkloadHours: 56, complexityLevel: "High", responsibleRole: "Workforce Cost Analyst" }, { activityName: "Department Cost Variance Review", frequency: "18 times/month", durationHours: 1.6, monthlyWorkloadHours: 28.8, complexityLevel: "Medium", responsibleRole: "Workforce Cost Analyst" }, { activityName: "Compensation Assumption Validation", frequency: "24 times/month", durationHours: 1.1, monthlyWorkloadHours: 26.4, complexityLevel: "Medium", responsibleRole: "Workforce Cost Analyst" }, { activityName: "Scenario Cost Sensitivity Analysis", frequency: "10 times/month", durationHours: 2.6, monthlyWorkloadHours: 26, complexityLevel: "High", responsibleRole: "Workforce Cost Analyst" }, { activityName: "Executive Cost Briefing Preparation", frequency: "8 times/month", durationHours: 2.2, monthlyWorkloadHours: 17.6, complexityLevel: "Medium", responsibleRole: "Workforce Cost Analyst" }], workloadAnalysis: { baseWorkloadHours: 154.8, complexityMultiplier: 1.17, qualityFactor: 1.08, reworkRate: 0.06, adjustedWorkloadHours: 208.5, effectiveMonthlyCapacity: 136, requiredHC: 1.53, recommendedHC: 2, expectedUtilization: "77%" }, costEstimate: { baseSalary: 21500000, allowances: 4000000, benefits: 2800000, bonusAllocation: 1700000, totalMonthlyCost: 30000000, totalAnnualCost: 360000000, costPerWorkloadHour: 143885 }, competencyRequirements: { education: "Bachelor's degree in Accounting, Finance, Statistics, or Human Resource Management", minimumExperience: "4 years in workforce analytics, compensation planning, or financial analysis", technicalCompetencies: ["Workforce cost modeling", "Scenario planning", "Data validation", "Spreadsheet and BI tools", "Compensation analysis"], behavioralCompetencies: ["Numerical accuracy", "Business judgment", "Collaboration", "Structured problem solving", "Accountability"], certifications: ["Certified Compensation Professional preferred", "Data Analytics Certification preferred"] }, reportingStructure: { reportsToPosition: "Organization Development Specialist", peerPositions: ["HR Planning Analyst", "Finance Planning Specialist"], subordinatePositions: [] }, implementationPlan: ["Create role under Human Capital Management", "Transfer HC cost modeling activities from OD Specialist", "Integrate workforce cost model with Finance monthly closing", "Publish standardized cost assumptions by grade", "Track forecast accuracy improvement for 2 quarters"], impactAnalysis: { workloadReduction: "38 hours/month removed from Organization Development Specialist", kpiImprovement: "+9% workforce plan accuracy", riskReduction: "Reduced risk of misaligned HC budgeting", costImpact: "Rp 30 Juta/month additional workforce cost", affectedDepartments: ["Human Capital Management", "Finance & Governance", "Strategy & Corporate Planning"] }, risksIfNotCreated: ["HC cost forecast remains inconsistent across modules", "Planning cycles continue with low confidence assumptions", "Scenario cost impacts remain disputed", "OD Specialist workload remains above sustainable threshold"], sourceInsight: "HC Planning Data Stewardship Gap", scenarioReadiness: "Ready for Scenario Simulation" },
  {
    id: "AI-POS-005", positionName: "Process Ownership Lead", nomenclature: "Process Ownership Lead", department: "Process Excellence", jobFamily: "Process Governance", jobLevel: "Manager", employmentType: "Permanent", status: "Ready for Scenario Simulation", reportsTo: "Process Excellence Manager", directSubordinates: ["Process Governance Analyst"], reasonForCreation: "Critical workflows have recurring ownership gaps and unresolved governance findings.", businessObjective: "Establish end-to-end process ownership accountability and improve process compliance score.", roleSummary: "Lead process governance framework, enforce ownership checkpoints, and close RACI accountability gaps.", coreResponsibilities: ["Maintain enterprise process owner register.", "Run quarterly ownership and RACI compliance audit.", "Define governance escalation for orphan activities.", "Coordinate corrective actions with directorate owners.", "Review process KPI ownership coverage.", "Facilitate governance forum with Risk and Internal Audit.", "Track closure of process control exceptions.", "Publish process accountability performance report."], keyDeliverables: ["Enterprise process owner register", "Quarterly RACI audit report", "Governance issue escalation log", "Process KPI ownership matrix", "Process accountability dashboard"], linkedBusinessProcesses: [{ processName: "Operational Risk Review", roleInProcess: "Governance Lead", kpiSupported: "Process Compliance Score", currentKpi: "81%", targetKpi: "92%" }, { processName: "Workforce Roster Review", roleInProcess: "Control Reviewer", kpiSupported: "Ownership Coverage", currentKpi: "76%", targetKpi: "95%" }], linkedKPIs: [{ kpiName: "Process Compliance Score", currentValue: "81%", targetValue: "92%", expectedImprovement: "+11%" }, { kpiName: "Ownership Coverage", currentValue: "76%", targetValue: "95%", expectedImprovement: "+19%" }], linkedActivities: [{ activityName: "Ownership Baseline Validation", frequency: "16 times/month", durationHours: 2.2, monthlyWorkloadHours: 35.2, complexityLevel: "High", responsibleRole: "Process Ownership Lead" }, { activityName: "RACI Control Review", frequency: "20 times/month", durationHours: 1.9, monthlyWorkloadHours: 38, complexityLevel: "High", responsibleRole: "Process Ownership Lead" }, { activityName: "Governance Escalation Coordination", frequency: "24 times/month", durationHours: 1.2, monthlyWorkloadHours: 28.8, complexityLevel: "Medium", responsibleRole: "Process Ownership Lead" }, { activityName: "Control Exception Closure Monitoring", frequency: "18 times/month", durationHours: 1.4, monthlyWorkloadHours: 25.2, complexityLevel: "Medium", responsibleRole: "Process Ownership Lead" }, { activityName: "Governance Committee Reporting", frequency: "8 times/month", durationHours: 2.5, monthlyWorkloadHours: 20, complexityLevel: "Medium", responsibleRole: "Process Ownership Lead" }], workloadAnalysis: { baseWorkloadHours: 147.2, complexityMultiplier: 1.22, qualityFactor: 1.1, reworkRate: 0.07, adjustedWorkloadHours: 215.3, effectiveMonthlyCapacity: 136, requiredHC: 1.58, recommendedHC: 2, expectedUtilization: "79%" }, costEstimate: { baseSalary: 28000000, allowances: 5200000, benefits: 3300000, bonusAllocation: 2500000, totalMonthlyCost: 39000000, totalAnnualCost: 468000000, costPerWorkloadHour: 181142 }, competencyRequirements: { education: "Bachelor's degree in Industrial Engineering, Management, or related field", minimumExperience: "7 years in process governance, internal control, or business transformation", technicalCompetencies: ["Process governance", "RACI design", "Control assessment", "KPI governance", "Audit remediation"], behavioralCompetencies: ["Leadership", "Negotiation", "Risk awareness", "Executive communication", "Follow-through"], certifications: ["Lean Six Sigma Black Belt preferred", "Internal Control Certification preferred"] }, reportingStructure: { reportsToPosition: "Process Excellence Manager", peerPositions: ["Risk Management Analyst", "Internal Audit Liaison"], subordinatePositions: ["Process Governance Analyst"] }, implementationPlan: ["Establish role in Process Excellence structure", "Create enterprise ownership baseline within 30 days", "Launch monthly governance cadence with all directorates", "Assign unresolved process gaps to accountable owners", "Track governance score improvement for two quarters"], impactAnalysis: { workloadReduction: "45 hours/month removed from Process Excellence Manager", kpiImprovement: "+11% process compliance score", riskReduction: "High reduction in recurring audit findings", costImpact: "Rp 39 Juta/month additional workforce cost", affectedDepartments: ["Process Excellence", "Risk Management", "All Directorates"] }, risksIfNotCreated: ["Ownership gaps remain unresolved across strategic processes", "Control exceptions continue to recur", "Audit findings increase in quarterly review", "Cross-functional disputes over accountability persist"], sourceInsight: "Process Excellence Missing Governance Node", scenarioReadiness: "Ready for Scenario Simulation" },
  {
    id: "AI-POS-006", positionName: "Terminal Resource Planner", nomenclature: "Terminal Resource Planner", department: "Port Services", jobFamily: "Terminal Operations Planning", jobLevel: "Officer", employmentType: "Permanent", status: "Recommended", reportsTo: "Port Services Manager", directSubordinates: [], reasonForCreation: "Night shift resource imbalance causes repeated turnaround and service-level slippage.", businessObjective: "Optimize terminal manpower and equipment planning across shifts to improve turnaround reliability.", roleSummary: "Plan terminal resource deployment by shift and demand profile to minimize congestion and idle capacity.", coreResponsibilities: ["Prepare shift-level manpower demand plans.", "Coordinate equipment allocation with terminal supervisors.", "Monitor queue and turnaround trend by terminal zone.", "Issue daily reallocation recommendation during disruptions.", "Analyze overtime and idle hour patterns.", "Align roster planning with vessel arrival forecasts.", "Maintain resource planning assumptions and rules.", "Report service-level risk and mitigation options."], keyDeliverables: ["Shift resource deployment plan", "Daily congestion risk alert", "Weekly turnaround performance report", "Overtime and idle-hour optimization dashboard", "Resource planning assumptions register"], linkedBusinessProcesses: [{ processName: "Vessel Arrival to Berthing", roleInProcess: "Shift Planner", kpiSupported: "Terminal Turnaround Time", currentKpi: "82%", targetKpi: "90%" }, { processName: "Workforce Roster Review", roleInProcess: "Capacity Input Owner", kpiSupported: "Roster Effectiveness", currentKpi: "85%", targetKpi: "93%" }], linkedKPIs: [{ kpiName: "Terminal Turnaround Time", currentValue: "82%", targetValue: "90%", expectedImprovement: "+8%" }, { kpiName: "Night Shift SLA", currentValue: "80%", targetValue: "90%", expectedImprovement: "+10%" }], linkedActivities: [{ activityName: "Shift Capacity Rebalancing", frequency: "65 times/month", durationHours: 1.1, monthlyWorkloadHours: 71.5, complexityLevel: "Medium", responsibleRole: "Terminal Resource Planner" }, { activityName: "Equipment Capacity Matching", frequency: "42 times/month", durationHours: 1, monthlyWorkloadHours: 42, complexityLevel: "Medium", responsibleRole: "Terminal Resource Planner" }, { activityName: "Disruption Reallocation Planning", frequency: "20 times/month", durationHours: 1.7, monthlyWorkloadHours: 34, complexityLevel: "High", responsibleRole: "Terminal Resource Planner" }, { activityName: "Shift Overtime Review", frequency: "26 times/month", durationHours: 0.9, monthlyWorkloadHours: 23.4, complexityLevel: "Low", responsibleRole: "Terminal Resource Planner" }, { activityName: "Turnaround Exception Coordination", frequency: "16 times/month", durationHours: 1.3, monthlyWorkloadHours: 20.8, complexityLevel: "Medium", responsibleRole: "Terminal Resource Planner" }], workloadAnalysis: { baseWorkloadHours: 191.7, complexityMultiplier: 1.11, qualityFactor: 1.06, reworkRate: 0.06, adjustedWorkloadHours: 225.5, effectiveMonthlyCapacity: 136, requiredHC: 1.66, recommendedHC: 2, expectedUtilization: "83%" }, costEstimate: { baseSalary: 21000000, allowances: 3800000, benefits: 2600000, bonusAllocation: 1900000, totalMonthlyCost: 29300000, totalAnnualCost: 351600000, costPerWorkloadHour: 129933 }, competencyRequirements: { education: "Bachelor's degree in Logistics, Maritime Studies, or Industrial Engineering", minimumExperience: "4 years in terminal operations or workforce planning", technicalCompetencies: ["Shift planning", "Terminal operations analytics", "Capacity balancing", "Dispatch coordination", "Service-level monitoring"], behavioralCompetencies: ["Situational awareness", "Coordination", "Prioritization", "Resilience", "Problem solving"], certifications: ["Port Operations Certificate preferred", "Operational Planning Certification preferred"] }, reportingStructure: { reportsToPosition: "Port Services Manager", peerPositions: ["Vessel Scheduling Coordinator", "Yard Supervisor"], subordinatePositions: [] }, implementationPlan: ["Create planner role in Port Services", "Migrate night-shift balancing tasks to new role", "Implement shift-level dashboard and alert thresholds", "Formalize daily reallocation stand-up routine", "Evaluate SLA trend after 8 weeks"], impactAnalysis: { workloadReduction: "29 hours/month removed from Port Services Manager and dispatch supervisors", kpiImprovement: "+8% terminal turnaround performance", riskReduction: "Lower risk of night-shift bottlenecks and delay penalties", costImpact: "Rp 29,3 Juta/month additional workforce cost", affectedDepartments: ["Port Services", "Operations"] }, risksIfNotCreated: ["Night shift imbalance remains unresolved", "Turnaround delays continue in peak days", "Overtime expenses increase without productivity gain", "Customer service levels remain unstable"], sourceInsight: "Port Services Shift Allocation Imbalance", scenarioReadiness: "Ready for Scenario Simulation" },
  {
    id: "AI-POS-007", positionName: "Customer Billing Quality Specialist", nomenclature: "Customer Billing Quality Specialist", department: "Commercial & Customer Solutions", jobFamily: "Revenue Operations", jobLevel: "Officer", employmentType: "Permanent", status: "Recommended", reportsTo: "Commercial Operations Manager", directSubordinates: [], reasonForCreation: "Billing exception handling is fragmented and handled outside commercial ownership, causing rework and delayed invoicing.", businessObjective: "Improve billing first-pass accuracy and reduce cross-functional rework in invoice processing.", roleSummary: "Own billing quality controls, manage exception queue, and drive root-cause elimination for recurring billing errors.", coreResponsibilities: ["Own end-to-end billing exception queue.", "Analyze root causes of invoice rejection and disputes.", "Coordinate correction actions with Finance and customer teams.", "Maintain billing quality rulebook and SOP compliance.", "Track first-pass invoice performance by segment.", "Lead weekly billing quality huddle with stakeholders.", "Escalate recurring defects to process owners.", "Recommend digital control improvements for billing workflow."], keyDeliverables: ["Billing quality dashboard", "Exception queue aging report", "Root-cause and corrective action log", "First-pass invoice KPI report", "Billing control SOP update pack"], linkedBusinessProcesses: [{ processName: "Customer Order to Billing", roleInProcess: "Quality Owner", kpiSupported: "Billing First-Pass Accuracy", currentKpi: "92%", targetKpi: "97%" }, { processName: "Monthly Financial Closing", roleInProcess: "Data Quality Reviewer", kpiSupported: "Invoice Error Rate", currentKpi: "6.8%", targetKpi: "3.0%" }], linkedKPIs: [{ kpiName: "Billing First-Pass Accuracy", currentValue: "92%", targetValue: "97%", expectedImprovement: "+5%" }, { kpiName: "Invoice Error Rate", currentValue: "6.8%", targetValue: "3.0%", expectedImprovement: "-3.8%" }], linkedActivities: [{ activityName: "Exception Queue Triage", frequency: "90 times/month", durationHours: 0.7, monthlyWorkloadHours: 63, complexityLevel: "Medium", responsibleRole: "Customer Billing Quality Specialist" }, { activityName: "Root Cause Classification", frequency: "52 times/month", durationHours: 0.9, monthlyWorkloadHours: 46.8, complexityLevel: "Medium", responsibleRole: "Customer Billing Quality Specialist" }, { activityName: "Cross-Function Correction Coordination", frequency: "38 times/month", durationHours: 1.1, monthlyWorkloadHours: 41.8, complexityLevel: "Medium", responsibleRole: "Customer Billing Quality Specialist" }, { activityName: "Billing Rule Validation", frequency: "20 times/month", durationHours: 1.6, monthlyWorkloadHours: 32, complexityLevel: "High", responsibleRole: "Customer Billing Quality Specialist" }, { activityName: "Customer Billing Quality Review", frequency: "18 times/month", durationHours: 1.2, monthlyWorkloadHours: 21.6, complexityLevel: "Low", responsibleRole: "Customer Billing Quality Specialist" }], workloadAnalysis: { baseWorkloadHours: 205.2, complexityMultiplier: 1.09, qualityFactor: 1.08, reworkRate: 0.07, adjustedWorkloadHours: 241.2, effectiveMonthlyCapacity: 136, requiredHC: 1.77, recommendedHC: 2, expectedUtilization: "88%" }, costEstimate: { baseSalary: 20500000, allowances: 3500000, benefits: 2400000, bonusAllocation: 1600000, totalMonthlyCost: 28000000, totalAnnualCost: 336000000, costPerWorkloadHour: 116086 }, competencyRequirements: { education: "Bachelor's degree in Accounting, Business, or Information Systems", minimumExperience: "4 years in billing operations, revenue assurance, or finance operations", technicalCompetencies: ["Billing controls", "Exception management", "Data quality", "Root-cause analysis", "KPI reporting"], behavioralCompetencies: ["Customer orientation", "Accuracy", "Collaboration", "Persistence", "Problem solving"], certifications: ["Revenue Assurance Certification preferred", "Data Quality Certification preferred"] }, reportingStructure: { reportsToPosition: "Commercial Operations Manager", peerPositions: ["Customer Billing Specialist", "Finance Planning Specialist"], subordinatePositions: [] }, implementationPlan: ["Create position in Commercial Operations", "Transfer billing exception queue ownership from Finance", "Define first-pass and error-rate ownership KPI", "Introduce weekly root-cause closure cadence", "Review KPI trend and rework cost after 3 months"], impactAnalysis: { workloadReduction: "31 hours/month removed from Finance Planning Specialist", kpiImprovement: "+5% billing first-pass accuracy", riskReduction: "Reduced risk of billing disputes and delayed recognition", costImpact: "Rp 28 Juta/month additional workforce cost with rework savings", affectedDepartments: ["Commercial & Customer Solutions", "Finance & Governance"] }, risksIfNotCreated: ["Billing exception queue continues to age", "Finance team remains overloaded by non-core billing work", "Invoice disputes and correction cycle increase", "Revenue recognition timing becomes less predictable"], sourceInsight: "Commercial Billing Rework Concentration", scenarioReadiness: "Ready for Scenario Simulation" },
  {
    id: "AI-POS-008", positionName: "Digital Service Operations Coordinator", nomenclature: "Digital Service Operations Coordinator", department: "IT Infrastructure", jobFamily: "IT Service Operations", jobLevel: "Coordinator", employmentType: "Permanent", status: "Implemented", reportsTo: "IT Service Delivery Manager", directSubordinates: [], reasonForCreation: "Incident escalation routing is concentrated in one analyst role, causing SLA breach risk and delayed restoration.", businessObjective: "Improve incident escalation throughput and restore digital service SLA reliability.", roleSummary: "Coordinate L2 escalation flow, ensure resolver alignment, and monitor incident performance against SLA commitments.", coreResponsibilities: ["Own incident escalation routing and prioritization.", "Coordinate resolver teams for high-severity incidents.", "Track incident queue aging and SLA breach risk.", "Maintain escalation handoff standards and audit trail.", "Lead daily incident war-room coordination.", "Publish incident performance trend and bottleneck analysis.", "Ensure closure quality and repeat-incident prevention follow-up.", "Support service continuity planning for critical digital services."], keyDeliverables: ["Daily incident escalation dashboard", "SLA breach prevention report", "Critical incident war-room log", "Escalation quality and closure report", "Monthly service reliability review pack"], linkedBusinessProcesses: [{ processName: "Incident Reporting and Resolution", roleInProcess: "Escalation Coordinator", kpiSupported: "Incident SLA Compliance", currentKpi: "81%", targetKpi: "90%" }, { processName: "Digital Initiative Prioritization", roleInProcess: "Operational Readiness Reviewer", kpiSupported: "Service Stability Index", currentKpi: "79%", targetKpi: "88%" }], linkedKPIs: [{ kpiName: "Incident SLA Compliance", currentValue: "81%", targetValue: "90%", expectedImprovement: "+9%" }, { kpiName: "Critical Incident Recovery Time", currentValue: "74%", targetValue: "88%", expectedImprovement: "+14%" }], linkedActivities: [{ activityName: "Escalation Queue Coordination", frequency: "120 times/month", durationHours: 0.6, monthlyWorkloadHours: 72, complexityLevel: "Medium", responsibleRole: "Digital Service Operations Coordinator" }, { activityName: "Critical Incident War-Room Facilitation", frequency: "24 times/month", durationHours: 1.8, monthlyWorkloadHours: 43.2, complexityLevel: "High", responsibleRole: "Digital Service Operations Coordinator" }, { activityName: "SLA Breach Risk Monitoring", frequency: "40 times/month", durationHours: 0.9, monthlyWorkloadHours: 36, complexityLevel: "Medium", responsibleRole: "Digital Service Operations Coordinator" }, { activityName: "Closure Quality Verification", frequency: "30 times/month", durationHours: 0.8, monthlyWorkloadHours: 24, complexityLevel: "Low", responsibleRole: "Digital Service Operations Coordinator" }, { activityName: "Repeat Incident Follow-Up", frequency: "18 times/month", durationHours: 1.3, monthlyWorkloadHours: 23.4, complexityLevel: "Medium", responsibleRole: "Digital Service Operations Coordinator" }], workloadAnalysis: { baseWorkloadHours: 198.6, complexityMultiplier: 1.14, qualityFactor: 1.08, reworkRate: 0.06, adjustedWorkloadHours: 246.5, effectiveMonthlyCapacity: 136, requiredHC: 1.81, recommendedHC: 2, expectedUtilization: "90%" }, costEstimate: { baseSalary: 19500000, allowances: 3600000, benefits: 2400000, bonusAllocation: 1500000, totalMonthlyCost: 27000000, totalAnnualCost: 324000000, costPerWorkloadHour: 109533 }, competencyRequirements: { education: "Bachelor's degree in Information Technology, Computer Science, or related field", minimumExperience: "4 years in IT service operations or incident management", technicalCompetencies: ["ITSM", "Incident escalation management", "Service monitoring", "Operational reporting", "Problem management"], behavioralCompetencies: ["Calm under pressure", "Coordination", "Clear communication", "Accountability", "Customer focus"], certifications: ["ITIL Foundation required", "ITIL Intermediate preferred"] }, reportingStructure: { reportsToPosition: "IT Service Delivery Manager", peerPositions: ["IT Service Delivery Analyst", "Infrastructure Monitoring Engineer"], subordinatePositions: [] }, implementationPlan: ["Formalize role under IT Infrastructure", "Define SLA and escalation ownership matrix", "Launch daily escalation command cadence", "Integrate KPI dashboard into service management review", "Validate SLA improvement over 8-week cycle"], impactAnalysis: { workloadReduction: "34 hours/month removed from IT Service Delivery Analyst", kpiImprovement: "+9% incident SLA compliance", riskReduction: "Reduced risk of unresolved high-priority incidents", costImpact: "Rp 27 Juta/month additional workforce cost", affectedDepartments: ["IT Infrastructure", "Digital Transformation", "Operations"] }, risksIfNotCreated: ["Escalation queue continues to breach SLA", "Critical incident handling remains reactive", "Recovery time remains above target", "Service reliability perception declines"], sourceInsight: "IT Infrastructure Incident Escalation Risk", scenarioReadiness: "Implemented in Baseline with ongoing monitoring" },
];

export const aiScenarios = ["Baseline", "Scenario A", "Scenario B", "Aggressive Growth", "Cost Containment"];
