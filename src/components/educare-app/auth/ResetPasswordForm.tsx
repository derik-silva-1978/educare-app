import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '@/services/api/authService';

// Função para verificar força da senha
const checkPasswordStrength = (password: string): { isStrong: boolean; message: string } => {
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = [
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length;
  
  if (strength < 3) {
    return {
      isStrong: false,
      message: 'Senha fraca. Inclua letras maiúsculas, minúsculas, números e caracteres especiais.'
    };
  }
  
  return { isStrong: true, message: '' };
};

// Schema de validação
const formSchema = z.object({
  password: z.string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    .refine(
      (password) => checkPasswordStrength(password).isStrong,
      { message: 'Senha fraca. Inclua letras maiúsculas, minúsculas, números e caracteres especiais.' }
    ),
  confirmPassword: z.string()
    .min(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const ResetPasswordForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
    color: string;
  }>({ score: 0, message: '', color: 'bg-gray-200' });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Monitorar mudanças no campo de senha para atualizar o indicador de força
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'password') {
        const password = value.password as string;
        if (!password || password.length === 0) {
          setPasswordStrength({ score: 0, message: '', color: 'bg-gray-200' });
          return;
        }
        
        const hasMinLength = password.length >= 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const strength = [
          hasMinLength,
          hasUpperCase,
          hasLowerCase,
          hasNumbers,
          hasSpecialChar
        ].filter(Boolean).length;
        
        let strengthInfo = { score: 0, message: '', color: 'bg-gray-200' };
        
        if (strength === 1) {
          strengthInfo = { score: 1, message: 'Muito fraca', color: 'bg-red-500' };
        } else if (strength === 2) {
          strengthInfo = { score: 2, message: 'Fraca', color: 'bg-orange-500' };
        } else if (strength === 3) {
          strengthInfo = { score: 3, message: 'Média', color: 'bg-yellow-500' };
        } else if (strength === 4) {
          strengthInfo = { score: 4, message: 'Forte', color: 'bg-green-500' };
        } else if (strength === 5) {
          strengthInfo = { score: 5, message: 'Muito forte', color: 'bg-emerald-500' };
        }
        
        setPasswordStrength(strengthInfo);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Verificar token na URL
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setTokenError('Token não fornecido. Por favor, use o link enviado para o seu email.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      setTokenError('Token não fornecido. Por favor, use o link enviado para o seu email.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Redefinindo senha com token');
      const result = await resetPassword(token, data.password);
      
      if (result.success) {
        setIsSuccess(true);
        toast({
          title: 'Senha redefinida',
          description: 'Sua senha foi redefinida com sucesso. Você já pode fazer login com sua nova senha.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Erro',
          description: result.error || 'Não foi possível redefinir sua senha. O token pode ser inválido ou ter expirado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Erro de Token</h1>
        </div>

        <div className="rounded-lg border border-destructive p-4 bg-destructive/10">
          <p className="text-sm text-destructive">{tokenError}</p>
        </div>

        <div className="text-center">
          <Link 
            to="/educare-app/auth/forgot-password" 
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            Solicitar nova recuperação de senha
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Senha Redefinida</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <p className="text-center">
            Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
          </p>
        </div>

        <Button 
          type="button" 
          className="w-full"
          onClick={() => navigate('/educare-app/auth/login')}
        >
          Ir para o login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Redefinir Senha</h1>
        <p className="text-sm text-muted-foreground">
          Digite sua nova senha
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          {...field} 
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Ocultar senha" : "Mostrar senha"}
                          </span>
                        </Button>
                      </div>
                      
                      {/* Indicador de força da senha */}
                      {field.value && field.value.length > 0 && (
                        <div className="mt-2">
                          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              Força: {passwordStrength.message}
                            </p>
                            {passwordStrength.score < 3 && (
                              <p className="text-xs text-red-500">
                                Inclua letras maiúsculas, minúsculas, números e símbolos
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      {...field} 
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redefinindo...
              </>
            ) : (
              'Redefinir senha'
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Link 
          to="/educare-app/auth/login" 
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
