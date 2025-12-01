
import { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/services/supabase';
import type { Database } from '@/integrations/supabase/database-types';
import { config } from '@/config/supabase-config';

export function useSupabaseClient() {
  const [client, setClient] = useState<SupabaseClient<Database> | null>(null);
  
  useEffect(() => {
    if (isSupabaseConfigured()) {
      try {
        // Use the pre-configured client from the integrations folder
        import('@/integrations/supabase/client').then(({ supabase }) => {
          setClient(supabase as SupabaseClient<Database>);
        }).catch(error => {
          console.warn('Error importing Supabase client, creating a new one:', error);
          // Fallback to creating a new client if import fails
          const newClient = createClient<Database>(
            config.url,
            config.anonKey
          );
          setClient(newClient);
        });
      } catch (error) {
        console.warn('Error initializing Supabase client:', error);
      }
    }
  }, []);
  
  return client;
}

export default useSupabaseClient;
