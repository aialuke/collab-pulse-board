
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for workbox runtime files
export const getWorkboxCacheStrategy = () => {
  return [
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
  ];
};
