
import React from 'react';
import { FeedbackContainer } from '@/components/feedback/home/FeedbackContainer';
import { RepostProvider } from '@/contexts/RepostContext';

export default function HomePage() {
  return (
    <div className="w-full flex-1 flex flex-col">
      <FeedbackContainer />
    </div>
  );
}
