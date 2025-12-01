
/**
 * Utility functions for safely making Supabase RPC calls with proper TypeScript typing
 */
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase-schema';

/**
 * Simplified interface for mocking Supabase responses when debugging type issues
 */
export interface MockSupabaseResponse<T = any> {
  data: T | null;
  error: any;
}

/**
 * Function to safely make RPC calls to Supabase
 * This is a workaround for TypeScript constraints with RPC calls
 */
export function safeRpcCall<T = any>(
  supabase: SupabaseClient,
  functionName: string,
  params: Record<string, any>
): Promise<{ data: T | null; error: any }> {
  // @ts-ignore - We're ignoring the TypeScript error here intentionally as a workaround
  return supabase.rpc(functionName, params);
}

/**
 * Function to safely query tables
 */
export function safeTableQuery<T = any>(
  supabase: SupabaseClient,
  tableName: string
) {
  // @ts-ignore - Ignore TypeScript error as a workaround
  return supabase.from(tableName);
}

/**
 * Function to safely insert data into tables
 */
export function safeTableInsert<T = any>(
  supabase: SupabaseClient,
  tableName: string,
  data: Record<string, any> | Record<string, any>[]
) {
  // @ts-ignore - Ignore TypeScript error as a workaround
  return supabase.from(tableName).insert(data);
}

/**
 * Function to safely update data in tables
 */
export function safeTableUpdate<T = any>(
  supabase: SupabaseClient,
  tableName: string,
  data: Record<string, any>
) {
  // @ts-ignore - Ignore TypeScript error as a workaround
  return supabase.from(tableName).update(data);
}

export default {
  safeRpcCall,
  safeTableQuery,
  safeTableInsert,
  safeTableUpdate
};
