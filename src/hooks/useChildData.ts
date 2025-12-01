import { useState, useEffect } from 'react';
import { useCustomChildren } from '@/hooks/educare-app/useCustomChildren';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  gender?: string;
  [key: string]: any;
}

interface UseChildDataReturn {
  child: Child | null;
  isLoading: boolean;
  error: string | null;
}

export const useChildData = (childId: string): UseChildDataReturn => {
  const { children, isLoading: isLoadingChildren } = useCustomChildren();
  const [child, setChild] = useState<Child | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!childId) {
      setError('ID da criança não fornecido');
      return;
    }

    if (!isLoadingChildren && children) {
      const foundChild = children.find(c => c.id === childId);
      
      if (foundChild) {
        setChild(foundChild);
        setError(null);
      } else {
        setChild(null);
        setError('Criança não encontrada');
      }
    }
  }, [childId, children, isLoadingChildren]);

  return {
    child,
    isLoading: isLoadingChildren,
    error
  };
};
