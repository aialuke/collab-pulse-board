
import React from 'react';
import { FeedbackContainer } from '@/modules/feedback';
import { FloatingFeedbackButton } from '@/components/feedback/FloatingFeedbackButton';
import { RepostProvider } from '@/contexts/RepostContext';
import { useToast } from '@/modules/ui';

// Main page component with enhanced state management
export default function HomePage() {
  const { toast } = useToast();
  
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
