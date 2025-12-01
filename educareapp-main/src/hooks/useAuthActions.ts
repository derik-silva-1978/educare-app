
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

interface UseAuthActionsProps {
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentUser: (user: User | null) => void;
  setSession: (session: any) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setShowUserDropdown: (show: boolean) => void;
  mapSupabaseUser: (session: any) => User | null;
  currentUser: User | null;
}

export const useAuthActions = ({
  setIsLoading,
  setError,
  setCurrentUser,
  setSession,
  setIsAuthenticated,
  setShowUserDropdown,
  mapSupabaseUser,
  currentUser
}: UseAuthActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "Falha ao fazer login");
      toast({
        variant: "destructive",
        title: "Erro de Login",
        description: err.message || "Credenciais inválidas. Tente novamente.",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: displayName,
            role: 'teacher'
          }
        }
      });
      if (error) throw error;
      
      toast({
        title: "Registro concluído",
        description: "Verifique seu email para confirmar a conta.",
      });
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || "Falha ao registrar");
      toast({
        variant: "destructive",
        title: "Erro de Registro",
        description: err.message || "Não foi possível criar a conta.",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setCurrentUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setShowUserDropdown(false);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      localStorage.removeItem('smartPeiLoggedIn');
      localStorage.removeItem('educareAppLoggedIn');
      
      navigate('/');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || "Falha ao sair");
      toast({
        variant: "destructive",
        title: "Erro ao desconectar",
        description: err.message || "Não foi possível realizar o logout.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      if (!currentUser) {
        setError("Não está logado");
        return false;
      }
      
      const { error } = await supabase.auth.updateUser({
        data: profileData
      });
      
      if (error) throw error;
      
      // Fix the TypeScript error by properly updating the user state
      const updatedUser: User = { ...currentUser, ...profileData };
      setCurrentUser(updatedUser);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      
      return true;
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || "Falha ao atualizar perfil");
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: err.message || "Não foi possível atualizar o perfil.",
      });
      return false;
    }
  };

  return {
    login,
    register,
    logout,
    updateProfile
  };
};
