
import { SupabaseClient } from './base-client';

// Create a function that returns storage operations from the base client
export const createStorageClient = (baseClient: SupabaseClient) => {
  return {
    storage: baseClient.storage,
  };
};
