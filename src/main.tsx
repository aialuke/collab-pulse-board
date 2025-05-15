
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Use VitePWA's registration function with more robust options
if ('serviceWorker' in navigator) {
  registerSW({
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
        window.location.reload();
      });
    },
    onOfflineReady() {
      console.log('App ready to work offline')
      // Removed toast notification
    },
    onRegisteredSW(swUrl, registration) {
      console.log('Service worker has been registered successfully')
      
      // Setup background sync event listener
      if (registration && 'sync' in registration) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'BACKGROUND_SYNC_COMPLETE') {
            // Handle completed background sync
            console.log('Background sync completed');
          }
        });
      }
      
      // Font loading optimization with local fonts
      if (registration && 'fonts' in document) {
        // Trigger font loading and caching
        document.fonts.ready.then(() => {
          console.log('Local fonts loaded and ready');
          document.documentElement.classList.remove('fonts-loading');
        }).catch(err => {
          console.error('Font loading error:', err);
          // Remove class anyway to ensure content is visible
          document.documentElement.classList.remove('fonts-loading');
        });
      }
      
      // Periodically check for updates (every hour)
      if (registration) {
        setInterval(() => {
          registration.update().catch(console.error)
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error('Service worker registration failed:', error)
    }
  })
}

// Font loading class initialization
if (window.document) {
  document.documentElement.classList.add('fonts-loading');
}

// Use more efficient initialization approach with no React import
const initApp = () => {
  // Create root only once
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }
  
  const root = createRoot(rootElement);
  
  // Disable StrictMode in production to avoid double-rendering and extra bundle size
  if (process.env.NODE_ENV === 'development') {
    // Dynamic import of React for StrictMode only in development
    import('react').then(({ StrictMode }) => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    });
  } else {
    root.render(<App />);
  }
};

// Defer non-critical initialization
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(initApp, { timeout: 1000 });
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(initApp, 1);
}
