
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AutoSaveOptions {
  enabled?: boolean;
  interval?: number; // in seconds
  showSuccessToast?: boolean;
}

interface UseAutoSaveProps<T> {
  data: T | null;
  onSave: () => Promise<boolean>;
  options?: AutoSaveOptions;
}

// Export the type so it can be imported by other components
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export const useAutoSave = <T>({
  data,
  onSave,
  options = {}
}: UseAutoSaveProps<T>) => {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const prevDataRef = useRef<T | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const { toast } = useToast();
  
  const {
    enabled = true,
    interval = 30,
    showSuccessToast = false
  } = options;
  
  // Format the lastSaved date in a human-readable format
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    
    try {
      return formatDistanceToNow(lastSaved, { 
        addSuffix: true,
        locale: ptBR 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };
  
  // Save function with progress tracking
  const saveData = async () => {
    if (!enabled || !data || status === 'saving') return;
    
    try {
      setStatus('saving');
      
      const success = await onSave();
      
      if (success) {
        setStatus('saved');
        setLastSaved(new Date());
        prevDataRef.current = JSON.parse(JSON.stringify(data));
        
        if (showSuccessToast) {
          toast({
            title: 'Salvo automaticamente',
            description: `Alterações salvas automaticamente às ${format(new Date(), 'HH:mm:ss')}`,
            duration: 3000
          });
        }
      } else {
        setStatus('error');
        toast({
          title: 'Erro ao salvar automaticamente',
          description: 'Ocorreu um erro ao tentar salvar suas alterações',
          variant: 'destructive'
        });
      }
    } catch (error) {
      setStatus('error');
      console.error('Error during autosave:', error);
      toast({
        title: 'Erro ao salvar automaticamente',
        description: 'Ocorreu um erro ao tentar salvar suas alterações',
        variant: 'destructive'
      });
    }
  };
  
  // Check if data has changed
  const hasChanged = () => {
    if (!data || !prevDataRef.current) return false;
    
    return JSON.stringify(data) !== JSON.stringify(prevDataRef.current);
  };
  
  // Setup auto-save interval
  useEffect(() => {
    if (!enabled) return;
    
    const setupInterval = () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(() => {
        if (hasChanged()) {
          saveData();
        }
      }, interval * 1000);
    };
    
    setupInterval();
    
    // Store initial data
    if (data && !prevDataRef.current) {
      prevDataRef.current = JSON.parse(JSON.stringify(data));
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [enabled, interval, data]);
  
  // Manually trigger save
  const triggerSave = () => {
    if (data) {
      saveData();
    }
  };
  
  return {
    status,
    lastSaved,
    formatLastSaved,
    save: triggerSave,
    hasChanges: hasChanged()
  };
};

export default useAutoSave;
