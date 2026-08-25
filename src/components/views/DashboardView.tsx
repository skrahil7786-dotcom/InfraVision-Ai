import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { LinearChainageStripChart } from "../common/LinearChainageStripChart";
import { DroneComparisonSlider } from "../common/DroneComparisonSlider";
import { InnovationBenchmarkCard } from "../common/InnovationBenchmarkCard";
import {
  TrendingUp,
  Clock,
  AlertOctagon,
  Camera,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  MapPin,
  Flame,
  ClipboardCheck,
  Info,
  Activity,
  Award,
  Database,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const DashboardView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    alerts,
    sCurveData,
    setActiveView,
    currentUser,
    openWbsDrawer,
    pendingFieldUpdatesCount,
  } = useApp();

  const [dashboardTab, setDashboardTab] = useState<
    "OVERVIEW" | "LINEAR_STRIP" | "DRONE_PHOTOGRAMMETRY" | "INNOVATION_BENCHMARK"
  >("OVERVIEW");

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  if (!activeProject) {
    return <div className="p-8 text-center text-slate-500">Loading project telemetry...</div>;
  }

  const deviation = Number((activeProject.actualProgress - activeProject.plannedProgress).toFixed(1));
  const openAlerts = alerts.filter((a) => a.projectId === activeProject.id && a.status === "OPEN");
  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL" && a.status === "OPEN");

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50">
      {/* Pending Verification Notice Banner */}
      {pendingFieldUpdatesCount > 0 && (
        <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-800 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/40 shrink-0">
              <ClipboardCheck className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Manager Verification Queue</span>
                <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {pendingFieldUpdatesCount} Pending Review
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                New field logs and drone surveys require supervisory verification before updating official milestones.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView("verification-queue")}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Review & Verify Updates</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner: Active Project Highlights & Quick Stats */}
      <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center space-x-2.5 mb-1 flex-wrap gap-y-1">
              <span className="text-[11px] text-blue-700 font-semibold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {activeProject.sector}
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {activeProject.code}</span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-600 flex items-center space-x-1 font-normal">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeProject.location}</span>
              </span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">{activeProject.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Executing Agency: <span className="font-medium text-slate-700">{activeProject.contractor}</span> &nbsp;|&nbsp; Client:{" "}
              <span className="font-medium text-slate-700">{activeProject.client}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              id="btn-quick-verify"
              onClick={() => setActiveView("verification-queue")}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Verification Queue</span>
            </button>
            <button
              id="btn-quick-ai-scan"
              onClick={() => setActiveView("ai-vision")}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <span>Capture Photo</span>
            </button>
            <button
              id="btn-quick-view-analytics"
              onClick={() => setActiveView("analytics")}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>S-Curve Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* 4 Crisp Enterprise Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-slate-50 border border-slate-200/90 p-3.5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Planned Baseline</p>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{activeProject.plannedProgress}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Target Schedule Baseline</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 p-3.5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actual Progress</p>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{activeProject.actualProgress}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Verified Ground Truth</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 p-3.5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Schedule Variance</p>
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p
              className={`text-2xl font-bold ${
                deviation < -10 ? "text-rose-600" : deviation < 0 ? "text-amber-600" : "text-emerald-700"
              }`}
            >
              {deviation > 0 ? `+${deviation}%` : `${deviation}%`}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {deviation < -10 ? "Critical schedule lag" : deviation < 0 ? "Minor delay buffer" : "Ahead of schedule"}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 p-3.5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Delay Projection</p>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {activeProject.predictedDelayDays} <span className="text-sm font-medium text-slate-500">Days</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Forecast Horizon</p>
          </div>
        </div>

        {/* View Mode Switcher Pill Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setDashboardTab("OVERVIEW")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                dashboardTab === "OVERVIEW"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Executive S-Curve</span>
            </button>

            <button
              onClick={() => setDashboardTab("LINEAR_STRIP")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                dashboardTab === "LINEAR_STRIP"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>BIM Linear Chainage Strip</span>
            </button>

            <button
              onClick={() => setDashboardTab("DRONE_PHOTOGRAMMETRY")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                dashboardTab === "DRONE_PHOTOGRAMMETRY"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <span>Drone Photogrammetry</span>
            </button>

            <button
              id="btn-tab-innovation-benchmark"
              onClick={() => setDashboardTab("INNOVATION_BENCHMARK")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                dashboardTab === "INNOVATION_BENCHMARK"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>P6 / BIM Comparison</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-normal">
            Corridor: <span className="font-semibold text-slate-800">{activeProject.name}</span>
          </div>
        </div>
      </div>

      {/* Conditionally Render Selected Dashboard Tab */}
      {dashboardTab === "INNOVATION_BENCHMARK" && (
        <div className="space-y-4">
          <InnovationBenchmarkCard />
        </div>
      )}

      {dashboardTab === "LINEAR_STRIP" && (
        <div className="space-y-4">
          <LinearChainageStripChart />
        </div>
      )}

      {dashboardTab === "DRONE_PHOTOGRAMMETRY" && (
        <div className="space-y-4">
          <DroneComparisonSlider />
        </div>
      )}

      {dashboardTab === "OVERVIEW" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: S-Curve Trend & Recent AI Vision Capture */}
        <div className="lg:col-span-8 space-y-6">
          {/* S-Curve Timeline Comparison Chart */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Progress Trajectory (Planned vs. Verified Actual)</h4>
                <p className="text-xs text-slate-500">Cumulative physical completion S-Curve timeline</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1.5 text-slate-600 font-medium">
                  <span className="w-3 h-1 bg-blue-600 rounded"></span>
                  <span>Planned Baseline</span>
                </span>
                <span className="flex items-center space-x-1.5 text-slate-600 font-medium">
                  <span className="w-3 h-1 bg-emerald-600 rounded"></span>
                  <span>Actual Verified</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} domain={[0, 100]} unit="%" axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(val: number) => [`${val}%`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="planned"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#plannedGradient)"
                    name="Planned Baseline"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#actualGradient)"
                    name="Actual Verified"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-slate-700">Project Telemetry:</span>
                <span>Variance: {deviation}%, Projected Delay: {activeProject.predictedDelayDays} Days</span>
              </div>
              <button
                onClick={() => setActiveView("analytics")}
                className="text-blue-600 font-medium hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Detailed S-Curve Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Work Packages Progress Breakdown */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Key Work Packages Breakdown</h4>
                <p className="text-xs text-slate-500">Physical completion vs Planned weightage per component</p>
              </div>
              <button
                onClick={() => setActiveView("projects")}
                className="text-xs text-blue-600 font-medium hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Manage Packages</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeProject.workPackages.map((wp) => {
                const diff = wp.actual - wp.planned;
                return (
                  <div
                    key={wp.id}
                    onClick={() => openWbsDrawer("tt-101", activeProject.id)}
                    className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                          {wp.name}
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                        </span>
                        <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          Weight: {wp.weightage}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-slate-500">Planned: <strong className="text-slate-700">{wp.planned}%</strong></span>
                        <span className="text-slate-500">Actual: <strong className="text-blue-700 font-semibold">{wp.actual}%</strong></span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            diff < -10
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : diff < 0
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {diff > 0 ? `+${diff}%` : `${diff}%`}
                        </span>
                      </div>
                    </div>

                    {/* Dual Progress Bars */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-slate-400 h-full rounded-full" style={{ width: `${wp.planned}%` }}></div>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            diff < -10 ? "bg-rose-500" : diff < 0 ? "bg-amber-500" : "bg-emerald-600"
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
        </div>

        {/* Right Column: High-Priority Alerts & AI Site Inspection */}
        <div className="lg:col-span-4 space-y-5">
          {/* Risk Alerts Panel */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <h4 className="font-semibold text-slate-900 text-sm">Active Risk Alerts</h4>
              </div>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-semibold">
                {openAlerts.length} OPEN
              </span>
            </div>

            <div className="space-y-2.5">
              {openAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-slate-900">{alert.title}</p>
                    <span className="text-[10px] font-mono text-slate-500">{alert.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{alert.description}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-amber-700">Mitigation available</span>
                    <button
                      onClick={() => setActiveView("alerts")}
                      className="text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveView("alerts")}
              className="w-full mt-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>View All Risk Alerts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Vision Site Photo Snapshot */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Ground Inspection</span>
              </h4>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                CV Stage Scan
              </span>
            </div>

            <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden mb-3 border border-slate-200 group">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80"
                alt="Site Inspection"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-slate-950/40">
                <span className="text-[11px] font-semibold uppercase bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm mb-1">
                  Stage: {activeProject.currentStage}
                </span>
                <span className="text-[11px] text-slate-200 font-mono">Confidence: 94.6% • Equipment Tagged</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Detected Machinery:</span>
                <span className="font-medium text-slate-800">Sensor Paver, Tandem Roller</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Safety & PPE:</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded text-[10px]">
                  96% Compliant
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveView("ai-vision")}
              className="w-full mt-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-slate-300" />
              <span>Launch Image AI Diagnostics</span>
            </button>
          </div>

          {/* Recent Site Activity Feed */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Field Activity Log</h4>
            <div className="space-y-3">
              <div className="flex space-x-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Daily Progress Report (DPR) Auto-Parsed</p>
                  <p className="text-[10px] text-slate-500 uppercase">Km 132+400 • OCR Extracted 129 Workers</p>
                </div>
              </div>

              <div className="flex space-x-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">AI Vision Calibration Verified</p>
                  <p className="text-[10px] text-slate-500 uppercase">Pier Cap P-104 • 65% Actual Confirmed</p>
                </div>
              </div>

              <div className="flex space-x-2.5">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Compaction Density Notice Issued</p>
                  <p className="text-[10px] text-slate-500 uppercase">Subgrade Layer 3 • QC Re-test Ordered</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveView("reports")}
              className="w-full mt-3 py-1.5 border border-slate-200 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              View Full Audit Trail
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
