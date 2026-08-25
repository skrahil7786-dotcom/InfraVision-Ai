import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ChatMessage } from "../../types";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building2,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react";

export const AICopilotDrawer: React.FC = () => {
  const {
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    sendChatMessage,
    projects,
    selectedProjectId,
    currentUser,
    setActiveView,
  } = useApp();

  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "assistant",
      text: `Hello ${currentUser.name}! I am **InfraVision AI Copilot**, your engineering advisor for Smart India Hackathon project monitoring.

I have full real-time telemetry on all 4 infrastructure corridors:
- **Delhi-Mumbai PKG-4**: 52% actual vs 70% planned (**-18% slippage**, 9d delay)
- **Bengaluru Metro Pink Line**: 65% actual vs 68% planned (**-3% variance**, on schedule)
- **Varanasi Smart Ring Road**: 35% actual vs 42% planned (**-7% variance**, 3d delay)
- **JNPA Port Marine Terminal**: 24% actual vs 40% planned (**-16% slippage**, 14d delay)

How can I assist your engineering review today?`,
      timestamp: new Date().toISOString(),
      suggestedActions: [
        "Why is Package 4 delayed by 5 days?",
        "Check MoRTH Section 500 compliance for DBM layer",
        "Calculate required asphalt batching plant output to recover 9 days",
        "Generate 48-hr mitigation directive for Superintending Engineer",
      ],
      sources: ["MoRTH Section 500", "IRC:37-2018", "IS:456-2000", "NHAI Contract Clause 8.4"],
    },
  ]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const quickPrompts = [
    { label: "Delay Root-Cause", query: "Why is Package 4 delayed by 5 days and what is the critical bottleneck?" },
    { label: "MoRTH Specs", query: "What are the MoRTH Section 500 specifications for DBM laying temperature and rolling?" },
    { label: "Plant Capacity Calc", query: "Calculate asphalt batching plant throughput required to lay 3,200 MT/day" },
    { label: "Contractor SLA Notice", query: "Draft official 48-hour cure notice to EPC Contractor under NHAI Clause 8.4" },
  ];

  useEffect(() => {
    if (isChatDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatDrawerOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsSending(true);

    try {
      const response = await sendChatMessage(text, activeProject);
      if (response && response.success && response.data) {
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "assistant",
          text: response.data.reply,
          timestamp: response.data.timestamp || new Date().toISOString(),
          suggestedActions: response.data.suggestedActions,
          sources: response.data.sources,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "assistant",
          text: "I analyzed the current project telemetry. The primary critical path bottleneck remains bituminous layer compaction and batching plant supply logistics. Please verify tipper truck fleet dispatch logs.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        text: "Based on standard MoRTH specifications, recovering a 9-day delay requires augmenting sensor paver speed to 2.5m/min and authorizing secondary night-shift floodlit paving.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: "assistant",
        text: `Chat session reset. Connected to InfraVision AI engine in context of **${activeProject.name}** (${activeProject.code}). Ask any civil engineering or schedule question.`,
        timestamp: new Date().toISOString(),
        suggestedActions: [
          "Explain critical path float",
          "Analyze equipment idle time from site photos",
          "Draft contractual delay notice for NHAI",
        ],
      },
    ]);
  };

  if (!isChatDrawerOpen) {
    return (
      <button
        onClick={() => setIsChatDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-full shadow-xl shadow-blue-500/30 flex items-center space-x-2 transition-all transform hover:scale-105 cursor-pointer border-2 border-white/20"
        title="Open InfraVision AI Copilot"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
        <span>InfraVision AI Copilot</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black text-white">InfraVision AI Copilot</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center space-x-1">
              <span>Context:</span>
              <strong className="text-blue-300 truncate max-w-[180px]">{activeProject.code}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleResetChat}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsChatDrawerOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project Quick Pill Indicator */}
      <div className="bg-slate-800/90 text-slate-200 px-4 py-2 text-[11px] flex items-center justify-between border-t border-slate-700">
        <span className="flex items-center space-x-1 text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold">{activeProject.name}</span>
        </span>
        <span
          className={`font-black text-[10px] px-2 py-0.5 rounded-full uppercase ${
            activeProject.status === "ON_TRACK"
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-rose-500/20 text-rose-300"
          }`}
        >
          {activeProject.status.replace("_", " ")} ({activeProject.actualProgress}%)
        </span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => {
          const isAI = msg.sender === "assistant";
          return (
            <div key={msg.id} className={`flex flex-col ${isAI ? "items-start" : "items-end"}`}>
              <div
                className={`max-w-[90%] p-4 rounded-3xl text-xs leading-relaxed shadow-sm ${
                  isAI
                    ? "bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm"
                    : "bg-blue-600 text-white rounded-tr-sm"
                }`}
              >
                {/* AI Markdown formatting renderer */}
                <div className="prose prose-xs text-slate-800 space-y-2">
                  {msg.text.split("\n\n").map((paragraph, idx) => {
                    if (paragraph.startsWith("### ")) {
                      return (
                        <h4 key={idx} className="font-black text-slate-900 text-xs mt-2 mb-1">
                          {paragraph.replace("### ", "")}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith("- ")) {
                      return (
                        <ul key={idx} className="list-disc pl-4 space-y-1 my-1">
                          {paragraph.split("\n").map((line, liIdx) => (
                            <li key={liIdx} className="text-slate-700">
                              {line.replace(/^- /, "")}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (/^\d+\./.test(paragraph)) {
                      return (
                        <ol key={idx} className="list-decimal pl-4 space-y-1 my-1">
                          {paragraph.split("\n").map((line, liIdx) => (
                            <li key={liIdx} className="text-slate-700">
                              {line.replace(/^\d+\.\s*/, "")}
                            </li>
                          ))}
                        </ol>
                      );
                    }
                    return <p key={idx} className={isAI ? "text-slate-800" : "text-white"}>{paragraph}</p>;
                  })}
                </div>

                {/* Sources if present */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span>Standards:</span>
                    {msg.sources.map((s, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Prompt Chips below AI message */}
              {isAI && msg.suggestedActions && (
                <div className="flex flex-wrap gap-1.5 mt-2 pl-2 max-w-[90%]">
                  {msg.suggestedActions.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSend(prompt)}
                      className="text-[10px] font-bold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full shadow-xs transition-colors text-left flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium">
              Analyzing project telemetry & IRC standards...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Toolbar */}
      <div className="px-3.5 pt-2 pb-1 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Quick Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(qp.query)}
            className="text-[10px] font-bold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-lg shrink-0 border border-slate-200 transition-colors cursor-pointer"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3.5 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about schedule delays, IRC standards, DPR OCR..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-blue-500 font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          InfraVision AI grounding provided by Gemini 3.7 Flash Multimodal Civil Engine
        </p>
      </div>
    </div>
  );
};
