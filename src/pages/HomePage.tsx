
import React from 'react';
import { FeedbackContainer } from '@/components/feedback/home/FeedbackContainer';
import { RepostProvider } from '@/contexts/RepostContext';

export default function HomePage() {
  return (
    <div className="w-full flex-1 flex flex-col">
      <RepostProvider onRepostSuccess={() => {
        // This can be used later if we want to show a success message or refresh data
        console.log('Repost successful');
      }}>
        <FeedbackContainer />
      </RepostProvider>
    </div>
  );
}
