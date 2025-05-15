
import React from 'react';
import { FeedbackContainer } from '@/components/feedback/home/FeedbackContainer';
import { RepostProvider } from '@/contexts/RepostContext';
import { toast } from '@/hooks/use-toast';
import { DeferredScript } from '@/components/utils/DeferredScript';

// Main page component with deferred analytics
export default function HomePage() {
  return (
    <div className="w-full flex-1 flex flex-col">
      <RepostProvider onRepostSuccess={() => {
        // Show success toast when a repost is successful
        toast({
          title: "Success",
          description: "Feedback reposted successfully"
        });
      }}>
        <FeedbackContainer />
      </RepostProvider>
      
      {/* Load analytics script only when user is idle */}
      {process.env.NODE_ENV === 'production' && (
        <DeferredScript 
          src="/analytics.js" 
          strategy="idle" 
        />
      )}
    </div>
  );
}
