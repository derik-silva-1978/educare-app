
import { UserRole } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

/**
 * Validates register form inputs
 */
export const validateRegisterForm = (
  name: string, 
  email: string, 
  password: string, 
  role: UserRole, 
  agreeTerms: boolean
): boolean => {
  if (!name || !email || !password || !role) {
    toast({
      variant: "destructive",
      title: "Erro no cadastro",
      description: "Por favor, preencha todos os campos.",
    });
    return false;
  }

  if (!agreeTerms) {
    toast({
      variant: "destructive",
      title: "Erro no cadastro",
      description: "Você precisa concordar com os Termos de Uso e Política de Privacidade.",
    });
    return false;
  }

  return true;
};

/**
 * Validates login form inputs
 */
export const validateLoginForm = (
  email: string,
  password: string
): boolean => {
  if (!email || !password) {
    toast({
      variant: "destructive",
      title: "Erro no login",
      description: "Por favor, preencha todos os campos.",
    });
    return false;
  }

  return true;
};
