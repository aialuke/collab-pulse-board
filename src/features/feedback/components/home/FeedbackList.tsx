
import React, { useRef, useEffect } from 'react';
import { FeedbackCardContainer } from '../card/FeedbackCardContainer';
import { FeedbackType } from '@/types/feedback';
import { FixedSizeList as List } from 'react-window';
import { useIsMobile } from '@/hooks/use-mobile';

interface FeedbackListProps {
  feedback: FeedbackType[];
  onUpvote: (id: string) => void;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
  onRepost?: (id: string) => void;
  hasMore?: boolean;
  sentinelRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Optimized FeedbackList component using virtualization for better performance
 * with large lists. Only renders items that are visible in the viewport.
 */
export function FeedbackList({ 
  feedback,
  onUpvote,
  onReport,
  onDelete,
  onRepost,
  hasMore,
  sentinelRef
}: FeedbackListProps) {
  const isMobile = useIsMobile();
  const parentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  
  // Reset list scroll position when feedback changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(0);
    }
  }, [feedback.length === 0]);
  
  // Don't use virtualization for small lists (improves SEO and initial render)
  if (feedback.length <= 10) {
    return (
      <div className="space-y-4">
        {feedback.map((item) => (
          <FeedbackCardContainer
            key={item.id}
            feedback={item}
            onUpvote={onUpvote}
            onReport={onReport}
            onDelete={onDelete}
            onRepost={onRepost}
          />
        ))}
        {hasMore && (
          <div ref={sentinelRef} className="h-4" aria-hidden="true" />
        )}
      </div>
    );
  }
  
  // Calculate item sizes based on content 
  // This could be enhanced with dynamic sizing in a more complex implementation
  const getItemHeight = (index: number) => {
    const item = feedback[index];
    // Base height for a card
    let height = 180; 
    
    // Adjust for content length
    if (item.content && item.content.length > 200) {
      height += 40;
    }
    
    // Adjust for image
    if (item.imageUrl || item.image) {
      height += 240;
    }
    
    // Adjust for repost card
    if (item.isRepost && item.originalPost) {
      height += 160;
      
      // Add more height if original post has an image
      if (item.originalPost.imageUrl || item.originalPost.image) {
        height += 120;
      }
    }
    
    return height;
  };
  
  // Render item row with the FeedbackCardContainer
  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    // Special case for the last item which contains the sentinel for infinite loading
    if (hasMore && index === feedback.length) {
      return <div ref={sentinelRef} style={style} className="h-16 flex items-center justify-center" />;
    }
    
    const item = feedback[index];
    return (
      <div style={{...style, paddingBottom: '16px'}}>
        <FeedbackCardContainer
          key={item.id}
          feedback={item}
          onUpvote={onUpvote}
          onReport={onReport}
          onDelete={onDelete}
          onRepost={onRepost}
        />
      </div>
    );
  };
  
  // Determine list height based on viewport
  const listHeight = isMobile ? 500 : 600;
  
  return (
    <div ref={parentRef} className="w-full" style={{ height: `${listHeight}px` }}>
      <List
        ref={listRef}
        height={listHeight}
        width="100%"
        itemCount={hasMore ? feedback.length + 1 : feedback.length}
        itemSize={getItemHeight}
        overscanCount={2} // Number of items to render above/below visible area
      >
        {Row}
      </List>
    </div>
  );
}
