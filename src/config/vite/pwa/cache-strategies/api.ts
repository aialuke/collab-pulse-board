
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for API responses
export const getAPICacheStrategy = () => {
  return [
    // Cache API responses with optimized strategies
    {
      urlPattern: /^https:\/\/.*\/api\/.*/i,
      handler: 'NetworkFirst' as const,
      options: {
        cacheName: CACHE_NAMES.api,
        expiration: {
          maxEntries: 150, // Increased from 100
          maxAgeSeconds: 10 * 60, // 10 minutes (reduced from 1 hour)
        },
        networkTimeoutSeconds: 3, // Fail fast to improve perceived performance
        cacheableResponse: {
          statuses: [0, 200],
        },
        matchOptions: {
          ignoreSearch: false, // Respect query parameters for API caching
        },
      },
    },
  ];
};
