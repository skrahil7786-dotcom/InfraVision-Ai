import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { AuditLog } from "../../types";
import {
  History,
  Shield,
  Search,
  Filter,
  Download,
  Calendar,
  UserCheck,
  CheckCircle2,
  XCircle,
  Edit3,
  AlertOctagon,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";

export const AuditTrailView: React.FC = () => {
  const { auditLogs, projects, refreshData } = useApp();
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (projectFilter !== "ALL" && log.projectId !== projectFilter) return false;
      if (actionFilter !== "ALL" && log.action !== actionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          log.action.toLowerCase().includes(q) ||
          log.user.toLowerCase().includes(q) ||
          log.reason.toLowerCase().includes(q) ||
          log.entityId.toLowerCase().includes(q) ||
          log.projectName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [auditLogs, projectFilter, actionFilter, searchQuery]);

  const handleExportCSV = () => {
    const headers = ["ID", "Timestamp", "Project", "Entity Type", "Entity ID", "User", "Role", "Action", "Reason", "Diff"];
    const rows = filteredLogs.map((l) => [
      l.id,
      new Date(l.timestamp).toISOString(),
      `"${l.projectName.replace(/"/g, '""')}"`,
      l.entityType,
      l.entityId,
      `"${l.user}"`,
      l.userRole,
      l.action,
      `"${l.reason.replace(/"/g, '""')}"`,
      l.diff ? `"${JSON.stringify(l.diff).replace(/"/g, '""')}"` : '""',
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `infravision_audit_trail_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "VERIFIED":
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED</span>;
      case "REJECTED":
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3 text-rose-600" /> REJECTED</span>;
      case "EDITED":
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><Edit3 className="w-3 h-3 text-blue-600" /> EDITED</span>;
      case "SUBMITTED":
        return <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><History className="w-3 h-3" /> SUBMITTED</span>;
      case "ALERT_RESOLVED":
      case "RESOLVED":
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-purple-600" /> RESOLVED</span>;
      case "ALERT_ESCALATED":
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><AlertOctagon className="w-3 h-3 text-amber-600" /> ESCALATED</span>;
      case "DEMO_RESET":
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><RefreshCw className="w-3 h-3 text-indigo-600" /> DB RESET</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-xs font-bold">{action}</span>;
    }
  };

  return (
    <div id="audit-trail-view" className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-sm">
                <History className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Audit & Governance Trail</h1>
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200">
                {auditLogs.length} Total Immutable Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tamper-evident chronological log of every field submission, manager sign-off, deviation recalculation, and dispute resolution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshData()}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              id="export-audit-csv-btn"
              onClick={handleExportCSV}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Audit CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Recorded Actions</option>
              <option value="VERIFIED">VERIFIED (Manager Sign-off)</option>
              <option value="REJECTED">REJECTED (Disapproved)</option>
              <option value="EDITED">EDITED (Quantity/Date correction)</option>
              <option value="SUBMITTED">SUBMITTED (Field Ingestion)</option>
              <option value="ALERT_RESOLVED">ALERT_RESOLVED</option>
              <option value="ALERT_ESCALATED">ALERT_ESCALATED</option>
              <option value="DEMO_RESET">DEMO_RESET</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Search Logs</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, reason, entity ID..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Actor / Role</th>
                  <th className="py-3 px-4">Reason / Details</th>
                  <th className="py-3 px-4">Values & Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No audit events matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {new Date(log.timestamp).toLocaleString([], {
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-semibold text-slate-900">
                        {log.projectName}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-200">
                          {log.entityType}:{log.entityId}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <div>
                            <span className="font-semibold text-slate-900 block">{log.user}</span>
                            <span className="text-[10px] text-slate-400">{log.userRole}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate text-slate-700" title={log.reason}>
                        {log.reason}
                      </td>

                      <td className="py-3 px-4 text-[11px]">
                        {log.diff ? (
                          <div className="font-mono text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200 max-w-xs overflow-x-auto">
                            {log.diff.oldValue !== undefined && log.diff.newValue !== undefined ? (
                              <span>
                                <span className="text-rose-600 line-through mr-1">{JSON.stringify(log.diff.oldValue)}</span>
                                <span className="text-emerald-600 font-bold">→ {JSON.stringify(log.diff.newValue)}</span>
                              </span>
                            ) : (
                              <span>{JSON.stringify(log.diff)}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No value change</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
