
import { baseClient } from './base-client';

// Export only the database-related methods
export const supabaseDb = {
  from: baseClient.from.bind(baseClient),
  rpc: baseClient.rpc.bind(baseClient),
};
