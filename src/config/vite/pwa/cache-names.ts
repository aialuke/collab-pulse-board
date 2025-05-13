
// App version for cache versioning
const CACHE_VERSION = 'v2';

// Cache names to help with identification and versioning
export const CACHE_NAMES = {
  static: `static-assets-${CACHE_VERSION}`,
  js: `js-assets-${CACHE_VERSION}`,
  css: `css-assets-${CACHE_VERSION}`,
  images: `images-cache-${CACHE_VERSION}`,
  fonts: `google-fonts-cache-${CACHE_VERSION}`,
  main: `main-assets-${CACHE_VERSION}`,
  api: `api-cache-${CACHE_VERSION}`,
  pwa: `pwa-assets-${CACHE_VERSION}`,
  workbox: `workbox-runtime-${CACHE_VERSION}`,
  fallback: `fallback-cache-${CACHE_VERSION}`,
  supabase: `supabase-api-${CACHE_VERSION}` 
};

// Function to get all cache names for cleanup operations
export const getAllCacheNames = () => Object.values(CACHE_NAMES);
