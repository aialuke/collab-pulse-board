
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for local font files
export const getFontsCacheStrategy = () => {
  return [
    // Cache for local font files - long expiration immutable
    {
      urlPattern: /\/fonts\/.*\.woff2$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days (immutable)
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Google Fonts CSS - StaleWhileRevalidate for better performance
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/css/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Google Fonts files - CacheFirst for better performance
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 15,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days (immutable)
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
