
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';

export type ProfessionalChildAccess = {
  childId: string;
  childName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export function useProfessionalChildren(childId?: string) {
  const [childrenAccess, setChildrenAccess] = useState<ProfessionalChildAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProfessionalChildren() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('educare_professional_children')
          .select(`
            child_id,
            status,
            created_at,
            educare_children(first_name, last_name)
          `)
          .eq('professional_id', user.id);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedData: ProfessionalChildAccess[] = data.map((item) => {
            // Handle the case where educare_children might be null or an array
            const childData = Array.isArray(item.educare_children) 
              ? item.educare_children[0] 
              : item.educare_children;
            
            return {
              childId: item.child_id,
              childName: childData 
                ? `${childData.first_name} ${childData.last_name}`
                : 'Unknown Child',
              status: item.status as 'pending' | 'approved' | 'rejected',
              createdAt: item.created_at
            };
          });
          
          setChildrenAccess(formattedData);
          
          // If childId is provided, check if professional has access to this specific child
          if (childId) {
            const accessToChild = formattedData.find(
              child => child.childId === childId && child.status === 'approved'
            );
            setHasAccess(!!accessToChild);
          }
        }
      } catch (error: any) {
        console.error("Error loading professional children:", error.message);
        toast({
          title: "Error",
          description: "Failed to load children access data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfessionalChildren();
  }, [user, childId, toast]);
  
  return {
    childrenAccess,
    isLoading,
    hasAccess,
    // Determine if professional has approved access to a specific child
    hasAccessToChild: (specificChildId: string) => 
      childrenAccess.some(child => 
        child.childId === specificChildId && child.status === 'approved'
      )
  };
}
