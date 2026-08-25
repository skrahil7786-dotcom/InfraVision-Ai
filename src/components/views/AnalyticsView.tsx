import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Sliders,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
  Calculator,
  Scale,
  FileCheck2,
  TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const AnalyticsView: React.FC = () => {
  const { analytics, sCurveData, projects, selectedProjectId } = useApp();

  // Interactive delay risk calculator state
  const [calcPlanned, setCalcPlanned] = useState<number>(70);
  const [calcActual, setCalcActual] = useState<number>(52);

  // Liquidated Damages Simulation state
  const [ldDelayDays, setLdDelayDays] = useState<number>(14);
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const contractValueCr = currentProject?.budgetCr || 4850;
  // 0.05% per day, capped at 10%
  const dailyLdRate = 0.0005;
  const calculatedLdCr = Number(
    Math.min(contractValueCr * 0.1, contractValueCr * dailyLdRate * ldDelayDays).toFixed(2)
  );

  const calcDeviation = Number((calcActual - calcPlanned).toFixed(1));
  const calcPredictedDelay = calcDeviation < 0 ? Math.round(Math.abs(calcDeviation) * 0.5) : 0;
  const calcRiskLevel = calcDeviation < -15 ? "HIGH" : calcDeviation < -5 ? "MEDIUM" : "LOW";

  // EVM metrics
  const pv = 2716; // Planned Value in Cr
  const ev = 2337; // Earned Value in Cr (Physical 48.2%)
  const ac = 2640; // Actual Cost Incurred in Cr
  const spi = Number((ev / pv).toFixed(2)); // 0.86
  const cpi = Number((ev / ac).toFixed(2)); // 0.88
  const sv = ev - pv; // -379 Cr
  const cv = ev - ac; // -303 Cr
  const financialProgress = 54.4;
  const physicalProgress = 48.2;
  const billingDiscrepancy = Number((financialProgress - physicalProgress).toFixed(1)); // +6.2%

  const sectorData = [
    { name: "Highways", budget: 4850, count: 1, color: "#3b82f6" },
    { name: "Metro Rail", budget: 6200, count: 1, color: "#8b5cf6" },
    { name: "Smart Urban", budget: 2150, count: 1, color: "#10b981" },
    { name: "Water Ports", budget: 3400, count: 1, color: "#06b6d4" },
  ];

  const evmComparisonData = [
    { metric: "Planned Value (PV)", amountCr: pv, fill: "#3b82f6" },
    { metric: "Actual Cost (AC)", amountCr: ac, fill: "#f59e0b" },
    { metric: "Earned Value (EV)", amountCr: ev, fill: "#10b981" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              EVM & Statutory Compliance
            </span>
            <span className="text-xs text-slate-500 font-mono">IRC:SP:72 & FIDIC Clause 8.7</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Progress Analytics & Earned Value (EVA) Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Predictive delay calculations, physical vs. financial invoice auditing, and statutory liquidated damages modeling.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Schedule Index (SPI)</span>
            <span className={`font-black text-sm ${spi < 1 ? "text-rose-600" : "text-emerald-600"}`}>
              {spi} <span className="text-[10px] font-normal">({spi < 1 ? "Lagging" : "Ahead"})</span>
            </span>
          </div>
          <div className="h-7 w-[1px] bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Cost Index (CPI)</span>
            <span className={`font-black text-sm ${cpi < 1 ? "text-amber-600" : "text-emerald-600"}`}>
              {cpi} <span className="text-[10px] font-normal">({cpi < 1 ? "Cost Overrun" : "Under Budget"})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-xs font-bold text-blue-700 uppercase">Avg. Planned Progress</p>
          <p className="text-3xl font-black text-blue-950">{analytics?.avgPlanned || 56}%</p>
          <span className="text-[11px] text-blue-600 font-medium">Across all corridors</span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p className="text-xs font-bold text-emerald-700 uppercase">Avg. Actual Achieved</p>
          <p className="text-3xl font-black text-emerald-950">{analytics?.avgActual || 44}%</p>
          <span className="text-[11px] text-emerald-700 font-medium">AI & DPR Verified</span>
        </div>

        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
          <p className="text-xs font-bold text-rose-700 uppercase">Portfolio Deviation</p>
          <p className="text-3xl font-black text-rose-950">{analytics?.avgDeviation || -12}%</p>
          <span className="text-[11px] text-rose-600 font-medium">Net Schedule Variance</span>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
          <p className="text-xs font-bold text-amber-700 uppercase">Total Portfolio Capital</p>
          <p className="text-3xl font-black text-amber-950">₹{analytics?.totalBudgetCr || 16600} <span className="text-base font-bold">Cr</span></p>
          <span className="text-[11px] text-amber-700 font-medium">Spent: ₹{analytics?.totalSpentCr || 8946} Cr</span>
        </div>
      </div>

      {/* Financial vs Physical Progress Audit Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-base">
              Financial Disbursement vs. Verified Physical Output Discrepancy
            </h3>
          </div>
          <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
            Discrepancy: +{billingDiscrepancy}% (₹{Math.round(contractValueCr * (billingDiscrepancy / 100))} Cr Front-Loaded)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-bold uppercase text-[10px] block">Contractor Financial Invoiced</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{financialProgress}%</span>
            <p className="text-slate-500 mt-1">₹2,640 Cr claimed under RA Bills 1–18</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-bold uppercase text-[10px] block">AI & Drone Verified Physical Delivery</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{physicalProgress}%</span>
            <p className="text-slate-500 mt-1">₹2,337 Cr worth of inspected pavement in place</p>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col justify-between">
            <div>
              <span className="text-rose-700 font-bold uppercase text-[10px] block">NHAI Audit Recommendation</span>
              <p className="text-rose-950 font-bold mt-1 text-xs leading-relaxed">
                Withhold ₹303 Cr in RA Bill #19 until Dense Bituminous Macadam (DBM) reaches Chainage 145+000.
              </p>
            </div>
            <span className="text-[10px] font-mono text-rose-700 mt-2 block">Triggered by EVM Cost Variance (CV: -₹303 Cr)</span>
          </div>
        </div>
      </div>

      {/* Interactive SIH Business Logic Simulator Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-lg shadow-slate-900/10">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-base text-white">Interactive SIH Delay Calculation Engine</h3>
        </div>
        <p className="text-xs text-slate-300 mb-6">
          Test the exact formula: If planned progress is <strong>70%</strong> and actual progress is <strong>52%</strong>, the system outputs: <strong>deviation = -18%, status = delayed, risk = high, predicted delay = 9 days</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-blue-400">Planned Target Progress</span>
                <span className="font-mono text-white">{calcPlanned}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={calcPlanned}
                onChange={(e) => setCalcPlanned(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-400">Actual Progress (AI Detected)</span>
                <span className="font-mono text-white">{calcActual}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={calcActual}
                onChange={(e) => setCalcActual(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Real-Time Calculation Output Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Calculated Deviation</span>
              <span
                className={`text-2xl font-black ${
                  calcDeviation < -10 ? "text-rose-400" : calcDeviation < 0 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {calcDeviation > 0 ? `+${calcDeviation}%` : `${calcDeviation}%`}
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Predicted Delay</span>
              <span className="text-2xl font-black text-amber-400">
                {calcPredictedDelay} <span className="text-xs">Days</span>
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Risk Classification</span>
              <span
                className={`text-sm font-extrabold px-2 py-0.5 rounded inline-block mt-1 ${
                  calcRiskLevel === "HIGH"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : calcRiskLevel === "MEDIUM"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {calcRiskLevel} RISK
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Required Catch-up Rate</span>
              <span className="text-xs font-bold text-cyan-300 mt-1 block">
                {calcDeviation < 0 ? `+${(Math.abs(calcDeviation) / 3).toFixed(1)}% / month` : "Nominal pace"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FIDIC Clause 8.7 Liquidated Damages Calculator */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-rose-600" />
          <h3 className="font-black text-slate-900 text-base">
            FIDIC Clause 8.7 / MoRTH Statutory Liquidated Damages (LD) Calculator
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Calculates statutory contractor penalty at <strong>0.05% of Contract Price per day of delay</strong>, up to a legal cap of 10% (₹{contractValueCr * 0.1} Cr).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Simulate Contractor Schedule Delay:</span>
              <span className="font-mono text-rose-700 font-black">{ldDelayDays} Calendar Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={ldDelayDays}
              onChange={(e) => setLdDelayDays(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 Days (On-Time)</span>
              <span>30 Days (Intermediate)</span>
              <span>60 Days (Critical Default)</span>
            </div>
          </div>

          <div className="bg-rose-900 text-white p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-rose-300 font-bold uppercase block">Statutory LD Penalty Assessed</span>
              <span className="text-2xl font-black text-rose-100 mt-1 block">₹{calculatedLdCr} Cr</span>
            </div>
            <span className="text-[10px] text-rose-300 font-mono mt-2">
              Formula: ₹{contractValueCr}Cr × 0.05%/day × {ldDelayDays}d
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts: S-Curve & Sector Capital Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* S-Curve Trajectory Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-900 text-base">Cumulative Progress S-Curve Trajectory</h4>
              <p className="text-xs text-slate-500">Historical performance baseline vs AI verified on-ground completion</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="plannedArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="actualArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: number) => [`${val}%`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Area
                  type="monotone"
                  dataKey="planned"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#plannedArea)"
                  name="Planned Baseline (%)"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fill="url(#actualArea)"
                  name="Actual Achieved (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Capital Allocation & Risk (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Sector Capital Allocation</h4>
            <p className="text-xs text-slate-500 mb-4">Investment across infrastructure domains (₹ Cr)</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="budget"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(val: number) => [`₹${val} Cr`, "Budget"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
              {sectorData.map((sec) => (
                <div key={sec.name} className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.color }}></div>
                  <span className="font-bold text-slate-700">{sec.name}:</span>
                  <span className="text-slate-500">₹{sec.budget}Cr</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
