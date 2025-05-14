
import { CACHE_NAMES } from '../cache-names';

// Cache strategies for PWA related files (manifest, service worker, icons)
export const getPWACacheStrategies = () => {
  return [
    // Cache web manifest - NetworkFirst with appropriate fallback
    {
      urlPattern: /manifest\.webmanifest$/i,
      handler: 'NetworkFirst' as const,
      options: {
        cacheName: CACHE_NAMES.pwa,
        networkTimeoutSeconds: 3, // Timeout for network request
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache service worker - NetworkFirst with no caching
    {
      urlPattern: /sw\.js$/i,
      handler: 'NetworkFirst' as const,
      options: {
        cacheName: CACHE_NAMES.pwa,
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 0, // No caching for service worker
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache robots.txt, favicon.ico - CacheFirst with longer duration
    {
      urlPattern: /\/(robots\.txt|favicon\.ico)$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.pwa,
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache PWA assets with long TTL
    {
      urlPattern: /\/pwa-\d+x\d+\.png/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.pwa,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
