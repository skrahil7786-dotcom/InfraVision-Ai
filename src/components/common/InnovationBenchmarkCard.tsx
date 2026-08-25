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
  Copy,
  Check,
} from "lucide-react";

export const InnovationBenchmarkCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "INNOVATION_PIPELINE" | "BENCHMARK_MATRIX" | "P6_INTEGRATION" | "DEFENSE_SCRIPT"
  >("INNOVATION_PIPELINE");
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);
  const [isCopied, setIsCopied] = useState(false);
  const [p6SyncStatus, setP6SyncStatus] = useState<string | null>(null);

  const PIPELINE_STEPS = [
    {
      step: 1,
      title: "Multimodal Field Ingestion",
      subtitle: "Drone / Phone / Scanned DPR",
      icon: Camera,
      badge: "Ingestion",
      description:
        "High-res drone orthomosaics, site engineer smartphone captures, CCTV feeds, and scanned contractor handwritten DPRs are ingested with RTK GNSS coordinates.",
      models: "Exif GPS Validator, 4K Drone Tiling, Scanned Document OCR Engine",
    },
    {
      step: 2,
      title: "AI Feature Extraction",
      subtitle: "YOLOv8 + Gemini Multimodal",
      icon: Cpu,
      badge: "Computer Vision",
      description:
        "AI Vision classifies pavement layers (BC, DBM, WMM, GSB), counts paving passes, verifies screed height (50mm), and audits 100% PPE safety compliance.",
      models: "MoRTH Section 500 Pavement Classifier (98.4% Confidence), PPE Detector",
    },
    {
      step: 3,
      title: "Automated Progress Estimation",
      subtitle: "Volumetric & WBS Calculation",
      icon: Layers,
      badge: "Math Engine",
      description:
        "Converts verified physical surface area and compaction depth into metric volume (MT / m³), mapping directly to WBS Activity IDs (e.g. WBS 1.2.3).",
      models: "IRC:SP:72 Volumetric Geometry Engine, Automatic WBS Weighting",
    },
    {
      step: 4,
      title: "Primavera P6 Baseline Sync",
      subtitle: "Planned vs. Actual Comparison",
      icon: TrendingUp,
      badge: "Enterprise Sync",
      description:
        "Compares real verified on-ground output against Oracle Primavera P6 (.XER) baseline timelines, updating the official cumulative S-Curve.",
      models: "Primavera P6 XER Parser, Earned Value Analysis (EVM: SPI & CPI)",
    },
    {
      step: 5,
      title: "Real-Time Delay & Risk Detection",
      subtitle: "Negative Variance Triangulation",
      icon: AlertTriangle,
      badge: "Risk Engine",
      description:
        "Instantly flags critical slippages (e.g. -5.6pp delay on DBM Paving) and calculates contractor front-loaded financial billing discrepancies.",
      models: "SIH Delay Classification Engine, FIDIC Clause 8.7 LD Calculator",
    },
    {
      step: 6,
      title: "Predictive Future Forecaster",
      subtitle: "ML Delay & Weather Risk",
      icon: CloudRain,
      badge: "AI Prediction",
      description:
        "Machine learning engine correlates historical contractor productivity rates with IMD live monsoon precipitation forecasts to project future milestones.",
      models: "IMD Weather Risk Simulator (MoRTH Clause 501.3), Milestone Monte Carlo Engine",
    },
    {
      step: 7,
      title: "Automated Statutory DPR",
      subtitle: "MoRTH Section 500 + SHA-256",
      icon: FileText,
      badge: "Statutory Seal",
      description:
        "Generates print-ready Daily Progress Reports stamped with immutable SHA-256 cryptographic signatures, eliminating contractor paper falsification.",
      models: "Statutory MoRTH PDF Generator, Cryptographic Digital Seal Engine",
    },
    {
      step: 8,
      title: "Manager Escalation & Alerts",
      subtitle: "Multi-Role Real-Time Action",
      icon: Send,
      badge: "Escalation",
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
      category: "Academic Benchmark",
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
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-indigo-200">
                SIH26122 Architecture Matrix
              </span>
              <span className="text-xs text-slate-500 font-medium">Research Gap vs. Legacy Solutions</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              Industry Benchmark & Autonomous Pipeline Engine
            </h3>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("INNOVATION_PIPELINE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "INNOVATION_PIPELINE"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>8-Step AI Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab("BENCHMARK_MATRIX")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "BENCHMARK_MATRIX"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Competitor Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab("P6_INTEGRATION")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "P6_INTEGRATION"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Primavera P6 Bridge</span>
          </button>

          <button
            onClick={() => setActiveTab("DEFENSE_SCRIPT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "DEFENSE_SCRIPT"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Judge Script</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Pipeline */}
      {activeTab === "INNOVATION_PIPELINE" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PIPELINE_STEPS.map((step) => {
              const Icon = step.icon;
              const isSelected = activePipelineStep === step.step;
              return (
                <button
                  key={step.step}
                  onClick={() => setActivePipelineStep(step.step)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-indigo-900 text-white border-indigo-800 shadow-md ring-2 ring-indigo-500/50"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                          isSelected ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {step.step}
                      </span>
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-300" : "text-indigo-600"}`} />
                    </div>
                    <div className="text-[11px] font-bold leading-tight">{step.title}</div>
                  </div>
                  <div className={`text-[9px] mt-2 font-mono ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                    {step.badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed step panel */}
          {(() => {
            const step = PIPELINE_STEPS.find((s) => s.step === activePipelineStep) || PIPELINE_STEPS[0];
            const Icon = step.icon;
            return (
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-300 font-mono uppercase font-black">
                        Stage {step.step} of 8 • {step.badge}
                      </span>
                      <h4 className="text-sm font-bold text-white">{step.title} ({step.subtitle})</h4>
                    </div>
                  </div>
                  <span className="text-xs bg-indigo-950 px-3 py-1 rounded-lg text-indigo-200 border border-indigo-800 font-mono hidden sm:inline">
                    {step.models}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                  {step.description}
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab 2: Comparison Matrix */}
      {activeTab === "BENCHMARK_MATRIX" && (
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
      )}

      {/* Tab 3: P6 Bridge */}
      {activeTab === "P6_INTEGRATION" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-amber-950 text-sm">
                Oracle Primavera P6 Enterprise (.XER / XML) Schedule Bridge
              </h4>
              <p className="text-xs text-amber-800 mt-1">
                Bi-directionally ingests Primavera P6 baseline schedules and exports AI-verified on-ground actual dates.
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
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Ingest Primavera P6 Baseline (.XER)</span>
              </h5>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[10px] text-slate-600 space-y-1">
                <div>%T PROJ | NHAI_PKG4_2026</div>
                <div>%T WBS | WBS-1.2.3 | DBM Layer Km 120-160</div>
                <div>%T ACTV | ACT-9012 | Start: 01-FEB-26 | Finish: 30-APR-26</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export Verified Physical Actuals to P6</span>
              </h5>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[10px] text-emerald-800 space-y-1">
                <div>STATUS: DBM Layer 48.2% Verified (Physical)</div>
                <div>ACTUAL FINISH FORECAST: +14 Days Delay Detected</div>
                <div>EVM REVISION: SPI=0.86, CPI=0.88, SV=-₹379 Cr</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Defense Script */}
      {activeTab === "DEFENSE_SCRIPT" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-600">
              The exact SIH presentation pitch when jury asks: <em>"Why not just use Primavera P6 or Power BI?"</em>
            </div>
            <button
              onClick={handleCopyDefenseScript}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-slate-800 cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? "Copied!" : "Copy Pitch"}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs leading-relaxed space-y-2 border border-slate-800">
            <p className="text-indigo-300 font-bold">
              "Existing enterprise tools (Primavera P6, Aconex, Power BI) are passive software silos relying 100% on delayed, unverified contractor paperwork."
            </p>
            <p className="text-slate-300">
              "InfraVision AI replaces this with an <strong>autonomous 8-step pipeline</strong>: Drone & site photos → Multimodal AI extraction (MoRTH 500) → Volumetric progress estimation → Bi-directional P6 sync → Real-time negative variance detection → Predictive delay & weather risk forecaster → Cryptographic SHA-256 statutory DPR → Executive manager escalation."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
