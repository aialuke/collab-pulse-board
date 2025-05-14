import { CACHE_NAMES } from '../cache-names';

// Cache strategy for locally hosted fonts
export const getFontsCacheStrategy = () => {
  return [
    // Cache for locally hosted font files
    {
      urlPattern: /.*\/fonts\/.*\.woff2$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 10, // One entry for each font weight
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days (fonts rarely change)
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Keep Google Fonts CSS cache for fallback/legacy support
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Keep Google Fonts static resources cache for fallback/legacy support
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/s\/manrope\/.*\.woff2$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
