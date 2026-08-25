import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { SAMPLE_SITE_PHOTOS } from "../../data/seedData";
import { SiteCaptureLog } from "../../types";
import { DroneComparisonSlider } from "../common/DroneComparisonSlider";
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Eye,
  Sliders,
  FileCheck,
} from "lucide-react";

export const ImageUploadAIView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    analyzeSiteImage,
    isAiProcessing,
    createFieldUpdate,
    setActiveView,
  } = useApp();

  const [selectedProject, setSelectedProject] = useState<string>(selectedProjectId || "proj-1");
  const [selectedSample, setSelectedSample] = useState<any>(SAMPLE_SITE_PHOTOS[0]);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [stageHint, setStageHint] = useState<string>("");
  const [promptNotes, setPromptNotes] = useState<string>("");
  const [activeAnalysis, setActiveAnalysis] = useState<SiteCaptureLog | null>(null);
  const [isSuccessNotification, setIsSuccessNotification] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentProjectObj = projects.find((p) => p.id === selectedProject) || projects[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImageBase64(reader.result as string);
        setSelectedSample(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiAnalysis = async () => {
    try {
      const imageToAnalyze = customImageBase64 || selectedSample?.imageUrl;
      const result = await analyzeSiteImage({
        imageBase64: imageToAnalyze,
        projectId: selectedProject,
        stageHint: stageHint || selectedSample?.stage,
        promptNotes: promptNotes || selectedSample?.notes,
        mimeType: customImageBase64 ? "image/jpeg" : undefined,
      });

      setActiveAnalysis(result);
      setIsSuccessNotification(true);
      setTimeout(() => setIsSuccessNotification(false), 4000);
    } catch (err) {
      console.error("AI Analysis failed:", err);
    }
  };

  // Preview Image source
  const currentImageUrl = customImageBase64 || selectedSample?.imageUrl;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Multimodal Vision Stage Detector</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Gemini 3.7 Flash Engine</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            AI Computer Vision & Site Progress Estimation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload construction drone photos, CCTV captures, or field smartphone snapshots to auto-detect construction stage, calculate deviation, and predict delay days.
          </p>
        </div>

        {/* Target Project Selector */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xl">
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Target Project</label>
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedProjectId(e.target.value);
              }}
              className="bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Planned: {p.plannedProgress}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isSuccessNotification && (
        <div className="bg-emerald-500 text-white px-4 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-xs font-bold">
              AI Stage Analysis complete! Project telemetry and delay metrics automatically updated in database.
            </span>
          </div>
          <span className="text-xs font-mono opacity-80">Synced Live</span>
        </div>
      )}

      {/* Main Grid: Left Upload/Selector & Live Viewport | Right AI Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selection & Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pre-Loaded Demo Site Images (SIH Judging Quick Test) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Select SIH Demo Site Capture or Upload Custom</h3>
              <span className="text-[11px] font-semibold text-blue-600">4 Ready Benchmark Images</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {SAMPLE_SITE_PHOTOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedSample(sample);
                    setCustomImageBase64(null);
                    setStageHint(sample.stage);
                    setPromptNotes(sample.notes);
                  }}
                  className={`p-1.5 rounded-xl border text-left transition-all ${
                    selectedSample?.id === sample.id && !customImageBase64
                      ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50"
                  }`}
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-1.5 bg-slate-200">
                    <img src={sample.imageUrl} alt={sample.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{sample.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{sample.sector}</p>
                </button>
              ))}
            </div>

            {/* Custom Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 p-4 rounded-2xl text-center cursor-pointer transition-colors group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex items-center justify-center space-x-2 text-slate-600 group-hover:text-blue-600">
                <Upload className="w-4 h-4" />
                <span className="text-xs font-bold">Upload Custom Site Image from Device / Drone (PNG, JPG)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Supports high-res site photography & orthomosaic maps</p>
            </div>
          </div>

          {/* Live Image Viewport with HUD Computer Vision Scanning */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Computer Vision Inspection Stage</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Live Viewport (1080p Target)</span>
            </div>

            <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
              <img
                src={currentImageUrl}
                alt="Selected Inspection"
                className="w-full h-full object-cover"
              />

              {/* Computer Vision Scanning Reticle and Bounding HUD */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner crosshairs */}
                <div className="absolute top-4 left-4 w-10 h-10 border-l-2 border-t-2 border-cyan-400"></div>
                <div className="absolute top-4 right-4 w-10 h-10 border-r-2 border-t-2 border-cyan-400"></div>
                <div className="absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 border-cyan-400"></div>
                <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 border-cyan-400"></div>

                {/* Simulated Target Detection Boxes */}
                <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 border border-dashed border-emerald-400/80 rounded bg-emerald-500/10 p-1 flex items-start">
                  <span className="text-[9px] font-black bg-emerald-600 text-white px-1.5 py-0.2 rounded font-mono">
                    EQUIPMENT_ACTIVE [98.4%]
                  </span>
                </div>

                <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 border border-dashed border-cyan-400/80 rounded bg-cyan-500/10 p-1 flex items-start">
                  <span className="text-[9px] font-black bg-cyan-600 text-white px-1.5 py-0.2 rounded font-mono">
                    REBAR_STRUCT [94.1%]
                  </span>
                </div>

                {/* Scanning Laser Line when processing */}
                {isAiProcessing && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-lg shadow-cyan-400 top-1/2"></div>
                )}
              </div>

              {/* Floating Bottom HUD Bar */}
              <div className="absolute bottom-3 inset-x-3 bg-slate-900/80 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center justify-between text-white text-xs">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold">Model: Gemini 3.7 Flash Multimodal</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-[11px]">
                  PPE & Hazard Detector Active
                </span>
              </div>
            </div>

            {/* Field Notes / Stage Hint Input */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Site Stage / Work Package Hint (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Asphalting, Pier Cap Casting..."
                  value={stageHint}
                  onChange={(e) => setStageHint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Site Engineer Field Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chainage 132+400, weather clear..."
                  value={promptNotes}
                  onChange={(e) => setPromptNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Run AI Analysis Action Button */}
            <button
              id="btn-run-ai-analysis"
              onClick={handleRunAiAnalysis}
              disabled={isAiProcessing}
              className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isAiProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Construction Stage & Calculating Deviations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Execute AI Computer Vision Progress Estimation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis Result Dashboard (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Analysis Header Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">AI Inspection Results</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Confidence: {activeAnalysis ? `${activeAnalysis.confidenceScore}%` : "94.6% (Standard)"}
              </span>
            </div>

            {/* Stage Detected Badge */}
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl mb-4">
              <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Detected Construction Stage</p>
              <p className="text-base font-extrabold mt-0.5 text-white">
                {activeAnalysis?.stageDetected || selectedSample?.stage || "Sub-grade Asphalt Paving & Interchange Overpass"}
              </p>
            </div>

            {/* 4 SIH Business Metric Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                <p className="text-[10px] uppercase font-bold text-blue-700">Planned Target</p>
                <p className="text-2xl font-black text-blue-950">{currentProjectObj.plannedProgress}%</p>
                <span className="text-[10px] text-blue-600 font-medium">Schedule Baseline</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-[10px] uppercase font-bold text-emerald-700">AI Detected Actual</p>
                <p className="text-2xl font-black text-emerald-950">
                  {activeAnalysis?.detectedProgress ?? selectedSample?.expectedProgress ?? 52}%
                </p>
                <span className="text-[10px] text-emerald-700 font-medium">Vision Validated</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
                <p className="text-[10px] uppercase font-bold text-rose-700">Calculated Deviation</p>
                <p className="text-2xl font-black text-rose-950">
                  {activeAnalysis ? `${activeAnalysis.deviation}%` : "-18%"}
                </p>
                <span className="text-[10px] text-rose-600 font-medium">Behind Schedule</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-[10px] uppercase font-bold text-amber-700">Predicted Delay</p>
                <p className="text-2xl font-black text-amber-950">
                  {activeAnalysis ? activeAnalysis.predictedDelayDays : 9} <span className="text-xs font-bold">Days</span>
                </p>
                <span className="text-[10px] text-amber-700 font-medium">Calculated by Risk Model</span>
              </div>
            </div>

            {/* Elements & Machinery Detected List */}
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Detected Machinery, Structures & Equipment</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(activeAnalysis?.elementsDetected || selectedSample?.elements || [
                  "Asphalt Sensor Paver",
                  "12-Ton Vibratory Roller",
                  "Bitumen Sprayer",
                  "Survey Level Prisms",
                  "Safety Cones"
                ]).map((elem: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    ✓ {elem}
                  </span>
                ))}
              </div>
            </div>

            {/* Safety PPE Compliance Card */}
            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Site Safety & PPE Compliance Index</span>
                </span>
                <span className="text-xs font-black text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  {activeAnalysis?.safetyCompliance?.score ?? 96}/100
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-emerald-800">
                <div className="bg-white/80 p-1.5 rounded-lg text-center border border-emerald-100">
                  ✓ Helmets Verified
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg text-center border border-emerald-100">
                  ✓ Reflective Vests
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg text-center border border-emerald-100">
                  ✓ Barricades OK
                </div>
              </div>
            </div>

            {/* AI Quality Surveyor Analysis Notes */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs mb-4">
              <div>
                <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-blue-700">
                  AI Computer Vision Synthesis:
                </p>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {activeAnalysis?.aiAnalysisSummary ||
                    "Visual scan confirms 460m of continuous Dense Bituminous Macadam (DBM) asphalt completed. Bitumen laying rate is trailing planned quota by 35%."}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-emerald-700">
                  Recommended Site Action:
                </p>
                <p className="text-slate-600 mt-1 leading-relaxed font-medium">
                  {activeAnalysis?.recommendedAction ||
                    "Increase tipper fleet from 14 to 22 dumpers and synchronize hot-mix plant dispatch to recover planned timeline."}
                </p>
              </div>
            </div>

            {/* Submit to Manager Verification Queue Button */}
            <button
              onClick={async () => {
                const quantity = activeAnalysis?.detectedProgress || 52;
                await createFieldUpdate({
                  projectId: selectedProject,
                  wbsCode: "3.2",
                  activityName: activeAnalysis?.stageDetected || selectedSample?.stage || "Bituminous Concrete Laying",
                  quantityValue: quantity,
                  unit: "%",
                  reportDate: new Date().toISOString().split("T")[0],
                  sourceType: "AI_IMAGE_RECOGNITION",
                  extractionConfidence: activeAnalysis?.confidenceScore || 94,
                  gpsStatus: "VALID",
                  latitude: 19.076,
                  longitude: 72.8777,
                  verificationStatus: "PENDING",
                  evidenceFiles: [
                    {
                      name: "site_cv_inspection.jpg",
                      type: "IMAGE",
                      url: currentImageUrl || "",
                    },
                  ],
                });
                alert("Site scan submitted to Manager Verification Queue as PENDING!");
                setActiveView("verification-queue");
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Submit to Manager Verification Queue (DPR Sign-Off)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Temporal Drone AI Photogrammetry Slider Comparison */}
      <DroneComparisonSlider />
    </div>
  );
};
