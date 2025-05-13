
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for Supabase API responses
export const getSupabaseCacheStrategy = () => {
  return [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.supabase,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
