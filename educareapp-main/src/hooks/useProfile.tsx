
import { useState, useEffect } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { supabase } from '@/integrations/supabase/client';

// UserProfile shape updated to reflect educare_profiles
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch from correct table: educare_profiles
        const { data, error } = await supabase
          .from('educare_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile({
            id: data.id,
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email,
            email: data.email,
            role: data.role,
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, isLoading, error };
};
