
// Build configuration options
export const configureBuild = () => {
  const isProd = process.env.NODE_ENV === 'production';
  
  return {
    // Add build options to assist with caching
    assetsInlineLimit: 4096, // Only inline files less than 4kb
    // Disable source maps in production for smaller bundles
    sourcemap: !isProd,
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
    chunkSizeWarningLimit: 600,
    // Use esbuild for CSS minification in production
    cssMinify: isProd ? 'esbuild' : false,
    // Enable CSS code splitting with improved settings
    cssCodeSplit: true,
    // CSS transformation options
    cssTarget: 'esnext',
  };
};
