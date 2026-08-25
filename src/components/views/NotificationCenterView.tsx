import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AppNotification } from "../../types";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Calendar,
  FileText,
  Camera,
  ShieldAlert,
  ArrowRight,
  Filter,
  Trash2,
  CheckCheck,
  Sparkles,
  Zap,
  Clock,
  Building2,
  Search,
  ExternalLink,
} from "lucide-react";

export const NotificationCenterView: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    addNotification,
    setActiveView,
    setSelectedProjectId,
    projects,
  } = useApp();

  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>("ALL");
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtering
  const filteredNotifications = notifications.filter((notif) => {
    if (unreadOnly && notif.read) return false;
    if (selectedType !== "ALL" && notif.type !== selectedType) return false;
    if (selectedSeverity !== "ALL" && notif.severity !== selectedSeverity) return false;
    if (selectedProjectFilter !== "ALL" && notif.projectId !== selectedProjectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = notif.title.toLowerCase().includes(q);
      const matchMsg = notif.message.toLowerCase().includes(q);
      const matchProj = notif.projectName?.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchProj) return false;
    }
    return true;
  });

  const getSeverityBadge = (severity: AppNotification["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
            <AlertOctagon className="w-3 h-3" />
            <span>Critical Priority</span>
          </span>
        );
      case "HIGH":
        return (
          <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>High Risk</span>
          </span>
        );
      case "MEDIUM":
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Medium</span>
          </span>
        );
      case "LOW":
        return (
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
            <Info className="w-3 h-3" />
            <span>Low</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
            <Info className="w-3 h-3" />
            <span>Notice</span>
          </span>
        );
    }
  };

  const getTypeIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "DELAY_RISK":
        return <Clock className="w-4 h-4 text-rose-600" />;
      case "AI_DETECTION":
        return <Camera className="w-4 h-4 text-blue-600" />;
      case "PERMIT_EXPIRY":
        return <FileText className="w-4 h-4 text-amber-600" />;
      case "SAFETY_ALERT":
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case "QUALITY_ISSUE":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "MILESTONE_MET":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "OCR_DPR":
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    if (!notif.read) {
      markNotificationRead(notif.id, true);
    }
    if (notif.projectId) {
      setSelectedProjectId(notif.projectId);
    }
    if (notif.actionTargetView) {
      setActiveView(notif.actionTargetView);
    }
  };

  // Demo simulator trigger: injects a new realistic AI drone alert
  const triggerSimulatedSiteAlert = () => {
    const demoAlerts = [
      {
        type: "AI_DETECTION" as const,
        title: "Drone Orthophoto Scan: Foundation Piling Deviation Detected",
        message: "Automated photogrammetry analysis detected 4 out of 16 bored cast-in-situ piles lagging the planned baseline grid by 12 days.",
        projectId: "proj-1",
        projectName: "Delhi-Mumbai Expressway (PKG-4)",
        severity: "HIGH" as const,
        actionLabel: "Inspect Drone AI Orthophoto",
        actionTargetView: "ai-vision",
        meta: {
          chainage: "KM 138+200",
          detectedProgress: 38,
          stageDetected: "Foundation Piling",
        },
      },
      {
        type: "PERMIT_EXPIRY" as const,
        title: "Forest & Wildlife Clearance Nearing Expiration",
        message: "Tree felling and ecological transit permit #MOEF-2024-WB-881 expires in 21 days for Package 2. Immediate renewal filing required.",
        projectId: "proj-3",
        projectName: "Varanasi Smart Ring Road (Phase 1)",
        severity: "MEDIUM" as const,
        actionLabel: "View Document Repository",
        actionTargetView: "reports",
        meta: {
          clearanceType: "Ecological Transit MOEF-2024",
          daysRemaining: 21,
        },
      },
      {
        type: "QUALITY_ISSUE" as const,
        title: "Bitumen Core Compaction Density Below MoRTH Threshold",
        message: "Third-party nuclear density gauge recorded 96.2% compaction at Chainage 134+100 (Minimum specified: 97.5% per IRC:37 Table 500-11).",
        projectId: "proj-1",
        projectName: "Delhi-Mumbai Expressway (PKG-4)",
        severity: "CRITICAL" as const,
        actionLabel: "Review Road Quality NCR",
        actionTargetView: "alerts",
        meta: {
          deviation: -1.3,
        },
      },
    ];

    const random = demoAlerts[Math.floor(Math.random() * demoAlerts.length)];
    addNotification(random);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
                <Bell className="w-3.5 h-3.5" />
                <span>Centralized Alert Aggregation</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Real-Time Event Stream</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Notification & Audit Center
            </h2>
            <p className="text-xs text-slate-500">
              Aggregating computer vision alerts, critical path delay risks, compliance expirations, and DPR anomalies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={triggerSimulatedSiteAlert}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Site Alert (Live Demo)</span>
            </button>

            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Mark All Read ({unreadNotificationsCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Total Notifications</span>
            <span className="text-2xl font-black text-slate-900">{notifications.length}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Aggregated in this session</span>
          </div>

          <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
            <span className="text-[11px] font-bold text-blue-700 uppercase block">Unread Alerts</span>
            <span className="text-2xl font-black text-blue-950">{unreadNotificationsCount}</span>
            <span className="text-[10px] text-blue-600 block mt-0.5">Requiring attention</span>
          </div>

          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100">
            <span className="text-[11px] font-bold text-rose-700 uppercase block">Critical Delays</span>
            <span className="text-2xl font-black text-rose-950">
              {notifications.filter((n) => n.severity === "CRITICAL").length}
            </span>
            <span className="text-[10px] text-rose-600 block mt-0.5">Immediate stop / mitigation</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-700 uppercase block">AI Drone Scans</span>
            <span className="text-2xl font-black text-emerald-950">
              {notifications.filter((n) => n.type === "AI_DETECTION").length}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">Computer vision verified</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts, projects, keywords..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Unread Toggle */}
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-3 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              unreadOnly
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Unread Only
          </button>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border-none outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="DELAY_RISK">Schedule Delay Risk</option>
            <option value="AI_DETECTION">AI Computer Vision</option>
            <option value="PERMIT_EXPIRY">Permit Expiration</option>
            <option value="SAFETY_ALERT">Safety Hazard</option>
            <option value="QUALITY_ISSUE">Quality Non-Conformance</option>
            <option value="MILESTONE_MET">Milestones Met</option>
            <option value="OCR_DPR">DPR Document OCR</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border-none outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="INFO">Info</option>
          </select>

          {/* Project Filter */}
          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border-none outline-none cursor-pointer max-w-[160px] truncate"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-bold text-slate-800">No Notifications Matching Filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              All infrastructure corridors are operating within current tolerance limits or your search criteria returned zero items.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isCritical = notif.severity === "CRITICAL";

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-3xl p-5 shadow-sm border transition-all ${
                  !notif.read
                    ? "border-blue-200 bg-blue-50/20 ring-1 ring-blue-500/10"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Icon and Content */}
                  <div className="flex items-start space-x-3.5 flex-1">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isCritical
                          ? "bg-rose-100 text-rose-700"
                          : notif.type === "AI_VISION_DETECTION"
                          ? "bg-blue-100 text-blue-700"
                          : notif.type === "DOCUMENT_EXPIRATION"
                          ? "bg-amber-100 text-amber-700"
                          : notif.type === "SAFETY_HAZARD"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getSeverityBadge(notif.severity)}

                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase">
                          {notif.type.replace(/_/g, " ")}
                        </span>

                        {notif.projectName && (
                          <span className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>{notif.projectName}</span>
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(notif.timestamp).toLocaleString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

                      {/* Metadata Chips if available */}
                      {notif.meta && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {Object.entries(notif.meta).map(([key, val]) => (
                            <span
                              key={key}
                              className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg font-mono border border-slate-200"
                            >
                              <strong className="text-slate-900">{key}:</strong> {String(val)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end lg:self-start">
                    {notif.actionLabel && (
                      <button
                        onClick={() => handleActionClick(notif)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <span>{notif.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => markNotificationRead(notif.id, !notif.read)}
                      className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title={notif.read ? "Mark as unread" : "Mark as read"}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${notif.read ? "text-emerald-600" : "text-slate-400"}`}
                      />
                    </button>

                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Dismiss notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
