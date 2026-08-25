import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Project } from "../../types";
import {
  Building2,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";

interface ProjectsViewProps {
  onOpenNewProject: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenNewProject }) => {
  const { projects, setSelectedProjectId, setActiveView } = useApp();
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sectors = ["ALL", "Highways & Expressways", "Metro Rail & Bridges", "Smart City & Urban", "Water & Ports"];
  const statuses = ["ALL", "ON_TRACK", "MODERATE_RISK", "DELAYED", "CRITICAL"];

  const filteredProjects = projects.filter((p) => {
    const matchesSector = selectedSector === "ALL" || p.sector === selectedSector;
    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contractor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status?: Project["status"] | string) => {
    switch (status) {
      case "ON_TRACK":
        return { label: "On Track", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "MODERATE_RISK":
        return { label: "Moderate Risk", bg: "bg-amber-100 text-amber-800 border-amber-200" };
      case "DELAYED":
        return { label: "Delayed", bg: "bg-rose-100 text-rose-800 border-rose-200" };
      case "CRITICAL":
        return { label: "Critical Stoppage", bg: "bg-red-600 text-white border-red-700" };
      default:
        return { label: "Active", bg: "bg-slate-100 text-slate-800 border-slate-200" };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">National Infrastructure Portfolio</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time AI monitoring of mega infrastructure projects across India ({filteredProjects.length} active sites)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="btn-register-project"
            onClick={onOpenNewProject}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Project Corridor</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project name, code, city, contractor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Sector and Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-2 cursor-pointer"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-2 cursor-pointer"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const deviation = Number((project.actualProgress - project.plannedProgress).toFixed(1));
          const badge = getStatusBadge(project.status);

          return (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                        {project.code}
                      </span>
                      <span className="text-xs text-blue-600 font-semibold">{project.sector}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">{project.name}</h3>
                  </div>

                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                <p className="text-xs text-slate-500 flex items-center space-x-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{project.location}</span>
                </p>

                {/* Progress Indicators */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-3 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Planned Target:</span>{" "}
                      <strong className="text-blue-900 font-black">{project.plannedProgress}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Actual Verified:</span>{" "}
                      <strong className="text-emerald-900 font-black">{project.actualProgress}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Deviation:</span>{" "}
                      <strong
                        className={`font-black ${
                          deviation < -10 ? "text-rose-700" : deviation < 0 ? "text-amber-700" : "text-emerald-700"
                        }`}
                      >
                        {deviation > 0 ? `+${deviation}%` : `${deviation}%`}
                      </strong>
                    </div>
                  </div>

                  {/* Dual Bar Progress */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${project.plannedProgress}%` }}></div>
                    </div>
                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          deviation < -10 ? "bg-rose-500" : deviation < 0 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${project.actualProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Est. Delay: <strong className="text-amber-900">{project.predictedDelayDays} Days</strong></span>
                    <span>Health Index: <strong className="text-blue-700">{project.healthIndex}/100</strong></span>
                    <span>Budget: <strong>₹{project.budgetTotalCr} Cr</strong></span>
                  </div>
                </div>

                {/* Sub-details */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-4">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Executing Contractor</span>
                    <span className="font-bold text-slate-800 truncate block">{project.contractor}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Active Stage</span>
                    <span className="font-bold text-slate-800 truncate block">{project.currentStage}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveView("project-detail");
                  }}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Project Deep Dive</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveView("ai-vision");
                  }}
                  className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Upload & Analyze Site Photo"
                >
                  <span>AI Scan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
