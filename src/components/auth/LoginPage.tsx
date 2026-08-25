import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  HardHat,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Award,
  Users,
  Compass,
  FileCheck,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin, setActiveView } = useApp();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address (e.g., pm@infravision.ai).");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email.trim(), password, rememberMe);
      if (!res.success) {
        setErrorMessage(res.error || "Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to connect to authentication service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await quickDemoLogin(demoEmail);
    } catch (err: any) {
      setErrorMessage(err.message || "Quick demo login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex flex-col justify-between overflow-y-auto selection:bg-blue-600 selection:text-white relative">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

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
              National Infrastructure Monitoring & Computer Vision Telemetry
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-xs">
          <span className="text-slate-400 font-medium">Smart India Hackathon 2026 Prototype</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 font-bold">MoRTH & NHAI Compliant</span>
        </div>
      </header>

      {/* Main Authentication Grid */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero & SIH Overview */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-900/40 border border-blue-700/50 px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI-Powered Real-Time Project Telemetry</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Unified Infrastructure Command Center
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Automated computer vision stage detection, S-Curve planned vs. actual progress tracking, IRC:37 delay predictions, and DPR document OCR extraction for mega highway & transit corridors.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1 shadow-sm">
                <div className="flex items-center space-x-2 text-blue-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-200">Gemini 3.7 Vision</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  94.8% accuracy on construction stage & equipment detection
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1 shadow-sm">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-200">4 Active Corridors</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  ₹16,600 Cr portfolio across Highways, Metro, Urban & Ports
                </p>
              </div>
            </div>

            {/* SIH Evaluation Notice */}
            <div className="p-4 bg-gradient-to-r from-blue-950/60 to-slate-900/80 border border-blue-800/40 rounded-2xl flex items-start space-x-3">
              <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-white">SIH 2026 Jury & Evaluator Guide</p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Sign in with any pre-seeded demo role or create a new evaluator account to test full database persistence.
                </p>
              </div>
            </div>
          </div>

          {/* Right Login Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
              
              <div className="mb-6">
                <h2 className="text-xl font-black text-white tracking-tight">Sign In to InfraVision</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your credentials to access live project telemetry
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-2.5 text-rose-300 text-xs animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. pm@infravision.ai"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Security Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/20"
                    />
                    <span>Remember me on this browser</span>
                  </label>
                  <span className="text-[10px] text-slate-500">JWT Token Auth</span>
                </div>

                {/* Submit Button */}
                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating Credentials...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* One-Click Quick Demo Switcher for SIH Evaluators */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Demo Credentials (for judges):</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                    Pass: demo123
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("manager@infravision.ai")}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-blue-300">
                        Project Manager
                      </span>
                      <span className="text-[9px] bg-blue-900/60 text-blue-300 font-bold px-1.5 py-0.2 rounded">
                        NHAI
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">manager@infravision.ai</p>
                    <div className="mt-1 text-[9px] text-blue-400 font-semibold group-hover:underline flex items-center space-x-1">
                      <span>Click to Test</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("engineer@infravision.ai")}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                        Site Engineer
                      </span>
                      <span className="text-[9px] bg-emerald-900/60 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                        L&T
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">engineer@infravision.ai</p>
                    <div className="mt-1 text-[9px] text-emerald-400 font-semibold group-hover:underline flex items-center space-x-1">
                      <span>Click to Test</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@infravision.ai")}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-purple-300">
                        Administrator
                      </span>
                      <span className="text-[9px] bg-purple-900/60 text-purple-300 font-bold px-1.5 py-0.2 rounded">
                        MoRTH
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">admin@infravision.ai</p>
                    <div className="mt-1 text-[9px] text-purple-400 font-semibold group-hover:underline flex items-center space-x-1">
                      <span>Click to Test</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </button>
                </div>

                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("judge@sih.gov.in")}
                    className="w-full p-2 bg-gradient-to-r from-amber-500/10 to-blue-500/10 hover:from-amber-500/20 hover:to-blue-500/20 border border-amber-500/30 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-amber-200">
                        SIH 2026 Jury Evaluator Account
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-300">judge@sih.gov.in</span>
                  </button>
                </div>
              </div>

              {/* Sign up Link */}
              <div className="mt-6 text-center text-xs text-slate-400">
                Don't have an engineering account?{" "}
                <button
                  id="link-to-signup"
                  type="button"
                  onClick={() => setActiveView("signup")}
                  className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4 cursor-pointer ml-1"
                >
                  Create Judge / Engineer Account
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-900">
        <div>
          InfraVision AI • Built for Smart India Hackathon (SIH 2026) • Problem Statement #SIH1680
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <span>NHAI / MoRTH Spec Section 500</span>
          <span>IRC:37-2018 Standards</span>
          <span className="text-slate-400">All sample passwords: <strong>password123</strong></span>
        </div>
      </footer>

      {/* Forgot Password Demo Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black">SIH Demo Credentials Notice</h3>
                <p className="text-xs text-slate-400">Prototype Authentication System</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">All demo accounts share the following password:</p>
              <div className="p-2 bg-slate-900 rounded-xl font-mono text-center text-amber-300 font-bold text-sm tracking-wider border border-amber-500/20">
                password123
              </div>
              <p className="text-[11px] text-slate-400">
                In production, password resets are dispatched via Government NIC SMS gateway & official MoRTH email service.
              </p>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Understood, Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
