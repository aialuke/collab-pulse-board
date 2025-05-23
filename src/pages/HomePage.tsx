
import React from 'react';
import { FeedbackContainer } from '@/features/feedback/components/home/FeedbackContainer';
import { FloatingFeedbackButton } from '@/components/feedback/FloatingFeedbackButton';
import { RepostProvider } from '@/contexts/RepostContext';
import { toast } from '@/hooks/use-toast';

// Main page component without analytics script
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
        <FloatingFeedbackButton />
      </RepostProvider>
    </div>
  );
}
