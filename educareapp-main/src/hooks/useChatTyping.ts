import { useState, useEffect, useCallback } from 'react';

interface TypingUser {
  id: string;
  name: string;
  role: string;
  timestamp: number;
}

interface UseChatTypingProps {
  groupId?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserRole?: string;
}

export function useChatTyping({ 
  groupId, 
  currentUserId, 
  currentUserName, 
  currentUserRole 
}: UseChatTypingProps) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Simular usuários digitando (em uma implementação real, isso viria do WebSocket/Supabase realtime)
  const simulateTyping = useCallback((userId: string, userName: string, userRole: string) => {
    if (userId === currentUserId) return; // Não mostrar próprio usuário digitando

    setTypingUsers(prev => {
      const existing = prev.find(u => u.id === userId);
      if (existing) {
        // Atualizar timestamp
        return prev.map(u => 
          u.id === userId 
            ? { ...u, timestamp: Date.now() }
            : u
        );
      } else {
        // Adicionar novo usuário digitando
        return [...prev, {
          id: userId,
          name: userName,
          role: userRole,
          timestamp: Date.now()
        }];
      }
    });

    // Remover usuário após 3 segundos de inatividade
    setTimeout(() => {
      setTypingUsers(prev => 
        prev.filter(u => u.id !== userId || Date.now() - u.timestamp > 3000)
      );
    }, 3000);
  }, [currentUserId]);

  // Parar digitação do usuário atual
  const stopTyping = useCallback(() => {
    setIsTyping(false);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }

    // Em uma implementação real, você enviaria um evento de "stop typing" via WebSocket/Supabase
    console.log(`${currentUserName} stopped typing in group ${groupId}`);
  }, [currentUserName, groupId, typingTimeout]);

  // Iniciar digitação do usuário atual
  const startTyping = useCallback(() => {
    if (!currentUserId || !currentUserName || !currentUserRole || !groupId) return;

    setIsTyping(true);

    // Limpar timeout anterior
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Em uma implementação real, você enviaria um evento de "typing" via WebSocket/Supabase
    // Aqui vamos simular enviando para outros usuários
    console.log(`${currentUserName} started typing in group ${groupId}`);

    // Parar de digitar após 3 segundos de inatividade
    const timeout = setTimeout(() => {
      stopTyping();
    }, 3000);

    setTypingTimeout(timeout);
  }, [currentUserId, currentUserName, currentUserRole, groupId, typingTimeout, stopTyping]);

  // Limpar timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  // Simular alguns usuários digitando para demonstração
  useEffect(() => {
    if (!groupId) return;

    // Simular Dra. Ana digitando ocasionalmente
    const interval1 = setInterval(() => {
      if (Math.random() > 0.8) {
        simulateTyping('user-ana', 'Dra. Ana Silva', 'professional');
      }
    }, 10000);

    // Simular Maria (mãe) digitando ocasionalmente
    const interval2 = setInterval(() => {
      if (Math.random() > 0.85) {
        simulateTyping('user-maria', 'Maria Santos', 'parent');
      }
    }, 15000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [groupId, simulateTyping]);

  // Limpar usuários que pararam de digitar há mais de 5 segundos
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setTypingUsers(prev => 
        prev.filter(u => Date.now() - u.timestamp < 5000)
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    typingUsers: typingUsers.filter(u => u.id !== currentUserId),
    isTyping,
    startTyping,
    stopTyping,
    simulateTyping
  };
}
