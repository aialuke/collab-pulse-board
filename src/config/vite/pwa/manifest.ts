
// PWA Manifest configuration
export const getPWAManifest = (timestamp: number) => {
  return {
    name: 'Team QAB',
    short_name: 'Team QAB',
    description: 'Share and track feedback in your organization',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone' as const, 
    start_url: '/?source=pwa',
    categories: ['productivity', 'business'],
    orientation: 'portrait-primary',
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
    // Capture installation metrics
    related_applications: [],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Create Feedback",
        short_name: "Create",
        description: "Create new feedback",
        url: "/create?source=pwa",
        icons: [{ src: "/pwa-192x192.png", sizes: "192x192" }]
      }
    ],
    // Share target for web share target API
    share_target: {
      action: "/create",
      method: "GET",
      params: {
        title: "title",
        text: "content",
        url: "link_url"
      }
    }
  };
};
