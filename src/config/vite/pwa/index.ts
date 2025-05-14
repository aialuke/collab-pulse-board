
import { VitePWA } from 'vite-plugin-pwa';
import { getPWAManifest } from './manifest';
import { getCacheStrategy } from './cache-strategy';

// PWA Configuration
export const configurePWA = () => {
  // Version timestamp for cache busting
  const timestamp = new Date().getTime();
  
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: [
      'favicon.ico', 
      'robots.txt', 
      'apple-touch-icon.png', 
      'sw-background-sync.js',
      'fonts/*.woff2'
    ],
    workbox: {
      ...getCacheStrategy(),
      // Fix the glob pattern issue by modifying the globDirectory
      globDirectory: 'dist',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,wasm,woff2}'],
      // Import custom service worker code
      importScripts: ['sw-background-sync.js'],
      // Add cache versioning based on timestamp
      cacheId: `teamqab-${timestamp}`,
    },
    manifest: getPWAManifest(timestamp),
    // Explicitly include workbox-window to resolve dependency
    injectRegister: 'auto',
    devOptions: {
      enabled: true,
      type: 'module',
      navigateFallback: 'index.html',
    }
  });
};
