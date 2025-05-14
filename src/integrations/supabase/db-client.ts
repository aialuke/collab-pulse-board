
import { baseClient } from './base-client';
import type { Database } from './types';

// Export only the database-related methods with proper typings
export const supabaseDb = {
  /**
   * Query a table in the database with strict typing
   * @param table - Table name (must be a valid table in the database)
   * @returns PostgrestQueryBuilder for the table
   */
  from: <T extends keyof Database['public']['Tables']>(
    table: T
  ) => baseClient.from(table),

  /**
   * Call a database function with proper type checking
   * @param fn - Function name (must be a valid function in the database)
   * @param params - Parameters for the function
   * @returns PostgrestFilterBuilder for the function
   */
  rpc: <
    FunctionName extends keyof Database['public']['Functions'],
    Args extends Database['public']['Functions'][FunctionName]['Args']
  >(
    fn: FunctionName,
    params: Args
  ) => baseClient.rpc(fn, params),
};
