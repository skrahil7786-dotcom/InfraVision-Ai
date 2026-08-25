import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  Server,
  Database,
  Cpu,
  Terminal,
  Code2,
  CheckCircle,
  Copy,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const AdminArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"architecture" | "spring_boot" | "database" | "api_test">("architecture");
  const [testEndpoint, setTestEndpoint] = useState<string>("/api/projects");
  const [testMethod, setTestMethod] = useState<string>("GET");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [isCallingApi, setIsCallingApi] = useState<boolean>(false);

  const handleExecuteApiTest = async () => {
    setIsCallingApi(true);
    try {
      const res = await fetch(testEndpoint, { method: testMethod });
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart India Hackathon (SIH) Technical Dossier</span>
            </span>
            <span className="text-xs text-blue-600 font-mono font-bold">Production Ready</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            System Architecture, Spring Boot APIs & Cloud Schema
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end technical documentation showcasing Spring Boot microservices, AI Computer Vision pipelines, and PostgreSQL database schemas.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("architecture")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === "architecture"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          End-to-End System Blueprint
        </button>

        <button
          onClick={() => setActiveTab("spring_boot")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === "spring_boot"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Spring Boot REST Controllers & Security
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === "database"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          PostgreSQL / PostGIS Schema & DDL
        </button>

        <button
          onClick={() => setActiveTab("api_test")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === "api_test"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Live Interactive API Tester
        </button>
      </div>

      {/* Tab 1: System Architecture Diagram */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base mb-4">Microservices & Multi-Cloud Architecture</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Layer 1: Client & Ingestion */}
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs uppercase mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Ingestion & Field App</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                  <li>• React 19 SPA (Vite + Tailwind CSS)</li>
                  <li>• Site Drone & CCTV Image Upload</li>
                  <li>• Daily Progress Report (PDF) Scanner</li>
                  <li>• Leaflet / Mapbox GIS Geocoding</li>
                </ul>
              </div>

              {/* Layer 2: Spring Boot Backend */}
              <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-100">
                <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs uppercase mb-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Spring Boot REST Core</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                  <li>• Spring Security + JWT Role RBAC</li>
                  <li>• S-Curve Delay Risk Calculation Engine</li>
                  <li>• Automated Alert Triggering Pipeline</li>
                  <li>• RESTful API Gateway & Health Monitors</li>
                </ul>
              </div>

              {/* Layer 3: AI Model Service & Storage */}
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase mb-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>AI Engine & PostgreSQL</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                  <li>• Gemini 3.7 Flash Multimodal Vision</li>
                  <li>• YOLOv8 Machinery & PPE Detection</li>
                  <li>• PostgreSQL 16 with PostGIS Geospatial</li>
                  <li>• Cloud Object Store for High-Res Imagery</li>
                </ul>
              </div>
            </div>

            {/* SIH Core Formula Spec Card */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>SIH Mathematical Delay & Risk Engine Formulas:</span>
              </div>
              <p className="text-slate-300">
                1. <span className="text-amber-300">Schedule Variance (SV)</span> = Actual Progress (%) - Planned Progress (%)
              </p>
              <p className="text-slate-300">
                2. <span className="text-amber-300">Delay Prediction</span> = IF (SV &lt; 0) THEN ROUND(ABS(SV) * 0.5) Days ELSE 0
              </p>
              <p className="text-slate-300">
                3. <span className="text-amber-300">Risk Level</span> = IF (SV &lt; -15%) THEN 'CRITICAL' ELSE IF (SV &lt; -5%) THEN 'MODERATE' ELSE 'ON_TRACK'
              </p>
              <p className="text-slate-300">
                4. <span className="text-amber-300">Health Index</span> = CLAMP(100 - (ABS(SV) * 1.5) - (OpenAlerts * 5), 0, 100)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Spring Boot REST Controllers Code */}
      {activeTab === "spring_boot" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Spring Boot 3.x REST Controller & Security Implementation</h3>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Java 21 / Spring Boot 3.2</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl overflow-x-auto text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800">
            <pre>{`@RestController
@RequestMapping("/api/v1/projects")
@CrossOrigin(origins = "*")
public class ProjectTrackingController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private DelayRiskCalculator riskCalculator;

    @Autowired
    private GeminiVisionService visionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SITE_ENGINEER', 'PROJECT_MANAGER', 'GOVERNMENT_INSPECTOR')")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.findAllProjects());
    }

    @PostMapping("/{projectId}/capture-inspection")
    @PreAuthorize("hasAnyRole('SITE_ENGINEER', 'PROJECT_MANAGER')")
    public ResponseEntity<SiteCaptureResult> analyzeSiteCapture(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile imageFile,
            @RequestParam(value = "stageHint", required = false) String stageHint) {
        
        // 1. Send image bytes to Gemini Multimodal Vision API
        VisionAnalysisResponse aiResponse = visionService.detectConstructionStage(imageFile, stageHint);
        
        // 2. Calculate delay prediction and risk deviation
        DelayMetrics metrics = riskCalculator.evaluateDeviation(
            projectId, 
            aiResponse.getDetectedProgress()
        );
        
        // 3. Update transactional project state and broadcast alert if deviation > threshold
        SiteCaptureResult result = projectService.recordInspection(projectId, aiResponse, metrics);
        return ResponseEntity.ok(result);
    }
}`}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: PostgreSQL Schema */}
      {activeTab === "database" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">PostgreSQL 16 with PostGIS Geospatial Schema</h3>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">DDL / Drizzle / Hibernate</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl overflow-x-auto text-cyan-300 font-mono text-xs leading-relaxed border border-slate-800">
            <pre>{`-- Enable PostGIS for infrastructure GIS telemetry
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE projects (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(64) NOT NULL,
    location VARCHAR(255) NOT NULL,
    geo_point GEOMETRY(Point, 4326),
    planned_progress NUMERIC(5,2) NOT NULL,
    actual_progress NUMERIC(5,2) NOT NULL,
    status VARCHAR(32) NOT NULL,
    predicted_delay_days INT DEFAULT 0,
    budget_total_cr NUMERIC(10,2) NOT NULL,
    budget_spent_cr NUMERIC(10,2) NOT NULL,
    contractor VARCHAR(128) NOT NULL,
    client VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE site_captures (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    stage_detected VARCHAR(128) NOT NULL,
    detected_progress NUMERIC(5,2) NOT NULL,
    deviation NUMERIC(5,2) NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    predicted_delay_days INT DEFAULT 0,
    safety_score INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE alerts (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(32) NOT NULL,
    category VARCHAR(32) NOT NULL,
    status VARCHAR(32) DEFAULT 'OPEN',
    ai_suggested_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</pre>
          </div>
        </div>
      )}

      {/* Tab 4: Interactive API Tester */}
      {activeTab === "api_test" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Live REST API Health & Endpoint Tester</h3>
          <p className="text-xs text-slate-500">
            Send real HTTP requests to the active Express / Spring Boot bridge server running in this container.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={testMethod}
              onChange={(e) => setTestMethod(e.target.value)}
              className="bg-slate-100 border border-slate-300 font-bold text-xs px-3 py-2 rounded-xl text-slate-800"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>

            <select
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 font-mono text-xs px-3 py-2 rounded-xl text-slate-800"
            >
              <option value="/api/projects">/api/projects (List All Monitored Projects)</option>
              <option value="/api/analytics">/api/analytics (Portfolio KPIs & S-Curve Metrics)</option>
              <option value="/api/alerts">/api/alerts (Active Risk & Hazard Notices)</option>
              <option value="/api/health">/api/health (System Live Healthcheck)</option>
            </select>

            <button
              onClick={handleExecuteApiTest}
              disabled={isCallingApi}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{isCallingApi ? "Executing..." : "Send Request"}</span>
            </button>
          </div>

          {apiResponse && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono uppercase mb-2">
                <span>Response (HTTP 200 OK)</span>
                <span>application/json</span>
              </div>
              <pre className="text-emerald-400 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                {apiResponse}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
