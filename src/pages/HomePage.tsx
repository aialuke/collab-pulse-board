
import React, { useEffect } from 'react';
import { FeedbackContainer } from '@/components/feedback/home/FeedbackContainer';
import { RepostProvider } from '@/contexts/RepostContext';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  // Add detailed logging to track component lifecycle and auth state
  useEffect(() => {
    console.log("HomePage mounted with auth state:", { 
      isAuthenticated, 
      userId: user?.id,
      userRole: user?.role 
    });
    
    // Log when auth state changes
    return () => {
      console.log("HomePage unmounted");
    };
  }, [isAuthenticated, user]);

  // Log whenever auth state changes
  useEffect(() => {
    console.log("Auth state changed on HomePage:", { 
      isAuthenticated, 
      userId: user?.id,
      userRole: user?.role 
    });
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
