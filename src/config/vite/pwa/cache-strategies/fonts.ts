
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for Google Fonts
export const getFontsCacheStrategy = () => {
  return [
    // Cache Google Fonts CSS - avoiding duplicates by using specific patterns
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 5, // Reduced since we're using a variable font
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache Google Fonts static resources with optimized patterns for Manrope variable font
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/s\/manrope\/.*\.woff2$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 10, // Reduced to account for variable font
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days (fonts rarely change)
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
