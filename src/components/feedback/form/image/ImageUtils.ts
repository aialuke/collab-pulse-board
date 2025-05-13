
import { useToast } from "@/components/ui/use-toast";
import { compressImage, formatFileSize } from "@/utils/imageCompression";

export interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export const useImageCompression = () => {
  const { toast } = useToast();

  const compressImageFile = async (file: File): Promise<{
    compressedImage: string;
    compressionStats: CompressionStats | null;
  }> => {
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
        compressionRatio: result.compressionRatio
      };
      
      toast({
        title: "Image compressed",
        description: `Reduced from ${formatFileSize(result.originalSize)} to ${formatFileSize(result.compressedSize)}`,
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
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve({
            compressedImage: reader.result as string,
            compressionStats: null
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  return { compressImageFile };
};
