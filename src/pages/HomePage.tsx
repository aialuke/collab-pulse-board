
import React from 'react';
import { FeedbackContainer } from '@/components/feedback/home/FeedbackContainer';
import { RepostProvider } from '@/contexts/RepostContext';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';

export default function HomePage() {
  return (
    <div className="w-full flex-1 flex flex-col">
      <RepostProvider onRepostSuccess={(feedback) => {}}>
        <FeedbackContainer />
      </RepostProvider>
      
      {/* PWA Components */}
      <OfflineIndicator />
      <PWAInstallPrompt />
    </div>
  );
}
