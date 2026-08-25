import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { SAMPLE_USERS } from "../data/seedData";
import { UserRole } from "../types";
import { WeatherRiskSimulationModal } from "./common/WeatherRiskSimulationModal";
import { JudgeDemoWalkthroughModal } from "./common/JudgeDemoWalkthroughModal";
import { OfflineSyncStatusBadge } from "./common/OfflineSyncStatusBadge";
import { CompetitorBenchmarkModal } from "./common/CompetitorBenchmarkModal";
import {
  Bell,
  RefreshCw,
  ChevronDown,
  Building,
  UserCheck,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  LogOut,
  RotateCcw,
  CloudRain,
  Award,
  Layers,
  Database,
} from "lucide-react";

interface HeaderProps {
  onOpenNewProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewProject }) => {
  const {
    currentUser,
    switchRole,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    refreshData,
    resetDatabase,
    logout,
    isLoading,
    alerts,
    notifications,
    unreadNotificationsCount,
    setActiveView,
    activeView,
    setIsChatDrawerOpen,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isJudgeDemoModalOpen, setIsJudgeDemoModalOpen] = useState(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const openAlerts = alerts.filter((a) => a.status === "OPEN");

  const getRoleBadge = (role?: UserRole | string) => {
    switch (role) {
      case "SITE_ENGINEER":
        return { label: "Site Engineer", color: "bg-blue-100 text-blue-700 border-blue-200" };
      case "PROJECT_MANAGER":
        return { label: "Project Manager", color: "bg-purple-100 text-purple-700 border-purple-200" };
      case "GOVERNMENT_INSPECTOR":
        return { label: "Govt Inspector (NITI Aayog)", color: "bg-amber-100 text-amber-800 border-amber-200" };
      case "CONTRACTOR_ADMIN":
        return { label: "Contractor Lead (L&T)", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      default:
        return { label: "Project Engineer", color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  const currentRoleBadge = getRoleBadge(currentUser?.role);

  const handleResetDb = async () => {
    if (window.confirm("Reset all project metrics, captures, and alerts back to pristine Smart India Hackathon seed state?")) {
      setIsResetting(true);
      try {
        await resetDatabase();
      } finally {
        setIsResetting(false);
        setRoleDropdownOpen(false);
      }
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0 z-20 shadow-2xs">
      {/* Left section: Active Site Selector & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button
            id="btn-project-selector"
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-300/80 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer"
          >
            <Building className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="max-w-[220px] truncate">
              <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Highway Corridor</p>
              <p className="text-xs font-semibold text-slate-900 truncate">
                {selectedProject ? selectedProject.name : "Select Project"}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500 tracking-wider flex justify-between items-center">
                <span>Select Corridor Project</span>
                <span className="text-blue-600 font-semibold">{projects.length} Total</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setProjectDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-start space-x-2.5 transition-colors cursor-pointer ${
                      selectedProjectId === p.id ? "bg-blue-50/70 text-blue-900 font-semibold" : "text-slate-700"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-blue-600"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{p.name}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                        <span>{p.code}</span>
                        <span>•</span>
                        <span className="font-medium text-blue-600">Actual: {p.actualProgress}%</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    onOpenNewProject();
                  }}
                  className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Register New Infrastructure Project</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedProject && (
          <div className="hidden md:flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded font-mono border border-slate-200">
              {selectedProject.code}
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider ${
                selectedProject.status === "ON_TRACK"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : selectedProject.status === "MODERATE_RISK"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {selectedProject.status.replace("_", " ")}
            </span>
          </div>
        )}
      </div>

      {/* Right section: Clean Google/Microsoft Controls */}
      <div className="flex items-center space-x-2">
        {/* Real Service Worker & IndexedDB Offline Sync Status Indicator */}
        <OfflineSyncStatusBadge />

        {/* Quick Switch to Simple Prototype */}
        <button
          onClick={() => setActiveView("prototype")}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeView === "prototype" 
              ? "bg-[#0d1830] text-emerald-400 border border-slate-700 shadow-2xs" 
              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
          }`}
          title="Switch to Simple SIH26122 Prototype"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Simple Prototype</span>
        </button>

        {/* 5-Minute Guided Pitch Tour */}
        <button
          id="btn-judge-demo"
          onClick={() => setIsJudgeDemoModalOpen(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
          title="Open Interactive 5-Minute Executive Walkthrough"
        >
          <Award className="w-3.5 h-3.5 text-blue-100" />
          <span className="hidden sm:inline">Executive Tour</span>
        </button>

        {/* Sync Button */}
        <button
          id="btn-sync-data"
          onClick={() => refreshData()}
          disabled={isLoading}
          title="Synchronize telemetry"
          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
        </button>

        {/* AI Assistant */}
        <button
          onClick={() => setIsChatDrawerOpen(true)}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer border border-slate-200 shrink-0"
          title="Open AI Engineering Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI Assistant</span>
        </button>

        {/* Notifications Icon with unread badge */}
        <button
          id="btn-header-alerts"
          onClick={() => setActiveView("notifications")}
          className={`p-1.5 rounded-lg transition-colors relative cursor-pointer ${
            activeView === "notifications" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100 text-slate-600"
          }`}
          title={`${unreadNotificationsCount} Notifications`}
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Account / Role Switcher */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="relative">
            <button
              id="btn-role-switcher"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 hover:bg-slate-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 font-normal">
                  {currentRoleBadge.label}
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-medium flex items-center justify-center text-xs shadow-2xs overflow-hidden">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Role & Account Switcher
                  </p>
                </div>

                <div className="p-1 space-y-0.5">
                  {SAMPLE_USERS.map((usr) => (
                    <button
                      key={usr.id}
                      onClick={() => {
                        switchRole(usr.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left flex items-center space-x-2.5 transition-colors cursor-pointer ${
                        currentUser.role === usr.role
                          ? "bg-blue-50 text-blue-900 font-medium"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <img
                        src={usr.avatarUrl || ""}
                        alt={usr.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium truncate">{usr.name}</p>
                          {currentUser.role === usr.role && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {usr.role.replace("_", " ")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-1 border-t border-slate-100 space-y-0.5">
                  <button
                    type="button"
                    onClick={handleResetDb}
                    disabled={isResetting}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left flex items-center space-x-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset Data State</span>
                  </button>

                  <button
                    id="btn-dropdown-logout"
                    type="button"
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left flex items-center space-x-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weather Simulation Modal */}
      <WeatherRiskSimulationModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
      />

      {/* 5-Min Judge Demo Pitch Runner Modal */}
      <JudgeDemoWalkthroughModal
        isOpen={isJudgeDemoModalOpen}
        onClose={() => setIsJudgeDemoModalOpen(false)}
      />

      {/* SIH Research Gap & Competitor Benchmark Modal */}
      <CompetitorBenchmarkModal
        isOpen={isBenchmarkModalOpen}
        onClose={() => setIsBenchmarkModalOpen(false)}
      />
    </header>
  );
};
