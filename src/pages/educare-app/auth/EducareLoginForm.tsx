
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EducareLoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { handleLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    try {
      if (!email || !password) {
        setHasError(true);
        setErrorMessage('Email e senha são obrigatórios');
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Email e senha são obrigatórios",
        });
        setIsLoading(false);
        return;
      }

      const user = await handleLogin(email, password, rememberMe);
      
      // Set app-specific login flag
      localStorage.setItem('educareAppLoggedIn', 'true');
      
      // Limpar erro em caso de sucesso
      setHasError(false);
      setErrorMessage('');
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a) de volta, ${user.name || 'usuário'}!`,
      });
      
      // Redirect to welcome hub
      navigate('/educare-app/welcome');
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Separar título e descrição se houver múltiplas linhas
      const errorLines = errorMsg.split('\n\n');
      const mainMessage = errorLines[0];
      const additionalInfo = errorLines[1];
      
      // Marcar como erro e definir mensagem
      setHasError(true);
      setErrorMessage(mainMessage || 'Email ou senha incorretos');
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: mainMessage || "Email ou senha incorretos. Tente novamente.",
      });
      
      // Se houver informação adicional (como sugestão de login por telefone), mostrar em outro toast
      if (additionalInfo) {
        setTimeout(() => {
          toast({
            title: "Dica",
            description: additionalInfo,
          });
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className={hasError ? 'text-red-600' : ''}>Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setHasError(false);
              setErrorMessage('');
            }}
            className={hasError ? 'border-red-500 focus:ring-red-500' : ''}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className={hasError ? 'text-red-600' : ''}>Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setHasError(false);
              setErrorMessage('');
            }}
            className={hasError ? 'border-red-500 focus:ring-red-500' : ''}
            required
          />
          {hasError && errorMessage && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember-me" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label 
              htmlFor="remember-me" 
              className="text-sm text-gray-700"
            >
              Lembrar-me
            </Label>
          </div>
          
          <Button variant="link" className="text-sm p-0 h-auto" onClick={() => navigate('/educare-app/auth/reset-password')}>
            Esqueceu a senha?
          </Button>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : 'Entrar'}
        </Button>
      </div>
    </form>
  );
};

export default EducareLoginForm;
