
import { useToast } from "@/hooks/use-toast";
import { compressImage, formatFileSize } from "@/utils/imageCompression";

export interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputFormat?: string;
}

interface ImageCompressionResult {
  compressedImage: string;
  compressionStats: CompressionStats | null;
}

export const useImageCompression = () => {
  const { toast } = useToast();

  const compressImageFile = async (file: File): Promise<ImageCompressionResult> => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      throw new Error("File too large");
    }

    try {
      // Compress the image
      const result = await compressImage(file);
      
      const stats: CompressionStats = {
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        outputFormat: result.outputFormat
      };
      
      toast({
        title: "Image compressed",
        description: `Reduced from ${formatFileSize(result.originalSize)} to ${formatFileSize(result.compressedSize)} (${result.outputFormat})`,
      });

      return {
        compressedImage: result.compressedImage,
        compressionStats: stats
      };
    } catch (error) {
      console.error('Image compression failed:', error);
      toast({
        title: "Compression failed",
        description: "Using original image instead.",
        variant: "destructive",
      });
      
      // Fallback to original image loading
      return new Promise<ImageCompressionResult>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve({
              compressedImage: reader.result,
              compressionStats: null
            });
          } else {
            reject(new Error("Failed to read file as data URL"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  return { compressImageFile };
};
