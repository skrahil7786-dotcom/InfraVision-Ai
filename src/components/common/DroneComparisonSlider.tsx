import React, { useState, useRef } from "react";
import {
  Camera,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MoveHorizontal,
  Maximize2,
  Eye,
  EyeOff,
  Cpu,
} from "lucide-react";

interface DetectionBox {
  id: string;
  label: string;
  confidence: number;
  type: "EQUIPMENT" | "PAVEMENT" | "SAFETY" | "QUALITY";
  x: number; // percentage from left
  y: number; // percentage from top
  width: number;
  height: number;
  details: string;
}

const SAMPLE_DETECTIONS: DetectionBox[] = [
  {
    id: "det-1",
    label: "Vögele Super 2100 Asphalt Paver (Active)",
    confidence: 97.4,
    type: "EQUIPMENT",
    x: 48,
    y: 42,
    width: 28,
    height: 32,
    details: "Sensor screed height 50mm verified. Paving speed: 2.4 m/min.",
  },
  {
    id: "det-2",
    label: "Hamm HD 90 Vibratory Roller",
    confidence: 96.1,
    type: "EQUIPMENT",
    x: 22,
    y: 35,
    width: 22,
    height: 36,
    details: "Pass 4 of 6 breakdown rolling. Temp: 142°C (Optimal).",
  },
  {
    id: "det-3",
    label: "Compacted DBM Layer (MoRTH Sec 505)",
    confidence: 98.8,
    type: "PAVEMENT",
    x: 8,
    y: 55,
    width: 84,
    height: 40,
    details: "Width: 10.5m (6-lane dual carriageway). Zero surface bleeding.",
  },
  {
    id: "det-4",
    label: "Safety PPE Compliance: 100%",
    confidence: 99.2,
    type: "SAFETY",
    x: 35,
    y: 20,
    width: 18,
    height: 18,
    details: "6/6 ground marshals equipped with high-vis jackets & helmets.",
  },
];

export const DroneComparisonSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [selectedDetection, setSelectedDetection] = useState<DetectionBox | null>(SAMPLE_DETECTIONS[0]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Title & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-100 text-indigo-800 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Camera className="w-3 h-3 text-indigo-600" />
              <span>Multi-Temporal Drone AI Photogrammetry</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">Chainage 132+400 (Package 4)</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            Split-Screen Milestone Verification Slider
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare planned baseline grade (left) against today's verified orthomosaic drone scan with automated machine & compaction detection (right).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
              showBoundingBoxes
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showBoundingBoxes ? "AI Detections ON" : "AI Detections OFF"}</span>
          </button>
        </div>
      </div>

      {/* The Split Viewport Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-300 shadow-inner bg-slate-950"
      >
        {/* AFTER / CURRENT DRONE PHOTO (Right Layer / Background) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?auto=format&fit=crop&w=1400&q=80"
            alt="Current Drone Orthomosaic"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-emerald-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-xl border border-emerald-500/30 flex items-center space-x-1.5 shadow-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>TODAY: Verified Drone Scan (25-Aug-2026)</span>
          </div>

          {/* AI Bounding Box Overlays (Visible on the Right side) */}
          {showBoundingBoxes &&
            SAMPLE_DETECTIONS.map((box) => (
              <div
                key={box.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDetection(box);
                }}
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
                className={`absolute border-2 rounded-lg cursor-pointer transition-all ${
                  selectedDetection?.id === box.id
                    ? "border-amber-400 bg-amber-400/20 shadow-lg ring-2 ring-amber-400/50"
                    : "border-cyan-400/80 bg-cyan-500/10 hover:border-cyan-300 hover:bg-cyan-500/20"
                }`}
              >
                <div className="absolute -top-5 left-0 bg-slate-900/90 text-cyan-300 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-cyan-500/30 whitespace-nowrap shadow-xs">
                  {box.label.split(" ")[0]} ({box.confidence}%)
                </div>
              </div>
            ))}
        </div>

        {/* BEFORE / BASELINE LAYER (Left Layer / Clipped) */}
        <div
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1584463699039-389fbff279ba?auto=format&fit=crop&w=1400&q=80"
            alt="Baseline Pre-Construction Grade"
            className="w-full h-full object-cover filter brightness-90 contrast-110"
          />
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-xl border border-slate-700 flex items-center space-x-1.5 shadow-md">
            <span>BASELINE: Pre-Paving Subgrade (01-Aug-2026)</span>
          </div>
        </div>

        {/* The Drag Divider Handle */}
        <div
          style={{ left: `${sliderPosition}%` }}
          className="absolute inset-y-0 w-1 bg-white shadow-2xl z-20 flex items-center justify-center -translate-x-1/2 pointer-events-none"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-xl border border-slate-300 flex items-center justify-center text-slate-800 font-black">
            <MoveHorizontal className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Interactive Detection Details & Inspection Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-indigo-600" />
              <span>Selected AI Detection Inspection</span>
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full">
              Confidence: {selectedDetection?.confidence}%
            </span>
          </div>

          <h4 className="font-black text-slate-900 text-sm">{selectedDetection?.label}</h4>
          <p className="text-slate-600 leading-relaxed">{selectedDetection?.details}</p>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
            {SAMPLE_DETECTIONS.map((det) => (
              <button
                key={det.id}
                onClick={() => setSelectedDetection(det)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  selectedDetection?.id === det.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {det.label.split("(")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4 rounded-2xl border border-indigo-800/60 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-extrabold block">
              MoRTH Section 500 Rating
            </span>
            <span className="text-2xl font-black text-white mt-1 block">98.4% Compliant</span>
            <p className="text-[11px] text-slate-300 mt-1">
              Surface camber (2.5%), layer thickness (50mm ± 4mm), and temperature (142°C) strictly match IRC standards.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
            <span>Ortho-Resolution: 1.2 cm/px</span>
            <span className="text-emerald-400 font-mono">RTK GNSS Valid</span>
          </div>
        </div>
      </div>
    </div>
  );
};
