
import { CACHE_NAMES } from './cache-names';

// Cache strategy configuration for Workbox
export const getCacheStrategy = () => {
  return {
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
    // Fix the glob patterns to ensure they match files correctly
    globDirectory: 'dist',
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif}'],
    globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
    runtimeCaching: [
      // Specific cache for main JS bundle files - StaleWhileRevalidate for balance
      {
        urlPattern: /\/assets\/index-[A-Za-z0-9]+\.js$/i,
        handler: 'StaleWhileRevalidate' as const,
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
        urlPattern: /\/assets\/styles-[A-Za-z0-9]+\.css$/i,
        handler: 'StaleWhileRevalidate' as const,
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
      // Specific cache for critical CSS
      {
        urlPattern: /\/assets\/critical-[A-Za-z0-9]+\.css$/i,
        handler: 'CacheFirst' as const,
        options: {
          cacheName: CACHE_NAMES.main,
          expiration: {
            maxEntries: 5,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      // Specific cache for workbox runtime files - CacheFirst for better performance
      {
        urlPattern: /\/assets\/workbox-[A-Za-z0-9]+\.js$/i,
        handler: 'CacheFirst' as const,
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
        handler: 'CacheFirst' as const,
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
        handler: 'CacheFirst' as const,
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
        handler: 'CacheFirst' as const,
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
        handler: 'NetworkFirst' as const,
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
        handler: 'NetworkFirst' as const,
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
        handler: 'CacheFirst' as const,
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
        handler: 'CacheFirst' as const,
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
        handler: 'NetworkFirst' as const,
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
      // Offline fallback
      {
        urlPattern: /.*$/i,
        handler: 'NetworkFirst' as const,
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
  };
};
