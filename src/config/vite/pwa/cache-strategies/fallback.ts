
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
          maxEntries: 250, // Increased from 200
          maxAgeSeconds: 60 * 60 * 12, // 12 hours (reduced from 24 hours)
        },
        networkTimeoutSeconds: 5, // Timeout to fallback to cache after 5 seconds
        cacheableResponse: {
          statuses: [0, 200],
        },
        matchOptions: {
          ignoreSearch: true, // Ignore query parameters for fallback
        },
      },
    },
  ];
};
