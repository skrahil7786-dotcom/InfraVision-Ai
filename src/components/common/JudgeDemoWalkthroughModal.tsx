import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  RotateCcw,
  ShieldCheck,
  LineChart,
  FileText,
  Camera,
  ClipboardCheck,
  Lock,
  Layers,
  Award,
} from "lucide-react";

interface JudgeDemoWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeDemoWalkthroughModal: React.FC<JudgeDemoWalkthroughProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    setActiveView,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    alerts,
    fieldUpdates,
    verifyFieldUpdate,
    switchRole,
    currentUser,
    resetDatabase,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isExecutingStep, setIsExecutingStep] = useState<boolean>(false);
  const [stepSuccessMsg, setStepSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      title: "Minute 1: The Infrastructure Crisis (Lagging Paper DPRs & Falsification)",
      narrative: `India constructs 35+ km of national highways daily. Yet over 60% of mega-projects suffer cost overruns and 9–18 month delays due to fabricated paper DPRs and lagging contractor self-reporting. Here, Delhi-Mumbai Package 4 shows a critical schedule slippage of -5.6 percentage points and an open delay alert.`,
      targetView: "dashboard",
      actionLabel: "Navigate to Dashboard & View Slippage",
      onExecute: () => {
        setSelectedProjectId("proj-1");
        setActiveView("dashboard");
        setStepSuccessMsg("Showing Delhi-Mumbai PKG-4: -5.6 pp schedule slippage on Task 3.2 (Dense Bituminous Macadam).");
      },
    },
    {
      stepNumber: 2,
      title: "Minute 2: Multimodal AI Vision & Scanned DPR Ingestion",
      narrative: `Site Engineers capture geo-tagged site photos and upload handwritten/scanned DPRs. Gemini 3.7 Vision automatically classifies the construction stage (DBM Bituminous Laying @ 95% confidence) and validates RTK GNSS within ±200m corridor geofence.`,
      targetView: "ai-vision",
      actionLabel: "View AI Vision Analysis & Geo-Fencing",
      onExecute: () => {
        setActiveView("ai-vision");
        setStepSuccessMsg("Demonstrating AI Stage Detection: Bituminous Layer detected with 95% confidence and verified GNSS coords.");
      },
    },
    {
      stepNumber: 3,
      title: "Minute 3: The Manager Verification Gatekeeper (Quarantine Rule)",
      narrative: `CRITICAL ARCHITECTURAL GUARANTEE: Raw contractor submissions are strictly QUARANTINED as 'PENDING'. Unverified data NEVER alters official S-Curves or triggers contractor billing until authorized by a verified Project Manager.`,
      targetView: "verification-queue",
      actionLabel: "Switch to PM Role & Inspect Verification Queue",
      onExecute: () => {
        switchRole("PROJECT_MANAGER");
        setActiveView("verification-queue");
        setStepSuccessMsg("Switched role to Project Manager (Ananya Deshmukh). Reviewing quarantined field update queue.");
      },
    },
    {
      stepNumber: 4,
      title: "Minute 4: The Live Verification Trigger (Instant S-Curve & Alert Resolution)",
      narrative: `When the Project Manager clicks 'Verify & Commit', the system mathematically recalculates weighted physical progress: Task 3.2 completed quantity rises to 5,600 MT, project progress flips to +0.4 pp (Green), the S-Curve updates, and the linked alert resolves automatically!`,
      targetView: "verification-queue",
      actionLabel: "Trigger 1-Click Verification & Mathematical Recalculation",
      onExecute: async () => {
        setIsExecutingStep(true);
        try {
          const pendingItem = fieldUpdates.find((u) => u.verificationStatus === "PENDING");
          if (pendingItem) {
            await verifyFieldUpdate(pendingItem.id, "Verified against batching plant weightbridge challan and drone scan.");
          }
          setActiveView("analytics");
          setStepSuccessMsg("VERIFIED! Completed quantity updated, S-Curve recalculated, schedule deviation is now +0.4 pp (On-Track)!");
        } finally {
          setIsExecutingStep(false);
        }
      },
    },
    {
      stepNumber: 5,
      title: "Minute 5: Statutory MoRTH DPR Export & Immutable SHA-256 Audit Trail",
      narrative: `Every single state change generates a tamper-evident audit ledger entry with actor signature, GPS coordinates, and cryptographic SHA-256 digital stamp. Generate one-click statutory MoRTH Section 500 Daily Progress Reports (DPR) and Executive Exception Dossiers.`,
      targetView: "reports",
      actionLabel: "Open Statutory MoRTH DPR & Audit Trail",
      onExecute: () => {
        setActiveView("reports");
        setStepSuccessMsg("Generated official NHAI/MoRTH Daily Progress Report with digital signature and SHA-256 verification hash.");
      },
    },
  ];

  const activeStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setStepSuccessMsg(null);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setStepSuccessMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-start justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white">
                  SIH26122 Smart India Hackathon: 5-Minute Pitch Runner
                </h3>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Judges Walkthrough
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Guided step-by-step demonstration sequence showcasing the core value proposition and technical rigor.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            {steps.map((s) => (
              <button
                key={s.stepNumber}
                onClick={() => {
                  setCurrentStep(s.stepNumber);
                  setStepSuccessMsg(null);
                }}
                className={`w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center ${
                  currentStep === s.stepNumber
                    ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-md shadow-blue-500/30 scale-105"
                    : currentStep > s.stepNumber
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500 hover:bg-slate-700"
                }`}
              >
                {currentStep > s.stepNumber ? "✓" : s.stepNumber}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            Step <strong className="text-white">{currentStep}</strong> of 5
          </span>
        </div>

        {/* Step Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Live Demo Stage {activeStepData.stepNumber}
            </span>
            <h4 className="text-lg font-black text-slate-900 leading-snug">
              {activeStepData.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {activeStepData.narrative}
            </p>
          </div>

          {stepSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold">{stepSuccessMsg}</span>
            </div>
          )}

          {/* Action Trigger Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-5 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-700 block">
                Interactive Action for Judges
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {activeStepData.actionLabel}
              </p>
            </div>

            <button
              onClick={activeStepData.onExecute}
              disabled={isExecutingStep}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-2 transition cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Execute Demo Action</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Exit Walkthrough
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Presentation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
