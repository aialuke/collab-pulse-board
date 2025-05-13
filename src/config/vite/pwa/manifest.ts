
// PWA Manifest configuration
export const getPWAManifest = (timestamp: number) => {
  return {
    name: 'Team QAB',
    short_name: 'Team QAB',
    description: 'Share and track feedback in your organization',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone' as const, // Ensure this is typed correctly for the PWA plugin
    icons: [
      {
        src: `/pwa-192x192.png?v=${timestamp}`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `/pwa-512x512.png?v=${timestamp}`,
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: `/pwa-512x512.png?v=${timestamp}`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
};
