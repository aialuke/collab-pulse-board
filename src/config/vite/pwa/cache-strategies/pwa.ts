
import { CACHE_NAMES } from '../cache-names';

// Cache strategies for PWA related files (manifest, service worker, icons)
export const getPWACacheStrategies = () => {
  return [
    // Cache web manifest - short term with network update
    {
      urlPattern: /manifest\.webmanifest$/i,
      handler: 'NetworkFirst' as const,
      options: {
        cacheName: CACHE_NAMES.pwa,
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 60 * 60 * 24, // 1 day (reduced from 7 days)
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
          maxAgeSeconds: 60 * 60, // 1 hour (reduced from 1 day)
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
  ];
};
