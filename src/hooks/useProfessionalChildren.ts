
import { useState, useEffect } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';
import { httpClient } from '@/services/api/httpClient';

export type ProfessionalChildAccess = {
  childId: string;
  childName: string;
  birthDate: string;
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
        const response = await httpClient.get('/children/professional/children');
        const backendChildren = response.data.children;
        
        const formattedData: ProfessionalChildAccess[] = backendChildren.map((child: any) => {
          return {
            childId: child.id,
            childName: `${child.firstName} ${child.lastName}`,
            birthDate: child.birthDate || new Date().toISOString(),
            status: child.status as 'pending' | 'approved' | 'rejected',
            createdAt: child.createdAt
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
