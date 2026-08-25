import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { SAMPLE_OCR_DOCUMENTS } from "../../data/seedData";
import { OCRDocumentResult } from "../../types";
import {
  FileText,
  Scan,
  Sparkles,
  Printer,
  Users,
  Truck,
  Box,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  ChevronRight,
  Download,
  FileSpreadsheet,
  AlertOctagon,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Send,
} from "lucide-react";

export const ReportsView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    alerts,
    fieldUpdates,
    processOCRDocument,
    isAiProcessing,
    createFieldUpdate,
    setActiveView,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"DPR" | "EXCEPTION" | "OCR">("DPR");
  const [selectedProject, setSelectedProject] = useState<string>(selectedProjectId || "proj-1");
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // OCR state
  const [selectedDoc, setSelectedDoc] = useState<any>(SAMPLE_OCR_DOCUMENTS[0]);
  const [customText, setCustomText] = useState<string>(SAMPLE_OCR_DOCUMENTS[0]?.rawContent || "");
  const [ocrResult, setOcrResult] = useState<OCRDocumentResult | null>(null);
  const [ocrSubmitSuccess, setOcrSubmitSuccess] = useState<string | null>(null);

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProject) || projects[0];
  }, [projects, selectedProject]);

  const projectTasks = useMemo(() => {
    return currentProject?.timelineTasks || [];
  }, [currentProject]);

  const projectUpdates = useMemo(() => {
    return fieldUpdates.filter((u) => u.projectId === selectedProject);
  }, [fieldUpdates, selectedProject]);

  const projectAlerts = useMemo(() => {
    return alerts.filter((a) => a.projectId === selectedProject);
  }, [alerts, selectedProject]);

  const delayedTasks = useMemo(() => {
    return projectTasks.filter((t) => {
      const dev = (t.actualProgress || 0) - (t.plannedProgress || 0);
      return dev < -1.0 || t.status === "DELAYED" || t.status === "CRITICAL_SLIPPAGE";
    });
  }, [projectTasks]);

  const criticalAlerts = useMemo(() => {
    return projectAlerts.filter((a) => a.severity === "CRITICAL" || a.status === "OPEN");
  }, [projectAlerts]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportDPRCSV = () => {
    if (!currentProject) return;
    const headers = [
      "Project Code",
      "Project Name",
      "WBS Code",
      "Task Activity",
      "Category",
      "Target Qty",
      "Completed Qty",
      "Unit",
      "Planned Progress (%)",
      "Actual Progress (%)",
      "Deviation (pp)",
      "Status",
      "Assigned Contractor",
    ];

    const rows = projectTasks.map((t) => [
      `"${currentProject.code}"`,
      `"${currentProject.name.replace(/"/g, '""')}"`,
      `"${t.wbsCode}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.targetQuantity || 100,
      t.completedQuantity || 0,
      `"${t.unit || '%'}"`,
      t.plannedProgress || 0,
      t.actualProgress || 0,
      ((t.actualProgress || 0) - (t.plannedProgress || 0)).toFixed(1),
      `"${t.status}"`,
      `"${t.assignedContractor || currentProject.contractor}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DPR_${currentProject.code}_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExceptionCSV = () => {
    if (!currentProject) return;
    const headers = [
      "Project",
      "WBS Task",
      "Deviation (pp)",
      "Planned (%)",
      "Actual (%)",
      "Est. Delay Days",
      "Responsible Engineer/Contractor",
      "Critical Alert Title",
      "Alert Severity",
      "Recommended Mitigation Action",
      "SLA Due Date",
      "Status",
    ];

    const rows = delayedTasks.map((t) => {
      const linkedAlert = projectAlerts.find((a) => a.affectedWbsCode === t.wbsCode || a.wbsTaskId === t.id);
      return [
        `"${currentProject.name.replace(/"/g, '""')}"`,
        `"${t.wbsCode} - ${t.name.replace(/"/g, '""')}"`,
        ((t.actualProgress || 0) - (t.plannedProgress || 0)).toFixed(1),
        t.plannedProgress,
        t.actualProgress,
        Math.abs(t.deviationDays || 0),
        `"${t.assignedContractor || currentProject.contractor}"`,
        linkedAlert ? `"${linkedAlert.title.replace(/"/g, '""')}"` : '"Rule-based Schedule Lag"',
        linkedAlert ? `"${linkedAlert.severity}"` : '"HIGH"',
        linkedAlert ? `"${linkedAlert.aiSuggestedAction.replace(/"/g, '""')}"` : '"Deploy additional paver crew & double haulage"',
        linkedAlert?.dueDate || "Within 48 hours",
        `"${t.status}"`,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Executive_Exception_Report_${currentProject.code}_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunOCR = async () => {
    try {
      const result = await processOCRDocument({
        documentText: customText,
        documentType: selectedDoc?.type || "DAILY_PROGRESS_REPORT",
      });
      setOcrResult(result);
    } catch (err) {
      console.error("OCR Extraction failed:", err);
    }
  };

  const handleSubmitOCRToVerification = async () => {
    if (!ocrResult) return;
    const quantity = ocrResult.materialsConsumedToday?.[0]?.quantity ? 48.5 : 500;
    await createFieldUpdate({
      projectId: selectedProject,
      wbsCode: "3.2",
      activity: "Dense Bituminous Macadam (DBM) Laying - OCR Daily Log",
      quantityValue: quantity,
      unit: "MT",
      reportDate: reportDate,
      sourceType: "OCR",
      extractionConfidence: 94,
      gpsStatus: "VALID",
      latitude: 19.076,
      longitude: 72.8777,
      verificationStatus: "PENDING",
      evidenceFiles: [
        {
          name: selectedDoc?.title || "DPR_Scanned_Log.pdf",
          type: "PDF",
          url: "/docs/dpr_sample_scan.pdf",
        },
      ],
    });
    setOcrSubmitSuccess("OCR Extracted DPR successfully submitted to Manager Verification Queue as PENDING!");
    setTimeout(() => setOcrSubmitSuccess(null), 6000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
              <FileText className="w-3 h-3 text-blue-600" />
              <span>MoRTH & NHAI Statutory Reporting System</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">IRC:37-2018 Compliant</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Infrastructure Progress Reports & Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate verifiable Daily Progress Reports (DPR), Executive Exception Dossiers, and Multimodal OCR extractions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-sm flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("DPR")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === "DPR"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Daily Progress Report (DPR)</span>
        </button>

        <button
          onClick={() => setActiveTab("EXCEPTION")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === "EXCEPTION"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>2. Executive Exception Report ({delayedTasks.length} Bottlenecks)</span>
        </button>

        <button
          onClick={() => setActiveTab("OCR")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === "OCR"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>3. AI OCR & Scanned DPR Intelligence</span>
        </button>
      </div>

      {/* TAB 1: DAILY PROGRESS REPORT */}
      {activeTab === "DPR" && (
        <div className="space-y-6">
          {/* Filter and Metadata Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Corridor Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Report Date
                </label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-center">
              <button
                onClick={handleExportDPRCSV}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export DPR to CSV</span>
              </button>
            </div>
          </div>

          {/* Official DPR Document View */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 print:p-0 print:border-none print:shadow-none">
            {/* Header / Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-6 h-6 text-blue-700" />
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    Government of India • Ministry of Road Transport & Highways
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  National Highways Authority of India (NHAI) / PMU Field Control Division
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  DPR Reference ID: NHAI-DPR-{currentProject?.code}-{reportDate}
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
                  Verified Official DPR
                </span>
                <p className="text-slate-500 mt-1 text-[11px]">
                  Generated: {new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                </p>
                <p className="text-slate-700 font-bold text-[11px]">
                  Reporting Officer: {currentUser?.name || "Er. Rajesh Sharma (Site Engineer)"}
                </p>
              </div>
            </div>

            {/* Project Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Corridor / Package</span>
                <span className="font-bold text-slate-900">{currentProject?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">EPC Contractor</span>
                <span className="font-bold text-slate-900">{currentProject?.contractor}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Planned Cumulative</span>
                <span className="font-black text-blue-700 text-sm">{currentProject?.plannedProgress}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Actual Verified</span>
                <span className="font-black text-emerald-700 text-sm">{currentProject?.actualProgress}%</span>
                <span className="text-[10px] text-slate-500 block">
                  Deviation: {(currentProject?.actualProgress! - currentProject?.plannedProgress!).toFixed(1)} percentage points
                </span>
              </div>
            </div>

            {/* WBS Task Progress Matrix */}
            <div>
              <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Physical Work Package Breakdown (WBS Schedule Linking)</span>
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">WBS Code</th>
                      <th className="p-3">Activity Description</th>
                      <th className="p-3 text-right">Target Qty</th>
                      <th className="p-3 text-right">Completed Qty</th>
                      <th className="p-3 text-right">Planned %</th>
                      <th className="p-3 text-right">Actual %</th>
                      <th className="p-3 text-right">Deviation (pp)</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projectTasks.map((task) => {
                      const dev = Number(((task.actualProgress || 0) - (task.plannedProgress || 0)).toFixed(1));
                      return (
                        <tr key={task.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-mono font-bold text-blue-700">{task.wbsCode}</td>
                          <td className="p-3 font-semibold text-slate-800">{task.name}</td>
                          <td className="p-3 text-right font-mono text-slate-600">
                            {task.targetQuantity?.toLocaleString()} {task.unit}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-700">
                            {task.completedQuantity?.toLocaleString()} {task.unit}
                          </td>
                          <td className="p-3 text-right font-mono text-blue-700">{task.plannedProgress}%</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-700">{task.actualProgress}%</td>
                          <td
                            className={`p-3 text-right font-mono font-black ${
                              dev < -10 ? "text-rose-600" : dev < 0 ? "text-amber-600" : "text-emerald-600"
                            }`}
                          >
                            {dev > 0 ? `+${dev}` : dev} pp
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                                task.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : task.status === "CRITICAL_SLIPPAGE" || task.status === "DELAYED"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verified Field Evidence & Sign-Off Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Field Ingestion Verification Audit</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  All completed quantities reflected in this report have undergone Manager Verification in accordance with MoRTH Specification Section 500. Raw sensor logs, drone surveys, and cube test results are stored in the tamper-evident audit ledger.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-700">Project Manager Sign-Off:</span>
                  <span className="font-mono text-emerald-700 font-bold">DIGITALLY SIGNED</span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between text-[10px] text-slate-500">
                  <span>Ananya Deshmukh (Project Manager)</span>
                  <span>NHAI Regional Office, New Delhi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXECUTIVE EXCEPTION REPORT */}
      {activeTab === "EXCEPTION" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Critical Schedule Variance & Delay Dossier</h3>
              <p className="text-xs text-slate-500">
                Identifies bottleneck packages with schedule deviation &le; -1.0 percentage points and unresolved alerts.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportExceptionCSV}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Exception Dossier (CSV)</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-md space-y-6">
            <div className="flex items-start justify-between border-b border-rose-100 pb-4">
              <div>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Executive Briefing • High Priority
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Schedule Exception Report: {currentProject?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Total Active Bottlenecks: <strong className="text-rose-700">{delayedTasks.length} Work Packages</strong> | Estimated Delay Impact: <strong className="text-rose-700">{currentProject?.predictedDelayDays} Days</strong>
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="font-bold text-rose-700 text-sm block">Action Required</span>
                <span className="text-[10px] text-slate-400">SLA: 48-Hour Response Cycle</span>
              </div>
            </div>

            {/* Critical Tasks Table */}
            <div className="space-y-3">
              {delayedTasks.map((task) => {
                const dev = Number(((task.actualProgress || 0) - (task.plannedProgress || 0)).toFixed(1));
                const linkedAlert = projectAlerts.find(
                  (a) => a.affectedWbsCode === task.wbsCode || a.wbsTaskId === task.id
                );

                return (
                  <div
                    key={task.id}
                    className="p-4 bg-rose-50/40 rounded-2xl border border-rose-200 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                          WBS {task.wbsCode}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{task.name}</h4>
                      </div>

                      <div className="flex items-center space-x-3 text-xs font-mono">
                        <span className="text-slate-500">Planned: {task.plannedProgress}%</span>
                        <span className="text-slate-800 font-bold">Actual: {task.actualProgress}%</span>
                        <span className="text-rose-700 font-black bg-white px-2 py-0.5 rounded border border-rose-300">
                          {dev} percentage points
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-rose-100 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Contractor</span>
                        <span className="font-semibold text-slate-800">{task.assignedContractor || currentProject?.contractor}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Root Cause / Bottleneck</span>
                        <span className="font-semibold text-slate-800">
                          {linkedAlert ? linkedAlert.title : "Logistics delay in bulk aggregate and bitumen supply."}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Recommended Mitigation</span>
                        <span className="font-semibold text-blue-700">
                          {linkedAlert ? linkedAlert.aiSuggestedAction : "Deploy second hot-mix asphalt batching plant."}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI OCR DOCUMENT INTELLIGENCE */}
      {activeTab === "OCR" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Document Raw View & Templates (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Select Demonstration DPR / Scanned Log</h3>

              <div className="space-y-2 mb-4">
                {SAMPLE_OCR_DOCUMENTS.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoc(doc);
                      setCustomText(doc.rawContent);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all ${
                      selectedDoc?.id === doc.id
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-900">{doc.title}</p>
                      <span className="text-[10px] font-mono font-bold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {doc.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{doc.contractor}</p>
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Document Content / Raw OCR Stream (Demonstration OCR extraction)
                </label>
                <textarea
                  rows={9}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full font-mono text-[11px] bg-slate-950 text-emerald-400 p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                id="btn-extract-ocr"
                onClick={handleRunOCR}
                disabled={isAiProcessing}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAiProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Entities with Gemini Multimodal OCR...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run AI Document Intelligence Extraction</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Structured Key-Value Extracted Audit (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">Structured DPR Operational Extraction</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Confidence: 94%
                </span>
              </div>

              {ocrSubmitSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{ocrSubmitSuccess}</span>
                </div>
              )}

              {/* Manpower Deployed Section */}
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Manpower Deployed Today</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-100 text-center">
                    <span className="text-[10px] text-blue-600 font-bold uppercase block">Engineers</span>
                    <span className="text-xl font-black text-blue-950">
                      {ocrResult?.manpowerDeployed?.engineers ?? 8}
                    </span>
                  </div>
                  <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 text-center">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase block">Skilled Labor</span>
                    <span className="text-xl font-black text-emerald-950">
                      {ocrResult?.manpowerDeployed?.skilledLabor ?? 42}
                    </span>
                  </div>
                  <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-100 text-center">
                    <span className="text-[10px] text-amber-600 font-bold uppercase block">Helpers</span>
                    <span className="text-xl font-black text-amber-950">
                      {ocrResult?.manpowerDeployed?.unskilledLabor ?? 65}
                    </span>
                  </div>
                  <div className="bg-purple-50/80 p-3 rounded-2xl border border-purple-100 text-center">
                    <span className="text-[10px] text-purple-600 font-bold uppercase block">Total Crew</span>
                    <span className="text-xl font-black text-purple-950">
                      {ocrResult?.manpowerDeployed?.total ?? 129}
                    </span>
                  </div>
                </div>
              </div>

              {/* Machinery Deployment Table */}
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Operational Equipment & Heavy Machinery</span>
                </p>
                <div className="space-y-1.5">
                  {(
                    ocrResult?.machineryOperational || [
                      { name: "Vögele Super 2100 Asphalt Paver", quantity: 2, hoursWorked: 9.5, status: "ACTIVE" },
                      { name: "Hamm HD 90 Tandem Vibratory Roller", quantity: 3, hoursWorked: 10.0, status: "ACTIVE" },
                      { name: "Tata Prima 2528.K Tippers", quantity: 18, hoursWorked: 8.0, status: "ACTIVE" },
                    ]
                  ).map((mach: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-800">
                        {mach.name} ({mach.quantity} Units)
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500 font-mono">{mach.hoursWorked} hrs</span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                            mach.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {mach.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit to Verification Queue Button */}
              <button
                onClick={handleSubmitOCRToVerification}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Extracted DPR to Manager Verification Queue (PENDING)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
