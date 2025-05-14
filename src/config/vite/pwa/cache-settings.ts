
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
    // Removed cacheableResponse from here as it's not valid at the top level
  };
};
