import React from "react";
import { useApp } from "../../context/AppContext";
import { Users, Eye, ShieldCheck, Activity } from "lucide-react";

export const LivePresenceBar: React.FC = () => {
  const { collaborators, currentUser } = useApp();

  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-2 flex items-center justify-between text-xs transition-all">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-slate-500 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-700">
            Live Multi-Stakeholder Sync
          </span>
        </div>
        <span className="hidden sm:inline-block text-slate-300">|</span>
        <span className="hidden sm:inline-block text-[11px] text-slate-500">
          Connected authorities reviewing site telemetry:
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {/* Avatar Stack */}
        <div className="flex items-center -space-x-2 overflow-hidden">
          {collaborators.map((collab) => (
            <div
              key={collab.id}
              className="relative group cursor-pointer"
              title={`${collab.name} (${collab.role}) - ${collab.activeSection}`}
            >
              <img
                src={collab.avatar}
                alt={collab.name}
                className="w-6 h-6 rounded-full ring-2 ring-white object-cover shadow-xs"
                style={{ borderColor: collab.color }}
              />
              <span
                className="absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white"
                style={{ backgroundColor: collab.color }}
              ></span>

              {/* Tooltip on hover */}
              <div className="absolute right-0 bottom-8 hidden group-hover:flex flex-col bg-slate-900 text-white text-[10px] rounded-xl p-2 shadow-xl whitespace-nowrap z-50 pointer-events-none">
                <span className="font-bold">{collab.name}</span>
                <span className="text-slate-300">{collab.role} • {collab.agency}</span>
                <span className="text-blue-300 mt-0.5">Active in: {collab.activeSection}</span>
              </div>
            </div>
          ))}
        </div>

        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
          {collaborators.length} active
        </span>
      </div>
    </div>
  );
};
