
import { VitePWA } from 'vite-plugin-pwa';
import { getPWAManifest } from './manifest';
import { getCacheStrategy } from './cache-strategy';

// PWA Configuration
export const configurePWA = () => {
  // Version timestamp for cache busting
  const timestamp = new Date().getTime();
  
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    workbox: getCacheStrategy(),
    manifest: getPWAManifest(timestamp),
  });
};
