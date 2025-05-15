
import React, { forwardRef, useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageWithOverlayProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  overlay?: React.ReactNode;
  aspectRatio?: number;
  overlayPosition?: 'bottom' | 'top';
  overlayClassName?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  blurDataUrl?: string;  // Base64 blur placeholder
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * An enhanced image component with performance optimizations:
 * - Lazy loading for off-screen images
 * - Eager loading for priority images
 * - Progressive loading with skeleton placeholder
 * - Proper aspect ratio to prevent layout shifts
 * - LQIP (Low Quality Image Placeholder) support
 * - Native lazy loading with fetchPriority
 */
const ImageWithOverlay = forwardRef<HTMLDivElement, ImageWithOverlayProps>(({ 
  src, 
  alt, 
  overlay, 
  aspectRatio = 16 / 9, 
  overlayPosition = 'bottom', 
  className, 
  overlayClassName, 
  width = 1200,
  height = 800,
  loading = 'lazy', // Default to lazy loading for better performance
  priority = false,
  blurDataUrl,
  fetchPriority = 'auto',
  ...props 
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Use eager loading for priority images (visible in viewport on initial load)
  const loadingStrategy = priority ? 'eager' : loading;
  const actualFetchPriority = priority ? 'high' : fetchPriority;
  
  // Preload high priority images
  useEffect(() => {
    if (priority && src && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [priority, src]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-md", className)}>
      <AspectRatio ratio={aspectRatio} className="bg-muted">
        {!isLoaded && !hasError && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        
        {/* Blur placeholder */}
        {blurDataUrl && !isLoaded && !hasError && (
          <img
            src={blurDataUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
            aria-hidden="true"
          />
        )}
        
        {src && !hasError ? (
          <img
            src={src}
            alt={alt || "Image"}
            className={cn(
              "object-cover w-full h-full transition-opacity duration-300",
              !isLoaded && "opacity-0",
              isLoaded && "opacity-100"
            )}
            width={width}
            height={height}
            loading={loadingStrategy}
            fetchPriority={actualFetchPriority}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            {...props}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-sm">
            {hasError ? "Failed to load image" : "Image unavailable"}
          </div>
        )}
      </AspectRatio>
      
      {overlay && (
        <div 
          className={cn(
            "absolute left-0 right-0 p-3 z-10",
            overlayPosition === 'bottom' 
              ? "bottom-0 bg-gradient-to-t from-black/80 to-transparent text-white" 
              : "top-0 bg-gradient-to-b from-black/60 to-transparent text-white",
            overlayClassName
          )}
          aria-hidden="false"
        >
          {overlay}
        </div>
      )}
    </div>
  );
});

ImageWithOverlay.displayName = "ImageWithOverlay";

export { ImageWithOverlay };
