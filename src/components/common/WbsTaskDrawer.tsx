import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { TimelineTask, FieldUpdate, DocumentEvidence } from "../../types";
import {
  X,
  CheckCircle2,
  Clock,
  FileText,
  Camera,
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  User,
  Layers,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export const WbsTaskDrawer: React.FC = () => {
  const {
    isWbsDrawerOpen,
    closeWbsDrawer,
    selectedWbsTaskId,
    selectedProjectId,
    projects,
    fieldUpdates,
    evidence,
    queryWbsEvidenceQa,
  } = useApp();

  const [aiQuestion, setAiQuestion] = useState<string>("");
  const [aiAnswer, setAiAnswer] = useState<{ answer: string; citations: string[] } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const activeTask: (TimelineTask & { targetQuantity?: number; completedQuantity?: number; unit?: string; taskWeight?: number; responsibleEngineer?: string }) | undefined =
    activeProject?.timelineTasks?.find((t) => t.id === selectedWbsTaskId) ||
    activeProject?.timelineTasks?.[0];

  const taskUpdates = fieldUpdates.filter(
    (u) => u.projectId === activeProject?.id && (u.wbsTaskId === activeTask?.id || u.wbsCode === activeTask?.wbsCode)
  );

  const taskEvidence = evidence.filter(
    (e) => e.projectId === activeProject?.id && (e.wbsTaskId === activeTask?.id || e.wbsCode === activeTask?.wbsCode)
  );

  const targetQty = activeTask?.targetQuantity || 1000;
  const completedQty = activeTask?.completedQuantity || (targetQty * (activeTask?.actualProgress || 0)) / 100;
  const remainingQty = Math.max(0, targetQty - completedQty);
  const unit = activeTask?.unit || "Units";
  const deviation = (activeTask?.actualProgress || 0) - (activeTask?.plannedProgress || 0);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await queryWbsEvidenceQa(aiQuestion, activeProject?.id, activeTask?.id);
      setAiAnswer(res);
    } catch (err) {
      setAiAnswer({ answer: "Failed to retrieve evidence answers.", citations: [] });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isWbsDrawerOpen || !activeTask) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div
        id="wbs-task-drawer"
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded">
              WBS {activeTask.wbsCode || "1.0"}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">{activeTask.name}</h2>
              <p className="text-xs text-slate-500">{activeProject?.name}</p>
            </div>
          </div>
          <button
            onClick={closeWbsDrawer}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Planned Progress</span>
              <div className="text-lg font-bold text-slate-800 mt-0.5">{activeTask.plannedProgress}%</div>
              <span className="text-[10px] text-slate-500">Baseline Target</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Verified Progress</span>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">{activeTask.actualProgress}%</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Verified Field Work</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Schedule Deviation</span>
              <div className={`text-lg font-bold mt-0.5 flex items-center gap-1 ${deviation < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                {deviation < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                {deviation > 0 ? `+${deviation.toFixed(1)}%` : `${deviation.toFixed(1)}%`}
              </div>
              <span className="text-[10px] text-slate-500">{deviation < 0 ? "Behind Schedule" : "Ahead of Schedule"}</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">WBS Task Weight</span>
              <div className="text-lg font-bold text-blue-700 mt-0.5">{activeTask.taskWeight || 15}%</div>
              <span className="text-[10px] text-slate-500">Overall Project Impact</span>
            </div>
          </div>

          {/* Physical Quantities Progress */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Physical Quantities Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Target Total</span>
                <span className="font-bold text-slate-900 text-sm">
                  {targetQty.toLocaleString()} {unit}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Completed Verified</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {Number(completedQty.toFixed(1)).toLocaleString()} {unit}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Balance Remaining</span>
                <span className="font-bold text-slate-700 text-sm">
                  {Number(remainingQty.toFixed(1)).toLocaleString()} {unit}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, activeTask.actualProgress)}%` }}
              />
            </div>
          </div>

          {/* Responsible Engineer & Dates */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Responsible Engineer</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {activeTask.responsibleEngineer || "Er. Rajesh Sharma (NHAI Site Incharge)"}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Schedule Window</span>
              <div className="text-slate-800 font-semibold">
                {activeTask.plannedStartDate} → {activeTask.plannedEndDate}
              </div>
            </div>
          </div>

          {/* Linked Field Updates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Linked Field Submissions ({taskUpdates.length})
              </h3>
            </div>
            {taskUpdates.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-lg border border-slate-200">
                No direct field submissions recorded for this WBS task yet.
              </p>
            ) : (
              <div className="space-y-2">
                {taskUpdates.map((u) => (
                  <div key={u.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.verificationStatus === "VERIFIED" ? "bg-emerald-100 text-emerald-800" : u.verificationStatus === "REJECTED" ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {u.verificationStatus}
                        </span>
                        <span className="font-semibold text-slate-900">{u.quantity} {u.unit}</span>
                        <span className="text-slate-400">({u.reportDate})</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{u.activity}</p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">By {u.submittedBy}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Linked Evidence Documents & Photos */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Auditable Evidence & DPR Attachments ({taskEvidence.length})
            </h3>
            {taskEvidence.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-lg border border-slate-200">
                No files uploaded yet for this WBS task.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {taskEvidence.map((ev) => (
                  <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-start gap-2.5">
                    {ev.fileType === "PHOTO" ? (
                      <Camera className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    )}
                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-slate-900 truncate">{ev.title}</h4>
                      <p className="text-[10px] text-slate-500">{ev.fileName} • {ev.uploadDate}</p>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{ev.ocrSummary || ev.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Grounded Q&A Assistant */}
          <div className="p-4 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-200 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-900 mb-2">
              <Bot className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Ask AI Grounded in Evidence
              </h3>
            </div>
            <p className="text-[11px] text-indigo-800/80 mb-3">
              Query specific quantities, DPR logs, or quality certificates linked to this WBS item. Answers are grounded in uploaded evidence documents.
            </p>

            <form onSubmit={handleAskAi} className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="e.g. What is the latest verified layer thickness or soil compaction test result?"
                className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isAiLoading || !aiQuestion.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition"
              >
                {isAiLoading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Ask
              </button>
            </form>

            {aiAnswer && (
              <div className="mt-3 p-3 bg-white border border-indigo-100 rounded-lg text-xs space-y-2">
                <div className="font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                  {aiAnswer.answer}
                </div>
                {aiAnswer.citations && aiAnswer.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Sources:</span>
                    {aiAnswer.citations.map((c, i) => (
                      <span key={i} className="bg-indigo-50 text-indigo-700 text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-100">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
