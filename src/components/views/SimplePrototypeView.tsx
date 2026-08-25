import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  Layers, 
  TrendingDown, 
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Info
} from "lucide-react";

export const SimplePrototypeView: React.FC = () => {
  const { 
    projects, 
    selectedProjectId, 
    alerts, 
    fieldUpdates, 
    submitFieldUpdate,
    resolveAlert
  } = useApp();

  const [activeTab, setActiveTab] = useState<"dashboard" | "ingestion" | "schedule" | "alerts" | "roadmap">("dashboard");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Field Ingestion State
  const [wbsCode, setWbsCode] = useState("STR-02-04");
  const [activity, setActivity] = useState("RCC slab casting – Pier Cap P-104");
  const [qty, setQty] = useState("42");
  const [unit, setUnit] = useState("m³");
  const [extractedData, setExtractedData] = useState<{
    wbs: string;
    activity: string;
    quantity: number;
    unit: string;
    timestamp: string;
    fileName: string;
  } | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // Schedule Calculator State
  const [targetQty, setTargetQty] = useState<number>(100);
  const [completedQty, setCompletedQty] = useState<number>(62.4);
  const [plannedProgress, setPlannedProgress] = useState<number>(68);
  const [calcWbs, setCalcWbs] = useState<string>("STR-02-04");

  const [calcResult, setCalcResult] = useState<{
    actual: number;
    delta: number;
    status: "ON_TRACK" | "DELAY";
  }>({
    actual: 62.4,
    delta: -5.6,
    status: "DELAY"
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleFakeExtract = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setExtractedData({
        wbs: "STR-02-04",
        activity: "RCC slab casting – Block B",
        quantity: 42,
        unit: "m³",
        timestamp: "24 Aug 2026 • 18:42",
        fileName: file.name
      });
      showToast(`DPR extracted successfully from ${file.name}`);
    }, 600);
  };

  const handleSubmitFieldUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const numericQty = parseFloat(qty) || 0;
    
    await submitFieldUpdate({
      wbsCode,
      activity,
      quantity: numericQty,
      unit,
      source: "MANUAL"
    });

    showToast(`Field update (${numericQty} ${unit}) submitted and linked to WBS ${wbsCode}`);
  };

  const handleCalculate = () => {
    const t = targetQty || 1;
    const c = completedQty || 0;
    const p = plannedProgress || 0;
    const actual = (c / t) * 100;
    const delta = actual - p;
    setCalcResult({
      actual: parseFloat(actual.toFixed(1)),
      delta: parseFloat(delta.toFixed(1)),
      status: delta < 0 ? "DELAY" : "ON_TRACK"
    });
    showToast(`Calculated: Actual ${actual.toFixed(1)}%, Variance ${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`);
  };

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0] || {
    name: "Delhi-Mumbai Expressway Package 4",
    actualProgress: 62.4,
    plannedProgress: 68.0,
    predictedDelayDays: 14
  };

  const openAlerts = alerts.filter(a => a.status === "OPEN");

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f7fb] text-[#172033] overflow-y-auto font-sans relative">
      {/* Subheader Navigation Pills */}
      <div className="bg-[#0d1830] text-white px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-extrabold text-sm tracking-tight text-white">InfraTrack</span>
          </div>
          <span className="text-slate-400 text-xs font-mono bg-slate-800 px-2 py-0.5 rounded">SIH26122 Prototype</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 bg-[#1a2949] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "dashboard" ? "bg-white text-[#0d1830] shadow-sm" : "text-slate-200 hover:text-white"
            }`}
          >
            <span>▦ Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("ingestion")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "ingestion" ? "bg-white text-[#0d1830] shadow-sm" : "text-slate-200 hover:text-white"
            }`}
          >
            <span>⇧ Field Ingestion</span>
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "schedule" ? "bg-white text-[#0d1830] shadow-sm" : "text-slate-200 hover:text-white"
            }`}
          >
            <span>↗ Schedule Mapper</span>
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "alerts" ? "bg-white text-[#0d1830] shadow-sm" : "text-slate-200 hover:text-white"
            }`}
          >
            <span>⚠ Delay Alerts</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {openAlerts.length || 3}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "roadmap" ? "bg-white text-[#0d1830] shadow-sm" : "text-slate-200 hover:text-white"
            }`}
          >
            <span>◇ Roadmap</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6 flex-1">
        {/* ======================= TAB 1: DASHBOARD ======================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Smart Infrastructure / Construction Management
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#172033] tracking-tight">
                  Project Control Center
                </h1>
              </div>
              <span className="self-start sm:self-auto bg-[#e9f8ef] text-[#157347] border border-[#b7e3c7] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#157347]"></span>
                LIVE MONITORING
              </span>
            </div>

            {/* 4 Crisp Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e4e7ec] rounded-xl p-4 shadow-2xs">
                <div className="text-xs text-[#667085] font-medium">Overall Actual Progress</div>
                <div className="text-2xl font-extrabold text-[#1f9d55] mt-1.5">62.4%</div>
                <div className="text-xs text-[#667085] mt-1">vs 68.0% planned</div>
              </div>

              <div className="bg-white border border-[#e4e7ec] rounded-xl p-4 shadow-2xs">
                <div className="text-xs text-[#667085] font-medium">Schedule Deviation Δ</div>
                <div className="text-2xl font-extrabold text-[#dc3545] mt-1.5">−5.6%</div>
                <div className="text-xs text-[#667085] mt-1">Needs attention</div>
              </div>

              <div className="bg-white border border-[#e4e7ec] rounded-xl p-4 shadow-2xs">
                <div className="text-xs text-[#667085] font-medium">Activities Tracked</div>
                <div className="text-2xl font-extrabold text-[#2563eb] mt-1.5">24</div>
                <div className="text-xs text-[#667085] mt-1">WBS-linked tasks</div>
              </div>

              <div className="bg-white border border-[#e4e7ec] rounded-xl p-4 shadow-2xs">
                <div className="text-xs text-[#667085] font-medium">Open Alerts</div>
                <div className="text-2xl font-extrabold text-[#d97706] mt-1.5">3</div>
                <div className="text-xs text-[#667085] mt-1">1 critical path risk</div>
              </div>
            </div>

            {/* WBS Progress & Latest Field Update */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
                <h2 className="text-sm font-bold text-[#172033] mb-4">WBS Progress</h2>
                
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#172033] font-medium">Foundation Works</span>
                      <span className="font-bold text-[#172033]">82%</span>
                    </div>
                    <div className="h-2.5 bg-[#eef1f5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1f9d55] rounded-full transition-all" style={{ width: "82%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#172033] font-medium">Structural Works</span>
                      <span className="font-bold text-[#172033]">61%</span>
                    </div>
                    <div className="h-2.5 bg-[#eef1f5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1f9d55] rounded-full transition-all" style={{ width: "61%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#172033] font-medium">Electrical Works</span>
                      <span className="font-bold text-[#172033]">54%</span>
                    </div>
                    <div className="h-2.5 bg-[#eef1f5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1f9d55] rounded-full transition-all" style={{ width: "54%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#172033] font-medium">Finishing Works</span>
                      <span className="font-bold text-[#172033]">38%</span>
                    </div>
                    <div className="h-2.5 bg-[#eef1f5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1f9d55] rounded-full transition-all" style={{ width: "38%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#172033] mb-2">Latest Field Update</h2>
                  <p className="text-xs text-[#667085] mb-3 font-mono">DPR-2026-0824.pdf</p>
                  
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-slate-500">Activity:</span> <b className="text-slate-900">RCC slab casting – Block B</b></p>
                    <p><span className="text-slate-500">Quantity:</span> <b className="text-slate-900">42 m³</b></p>
                    <p><span className="text-slate-500">WBS:</span> <b className="text-slate-900 font-mono">STR-02-04</b></p>
                    <p><span className="text-slate-500">Captured:</span> <span className="text-slate-700">24 Aug 2026 • 18:42</span></p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="bg-[#e9f8ef] text-[#157347] border border-[#b7e3c7] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    VERIFIED
                  </span>
                  <button 
                    onClick={() => setActiveTab("ingestion")}
                    className="text-xs text-[#2563eb] font-semibold hover:underline cursor-pointer"
                  >
                    Ingest New DPR →
                  </button>
                </div>
              </div>
            </div>

            {/* Schedule Variance Table */}
            <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
              <h2 className="text-sm font-bold text-[#172033] mb-3">Schedule Variance</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e4e7ec] text-[#667085]">
                      <th className="py-2.5 px-2 font-semibold">WBS</th>
                      <th className="py-2.5 px-2 font-semibold">Activity</th>
                      <th className="py-2.5 px-2 font-semibold">Planned</th>
                      <th className="py-2.5 px-2 font-semibold">Actual</th>
                      <th className="py-2.5 px-2 font-semibold">Δ</th>
                      <th className="py-2.5 px-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4e7ec]">
                    <tr>
                      <td className="py-3 px-2 font-mono font-semibold">STR-02-04</td>
                      <td className="py-3 px-2">RCC slab casting</td>
                      <td className="py-3 px-2 text-slate-600">70%</td>
                      <td className="py-3 px-2 font-semibold">61%</td>
                      <td className="py-3 px-2 text-[#dc3545] font-bold">−9%</td>
                      <td className="py-3 px-2">
                        <span className="bg-[#fdebed] text-[#b42318] px-2 py-0.5 rounded-full text-[11px] font-bold">
                          DELAY
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono font-semibold">FND-01-02</td>
                      <td className="py-3 px-2">Foundation concrete</td>
                      <td className="py-3 px-2 text-slate-600">80%</td>
                      <td className="py-3 px-2 font-semibold">82%</td>
                      <td className="py-3 px-2 text-[#1f9d55] font-bold">+2%</td>
                      <td className="py-3 px-2">
                        <span className="bg-[#e9f8ef] text-[#157347] px-2 py-0.5 rounded-full text-[11px] font-bold">
                          ON TRACK
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono font-semibold">ELE-03-01</td>
                      <td className="py-3 px-2">Cable tray installation</td>
                      <td className="py-3 px-2 text-slate-600">50%</td>
                      <td className="py-3 px-2 font-semibold">54%</td>
                      <td className="py-3 px-2 text-[#1f9d55] font-bold">+4%</td>
                      <td className="py-3 px-2">
                        <span className="bg-[#e9f8ef] text-[#157347] px-2 py-0.5 rounded-full text-[11px] font-bold">
                          AHEAD
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono font-semibold">FIN-04-03</td>
                      <td className="py-3 px-2">Internal plastering</td>
                      <td className="py-3 px-2 text-slate-600">45%</td>
                      <td className="py-3 px-2 font-semibold">38%</td>
                      <td className="py-3 px-2 text-[#dc3545] font-bold">−7%</td>
                      <td className="py-3 px-2">
                        <span className="bg-[#fff4df] text-[#a15c00] px-2 py-0.5 rounded-full text-[11px] font-bold">
                          WATCH
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: FIELD INGESTION ======================= */}
        {activeTab === "ingestion" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                1 • Field Ingestion
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#172033] tracking-tight">
                Daily Progress Report
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Upload / Capture DPR */}
              <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
                <h2 className="text-sm font-bold text-[#172033] mb-3">Upload / Capture DPR</h2>
                
                <div className="border-2 border-dashed border-[#b9c2d0] rounded-xl p-7 text-center bg-[#fafcff]">
                  <div className="w-10 h-10 mx-auto mb-2 text-slate-600 flex items-center justify-center bg-slate-100 rounded-full">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 mb-0.5">Drop a DPR PDF here</p>
                  <p className="text-xs text-[#667085] mb-4">Prototype extraction will parse the selected report.</p>
                  
                  <label 
                    htmlFor="dpr-file-input"
                    className="inline-block bg-[#0d1830] hover:bg-slate-800 text-white font-semibold text-xs py-2 px-4 rounded-lg cursor-pointer transition"
                  >
                    {isExtracting ? "Extracting with OCR..." : "Choose PDF / Scanned DPR"}
                  </label>
                  <input
                    id="dpr-file-input"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFakeExtract}
                  />
                </div>

                {extractedData && (
                  <div className="mt-4 bg-[#f7fff9] border border-[#b7e3c7] rounded-xl p-4 animate-fadeIn">
                    <div className="flex items-center space-x-2 text-[#157347] font-bold text-xs mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Extraction complete (PDFPlumber OCR Engine)</span>
                    </div>
                    <p className="text-xs text-[#667085] mt-1">
                      <span className="font-semibold text-slate-800">WBS:</span> {extractedData.wbs} • {" "}
                      <span className="font-semibold text-slate-800">Activity:</span> {extractedData.activity} • {" "}
                      <span className="font-semibold text-slate-800">Quantity:</span> {extractedData.quantity} {extractedData.unit} • {" "}
                      <span className="font-semibold text-slate-800">Timestamp:</span> {extractedData.timestamp}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="bg-[#e9f8ef] text-[#157347] px-2 py-0.5 rounded-full text-[10px] font-bold">
                        READY FOR MAPPING
                      </span>
                      <button
                        onClick={() => {
                          setWbsCode(extractedData.wbs);
                          setActivity(extractedData.activity);
                          setQty(extractedData.quantity.toString());
                          showToast("Loaded extracted values into Manual Field Entry");
                        }}
                        className="text-xs text-[#2563eb] font-semibold hover:underline cursor-pointer"
                      >
                        Copy to Form →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Field Entry */}
              <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
                <h2 className="text-sm font-bold text-[#172033] mb-3">Manual Field Entry</h2>
                
                <form onSubmit={handleSubmitFieldUpdate} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#667085] mb-1 font-medium">WBS Code</label>
                      <input 
                        type="text" 
                        value={wbsCode} 
                        onChange={(e) => setWbsCode(e.target.value)}
                        className="w-full p-2 text-xs border border-[#e4e7ec] rounded-lg bg-white focus:outline-none focus:border-blue-500 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#667085] mb-1 font-medium">Activity</label>
                      <input 
                        type="text" 
                        value={activity} 
                        onChange={(e) => setActivity(e.target.value)}
                        className="w-full p-2 text-xs border border-[#e4e7ec] rounded-lg bg-white focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#667085] mb-1 font-medium">Completed Quantity</label>
                      <input 
                        type="number" 
                        value={qty} 
                        onChange={(e) => setQty(e.target.value)}
                        className="w-full p-2 text-xs border border-[#e4e7ec] rounded-lg bg-white focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#667085] mb-1 font-medium">Unit</label>
                      <select 
                        value={unit} 
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full p-2 text-xs border border-[#e4e7ec] rounded-lg bg-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="m³">m³ (Cubic Meters)</option>
                        <option value="m²">m² (Square Meters)</option>
                        <option value="Nos.">Nos. (Units)</option>
                        <option value="m">m (Linear Meters)</option>
                        <option value="MT">MT (Metric Tonnes)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-2 bg-[#1f9d55] hover:bg-[#157347] text-white font-bold text-xs py-2.5 px-4 rounded-lg transition cursor-pointer"
                  >
                    Submit Field Update
                  </button>

                  <p className="text-xs text-[#667085] mt-2">
                    In the full system this maps the submitted quantity directly to the WBS baseline.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 3: SCHEDULE MAPPER ======================= */}
        {activeTab === "schedule" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                3 • WBS Schedule Mapper
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#172033] tracking-tight">
                Actual vs Target Calculator
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Schedule Inputs */}
              <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
                <h2 className="text-sm font-bold text-[#172033] mb-3">Schedule Inputs</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs text-[#667085] mb-1 font-medium">Total Target Quantity</label>
                    <input 
                      type="number" 
                      value={targetQty}
                      onChange={(e) => setTargetQty(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 text-xs border border-[#e4e7ec] rounded-lg bg-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#667085] mb-1 font-medium">Completed Quantity</label>
                    <input 
                      type="number" 
                      value={completedQty}
                      onChange={(e) => setCompletedQty(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 text-xs border border-[#e4e7ec] rounded-lg bg-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#667085] mb-1 font-medium">Planned Progress (%)</label>
                    <input 
                      type="number" 
                      value={plannedProgress}
                      onChange={(e) => setPlannedProgress(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 text-xs border border-[#e4e7ec] rounded-lg bg-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#667085] mb-1 font-medium">WBS Task</label>
                    <input 
                      type="text" 
                      value={calcWbs}
                      onChange={(e) => setCalcWbs(e.target.value)}
                      className="w-full p-2 text-xs border border-[#e4e7ec] rounded-lg bg-white focus:outline-none focus:border-blue-500 font-mono" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleCalculate}
                  className="w-full bg-[#0d1830] hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition cursor-pointer"
                >
                  Calculate Deviation
                </button>
              </div>

              {/* Calculation Output */}
              <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#172033] mb-3">Calculation Output</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#667085]">Actual completion percentage</p>
                      <div className="text-2xl font-extrabold text-[#1f9d55] mt-0.5">
                        {calcResult.actual}%
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[#667085]">Schedule deviation Δ = Pactual − Pplanned</p>
                      <div className={`text-2xl font-extrabold mt-0.5 ${calcResult.delta < 0 ? "text-[#dc3545]" : "text-[#1f9d55]"}`}>
                        {calcResult.delta >= 0 ? `+${calcResult.delta}%` : `${calcResult.delta}%`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    calcResult.status === "DELAY" 
                      ? "bg-[#fdebed] text-[#b42318]" 
                      : "bg-[#e9f8ef] text-[#157347]"
                  }`}>
                    {calcResult.status === "DELAY" ? "DELAY ALERT" : "ON TRACK"}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Task: {calcWbs}</span>
                </div>
              </div>
            </div>

            {/* Mapping Flow Timeline */}
            <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
              <h2 className="text-sm font-bold text-[#172033] mb-4">Mapping Flow</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="border-t-4 border-[#1f9d55] p-3.5 bg-slate-50 rounded-b-lg">
                  <h3 className="text-xs font-bold text-slate-900 mb-1">1. FIELD REPORT</h3>
                  <p className="text-xs text-[#667085]">Site form / DPR PDF</p>
                </div>

                <div className="border-t-4 border-[#1f9d55] p-3.5 bg-slate-50 rounded-b-lg">
                  <h3 className="text-xs font-bold text-slate-900 mb-1">2. EXTRACTION</h3>
                  <p className="text-xs text-[#667085]">PDFPlumber / OCR</p>
                </div>

                <div className="border-t-4 border-[#2563eb] p-3.5 bg-slate-50 rounded-b-lg">
                  <h3 className="text-xs font-bold text-slate-900 mb-1">3. WBS MAPPING</h3>
                  <p className="text-xs text-[#667085]">Quantity → baseline task</p>
                </div>

                <div className="border-t-4 border-[#9b5de5] p-3.5 bg-slate-50 rounded-b-lg">
                  <h3 className="text-xs font-bold text-slate-900 mb-1">4. DASHBOARD</h3>
                  <p className="text-xs text-[#667085]">Real-time variance alert</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: DELAY ALERTS ======================= */}
        {activeTab === "alerts" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  4 • Executive Dashboard
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#172033] tracking-tight">
                  Delay Alerts
                </h1>
              </div>
              <span className="bg-[#fdebed] text-[#b42318] border border-rose-200 px-3 py-1 rounded-full text-xs font-bold">
                {openAlerts.length || 3} OPEN
              </span>
            </div>

            <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs space-y-3">
              <div className="border-l-4 border-[#dc3545] p-4 bg-[#fff7f7] rounded-r-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <b className="text-xs text-slate-900">CRITICAL • STR-02-04</b>
                    <p className="text-xs text-[#667085] mt-1">
                      RCC slab casting is 9% behind plan. Review critical-path impact and assign extra batching plant capacity.
                    </p>
                  </div>
                  <button 
                    onClick={() => showToast("Mitigation plan dispatched to contractor L&T")}
                    className="text-xs text-rose-700 font-bold hover:underline cursor-pointer ml-3 shrink-0"
                  >
                    Action
                  </button>
                </div>
              </div>

              <div className="border-l-4 border-[#d97706] p-4 bg-[#fffbf4] rounded-r-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <b className="text-xs text-slate-900">WATCH • FIN-04-03</b>
                    <p className="text-xs text-[#667085] mt-1">
                      Internal plastering is 7% behind plan. Material delivery scheduled for tomorrow.
                    </p>
                  </div>
                  <button 
                    onClick={() => showToast("Inspection team notified")}
                    className="text-xs text-amber-700 font-bold hover:underline cursor-pointer ml-3 shrink-0"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>

              <div className="border-l-4 border-[#2563eb] p-4 bg-[#f7faff] rounded-r-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <b className="text-xs text-slate-900">INFO • SITE-03</b>
                    <p className="text-xs text-[#667085] mt-1">
                      Remote-site upload queue synchronized after network restoration. 14 pending entries verified.
                    </p>
                  </div>
                  <button 
                    onClick={() => showToast("Queue marked synchronized")}
                    className="text-xs text-blue-700 font-bold hover:underline cursor-pointer ml-3 shrink-0"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 5: ROADMAP ======================= */}
        {activeTab === "roadmap" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Implementation Roadmap
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#172033] tracking-tight">
                From Monitor → Predict → Decide
              </h1>
            </div>

            {/* 3 Core Roadmap Phases */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
                <span className="bg-[#e9f8ef] text-[#157347] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  PHASE 1 • MVP
                </span>
                <h2 className="text-sm font-bold text-[#172033] mt-3 mb-1.5">MONITOR</h2>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Data capture, DPR extraction, WBS schedule mapping, actual-vs-target calculations and automated summary reports.
                </p>
              </div>

              <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
                <span className="bg-[#eef6ff] text-[#175cd3] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  PHASE 2
                </span>
                <h2 className="text-sm font-bold text-[#172033] mt-3 mb-1.5">PREDICT</h2>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Future schedule-slip forecasting, budget-vs-progress correlation, resource utilization and weather-risk ingestion.
                </p>
              </div>

              <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
                <span className="bg-[#f5edff] text-[#6941c6] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  PHASE 3
                </span>
                <h2 className="text-sm font-bold text-[#172033] mt-3 mb-1.5">DECIDE</h2>
                <p className="text-xs text-[#667085] leading-relaxed">
                  AI project assistant, “what-if” schedule simulations and dynamic resource recommendations.
                </p>
              </div>
            </div>

            {/* Prototype Technology Stack */}
            <div className="bg-white border border-[#e4e7ec] rounded-xl p-5 shadow-2xs">
              <h2 className="text-sm font-bold text-[#172033] mb-3">Prototype Technology Stack</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e4e7ec] text-[#667085]">
                      <th className="py-2.5 px-2 font-semibold">Layer</th>
                      <th className="py-2.5 px-2 font-semibold">Planned Technology</th>
                      <th className="py-2.5 px-2 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4e7ec]">
                    <tr>
                      <td className="py-2.5 px-2 font-semibold text-slate-900">Frontend</td>
                      <td className="py-2.5 px-2 font-mono text-slate-700">React.js + Tailwind CSS</td>
                      <td className="py-2.5 px-2 text-[#667085]">Gantt charts, deviation graphs, web forms</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 font-semibold text-slate-900">Backend</td>
                      <td className="py-2.5 px-2 font-mono text-slate-700">Python FastAPI / Express</td>
                      <td className="py-2.5 px-2 text-[#667085]">Schedule math, WBS linking, REST APIs</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 font-semibold text-slate-900">Extraction</td>
                      <td className="py-2.5 px-2 font-mono text-slate-700">PDFPlumber / OCR</td>
                      <td className="py-2.5 px-2 text-[#667085]">Convert unstructured DPRs into metrics</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 font-semibold text-slate-900">Database</td>
                      <td className="py-2.5 px-2 font-mono text-slate-700">PostgreSQL / SQLite</td>
                      <td className="py-2.5 px-2 text-[#667085]">WBS schedules, daily logs, project baselines</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Footer */}
      <footer className="mt-auto py-3 px-6 text-center text-xs text-[#98a2b3] border-t border-slate-200 bg-white">
        SIH26122 • Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management • Phase 1 demonstration prototype
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center space-x-2 animate-slideUp z-50">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
