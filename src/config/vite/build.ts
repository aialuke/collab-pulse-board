
// Build configuration options
export const configureBuild = () => {
  return {
    // Add build options to assist with caching
    assetsInlineLimit: 4096, // Only inline files less than 4kb
    // Disable source maps in production for better performance
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
    minify: 'terser' as const,
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
        // Additional optimizations for production
        passes: 2, // Multiple passes for better optimization
        ecma: 2020 as any, // Modern syntax optimizations - using any as a workaround
        module: true, // Enable module-specific optimizations
        toplevel: true, // Enable top-level optimizations
        pure_getters: true, // Assume getters are pure
        unsafe_math: true, // Allow math optimizations
        unsafe_methods: true, // Allow unsafe method optimizations
      },
      mangle: {
        properties: {
          regex: /^_private_/ // Only mangle properties starting with _private_
        }
      }
    },
    // For better tree-shaking and smaller bundles
    reportCompressedSize: false, // Speed up build by skipping compressed size reporting
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs'],
      strictRequires: true, // More aggressive optimization of CommonJS
      transformMixedEsModules: true, // Convert mixed ES6 and CommonJS to ES6
    }
  };
};
