
import { baseClient } from './base-client';

/**
 * Unified Supabase storage client that provides access to all storage-related functionality
 * with proper TypeScript typing and optimized methods
 */
export const supabaseStorage = {
  // Core Storage API methods
  storage: baseClient.storage,

  /**
   * Upload a file to a specific bucket with optimized settings
   * @param bucket - Bucket name
   * @param path - Path in the bucket
   * @param file - File to upload
   * @param options - Upload options
   */
  uploadFile: async (bucket: string, path: string, file: File, options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
    metadata?: Record<string, string>;
  }) => {
    const defaultOptions = {
      cacheControl: '31536000', // 1 year cache
      upsert: false,
      contentType: file.type,
    };

    return await baseClient.storage
      .from(bucket)
      .upload(path, file, { ...defaultOptions, ...options });
  },

  /**
   * Get a public URL for a file
   * @param bucket - Bucket name
   * @param path - Path in the bucket
   * @returns Public URL
   */
  getPublicUrl: (bucket: string, path: string) => {
    return baseClient.storage
      .from(bucket)
      .getPublicUrl(path);
  },

  /**
   * Check if a file exists in storage
   * @param bucket - Bucket name
   * @param folderPath - Path to the folder
   * @param fileName - Filename to check
   * @returns Boolean indicating if file exists
   */
  checkFileExists: async (bucket: string, folderPath: string, fileName: string): Promise<boolean> => {
    try {
      const { data, error } = await baseClient.storage
        .from(bucket)
        .list(folderPath, {
          limit: 1,
          offset: 0,
          search: fileName,
        });
      
      if (error) {
        console.error('Error checking if file exists:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error in checkFileExists:', error);
      return false;
    }
  }
};
