import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { FieldUpdate, FieldUpdateSource, VerificationStatus } from "../../types";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Edit3,
  Filter,
  Search,
  Plus,
  FileText,
  Camera,
  MapPin,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  X,
  MessageSquare,
  Eye,
  RefreshCw,
} from "lucide-react";

export const VerificationQueueView: React.FC = () => {
  const {
    fieldUpdates,
    projects,
    currentUser,
    verifyFieldUpdate,
    rejectFieldUpdate,
    editFieldUpdate,
    clarifyFieldUpdate,
    submitFieldUpdate,
    openWbsDrawer,
    refreshData,
  } = useApp();

  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [activeRejectModal, setActiveRejectModal] = useState<FieldUpdate | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [activeEditModal, setActiveEditModal] = useState<FieldUpdate | null>(null);
  const [editFormData, setEditFormData] = useState<{ quantity: number; unit: string; reportDate: string; activity: string; reviewerComments: string }>({
    quantity: 0,
    unit: "",
    reportDate: "",
    activity: "",
    reviewerComments: "",
  });
  const [activeClarifyModal, setActiveClarifyModal] = useState<FieldUpdate | null>(null);
  const [clarificationNote, setClarificationNote] = useState<string>("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // New Submission Form
  const [newUpdateForm, setNewUpdateForm] = useState({
    projectId: projects[0]?.id || "proj-1",
    wbsCode: "3.2",
    activity: "Dense Bituminous Macadam (DBM) Chainage 135+000",
    quantity: 500,
    unit: "MT",
    reportDate: new Date().toISOString().split("T")[0],
    source: "MANUAL" as FieldUpdateSource,
    extractionConfidence: 100,
    reviewerComments: "",
  });
  const [formWarnings, setFormWarnings] = useState<string[]>([]);

  const filteredUpdates = useMemo(() => {
    return fieldUpdates.filter((u) => {
      if (projectFilter !== "ALL" && u.projectId !== projectFilter) return false;
      if (statusFilter !== "ALL" && u.verificationStatus !== statusFilter) return false;
      if (sourceFilter !== "ALL" && u.source !== sourceFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          u.activity.toLowerCase().includes(q) ||
          u.wbsCode.toLowerCase().includes(q) ||
          u.submittedBy.toLowerCase().includes(q) ||
          u.projectName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [fieldUpdates, projectFilter, statusFilter, sourceFilter, searchQuery]);

  const pendingCount = fieldUpdates.filter((u) => u.verificationStatus === "PENDING").length;
  const verifiedCount = fieldUpdates.filter((u) => u.verificationStatus === "VERIFIED").length;
  const rejectedCount = fieldUpdates.filter((u) => u.verificationStatus === "REJECTED").length;

  const handleVerify = async (update: FieldUpdate) => {
    setActionErrorMessage(null);
    const comment = prompt("Optional Manager verification note:", "Field evidence and lab test reports verified.") || "";
    const res = await verifyFieldUpdate(update.id, comment);
    if (res.success) {
      setActionSuccessMessage(`Update #${update.id} (${update.activity}) verified. Official progress updated.`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionErrorMessage(res.error || "Failed to verify update.");
    }
  };

  const handleConfirmReject = async () => {
    if (!activeRejectModal) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }
    const res = await rejectFieldUpdate(activeRejectModal.id, rejectionReason);
    if (res.success) {
      setActionSuccessMessage(`Update #${activeRejectModal.id} rejected. Official progress was not altered.`);
      setActiveRejectModal(null);
      setRejectionReason("");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionErrorMessage(res.error || "Failed to reject update.");
    }
  };

  const handleOpenEdit = (update: FieldUpdate) => {
    setActiveEditModal(update);
    setEditFormData({
      quantity: update.quantity,
      unit: update.unit,
      reportDate: update.reportDate,
      activity: update.activity,
      reviewerComments: update.reviewerComments || "",
    });
  };

  const handleConfirmEdit = async () => {
    if (!activeEditModal) return;
    const res = await editFieldUpdate(activeEditModal.id, editFormData);
    if (res.success) {
      setActionSuccessMessage(`Update #${activeEditModal.id} edited successfully.`);
      setActiveEditModal(null);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionErrorMessage(res.error || "Failed to edit update.");
    }
  };

  const handleConfirmClarify = async () => {
    if (!activeClarifyModal) return;
    if (!clarificationNote.trim()) {
      alert("Please enter clarification note.");
      return;
    }
    const res = await clarifyFieldUpdate(activeClarifyModal.id, clarificationNote);
    if (res.success) {
      setActionSuccessMessage(`Clarification requested for update #${activeClarifyModal.id}.`);
      setActiveClarifyModal(null);
      setClarificationNote("");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionErrorMessage(res.error || "Failed to request clarification.");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionErrorMessage(null);
    setFormWarnings([]);

    const res = await submitFieldUpdate(newUpdateForm);
    if (res.success) {
      setActionSuccessMessage("Field update submitted to Manager Verification Queue as PENDING.");
      if (res.warnings && res.warnings.length > 0) {
        setFormWarnings(res.warnings);
      } else {
        setIsSubmitModalOpen(false);
      }
      setTimeout(() => setActionSuccessMessage(null), 6000);
    } else {
      setActionErrorMessage(res.error || "Submission failed.");
    }
  };

  const getSourceBadge = (source: FieldUpdateSource) => {
    switch (source) {
      case "PDF_DPR":
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1"><FileText className="w-3 h-3" /> PDF DPR</span>;
      case "OCR":
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3" /> OCR Extracted</span>;
      case "DRONE_IMAGE":
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1"><Camera className="w-3 h-3" /> Drone Vision</span>;
      case "SATELLITE":
        return <span className="bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1"><MapPin className="w-3 h-3" /> Satellite</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1"><Edit3 className="w-3 h-3" /> Manual Input</span>;
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "VERIFIED":
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> VERIFIED</span>;
      case "REJECTED":
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-rose-600" /> REJECTED</span>;
      case "CLARIFICATION_REQUESTED":
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-amber-600" /> CLARIFICATION NEEDED</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> PENDING REVIEW</span>;
    }
  };

  return (
    <div id="verification-queue-view" className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* View Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manager Verification Queue</h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingCount} Pending Approval
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Statutory verification gateway for field DPRs, OCR extractions, and drone logs. Only verified entries update official completion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="refresh-verification-btn"
              onClick={() => refreshData()}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>

            <button
              id="new-field-update-btn"
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Submit Field Update
            </button>
          </div>
        </div>

        {/* Priority 1 Scope Banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-bold">Project Control Policy:</span> Only <span className="font-semibold text-emerald-800">VERIFIED</span> updates affect official project progress and S-Curve metrics. Submissions marked <span className="font-semibold text-blue-800">PENDING</span>, <span className="font-semibold text-amber-800">CLARIFICATION_REQUESTED</span>, or <span className="font-semibold text-rose-800">REJECTED</span> are logged in audit records but strictly excluded from official completion figures.
          </div>
        </div>

        {/* Action feedback banners */}
        {actionSuccessMessage && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {actionErrorMessage && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{actionErrorMessage}</span>
            </div>
            <button onClick={() => setActionErrorMessage(null)} className="text-rose-700 hover:text-rose-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters Bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
            <div className="flex rounded-lg border border-slate-300 p-0.5 bg-slate-100 text-xs">
              {["PENDING", "VERIFIED", "REJECTED", "ALL"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1.5 text-center rounded-md font-semibold transition ${
                    statusFilter === st ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st === "PENDING" ? `Pending (${pendingCount})` : st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project</label>
            <select
              id="filter-project-select"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Source</label>
            <select
              id="filter-source-select"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Ingestion Sources</option>
              <option value="PDF_DPR">PDF DPR Extractions</option>
              <option value="OCR">OCR Scanned Sheets</option>
              <option value="DRONE_IMAGE">Drone Computer Vision</option>
              <option value="MANUAL">Manual Field Logs</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Search Records</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="search-updates-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activity, WBS code, submitter..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Queue Records List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredUpdates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto mt-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No field updates found</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no updates matching the selected filter criteria. Check "All" status or submit a new field update.
            </p>
          </div>
        ) : (
          filteredUpdates.map((update) => (
            <div
              key={update.id}
              id={`update-card-${update.id}`}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all ${
                update.verificationStatus === "PENDING"
                  ? "border-blue-300 hover:border-blue-400 ring-1 ring-blue-100"
                  : update.verificationStatus === "VERIFIED"
                  ? "border-emerald-200"
                  : update.verificationStatus === "REJECTED"
                  ? "border-rose-200 bg-rose-50/20"
                  : "border-amber-200 bg-amber-50/20"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getStatusBadge(update.verificationStatus)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        WBS {update.wbsCode}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{update.activity}</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Project: <span className="text-slate-700 font-semibold">{update.projectName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-center">
                  {getSourceBadge(update.source)}
                  <span className="text-xs text-slate-400 font-mono">
                    ID: #{update.id}
                  </span>
                </div>
              </div>

              {/* Data Grid Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 my-4 py-2 bg-slate-50/70 rounded-lg px-4 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reported Quantity</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {update.quantity.toLocaleString()} {update.unit}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Report Date</span>
                  <span className="font-medium text-slate-800">{update.reportDate}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Submitted By</span>
                  <span className="font-medium text-slate-800 truncate block">{update.submittedBy}</span>
                  <span className="text-[10px] text-slate-400">{update.submittedByRole}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Extraction Confidence</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${update.extractionConfidence >= 90 ? "bg-emerald-500" : "bg-amber-500"}`}
                        style={{ width: `${update.extractionConfidence}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-700">{update.extractionConfidence}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">GPS Geo-Location</span>
                  <span className={`font-medium flex items-center gap-1 ${
                    update.gpsStatus === "GPS_VERIFIED" ? "text-emerald-700" : update.gpsStatus === "OUT_OF_RANGE" ? "text-rose-700 font-bold" : "text-slate-600"
                  }`}>
                    <MapPin className="w-3 h-3" />
                    {update.gpsStatus === "GPS_VERIFIED" ? "Corridor Verified" : update.gpsStatus === "OUT_OF_RANGE" ? "Out of Range (>10km)" : "Demo Verified"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Logged Timestamp</span>
                  <span className="font-mono text-[11px] text-slate-600">
                    {new Date(update.createdTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}
                  </span>
                </div>
              </div>

              {/* Validation Warnings */}
              {update.validationWarnings && update.validationWarnings.length > 0 && (
                <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">System Validation Notices:</span>
                    <ul className="list-disc list-inside mt-0.5 text-[11px] text-amber-800 space-y-0.5">
                      {update.validationWarnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Reviewer Comments if already reviewed */}
              {update.reviewerComments && (
                <div className={`p-3 rounded-lg text-xs mb-3 border ${
                  update.verificationStatus === "VERIFIED" ? "bg-emerald-50/60 border-emerald-200 text-emerald-900" : update.verificationStatus === "REJECTED" ? "bg-rose-50 border-rose-200 text-rose-900" : "bg-amber-50 border-amber-200 text-amber-900"
                }`}>
                  <span className="font-bold block">
                    {update.verificationStatus === "VERIFIED" ? "Manager Verification Note" : update.verificationStatus === "REJECTED" ? "Rejection Reason" : "Clarification Request"}:
                  </span>
                  <p className="mt-0.5">{update.reviewerComments}</p>
                  {update.reviewedBy && (
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Signed off by {update.reviewedBy} at {update.reviewedAt ? new Date(update.reviewedAt).toLocaleString() : ""}
                    </span>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openWbsDrawer(update.wbsTaskId || "tt-101", update.projectId)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    Inspect WBS Schedule <ChevronRight className="w-3 h-3" />
                  </button>
                  {update.documentName && (
                    <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      <FileText className="w-3 h-3 text-purple-600" /> {update.documentName}
                    </span>
                  )}
                </div>

                {/* Manager Decision Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(update)}
                    className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>

                  {update.verificationStatus === "PENDING" && (
                    <>
                      <button
                        onClick={() => {
                          setActiveClarifyModal(update);
                          setClarificationNote("");
                        }}
                        className="px-2.5 py-1.5 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-medium flex items-center gap-1 transition"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Request Clarification
                      </button>

                      <button
                        onClick={() => {
                          setActiveRejectModal(update);
                          setRejectionReason("");
                        }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject with Reason
                      </button>

                      <button
                        onClick={() => handleVerify(update)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verify & Update Progress
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {activeRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reject Field Update</h3>
                <p className="text-xs text-slate-500">Record #{activeRejectModal.id} - WBS {activeRejectModal.wbsCode}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              A clear, audit-compliant reason is required. This will be stored in the permanent audit trail.
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Rejection Reason *</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Reported quantity exceeds physical survey stretch by 3000m. GPS mismatch."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveRejectModal(null)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {activeEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Edit3 className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">Edit Field Update #{activeEditModal.id}</h3>
              </div>
              <button onClick={() => setActiveEditModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Activity Title</label>
                <input
                  type="text"
                  value={editFormData.activity}
                  onChange={(e) => setEditFormData({ ...editFormData, activity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={editFormData.quantity}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Report Date</label>
                <input
                  type="date"
                  value={editFormData.reportDate}
                  onChange={(e) => setEditFormData({ ...editFormData, reportDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reviewer Note / Correction Reason</label>
                <textarea
                  rows={2}
                  value={editFormData.reviewerComments}
                  onChange={(e) => setEditFormData({ ...editFormData, reviewerComments: e.target.value })}
                  placeholder="Reason for modifying submitted field quantity..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveEditModal(null)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clarification Modal */}
      {activeClarifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Request Clarification</h3>
                <p className="text-xs text-slate-500">Record #{activeClarifyModal.id} - {activeClarifyModal.submittedBy}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Send a query back to the site engineer. The update will remain in queue without altering official metrics.
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Clarification Note *</label>
              <textarea
                rows={3}
                value={clarificationNote}
                onChange={(e) => setClarificationNote(e.target.value)}
                placeholder="e.g. Please attach the 7-day cube test compressive strength certificate before verification."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveClarifyModal(null)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClarify}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit New Field Update Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Plus className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">Submit New Field Update</h3>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Project *</label>
                <select
                  value={newUpdateForm.projectId}
                  onChange={(e) => setNewUpdateForm({ ...newUpdateForm, projectId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WBS Code *</label>
                  <input
                    type="text"
                    value={newUpdateForm.wbsCode}
                    onChange={(e) => setNewUpdateForm({ ...newUpdateForm, wbsCode: e.target.value })}
                    placeholder="e.g. 3.2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Source Type</label>
                  <select
                    value={newUpdateForm.source}
                    onChange={(e) => setNewUpdateForm({ ...newUpdateForm, source: e.target.value as FieldUpdateSource })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  >
                    <option value="MANUAL">Manual Field Log</option>
                    <option value="PDF_DPR">PDF DPR Upload</option>
                    <option value="OCR">OCR Extraction</option>
                    <option value="DRONE_IMAGE">Drone Computer Vision</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Activity Description *</label>
                <input
                  type="text"
                  value={newUpdateForm.activity}
                  onChange={(e) => setNewUpdateForm({ ...newUpdateForm, activity: e.target.value })}
                  placeholder="e.g. Dense Bituminous Macadam (DBM) Chainage 135+000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity (Greater than 0) *</label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={newUpdateForm.quantity}
                    onChange={(e) => setNewUpdateForm({ ...newUpdateForm, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit *</label>
                  <input
                    type="text"
                    value={newUpdateForm.unit}
                    onChange={(e) => setNewUpdateForm({ ...newUpdateForm, unit: e.target.value })}
                    placeholder="MT, Cum, Km, Nos..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Report Date *</label>
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={newUpdateForm.reportDate}
                  onChange={(e) => setNewUpdateForm({ ...newUpdateForm, reportDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              {formWarnings.length > 0 && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <span className="font-bold">Notices triggered on submission:</span>
                  <ul className="list-disc list-inside mt-1 text-[11px] text-amber-800">
                    {formWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
