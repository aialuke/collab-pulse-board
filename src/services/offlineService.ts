
import { toast } from '@/hooks/use-toast';

// Queue keys for different types of operations
const QUEUE_NAMES = {
  FEEDBACK_CREATE: 'feedback-create-queue',
  FEEDBACK_UPDATE: 'feedback-update-queue',
  COMMENT_CREATE: 'comment-create-queue',
  UPVOTE_TOGGLE: 'upvote-toggle-queue',
  REPORT: 'report-queue'
};

/**
 * Check if the browser is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Check if the browser supports Background Sync API
 */
export const supportsBackgroundSync = (): boolean => {
  return 'serviceWorker' in navigator && 'SyncManager' in window;
};

/**
 * Register a background sync for a specific queue
 * @param queueName The name of the queue to register
 */
export const registerBackgroundSync = async (queueName: string): Promise<boolean> => {
  try {
    if (!supportsBackgroundSync()) {
      console.warn('Background Sync not supported in this browser');
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    // Check if sync is supported before using it
    if ('sync' in registration) {
      await (registration as any).sync.register(queueName);
      return true;
    } else {
      console.warn('Sync API not supported in this browser');
      return false;
    }
  } catch (error) {
    console.error('Failed to register background sync:', error);
    return false;
  }
};

/**
 * Store an item in the offline queue and register for background sync
 * @param queueName The queue to store the item in
 * @param data The data to store
 */
export const queueOfflineAction = async <T>(
  queueName: string,
  data: T
): Promise<void> => {
  try {
    // Store in IndexedDB
    const storeName = `offline-${queueName}`;
    const openRequest = indexedDB.open('offline-actions-db', 1);

    openRequest.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { autoIncrement: true });
      }
    };

    openRequest.onsuccess = async (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.add({
        data,
        timestamp: Date.now()
      });

      tx.oncomplete = async () => {
        db.close();
        // Register for background sync
        const syncRegistered = await registerBackgroundSync(queueName);
        
        if (syncRegistered) {
          toast({
            title: 'Offline mode',
            description: 'Your action will be processed when you\'re back online.',
            variant: 'default',
          });
        } else {
          toast({
            title: 'Offline mode',
            description: 'Action saved but automatic sync not available. Please try again when online.',
            variant: 'default',
          });
        }
      };
    };
  } catch (error) {
    console.error('Failed to queue offline action:', error);
    toast({
      title: 'Error',
      description: 'Failed to save your action for offline use.',
      variant: 'destructive',
    });
  }
};

/**
 * Process queued items when back online
 * @param queueName The queue to process
 * @param processor Function to process each item
 */
export const processQueue = async <T>(
  queueName: string,
  processor: (item: T) => Promise<void>
): Promise<void> => {
  const storeName = `offline-${queueName}`;
  const openRequest = indexedDB.open('offline-actions-db', 1);

  openRequest.onsuccess = async (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.close();
      return;
    }

    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = async () => {
      const items = request.result;
      if (!items || items.length === 0) {
        db.close();
        return;
      }

      // Process all items with exponential backoff retry
      for (const item of items) {
        try {
          await retryWithBackoff(() => processor(item.data), 3);
          
          // Remove processed item
          const deleteRequest = store.delete(item.id);
          await new Promise<void>((resolve, reject) => {
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
        } catch (error) {
          console.error('Failed to process offline action:', error);
          // Keep item in queue for next sync attempt
        }
      }
      
      db.close();
      
      // Notify user of completed sync
      toast({
        title: 'Back online',
        description: 'Your pending actions have been processed.',
        variant: 'default',
      });
    };
  };
};

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let retries = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
};

// Export queue names for use in components
export { QUEUE_NAMES };
