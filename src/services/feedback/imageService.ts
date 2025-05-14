
import { supabase } from '@/integrations/supabase/client';

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
    const { data, error } = await supabase.storage
      .from('feedback-images')
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: false,
        contentType: file.type // Explicitly set content-type for proper handling
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL with optimized settings
    const { data: { publicUrl } } = supabase.storage
      .from('feedback-images')
      .getPublicUrl(filePath, {
        transform: {
          quality: 80 // Optimize quality for better performance
        }
      });

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
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
      
      // Recreate with optimized transform parameters
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath, {
          transform: {
            quality: 80,
            format: 'webp'
          }
        });
        
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
    const { data, error } = await supabase.storage
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
