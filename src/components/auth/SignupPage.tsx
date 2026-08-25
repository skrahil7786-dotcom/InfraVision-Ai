import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import {
  Cpu,
  Mail,
  Lock,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  HardHat,
  Sparkles,
  Layers,
  Award,
  ChevronLeft,
} from "lucide-react";

export const SignupPage: React.FC = () => {
  const { signup, setActiveView } = useApp();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<UserRole>("PROJECT_MANAGER");
  const [agency, setAgency] = useState<string>("National Highways Authority of India (NHAI)");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const roleOptions: { id: UserRole; title: string; subtitle: string; icon: string }[] = [
    {
      id: "PROJECT_MANAGER",
      title: "Project Manager / PMU",
      subtitle: "Full corridor overview, S-Curve analytics & budget controls",
      icon: "📊",
    },
    {
      id: "SITE_ENGINEER",
      title: "Field Site Engineer",
      subtitle: "Drone photos, AI vision stage detection & DPR logs",
      icon: "🚜",
    },
    {
      id: "GOVERNMENT_INSPECTOR",
      title: "Government Inspector (IAS/MoRTH)",
      subtitle: "National infrastructure health audit & statutory clearances",
      icon: "🏛️",
    },
    {
      id: "CONTRACTOR_ADMIN",
      title: "EPC Contractor Admin",
      subtitle: "Work package schedules, resource allocation & NCR responses",
      icon: "🏗️",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please accept the Infrastructure Project Audit guidelines to proceed.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        agency: agency.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to create account. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex flex-col justify-between overflow-y-auto selection:bg-blue-600 selection:text-white relative">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner Navigation */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight text-white">InfraVision AI</span>
              <span className="bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                SIH 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              National Infrastructure Monitoring & Telemetry Platform
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveView("login")}
          className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>
      </header>

      {/* Main Registration Box */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-6 py-8 flex-1 flex items-center justify-center">
        <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/60">
          
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-blue-900/40 border border-blue-700/50 px-3 py-1 rounded-full text-blue-300 text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH 2026 Evaluator & Stakeholder Registration</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Create Your InfraVision Account</h2>
            <p className="text-xs text-slate-400 mt-1">
              Join the unified national infrastructure monitoring grid
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-2.5 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name and Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Name & Title
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Er. Aditi Verma / Judge Panel"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aditi.verma@nhai.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Select Your Infrastructure Stakeholder Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {roleOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setRole(opt.id);
                      if (opt.id === "PROJECT_MANAGER") setAgency("Bangalore Metro Rail Corporation Ltd (BMRCL)");
                      if (opt.id === "SITE_ENGINEER") setAgency("National Highways Authority of India (NHAI)");
                      if (opt.id === "GOVERNMENT_INSPECTOR") setAgency("Ministry of Road Transport & Highways (MoRTH)");
                      if (opt.id === "CONTRACTOR_ADMIN") setAgency("L&T Heavy Civil Infrastructure");
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                      role === opt.id
                        ? "bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/50 shadow-sm"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{opt.icon}</span>
                      <span className={`text-xs font-bold ${role === opt.id ? "text-blue-300" : "text-slate-200"}`}>
                        {opt.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{opt.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organization / Agency */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Agency / Ministry / Enterprise Organization
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-agency"
                  type="text"
                  required
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  placeholder="e.g. NHAI / MoRTH / BMRCL / L&T Infra"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Password (Min. 6 Characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Terms Acknowledgement */}
            <div className="pt-1">
              <label className="flex items-start space-x-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/20"
                />
                <span className="text-[11px] text-slate-400">
                  I agree to standard national engineering telemetry audit guidelines (IRC:37 and MoRTH compliance standards) and consent to database persistence for this SIH 2026 session.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-signup"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account & Seeding Persistence...</span>
                </div>
              ) : (
                <>
                  <span>Complete Registration & Launch Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800">
            Already have an active account?{" "}
            <button
              id="link-to-login"
              type="button"
              onClick={() => setActiveView("login")}
              className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4 cursor-pointer ml-1"
            >
              Sign in with existing credentials
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-900">
        <div>
          InfraVision AI • Smart India Hackathon 2026 Prototype
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <span>PostgreSQL / In-Memory Seeded Schema</span>
          <span className="text-slate-400">Default Demo Password: <strong>password123</strong></span>
        </div>
      </footer>
    </div>
  );
};
