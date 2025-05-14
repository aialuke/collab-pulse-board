
import React from 'react';
import { CompressionStats } from './ImageUtils';
import { formatFileSize } from '@/utils/imageCompression';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImagePreviewProps {
  image: string;
  compressionStats: CompressionStats | null;
}

export function ImagePreview({ image, compressionStats }: ImagePreviewProps) {
  return (
    <div className="mt-2 space-y-2">
      <div className="relative rounded-md overflow-hidden">
        <AspectRatio ratio={4/3} className="bg-muted min-h-[150px]">
          <img
            src={image}
            alt="Preview"
            className="object-contain w-full h-full"
            width={1200}
            height={900}
            loading="lazy"
          />
        </AspectRatio>
      </div>
      
      {compressionStats && (
        <div className="text-xs text-muted-foreground">
          <p>Original: {formatFileSize(compressionStats.originalSize)}</p>
          <p>Compressed: {formatFileSize(compressionStats.compressedSize)} {compressionStats.outputFormat && `(${compressionStats.outputFormat})`}</p>
          <p>Saved: {Math.round((1 - 1/compressionStats.compressionRatio) * 100)}% of original size</p>
        </div>
      )}
    </div>
  );
}
