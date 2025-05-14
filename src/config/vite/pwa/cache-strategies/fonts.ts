
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for local font files
export const getFontsCacheStrategy = () => {
  return [
    // Cache for local font files
    {
      urlPattern: /\/fonts\/.*\.woff2$/i,
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
