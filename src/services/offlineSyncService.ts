// Offline Sync & IndexedDB Storage Service for InfraVision AI (SIH26122)
// Provides reliable offline field data collection and auto-synchronization on network restoration

export type SyncState = "OFFLINE" | "SYNCING" | "SYNCED";

export interface QueuedFieldUpdate {
  id: string;
  projectId: string;
  wbsTaskId?: string;
  chainageStart?: string;
  chainageEnd?: string;
  structureLayer?: string;
  reportedVolume?: number;
  reportedVolumeUnit?: string;
  comments?: string;
  stage?: string;
  source?: "AI_VISION" | "OCR_DPR" | "MANUAL_FIELD" | "DRONE_SURVEY";
  imageUrl?: string;
  gpsCoords?: { lat: number; lng: number; accuracyM?: number };
  timestamp: string;
  submittedBy: string;
  submittedByRole: string;
  syncStatus: "QUEUED" | "SYNCING" | "SYNCED" | "FAILED";
  retryCount: number;
  errorReason?: string;
}

const DB_NAME = "InfraVisionOfflineDB";
const DB_VERSION = 1;
const STORE_QUEUE = "field_updates_queue";
const STORE_CACHE = "cached_data";

class OfflineSyncService {
  private db: IDBDatabase | null = null;
  private syncState: SyncState = "SYNCED";
  private isSimulatedOffline = false;
  private listeners: Array<(state: SyncState, count: number, queue: QueuedFieldUpdate[]) => void> = [];
  private isSyncingInProgress = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initDB();
      this.registerServiceWorker();
      this.bindNetworkListeners();
    }
  }

  // Initialize IndexedDB
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_QUEUE)) {
          const queueStore = db.createObjectStore(STORE_QUEUE, { keyPath: "id" });
          queueStore.createIndex("syncStatus", "syncStatus", { unique: false });
          queueStore.createIndex("timestamp", "timestamp", { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_CACHE)) {
          db.createObjectStore(STORE_CACHE, { keyPath: "key" });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        this.updateStateAndNotify();
        resolve(this.db!);
      };

      request.onerror = (event: any) => {
        console.error("[IndexedDB] Failed to open database:", event.target.error);
        reject(event.target.error);
      };
    });
  }

  // Register Service Worker
  private registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[Service Worker] Registered successfully with scope:", reg.scope);
            if ("sync" in reg) {
              (reg as any).sync.register("sync-field-updates").catch((e: any) => {
                console.log("[Service Worker] Background sync register:", e);
              });
            }
          })
          .catch((err) => {
            console.log("[Service Worker] Registration skipped or failed:", err);
          });
      });

      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "TRIGGER_BACKGROUND_SYNC") {
          this.triggerSync();
        }
      });
    }
  }

  // Bind browser online/offline events
  private bindNetworkListeners() {
    window.addEventListener("online", () => {
      console.log("[Network] Connection restored (Online)");
      if (!this.isSimulatedOffline) {
        this.syncState = "SYNCING";
        this.updateStateAndNotify();
        this.triggerSync();
      }
    });

    window.addEventListener("offline", () => {
      console.log("[Network] Connection lost (Offline)");
      this.syncState = "OFFLINE";
      this.updateStateAndNotify();
    });
  }

  // State Subscriptions
  public subscribe(callback: (state: SyncState, count: number, queue: QueuedFieldUpdate[]) => void) {
    this.listeners.push(callback);
    this.updateStateAndNotify();
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private async updateStateAndNotify() {
    const queue = await this.getQueueItems();
    const isOnline = navigator.onLine && !this.isSimulatedOffline;

    if (!isOnline) {
      this.syncState = "OFFLINE";
    } else if (this.isSyncingInProgress) {
      this.syncState = "SYNCING";
    } else {
      this.syncState = "SYNCED";
    }

    this.listeners.forEach((cb) => cb(this.syncState, queue.length, queue));
  }

  public getSyncState(): SyncState {
    return this.syncState;
  }

  public isOfflineMode(): boolean {
    return !navigator.onLine || this.isSimulatedOffline;
  }

  public toggleSimulatedOffline(forceOffline?: boolean): boolean {
    this.isSimulatedOffline = forceOffline !== undefined ? forceOffline : !this.isSimulatedOffline;
    if (this.isSimulatedOffline) {
      this.syncState = "OFFLINE";
      this.updateStateAndNotify();
    } else {
      this.updateStateAndNotify();
      if (navigator.onLine) {
        this.triggerSync();
      }
    }
    return this.isSimulatedOffline;
  }

  public getIsSimulatedOffline(): boolean {
    return this.isSimulatedOffline;
  }

  // Queue a new field update into IndexedDB
  public async queueFieldUpdate(data: Partial<QueuedFieldUpdate>): Promise<QueuedFieldUpdate> {
    const db = await this.initDB();
    const item: QueuedFieldUpdate = {
      id: data.id || `local-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      projectId: data.projectId || "proj-1",
      wbsTaskId: data.wbsTaskId || "wbs-1.2.3",
      chainageStart: data.chainageStart || "Km 134+200",
      chainageEnd: data.chainageEnd || "Km 135+000",
      structureLayer: data.structureLayer || "Dense Bituminous Macadam (DBM)",
      reportedVolume: data.reportedVolume || 420,
      reportedVolumeUnit: data.reportedVolumeUnit || "MT",
      comments: data.comments || "Field layer compaction update logged in offline mode",
      stage: data.stage || "DBM_PAVING",
      source: data.source || "MANUAL_FIELD",
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80",
      gpsCoords: data.gpsCoords || { lat: 22.3072, lng: 73.1812, accuracyM: 1.8 },
      timestamp: new Date().toISOString(),
      submittedBy: data.submittedBy || "Ramesh Patel (Site Engineer)",
      submittedByRole: data.submittedByRole || "FIELD_ENGINEER",
      syncStatus: "QUEUED",
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_QUEUE], "readwrite");
      const store = transaction.objectStore(STORE_QUEUE);
      const req = store.put(item);

      req.onsuccess = () => {
        console.log("[IndexedDB] Successfully queued offline update:", item.id);
        this.updateStateAndNotify();
        resolve(item);
      };

      req.onerror = (e: any) => {
        console.error("[IndexedDB] Failed to queue item:", e.target.error);
        reject(e.target.error);
      };
    });
  }

  // Get all queued items
  public async getQueueItems(): Promise<QueuedFieldUpdate[]> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_QUEUE], "readonly");
      const store = transaction.objectStore(STORE_QUEUE);
      const req = store.getAll();

      req.onsuccess = (e: any) => {
        resolve(e.target.result || []);
      };

      req.onerror = () => {
        resolve([]);
      };
    });
  }

  // Clear specific queued item after successful sync
  public async removeQueueItem(id: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_QUEUE], "readwrite");
      const store = transaction.objectStore(STORE_QUEUE);
      const req = store.delete(id);
      req.onsuccess = () => {
        this.updateStateAndNotify();
        resolve();
      };
      req.onerror = () => resolve();
    });
  }

  // Trigger synchronization of all queued items
  public async triggerSync(): Promise<{ total: number; synced: number; failed: number }> {
    if (this.isSyncingInProgress) {
      return { total: 0, synced: 0, failed: 0 };
    }

    const isOnline = navigator.onLine && !this.isSimulatedOffline;
    if (!isOnline) {
      this.syncState = "OFFLINE";
      this.updateStateAndNotify();
      return { total: 0, synced: 0, failed: 0 };
    }

    const items = await this.getQueueItems();
    if (items.length === 0) {
      this.syncState = "SYNCED";
      this.updateStateAndNotify();
      return { total: 0, synced: 0, failed: 0 };
    }

    this.isSyncingInProgress = true;
    this.syncState = "SYNCING";
    this.updateStateAndNotify();

    let synced = 0;
    let failed = 0;

    for (const item of items) {
      try {
        const response = await fetch("/api/field-updates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: item.projectId,
            wbsTaskId: item.wbsTaskId,
            chainageStart: item.chainageStart,
            chainageEnd: item.chainageEnd,
            structureLayer: item.structureLayer,
            reportedVolume: item.reportedVolume,
            reportedVolumeUnit: item.reportedVolumeUnit,
            comments: item.comments,
            stage: item.stage,
            source: item.source,
            imageUrl: item.imageUrl,
            gpsCoords: item.gpsCoords,
            submittedBy: item.submittedBy,
            submittedByRole: item.submittedByRole,
            offlineLoggedAt: item.timestamp,
          }),
        });

        const result = await response.json();
        if (result.success) {
          await this.removeQueueItem(item.id);
          synced++;
        } else {
          failed++;
        }
      } catch (err) {
        console.warn("[OfflineSync] Sync failed for item:", item.id, err);
        failed++;
      }
    }

    this.isSyncingInProgress = false;
    this.syncState = "SYNCED";
    await this.updateStateAndNotify();

    return { total: items.length, synced, failed };
  }

  // Cache static or API snapshots to IndexedDB
  public async cacheDataSnapshot(key: string, data: any): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_CACHE], "readwrite");
      const store = transaction.objectStore(STORE_CACHE);
      store.put({ key, data, cachedAt: new Date().toISOString() });
      transaction.oncomplete = () => resolve();
    });
  }

  public async getCachedDataSnapshot(key: string): Promise<any | null> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_CACHE], "readonly");
      const store = transaction.objectStore(STORE_CACHE);
      const req = store.get(key);
      req.onsuccess = (e: any) => {
        resolve(e.target.result ? e.target.result.data : null);
      };
      req.onerror = () => resolve(null);
    });
  }
}

export const offlineSyncService = new OfflineSyncService();
