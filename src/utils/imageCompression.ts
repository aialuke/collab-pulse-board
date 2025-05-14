
/**
 * Utility functions for compressing images before upload
 */

// Maximum dimensions for compressed images
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
// Default compression quality (0-1)
const DEFAULT_QUALITY = 0.8; // Updated from 0.7 to 0.8 for better quality

/**
 * Check if browser supports WebP format
 * Returns a promise that resolves to true if WebP is supported, false otherwise
 */
export const isWebPSupported = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      // If canvas context is not available, assume WebP is not supported
      resolve(false);
      return;
    }
    
    // Try to export as WebP and check if the data URL contains "data:image/webp"
    const dataURL = canvas.toDataURL('image/webp');
    resolve(dataURL.startsWith('data:image/webp'));
  });
};

interface CompressionResult {
  compressedImage: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputFormat: string; // Field to track the output format (webp or jpeg)
  width: number; // Track the output width
  height: number; // Track the output height
}

/**
 * Compresses an image file and returns the compressed data URL
 * Now with WebP support and JPEG fallback
 */
export const compressImage = async (
  file: File,
  maxWidth = MAX_WIDTH,
  maxHeight = MAX_HEIGHT,
  quality = DEFAULT_QUALITY
): Promise<CompressionResult> => {
  // Check WebP support
  const webpSupported = await isWebPSupported();
  
  // Determine output format
  const outputFormat = webpSupported ? 'webp' : 'jpeg';
  const mimeType = webpSupported ? 'image/webp' : 'image/jpeg';
  
  // Original file size in bytes
  const originalSize = file.size;
  
  return new Promise((resolve, reject) => {
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
        // Use WebP if supported, otherwise fall back to JPEG
        const compressedImage = canvas.toDataURL(mimeType, quality);
        
        // Calculate compressed size and compression ratio
        const base64String = compressedImage.split(',')[1];
        const compressedSize = Math.round(base64String.length * 0.75); // Approximate byte size
        const compressionRatio = originalSize / compressedSize;
        
        resolve({
          compressedImage,
          originalSize,
          compressedSize,
          compressionRatio,
          outputFormat,
          width, // Include width in result
          height // Include height in result
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
