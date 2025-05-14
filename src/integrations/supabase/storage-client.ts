
import { baseClient } from './base-client';

// Export only the storage-related methods
export const supabaseStorage = {
  storage: baseClient.storage,
};
