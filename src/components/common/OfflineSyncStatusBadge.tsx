import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  Database,
  ArrowUpRight,
  HardDrive,
  Radio,
  PlusCircle,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  X,
} from "lucide-react";
import {
  offlineSyncService,
  SyncState,
  QueuedFieldUpdate,
} from "../../services/offlineSyncService";
import { useApp } from "../../context/AppContext";

export const OfflineSyncStatusBadge: React.FC = () => {
  const [syncState, setSyncState] = useState<SyncState>(offlineSyncService.getSyncState());
  const [queueCount, setQueueCount] = useState<number>(0);
  const [queueItems, setQueueItems] = useState<QueuedFieldUpdate[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(
    offlineSyncService.getIsSimulatedOffline()
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);

  const { refreshData } = useApp();

  useEffect(() => {
    const unsubscribe = offlineSyncService.subscribe((state, count, items) => {
      setSyncState(state);
      setQueueCount(count);
      setQueueItems(items);
      setIsSimulatedOffline(offlineSyncService.getIsSimulatedOffline());
    });

    return () => unsubscribe();
  }, []);

  const handleToggleOffline = () => {
    const newOfflineState = offlineSyncService.toggleSimulatedOffline();
    setIsSimulatedOffline(newOfflineState);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    const result = await offlineSyncService.triggerSync();
    setIsSyncing(false);
    if (result.synced > 0) {
      setSyncSuccessToast(`Synced ${result.synced} offline field updates with Cloud`);
      await refreshData();
      setTimeout(() => setSyncSuccessToast(null), 4000);
    }
  };

  const handleAddSampleOfflineUpdate = async () => {
    await offlineSyncService.queueFieldUpdate({
      chainageStart: "Km 136+500",
      chainageEnd: "Km 137+200",
      structureLayer: "Wearing Course (Bituminous Concrete - BC)",
      reportedVolume: 350,
      reportedVolumeUnit: "MT",
      comments: "Captured at zero-connectivity canyon stretch. Stored in browser IndexedDB.",
      stage: "BC_SURFACING",
      source: "MANUAL_FIELD",
    });
  };

  return (
    <div className="relative">
      {/* Primary Pill Button */}
      <button
        id="btn-offline-sync-status"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
          syncState === "OFFLINE"
            ? "bg-amber-500/10 border-amber-500/30 text-amber-900 shadow-sm"
            : syncState === "SYNCING"
            ? "bg-blue-500/10 border-blue-500/30 text-blue-900 shadow-sm"
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 shadow-sm"
        }`}
        title="Service Worker & IndexedDB Offline State Engine. Click to inspect cached queue."
      >
        {syncState === "OFFLINE" && (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="text-amber-800">Offline Mode</span>
            {queueCount > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {queueCount} Queued
              </span>
            )}
          </>
        )}

        {syncState === "SYNCING" && (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span className="text-blue-800">Syncing ({queueCount})...</span>
          </>
        )}

        {syncState === "SYNCED" && (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-800">Synced • RTK Live</span>
            {queueCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {queueCount}
              </span>
            )}
          </>
        )}

        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Sync Success Toast Banner */}
      {syncSuccessToast && (
        <div className="absolute top-12 right-0 z-50 bg-emerald-900 text-emerald-100 text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-emerald-700 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncSuccessToast}</span>
        </div>
      )}

      {/* Detailed Modal / Popover */}
      {isDrawerOpen && (
        <div className="absolute top-12 right-0 z-50 w-96 bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Offline PWA & IndexedDB</h4>
                <p className="text-[10px] text-slate-500">Service Worker background sync engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Status Box */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Network Signal State:</span>
              <span
                className={`font-black px-2 py-0.5 rounded-md text-[11px] ${
                  syncState === "OFFLINE"
                    ? "bg-amber-100 text-amber-900"
                    : syncState === "SYNCING"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-emerald-100 text-emerald-900"
                }`}
              >
                {syncState === "OFFLINE" ? "OFFLINE (Cached)" : syncState === "SYNCING" ? "SYNCING" : "SYNCED (Online)"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">IndexedDB Storage Queue:</span>
              <span className="font-bold text-slate-900">{queueCount} updates stored locally</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Service Worker Cache:</span>
              <span className="text-emerald-700 font-bold flex items-center space-x-1">
                <HardDrive className="w-3 h-3 text-emerald-600" />
                <span>infravision-cache-v1 Active</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleOffline}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer border ${
                  isSimulatedOffline
                    ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                    : "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
                }`}
              >
                {isSimulatedOffline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5" />
                    <span>Restore Online Sync</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                    <span>Simulate Zero 4G Signal</span>
                  </>
                )}
              </button>

              <button
                onClick={handleManualSync}
                disabled={isSyncing || queueCount === 0 || isSimulatedOffline}
                className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>Sync Now</span>
              </button>
            </div>

            <button
              onClick={handleAddSampleOfflineUpdate}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-slate-300 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Queue Sample Offline Field Log in IndexedDB</span>
            </button>
          </div>

          {/* Queue Items Preview */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Local Queue Items ({queueItems.length})</span>
              <span className="text-[10px] text-slate-400 font-mono">Auto-sync on connect</span>
            </div>

            {queueItems.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                IndexedDB queue is clean. All field updates are committed to the cloud.
              </div>
            ) : (
              <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                {queueItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] space-y-1"
                  >
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>{item.structureLayer}</span>
                      <span className="font-mono text-amber-800 font-black">
                        {item.reportedVolume} {item.reportedVolumeUnit}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>{item.chainageStart} → {item.chainageEnd}</span>
                      <span className="flex items-center space-x-1 text-amber-700 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
