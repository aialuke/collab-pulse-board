
import { defineConfig, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { configurePWA } from "./src/config/vite/pwa";
import { configureCompression } from "./src/config/vite/compression";
import { configureBuild } from "./src/config/vite/build";
import { configureDevelopment } from "./src/config/vite/development";
import { configureServer } from "./src/config/vite/server";
import { splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: {
    port: 8080,
    ...configureServer()
  },
  plugins: [
    react({
      // Add this for production optimization
      devTarget: mode === 'production' ? 'es2022' : 'es2020',
    }),
    mode === 'development' && configureDevelopment(),
    configurePWA(),
    ...(mode === 'production' ? configureCompression() : []),
    // Add vendor chunk splitting plugin
    splitVendorChunkPlugin(),
    // Add bundle analyzer in build mode with stats option
    mode === 'production' && visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    ...configureBuild(),
    // Add CSS optimization settings
    cssCodeSplit: true,
    cssMinify: mode === 'production' ? 'lightningcss' : false,
    rollupOptions: {
      output: {
        // Customize file names for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Use separate naming scheme for CSS files
          const cssExtensions = ['.css'];
          const isCSS = assetInfo.name && cssExtensions.some(ext => assetInfo.name?.endsWith(ext));
          
          if (isCSS) {
            // Create critical CSS chunk
            if (assetInfo.name?.includes('critical')) {
              return 'assets/critical-[hash].css';
            }
            return 'assets/styles-[name]-[hash].css';
          }
          
          return 'assets/[name]-[hash].[ext]';
        },
        // Improved chunking strategy for better tree-shaking
        manualChunks: (id) => {
          // Core React dependencies
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/scheduler/')) {
            return 'react-core';
          }
          
          // React Router
          if (id.includes('node_modules/react-router') || 
              id.includes('node_modules/@remix-run/router')) {
            return 'router';
          }
          
          // UI component library (Radix UI)
          if (id.includes('node_modules/@radix-ui/')) {
            const componentName = id.split('@radix-ui/')[1]?.split('/')[0];
            // Group similar components together
            if (componentName?.includes('react-dialog') || 
                componentName?.includes('react-popover') || 
                componentName?.includes('react-modal')) {
              return 'ui-overlays';
            }
            if (componentName?.includes('react-form') || 
                componentName?.includes('react-label') || 
                componentName?.includes('react-select') ||
                componentName?.includes('react-checkbox') ||
                componentName?.includes('react-switch')) {
              return 'ui-form';
            }
            return 'ui-components';
          }
          
          // Tanstack/React-Query
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'tanstack-query';
          }
          
          // Icons and visual libraries
          if (id.includes('node_modules/lucide-react') || 
              id.includes('node_modules/recharts')) {
            return 'ui-visuals';
          }
        }
      },
      external: []
    },
  },
}));
