
import { VitePWA } from 'vite-plugin-pwa';

// Version timestamp for cache busting
const timestamp = new Date().getTime();

// Cache names to help with identification and versioning
const CACHE_NAMES = {
  static: 'static-assets-v1',
  js: 'js-assets-v1',
  css: 'css-assets-v1',
  images: 'images-cache-v1',
  fonts: 'google-fonts-cache-v1',
  main: 'main-assets-v1',
  api: 'api-cache-v1',
  pwa: 'pwa-assets-v1',
  workbox: 'workbox-runtime-v1',
  fallback: 'fallback-cache-v1'
};

// PWA Configuration
export const configurePWA = () => {
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        // Specific cache for main JS bundle files - StaleWhileRevalidate for balance
        {
          urlPattern: /\/assets\/index-[A-Za-z0-9]+\.js$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: CACHE_NAMES.main,
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Specific cache for main CSS bundle files - StaleWhileRevalidate for balance
        {
          urlPattern: /\/assets\/index-[A-Za-z0-9]+\.css$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: CACHE_NAMES.main,
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Specific cache for workbox runtime files - CacheFirst for better performance
        {
          urlPattern: /\/assets\/workbox-[A-Za-z0-9]+\.js$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: CACHE_NAMES.workbox,
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Cache Google Fonts
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: CACHE_NAMES.fonts,
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Cache static assets with hash in filename (JS, CSS) - long term
        {
          urlPattern: /\.(?:js|css)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: CACHE_NAMES.static,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days for immutable assets
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Cache images - medium term
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: CACHE_NAMES.images,
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Cache web manifest - short term with network update
        {
          urlPattern: /manifest\.webmanifest$/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: CACHE_NAMES.pwa,
            expiration: {
              maxEntries: 1,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Cache service worker
        {
          urlPattern: /sw\.js$/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: CACHE_NAMES.pwa,
            expiration: {
              maxEntries: 1,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Cache robots.txt, favicon.ico
        {
          urlPattern: /\/(robots\.txt|favicon\.ico)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: CACHE_NAMES.pwa,
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Cache PWA assets
        {
          urlPattern: /\/pwa-\d+x\d+\.png/i,
          handler: 'CacheFirst',
          options: {
            cacheName: CACHE_NAMES.pwa,
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Cache API responses
        {
          urlPattern: /^https:\/\/.*\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: CACHE_NAMES.api,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60, // 1 hour
            },
            networkTimeoutSeconds: 10,
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Fallback cache for everything else
        {
          urlPattern: /.*$/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: CACHE_NAMES.fallback,
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    manifest: {
      name: 'Team QAB',
      short_name: 'Team QAB',
      description: 'Share and track feedback in your organization',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/pwa-192x192.png?v=' + timestamp,
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png?v=' + timestamp,
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png?v=' + timestamp,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  });
};
