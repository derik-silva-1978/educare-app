
import { useState, useEffect } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateAge } from '@/utils/dateUtils';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  gender: string;
  city?: string;
  bloodtype?: string;
  user_id: string;
  journey_progress?: number;
  age: number;
  observations?: string;
}

export const useSupabaseChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchChildren = async () => {
    if (!user) {
      setChildren([]);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);

      console.log('Fetching children for user:', user.id);

      const { data, error } = await supabase
        .from('educare_children')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching children:', error);
        throw error;
      }

      console.log('Children fetched successfully:', data?.length || 0);

      // Calculate age for each child with proper handling
      const childrenWithAge = (data || []).map(child => {
        const ageData = calculateAge(child.birthdate);
        return {
          ...child,
          age: ageData.years // Use calculated age in years
        };
      });

      setChildren(childrenWithAge);
    } catch (error: any) {
      console.error('Error in fetchChildren:', error);
      setIsError(true);
      toast({
        title: "Erro ao carregar crianças",
        description: error.message || "Não foi possível carregar a lista de crianças.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshListing = () => {
    console.log('Refreshing children list...');
    fetchChildren();
  };

  useEffect(() => {
    fetchChildren();
  }, [user]);

  return {
    children,
    isLoading,
    isError,
    refreshListing
  };
};
