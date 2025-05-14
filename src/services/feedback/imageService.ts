
import { supabaseStorage } from '@/integrations/supabase/storage-client';
import { supabaseAuth } from '@/integrations/supabase/auth-client';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param userId - The ID of the user uploading the file
 * @returns URL of the uploaded image
 */
export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Add proper cache-control headers for optimal caching
    const { data, error } = await supabaseStorage.storage
      .from('feedback-images')
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: false,
        contentType: file.type, // Explicitly set content-type for proper handling
        // Add metadata for dimensions - this helps with CLS
        metadata: {
          width: '1200', // Maximum width from compression
          height: '1200', // Maximum height from compression
          format: fileExt
        }
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL with optimized settings
    const { data: { publicUrl } } = supabaseStorage.storage
      .from('feedback-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}

/**
 * Upload a feedback image from data URL
 * @param userId - User ID
 * @param dataUrl - Image data URL
 * @param outputFormat - Output format ('jpeg' or 'webp')
 * @returns Uploaded image URL
 */
export async function uploadFeedbackImage(
  userId: string, 
  dataUrl: string, 
  outputFormat: 'jpeg' | 'webp' = 'webp'
): Promise<string> {
  try {
    // Convert data URL to File object
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    
    const fileName = `feedback_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${outputFormat}`;
    const file = new File([blob], fileName, { type: `image/${outputFormat}` });
    
    // Upload the file
    return await uploadImage(file, userId);
  } catch (error) {
    console.error('Error uploading feedback image:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Get optimized image URL for a given path
 * @param path - The path to the image
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(path: string): string {
  if (!path) return '';
  
  try {
    // Check if it's already a Supabase URL
    if (path.includes('supabase.co')) {
      // Extract the bucket and filepath from the URL
      const url = new URL(path);
      const pathSegments = url.pathname.split('/');
      const bucketName = pathSegments[2];
      const filePath = pathSegments.slice(4).join('/');
      
      // Recreate with optimized transform parameters - removed problematic format parameter
      const { data: { publicUrl } } = supabaseStorage.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      return publicUrl;
    }
    
    // For external URLs, return as is
    return path;
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return path;
  }
}

/**
 * Check if image exists in storage
 * @param path - Path to check
 */
export async function checkImageExists(path: string): Promise<boolean> {
  try {
    if (!path || !path.includes('supabase.co')) return false;
    
    // Extract bucket and file path from URL
    const url = new URL(path);
    const pathSegments = url.pathname.split('/');
    const bucketName = pathSegments[2];
    const filePath = pathSegments.slice(4).join('/');
    
    // Use head request to check if file exists without downloading
    const { data, error } = await supabaseStorage.storage
      .from(bucketName)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        limit: 1,
        offset: 0,
        search: filePath.split('/').pop(),
      });
    
    if (error) {
      console.error('Error checking if image exists:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error in checkImageExists:', error);
    return false;
  }
}
