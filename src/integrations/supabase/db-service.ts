
import { SupabaseClient } from './base-client';

// Create a function that returns database operations from the base client
export const createDbClient = (baseClient: SupabaseClient) => {
  return {
    from: baseClient.from.bind(baseClient),
    rpc: baseClient.rpc.bind(baseClient),
  };
};
