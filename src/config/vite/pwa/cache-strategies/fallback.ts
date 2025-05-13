
import { CACHE_NAMES } from '../cache-names';

// Fallback cache strategy for everything else
export const getFallbackCacheStrategy = () => {
  return [
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
  ];
};
