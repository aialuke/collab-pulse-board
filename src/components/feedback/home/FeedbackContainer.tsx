
import React, { useEffect } from 'react';
import { usePaginatedFeedback } from '@/hooks/usePaginatedFeedback';
import { useFeedbackFilters } from '@/hooks/useFeedbackFilters';
import { useFeedbackActions } from '@/hooks/useFeedbackActions';
import { useRepost } from '@/contexts/RepostContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';

export function FeedbackContainer() {
  const isMobile = useIsMobile();
  const { filters } = useFeedbackFilters();
  
  console.log('[FeedbackContainer] Rendering with filters:', filters);
  
  // Use our optimized paginated feedback hook
  const {
    feedback,
    isLoading,
    error: loadError,
    hasMore,
    sentinelRef,
    refresh: handleRetry
  } = usePaginatedFeedback({
    filterStatus: filters.status,
    pageSize: 10
  });
  
  console.log('[FeedbackContainer] Feedback data received:', feedback?.length || 0, 'items');
  
  // Use feedback actions
  const {
    handleUpvote,
    handleReport,
    handleDelete,
  } = useFeedbackActions((newFeedback) => {
    // This is a no-op since usePaginatedFeedback manages its own state
    console.log('[FeedbackContainer] Feedback action callback triggered');
  });
  
  // Use the repost context
  const {
    feedbackToRepost,
    repostDialogOpen,
    handleRepost,
    openRepostDialog,
    closeRepostDialog
  } = useRepost();

  // Log authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: auth } = await supabase.auth.getSession();
        console.log('[FeedbackContainer] Auth status:', auth.session ? 'Authenticated' : 'Not authenticated');
      } catch (err) {
        console.error('[FeedbackContainer] Error checking auth:', err);
      }
    };
    
    checkAuth();
  }, []);

  // We now use isMobile from useIsMobile() to determine which view to show
  if (isMobile) {
    return (
      <MobileFeedbackView
        filteredFeedback={feedback}
        isLoading={isLoading}
        loadError={loadError}
        feedback={feedback}
        feedbackToRepost={feedbackToRepost}
        repostDialogOpen={repostDialogOpen}
        handleUpvote={handleUpvote}
        handleReport={handleReport}
        handleDelete={handleDelete}
        openRepostDialog={openRepostDialog}
        closeRepostDialog={closeRepostDialog}
        handleRepost={handleRepost}
        handleRetry={handleRetry}
        loadFeedback={handleRetry}
        sentinelRef={sentinelRef}
        hasMore={hasMore}
      />
    );
  }

  // Desktop view for larger screens
  return (
    <DesktopFeedbackView
      filteredFeedback={feedback}
      isLoading={isLoading}
      loadError={loadError}
      feedback={feedback}
      feedbackToRepost={feedbackToRepost}
      repostDialogOpen={repostDialogOpen}
      handleUpvote={handleUpvote}
      handleReport={handleReport}
      handleDelete={handleDelete}
      openRepostDialog={openRepostDialog}
      closeRepostDialog={closeRepostDialog}
      handleRepost={handleRepost}
      handleRetry={handleRetry}
      sentinelRef={sentinelRef}
      hasMore={hasMore}
    />
  );
}

// Add missing import for supabase
import { supabase } from '@/integrations/supabase/client';
