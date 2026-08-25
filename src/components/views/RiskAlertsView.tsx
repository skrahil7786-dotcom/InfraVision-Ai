import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Alert } from "../../types";
import {
  AlertTriangle,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Clock,
  Filter,
  PlusCircle,
  Sparkles,
  Check,
  User,
  Layers,
  UserCheck,
  MessageSquare,
  AlertOctagon,
  ChevronRight,
  Send,
  X,
} from "lucide-react";

export const RiskAlertsView: React.FC = () => {
  const {
    alerts,
    resolveAlertWithSummary,
    acknowledgeAlert,
    assignAlert,
    escalateAlert,
    addAlertComment,
    createAlert,
    projects,
    openWbsDrawer,
  } = useApp();

  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("OPEN");
  const [isCreatingAlert, setIsCreatingAlert] = useState<boolean>(false);

  // Resolution Modal State
  const [activeResolveAlert, setActiveResolveAlert] = useState<Alert | null>(null);
  const [resolutionSummary, setResolutionSummary] = useState<string>("");

  // Assign Modal State
  const [activeAssignAlert, setActiveAssignAlert] = useState<Alert | null>(null);
  const [assigneeName, setAssigneeName] = useState<string>("");
  const [assignDueDate, setAssignDueDate] = useState<string>("");

  // Comment input state per alert
  const [commentInput, setCommentInput] = useState<{ [alertId: string]: string }>({});

  // New alert form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSeverity, setNewSeverity] = useState<Alert["severity"]>("HIGH");
  const [newCategory, setNewCategory] = useState<Alert["category"]>("TIMELINE");
  const [newProjectId, setNewProjectId] = useState<string>(projects[0]?.id || "proj-1");
  const [newWbsCode, setNewWbsCode] = useState<string>("3.2");
  const [newAiAction, setNewAiAction] = useState("");

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev = selectedSeverity === "ALL" || a.severity === selectedSeverity;
    const matchesCat = selectedCategory === "ALL" || a.category === selectedCategory;
    const matchesStat =
      selectedStatus === "ALL"
        ? true
        : selectedStatus === "OPEN"
        ? a.status !== "RESOLVED"
        : a.status === "RESOLVED";
    return matchesSev && matchesCat && matchesStat;
  });

  const handleCreateNewAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const proj = projects.find((p) => p.id === newProjectId);
    await createAlert({
      projectId: newProjectId,
      projectName: proj ? proj.name : "National Project Corridor",
      title: newTitle,
      description: newDesc || "Manual inspection finding recorded on-site.",
      severity: newSeverity,
      category: newCategory,
      affectedWbsCode: newWbsCode,
      aiSuggestedAction:
        newAiAction ||
        "Initiate emergency site inspection, review CAD drawings, and deploy standby resource within 24 hours.",
    });

    setIsCreatingAlert(false);
    setNewTitle("");
    setNewDesc("");
    setNewAiAction("");
  };

  const handleConfirmResolution = async () => {
    if (!activeResolveAlert) return;
    if (!resolutionSummary.trim()) {
      alert("Please provide a resolution summary/closure note.");
      return;
    }
    await resolveAlertWithSummary(activeResolveAlert.id, resolutionSummary);
    setActiveResolveAlert(null);
    setResolutionSummary("");
  };

  const handleConfirmAssign = async () => {
    if (!activeAssignAlert) return;
    if (!assigneeName.trim()) {
      alert("Please enter assignee name.");
      return;
    }
    await assignAlert(activeAssignAlert.id, assigneeName, assignDueDate);
    setActiveAssignAlert(null);
    setAssigneeName("");
    setAssignDueDate("");
  };

  const handleSendComment = async (alertId: string) => {
    const text = commentInput[alertId];
    if (!text || !text.trim()) return;
    await addAlertComment(alertId, text.trim());
    setCommentInput((prev) => ({ ...prev, [alertId]: "" }));
  };

  const getSeverityBadge = (sev?: Alert["severity"] | string) => {
    switch (sev) {
      case "CRITICAL":
        return { bg: "bg-red-600 text-white", label: "Critical" };
      case "HIGH":
        return { bg: "bg-rose-100 text-rose-800 border-rose-200", label: "High Risk" };
      case "MEDIUM":
        return { bg: "bg-amber-100 text-amber-800 border-amber-200", label: "Medium Risk" };
      case "LOW":
        return { bg: "bg-blue-100 text-blue-800 border-blue-200", label: "Low (Notice)" };
      default:
        return { bg: "bg-slate-100 text-slate-800 border-slate-200", label: "Notice" };
    }
  };

  const getStatusPill = (status?: string) => {
    switch (status) {
      case "RESOLVED":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> RESOLVED</span>;
      case "ESCALATED":
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><AlertOctagon className="w-3 h-3 text-purple-600" /> ESCALATED</span>;
      case "IN_PROGRESS":
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3 text-blue-600" /> IN PROGRESS</span>;
      case "ACKNOWLEDGED":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><UserCheck className="w-3 h-3 text-amber-600" /> ACKNOWLEDGED</span>;
      default:
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3 text-rose-600 animate-pulse" /> NEW / OPEN</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
              <Flame className="w-3 h-3 text-rose-600" />
              <span>SIH Anomaly & Hazard Engine</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Automated Risk Routing</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Early Warning Alerts & Risk Mitigation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time notifications triggered by schedule deviations, quality discrepancies, material bottlenecks, and safety non-compliances.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingAlert(!isCreatingAlert)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-500/20 flex items-center space-x-2 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Field Risk Manually</span>
        </button>
      </div>

      {/* Manual Creation Form */}
      {isCreatingAlert && (
        <form onSubmit={handleCreateNewAlert} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-800">Log Site Anomaly or Schedule Deviation Alert</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Project</label>
              <select
                value={newProjectId}
                onChange={(e) => setNewProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Severity</label>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
              >
                <option value="CRITICAL">Critical (Immediate Stop)</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
              >
                <option value="TIMELINE">Timeline & Delay</option>
                <option value="QUALITY">Quality & Compliance</option>
                <option value="SAFETY">Safety Hazard</option>
                <option value="MATERIAL">Material Shortage</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Affected WBS Code</label>
              <input
                type="text"
                value={newWbsCode}
                onChange={(e) => setNewWbsCode(e.target.value)}
                placeholder="e.g. 3.2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1 text-xs">Alert Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. DBM Layer Compaction Deficit at Ch 135+000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1 text-xs">Description & Evidence Findings</label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingAlert(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Publish Alert to Field Team
            </button>
          </div>
        </form>
      )}

      {/* Filter Pills */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-2 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open Alerts (Active)</option>
              <option value="RESOLVED">Resolved Archive</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-2 cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-2 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="TIMELINE">Timeline</option>
              <option value="QUALITY">Quality</option>
              <option value="SAFETY">Safety</option>
              <option value="MATERIAL">Material</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Showing {filteredAlerts.length} Alerts
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No Matching Alerts</h4>
            <p className="text-xs text-slate-500">All registered project corridors operate within safe tolerances.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const sevBadge = getSeverityBadge(alert.severity);
            const isResolved = alert.status === "RESOLVED";

            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`bg-white rounded-3xl p-6 shadow-sm border transition-all ${
                  isResolved
                    ? "border-slate-200 opacity-75 bg-slate-50/50"
                    : alert.severity === "CRITICAL"
                    ? "border-red-300 ring-1 ring-red-500/20 bg-rose-50/10"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${sevBadge.bg}`}>
                        {sevBadge.label}
                      </span>
                      {getStatusPill(alert.lifecycleStatus || alert.status)}
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                        {alert.category}
                      </span>
                      {alert.affectedWbsCode && (
                        <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          WBS {alert.affectedWbsCode}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(alert.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900">{alert.title}</h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">Project: {alert.projectName}</p>
                  </div>

                  {/* Top Right Action Button */}
                  <div className="flex items-center gap-2">
                    {isResolved ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Resolved</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveResolveAlert(alert);
                          setResolutionSummary("");
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve with Summary</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 mb-3 leading-relaxed">{alert.description}</p>

                {/* Ownership & SLA Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 py-2 bg-slate-50 rounded-xl px-3 text-xs border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Owner</span>
                    <span className="font-semibold text-slate-800">{alert.assignedOwner || "Unassigned"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Due Date</span>
                    <span className="font-semibold text-slate-800">{alert.dueDate || "Immediate"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">SLA Target</span>
                    <span className="font-semibold text-slate-800">
                      {alert.severity === "CRITICAL" ? "24 Hours" : alert.severity === "HIGH" ? "48 Hours" : "7 Days"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Acknowledged</span>
                    <span className="font-semibold text-slate-800">{alert.acknowledgedBy ? `By ${alert.acknowledgedBy}` : "Pending"}</span>
                  </div>
                </div>

                {/* AI Suggested Action Mitigation Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-3.5 rounded-2xl border border-blue-100 flex items-start space-x-2.5 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-extrabold text-blue-900 uppercase text-[10px] tracking-wider block">
                      AI Recommended Technical Action
                    </span>
                    <p className="text-slate-700 mt-0.5 font-medium">{alert.aiSuggestedAction}</p>
                  </div>
                </div>

                {/* Resolution Summary Box if Resolved */}
                {alert.resolutionSummary && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 mb-3">
                    <span className="font-bold block">Resolution & Closure Summary:</span>
                    <p className="mt-0.5">{alert.resolutionSummary}</p>
                    <span className="text-[10px] text-emerald-700 mt-1 block">
                      Closed by {alert.resolvedBy || "Superintending Engineer"} at {alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleString() : ""}
                    </span>
                  </div>
                )}

                {/* Incident Action Buttons */}
                {!isResolved && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openWbsDrawer("tt-101", alert.projectId)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                      >
                        Inspect WBS Task <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {!alert.acknowledgedBy && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold transition"
                        >
                          Acknowledge
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActiveAssignAlert(alert);
                          setAssigneeName(alert.assignedOwner || "");
                          setAssignDueDate(alert.dueDate || "");
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition"
                      >
                        Assign Owner
                      </button>

                      <button
                        onClick={() => {
                          const note = prompt("Escalation reason to Superintending Engineer (HQ):", "Threshold exceeded.") || "";
                          escalateAlert(alert.id, note);
                        }}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-lg text-xs font-semibold transition"
                      >
                        Escalate to HQ
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments & Audit Trail Thread */}
                {alert.comments && alert.comments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Activity Discussion ({alert.comments.length})</span>
                    {alert.comments.map((c) => (
                      <div key={c.id} className="bg-slate-50 p-2 rounded-lg text-xs flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-800">{c.user}</span>: <span className="text-slate-700">{c.text}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                {!isResolved && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={commentInput[alert.id] || ""}
                      onChange={(e) => setCommentInput({ ...commentInput, [alert.id]: e.target.value })}
                      placeholder="Add an engineering note or site observation..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleSendComment(alert.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Post
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resolve Modal */}
      {activeResolveAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-emerald-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Resolve Risk Alert</h3>
                <p className="text-xs text-slate-500">{activeResolveAlert.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Document the exact engineering mitigation taken and verified lab test or field survey result to close this risk item.
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Resolution Summary / Root Cause Fix *</label>
              <textarea
                rows={3}
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                placeholder="e.g. Additional batching plant commissioned. Core test results confirmed 98.4% compaction."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveResolveAlert(null)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolution}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Confirm Closure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {activeAssignAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-blue-600">
                <UserCheck className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">Assign Alert Owner</h3>
              </div>
              <button onClick={() => setActiveAssignAlert(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Responsible Engineer / Owner *</label>
                <input
                  type="text"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  placeholder="e.g. Er. Rajesh Sharma (Quality Incharge)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Resolution Due Date</label>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveAssignAlert(null)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
