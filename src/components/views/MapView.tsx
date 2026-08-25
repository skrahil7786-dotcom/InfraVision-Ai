import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { Project } from "../../types";
import {
  MapPin,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  Camera,
  ExternalLink,
  ShieldCheck,
  Compass,
} from "lucide-react";
import L from "leaflet";

export const MapView: React.FC = () => {
  const { projects, setSelectedProjectId, setActiveView } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(projects[0] || null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of India coordinates
      const map = L.map(mapContainerRef.current).setView([21.5, 78.9], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers and polylines if any
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker || layer instanceof L.Polyline || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Realistic corridor alignments for infrastructure projects
    const CORRIDOR_ALIGNMENTS: Record<string, [number, number][]> = {
      "proj-1": [
        [28.6139, 77.209], // Delhi
        [27.8974, 78.088], // Aligarh node
        [27.1767, 78.0081], // Agra / Mathura
        [26.4499, 74.6399], // Ajmer node
        [24.5854, 73.7125], // Udaipur
        [23.0225, 72.5714], // Ahmedabad
        [22.3072, 73.1812], // Vadodara (Package 4 Chainage 120-160)
        [21.1702, 72.8311], // Surat
        [19.076, 72.8777], // Mumbai
      ],
      "proj-2": [
        [18.922, 72.8347], // Cuffe Parade
        [18.975, 72.8258], // Mumbai Central
        [19.0178, 72.8478], // Dadar
        [19.0657, 72.8704], // BKC
        [19.1025, 72.8681], // Santacruz
        [19.1197, 72.8468], // Andheri
        [19.155, 72.875], // SEEPZ Aarey
      ],
      "proj-3": [
        [12.9716, 77.5946], // Bangalore
        [12.9249, 77.6835], // Bellandur
        [12.9698, 77.75], // Whitefield
        [13.0827, 80.2707], // Chennai
      ],
    };

    // Draw corridor alignment polylines
    Object.entries(CORRIDOR_ALIGNMENTS).forEach(([pId, coords]) => {
      const isSelected = activeProject?.id === pId;
      const poly = L.polyline(coords, {
        color: isSelected ? "#3b82f6" : "#94a3b8",
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 0.9 : 0.6,
        dashArray: isSelected ? undefined : "6, 8",
      }).addTo(map);

      poly.on("click", () => {
        const found = projects.find((p) => p.id === pId);
        if (found) {
          setActiveProject(found);
          setSelectedProjectId(found.id);
        }
      });
    });

    // If Delhi-Mumbai selected, draw active drone survey flight path and geofence
    if (activeProject?.id === "proj-1") {
      const droneFlightPath: [number, number][] = [
        [22.28, 73.15],
        [22.3, 73.18],
        [22.32, 73.2],
        [22.35, 73.23],
      ];
      L.polyline(droneFlightPath, {
        color: "#06b6d4",
        weight: 3,
        dashArray: "4, 6",
      }).addTo(map);

      // Drone flight geofence circle
      L.circle([22.3072, 73.1812], {
        radius: 8000,
        color: "#6366f1",
        fillColor: "#818cf8",
        fillOpacity: 0.15,
        weight: 1.5,
      }).addTo(map);
    }

    // Add markers for all projects
    projects.forEach((proj) => {
      const color =
        proj.status === "ON_TRACK"
          ? "#10b981"
          : proj.status === "MODERATE_RISK"
          ? "#f59e0b"
          : "#ef4444";

      const customIcon = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 11px;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <span>${proj.actualProgress}%</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(proj.coordinates, { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setActiveProject(proj);
        setSelectedProjectId(proj.id);
        map.panTo(proj.coordinates);
      });
    });

    return () => {
      // Keep map alive during view transitions or cleanup on destroy
    };
  }, [projects]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
      {/* Top Floating Control Card */}
      <div className="absolute top-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-black text-slate-900">National Geospatial Project Corridor Map</h2>
          </div>
          <p className="text-[11px] text-slate-500">
            Interactive GIS telemetry tracking mega highway packages, metro rail corridors, and smart city nodes.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1 font-semibold text-slate-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm"></span>
            <span>On Track</span>
          </span>
          <span className="flex items-center space-x-1 font-semibold text-slate-700 ml-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-sm"></span>
            <span>Moderate</span>
          </span>
          <span className="flex items-center space-x-1 font-semibold text-slate-700 ml-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-white shadow-sm"></span>
            <span>Delayed</span>
          </span>
        </div>
      </div>

      {/* Map Container Viewport */}
      <div ref={mapContainerRef} className="w-full h-full z-0"></div>

      {/* Floating Selected Project Card at Bottom */}
      {activeProject && (
        <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-96 z-10 bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 animate-slide-up">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {activeProject.sector}
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-1 leading-snug">{activeProject.name}</h3>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                activeProject.status === "ON_TRACK"
                  ? "bg-emerald-100 text-emerald-800"
                  : activeProject.status === "MODERATE_RISK"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {activeProject.status.replace("_", " ")}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 flex items-center space-x-1 mb-3">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{activeProject.location}</span>
          </p>

          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center mb-3">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Planned</span>
              <span className="text-sm font-black text-blue-900">{activeProject.plannedProgress}%</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Actual</span>
              <span className="text-sm font-black text-emerald-900">{activeProject.actualProgress}%</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Est. Delay</span>
              <span className="text-sm font-black text-amber-900">{activeProject.predictedDelayDays}d</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedProjectId(activeProject.id);
                setActiveView("project-detail");
              }}
              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Inspect Details
            </button>
            <button
              onClick={() => {
                setSelectedProjectId(activeProject.id);
                setActiveView("ai-vision");
              }}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>AI Scan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
