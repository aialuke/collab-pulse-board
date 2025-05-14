
import React from 'react';
import { CompressionStats } from './ImageUtils';
import { formatFileSize } from '@/utils/imageCompression';

interface ImagePreviewProps {
  image: string;
  compressionStats: CompressionStats | null;
}

export function ImagePreview({ image, compressionStats }: ImagePreviewProps) {
  return (
    <div className="mt-2 space-y-2">
      <div className="relative rounded-md overflow-hidden">
        <img
          src={image}
          alt="Preview"
          className="w-full max-h-[150px] sm:max-h-[200px] object-contain"
        />
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
