
import { defineConfig, ConfigEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { configurePWA } from "./config/vite/pwa";
import { configureCompression } from "./config/vite/compression";
import { configureBuild } from "./config/vite/build";
import { componentTagger } from "lovable-tagger";
import { configureServer } from "./config/vite/server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: configureServer(),
  plugins: [
    react({
      devTarget: mode === 'production' ? 'es2022' : 'es2020',
    }),
    mode === 'development' && componentTagger(),
    configurePWA(),
    ...(mode === 'production' ? configureCompression() : []),
  ].filter(Boolean) as Plugin[],
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
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['src/components/ui/button.tsx'],
          'features': ['src/components/feedback/home/FeedbackContainer.tsx']
        }
      },
      external: []
    },
  },
}));
