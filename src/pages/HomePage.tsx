
import React, { useEffect } from 'react';
import { FeedbackContainer } from '@/components/feedback/home/FeedbackContainer';
import { RepostProvider } from '@/contexts/RepostContext';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  // Add logging to track component lifecycle and auth state
  useEffect(() => {
    console.log("HomePage mounted");
    console.log("Auth state:", { isAuthenticated, userId: user?.id });
    
    return () => {
      console.log("HomePage unmounted");
    };
  }, [isAuthenticated, user]);

  return (
    <div className="w-full flex-1 flex flex-col">
      <RepostProvider onRepostSuccess={() => {
        console.log("Repost successful, showing toast");
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
}
