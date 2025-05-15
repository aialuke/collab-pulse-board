
import { SupabaseClient } from './base-client';

/**
 * Enhanced storage client with optimized methods for file operations
 */
export const createStorageClient = (baseClient: SupabaseClient) => {
  return {
    storage: baseClient.storage,
    
    // Optimized methods for common operations
    uploadFile: async (bucket: string, path: string, file: File, options = {}) => {
      try {
        const { data, error } = await baseClient.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: '3600',
            upsert: true,
            ...options
          });
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    },
    
    getPublicUrl: (bucket: string, path: string) => {
      return baseClient.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    }
  };
};
