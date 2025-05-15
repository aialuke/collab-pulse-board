import { defineConfig, ConfigEnv, PluginOption } from "vite";
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
export default defineConfig(({ mode }: ConfigEnv) => {
  const serverConfig = configureServer();
  const isProd = mode === 'production';
  
  return {
    server: {
      port: 8080,
      ...serverConfig
    },
    plugins: [
      react({
        // Use faster builds in development with swc
        devTarget: isProd ? 'es2022' : 'es2020',
        // Use JSX transform in production to reduce bundle size
        jsxImportSource: isProd ? undefined : 'react',
        // Properly configure development vs. production
        plugins: !isProd ? [] : undefined,
        // Ensure production optimizations are enabled
        tsDecorators: false,
        // Enable React refresh only in dev mode
        refresh: !isProd,
      }),
      mode === 'development' && configureDevelopment(),
      configurePWA(),
      ...(isProd ? configureCompression() : []),
      splitVendorChunkPlugin(),
      isProd && visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        template: 'treemap', // Use treemap for better visualization
        sourcemap: false, // Disable source maps in the analyzer to speed it up
      }),
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    esbuild: {
      // Improve tree-shaking with pure annotations
      pure: isProd ? ['console.log', 'console.debug', 'console.info'] : [],
      // Keep JSX in production for better tree-shaking
      jsx: 'automatic',
      // Target modern browsers for smaller output
      target: isProd ? 'es2020' : 'es2018',
    },
    build: {
      ...configureBuild(),
      cssCodeSplit: true,
      cssMinify: isProd ? 'lightningcss' : false,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const cssExtensions = ['.css'];
            const isCSS = assetInfo.name && cssExtensions.some(ext => assetInfo.name?.endsWith(ext));
            
            if (isCSS) {
              if (assetInfo.name?.includes('critical')) {
                return 'assets/critical-[hash].css';
              }
              return 'assets/styles-[name]-[hash].css';
            }
            
            return 'assets/[name]-[hash].[ext]';
          },
          manualChunks: (id) => {
            // Optimized React core chunking strategy
            if (id.includes('node_modules/react/')) {
              return 'react';
            }
            
            if (id.includes('node_modules/react-dom/')) {
              return 'react-dom';
            }
            
            if (id.includes('node_modules/scheduler/')) {
              return 'react-scheduler';
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
  };
});
