
import { VitePWA } from 'vite-plugin-pwa';
import { getPWAManifest } from './manifest';
import { getCacheStrategy } from './cache-strategy';

// PWA Configuration
export const configurePWA = () => {
  // Version timestamp for cache busting
  const timestamp = new Date().getTime();
  
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    workbox: {
      ...getCacheStrategy(),
      // Fix the glob pattern issue by modifying the globDirectory
      globDirectory: 'dist',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,wasm}'],
      // Enable navigation preload for faster navigations
      navigationPreload: true,
      // Only precache essential assets
      maximumFileSizeToCacheInBytes: 2 * 1024 * 1024, // 2MB max file size
      // Cleanup old caches
      cleanupOutdatedCaches: true,
      // Custom cache keys
      cacheId: 'team-qab-v2',
      // Increase clientsClaim speed
      clientsClaim: true,
      // Use ImmortalCache for permanent assets
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache-v2',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    manifest: getPWAManifest(timestamp),
    // Explicitly include workbox-window to resolve dependency
    injectRegister: 'auto',
    devOptions: {
      enabled: true,
      type: 'module',
      navigateFallback: 'index.html',
    },
    // Add cache headers for better control
    headers: {
      // Cache immutable assets for a year
      '/*.(js|css|woff2|jpg|png|svg|gif|ico)': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      // Cache HTML and JSON for a short time
      '/*.(html|json)': {
        'Cache-Control': 'public, max-age=600, stale-while-revalidate=1200'
      }
    },
    // Change to generateSW to fix the missing sw.js file
    strategies: 'generateSW',
    // Let the service worker handle page refreshes 
    selfDestroying: false,
  });
};
