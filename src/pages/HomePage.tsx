
// Import only what we need from React - no default import
import { memo } from 'react';
import { FeedbackContainer } from '@/components/feedback/home/FeedbackContainer';
import { RepostProvider } from '@/contexts/RepostContext';
import { toast } from '@/hooks/use-toast';

// Memoize the component to avoid unnecessary re-renders
const HomePage = memo(function HomePage() {
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
    </div>
  );
});

export default HomePage;
