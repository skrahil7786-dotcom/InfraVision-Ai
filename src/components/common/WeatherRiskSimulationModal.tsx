import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  CloudRain,
  Sun,
  AlertTriangle,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  X,
  Clock,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

interface WeatherRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeatherRiskSimulationModal: React.FC<WeatherRiskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedProjectId, projects, createAlert, alerts } = useApp();

  const [isSimulatingRain, setIsSimulatingRain] = useState<boolean>(false);
  const [rainfallIntensity, setRainfallIntensity] = useState<number>(65); // mm/hr
  const [affectedChainage, setAffectedChainage] = useState<string>("Km 132+000 → 145+000");
  const [simulatedImpactDays, setSimulatedImpactDays] = useState<number>(3.5);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleApplyMonsoonSimulation = async () => {
    setIsSimulatingRain(true);
    try {
      // Inject alert into system
      await createAlert({
        title: `IMD Red Monsoon Warning: Heavy Rainfall (${rainfallIntensity}mm/hr) at ${affectedChainage}`,
        description: `MoRTH Specification Clause 501.3 strictly prohibits Bituminous Concrete and DBM paving during active precipitation. Immediate 48-hr work stoppage required to prevent stripping and raveling defects.`,
        severity: "CRITICAL",
        category: "WEATHER",
        projectId: currentProject.id,
        affectedWbsCode: "3.2",
        assignedOwner: "Er. Rajesh Sharma (Site Engineer)",
        dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split("T")[0],
        aiSuggestedAction: `Issue immediate halt order on Bituminous Laying at ${affectedChainage}. Direct paver crews to deploy tarpaulin covers over hot-mix batching hoppers and initiate unpaved subgrade drainage channels. Expected schedule lag: +${simulatedImpactDays} days.`,
      });

      setFeedbackMessage(
        `IMD Monsoon Stoppage simulated! Critical weather delay alert injected into Risk Center and Schedule Engine.`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetWeather = () => {
    setIsSimulatingRain(false);
    setFeedbackMessage("Weather simulation restored to clear dry conditions (Optimal paving window).");
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/40 border border-blue-400/30 flex items-center justify-center text-cyan-300">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white">
                  IMD Monsoon Weather Risk & Stoppage Engine
                </h3>
                <span className="bg-blue-400/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                  MoRTH Sec 501.3
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Simulate precipitation impact on bitumen paving and schedule re-baselining for {currentProject.name}.
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {feedbackMessage && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold">{feedbackMessage}</span>
            </div>
          )}

          {/* Current Live Weather Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Site Temperature</span>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Thermometer className="w-4 h-4 text-rose-500" />
                <span className="font-black text-slate-800 text-base">{isSimulatingRain ? "24°C" : "32°C"}</span>
              </div>
              <span className="text-[9px] text-slate-500">Min 15°C for DBM</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Precipitation Rate</span>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="font-black text-blue-700 text-base">
                  {isSimulatingRain ? `${rainfallIntensity} mm/h` : "0 mm/h"}
                </span>
              </div>
              <span className="text-[9px] text-slate-500">Threshold: 2 mm/h</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Wind Velocity</span>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Wind className="w-4 h-4 text-indigo-500" />
                <span className="font-black text-slate-800 text-base">{isSimulatingRain ? "38 km/h" : "12 km/h"}</span>
              </div>
              <span className="text-[9px] text-slate-500">Max 40 km/h</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Paving Viability</span>
              <span
                className={`font-black text-xs px-2 py-0.5 rounded-full mt-1.5 inline-block ${
                  isSimulatingRain
                    ? "bg-rose-100 text-rose-800 animate-pulse"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {isSimulatingRain ? "HALTED (WET)" : "OPTIMAL (DRY)"}
              </span>
            </div>
          </div>

          {/* Interactive Scenario Controls */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Configure Monsoon Scenario Parameters</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                  Rainfall Intensity (mm/hr):
                </label>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={rainfallIntensity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRainfallIntensity(val);
                    setSimulatedImpactDays(Number((val * 0.05).toFixed(1)));
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>20 mm (Moderate)</span>
                  <span className="font-bold text-blue-700">{rainfallIntensity} mm/hr</span>
                  <span>120 mm (Cloudburst)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                  Affected Highway Corridor Section:
                </label>
                <select
                  value={affectedChainage}
                  onChange={(e) => setAffectedChainage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="Km 132+000 → 145+000">Km 132+000 → 145+000 (Package 4 Mainline)</option>
                  <option value="Km 120+000 → 132+000">Km 120+000 → 132+000 (Section 1 Completed)</option>
                  <option value="Km 145+000 → 160+000">Km 145+000 → 160+000 (Interchange Node)</option>
                </select>
              </div>
            </div>

            {/* Impact Calculation Preview */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">
                  Simulated Schedule Variance Impact
                </span>
                <span className="font-black text-rose-700 text-sm">
                  +{simulatedImpactDays} Additional Schedule Delay Days
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <span>Task 3.2 (DBM) Paving Halted</span>
                <span className="block font-mono font-bold text-blue-700">MoRTH 501.3 Trigger</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            {isSimulatingRain ? (
              <button
                onClick={handleResetWeather}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Restore Clear Weather</span>
              </button>
            ) : (
              <button
                onClick={handleApplyMonsoonSimulation}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-500/25 transition cursor-pointer"
              >
                <CloudRain className="w-4 h-4 text-cyan-200" />
                <span>Trigger IMD Monsoon Stoppage Alert</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
