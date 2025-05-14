
import { supabase } from '@/integrations/supabase/client';

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
  // Get the MIME type from the data URL
  const mimeType = imageData.split(';')[0].split(':')[1];
  
  // Convert base64 to file
  const res = await fetch(imageData);
  const blob = await res.blob();
  
  // Create a unique filename with the appropriate extension
  const extension = outputFormat === 'webp' ? 'webp' : 'jpg';
  const fileName = `feedback-image-${Date.now()}.${extension}`;
  const file = new File([blob], fileName, { type: mimeType });

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
