
import { baseClient } from './base-client';

// Export the complete storage client with all necessary methods
export const supabaseStorage = {
  storage: baseClient.storage,
  // Add a helper method to generate public URLs for storage items
  getPublicUrl: (bucket: string, path: string) => {
    return baseClient.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
};
