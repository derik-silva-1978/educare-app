import { useContext } from 'react';
import AuthContext from '@/providers/CustomAuthProvider';

/**
 * Hook para usar o contexto de autenticação customizado
 * que utiliza o backend próprio em vez do Supabase
 */
export const useCustomAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useCustomAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export default useCustomAuth;
