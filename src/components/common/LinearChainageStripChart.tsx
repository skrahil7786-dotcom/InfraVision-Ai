import React, { useState } from "react";
import {
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
  ShieldCheck,
  Truck,
  Activity,
  Filter,
  Maximize2,
} from "lucide-react";

interface ChainageSegment {
  chainageId: string;
  startKm: number;
  endKm: number;
  label: string;
  embankment: "COMPLETED" | "IN_PROGRESS" | "DELAYED" | "PENDING";
  gsb: "COMPLETED" | "IN_PROGRESS" | "DELAYED" | "PENDING";
  wmm: "COMPLETED" | "IN_PROGRESS" | "DELAYED" | "PENDING";
  dbm: "COMPLETED" | "IN_PROGRESS" | "DELAYED" | "PENDING";
  bc: "COMPLETED" | "IN_PROGRESS" | "DELAYED" | "PENDING";
  structures: "COMPLETED" | "IN_PROGRESS" | "DELAYED" | "PENDING" | "NONE";
  compactionDensity: number; // in %
  soilMoistureOptimum: number; // in %
  lastInspectionDate: string;
  assignedContractor: string;
  issues?: string;
  photoUrl?: string;
}

const SAMPLE_CHAINAGE_DATA: ChainageSegment[] = [
  {
    chainageId: "ch-120-124",
    startKm: 120,
    endKm: 124,
    label: "Km 120+000 → 124+000",
    embankment: "COMPLETED",
    gsb: "COMPLETED",
    wmm: "COMPLETED",
    dbm: "COMPLETED",
    bc: "COMPLETED",
    structures: "COMPLETED",
    compactionDensity: 99.2,
    soilMoistureOptimum: 11.4,
    lastInspectionDate: "2026-08-20",
    assignedContractor: "Larsen & Toubro Ltd.",
    issues: "None — Handover inspection clearance approved.",
  },
  {
    chainageId: "ch-124-128",
    startKm: 124,
    endKm: 128,
    label: "Km 124+000 → 128+000",
    embankment: "COMPLETED",
    gsb: "COMPLETED",
    wmm: "COMPLETED",
    dbm: "COMPLETED",
    bc: "IN_PROGRESS",
    structures: "COMPLETED",
    compactionDensity: 98.6,
    soilMoistureOptimum: 12.1,
    lastInspectionDate: "2026-08-22",
    assignedContractor: "Larsen & Toubro Ltd.",
    issues: "Final 40mm Bituminous Concrete wearing coat laying underway.",
  },
  {
    chainageId: "ch-128-132",
    startKm: 128,
    endKm: 132,
    label: "Km 128+000 → 132+000",
    embankment: "COMPLETED",
    gsb: "COMPLETED",
    wmm: "COMPLETED",
    dbm: "COMPLETED",
    bc: "PENDING",
    structures: "IN_PROGRESS",
    compactionDensity: 98.1,
    soilMoistureOptimum: 11.8,
    lastInspectionDate: "2026-08-23",
    assignedContractor: "Larsen & Toubro Ltd.",
    issues: "Minor Bridge girder launching at Ch 130+200 scheduled this week.",
  },
  {
    chainageId: "ch-132-136",
    startKm: 132,
    endKm: 136,
    label: "Km 132+000 → 136+000 (Bottleneck Zone)",
    embankment: "COMPLETED",
    gsb: "COMPLETED",
    wmm: "COMPLETED",
    dbm: "DELAYED",
    bc: "PENDING",
    structures: "IN_PROGRESS",
    compactionDensity: 97.4,
    soilMoistureOptimum: 13.2,
    lastInspectionDate: "2026-08-24",
    assignedContractor: "Apex Roadways JV",
    issues: "Dense Bituminous Macadam lag due to batching plant aggregate shortage.",
  },
  {
    chainageId: "ch-136-140",
    startKm: 136,
    endKm: 140,
    label: "Km 136+000 → 140+000",
    embankment: "COMPLETED",
    gsb: "COMPLETED",
    wmm: "IN_PROGRESS",
    dbm: "PENDING",
    bc: "PENDING",
    structures: "DELAYED",
    compactionDensity: 96.8,
    soilMoistureOptimum: 12.9,
    lastInspectionDate: "2026-08-19",
    assignedContractor: "Apex Roadways JV",
    issues: "Culvert Box casting delay due to canal water diversion permit.",
  },
  {
    chainageId: "ch-140-144",
    startKm: 140,
    endKm: 144,
    label: "Km 140+000 → 144+000",
    embankment: "COMPLETED",
    gsb: "IN_PROGRESS",
    wmm: "PENDING",
    dbm: "PENDING",
    bc: "PENDING",
    structures: "PENDING",
    compactionDensity: 97.9,
    soilMoistureOptimum: 11.6,
    lastInspectionDate: "2026-08-21",
    assignedContractor: "Larsen & Toubro Ltd.",
    issues: "Granular Sub-Base spreading in progress; nuclear density gauge test pending.",
  },
  {
    chainageId: "ch-144-148",
    startKm: 144,
    endKm: 148,
    label: "Km 144+000 → 148+000",
    embankment: "IN_PROGRESS",
    gsb: "PENDING",
    wmm: "PENDING",
    dbm: "PENDING",
    bc: "PENDING",
    structures: "PENDING",
    compactionDensity: 95.8,
    soilMoistureOptimum: 14.1,
    lastInspectionDate: "2026-08-18",
    assignedContractor: "GMR Infra Sub",
    issues: "Fly-ash embankment filling; moisture conditioning in progress.",
  },
  {
    chainageId: "ch-148-152",
    startKm: 148,
    endKm: 152,
    label: "Km 148+000 → 152+000 (Forest Corridor)",
    embankment: "DELAYED",
    gsb: "PENDING",
    wmm: "PENDING",
    dbm: "PENDING",
    bc: "PENDING",
    structures: "PENDING",
    compactionDensity: 94.2,
    soilMoistureOptimum: 15.0,
    lastInspectionDate: "2026-08-17",
    assignedContractor: "GMR Infra Sub",
    issues: "Tree felling clearance stage-2 completed; earthmoving resumed.",
  },
  {
    chainageId: "ch-152-156",
    startKm: 152,
    endKm: 156,
    label: "Km 152+000 → 156+000",
    embankment: "COMPLETED",
    gsb: "COMPLETED",
    wmm: "IN_PROGRESS",
    dbm: "PENDING",
    bc: "PENDING",
    structures: "COMPLETED",
    compactionDensity: 98.4,
    soilMoistureOptimum: 12.0,
    lastInspectionDate: "2026-08-22",
    assignedContractor: "Larsen & Toubro Ltd.",
    issues: "Pugmill WMM mixing continuous; prime coat spraying next.",
  },
  {
    chainageId: "ch-156-160",
    startKm: 156,
    endKm: 160,
    label: "Km 156+000 → 160+000 (Interchange Node)",
    embankment: "COMPLETED",
    gsb: "COMPLETED",
    wmm: "COMPLETED",
    dbm: "IN_PROGRESS",
    bc: "PENDING",
    structures: "IN_PROGRESS",
    compactionDensity: 98.7,
    soilMoistureOptimum: 11.9,
    lastInspectionDate: "2026-08-23",
    assignedContractor: "Larsen & Toubro Ltd.",
    issues: "Toll plaza foundation and trumpet interchange ramp earthwork active.",
  },
];

const LAYER_CONFIG = [
  { key: "bc", name: "Bituminous Concrete (BC)", thickness: "40 mm", color: "from-slate-900 to-slate-800", textColor: "text-slate-900", desc: "Top Wearing Surface Course (MoRTH Sec 507)" },
  { key: "dbm", name: "Dense Bituminous Macadam (DBM)", thickness: "75 mm", color: "from-blue-700 to-indigo-800", textColor: "text-blue-700", desc: "Structural Binder Asphalt Layer (MoRTH Sec 505)" },
  { key: "wmm", name: "Wet Mix Macadam (WMM)", thickness: "250 mm", color: "from-amber-600 to-amber-700", textColor: "text-amber-700", desc: "Crushed Graded Aggregate Base (MoRTH Sec 406)" },
  { key: "gsb", name: "Granular Sub-Base (GSB)", thickness: "200 mm", color: "from-yellow-500 to-amber-500", textColor: "text-yellow-700", desc: "Drainage & Structural Sub-Base (MoRTH Sec 401)" },
  { key: "embankment", name: "Subgrade & Embankment", thickness: "500 mm", color: "from-stone-600 to-stone-700", textColor: "text-stone-700", desc: "Compacted Earth Subgrade CBR ≥ 10% (MoRTH Sec 305)" },
  { key: "structures", name: "Bridges & Cross Drainage", thickness: "RCC", color: "from-purple-600 to-indigo-600", textColor: "text-purple-700", desc: "Minor Bridges, Culverts & Underpasses (IS:456 / IRC:112)" },
];

export const LinearChainageStripChart: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<ChainageSegment>(SAMPLE_CHAINAGE_DATA[3]); // Ch 132-136
  const [activeLayerFilter, setActiveLayerFilter] = useState<string>("ALL");

  const getStatusBg = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500 hover:bg-emerald-400 text-white shadow-xs";
      case "IN_PROGRESS":
        return "bg-blue-500 hover:bg-blue-400 text-white animate-pulse";
      case "DELAYED":
        return "bg-rose-500 hover:bg-rose-400 text-white ring-2 ring-rose-400/50";
      case "PENDING":
      default:
        return "bg-slate-200 hover:bg-slate-300 text-slate-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Completed</span>;
      case "IN_PROGRESS":
        return <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">In Progress</span>;
      case "DELAYED":
        return <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Delayed Lag</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Pending</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Activity className="w-3 h-3 text-blue-600" />
              <span>BIM/GIS Linear Strip Chart</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">Km 120+000 to Km 160+000 (40.0 km Total)</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center space-x-2">
            <span>Pavement Structural Cross-Section by Chainage</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time layer-by-layer progress visualization compliant with MoRTH Specifications for Road & Bridge Works (5th Revision).
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>
            <span className="text-slate-700 font-semibold text-[11px]">Completed Layer</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>
            <span className="text-slate-700 font-semibold text-[11px]">Active Laying</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-500"></div>
            <span className="text-slate-700 font-semibold text-[11px]">Schedule Slippage</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-200"></div>
            <span className="text-slate-700 font-semibold text-[11px]">Upcoming</span>
          </div>
        </div>
      </div>

      {/* The Linear Highway Strip Chart (Cross Section Grid) */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[760px] space-y-2">
          {/* Top Chainage Distance Markers */}
          <div className="grid grid-cols-10 gap-1 text-center font-mono text-[10px] font-bold text-slate-500 pb-1 border-b border-slate-200">
            {SAMPLE_CHAINAGE_DATA.map((seg) => (
              <div
                key={seg.chainageId}
                onClick={() => setSelectedSegment(seg)}
                className={`py-1 cursor-pointer rounded-lg transition-all ${
                  selectedSegment.chainageId === seg.chainageId
                    ? "bg-blue-600 text-white font-black scale-105 shadow-sm"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                Km {seg.startKm} - {seg.endKm}
              </div>
            ))}
          </div>

          {/* Layer Rows */}
          {LAYER_CONFIG.map((layer) => {
            return (
              <div key={layer.key} className="flex items-center space-x-2">
                <div className="w-48 shrink-0 text-right pr-2">
                  <span className={`text-[11px] font-black block leading-tight ${layer.textColor}`}>
                    {layer.name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    Thk: {layer.thickness}
                  </span>
                </div>

                {/* 10 Segment Columns */}
                <div className="grid grid-cols-10 gap-1 flex-1">
                  {SAMPLE_CHAINAGE_DATA.map((seg) => {
                    const status = (seg as any)[layer.key] || "PENDING";
                    const isSelected = selectedSegment.chainageId === seg.chainageId;

                    return (
                      <button
                        key={seg.chainageId}
                        onClick={() => setSelectedSegment(seg)}
                        title={`${layer.name} @ ${seg.label} — Status: ${status}`}
                        className={`h-7 rounded-lg transition-all transform cursor-pointer flex items-center justify-center font-mono text-[9px] font-bold ${getStatusBg(
                          status
                        )} ${
                          isSelected ? "ring-2 ring-blue-600 ring-offset-1 scale-105" : ""
                        }`}
                      >
                        {status === "COMPLETED" && "✓"}
                        {status === "DELAYED" && "!"}
                        {status === "IN_PROGRESS" && "⋯"}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Segment Inspection Intelligence Card */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base font-black text-slate-900">{selectedSegment.label}</h4>
                {selectedSegment.issues?.includes("lag") || selectedSegment.issues?.includes("delay") ? (
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>Critical Slippage Zone</span>
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Quality Verified Segment</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Contractor: <strong className="text-slate-700">{selectedSegment.assignedContractor}</strong> • Last QA Inspection: <span className="font-mono">{selectedSegment.lastInspectionDate}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Proctor Density</span>
              <span className="font-black text-emerald-700 font-mono text-sm">{selectedSegment.compactionDensity}%</span>
              <span className="text-[9px] text-slate-400 block">Spec ≥ 98%</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Moisture Content (OMC)</span>
              <span className="font-black text-blue-700 font-mono text-sm">{selectedSegment.soilMoistureOptimum}%</span>
              <span className="text-[9px] text-slate-400 block">Tol ± 1%</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Layer QA Status</span>
              <span className="font-black text-indigo-700 text-xs mt-1 block">MoRTH Verified</span>
            </div>
          </div>
        </div>

        {/* Layer-by-Layer Status Pill Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-4">
          {LAYER_CONFIG.map((layer) => {
            const status = (selectedSegment as any)[layer.key] || "PENDING";
            return (
              <div key={layer.key} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">
                  {layer.key.toUpperCase()}
                </span>
                <span className="text-xs font-black text-slate-900 block truncate">
                  {layer.name.split(" ")[0]}
                </span>
                <div>{getStatusBadge(status)}</div>
              </div>
            );
          })}
        </div>

        {/* Site Engineer Field Notes & AI Diagnostics */}
        <div className="mt-4 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-blue-900 leading-relaxed">
            <strong className="font-bold text-blue-950">Field Engineer Observation & AI Schedule Impact: </strong>
            {selectedSegment.issues}
          </div>
        </div>
      </div>
    </div>
  );
};
