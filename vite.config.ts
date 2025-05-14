import { defineConfig, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { configurePWA } from "./src/config/vite/pwa";
import { configureCompression } from "./src/config/vite/compression";
import { configureBuild } from "./src/config/vite/build";
import { configureDevelopment } from "./src/config/vite/development";
import { configureServer } from "./src/config/vite/server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: configureServer(),
  plugins: [
    react({
      // Add this for production optimization
      devTarget: mode === 'production' ? 'es2022' : 'es2020',
    }),
    mode === 'development' && configureDevelopment(),
    configurePWA(),
    ...(mode === 'production' ? configureCompression() : []),
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
        // Optimize chunking strategy for better performance
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@/components/ui/button', '@/components/ui/card', '@/components/ui/dialog'],
          'feedback': ['@/components/feedback/home/FeedbackContainer', '@/components/feedback/card/FeedbackCard'],
          'utils': ['@/lib/utils', '@/services/offlineService']
        }
      },
      external: []
    },
  },
}));
