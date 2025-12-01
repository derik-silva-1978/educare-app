import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface UseTitiNautaBadgesReturn {
  badges: Badge[];
  unlockBadge: (badgeId: string) => void;
  hasBadge: (badgeId: string) => boolean;
  getLatestBadge: () => Badge | null;
  isLoading: boolean;
}

export const useTitiNautaBadges = (childId: string): UseTitiNautaBadgesReturn => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Carregar badges do localStorage ou inicializar
  useEffect(() => {
    if (!childId) return;
    
    setIsLoading(true);
    
    try {
      // Tentar carregar badges do localStorage
      const storedBadges = localStorage.getItem(`titinauta_badges_${childId}`);
      
      if (storedBadges) {
        setBadges(JSON.parse(storedBadges));
      } else {
        // Inicializar badges padrão
        const defaultBadges: Badge[] = [
          {
            id: 'first_conversation',
            title: 'Primeira Conversa',
            description: 'Completou sua primeira conversa com o TitiNauta',
            icon: '🎯',
            unlocked: false
          },
          {
            id: 'communication_expert',
            title: 'Especialista em Comunicação',
            description: 'Completou todas as perguntas do domínio de comunicação',
            icon: '💬',
            unlocked: false
          },
          {
            id: 'motor_expert',
            title: 'Especialista em Desenvolvimento Motor',
            description: 'Completou todas as perguntas do domínio motor',
            icon: '🏃',
            unlocked: false
          },
          {
            id: 'cognitive_expert',
            title: 'Especialista em Desenvolvimento Cognitivo',
            description: 'Completou todas as perguntas do domínio cognitivo',
            icon: '🧠',
            unlocked: false
          },
          {
            id: 'full_month',
            title: 'Mês Completo',
            description: 'Completou todas as perguntas de um mês',
            icon: '🌟',
            unlocked: false
          }
        ];
        
        setBadges(defaultBadges);
        localStorage.setItem(`titinauta_badges_${childId}`, JSON.stringify(defaultBadges));
      }
    } catch (error) {
      console.error('Erro ao carregar badges:', error);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  // Salvar badges no localStorage quando mudam
  useEffect(() => {
    if (!childId || badges.length === 0) return;
    
    localStorage.setItem(`titinauta_badges_${childId}`, JSON.stringify(badges));
  }, [badges, childId]);

  // Desbloquear um badge
  const unlockBadge = useCallback((badgeId: string) => {
    setBadges(prevBadges => {
      const updatedBadges = prevBadges.map(badge => {
        if (badge.id === badgeId && !badge.unlocked) {
          // Mostrar toast de conquista
          toast({
            title: `🎉 Nova Conquista: ${badge.title}`,
            description: badge.description,
            variant: 'default'
          });
          
          return {
            ...badge,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
        return badge;
      });
      
      return updatedBadges;
    });
  }, [toast]);

  // Verificar se um badge está desbloqueado
  const hasBadge = useCallback((badgeId: string) => {
    return badges.some(badge => badge.id === badgeId && badge.unlocked);
  }, [badges]);

  // Obter o badge mais recente
  const getLatestBadge = useCallback((): Badge | null => {
    const unlockedBadges = badges.filter(badge => badge.unlocked && badge.unlockedAt);
    
    if (unlockedBadges.length === 0) {
      return null;
    }
    
    // Ordenar por data de desbloqueio (mais recente primeiro)
    return unlockedBadges.sort((a, b) => {
      const dateA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
      const dateB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
      return dateB - dateA;
    })[0];
  }, [badges]);

  return {
    badges,
    unlockBadge,
    hasBadge,
    getLatestBadge,
    isLoading
  };
};

export default useTitiNautaBadges;
