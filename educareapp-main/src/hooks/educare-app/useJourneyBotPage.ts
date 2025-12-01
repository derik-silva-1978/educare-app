import { useState, useEffect } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { supabase } from '@/integrations/supabase/client';

interface Child {
  id: string;
  name: string;
  birthdate: string;
  age: number;
  gender?: string;
}

export function useJourneyBotPage() {
  const { user } = useAuth();
  
  const [showChildSelector, setShowChildSelector] = useState(true);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateAge = (birthdate: string): number => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return Math.max(0, age);
  };

  const fetchChildren = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        setError('Usuário não autenticado.');
        return;
      }

      const { data: childrenData, error: childrenError } = await supabase
        .from('educare_children')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (childrenError) {
        throw new Error(`Erro ao buscar crianças: ${childrenError.message}`);
      }

      if (childrenData && childrenData.length > 0) {
        // Calculate age for each child with better precision
        const childrenWithAge = childrenData.map(child => ({
          ...child,
          age: child.age || calculateAge(child.birthdate)
        }));
        setChildren(childrenWithAge);
      } else {
        setError('Nenhuma criança encontrada. Adicione uma criança primeiro.');
      }
    } catch (err: any) {
      console.error('Error fetching children:', err);
      setError(err.message || 'Erro ao carregar as crianças.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildSelect = (childId: string) => {
    const child = children.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
      setShowChildSelector(false);
    }
  };

  const handleBackToSelector = () => {
    setSelectedChild(null);
    setShowChildSelector(true);
  };

  useEffect(() => {
    fetchChildren();
  }, [user]);

  return {
    showChildSelector,
    selectedChild,
    children,
    isLoading,
    error,
    handleChildSelect,
    handleBackToSelector,
    setShowChildSelector
  };
}