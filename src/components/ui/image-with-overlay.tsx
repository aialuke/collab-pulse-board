
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface ImageWithOverlayProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  overlay?: React.ReactNode;
  aspectRatio?: number;
  overlayPosition?: 'bottom' | 'top';
  overlayClassName?: string;
}

/**
 * An accessible image component with optional text overlay
 * that provides proper contrast for text on images
 */
const ImageWithOverlay = React.forwardRef<HTMLDivElement, ImageWithOverlayProps>(
  ({ src, alt, overlay, aspectRatio = 16 / 9, overlayPosition = 'bottom', className, overlayClassName, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative overflow-hidden rounded-md", className)}>
        <AspectRatio ratio={aspectRatio} className="bg-muted">
          <img
            src={src}
            alt={alt}
            className="object-cover w-full h-full"
            {...props}
          />
        </AspectRatio>
        
        {overlay && (
          <div 
            className={cn(
              "absolute left-0 right-0 p-3 z-10",
              overlayPosition === 'bottom' 
                ? "bottom-0 bg-text-overlay-dark text-white" 
                : "top-0 bg-text-overlay-light text-foreground",
              overlayClassName
            )}
            // Make sure overlay text is properly associated with the image for screen readers
            aria-hidden="false"
          >
            {overlay}
          </div>
        )}
      </div>
    );
  }
);

ImageWithOverlay.displayName = "ImageWithOverlay";

export { ImageWithOverlay };
