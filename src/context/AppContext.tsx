import React, { createContext, useContext, useState, useEffect } from "react";
import { Project, Alert, SiteCaptureLog, User, AnalyticsSummary, UserRole, AppNotification, CollaboratorPresence, TimelineTask, FieldUpdate, AuditLog, DocumentEvidence } from "../types";
import { SAMPLE_USERS, SAMPLE_SITE_PHOTOS, SAMPLE_OCR_DOCUMENTS } from "../data/seedData";
import { offlineSyncService } from "../services/offlineSyncService";

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  authToken: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: { name: string; email: string; password: string; role: UserRole; agency?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  quickDemoLogin: (email: string) => Promise<void>;
  resetDatabase: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  projects: Project[];
  alerts: Alert[];
  siteCaptures: SiteCaptureLog[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  collaborators: CollaboratorPresence[];
  analytics: AnalyticsSummary | null;
  sCurveData: any[];
  isLoading: boolean;
  isAiProcessing: boolean;
  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (open: boolean) => void;
  refreshData: () => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  resolveAlert: (alertId: string) => Promise<void>;
  createAlert: (alertData: Partial<Alert>) => Promise<void>;
  markNotificationRead: (id: string, read?: boolean) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notif: Partial<AppNotification>) => Promise<void>;
  updateTimelineTask: (projectId: string, taskId: string, updates: Partial<TimelineTask>) => Promise<void>;
  sendChatMessage: (message: string, projectContext?: any) => Promise<any>;
  analyzeSiteImage: (params: {
    imageBase64?: string;
    projectId: string;
    promptNotes?: string;
    stageHint?: string;
    mimeType?: string;
  }) => Promise<SiteCaptureLog>;
  processOCRDocument: (params: {
    documentText?: string;
    imageBase64?: string;
    mimeType?: string;
    documentType?: string;
  }) => Promise<any>;

  // Priority 1-12 Control Additions
  fieldUpdates: FieldUpdate[];
  auditLogs: AuditLog[];
  evidence: DocumentEvidence[];
  pendingFieldUpdatesCount: number;
  selectedWbsTaskId: string | null;
  isWbsDrawerOpen: boolean;
  openWbsDrawer: (taskId: string, projectId?: string) => void;
  closeWbsDrawer: () => void;
  fetchFieldUpdates: (params?: { projectId?: string; status?: string; source?: string; search?: string }) => Promise<FieldUpdate[]>;
  submitFieldUpdate: (data: Partial<FieldUpdate>) => Promise<{ success: boolean; data?: FieldUpdate; error?: string; warnings?: string[] }>;
  createFieldUpdate: (data: any) => Promise<{ success: boolean; data?: FieldUpdate; error?: string; warnings?: string[] }>;
  verifyFieldUpdate: (id: string, comments?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  rejectFieldUpdate: (id: string, reason: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  editFieldUpdate: (id: string, updates: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  clarifyFieldUpdate: (id: string, note: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  fetchAuditLogs: (params?: { projectId?: string; entityType?: string; entityId?: string }) => Promise<AuditLog[]>;
  fetchWbsTaskDetail: (projectId: string, wbsTaskId: string) => Promise<any>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  assignAlert: (alertId: string, assignedOwner: string, dueDate?: string) => Promise<void>;
  escalateAlert: (alertId: string, note?: string) => Promise<void>;
  addAlertComment: (alertId: string, text: string) => Promise<void>;
  resolveAlertWithSummary: (alertId: string, resolutionSummary: string) => Promise<void>;
  queryWbsEvidenceQa: (question: string, projectId?: string, wbsTaskId?: string) => Promise<{ answer: string; citations: string[] }>;
  fetchDprExport: (projectId?: string, date?: string) => Promise<any>;
  fetchExecutiveExceptions: () => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(SAMPLE_USERS[0]);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("infravision_auth_token") || sessionStorage.getItem("infravision_auth_token");
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!(localStorage.getItem("infravision_auth_token") || sessionStorage.getItem("infravision_auth_token"));
  });
  const [activeView, setActiveView] = useState<string>(() => {
    const hasToken = localStorage.getItem("infravision_auth_token") || sessionStorage.getItem("infravision_auth_token");
    return hasToken ? "prototype" : "login";
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>("proj-1");
  const [projects, setProjects] = useState<Project[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [siteCaptures, setSiteCaptures] = useState<SiteCaptureLog[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [sCurveData, setSCurveData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  // Additional Control States
  const [fieldUpdates, setFieldUpdates] = useState<FieldUpdate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [evidence, setEvidence] = useState<DocumentEvidence[]>([]);
  const [selectedWbsTaskId, setSelectedWbsTaskId] = useState<string | null>(null);
  const [isWbsDrawerOpen, setIsWbsDrawerOpen] = useState<boolean>(false);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [projRes, alertsRes, notifsRes, collabRes, analyticsRes, fupRes, auditRes, evRes] = await Promise.all([
        fetch("/api/projects").then(r => r.json()).catch(() => ({ success: false })),
        fetch("/api/alerts").then(r => r.json()).catch(() => ({ success: false })),
        fetch("/api/notifications").then(r => r.json()).catch(() => ({ success: false })),
        fetch("/api/collaborators").then(r => r.json()).catch(() => ({ success: false })),
        fetch("/api/analytics/overview").then(r => r.json()).catch(() => ({ success: false })),
        fetch("/api/field-updates").then(r => r.json()).catch(() => ({ success: false })),
        fetch("/api/audit-logs").then(r => r.json()).catch(() => ({ success: false })),
        fetch("/api/evidence").then(r => r.json()).catch(() => ({ success: false })),
      ]);

      if (projRes.success) setProjects(projRes.data);
      if (alertsRes.success) setAlerts(alertsRes.data);
      if (notifsRes.success) setNotifications(notifsRes.data);
      if (collabRes.success) setCollaborators(collabRes.data);
      if (fupRes.success) setFieldUpdates(fupRes.data);
      if (auditRes.success) setAuditLogs(auditRes.data);
      if (evRes.success) setEvidence(evRes.data);
      if (analyticsRes.success) {
        setAnalytics(analyticsRes.data.summary);
        setSCurveData(analyticsRes.data.sCurveData);
      }
    } catch (err) {
      console.error("Error fetching data from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify auth token on initial mount
  useEffect(() => {
    const verifyInitialSession = async () => {
      const storedToken = localStorage.getItem("infravision_auth_token") || sessionStorage.getItem("infravision_auth_token");
      if (storedToken) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          const result = await res.json();
          if (result.success && result.user) {
            setCurrentUser(result.user);
            setIsAuthenticated(true);
            setAuthToken(storedToken);
          } else {
            // Token invalid
            localStorage.removeItem("infravision_auth_token");
            sessionStorage.removeItem("infravision_auth_token");
            setIsAuthenticated(false);
            setAuthToken(null);
            setActiveView("login");
          }
        } catch (e) {
          console.warn("Session check offline fallback");
        }
      } else {
        setIsAuthenticated(false);
        setAuthToken(null);
        setActiveView("login");
      }
      await refreshData();
    };

    verifyInitialSession();
  }, []);

  const login = async (email: string, password: string, rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();

      if (data.success && data.token && data.user) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setCurrentUser(data.user);

        if (rememberMe) {
          localStorage.setItem("infravision_auth_token", data.token);
        } else {
          sessionStorage.setItem("infravision_auth_token", data.token);
        }

        setActiveView("dashboard");
        await refreshData();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to reach server" };
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; role: UserRole; agency?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (data.success && data.token && data.user) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        localStorage.setItem("infravision_auth_token", data.token);
        setActiveView("dashboard");
        await refreshData();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Signup failed" };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to register account" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // Ignore network error on logout
    }
    localStorage.removeItem("infravision_auth_token");
    sessionStorage.removeItem("infravision_auth_token");
    setAuthToken(null);
    setIsAuthenticated(false);
    setActiveView("login");
  };

  const quickDemoLogin = async (demoEmail: string) => {
    await login(demoEmail, "password123", true);
  };

  const resetDatabase = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/auth/reset-demo-db", { method: "POST" });
      await refreshData();
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (role: UserRole) => {
    const found = SAMPLE_USERS.find(u => u.role === role) || SAMPLE_USERS[0];
    setCurrentUser(found);
  };

  const createProject = async (projectData: Partial<Project>): Promise<Project> => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });
    const result = await res.json();
    if (result.success) {
      await refreshData();
      return result.data;
    }
    throw new Error(result.error || "Failed to create project");
  };

  const resolveAlert = async (alertId: string) => {
    const res = await fetch(`/api/alerts/${alertId}/resolve`, {
      method: "POST",
    });
    const result = await res.json();
    if (result.success) {
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: "RESOLVED" } : a));
    }
  };

  const createAlert = async (alertData: Partial<Alert>) => {
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alertData),
    });
    const result = await res.json();
    if (result.success) {
      setAlerts(prev => [result.data, ...prev]);
    }
  };

  const markNotificationRead = async (id: string, read: boolean = true) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read } : n));
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
    } catch (e) {
      console.error("Failed to mark notification read", e);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications/mark-all-read", { method: "PATCH" });
    } catch (e) {
      console.error("Failed to mark all notifications read", e);
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete notification", e);
    }
  };

  const addNotification = async (notif: Partial<AppNotification>) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notif),
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => [data.data, ...prev]);
      }
    } catch (e) {
      console.error("Failed to add notification", e);
    }
  };

  const updateTimelineTask = async (projectId: string, taskId: string, updates: Partial<TimelineTask>) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/timeline/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => prev.map(p => {
          if (p.id !== projectId) return p;
          const updatedTasks = (p.timelineTasks || []).map(t => t.id === taskId ? { ...t, ...data.data } : t);
          return {
            ...p,
            ...data.projectUpdated,
            timelineTasks: updatedTasks,
          };
        }));
      }
    } catch (e) {
      console.error("Failed to update timeline task", e);
    }
  };

  const sendChatMessage = async (message: string, projectContext?: any) => {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        projectContext: projectContext || (selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null),
        userRole: currentUser.role,
      }),
    });
    return res.json();
  };

  const analyzeSiteImage = async (params: {
    imageBase64?: string;
    projectId: string;
    promptNotes?: string;
    stageHint?: string;
    mimeType?: string;
  }): Promise<SiteCaptureLog> => {
    setIsAiProcessing(true);
    try {
      const res = await fetch("/api/ai/analyze-site-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const result = await res.json();
      if (result.success) {
        setSiteCaptures(prev => [result.data, ...prev]);
        await refreshData();
        return result.data;
      }
      throw new Error(result.error || "AI Vision processing failed");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const processOCRDocument = async (params: {
    documentText?: string;
    imageBase64?: string;
    mimeType?: string;
    documentType?: string;
  }) => {
    setIsAiProcessing(true);
    try {
      const res = await fetch("/api/ai/ocr-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const result = await res.json();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || "OCR Processing failed");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const pendingFieldUpdatesCount = fieldUpdates.filter(u => u.verificationStatus === "PENDING").length;

  const openWbsDrawer = (taskId: string, projectId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    setSelectedWbsTaskId(taskId);
    setIsWbsDrawerOpen(true);
  };

  const closeWbsDrawer = () => {
    setIsWbsDrawerOpen(false);
    setSelectedWbsTaskId(null);
  };

  const fetchFieldUpdates = async (params?: { projectId?: string; status?: string; source?: string; search?: string }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.projectId) searchParams.append("projectId", params.projectId);
      if (params?.status) searchParams.append("status", params.status);
      if (params?.source) searchParams.append("source", params.source);
      if (params?.search) searchParams.append("search", params.search);

      const res = await fetch(`/api/field-updates?${searchParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setFieldUpdates(data.data);
        return data.data;
      }
      return [];
    } catch (e) {
      console.error("fetchFieldUpdates error", e);
      return [];
    }
  };

  const submitFieldUpdate = async (data: Partial<FieldUpdate>): Promise<{ success: boolean; data?: FieldUpdate; error?: string; warnings?: string[] }> => {
    // Check if device is in offline mode
    if (offlineSyncService.isOfflineMode()) {
      try {
        const queuedItem = await offlineSyncService.queueFieldUpdate({
          projectId: data.projectId || selectedProjectId || "proj-1",
          wbsTaskId: data.wbsTaskId || "wbs-1.2.3",
          chainageStart: "Km 134+200",
          chainageEnd: "Km 135+000",
          structureLayer: data.activity || "Dense Bituminous Macadam (DBM)",
          reportedVolume: data.quantity || 400,
          reportedVolumeUnit: data.unit || "MT",
          comments: data.reviewerComments || "Offline field update logged in IndexedDB",
          stage: data.activity || "DBM_PAVING",
          source: "MANUAL_FIELD",
          imageUrl: data.photoUrl,
          gpsCoords: data.gpsCoordinates ? { lat: data.gpsCoordinates.latitude, lng: data.gpsCoordinates.longitude } : undefined,
          submittedBy: data.submittedBy || currentUser.name,
          submittedByRole: data.submittedByRole || currentUser.role,
        });

        const targetProj = projects.find(p => p.id === (data.projectId || selectedProjectId)) || projects[0];

        const localUpdate: FieldUpdate = {
          id: queuedItem.id,
          projectId: queuedItem.projectId,
          projectName: targetProj ? targetProj.name : "Delhi-Mumbai Expressway Package-4",
          wbsCode: data.wbsCode || "WBS-1.2.3",
          wbsTaskId: queuedItem.wbsTaskId || "wbs-1.2.3",
          activity: data.activity || "DBM Paving & Compaction",
          quantity: queuedItem.reportedVolume || 400,
          unit: queuedItem.reportedVolumeUnit || "MT",
          reportDate: new Date().toISOString().split("T")[0],
          submittedBy: queuedItem.submittedBy,
          submittedByRole: queuedItem.submittedByRole,
          source: data.source || "MANUAL",
          extractionConfidence: data.extractionConfidence || 95,
          gpsStatus: data.gpsStatus || "GPS_VERIFIED",
          gpsCoordinates: data.gpsCoordinates || { latitude: 22.3072, longitude: 73.1812, isRealGps: true },
          verificationStatus: "PENDING",
          reviewerComments: queuedItem.comments,
          createdTimestamp: queuedItem.timestamp,
          photoUrl: queuedItem.imageUrl,
          validationWarnings: ["Saved offline in browser IndexedDB. Auto-sync will dispatch to cloud on reconnection."],
        };

        setFieldUpdates(prev => [localUpdate, ...prev]);
        return {
          success: true,
          data: localUpdate,
          warnings: ["Saved offline in browser IndexedDB. Will auto-sync when network reconnects."],
        };
      } catch (e: any) {
        return { success: false, error: "Failed to save offline update to IndexedDB" };
      }
    }

    try {
      const res = await fetch("/api/field-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          submittedBy: data.submittedBy || currentUser.name,
          submittedByRole: data.submittedByRole || currentUser.role,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setFieldUpdates(prev => [result.data, ...prev]);
        await refreshData();
        return { success: true, data: result.data, warnings: result.warnings };
      }
      return { success: false, error: result.error, warnings: result.warnings };
    } catch (err: any) {
      // If network request failed due to connectivity loss, fallback to IndexedDB
      console.warn("Network post failed, saving to IndexedDB queue:", err);
      try {
        await offlineSyncService.queueFieldUpdate(data as any);
        return {
          success: true,
          warnings: ["Network unreachable. Update saved locally to IndexedDB queue."],
        };
      } catch (dbErr) {
        return { success: false, error: err.message || "Failed to submit field update" };
      }
    }
  };

  const createFieldUpdate = async (data: any): Promise<{ success: boolean; data?: FieldUpdate; error?: string; warnings?: string[] }> => {
    const normalizedData: Partial<FieldUpdate> = {
      ...data,
      quantity: data.quantity !== undefined ? data.quantity : (data.quantityValue !== undefined ? Number(data.quantityValue) : 0),
      activity: data.activity || data.activityName || "Site Work",
      source: (data.source || data.sourceType || "MANUAL") as any,
      gpsCoordinates: data.gpsCoordinates || (data.latitude && data.longitude ? { latitude: data.latitude, longitude: data.longitude, isRealGps: true } : undefined),
      evidenceFiles: data.evidenceFiles,
    };
    return submitFieldUpdate(normalizedData);
  };

  const verifyFieldUpdate = async (id: string, comments?: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch(`/api/field-updates/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerComments: comments,
          reviewerName: currentUser.name,
          reviewerRole: currentUser.role,
        }),
      });
      const result = await res.json();
      if (result.success) {
        await refreshData();
        return { success: true, message: result.message };
      }
      return { success: false, error: result.error };
    } catch (err: any) {
      return { success: false, error: err.message || "Verification request failed" };
    }
  };

  const rejectFieldUpdate = async (id: string, reason: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch(`/api/field-updates/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          reviewerName: currentUser.name,
          reviewerRole: currentUser.role,
        }),
      });
      const result = await res.json();
      if (result.success) {
        await refreshData();
        return { success: true, message: result.message };
      }
      return { success: false, error: result.error };
    } catch (err: any) {
      return { success: false, error: err.message || "Rejection request failed" };
    }
  };

  const editFieldUpdate = async (id: string, updates: any): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch(`/api/field-updates/${id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updates,
          editorName: currentUser.name,
          editorRole: currentUser.role,
        }),
      });
      const result = await res.json();
      if (result.success) {
        await refreshData();
        return { success: true, message: result.message };
      }
      return { success: false, error: result.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const clarifyFieldUpdate = async (id: string, note: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch(`/api/field-updates/${id}/clarify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note,
          reviewerName: currentUser.name,
          reviewerRole: currentUser.role,
        }),
      });
      const result = await res.json();
      if (result.success) {
        await refreshData();
        return { success: true, message: result.message };
      }
      return { success: false, error: result.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const fetchAuditLogs = async (params?: { projectId?: string; entityType?: string; entityId?: string }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.projectId) searchParams.append("projectId", params.projectId);
      if (params?.entityType) searchParams.append("entityType", params.entityType);
      if (params?.entityId) searchParams.append("entityId", params.entityId);
      const res = await fetch(`/api/audit-logs?${searchParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.data);
        return data.data;
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  const fetchWbsTaskDetail = async (projectId: string, wbsTaskId: string) => {
    const res = await fetch(`/api/projects/${projectId}/wbs/${wbsTaskId}`);
    return res.json();
  };

  const acknowledgeAlert = async (alertId: string) => {
    await fetch(`/api/alerts/${alertId}/acknowledge`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: currentUser.name, role: currentUser.role }),
    });
    await refreshData();
  };

  const assignAlert = async (alertId: string, assignedOwner: string, dueDate?: string) => {
    await fetch(`/api/alerts/${alertId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedOwner, dueDate, assignedBy: currentUser.name, role: currentUser.role }),
    });
    await refreshData();
  };

  const escalateAlert = async (alertId: string, note?: string) => {
    await fetch(`/api/alerts/${alertId}/escalate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note, escalatedBy: currentUser.name, role: currentUser.role }),
    });
    await refreshData();
  };

  const addAlertComment = async (alertId: string, text: string) => {
    await fetch(`/api/alerts/${alertId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, user: currentUser.name, role: currentUser.role }),
    });
    await refreshData();
  };

  const resolveAlertWithSummary = async (alertId: string, resolutionSummary: string) => {
    await fetch(`/api/alerts/${alertId}/resolve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolutionSummary, resolvedBy: currentUser.name, role: currentUser.role }),
    });
    await refreshData();
  };

  const queryWbsEvidenceQa = async (question: string, projectId?: string, wbsTaskId?: string) => {
    const res = await fetch("/api/ai/wbs-evidence-qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, projectId: projectId || selectedProjectId, wbsTaskId }),
    });
    const data = await res.json();
    return data.success ? data : { answer: "Unable to process evidence query.", citations: [] };
  };

  const fetchDprExport = async (projectId?: string, date?: string) => {
    const pId = projectId || selectedProjectId || "proj-1";
    const url = `/api/reports/dpr-export?projectId=${pId}${date ? `&date=${date}` : ""}`;
    const res = await fetch(url);
    return res.json();
  };

  const fetchExecutiveExceptions = async () => {
    const res = await fetch("/api/reports/executive-exceptions");
    return res.json();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        authToken,
        login,
        signup,
        logout,
        quickDemoLogin,
        resetDatabase,
        switchRole,
        activeView,
        setActiveView,
        selectedProjectId,
        setSelectedProjectId,
        projects,
        alerts,
        siteCaptures,
        notifications,
        unreadNotificationsCount,
        collaborators,
        analytics,
        sCurveData,
        isLoading,
        isAiProcessing,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
        refreshData,
        createProject,
        resolveAlert,
        createAlert,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        addNotification,
        updateTimelineTask,
        sendChatMessage,
        analyzeSiteImage,
        processOCRDocument,

        // Priority Control Additions
        fieldUpdates,
        auditLogs,
        evidence,
        pendingFieldUpdatesCount,
        selectedWbsTaskId,
        isWbsDrawerOpen,
        openWbsDrawer,
        closeWbsDrawer,
        fetchFieldUpdates,
        submitFieldUpdate,
        createFieldUpdate,
        verifyFieldUpdate,
        rejectFieldUpdate,
        editFieldUpdate,
        clarifyFieldUpdate,
        fetchAuditLogs,
        fetchWbsTaskDetail,
        acknowledgeAlert,
        assignAlert,
        escalateAlert,
        addAlertComment,
        resolveAlertWithSummary,
        queryWbsEvidenceQa,
        fetchDprExport,
        fetchExecutiveExceptions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
