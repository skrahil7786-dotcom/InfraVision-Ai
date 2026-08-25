import React from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  Building2,
  Camera,
  LineChart,
  AlertTriangle,
  MapPin,
  FileText,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
  Bell,
  Calendar,
  ClipboardCheck,
  History,
  LogOut,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, logout, alerts, projects, unreadNotificationsCount, pendingFieldUpdatesCount } = useApp();

  const openAlertsCount = alerts.filter(a => a.status === "OPEN").length;

  const navItems = [
    { id: "prototype", label: "SIH26122 Core Prototype", icon: LayoutDashboard, badge: "Simple", badgeColor: "bg-emerald-500 text-white" },
    { id: "dashboard", label: "Executive Dashboard", icon: Layers, badge: null },
    { id: "verification-queue", label: "Verification Queue", icon: ClipboardCheck, badge: pendingFieldUpdatesCount > 0 ? `${pendingFieldUpdatesCount}` : null, badgeColor: "bg-blue-500 text-white" },
    { id: "projects", label: "All Projects", icon: Building2, badge: projects.length },
    { id: "ai-vision", label: "AI Vision & Upload", icon: Camera, badge: "AI", highlight: true },
    { id: "analytics", label: "S-Curve Analytics", icon: LineChart, badge: null },
    { id: "map", label: "Geospatial Map", icon: MapPin, badge: null },
    { id: "alerts", label: "Risk & Alerts", icon: AlertTriangle, badge: openAlertsCount > 0 ? `${openAlertsCount}` : null, badgeColor: "bg-rose-500 text-white" },
    { id: "notifications", label: "Notification Center", icon: Bell, badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : null, badgeColor: "bg-rose-500 text-white" },
    { id: "reports", label: "OCR & Reports", icon: FileText, badge: "OCR" },
    { id: "audit-trail", label: "Audit & Governance", icon: History, badge: "Gov" },
    { id: "admin", label: "System Architecture", icon: ShieldCheck, badge: "SIH" },
  ];

  return (
    <aside id="app-sidebar" className="w-64 bg-slate-900 flex flex-col h-screen shrink-0 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <div 
          onClick={() => setActiveView("landing")}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-500 transition-colors">
            <span className="text-white font-black text-lg tracking-wider">I</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-white font-semibold text-sm tracking-tight">InfraVision</span>
              <span className="bg-blue-900/60 text-blue-300 border border-blue-700/50 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">Enterprise</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">Smart Highway Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1.5 pt-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || (isActive ? "bg-blue-700 text-white" : "bg-slate-800 text-slate-300 border border-slate-700")
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 px-3 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Overview
        </div>

        <button
          id="nav-landing"
          onClick={() => setActiveView("landing")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeView === "landing"
              ? "bg-blue-600 text-white font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-800/70"
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Executive Briefing</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          id="nav-logout"
          onClick={logout}
          className="w-full flex items-center justify-between px-3 py-2 mt-1 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-all cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out Session</span>
          </div>
        </button>
      </nav>

      {/* Cloud Service Live Status Card */}
      <div className="p-3 m-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Telemetry Engine</p>
          <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800">ONLINE</span>
        </div>
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-medium">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="truncate">Computer Vision & OCR Online</span>
        </div>
      </div>
    </aside>
  );
};
