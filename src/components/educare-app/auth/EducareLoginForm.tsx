
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { ToastAction } from '@/components/ui/toast';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, Phone, Eye, EyeOff, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneVerification } from '@/components/auth/PhoneVerification';

// Função para validar telefone internacional
const isValidPhone = (value: string) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(value);
};

const formSchema = z.object({
  loginIdentifier: z.string().min(1, { message: 'Por favor, insira seu email ou telefone.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  rememberMe: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface EducareLoginFormProps {
  redirectPath?: string | null;
}

const EducareLoginForm: React.FC<EducareLoginFormProps> = ({ redirectPath }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPendingAlert, setShowPendingAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const approved = params.get('approved');
    if (!approved) return;

    switch (approved) {
      case 'success':
        toast({
          title: "Acesso aprovado!",
          description: "Faça login para acessar a plataforma.",
        });
        break;
      case 'already':
        toast({
          title: "Já aprovado",
          description: "Este acesso já foi aprovado anteriormente.",
        });
        break;
      case 'expired':
        toast({
          variant: "destructive",
          title: "Link expirado",
          description: "O link de aprovação expirou. Entre em contato com o suporte.",
        });
        break;
      case 'invalid':
        toast({
          variant: "destructive",
          title: "Link inválido",
          description: "Link de aprovação inválido.",
        });
        break;
    }

    window.history.replaceState({}, '', location.pathname);
  }, [location.search, toast, location.pathname]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loginIdentifier: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setShowPendingAlert(false);
    
    // Limpar erros anteriores
    form.clearErrors();
    
    try {
      console.log('Attempting login with:', data.loginIdentifier);
      await signIn(data.loginIdentifier, data.password);
      
      // Se chegou aqui, login foi bem-sucedido
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Educare.",
      });
      
      // Safe redirect path handling
      let finalRedirect = '/educare-app/welcome';
      
      if (redirectPath) {
        // Validate redirect path is safe
        if (redirectPath.startsWith('/educare-app/') && 
            !redirectPath.includes('/auth') &&
            redirectPath.length < 100 &&
            !redirectPath.includes('%')) {
          finalRedirect = redirectPath;
        }
      }
      
      console.log('Redirecting after login to:', finalRedirect);
      navigate(finalRedirect, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMsg = error?.message || 'Erro desconhecido';
      
      if (errorMsg.includes('aguardando aprovação') || errorMsg.includes('pendente')) {
        setShowPendingAlert(true);
        return;
      }

      let errorMessage = "Email ou senha incorretos. Por favor, tente novamente.";
      
      if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('Credenciais inválidas')) {
        errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
      } else if (errorMsg.includes('Too many requests')) {
        errorMessage = "Muitas tentativas de login. Tente novamente em alguns minutos.";
      } else if (errorMsg.includes('User not found') || errorMsg.includes('Usuário não encontrado')) {
        errorMessage = "Usuário não encontrado. Verifique seu email ou cadastre-se.";
      } else if (errorMsg.includes('senha temporária')) {
        errorMessage = "Senha temporária inválida ou expirada. Por favor, solicite uma nova senha.";
        
        // Verificar se o email tem erro de digitação
        if (data.loginIdentifier.includes('@edcuareapp.com')) {
          errorMessage += "\n\nVerifique se há um erro de digitação no email. Talvez você queira tentar com '@educareapp.com'.";
        }
        
        // Sugerir usar o telefone
        errorMessage += "\n\nVocê também pode tentar fazer login usando seu telefone.";
      } else if (errorMsg.includes('Email ou senha incorretos')) {
        errorMessage = errorMsg;
      }
      
      // Marcar campos com erro visual
      form.setError('loginIdentifier', { type: 'manual', message: ' ' });
      form.setError('password', { type: 'manual', message: errorMessage });
      
      // Verificar se a mensagem tem múltiplas linhas
      const errorLines = error.message ? error.message.split('\n\n') : [];
      
      if (errorLines.length > 1) {
        // Se tiver múltiplas linhas, usar a primeira como título e o resto como descrição
        const mainError = errorLines[0];
        const additionalInfo = errorLines.slice(1).join('\n');
        
        toast({
          variant: "destructive",
          title: mainError,
          description: additionalInfo,
          action: errorLines.some(line => line.includes('@edcuareapp.com')) ? (
            <ToastAction altText="Tentar com email corrigido">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  form.setValue('loginIdentifier', form.getValues('loginIdentifier').replace('@edcuareapp.com', '@educareapp.com'));
                }}
              >
                Corrigir email
              </Button>
            </ToastAction>
          ) : undefined
        });
      } else {
        // Se for uma única linha, usar o formato padrão
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: error.message || "Ocorreu um erro inesperado. Por favor, tente novamente.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showPendingAlert && (
        <Alert className="border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Seu cadastro está aguardando aprovação. Você receberá uma notificação no WhatsApp quando seu acesso for liberado.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Telefone
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="loginIdentifier"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className={fieldState.error ? 'text-red-600' : ''}>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        {...field} 
                        disabled={isLoading}
                        className={fieldState.error ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        onChange={(e) => {
                          field.onChange(e);
                          form.clearErrors('loginIdentifier');
                          form.clearErrors('password');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className={fieldState.error ? 'text-red-600' : ''}>Senha</FormLabel>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs" 
                        type="button"
                        onClick={() => navigate('/educare-app/auth/forgot-password')}
                      >
                        Esqueceu a senha?
                      </Button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          {...field} 
                          disabled={isLoading}
                          className={`pr-10 ${fieldState.error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          onChange={(e) => {
                            field.onChange(e);
                            form.clearErrors('loginIdentifier');
                            form.clearErrors('password');
                          }}
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
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Lembrar de mim
                      </FormLabel>
                    </div>
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
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="phone">
          <PhoneVerification 
            onSuccess={() => {
              toast({
                title: 'Login bem-sucedido',
                description: 'Você foi conectado com sucesso via telefone',
              });
              
              // Safe redirect path handling
              let finalRedirect = '/educare-app/welcome';
              
              if (redirectPath) {
                // Validate redirect path is safe
                if (redirectPath.startsWith('/educare-app/') && 
                    !redirectPath.includes('/auth') &&
                    redirectPath.length < 100 &&
                    !redirectPath.includes('%')) {
                  finalRedirect = redirectPath;
                }
              }
              
              navigate(finalRedirect, { replace: true });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducareLoginForm;
