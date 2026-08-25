import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ProjectTimelineGantt } from "../timeline/ProjectTimelineGantt";
import {
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Camera,
  Layers,
  MapPin,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  GanttChartSquare,
  BarChart3,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const ProjectDetailView: React.FC = () => {
  const { projects, selectedProjectId, setActiveView, alerts, siteCaptures } = useApp();
  const [activeTab, setActiveTab] = useState<"timeline" | "work_packages" | "milestones" | "captures" | "alerts">("timeline");

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  if (!project) {
    return <div className="p-8 text-center text-slate-500">Project not found</div>;
  }

  const projectAlerts = alerts.filter((a) => a.projectId === project.id);
  const projectCaptures = siteCaptures.filter((c) => c.projectId === project.id);
  const deviation = Number((project.actualProgress - project.plannedProgress).toFixed(1));

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {/* Back Navigation and Main Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveView("projects")}
          className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Projects / {project.code}
        </span>
      </div>

      {/* Main Project Dossier Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                {project.sector}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {project.code}</span>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  project.status === "ON_TRACK"
                    ? "bg-emerald-100 text-emerald-800"
                    : project.status === "MODERATE_RISK"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {project.status.replace("_", " ")}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{project.name}</h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{project.location}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveView("ai-vision")}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Analyze Site Photo</span>
            </button>
            <button
              onClick={() => setActiveView("analytics")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              <span>S-Curve Analytics</span>
            </button>
          </div>
        </div>

        {/* 4 Vibrant Metric KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-xs font-bold text-blue-700 uppercase">Planned Progress</p>
            <p className="text-3xl font-black text-blue-950">{project.plannedProgress}%</p>
            <p className="text-[11px] text-blue-600 mt-0.5">Target Baseline</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-xs font-bold text-emerald-700 uppercase">Actual Progress</p>
            <p className="text-3xl font-black text-emerald-950">{project.actualProgress}%</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Verified on-site</p>
          </div>

          <div
            className={`${
              deviation < -10 ? "bg-rose-50 border-rose-100 text-rose-950" : "bg-emerald-50 border-emerald-100 text-emerald-950"
            } p-4 rounded-2xl border`}
          >
            <p className="text-xs font-bold uppercase">Schedule Deviation</p>
            <p className="text-3xl font-black">{deviation > 0 ? `+${deviation}%` : `${deviation}%`}</p>
            <p className="text-[11px] mt-0.5">{deviation < 0 ? "Lagging schedule" : "On schedule"}</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <p className="text-xs font-bold text-amber-700 uppercase">Est. Delay Prediction</p>
            <p className="text-3xl font-black text-amber-950">
              {project.predictedDelayDays} <span className="text-base font-bold">Days</span>
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">SIH AI Model Risk Score: {project.riskScore}/100</p>
          </div>
        </div>

        {/* Stakeholder & Financial Overview Pill */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Client Authority</span>
            <span className="font-bold text-slate-800">{project.client}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Executing EPC Contractor</span>
            <span className="font-bold text-slate-800">{project.contractor}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Budget (Spent / Total)</span>
            <span className="font-bold text-slate-800">
              ₹{project.budgetSpentCr} Cr / ₹{project.budgetTotalCr} Cr (
              {Math.round((project.budgetSpentCr / project.budgetTotalCr) * 100)}%)
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Target Completion</span>
            <span className="font-bold text-slate-800">{project.targetCompletionDate}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer ${
            activeTab === "timeline"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Project Timeline & Gantt ({project.timelineTasks?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("work_packages")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === "work_packages"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Work Packages ({project.workPackages.length})
        </button>

        <button
          onClick={() => setActiveTab("milestones")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === "milestones"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Milestones ({project.milestones.length})
        </button>

        <button
          onClick={() => setActiveTab("captures")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === "captures"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          AI Vision Captures ({projectCaptures.length})
        </button>

        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === "alerts"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Risk Alerts ({projectAlerts.length})
        </button>
      </div>

      {/* Tab 0: Project Timeline Gantt */}
      {activeTab === "timeline" && (
        <ProjectTimelineGantt project={project} />
      )}

      {/* Tab 1: Work Packages Breakdown */}
      {activeTab === "work_packages" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-900 text-base mb-2">Work Packages Detailed Audit</h3>

          <div className="space-y-4">
            {project.workPackages.map((wp) => {
              const diff = wp.actual - wp.planned;
              return (
                <div key={wp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{wp.name}</span>
                      <span className="ml-2 text-[10px] font-semibold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        Weightage: {wp.weightage}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <span>Planned: <strong>{wp.planned}%</strong></span>
                      <span>Actual: <strong className="text-blue-700">{wp.actual}%</strong></span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          diff < -10
                            ? "bg-rose-100 text-rose-800"
                            : diff < 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {diff > 0 ? `+${diff}%` : `${diff}%`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${wp.planned}%` }}></div>
                    </div>
                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          diff < -10 ? "bg-rose-500" : diff < 0 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${wp.actual}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Milestones */}
      {activeTab === "milestones" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 text-base mb-4">Milestone Schedule & Delivery Status</h3>

          <div className="space-y-3">
            {project.milestones.map((m, idx) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center text-slate-700">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{m.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Target: {m.targetDate} {m.completedDate ? `• Completed on ${m.completedDate}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      m.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : m.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : m.status === "DELAYED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {m.status.replace("_", " ")}
                  </span>
                  <span className="text-xs font-black text-slate-700">{m.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Site Captures */}
      {activeTab === "captures" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">AI Vision Drone & Field Photo Captures</h3>
            <button
              onClick={() => setActiveView("ai-vision")}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center space-x-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload New Capture</span>
            </button>
          </div>

          {projectCaptures.length === 0 ? (
            <div className="text-center p-8 text-slate-400">
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No AI image scans performed for this project yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectCaptures.map((cap) => (
                <div key={cap.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="aspect-video rounded-xl overflow-hidden mb-2 bg-slate-900">
                    <img src={cap.imageUrl} alt={cap.stageDetected} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">{cap.stageDetected}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Progress: <strong className="text-blue-700">{cap.detectedProgress}%</strong></span>
                    <span>Confidence: <strong>{cap.confidenceScore}%</strong></span>
                    <span>Delay: <strong className="text-amber-700">{cap.predictedDelayDays}d</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Alerts */}
      {activeTab === "alerts" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-bold text-slate-900 text-base mb-2">Active Site Alerts & AI Mitigations</h3>
          {projectAlerts.length === 0 ? (
            <div className="text-center p-8 text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-xs">No active risk alerts for this project corridor.</p>
            </div>
          ) : (
            projectAlerts.map((alt) => (
              <div key={alt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-slate-900">{alt.title}</p>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {alt.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{alt.description}</p>
                <div className="mt-2 p-2.5 bg-blue-50/70 rounded-xl text-xs text-blue-900 font-medium">
                  <strong>AI Action:</strong> {alt.aiSuggestedAction}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
