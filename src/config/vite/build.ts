
// Build configuration options
export const configureBuild = () => {
  return {
    // Add build options to assist with caching
    assetsInlineLimit: 4096, // Only inline files less than 4kb
    // Enable source maps for better debugging (but disable in production later)
    sourcemap: process.env.NODE_ENV !== 'production',
    // Set target to modern browsers
    target: 'esnext',
    modulePreload: {
      // Enable module preloading
      polyfill: true,
    },
    // Only generate .js files for modern browsers
    outDir: 'dist',
    emptyOutDir: true,
    // Generate chunks for better caching
    chunkSizeWarningLimit: 1000,
    // Enable tree-shaking optimization
    minify: 'terser' as const, // Fix the type by using 'as const'
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
      }
    },
  };
};
