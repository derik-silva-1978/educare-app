import React, { createContext, useEffect, useState } from 'react';
import type { AuthContextType } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/hooks/usePermissions';
import type { Permission, UserRole, User } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut, 
  refreshAuthToken,
  sendPhoneVerification,
  verifyPhoneCode,
  loginByPhone,
  updatePassword as updatePasswordApi,
  AuthUser,
  PhoneLoginResult
} from '@/services/api/authService';
import { 
  getStoredAuthToken, 
  getStoredUserData, 
  setStoredUserData,
  clearAuthStorage 
} from '@/utils/authStorage';

// Contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função auxiliar para converter AuthUser para o formato User do frontend
const convertApiUser = (apiUser: AuthUser | null): User | null => {
  if (!apiUser) return null;
  
  return {
    id: apiUser.id,
    uid: apiUser.id,
    name: apiUser.name || 'Usuário',
    displayName: apiUser.name || 'Usuário',
    email: apiUser.email || '',
    photoURL: '',
    avatar: '',
    role: (apiUser.role as UserRole) || 'parent',
    isEmailVerified: true, // Assumimos que o backend já verificou o email
    createdAt: '',
    lastLoginAt: '',
    active: true,
    accessLevel: 'basic',
    profile: {
      title: '',
      organization: '',
      bio: '',
      phoneNumber: ''
    }
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { toast } = useToast();

  // Inicializar autenticação
  useEffect(() => {
    console.log('CustomAuthProvider: Inicializando autenticação');
    
    const initAuth = async () => {
      try {
        // Verificar se há token armazenado
        const token = getStoredAuthToken();
        console.log('=== DEBUG AUTH INIT ===');
        console.log('Token encontrado:', !!token);
        console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
        
        if (token) {
          console.log('Token encontrado, tentando restaurar sessão');
          
          // Tentar obter dados do usuário do armazenamento local
          const userData = getStoredUserData();
          console.log('UserData encontrado:', !!userData);
          console.log('UserData:', userData);
          
          if (userData) {
            setUser(convertApiUser(userData));
            setIsLoading(false);
            setIsInitialized(true);
            
            // Tentar renovar o token em segundo plano (sem forçar logout)
            try {
              console.log('Tentando renovar token em segundo plano...');
              const refreshResult = await refreshAuthToken();
              if (refreshResult.success && refreshResult.user) {
                console.log('Token renovado com sucesso');
                setUser(convertApiUser(refreshResult.user));
              } else {
                // Se a renovação falhar, manter usuário logado com token atual
                console.warn('Falha ao renovar token, mantendo sessão atual');
                // NÃO fazer logout - deixar o usuário continuar
              }
            } catch (error) {
              console.error('Erro ao renovar token:', error);
              // Não fazer logout - manter sessão ativa
              console.log('Mantendo sessão ativa apesar do erro de renovação');
            }
          } else {
            // Se não houver dados do usuário, limpar autenticação
            console.warn('Token encontrado, mas sem dados do usuário');
            clearAuthStorage();
            setUser(null);
            setIsLoading(false);
            setIsInitialized(true);
          }
        } else {
          // Sem token, usuário não está autenticado
          console.log('Nenhum token encontrado, usuário não autenticado');
          setUser(null);
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setUser(null);
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    initAuth();
    
    // Configurar temporizador para renovação de token
    const tokenRefreshInterval = setInterval(async () => {
      const token = getStoredAuthToken();
      if (token) {
        try {
          console.log('Renovando token automaticamente');
          await refreshAuthToken();
        } catch (error) {
          console.error('Erro ao renovar token automaticamente:', error);
        }
      }
    }, 15 * 60 * 1000); // 15 minutos
    
    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    const userRole = user.role || 'parent';
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    
    return userPermissions.includes(permission);
  };
  
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    
    const userRole = user.role || 'parent';
    
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    
    return userRole === role;
  };
  
  const getRoleName = (role: UserRole): string => {
    const roleNames: Record<string, string> = {
      parent: 'Pai/Mãe',
      professional: 'Profissional',
      admin: 'Administrador',
      owner: 'Proprietário',
      user: 'Usuário'
    };
    
    return roleNames[role] || 'Usuário';
  };

  // Método de login
  const handleLogin = async (email: string, password: string, rememberMe = false): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      console.log(`Tentando login com: ${email}`);
      console.log(`Senha contém @: ${password.includes('@') ? 'Sim' : 'Não'}`);
      
      // Verificar se o email tem erro de digitação comum
      const correctedEmail = email.includes('@edcuareapp.com') 
        ? email.replace('@edcuareapp.com', '@educareapp.com')
        : email;
      
      if (correctedEmail !== email) {
        console.log(`Email corrigido: ${email} -> ${correctedEmail}`);
        email = correctedEmail;
      }
      
      // Adicionar logs detalhados para debug
      console.log(`Tentando login com email: ${email} e senha: ${password ? '******' + password.slice(-2) : 'vazia'}`);
      
      const result = await signInWithEmail(email, password);
      console.log('Resultado do login:', result);
      
      if (result.success && result.user) {
        try {
          // Converter o usuário da API para o formato interno
          const convertedUser = convertApiUser(result.user);
          
          // Debug: verificar se dados foram armazenados
          console.log('=== DEBUG LOGIN SUCCESS ===');
          console.log('Token armazenado:', !!getStoredAuthToken());
          console.log('UserData armazenado:', !!getStoredUserData());
          console.log('Converted user:', convertedUser);
          
          // Verificar se o usuário foi convertido corretamente
          if (!convertedUser || !convertedUser.id) {
            console.error('Erro na conversão do usuário:', { result, convertedUser });
            throw new Error('Erro ao processar dados do usuário');
          }
          
          // Atualizar o estado do usuário e retornar
          setUser(convertedUser);
          return convertedUser;
        } catch (conversionError) {
          console.error('Erro ao processar dados do usuário:', conversionError);
          throw new Error('Erro ao processar dados do usuário');
        }
      } else {
        // Verificar se é um problema com senha temporária APENAS pela mensagem de erro do backend
        const isTempPasswordError = result.error && result.error.toLowerCase().includes('temporária');
        
        if (isTempPasswordError) {
          console.log('Detectado erro de senha temporária');
          let errorMsg = 'Senha temporária inválida ou expirada. Por favor, solicite uma nova senha.';
          
          // Verificar se o usuário tem telefone cadastrado
          if (email.includes('@')) {
            errorMsg += '\n\nVocê também pode tentar fazer login usando seu telefone.';
          }
          
          throw new Error(errorMsg);
        } else {
          // Erro genérico de credenciais inválidas
          console.error('Falha no login:', result.error || 'Credenciais inválidas');
          throw new Error(result.error || 'Email ou senha incorretos. Por favor, verifique suas credenciais.');
        }
      }
    } catch (error) {
      console.error('Erro no login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Verificar se a mensagem tem múltiplas linhas
      const errorLines = errorMessage.split('\n\n');
      
      // Mensagens mais específicas para diferentes tipos de erro
      let title = 'Erro de autenticação';
      let description = errorLines[0];
      
      if (errorMessage.includes('Credenciais inválidas')) {
        description = 'Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.';
      } else if (errorMessage.toLowerCase().includes('senha temporária')) {
        title = 'Senha temporária inválida';
        description = 'A senha temporária pode estar incorreta ou expirada. Por favor, solicite uma nova senha.';
        
        // Adicionar botão para ir para a tela de login por telefone
        toast({
          title: title,
          description: description,
          variant: 'destructive',
          action: (
            <ToastAction altText="Usar telefone">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const phoneTab = document.querySelector('[value="phone"]') as HTMLElement;
                  if (phoneTab) {
                    phoneTab.click();
                  }
                }}
              >
                Usar telefone
              </Button>
            </ToastAction>
          )
        });
        return null;
      }
      
      // Para outros tipos de erro
      if (!errorMessage.toLowerCase().includes('senha temporária')) {
        toast({
          title: title,
          description: description,
          variant: 'destructive'
        });
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Método de registro
  const handleRegister = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = 'parent',
    agreeTerms = true,
    phone?: string,
    plan_id?: string
  ): Promise<User | null> => {
    // CORREÇÃO: Garantir que os parâmetros sejam mapeados corretamente
    let finalRole = role;
    let finalPhone = phone;
    const finalPlanId = typeof plan_id === 'string' ? plan_id : '';
    
    // Se role contém números (telefone), corrigir os parâmetros
    if (typeof role === 'string' && /^\d+$/.test(role)) {
      console.log('DETECTADO: role contém telefone, corrigindo parâmetros...');
      finalPhone = role;
      finalRole = 'parent'; // Assumir parent como padrão
    }
    
    console.log('=== DEBUG HANDLEREGISTER - Parâmetros corrigidos ===');
    console.log('name:', name);
    console.log('email:', email);
    console.log('password:', '***');
    console.log('finalRole:', finalRole);
    console.log('finalPhone:', finalPhone);
    console.log('finalPlanId:', finalPlanId);
    console.log('=== FIM DEBUG HANDLEREGISTER ===');
    
    if (!agreeTerms) {
      toast({
        title: 'Termos de uso',
        description: 'Você precisa concordar com os termos de uso para se registrar',
        variant: 'destructive'
      });
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const result = await signUpWithEmail(email, password, name, finalRole, finalPhone, finalPlanId);
      
      if (result.success && result.user) {
        const convertedUser = convertApiUser(result.user);
        setUser(convertedUser);
        return convertedUser;
      } else {
        throw new Error(result.error || 'Falha ao registrar');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro no registro',
        description: errorMessage || 'Falha ao criar conta. Tente novamente.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Método de logout
  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Método para enviar código de verificação para telefone/WhatsApp
  const handleSendPhoneVerification = async (phone: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await sendPhoneVerification(phone);
      
      if (result.success) {
        toast({
          title: 'Código enviado',
          description: 'Um código de verificação foi enviado para o seu telefone.',
          variant: 'default'
        });
        return true;
      } else {
        throw new Error(result.error || 'Falha ao enviar código de verificação');
      }
    } catch (error) {
      console.error('Erro ao enviar código de verificação:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro',
        description: errorMessage || 'Falha ao enviar código de verificação. Tente novamente.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Método para login por telefone com senha temporária
  const handleLoginByPhone = async (phone: string): Promise<PhoneLoginResult> => {
    try {
      setIsLoading(true);
      
      console.log(`Iniciando solicitação de senha temporária para: ${phone}`);
      const result = await loginByPhone(phone);
      console.log('Resultado da solicitação de senha temporária:', result);
      
      if (result.success) {
        // Mostramos apenas uma mensagem básica, o componente pode mostrar uma mensagem mais detalhada
        // baseada nos dados retornados (canUseWithEmail, email, etc.)
        toast({
          title: 'Senha temporária enviada',
          description: result.message || 'Uma senha temporária foi enviada para o seu telefone.',
          variant: 'default'
        });
        return result;
      } else {
        // Verificar se é um erro de usuário não encontrado
        const isUserNotFound = result.error && result.error.includes('não encontrado');
        
        toast({
          title: isUserNotFound ? 'Telefone não cadastrado' : 'Erro',
          description: result.error || 'Falha ao enviar senha temporária',
          variant: 'destructive'
        });
        
        return result;
      }
    } catch (error) {
      console.error('Erro ao solicitar login por telefone:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: 'Erro',
        description: errorMessage || 'Falha ao enviar senha temporária. Tente novamente.',
        variant: 'destructive'
      });
      
      // Retornar um objeto de erro formatado corretamente
      return {
        success: false,
        error: errorMessage || 'Erro desconhecido ao solicitar login por telefone'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Método para verificar código enviado para telefone/WhatsApp
  const handleVerifyPhoneCode = async (phone: string, code: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      const result = await verifyPhoneCode(phone, code);
      
      if (result.success && result.user) {
        const convertedUser = convertApiUser(result.user);
        setUser(convertedUser);
        toast({
          title: 'Verificação concluída',
          description: 'Telefone verificado com sucesso.',
          variant: 'default'
        });
        return convertedUser;
      } else {
        throw new Error(result.error || 'Falha ao verificar código');
      }
    } catch (error) {
      console.error('Erro na verificação do código:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro de verificação',
        description: errorMessage || 'Código inválido ou expirado. Tente novamente.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Método para atualizar perfil
  const updateProfile = async (profileData: Record<string, unknown>): Promise<boolean> => {
    // Implementar quando tivermos o endpoint de atualização de perfil
    return false;
  };

  // Método para atualizar senha
  const handleUpdatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await updatePasswordApi(currentPassword, newPassword);
      
      if (result.success) {
        toast({
          title: 'Senha atualizada',
          description: 'Sua senha foi alterada com sucesso.',
          variant: 'default'
        });
        return true;
      } else {
        throw new Error(result.error || 'Falha ao atualizar senha');
      }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro ao atualizar senha',
        description: errorMessage || 'Verifique se a senha atual está correta.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Método para recarregar dados do usuário
  const handleRefreshUser = async (): Promise<void> => {
    try {
      const token = getStoredAuthToken();
      if (!token) return;

      // Buscar perfil atualizado diretamente da API
      const response = await fetch('/api/profiles/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const profile = data.data;
          // Atualizar o nome do usuário localmente
          if (user) {
            const updatedUser: User = {
              ...user,
              name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user.name,
              displayName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user.displayName
            };
            setUser(updatedUser);
            // Também atualizar no storage local
            const storedData = getStoredUserData();
            if (storedData) {
              storedData.name = updatedUser.name;
              setStoredUserData(storedData);
            }
            console.log('Usuário atualizado com sucesso:', updatedUser.name);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  // Valores do contexto
  const contextValue: AuthContextType = {
    user,
    session: null, // Não usamos mais o conceito de sessão do Supabase
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    signIn: async (email: string, password: string, rememberMe = false): Promise<{error?: {message: string}} | null> => {
      try {
        const user = await handleLogin(email, password, rememberMe);
        if (user) {
          return { error: null };
        } else {
          return { error: { message: 'Falha ao fazer login' } };
        }
      } catch (error) {
        return { error: { message: error instanceof Error ? error.message : 'Erro desconhecido' } };
      }
    },
    // Adaptador para compatibilidade com a interface AuthContextType
    signUp: (email: string, password: string, metadata?: Record<string, unknown>): Promise<User | null> => {
      const name = metadata?.name as string || email.split('@')[0];
      const role = metadata?.role as UserRole || 'parent';
      const agreeTerms = metadata?.agreeTerms as boolean || true;
      const phone = metadata?.phone as string | undefined;
      const plan_id = metadata?.plan_id as string | undefined;
      
      return handleRegister(name, email, password, role, agreeTerms, phone, plan_id);
    },
    signOut: handleLogout,
    hasRole,
    hasPermission,
    getRoleName,
    currentUser: user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    handleLogin,
    handleRegister,
    handleLogout,
    showUserDropdown,
    setShowUserDropdown,
    updateProfile,
    handleSendPhoneVerification,
    handleVerifyPhoneCode,
    handleLoginByPhone,
    updatePassword: handleUpdatePassword,
    refreshUser: handleRefreshUser,
    error: null
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
