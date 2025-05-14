
import { SupabaseClient } from './base-client';

// Create a function that returns storage operations from the base client
export const createStorageClient = (baseClient: SupabaseClient) => {
  return {
    storage: baseClient.storage,
    getPublicUrl: (bucket: string, path: string) => {
      return baseClient.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    }
  };
};
