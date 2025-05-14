
// Cache settings for Workbox
export const getCacheSettings = () => {
  return {
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
    // Fix the glob patterns to ensure they match files correctly
    globDirectory: 'dist',
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,woff2}'],
    globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
    // Add cacheable response options
    cacheableResponse: {
      statuses: [0, 200],
    },
  };
};
