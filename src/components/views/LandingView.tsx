import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  ShieldCheck,
  Camera,
  LineChart,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Building2,
  ChevronRight,
} from "lucide-react";

export const LandingView: React.FC = () => {
  const { setActiveView, projects, alerts } = useApp();

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {/* Enterprise Overview Hero */}
      <div className="bg-slate-900 text-white rounded-xl p-8 shadow-2xs relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-3">
            <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
              Smart Infrastructure Intelligence
            </span>
            <span className="text-slate-400 text-xs font-mono">Platform Release v2.4</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight leading-tight mb-3">
            Intelligent Ground Truth Capture & Automated Progress Telemetry
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Enterprise computer vision pipeline for highway corridors and mega projects. Ingests drone surveys, photogrammetry, and OCR daily progress reports to verify construction milestones and forecast schedule variance.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView("dashboard")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg shadow-2xs flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Launch Corridor Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView("ai-vision")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-blue-400" />
              <span>Inspect AI Vision Ground Scanner</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-3.5 text-blue-700">
            <Camera className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">1. Multimodal AI Computer Vision</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminates inaccurate manual logbooks by visually detecting construction stages (subgrade, rebar, pier caps, DBM asphalt) and PPE compliance with &gt;94% confidence.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3.5 text-emerald-700">
            <LineChart className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">2. S-Curve Predictive Delay Engine</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Continuously compares actual work completed vs planned baseline schedules. Instantly calculates delay days, budget burn-rate, and risk severity indexes.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3.5 text-indigo-700">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">3. OCR Document Intelligence</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Auto-extracts manpower, equipment runtime, materials consumed, and ground hindrances from scanned Daily Progress Reports (DPRs) and inspection notices.
          </p>
        </div>
      </div>

      {/* Active Monitored Corridors */}
      <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Active Monitored Corridors</h3>
            <p className="text-xs text-slate-500">Live telemetry feeds from EPC contractors and authorities</p>
          </div>
          <button
            onClick={() => setActiveView("map")}
            className="text-xs font-medium text-blue-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Geospatial GIS Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setActiveView("dashboard")}
              className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-colors"
            >
              <span className="text-[10px] font-semibold uppercase text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{proj.sector}</span>
              <h4 className="text-xs font-semibold text-slate-900 mt-1.5 line-clamp-1">{proj.name}</h4>
              <div className="flex justify-between items-center mt-2.5 text-xs">
                <span className="text-slate-500">Actual: <strong className="text-emerald-700">{proj.actualProgress}%</strong></span>
                <span className="text-slate-500">Delay: <strong className="text-amber-700">{proj.predictedDelayDays}d</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
