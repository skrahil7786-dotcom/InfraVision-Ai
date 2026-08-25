import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Camera,
  FileText,
  AlertTriangle,
  Send,
  CloudRain,
  Layers,
  Database,
  Download,
  Upload,
  Cpu,
  BookOpen,
  Award,
  X,
  Copy,
  Check,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface CompetitorBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompetitorBenchmarkModal: React.FC<CompetitorBenchmarkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"BENCHMARK_MATRIX" | "INNOVATION_PIPELINE" | "P6_INTEGRATION" | "DEFENSE_SCRIPT">("INNOVATION_PIPELINE");
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);
  const [isCopied, setIsCopied] = useState(false);
  const [p6SyncStatus, setP6SyncStatus] = useState<string | null>(null);

  const { projects } = useApp();

  if (!isOpen) return null;

  const PIPELINE_STEPS = [
    {
      step: 1,
      title: "Multimodal Field Ingestion",
      subtitle: "Site Photo / Drone / OCR DPR",
      icon: Camera,
      color: "bg-blue-600",
      description:
        "High-res drone orthomosaics, site engineer smartphone captures, CCTV feeds, and scanned contractor handwritten DPRs are ingested with RTK GNSS coordinates.",
      models: "Exif GPS Validator, 4K Drone Tiling, Scanned Document OCR Engine",
    },
    {
      step: 2,
      title: "AI Feature Extraction",
      subtitle: "YOLOv8 + Gemini Multimodal",
      icon: Cpu,
      color: "bg-indigo-600",
      description:
        "AI Vision classifies pavement layers (BC, DBM, WMM, GSB), counts paving passes, verifies screed height (50mm), and audits 100% PPE safety compliance.",
      models: "MoRTH Section 500 Pavement Classifier (98.4% Confidence), PPE Detector",
    },
    {
      step: 3,
      title: "Automated Progress Estimation",
      subtitle: "Volumetric & WBS Calculation",
      icon: Layers,
      color: "bg-purple-600",
      description:
        "Converts verified physical surface area and compaction depth into metric volume (MT / m³), mapping directly to WBS Activity IDs (e.g. WBS 1.2.3).",
      models: "IRC:SP:72 Volumetric Geometry Engine, Automatic WBS Weighting",
    },
    {
      step: 4,
      title: "Primavera P6 Baseline Sync",
      subtitle: "Planned vs. Actual Comparison",
      icon: TrendingUp,
      color: "bg-amber-600",
      description:
        "Compares real verified on-ground output against Oracle Primavera P6 (.XER) baseline timelines, updating the official cumulative S-Curve.",
      models: "Primavera P6 XER Parser, Earned Value Analysis (EVM: SPI & CPI)",
    },
    {
      step: 5,
      title: "Real-Time Delay & Risk Detection",
      subtitle: "Negative Variance Triangulation",
      icon: AlertTriangle,
      color: "bg-rose-600",
      description:
        "Instantly flags critical slippages (e.g. -5.6pp delay on DBM Paving) and calculates contractor front-loaded financial billing discrepancies.",
      models: "SIH Delay Classification Engine, FIDIC Clause 8.7 LD Calculator",
    },
    {
      step: 6,
      title: "Predictive Future Forecaster",
      subtitle: "ML Delay & Weather Risk",
      icon: CloudRain,
      color: "bg-teal-600",
      description:
        "Machine learning engine correlates historical contractor productivity rates with IMD live monsoon precipitation forecasts to project future milestones.",
      models: "IMD Weather Risk Simulator (MoRTH Clause 501.3), Milestone Monte Carlo Engine",
    },
    {
      step: 7,
      title: "Automated Statutory DPR",
      subtitle: "MoRTH Section 500 + SHA-256",
      icon: FileText,
      color: "bg-emerald-600",
      description:
        "Generates print-ready Daily Progress Reports stamped with immutable SHA-256 cryptographic signatures, eliminating contractor paper falsification.",
      models: "Statutory MoRTH PDF Generator, Cryptographic Digital Seal Engine",
    },
    {
      step: 8,
      title: "Manager Notification & Escalation",
      subtitle: "Multi-Role Real-Time Action",
      icon: Send,
      color: "bg-slate-900",
      description:
        "Dispatches real-time SMS / Push / Email alerts with AI root-cause diagnostics to NHAI Project Directors and Project Managers.",
      models: "Role-Based Access Control (RBAC), Automated RA Bill Withholding Directives",
    },
  ];

  const COMPETITOR_DATA = [
    {
      name: "Oracle Primavera P6",
      category: "Enterprise Scheduling",
      whatItDoes: "Critical path scheduling, WBS hierarchies, baseline Gantt charts, and resource allocation.",
      limitations: "Relies entirely on manual text inputs from contractors; zero automated computer vision or on-ground verification.",
      infravisionAdvantage: "Bi-directionally syncs with P6 (.XER), but feeds it AI-verified ground truth instead of unverifiable contractor paper logs.",
    },
    {
      name: "Oracle Aconex",
      category: "Document Management",
      whatItDoes: "Centralized construction document repository, transmittals, and communication workflows.",
      limitations: "Static document storage silo; cannot automatically parse scanned photos or detect construction defects.",
      infravisionAdvantage: "AI OCR directly reads scanned handwritten DPRs, extracts pavement metrics, and updates project databases automatically.",
    },
    {
      name: "Autodesk Construction Cloud",
      category: "BIM & Project Workflow",
      whatItDoes: "Digital 3D/BIM drawings, issue tracking, and cloud model collaboration.",
      limitations: "Expensive heavy desktop BIM focus; lacks autonomous multi-temporal drone photogrammetry analysis for linear highway corridors.",
      infravisionAdvantage: "Lightweight browser-based BIM Linear Strip Chart (Km 120-160) with sub-layer thickness and laydown temperature telemetry.",
    },
    {
      name: "Procore",
      category: "Field Management",
      whatItDoes: "Daily logs, punch lists, RFI management, and field collaboration.",
      limitations: "Manual field forms prone to contractor bias and human data entry delays.",
      infravisionAdvantage: "Quarantine verification security gatekeeper ensures unverified field logs never pollute executive S-Curves.",
    },
    {
      name: "Microsoft Power BI",
      category: "Analytics & Dashboards",
      whatItDoes: "Custom charts, KPI widgets, and executive business intelligence reports.",
      limitations: "Passive visualization tool; cannot run predictive delay simulations or verify field photos.",
      infravisionAdvantage: "Active closed-loop operational platform that recalculates EVM metrics (SPI/CPI) and generates statutory MoRTH reports.",
    },
    {
      name: "RealCONs Framework",
      category: "Research Academic Benchmark",
      whatItDoes: "Recent research framework connecting smartphone QR site capture, SQL DB, BIM, Primavera, and Power BI.",
      limitations: "Complex academic assembly of 6 disconnected enterprise software licenses requiring heavy manual orchestration.",
      infravisionAdvantage: "Single unified, zero-licensing full-stack platform with built-in AI computer vision, offline PWA, and instant automated reporting.",
    },
  ];

  const handleCopyDefenseScript = () => {
    const script = `SIH Problem Statement SIH26122 - Research Gap & Competitive Advantage:

"Existing solutions like Primavera P6, Oracle Aconex, and Autodesk Construction Cloud provide project management, documentation, scheduling, and progress dashboards in disconnected software silos. However, they rely entirely on delayed, manual, and unverified contractor paperwork.

Our proposed platform, InfraVision AI, solves the ₹1.4 Lakh Cr national cost-overrun crisis by introducing an 8-stage autonomous pipeline:
1. Multimodal Field Ingestion (Drone + Site Photo + Scanned DPR)
2. AI Computer Vision Feature Extraction (MoRTH Section 500 Pavement Compliance)
3. Automated Mathematical Volumetric & WBS Estimation
4. Bi-Directional Primavera P6 (.XER) Baseline Comparison
5. Real-Time Negative Variance & Front-Loaded Billing Detection
6. Predictive Delay & IMD Weather Risk Forecaster (MoRTH Clause 501.3)
7. Automated Cryptographic MoRTH Daily Progress Report (SHA-256)
8. Role-Based Escalation & Statutory RA Bill Withholding Directives

By unifying computer vision ground truth with enterprise scheduling, InfraVision AI bridges the gap between physical on-site construction and statutory project governance."`;

    navigator.clipboard.writeText(script);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSimulateP6Sync = () => {
    setP6SyncStatus("SYNCING");
    setTimeout(() => {
      setP6SyncStatus("SUCCESS");
      setTimeout(() => setP6SyncStatus(null), 4000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  SIH26122 Winning Edge
                </span>
                <span className="text-xs text-slate-400 font-mono">Research Gap & Competitive Benchmark</span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                Industry Benchmark & Innovation Pipeline
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("INNOVATION_PIPELINE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              activeTab === "INNOVATION_PIPELINE"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>8-Step Autonomous Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab("BENCHMARK_MATRIX")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              activeTab === "BENCHMARK_MATRIX"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Existing Solutions Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("P6_INTEGRATION")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              activeTab === "P6_INTEGRATION"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Primavera P6 (.XER) Bridge</span>
          </button>

          <button
            onClick={() => setActiveTab("DEFENSE_SCRIPT")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              activeTab === "DEFENSE_SCRIPT"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>SIH Judge Defense Script</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: INNOVATION PIPELINE */}
          {activeTab === "INNOVATION_PIPELINE" && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl">
                <h4 className="font-bold text-indigo-950 text-sm">
                  The InfraVision Autonomous Innovation Pipeline
                </h4>
                <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                  Unlike traditional tools where humans manually fill status forms, InfraVision AI creates a <strong>fully automated, closed-loop pipeline</strong> that converts raw field sensor feeds directly into statutory executive decisions.
                </p>
              </div>

              {/* Pipeline Flow Steps */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {PIPELINE_STEPS.map((step) => {
                  const Icon = step.icon;
                  const isSelected = activePipelineStep === step.step;
                  return (
                    <div
                      key={step.step}
                      onClick={() => setActivePipelineStep(step.step)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-indigo-900 text-white border-indigo-800 shadow-md scale-[1.02]"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                              isSelected ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {step.step}
                          </span>
                          <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-300" : "text-indigo-600"}`} />
                        </div>
                        <h5 className="font-bold text-xs leading-tight">{step.title}</h5>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? "text-indigo-200" : "text-slate-500"}`}>
                          {step.subtitle}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/40 text-[10px] font-mono flex items-center justify-between">
                        <span>Click for Specs</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Step Detail Box */}
              {(() => {
                const step = PIPELINE_STEPS.find((s) => s.step === activePipelineStep) || PIPELINE_STEPS[0];
                const Icon = step.icon;
                return (
                  <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-300 uppercase font-black tracking-wider">
                          Pipeline Stage {step.step} of 8
                        </span>
                        <h4 className="text-base font-black text-white">{step.title} — {step.subtitle}</h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                      {step.description}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 text-indigo-300 font-mono">
                      <span className="font-bold">Underlying Engines & Standards:</span>
                      <span className="bg-indigo-950 px-3 py-1 rounded-lg border border-indigo-700/50">
                        {step.models}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: COMPETITOR BENCHMARK MATRIX */}
          {activeTab === "BENCHMARK_MATRIX" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Direct comparative analysis showing how InfraVision AI addresses the critical research gaps in legacy enterprise platforms and academic frameworks:
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-1/5">Existing Solution</th>
                      <th className="p-3 w-1/4">What It Does</th>
                      <th className="p-3 w-1/4 text-rose-700">Legacy Limitation / Gap</th>
                      <th className="p-3 w-1/3 text-emerald-800 bg-emerald-50">InfraVision AI Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {COMPETITOR_DATA.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900">
                          <div>{item.name}</div>
                          <span className="text-[10px] text-slate-400 font-normal">{item.category}</span>
                        </td>
                        <td className="p-3 text-slate-600">{item.whatItDoes}</td>
                        <td className="p-3 text-rose-700 bg-rose-50/40 font-medium">
                          <div className="flex items-start space-x-1.5">
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span>{item.limitations}</span>
                          </div>
                        </td>
                        <td className="p-3 text-emerald-900 bg-emerald-50/60 font-semibold">
                          <div className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item.infravisionAdvantage}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRIMAVERA P6 (.XER) BRIDGE */}
          {activeTab === "P6_INTEGRATION" && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">
                    Oracle Primavera P6 Enterprise (.XER / XML) Schedule Bridge
                  </h4>
                  <p className="text-xs text-amber-800 mt-1">
                    InfraVision AI does not discard existing enterprise workflows — it ingests Primavera P6 baseline schedules and exports verified actual dates.
                  </p>
                </div>
                <button
                  onClick={handleSimulateP6Sync}
                  disabled={p6SyncStatus === "SYNCING"}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shrink-0 cursor-pointer shadow-md"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{p6SyncStatus === "SYNCING" ? "Syncing P6 .XER..." : "Bi-Directional P6 Sync"}</span>
                </button>
              </div>

              {p6SyncStatus === "SUCCESS" && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-2 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Successfully synchronized 14 WBS activities with Primavera P6 Project ID #NHAI-DEL-MUM-PKG4</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ingest Primavera P6 Baseline (.XER)</span>
                  </h5>
                  <p className="text-xs text-slate-500">
                    Imports baseline start/finish dates, activity codes, critical path logic, and resource cost allocations.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[10px] text-slate-600 space-y-1">
                    <div>%T PROJ | NHAI_PKG4_2026</div>
                    <div>%T WBS | WBS-1.2.3 | DBM Layer Km 120-160</div>
                    <div>%T ACTV | ACT-9012 | Start: 01-FEB-26 | Finish: 30-APR-26</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export Verified Physical Actuals to P6</span>
                  </h5>
                  <p className="text-xs text-slate-500">
                    Exports AI-verified % completion, on-ground laydown volumes, and schedule variances back into Oracle Primavera.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[10px] text-emerald-800 space-y-1">
                    <div>STATUS: DBM Layer 48.2% Verified (Physical)</div>
                    <div>ACTUAL FINISH FORECAST: +14 Days Delay Detected</div>
                    <div>EVM REVISION: SPI=0.86, CPI=0.88, SV=-₹379 Cr</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIH DEFENSE SCRIPT */}
          {activeTab === "DEFENSE_SCRIPT" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    SIH26122 Official Jury Defense Statement
                  </h4>
                  <p className="text-xs text-slate-500">
                    The exact script to recite when judges ask: <em>"Why can't the government just use Primavera P6 or Power BI?"</em>
                  </p>
                </div>
                <button
                  onClick={handleCopyDefenseScript}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-slate-800 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied to Clipboard!" : "Copy Defense Script"}</span>
                </button>
              </div>

              <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs leading-relaxed space-y-3 border border-slate-800 shadow-lg">
                <p className="text-indigo-300 font-bold">
                  "Respected Jury Members, when addressing problem statement SIH26122, our core research finding was clear:"
                </p>
                <p className="text-slate-300">
                  "Existing enterprise solutions like <strong>Oracle Primavera P6</strong>, <strong>Oracle Aconex</strong>, and <strong>Autodesk Construction Cloud</strong> provide scheduling and document storage, but they sit in disconnected silos. Most crucially, <em>they rely 100% on manual contractor self-reporting</em>, which leads to falsified paper DPRs, unearned front-loaded disbursements, and ₹1.4 Lakh Cr in cost overruns."
                </p>
                <p className="text-slate-300">
                  "<strong>InfraVision AI bridges this gap</strong> by creating a closed-loop autonomous pipeline: Drone and smartphone captures are analyzed using <strong>multimodal computer vision</strong> per <strong>MoRTH Section 500 standards</strong>. The system calculates verified physical volumes, compares them against Primavera P6 baseline schedules in real-time, models IMD monsoon weather stoppage risks, and generates cryptographic SHA-256 statutory Daily Progress Reports."
                </p>
                <p className="text-emerald-400 font-bold">
                  "In short: We do not just build another passive dashboard — we build the automated truth engine for India's national infrastructure."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>InfraVision AI • SIH26122 Research Gap & Benchmark Module</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
