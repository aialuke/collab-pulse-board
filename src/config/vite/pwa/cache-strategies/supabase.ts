
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for Supabase API responses
export const getSupabaseCacheStrategy = () => {
  return [
    {
      // Standard Supabase API responses - shorter cache time for volatile data
      urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
      handler: 'NetworkFirst' as const,
      options: {
        cacheName: CACHE_NAMES.supabase,
        expiration: {
          maxEntries: 75,
          maxAgeSeconds: 5 * 60, // 5 minutes for most data
        },
        networkTimeoutSeconds: 3, // Timeout to fallback to cache quicker
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Reference data with less frequent updates
      urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/(categories|profiles)\/.*/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.supabase,
        expiration: {
          maxEntries: 25,
          maxAgeSeconds: 60 * 60, // 1 hour for reference data
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Auth endpoints - minimal caching
      urlPattern: /^https:\/\/.*\.supabase\.co\/auth\/v1\/.*/i,
      handler: 'NetworkFirst' as const,
      options: {
        cacheName: CACHE_NAMES.supabase,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60, // Only 1 minute for auth
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
