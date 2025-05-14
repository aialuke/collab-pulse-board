
import { supabase } from '@/integrations/supabase/client';
// Remove the non-existent import
// import { getImageFormatInfo } from '@/utils/imageCompression';

/**
 * Upload an image to Supabase Storage
 * Supports WebP and standard image formats
 * 
 * @param userId The user ID for the file path
 * @param imageData The data URL of the image
 * @param outputFormat The format of the image (webp or jpeg)
 * @returns The public URL of the uploaded image
 */
export async function uploadFeedbackImage(
  userId: string, 
  imageData: string,
  outputFormat: string = 'jpeg'
): Promise<string> {
  // Extract MIME type and format info from the data URL
  const { mimeType, extension } = getImageFormatInfo(imageData);
  
  // Convert base64 to file
  const res = await fetch(imageData);
  const blob = await res.blob();
  
  // Use the detected format or the specified output format
  // WebP is preferred if the output format specifies it
  const finalExtension = outputFormat === 'webp' ? 'webp' : extension;
  const fileName = `feedback-image-${Date.now()}.${finalExtension}`;
  
  // Create file with appropriate MIME type
  // For WebP images, explicitly set the MIME type to image/webp
  const finalMimeType = outputFormat === 'webp' ? 'image/webp' : mimeType;
  const file = new File([blob], fileName, { type: finalMimeType });

  // Upload to Supabase Storage
  const filePath = `${userId}/${fileName}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('feedback-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('feedback-images')
    .getPublicUrl(uploadData.path);

  return publicUrl;
}

/**
 * Get MIME type and extension from a data URL
 * Helper function to extract format information
 */
export function getImageFormatInfo(dataUrl: string): { mimeType: string; extension: string } {
  const mimeType = dataUrl.split(';')[0].split(':')[1];
  let extension = 'jpg'; // Default extension
  
  if (mimeType === 'image/webp') {
    extension = 'webp';
  } else if (mimeType === 'image/png') {
    extension = 'png';
  } else if (mimeType === 'image/gif') {
    extension = 'gif';
  }
  
  return { mimeType, extension };
}

/**
 * Validates if a given URL is a valid image URL
 * Helps with error handling in image display components
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    // Check if the URL has a valid image extension or is from the storage bucket
    const path = urlObj.pathname.toLowerCase();
    return path.endsWith('.jpg') || 
           path.endsWith('.jpeg') || 
           path.endsWith('.png') || 
           path.endsWith('.gif') || 
           path.endsWith('.webp') ||
           urlObj.hostname.includes('supabase.co');
  } catch (e) {
    return false;
  }
}
