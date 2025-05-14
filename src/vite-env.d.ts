
/// <reference types="vite/client" />

// Adding TypeScript definitions for SyncManager API
interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}

interface ServiceWorkerRegistration {
  sync: SyncManager;
}

// Augment Window interface to include SyncManager
interface WindowEventMap {
  'sync': SyncEvent;
}

interface SyncEvent extends Event {
  tag: string;
  lastChance: boolean;
}
