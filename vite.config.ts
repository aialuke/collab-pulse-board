
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
  
  return {
    server: {
      port: 8080,
      ...serverConfig
    },
    plugins: [
      react({
        // Use faster builds in development with swc
        devTarget: mode === 'production' ? 'es2022' : 'es2020',
        // Use JSX transform in production to reduce bundle size
        jsxImportSource: mode === 'production' ? undefined : 'react',
        // This is the correct way to specify development mode
        plugins: mode !== 'production' ? [] : undefined,
      }),
      mode === 'development' && configureDevelopment(),
      configurePWA(),
      ...(mode === 'production' ? configureCompression() : []),
      splitVendorChunkPlugin(),
      mode === 'production' && visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
      }),
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      ...configureBuild(),
      cssCodeSplit: true,
      cssMinify: mode === 'production' ? 'lightningcss' : false,
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
            
            // Feature-based chunks for our own code
            if (id.includes('/src/components/feedback/')) {
              return 'feature-feedback';
            }
            if (id.includes('/src/components/auth/')) {
              return 'feature-auth';
            }
            if (id.includes('/src/components/common/')) {
              return 'feature-common';
            }
            if (id.includes('/src/components/ui/')) {
              return 'ui-shadcn';
            }
            
            // Core app files
            if (id.includes('/src/contexts/') || id.includes('/src/hooks/')) {
              return 'app-core';
            }
          }
        },
        external: []
      },
    },
  };
});
