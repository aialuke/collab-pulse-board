
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { getAllCacheNames } from './config/vite/pwa/cache-names.ts' 

// Use VitePWA's registration function with more robust options
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true, // Register immediately to ensure assets are cached faster
    onNeedRefresh() {
      console.log('New content available, refresh needed')
      // Show the refresh UI to the user
      const refreshUI = document.createElement('div');
      refreshUI.className = 'fixed bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 z-50';
      refreshUI.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
        <span>New content available</span>
        <button class="ml-2 bg-white text-primary px-2 py-1 rounded text-xs">Refresh</button>
      `;
      document.body.appendChild(refreshUI);
      
      const refreshButton = refreshUI.querySelector('button');
      refreshButton?.addEventListener('click', () => {
        // Update service worker and reload page
        updateSW(true).then(() => {
          window.location.reload();
        });
      });
    },
    onOfflineReady() {
      console.log('App ready to work offline')
      // Show offline ready notification
      const offlineToast = document.createElement('div');
      offlineToast.className = 'fixed bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 z-50';
      offlineToast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wifi"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
        <span>App ready for offline use</span>
      `;
      document.body.appendChild(offlineToast);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        offlineToast.remove();
      }, 3000);
    },
    onRegistered(r) {
      console.log('Service worker has been registered successfully')
      
      // Periodically check for updates (every 30 minutes instead of hourly)
      if (r) {
        setInterval(() => {
          console.log('Checking for service worker updates...');
          r.update().catch(console.error)
        }, 30 * 60 * 1000) // 30 minutes
      }

      // Clean up old caches if we have a new version
      if (r && 'navigationPreload' in r) {
        r.navigationPreload.enable();
      }

      // Add a cache clearing mechanism
      window.clearCaches = async function() {
        try {
          const cacheNames = getAllCacheNames();
          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
          }
          console.log('All caches cleared successfully');
          return true;
        } catch (error) {
          console.error('Failed to clear caches:', error);
          return false;
        }
      };
    },
    onRegisterError(error) {
      console.error('Service worker registration failed:', error)
    }
  });

  // Also handle updates when app visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Wait until the app is fully visible and stable
      setTimeout(() => {
        updateSW(true).catch(console.error);
      }, 1000);
    }
  });
}

// Use requestIdleCallback for non-critical initialization
const initApp = () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
};

// Use requestIdleCallback for non-critical initialization
if ('requestIdleCallback' in window) {
  // @ts-ignore - TypeScript doesn't recognize requestIdleCallback
  window.requestIdleCallback(initApp);
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(initApp, 1);
}
