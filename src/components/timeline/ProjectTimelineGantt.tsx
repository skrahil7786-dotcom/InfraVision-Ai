import React, { useState } from "react";
import { Project, TimelineTask } from "../../types";
import { useApp } from "../../context/AppContext";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Zap,
  Filter,
  Sliders,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Save,
  RotateCcw,
} from "lucide-react";

interface ProjectTimelineGanttProps {
  project: Project;
}

export const ProjectTimelineGantt: React.FC<ProjectTimelineGanttProps> = ({ project }) => {
  const { updateTimelineTask } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [criticalOnly, setCriticalOnly] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [activeZoom, setActiveZoom] = useState<"MONTHS" | "WEEKS">("MONTHS");

  const tasks: TimelineTask[] = project.timelineTasks || [];

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (criticalOnly && !task.isCriticalPath) return false;
    if (selectedCategory !== "ALL" && task.category !== selectedCategory) return false;
    return true;
  });

  // Calculate timeline boundaries (start and end date in timestamp)
  const allStartDates = tasks.map((t) => new Date(t.plannedStartDate).getTime());
  const allEndDates = tasks.map((t) => new Date(t.plannedEndDate).getTime());
  const minTime = allStartDates.length ? Math.min(...allStartDates) : new Date(project.startDate).getTime();
  const maxTime = allEndDates.length ? Math.max(...allEndDates) : new Date(project.targetCompletionDate).getTime();
  const totalDurationMs = Math.max(maxTime - minTime, 1);

  // Time ticks for header
  const getTimelineMonths = () => {
    const months = [];
    const curr = new Date(minTime);
    curr.setDate(1);
    const end = new Date(maxTime);
    end.setMonth(end.getMonth() + 1);

    while (curr <= end) {
      months.push(new Date(curr));
      curr.setMonth(curr.getMonth() + (activeZoom === "WEEKS" ? 1 : 2));
    }
    return months;
  };

  const timelineMonths = getTimelineMonths();

  // Helper to get left % and width % on the timeline
  const getPositionStyles = (startDateStr: string, endDateStr: string) => {
    const startMs = new Date(startDateStr).getTime();
    const endMs = new Date(endDateStr).getTime();
    const leftPercent = Math.max(0, Math.min(100, ((startMs - minTime) / totalDurationMs) * 100));
    const widthPercent = Math.max(2, Math.min(100 - leftPercent, ((endMs - startMs) / totalDurationMs) * 100));
    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  // Today marker calculation (Simulated to 2026-08-24 for demo)
  const todayMs = new Date("2026-08-24").getTime();
  const todayPercent = Math.max(0, Math.min(100, ((todayMs - minTime) / totalDurationMs) * 100));

  const startEditTask = (task: TimelineTask) => {
    setEditingTaskId(task.id);
    setEditProgress(task.actualProgress);
    setEditNotes(task.notes || "");
  };

  const saveTaskProgress = async (taskId: string) => {
    setIsUpdating(true);
    try {
      let status: TimelineTask["status"] = "IN_PROGRESS";
      if (editProgress >= 100) status = "COMPLETED";
      else if (editProgress < 30) status = "DELAYED";

      await updateTimelineTask(project.id, taskId, {
        actualProgress: editProgress,
        status,
        notes: editNotes,
      });
      setEditingTaskId(null);
    } finally {
      setIsUpdating(false);
    }
  };

  // Summary counts
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const delayedTasks = tasks.filter((t) => t.status === "DELAYED" || t.status === "CRITICAL_SLIPPAGE").length;
  const criticalTasksCount = tasks.filter((t) => t.isCriticalPath).length;

  return (
    <div className="space-y-6">
      {/* Top Controls & Schedule Variance Summary Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Interactive Schedule Model
              </span>
              <span className="text-xs text-slate-400 font-mono">IRC / MoRTH Compliant</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              Project Schedule & Critical Path Gantt Chart
            </h3>
            <p className="text-xs text-slate-500">
              Visualizing baseline planned vs. AI-verified on-site progress with slippage forecasting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Critical Path Toggle */}
            <button
              onClick={() => setCriticalOnly(!criticalOnly)}
              className={`px-3 py-2 text-xs font-bold rounded-2xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                criticalOnly
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Critical Path Only ({criticalTasksCount})</span>
            </button>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border-none outline-none cursor-pointer"
            >
              <option value="ALL">All WBS Categories</option>
              <option value="PRE_CONSTRUCTION">Pre-Construction & ROW</option>
              <option value="CIVIL_EARTHWORK">Civil & Earthwork</option>
              <option value="STRUCTURES">Bridges & Structures</option>
              <option value="PAVEMENT">Pavement & Wearing Course</option>
              <option value="MEP_SYSTEMS">MEP & Smart ITS</option>
              <option value="COMMISSIONING">Testing & Commissioning</option>
            </select>
          </div>
        </div>

        {/* Schedule Variance Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Total WBS Tasks</span>
            <span className="text-2xl font-black text-slate-900">{tasks.length}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{completedTasks} Completed</span>
          </div>

          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100">
            <span className="text-[11px] font-bold text-rose-700 uppercase block">Slipped / Delayed Tasks</span>
            <span className="text-2xl font-black text-rose-950">{delayedTasks}</span>
            <span className="text-[10px] text-rose-600 block mt-0.5">Requiring resource augmentation</span>
          </div>

          <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
            <span className="text-[11px] font-bold text-blue-700 uppercase block">Critical Path Float</span>
            <span className="text-2xl font-black text-blue-950">
              {project.predictedDelayDays > 0 ? `-${project.predictedDelayDays}d` : "0d Buffer"}
            </span>
            <span className="text-[10px] text-blue-600 block mt-0.5">
              {project.predictedDelayDays > 0 ? "Negative Float (Delayed)" : "Schedule Maintained"}
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-700 uppercase block">Baseline Completion</span>
            <span className="text-base font-black text-emerald-950 block mt-1">
              {project.targetCompletionDate}
            </span>
            <span className="text-[10px] text-emerald-700 block">
              AI Forecast:{" "}
              {new Date(
                new Date(project.targetCompletionDate).getTime() + project.predictedDelayDays * 86400000
              ).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-200 border border-blue-400"></span>
              <span className="text-slate-600 font-medium">Planned Schedule Baseline</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 font-medium">Actual Progress (On-Track / Completed)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-600 font-medium">Moderate Lag</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-600 font-medium">Critical Schedule Slippage</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>Today (Site Inspection Cutoff: Aug 2026)</span>
          </div>
        </div>

        {/* Gantt Header & Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Timeline Scale Header */}
            <div className="grid grid-cols-12 gap-2 pb-3 mb-2 text-xs font-bold text-slate-400 border-b border-slate-100">
              <div className="col-span-5">WBS Work Package & Task Description</div>
              <div className="col-span-7 relative flex justify-between pr-2">
                {timelineMonths.map((m, idx) => (
                  <span key={idx} className="text-[10px] font-mono uppercase">
                    {m.toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
                  </span>
                ))}
              </div>
            </div>

            {/* Task Rows */}
            <div className="space-y-4 relative py-2">
              {/* Today Vertical Line Overlay */}
              <div
                className="absolute top-0 bottom-0 z-10 pointer-events-none"
                style={{ left: `calc(41.666% + (58.333% * ${todayPercent / 100}))` }}
              >
                <div className="w-[2px] h-full bg-rose-500/60 border-l border-dashed border-rose-500"></div>
              </div>

              {filteredTasks.map((task) => {
                const isEditing = editingTaskId === task.id;
                const plannedPos = getPositionStyles(task.plannedStartDate, task.plannedEndDate);
                const actualEnd = task.actualEndDate || project.targetCompletionDate;
                const actualPos = getPositionStyles(task.actualStartDate, actualEnd);

                const isDelayed = task.status === "DELAYED" || task.status === "CRITICAL_SLIPPAGE";

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl transition-all border ${
                      isEditing
                        ? "bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/20"
                        : "bg-slate-50/60 hover:bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-3 items-center">
                      {/* Left Details Column (5 cols) */}
                      <div className="col-span-5 pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                            {task.wbsCode}
                          </span>
                          {task.isCriticalPath && (
                            <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.2 rounded-full uppercase flex items-center space-x-1">
                              <Zap className="w-2.5 h-2.5" />
                              <span>Critical</span>
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                              task.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : task.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-800"
                                : task.status === "CRITICAL_SLIPPAGE"
                                ? "bg-rose-100 text-rose-800 font-extrabold"
                                : task.status === "DELAYED"
                                ? "bg-amber-100 text-amber-800 font-bold"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{task.name}</p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span>
                            Planned: <strong className="text-slate-800">{task.plannedProgress}%</strong>
                          </span>
                          <span>
                            Actual: <strong className="text-blue-700">{task.actualProgress}%</strong>
                          </span>
                          <span
                            className={`font-bold ${
                              task.deviationDays < 0 ? "text-rose-600" : "text-emerald-600"
                            }`}
                          >
                            {task.deviationDays < 0
                              ? `${Math.abs(task.deviationDays)}d lag`
                              : task.deviationDays > 0
                              ? `+${task.deviationDays}d float`
                              : "On target"}
                          </span>
                          <button
                            onClick={() => startEditTask(task)}
                            className="p-1 hover:bg-white rounded text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Update task progress"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>

                        {task.notes && (
                          <p className="text-[10px] text-slate-400 italic mt-0.5 line-clamp-1">
                            Note: {task.notes}
                          </p>
                        )}
                      </div>

                      {/* Right Gantt Bars Column (7 cols) */}
                      <div className="col-span-7 relative h-14 flex flex-col justify-center space-y-1.5 pl-2">
                        {/* 1. Planned Baseline Bar */}
                        <div className="relative h-4 w-full bg-slate-200/50 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 bottom-0 bg-blue-200 border border-blue-400/50 rounded-full flex items-center justify-between px-2 text-[9px] font-bold text-blue-900"
                            style={plannedPos}
                          >
                            <span className="truncate">{task.plannedStartDate}</span>
                            <span className="truncate">{task.plannedEndDate}</span>
                          </div>
                        </div>

                        {/* 2. Actual Progress Overlay Bar */}
                        <div className="relative h-5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 bottom-0 rounded-full flex items-center justify-between px-2 text-[10px] font-black text-white shadow-sm transition-all ${
                              task.status === "COMPLETED"
                                ? "bg-emerald-500"
                                : task.status === "CRITICAL_SLIPPAGE"
                                ? "bg-rose-500"
                                : task.status === "DELAYED"
                                ? "bg-amber-500"
                                : "bg-blue-600"
                            }`}
                            style={actualPos}
                          >
                            <span className="truncate">
                              {task.actualProgress}% ({task.actualStartDate})
                            </span>
                            {task.actualProgress >= 100 ? (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            ) : isDelayed ? (
                              <AlertTriangle className="w-3 h-3 text-white" />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inline Task Progress Edit Drawer */}
                    {isEditing && (
                      <div className="mt-3 pt-3 border-t border-blue-200 bg-white p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-blue-900">
                            Update On-Site Progress for WBS {task.wbsCode}: {task.name}
                          </span>
                          <span className="text-xs font-mono font-bold text-blue-700">
                            Current Value: {editProgress}%
                          </span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editProgress}
                            onChange={(e) => setEditProgress(Number(e.target.value))}
                            className="flex-1 accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editProgress}
                            onChange={(e) => setEditProgress(Math.min(100, Math.max(0, Number(e.target.value))))}
                            className="w-16 p-1.5 text-xs font-bold text-center border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-500 block mb-1">
                            Site Inspection / QC Field Notes
                          </label>
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="e.g., Paving rate slowed by raw material logistics, 4 dumpers active"
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex justify-end space-x-2 pt-1">
                          <button
                            onClick={() => setEditingTaskId(null)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveTaskProgress(task.id)}
                            disabled={isUpdating}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isUpdating ? "Saving..." : "Save Progress & Recalculate"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Slippage & Recovery Schedule Guidelines Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                AI Automated Critical Path Recovery Plan
              </span>
            </div>
            <h4 className="text-lg font-black text-white">
              {project.status === "DELAYED"
                ? `Mitigate ${project.predictedDelayDays} Days Delay on ${project.code}`
                : "Schedule Health Optimal"}
            </h4>
            <p className="text-xs text-blue-200 max-w-2xl">
              {project.status === "DELAYED"
                ? "Dense Bituminous Macadam (DBM) and PQC concrete laying are on the critical path. Augmenting tipper fleet to 22 dumpers and enabling dual-shift lighting can compress schedule duration by 6 days."
                : "All major structure piling and earthwork packages are currently aligned with the approved baseline schedule."}
            </p>
          </div>

          <button
            onClick={() => updateTimelineTask(project.id, tasks[0]?.id || "", {})}
            className="px-4 py-2.5 bg-white text-blue-950 hover:bg-blue-50 font-black text-xs rounded-2xl shadow-lg transition-all shrink-0 cursor-pointer"
          >
            Simulate Schedule Compression
          </button>
        </div>
      </div>
    </div>
  );
};
