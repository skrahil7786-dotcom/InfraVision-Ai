export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  distanceFromProjectKm?: number;
  isRealGps: boolean;
}

export type FieldUpdateSource = "MANUAL" | "PDF_DPR" | "OCR" | "DRONE_IMAGE" | "SATELLITE";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "CLARIFICATION_REQUESTED";
export type GpsStatus = "GPS_VERIFIED" | "OUT_OF_RANGE" | "UNAVAILABLE" | "DEMO_VERIFIED";

export interface FieldUpdate {
  id: string;
  projectId: string;
  projectName: string;
  wbsCode: string;
  wbsTaskId: string;
  activity: string;
  quantity: number;
  unit: string;
  reportDate: string; // YYYY-MM-DD
  submittedBy: string;
  submittedByRole: string;
  source: FieldUpdateSource;
  extractionConfidence: number; // Displayed as prototype extraction confidence
  gpsStatus: GpsStatus;
  gpsCoordinates?: GpsCoordinates;
  verificationStatus: VerificationStatus;
  reviewerComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdTimestamp: string;
  photoUrl?: string;
  documentUrl?: string;
  documentName?: string;
  validationWarnings?: string[];
}

export interface AuditLog {
  id: string;
  projectId: string;
  projectName?: string;
  entityType: "FIELD_UPDATE" | "WBS_TASK" | "ALERT" | "PROJECT" | "DOCUMENT";
  entityId: string;
  user: string;
  userRole: string;
  action: 
    | "UPDATE_SUBMITTED"
    | "UPDATE_VERIFIED"
    | "UPDATE_REJECTED"
    | "UPDATE_EDITED"
    | "CLARIFICATION_REQUESTED"
    | "ALERT_ACKNOWLEDGED"
    | "ALERT_ASSIGNED"
    | "ALERT_ESCALATED"
    | "ALERT_RESOLVED"
    | "TASK_MODIFIED"
    | "REPORT_GENERATED"
    | "DEMO_RESET";
  oldValue?: any;
  newValue?: any;
  reason?: string;
  timestamp: string;
}

export interface DocumentEvidence {
  id: string;
  projectId: string;
  wbsTaskId?: string;
  wbsCode?: string;
  title: string;
  fileName: string;
  fileType: "PDF" | "IMAGE" | "CSV" | "DOC";
  reportDate: string;
  uploadedBy: string;
  fileUrl: string;
  extractedData?: any;
  verified: boolean;
  createdTimestamp: string;
}

export interface AlertEscalation {
  level: number;
  escalatedBy: string;
  timestamp: string;
  note: string;
}

export interface AlertComment {
  id: string;
  user: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  projectId: string;
  projectName: string;
  wbsCode?: string;
  wbsTaskId?: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: "TIMELINE" | "QUALITY" | "SAFETY" | "MATERIAL" | "WEATHER";
  timestamp: string;
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
  assignedOwner?: string;
  dueDate?: string;
  escalationLevel: number;
  escalationHistory?: AlertEscalation[];
  comments?: AlertComment[];
  aiSuggestedAction: string;
  resolutionSummary?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface TimelineTask {
  id: string;
  wbsCode: string;
  name: string;
  category: "PRE_CONSTRUCTION" | "CIVIL_EARTHWORK" | "STRUCTURES" | "PAVEMENT" | "MEP_SYSTEMS" | "COMMISSIONING";
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate: string;
  actualEndDate?: string;
  plannedDurationDays: number;
  actualDurationDays?: number;
  targetQuantity?: number;
  completedQuantity?: number; // Computed strictly from VERIFIED updates only
  unit?: string;
  taskWeight?: number; // Weight percentage
  plannedProgress: number; // in %
  actualProgress: number; // in % = (completedQuantity / targetQuantity) * 100
  deviationPercentagePoints?: number; // actualProgress - plannedProgress
  status: "COMPLETED" | "IN_PROGRESS" | "DELAYED" | "CRITICAL_SLIPPAGE" | "UPCOMING";
  isCriticalPath: boolean;
  assignedContractor: string;
  responsibleEngineer?: string;
  deviationDays: number;
  dependencies?: string[];
  notes?: string;
  evidenceCount?: number;
  lastVerifiedDate?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  sector: "Highways & Expressways" | "Metro Rail & Bridges" | "Smart City & Urban" | "Water & Ports";
  location: string;
  coordinates: [number, number];
  client: string;
  contractor: string;
  startDate: string;
  targetCompletionDate: string;
  budgetTotalCr: number;
  budgetSpentCr: number;
  plannedProgress: number;
  actualProgress: number;
  deviationPercentagePoints?: number;
  status: "ON_TRACK" | "MODERATE_RISK" | "DELAYED" | "CRITICAL";
  riskScore: number;
  predictedDelayDays: number;
  lastUpdated: string;
  currentStage: string;
  healthIndex: number;
  healthReasons?: string[];
  totalLengthKm?: number;
  workPackages: {
    id: string;
    name: string;
    planned: number;
    actual: number;
    status: string;
    weightage: number;
  }[];
  milestones: {
    id: string;
    name: string;
    targetDate: string;
    completedDate?: string;
    status: "COMPLETED" | "IN_PROGRESS" | "DELAYED" | "PENDING";
    progress: number;
  }[];
  timelineTasks?: TimelineTask[];
  sitePhotosCount: number;
  activeAlertsCount: number;
  pendingVerificationsCount?: number;
  lastVerifiedAt?: string;
  lastVerifiedBy?: string;
}

// Initial Verified & Pending Field Updates
export const initialFieldUpdates: FieldUpdate[] = [
  // PKG 4 Verified Updates
  {
    id: "fup-101",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    wbsCode: "1.1",
    wbsTaskId: "tt-101",
    activity: "Topographic Survey & Forest Land Acquisition",
    quantity: 46.5,
    unit: "Km",
    reportDate: "2023-09-08",
    submittedBy: "Er. Rajesh Sharma",
    submittedByRole: "Site Engineer",
    source: "MANUAL",
    extractionConfidence: 100,
    gpsStatus: "GPS_VERIFIED",
    gpsCoordinates: { latitude: 21.838, longitude: 73.0033, accuracyMeters: 4.2, distanceFromProjectKm: 0.1, isRealGps: true },
    verificationStatus: "VERIFIED",
    reviewerComments: "Forest boundary demarcations confirmed by State Forest Officer.",
    reviewedBy: "Ananya Deshmukh (Project Manager)",
    reviewedAt: "2023-09-10T11:00:00Z",
    createdTimestamp: "2023-09-08T16:30:00Z",
    documentUrl: "/docs/dme_forest_clearance.pdf",
    documentName: "MoEFCC_Forest_Handover_Pkg4.pdf",
  },
  {
    id: "fup-102",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    wbsCode: "1.2",
    wbsTaskId: "tt-102",
    activity: "Subgrade Embankment Cutting & Compaction",
    quantity: 1176000,
    unit: "Cum",
    reportDate: "2024-07-08",
    submittedBy: "Er. Rajesh Sharma",
    submittedByRole: "Site Engineer",
    source: "PDF_DPR",
    extractionConfidence: 94,
    gpsStatus: "GPS_VERIFIED",
    gpsCoordinates: { latitude: 21.841, longitude: 73.008, accuracyMeters: 5.1, distanceFromProjectKm: 0.4, isRealGps: true },
    verificationStatus: "VERIFIED",
    reviewerComments: "98% Modified Proctor Density field test reports verified against IRC:36.",
    reviewedBy: "Ananya Deshmukh (Project Manager)",
    reviewedAt: "2024-07-10T09:30:00Z",
    createdTimestamp: "2024-07-08T18:00:00Z",
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80",
    documentUrl: "/docs/embankment_density_cert.pdf",
    documentName: "Subgrade_Density_Test_Batch4.pdf",
  },
  {
    id: "fup-103",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    wbsCode: "3.1",
    wbsTaskId: "tt-104",
    activity: "Granular Sub-Base (GSB) 250mm Spreading",
    quantity: 369000,
    unit: "Cum",
    reportDate: "2025-08-20",
    submittedBy: "Er. Rajesh Sharma",
    submittedByRole: "Site Engineer",
    source: "PDF_DPR",
    extractionConfidence: 96,
    gpsStatus: "GPS_VERIFIED",
    gpsCoordinates: { latitude: 21.845, longitude: 73.012, accuracyMeters: 6.0, distanceFromProjectKm: 0.8, isRealGps: true },
    verificationStatus: "VERIFIED",
    reviewerComments: "GSB aggregate sieve analysis approved. Layer thickness checked with level sensor.",
    reviewedBy: "Ananya Deshmukh (Project Manager)",
    reviewedAt: "2025-08-22T14:15:00Z",
    createdTimestamp: "2025-08-20T17:45:00Z",
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "fup-104",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    wbsCode: "3.2",
    wbsTaskId: "tt-105",
    activity: "Dense Bituminous Macadam (DBM) 75mm Binder Course",
    quantity: 19800,
    unit: "MT",
    reportDate: "2026-08-24",
    submittedBy: "Er. Rajesh Sharma",
    submittedByRole: "Site Engineer",
    source: "OCR",
    extractionConfidence: 88,
    gpsStatus: "GPS_VERIFIED",
    gpsCoordinates: { latitude: 21.8502, longitude: 73.0185, accuracyMeters: 4.8, distanceFromProjectKm: 0.3, isRealGps: true },
    verificationStatus: "VERIFIED",
    reviewerComments: "Core cutter density test indicates 2.38 g/cc. Approved under MoRTH 500.",
    reviewedBy: "Ananya Deshmukh (Project Manager)",
    reviewedAt: "2026-08-24T18:00:00Z",
    createdTimestamp: "2026-08-24T15:20:00Z",
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80",
    documentUrl: "/docs/dpr_24aug2026.pdf",
    documentName: "DPR_DME_Pkg4_24Aug2026.pdf",
  },
  // PKG 4 Pending Queue Updates (MUST NOT affect official metrics until verified!)
  {
    id: "fup-105-pending",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    wbsCode: "3.2",
    wbsTaskId: "tt-105",
    activity: "Dense Bituminous Macadam (DBM) Chainage 134+200",
    quantity: 850,
    unit: "MT",
    reportDate: "2026-08-24",
    submittedBy: "Amit Sharma (L&T Site In-Charge)",
    submittedByRole: "Site Engineer",
    source: "PDF_DPR",
    extractionConfidence: 89,
    gpsStatus: "GPS_VERIFIED",
    gpsCoordinates: { latitude: 21.851, longitude: 73.019, accuracyMeters: 3.5, distanceFromProjectKm: 0.2, isRealGps: true },
    verificationStatus: "PENDING",
    createdTimestamp: "2026-08-24T19:15:00Z",
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80",
    documentUrl: "/docs/dpr_dme_24aug_evening.pdf",
    documentName: "DPR_Evening_Batch_24Aug.pdf",
    validationWarnings: ["Pending Asphalt Marshall Stability Lab Report from Quality Lab."],
  },
  {
    id: "fup-106-pending",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    wbsCode: "3.3",
    wbsTaskId: "tt-106",
    activity: "Pavement Quality Concrete (PQC) Wearing Layer",
    quantity: 1200,
    unit: "Sqm",
    reportDate: "2026-08-23",
    submittedBy: "Amit Sharma (L&T Site In-Charge)",
    submittedByRole: "Site Engineer",
    source: "DRONE_IMAGE",
    extractionConfidence: 91,
    gpsStatus: "GPS_VERIFIED",
    gpsCoordinates: { latitude: 21.854, longitude: 73.022, accuracyMeters: 2.1, distanceFromProjectKm: 0.5, isRealGps: true },
    verificationStatus: "PENDING",
    createdTimestamp: "2026-08-23T18:40:00Z",
    photoUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80",
    validationWarnings: ["7-day flexural beam test results awaited."],
  },
  {
    id: "fup-107-rejected",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    wbsCode: "4.1",
    wbsTaskId: "tt-107",
    activity: "Median Crash Barriers Installation",
    quantity: 4500,
    unit: "Meters",
    reportDate: "2026-08-22",
    submittedBy: "Contractor Field Gang #3",
    submittedByRole: "Contractor Admin",
    source: "MANUAL",
    extractionConfidence: 75,
    gpsStatus: "OUT_OF_RANGE",
    gpsCoordinates: { latitude: 21.99, longitude: 73.22, accuracyMeters: 45.0, distanceFromProjectKm: 18.5, isRealGps: true },
    verificationStatus: "REJECTED",
    reviewerComments: "Rejected: Reported quantity exceeds physical stretch surveyed by 3,000m. GPS geo-coordinates mismatch project corridor boundary.",
    reviewedBy: "Ananya Deshmukh (Project Manager)",
    reviewedAt: "2026-08-23T10:00:00Z",
    createdTimestamp: "2026-08-22T17:00:00Z",
    validationWarnings: ["Geo-coordinates out of project alignment (>18km deviation).", "Target quantity spike."],
  },
  // Bengaluru Metro Verified & Pending
  {
    id: "fup-201",
    projectId: "proj-2",
    projectName: "Bengaluru Metro Phase 2A (Pink Line)",
    wbsCode: "2.1",
    wbsTaskId: "tt-202",
    activity: "Twin TBM Mining Drives - Langford Breakthrough",
    quantity: 1870,
    unit: "Rmt",
    reportDate: "2026-08-20",
    submittedBy: "Afcons Underground Surveyor",
    submittedByRole: "Site Engineer",
    source: "DRONE_IMAGE",
    extractionConfidence: 97,
    gpsStatus: "GPS_VERIFIED",
    gpsCoordinates: { latitude: 12.9716, longitude: 77.5946, accuracyMeters: 1.8, distanceFromProjectKm: 0.1, isRealGps: true },
    verificationStatus: "VERIFIED",
    reviewerComments: "Tunnel laser scanning confirms ring alignment tolerance within +/- 15mm. Signed by Chief Resident Engineer.",
    reviewedBy: "Dr. Vikramaditya Sen, IAS (Government Inspector)",
    reviewedAt: "2026-08-22T08:30:00Z",
    createdTimestamp: "2026-08-20T16:00:00Z",
    photoUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80",
    documentUrl: "/docs/tbm_breakthrough_cert.pdf",
    documentName: "TBM_Breakthrough_Langford_BMRCL.pdf",
  },
  {
    id: "fup-202-pending",
    projectId: "proj-2",
    projectName: "Bengaluru Metro Phase 2A (Pink Line)",
    wbsCode: "2.2",
    wbsTaskId: "tt-203",
    activity: "Pier Cap #P-104 Reinforcement & Formwork",
    quantity: 1,
    unit: "Nos",
    reportDate: "2026-08-24",
    submittedBy: "Afcons Quality Wing",
    submittedByRole: "Site Engineer",
    source: "DRONE_IMAGE",
    extractionConfidence: 97,
    gpsStatus: "GPS_VERIFIED",
    gpsCoordinates: { latitude: 12.973, longitude: 77.596, accuracyMeters: 2.0, distanceFromProjectKm: 0.2, isRealGps: true },
    verificationStatus: "PENDING",
    createdTimestamp: "2026-08-24T16:15:00Z",
    photoUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80",
    documentName: "PierCap_P104_Rebar_Checklist.pdf",
  }
];

// Initial Audit Trail
export const initialAuditLogs: AuditLog[] = [
  {
    id: "aud-1",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    entityType: "FIELD_UPDATE",
    entityId: "fup-104",
    user: "Ananya Deshmukh",
    userRole: "PROJECT_MANAGER",
    action: "UPDATE_VERIFIED",
    oldValue: { status: "PENDING", quantity: 19800 },
    newValue: { status: "VERIFIED", quantity: 19800, reviewerComments: "Core cutter density test indicates 2.38 g/cc. Approved under MoRTH 500." },
    reason: "Quality laboratory test reports verified and compliant with IRC:37 standard.",
    timestamp: "2026-08-24T18:00:00Z",
  },
  {
    id: "aud-2",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    entityType: "FIELD_UPDATE",
    entityId: "fup-107-rejected",
    user: "Ananya Deshmukh",
    userRole: "PROJECT_MANAGER",
    action: "UPDATE_REJECTED",
    oldValue: { status: "PENDING" },
    newValue: { status: "REJECTED" },
    reason: "Reported quantity exceeds physical stretch surveyed by 3,000m. GPS geo-coordinates mismatch project corridor boundary.",
    timestamp: "2026-08-23T10:00:00Z",
  },
  {
    id: "aud-3",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    entityType: "ALERT",
    entityId: "alt-1",
    user: "Er. Rajesh Sharma",
    userRole: "SITE_ENGINEER",
    action: "ALERT_ACKNOWLEDGED",
    oldValue: { status: "OPEN" },
    newValue: { status: "ACKNOWLEDGED", assignedOwner: "Er. Rajesh Sharma", dueDate: "2026-08-28" },
    reason: "Acknowledged bitumen bottleneck. Coordinating emergency supply with IOCL Koyali refinery.",
    timestamp: "2026-08-24T19:00:00Z",
  },
  {
    id: "aud-4",
    projectId: "proj-1",
    projectName: "Delhi-Mumbai Expressway (Package 4)",
    entityType: "ALERT",
    entityId: "alt-1",
    user: "Ananya Deshmukh",
    userRole: "PROJECT_MANAGER",
    action: "ALERT_ESCALATED",
    oldValue: { escalationLevel: 1 },
    newValue: { escalationLevel: 2 },
    reason: "Escalated to NHAI Regional Office due to 9-day schedule slippage on critical path.",
    timestamp: "2026-08-24T19:30:00Z",
  },
  {
    id: "aud-5",
    projectId: "proj-2",
    projectName: "Bengaluru Metro Phase 2A (Pink Line)",
    entityType: "FIELD_UPDATE",
    entityId: "fup-201",
    user: "Dr. Vikramaditya Sen, IAS",
    userRole: "GOVERNMENT_INSPECTOR",
    action: "UPDATE_VERIFIED",
    oldValue: { status: "PENDING" },
    newValue: { status: "VERIFIED" },
    reason: "Underground tunnel breakthrough certified following physical site walk-through.",
    timestamp: "2026-08-22T08:30:00Z",
  }
];

// Initial Document Evidence Linkage
export const initialDocumentEvidence: DocumentEvidence[] = [
  {
    id: "ev-1",
    projectId: "proj-1",
    wbsTaskId: "tt-105",
    wbsCode: "3.2",
    title: "MoRTH Section 500 Bitumen Batch Quality Certificate",
    fileName: "DME_PKG4_Bitumen_Batch_QC_Cert.pdf",
    fileType: "PDF",
    reportDate: "2026-08-24",
    uploadedBy: "Er. Rajesh Sharma (Site Engineer)",
    fileUrl: "/docs/bitumen_batch_qc.pdf",
    verified: true,
    createdTimestamp: "2026-08-24T15:00:00Z",
  },
  {
    id: "ev-2",
    projectId: "proj-1",
    wbsTaskId: "tt-105",
    wbsCode: "3.2",
    title: "Chainage 132+400 Asphalting Geo-Tagged Drone Photo",
    fileName: "Drone_Paving_Ch132_24Aug.jpg",
    fileType: "IMAGE",
    reportDate: "2026-08-24",
    uploadedBy: "L&T Drone Survey Unit",
    fileUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    createdTimestamp: "2026-08-24T16:00:00Z",
  },
  {
    id: "ev-3",
    projectId: "proj-1",
    wbsTaskId: "tt-104",
    wbsCode: "3.1",
    title: "Granular Sub-Base Compaction & Gradation Test",
    fileName: "GSB_Layer_Compaction_Test.pdf",
    fileType: "PDF",
    reportDate: "2025-08-20",
    uploadedBy: "Er. Rajesh Sharma",
    fileUrl: "/docs/gsb_compaction.pdf",
    verified: true,
    createdTimestamp: "2025-08-20T17:00:00Z",
  },
  {
    id: "ev-4",
    projectId: "proj-2",
    wbsTaskId: "tt-202",
    wbsCode: "2.1",
    title: "TBM Underground Ring Alignment Laser Survey",
    fileName: "BMRCL_TBM_Ring_Laser_Survey.pdf",
    fileType: "PDF",
    reportDate: "2026-08-20",
    uploadedBy: "Afcons Underground Wing",
    fileUrl: "/docs/bmrcl_tbm_survey.pdf",
    verified: true,
    createdTimestamp: "2026-08-20T14:00:00Z",
  }
];

// Calculation Engine: Strict Formula Verification
export function recalculateProjectMetrics(project: Project, updates: FieldUpdate[]): Project {
  const verifiedUpdates = updates.filter(u => u.projectId === project.id && u.verificationStatus === "VERIFIED");

  // Recalculate each timeline task strictly from verified field updates
  let totalWeightedActual = 0;
  let totalWeight = 0;

  const updatedTasks = (project.timelineTasks || []).map(task => {
    const taskVerifiedUpdates = verifiedUpdates.filter(u => u.wbsTaskId === task.id || u.wbsCode === task.wbsCode);
    const completedQuantity = taskVerifiedUpdates.reduce((sum, u) => sum + (Number(u.quantity) || 0), 0);
    
    const targetQuantity = task.targetQuantity > 0 ? task.targetQuantity : 100;
    const actualProgress = Math.min(100, Math.round((completedQuantity / targetQuantity) * 1000) / 10);
    const deviationPercentagePoints = Math.round((actualProgress - task.plannedProgress) * 10) / 10;
    
    // Status resolution based on deviation and completion
    let status = task.status;
    if (actualProgress >= 100) {
      status = "COMPLETED";
    } else if (actualProgress === 0 && task.plannedProgress === 0) {
      status = "UPCOMING";
    } else if (deviationPercentagePoints < -15) {
      status = "CRITICAL_SLIPPAGE";
    } else if (deviationPercentagePoints < -5) {
      status = "DELAYED";
    } else {
      status = "IN_PROGRESS";
    }

    const taskDeviationDays = deviationPercentagePoints < 0 ? Math.round(Math.abs(deviationPercentagePoints) * 0.5) : 0;
    const taskWeight = task.taskWeight || 10;
    
    totalWeightedActual += actualProgress * taskWeight;
    totalWeight += taskWeight;

    return {
      ...task,
      completedQuantity,
      actualProgress,
      deviationPercentagePoints,
      deviationDays: -taskDeviationDays,
      status,
      evidenceCount: taskVerifiedUpdates.length,
      lastVerifiedDate: taskVerifiedUpdates.length > 0 ? taskVerifiedUpdates[taskVerifiedUpdates.length - 1].reportDate : task.lastVerifiedDate,
    };
  });

  const overallActualProgress = totalWeight > 0 
    ? Math.min(100, Math.round((totalWeightedActual / totalWeight) * 10) / 10)
    : project.actualProgress;

  const projectDeviation = Math.round((overallActualProgress - project.plannedProgress) * 10) / 10;
  const predictedDelayDays = projectDeviation < 0 ? Math.round(Math.abs(projectDeviation) * 0.5) : 0;

  let projectStatus: Project["status"] = "ON_TRACK";
  let riskScore = 15;

  if (projectDeviation < -15) {
    projectStatus = "DELAYED";
    riskScore = Math.min(95, Math.round(50 + Math.abs(projectDeviation) * 2));
  } else if (projectDeviation < -5) {
    projectStatus = "MODERATE_RISK";
    riskScore = Math.min(65, Math.round(30 + Math.abs(projectDeviation) * 2));
  } else {
    projectStatus = "ON_TRACK";
    riskScore = 18;
  }

  const pendingCount = updates.filter(u => u.projectId === project.id && u.verificationStatus === "PENDING").length;

  return {
    ...project,
    actualProgress: overallActualProgress,
    deviationPercentagePoints: projectDeviation,
    predictedDelayDays,
    status: projectStatus,
    riskScore,
    healthIndex: Math.max(10, Math.min(99, 100 - riskScore)),
    timelineTasks: updatedTasks,
    pendingVerificationsCount: pendingCount,
    lastUpdated: new Date().toISOString(),
  };
}

// Validation Engine
export function validateUpdateSubmission(
  update: Partial<FieldUpdate>,
  project?: Project,
  task?: TimelineTask,
  existingUpdates: FieldUpdate[] = []
): { isValid: boolean; warnings: string[]; error?: string } {
  const warnings: string[] = [];

  if (!update.quantity || Number(update.quantity) <= 0) {
    return { isValid: false, warnings, error: "Quantity must be greater than 0." };
  }

  if (!update.reportDate) {
    return { isValid: false, warnings, error: "Report date is required." };
  }

  // Future date check
  const reportDateObj = new Date(update.reportDate);
  const now = new Date();
  if (reportDateObj > now) {
    return { isValid: false, warnings, error: "Report date cannot be in the future." };
  }

  // Stale date check (> 7 days)
  const diffDays = Math.floor((now.getTime() - reportDateObj.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 7) {
    warnings.push(`Stale update notice: Report date is ${diffDays} days prior to current date.`);
  }

  if (task) {
    // Check unit mismatch
    if (update.unit && task.unit && update.unit.trim().toLowerCase() !== task.unit.trim().toLowerCase()) {
      warnings.push(`Unit warning: Submitted unit "${update.unit}" differs from WBS standard "${task.unit}".`);
    }

    // Check target quantity exceedance
    const currentCompleted = task.completedQuantity || 0;
    const newTotal = currentCompleted + Number(update.quantity);
    if (newTotal > task.targetQuantity) {
      const excess = newTotal - task.targetQuantity;
      warnings.push(`Target exceedance: Cumulative quantity (${newTotal} ${task.unit}) exceeds WBS target (${task.targetQuantity} ${task.unit}) by ${excess} ${task.unit}.`);
    }
  }

  // Duplicate submission detection
  const duplicate = existingUpdates.find(u => 
    u.projectId === update.projectId &&
    u.wbsCode === update.wbsCode &&
    u.reportDate === update.reportDate &&
    Number(u.quantity) === Number(update.quantity)
  );

  if (duplicate) {
    warnings.push(`Duplicate warning: An update with identical date (${update.reportDate}) and quantity (${update.quantity}) was already submitted (#${duplicate.id}).`);
  }

  return {
    isValid: true,
    warnings,
  };
}
