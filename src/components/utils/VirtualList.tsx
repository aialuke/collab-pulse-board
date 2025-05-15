
import React, { useCallback, useRef, useState, useEffect } from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  overscan?: number;
  className?: string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className,
  onEndReached,
  endReachedThreshold = 250
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  // Handle scroll updates
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop: currentScrollTop, scrollHeight, clientHeight } = containerRef.current;
    setScrollTop(currentScrollTop);
    
    // Check if we're near the end to trigger loading more
    if (
      onEndReached &&
      scrollHeight - currentScrollTop - clientHeight < endReachedThreshold
    ) {
      onEndReached();
    }
  }, [onEndReached, endReachedThreshold]);
  
  // Calculate the visible items
  const getVisibleRange = useCallback(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(height / itemHeight) + 2 * overscan;
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount);
    
    return { startIndex, endIndex };
  }, [scrollTop, height, itemHeight, overscan, items.length]);
  
  // Memoize the visible range
  const { startIndex, endIndex } = getVisibleRange();
  
  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;
    
    // Add scroll listener
    currentRef.addEventListener('scroll', handleScroll);
    
    // Run initial scroll handling
    handleScroll();
    
    // Cleanup
    return () => {
      currentRef.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  // Calculate the total content height
  const totalHeight = items.length * itemHeight;
  
  // Create the visible items
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    if (i < items.length) {
      const item = items[i];
      const style = {
        position: 'absolute' as const,
        top: i * itemHeight,
        height: itemHeight,
        left: 0,
        right: 0
      };
      visibleItems.push(renderItem(item, i, style));
    }
  }
  
  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height, overflow: 'auto', position: 'relative' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
}

export default React.memo(VirtualList) as typeof VirtualList;
