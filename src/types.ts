export type UserRole = 
  | "SITE_ENGINEER" 
  | "PROJECT_MANAGER" 
  | "GOVERNMENT_INSPECTOR" 
  | "CONTRACTOR_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agency: string;
  avatarUrl?: string;
}

export interface WorkPackage {
  id: string;
  name: string;
  planned: number;
  actual: number;
  status: string;
  weightage: number;
}

export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  completedDate?: string;
  status: "COMPLETED" | "IN_PROGRESS" | "DELAYED" | "PENDING";
  progress: number;
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
  targetQuantity: number;
  completedQuantity: number; // Computed strictly from VERIFIED updates only
  unit: string;
  taskWeight: number; // For weighted progress calculation
  plannedProgress: number; // in %
  actualProgress: number; // in % = (completedQuantity / targetQuantity) * 100
  deviationPercentagePoints: number; // actualProgress - plannedProgress
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

export type FieldUpdateSource = "MANUAL" | "PDF_DPR" | "OCR" | "DRONE_IMAGE" | "SATELLITE";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "CLARIFICATION_REQUESTED";
export type GpsStatus = "GPS_VERIFIED" | "OUT_OF_RANGE" | "UNAVAILABLE" | "DEMO_VERIFIED";

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  distanceFromProjectKm?: number;
  isRealGps: boolean;
}

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

export interface AppNotification {
  id: string;
  type: "DELAY_RISK" | "AI_DETECTION" | "OCR_DPR" | "QUALITY_ISSUE" | "PERMIT_EXPIRY" | "SAFETY_ALERT" | "MILESTONE_MET" | "SYSTEM" | "VERIFICATION_REQUIRED";
  title: string;
  message: string;
  projectId?: string;
  projectName?: string;
  timestamp: string;
  read: boolean;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  actionLabel?: string;
  actionTargetView?: string;
  actionTargetId?: string;
  meta?: {
    deviation?: number;
    predictedDelayDays?: number;
    stageDetected?: string;
    documentType?: string;
    clearanceType?: string;
    daysRemaining?: number;
    fieldUpdateId?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  sources?: string[];
}

export interface CollaboratorPresence {
  id: string;
  name: string;
  role: string;
  avatar: string;
  agency: string;
  activeSection: string;
  status: "VIEWING" | "EDITING" | "SCANNING" | "FIELD_INSPECTING";
  color: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  sector: "Highways & Expressways" | "Metro Rail & Bridges" | "Smart City & Urban" | "Water & Ports";
  location: string;
  coordinates: [number, number]; // [lat, lng]
  client: string;
  contractor: string;
  startDate: string;
  targetCompletionDate: string;
  budgetTotalCr: number;
  budgetSpentCr: number;
  plannedProgress: number; // in %
  actualProgress: number; // in % strictly weighted from verified tasks
  deviationPercentagePoints: number; // actualProgress - plannedProgress in percentage points
  status: "ON_TRACK" | "MODERATE_RISK" | "DELAYED" | "CRITICAL";
  riskScore: number; // 0 - 100
  predictedDelayDays: number;
  lastUpdated: string;
  currentStage: string;
  healthIndex: number;
  healthReasons?: string[];
  totalLengthKm?: number;
  workPackages: WorkPackage[];
  milestones: Milestone[];
  timelineTasks: TimelineTask[];
  sitePhotosCount: number;
  activeAlertsCount: number;
  pendingVerificationsCount?: number;
  lastVerifiedAt?: string;
  lastVerifiedBy?: string;
  alerts?: Alert[];
  captures?: SiteCaptureLog[];
  fieldUpdates?: FieldUpdate[];
  auditLogs?: AuditLog[];
}

export interface SiteCaptureLog {
  id: string;
  projectId: string;
  projectName: string;
  capturedAt: string;
  capturedBy: string;
  imageUrl: string;
  stageDetected: string;
  detectedProgress: number;
  confidenceScore: number;
  deviation: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  predictedDelayDays: number;
  elementsDetected: string[];
  safetyCompliance: {
    helmetsDetected: boolean;
    vestsDetected: boolean;
    barricadesPresent: boolean;
    score: number;
  };
  defectsDetected: string[];
  aiAnalysisSummary: string;
  recommendedAction: string;
}

export interface OCRDocumentResult {
  reportDate: string;
  projectCode: string;
  wbsCode?: string;
  activity?: string;
  quantity?: number;
  unit?: string;
  extractionConfidence?: number;
  contractorName: string;
  locationChainage: string;
  weatherCondition: string;
  manpowerDeployed: {
    engineers: number;
    skilledLabor: number;
    unskilledLabor: number;
    operators: number;
    total: number;
  };
  machineryOperational: {
    name: string;
    quantity: number;
    hoursWorked: number;
    status: "ACTIVE" | "IDLE" | "BREAKDOWN";
  }[];
  materialsConsumedToday: {
    material: string;
    quantity: string;
    unit: string;
    variance: "ON_SPEC" | "EXCESS";
  }[];
  workCompletedToday: {
    activity: string;
    wbsCode?: string;
    plannedTarget: string;
    achieved: string;
    unit: string;
    status: "MET" | "LAGGING" | "EXCEEDED";
  }[];
  hindrancesAndStoppages: string[];
  engineerSignoffStatus: string;
  summaryNotes: string;
}

export interface SCurveDataPoint {
  month: string;
  planned: number;
  actual: number;
  baseline: number;
}

export interface AnalyticsSummary {
  totalProjects: number;
  delayedProjects: number;
  onTrackProjects: number;
  moderateRiskProjects: number;
  totalBudgetCr: number;
  totalSpentCr: number;
  avgPlanned: number;
  avgActual: number;
  avgDeviation: number;
  totalOpenAlerts: number;
  systemHealth: number;
  pendingVerificationsCount: number;
  lastVerifiedUpdate?: string;
  staleTasksCount: number;
  tasksWithEvidenceCount: number;
  totalTasksCount: number;
}

