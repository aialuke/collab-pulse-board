
/**
 * Utility functions for compressing images before upload
 */

// Maximum dimensions for compressed images
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
// Default compression quality (0-1)
const DEFAULT_QUALITY = 0.7;

interface CompressionResult {
  compressedImage: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Compresses an image file and returns the compressed data URL
 */
export const compressImage = (
  file: File,
  maxWidth = MAX_WIDTH,
  maxHeight = MAX_HEIGHT,
  quality = DEFAULT_QUALITY
): Promise<CompressionResult> => {
  return new Promise((resolve, reject) => {
    // Original file size in bytes
    const originalSize = file.size;
    
    // Create a FileReader to read the image
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      // Create an image element
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Determine dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
        
        // Create canvas and context
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Set canvas dimensions and draw image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL with compression
        const compressedImage = canvas.toDataURL(file.type, quality);
        
        // Calculate compressed size and compression ratio
        const base64String = compressedImage.split(',')[1];
        const compressedSize = Math.round(base64String.length * 0.75); // Approximate byte size
        const compressionRatio = originalSize / compressedSize;
        
        resolve({
          compressedImage,
          originalSize,
          compressedSize,
          compressionRatio
        });
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image for compression'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file for compression'));
    };
  });
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};
