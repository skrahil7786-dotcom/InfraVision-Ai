import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Project } from "../types";
import { X, Building2, PlusCircle } from "lucide-react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useApp();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [sector, setSector] = useState("Highways & Expressways");
  const [location, setLocation] = useState("");
  const [contractor, setContractor] = useState("");
  const [client, setClient] = useState("");
  const [plannedProgress, setPlannedProgress] = useState(50);
  const [actualProgress, setActualProgress] = useState(40);
  const [budgetTotalCr, setBudgetTotalCr] = useState(2500);
  const [budgetSpentCr, setBudgetSpentCr] = useState(1000);
  const [currentStage, setCurrentStage] = useState("Subgrade Preparation & Earthwork");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    await createProject({
      name,
      code,
      sector,
      location,
      contractor: contractor || "L&T Infrastructure",
      client: client || "NHAI",
      plannedProgress: Number(plannedProgress),
      actualProgress: Number(actualProgress),
      budgetTotalCr: Number(budgetTotalCr),
      budgetSpentCr: Number(budgetSpentCr),
      currentStage,
      status: Number(actualProgress) < Number(plannedProgress) - 10 ? "DELAYED" : "ON_TRACK",
      riskScore: 65,
      predictedDelayDays: Math.max(0, Math.round((plannedProgress - actualProgress) * 0.5)),
      healthIndex: 85,
      targetCompletionDate: "Dec 2026",
      coordinates: [19.076, 72.877],
      workPackages: [
        { id: "wp-1", name: "Earthwork & Subgrade", weightage: 30, planned: 90, actual: 85 },
        { id: "wp-2", name: "Structures & Culverts", weightage: 40, planned: 60, actual: 50 },
        { id: "wp-3", name: "Pavement & Surfacing", weightage: 30, planned: 30, actual: 15 },
      ],
      milestones: [
        { id: "m-1", name: "Foundation & Piling Complete", targetDate: "Aug 2024", status: "COMPLETED", progress: 100 },
        { id: "m-2", name: "Pier Substructure", targetDate: "Dec 2024", status: "IN_PROGRESS", progress: 70 },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 animate-scale-up">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-900 text-lg">Register New Infrastructure Project</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Project Code</label>
              <input
                type="text"
                required
                placeholder="e.g. NHAI-PKG-09"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Highways & Expressways">Highways & Expressways</option>
                <option value="Metro Rail & Bridges">Metro Rail & Bridges</option>
                <option value="Smart City & Urban">Smart City & Urban</option>
                <option value="Water & Ports">Water & Ports</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Pune Outer Ring Road Package 4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Location / Corridor</label>
            <input
              type="text"
              required
              placeholder="e.g. Pune - Solapur Bypass, Maharashtra"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Executing Contractor</label>
              <input
                type="text"
                placeholder="e.g. L&T Construction"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Client Authority</label>
              <input
                type="text"
                placeholder="e.g. NHAI / MSRDC"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Planned Target (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={plannedProgress}
                onChange={(e) => setPlannedProgress(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Actual Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={actualProgress}
                onChange={(e) => setActualProgress(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Corridor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
