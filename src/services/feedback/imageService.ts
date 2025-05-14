
import { supabaseStorage } from '@/integrations/supabase/storage-client';
import { supabaseAuth } from '@/integrations/supabase/auth-client';

const FEEDBACK_IMAGES_BUCKET = 'feedback-images';

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

    // Use the consolidated storage client
    const { data, error } = await supabaseStorage.uploadFile(
      FEEDBACK_IMAGES_BUCKET,
      filePath,
      file,
      {
        cacheControl: '31536000', // 1 year cache
        contentType: file.type,
        metadata: {
          width: '1200', // Maximum width from compression
          height: '1200', // Maximum height from compression
          format: fileExt || ''
        }
      }
    );

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseStorage.getPublicUrl(
      FEEDBACK_IMAGES_BUCKET,
      filePath
    );

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
      
      // Recreate with optimized transform parameters
      const { data: { publicUrl } } = supabaseStorage.getPublicUrl(
        bucketName,
        filePath
      );
        
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
    const folderPath = filePath.split('/').slice(0, -1).join('/');
    const fileName = filePath.split('/').pop() || '';
    
    // Use consolidated storage client
    return await supabaseStorage.checkFileExists(
      bucketName,
      folderPath,
      fileName
    );
  } catch (error) {
    console.error('Error in checkImageExists:', error);
    return false;
  }
}
