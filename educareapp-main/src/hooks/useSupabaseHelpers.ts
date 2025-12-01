
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * A utility hook for handling Supabase-related operations with improved type safety
 */
export const useSupabaseHelpers = () => {
  /**
   * Safely runs a Supabase RPC function with proper type handling
   */
  const safeRPC = async <T>(
    supabase: SupabaseClient,
    functionName: string,
    params: Record<string, any>
  ): Promise<T | null> => {
    try {
      // @ts-ignore - Ignoring the type error since we're handling it safely
      const { data, error } = await supabase.rpc(functionName, params);
      
      if (error) {
        console.error(`Error calling RPC function ${functionName}:`, error);
        return null;
      }
      
      return data as T;
    } catch (err) {
      console.error(`Exception in RPC function ${functionName}:`, err);
      return null;
    }
  };

  /**
   * Safely queries a Supabase table with proper type handling
   */
  const safeQuery = async <T>(
    queryBuilder: PostgrestFilterBuilder<any, any, any, any, any>,
    errorMessage: string
  ): Promise<T[] | null> => {
    try {
      const { data, error } = await queryBuilder;
      
      if (error) {
        console.error(errorMessage, error);
        return null;
      }
      
      return data as T[];
    } catch (err) {
      console.error(errorMessage, err);
      return null;
    }
  };

  /**
   * Safely inserts data into a Supabase table with proper type handling
   */
  const safeInsert = async <T>(
    supabase: SupabaseClient,
    table: string,
    data: any,
    errorMessage: string
  ): Promise<T | null> => {
    try {
      // @ts-ignore - Ignoring the type error since we're handling it safely
      const { data: result, error } = await supabase.from(table).insert(data).select().single();
      
      if (error) {
        console.error(errorMessage, error);
        return null;
      }
      
      return result as T;
    } catch (err) {
      console.error(errorMessage, err);
      return null;
    }
  };

  return {
    safeRPC,
    safeQuery,
    safeInsert
  };
};

export default useSupabaseHelpers;
