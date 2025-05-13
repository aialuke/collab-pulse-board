
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for API responses
export const getAPICacheStrategy = () => {
  return [
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
    // Cache Supabase API responses
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.supabase,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
