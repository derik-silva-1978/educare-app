import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle, Phone, CreditCard, AlertCircle, Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { subscriptionPlansService, type SubscriptionPlan } from '@/services/subscriptionPlansService';

type EducareUserRole = 'parent' | 'professional';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Por favor, insira seu nome completo.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  phone: z.string().min(10, { message: 'Por favor, insira um telefone válido.' }).refine((val) => {
    const digits = val.replace(/\D/g, '').replace(/^55/, '');
    return digits.length >= 10 && digits.length <= 11;
  }, { message: 'Informe um telefone válido com DDD. Ex: (11) 99999-9999' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  role: z.enum(['parent', 'professional']),
  selectedPlan: z.string().min(1, { message: 'Por favor, selecione um plano de assinatura.' }),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'Você precisa concordar com os termos e política de privacidade.'
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface EducareRegisterFormProps {
  redirectPath?: string | null;
}

const EducareRegisterForm: React.FC<EducareRegisterFormProps> = ({ redirectPath }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, handleRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [plansLoaded, setPlansLoaded] = useState(false);
  
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'parent' as EducareUserRole,
      selectedPlan: '',
      agreeTerms: false,
    },
  });

  const loadPlans = useCallback(async () => {
    if (plansLoaded || loadingPlans) return;
    
    try {
      console.log('Carregando planos - única execução');
      setLoadingPlans(true);
      
      const plans = await subscriptionPlansService.getPublicPlans();
      setAvailablePlans(plans);
      setPlansLoaded(true);
      
      if (plans.length > 0 && !form.getValues('selectedPlan')) {
        form.setValue('selectedPlan', plans[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar planos",
        description: "Não foi possível carregar os planos disponíveis.",
      });
    } finally {
      setLoadingPlans(false);
    }
  }, [plansLoaded, loadingPlans, form, toast]);

  React.useEffect(() => {
    loadPlans();
  }, [loadPlans]);
  
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'email' && emailError) {
        setEmailError(null);
      }
      if (name === 'phone' && phoneError) {
        setPhoneError(null);
      }
      
      if (name === 'password' || name === 'confirmPassword') {
        const password = form.getValues('password');
        const confirmPassword = form.getValues('confirmPassword');
        
        if (password && confirmPassword) {
          setPasswordsMatch(password === confirmPassword);
        } else {
          setPasswordsMatch(true);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, emailError, phoneError]);

  const onSubmit = async (data: FormValues) => {
    setEmailError(null);
    setPhoneError(null);
    
    if (!passwordsMatch) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "As senhas não coincidem. Por favor, verifique e tente novamente.",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Attempting registration with:', { 
        email: data.email, 
        name: data.name, 
        phone: data.phone,
        role: data.role,
        selectedPlan: data.selectedPlan
      });
      
      const authResult = await handleRegister(
        data.name,
        data.email, 
        data.password,
        data.role,
        data.agreeTerms,
        data.phone,
        data.selectedPlan
      );
      
      if (authResult) {
        console.log('Registration successful:', authResult);
        setRegistrationSuccess(true);
        toast({
          title: "Cadastro realizado!",
          description: "Seu acesso está sendo analisado. Você receberá uma notificação no WhatsApp quando for aprovado.",
        });
        
        setTimeout(() => {
          navigate('/educare-app/auth?action=login');
        }, 2000);
      }
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente.";
      
      if (errorMessage.toLowerCase().includes('e-mail já está em uso') || 
          errorMessage.toLowerCase().includes('email já está em uso') ||
          errorMessage.toLowerCase().includes('email already in use')) {
        setEmailError('Este e-mail já está cadastrado');
      } else if (errorMessage.toLowerCase().includes('telefone já está em uso') ||
                errorMessage.toLowerCase().includes('phone already in use')) {
        setPhoneError('Este telefone já está cadastrado');
      } else {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Cadastro realizado com sucesso!</p>
              <p className="text-sm text-muted-foreground">
                Seu acesso está aguardando aprovação. Você receberá uma notificação no WhatsApp quando for aprovado.
              </p>
            </div>
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={() => navigate('/educare-app/auth?action=login')} 
          className="w-full"
        >
          Voltar ao Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!passwordsMatch && form.getValues('password') && form.getValues('confirmPassword') && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                As senhas não coincidem. Por favor, verifique e tente novamente.
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Seu nome completo" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      {...field} 
                      disabled={isLoading}
                      className={emailError ? "border-red-500 pr-10" : ""}
                    />
                    {emailError && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                </FormControl>
                {emailError ? (
                  <p className="text-sm font-medium text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {emailError}
                  </p>
                ) : (
                  <FormMessage />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Phone className="inline w-4 h-4 mr-1" />
                  Telefone/WhatsApp *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="tel" 
                      placeholder="(11) 99999-9999" 
                      {...field} 
                      onChange={(e) => {
                        let digits = e.target.value.replace(/\D/g, '');
                        if (digits.startsWith('55')) digits = digits.slice(2);
                        if (digits.length > 11) digits = digits.slice(0, 11);
                        let masked = digits;
                        if (digits.length > 2 && digits.length <= 6) {
                          masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                        } else if (digits.length > 6 && digits.length <= 10) {
                          masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
                        } else if (digits.length === 11) {
                          masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                        } else if (digits.length === 2) {
                          masked = `(${digits}) `;
                        }
                        field.onChange(masked);
                      }}
                      disabled={isLoading}
                      className={phoneError ? "border-red-500 pr-10" : ""}
                    />
                    {phoneError && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                </FormControl>
                {phoneError ? (
                  <p className="text-sm font-medium text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {phoneError}
                  </p>
                ) : (
                  <FormMessage />
                )}
                <p className="text-xs text-gray-500">
                  Formato WhatsApp com DDD. Ex: (11) 99999-9999
                </p>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        {...field} 
                        disabled={isLoading}
                        className={`pr-10 ${!passwordsMatch && form.getValues('confirmPassword') ? "border-red-500" : ""}`}
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
                  {!passwordsMatch && form.getValues('confirmPassword') ? (
                    <p className="text-sm font-medium text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      As senhas não coincidem
                    </p>
                  ) : (
                    <FormMessage />
                  )}
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
                        placeholder="••••••••" 
                        {...field} 
                        disabled={isLoading}
                        className={`pr-10 ${!passwordsMatch ? "border-red-500" : ""}`}
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
                  {!passwordsMatch ? (
                    <p className="text-sm font-medium text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      As senhas não coincidem
                    </p>
                  ) : (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Você é</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu perfil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="parent">Pai/Mãe/Responsável</SelectItem>
                    <SelectItem value="professional">Profissional</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="selectedPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <CreditCard className="inline w-4 h-4 mr-1" />
                  Plano de Assinatura *
                </FormLabel>
                {loadingPlans ? (
                  <div className="flex items-center justify-center p-4 border rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Carregando planos...
                  </div>
                ) : (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availablePlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{plan.name}</span>
                            <span className="text-sm text-gray-500">
                              R$ {Number(plan.price).toFixed(2)}/{plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}
                              {plan.trial_days > 0 && ` • ${plan.trial_days} dias grátis`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
                {field.value && availablePlans.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    {(() => {
                      const plan = availablePlans.find(p => p.id === field.value);
                      return plan ? (
                        <div>
                          <p className="text-sm font-medium text-blue-900">{plan.name}</p>
                          <p className="text-xs text-blue-700 mt-1">{plan.description}</p>
                          {plan.trial_days > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              ✨ Teste grátis por {plan.trial_days} dias
                            </p>
                          )}
                        </div>
                      ) : null;
                    })()
                    }
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Concordo com os{' '}
                    <a href="#" className="text-primary hover:underline">
                      Termos de Serviço
                    </a>{' '}
                    e{' '}
                    <a href="#" className="text-primary hover:underline">
                      Política de Privacidade
                    </a>
                  </FormLabel>
                  <FormMessage />
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
                Cadastrando...
              </>
            ) : (
              'Cadastrar'
            )}
          </Button>
        </form>
      </Form>

      {registrationSuccess && (
        <Alert className="bg-green-50 border-green-200 mt-4">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EducareRegisterForm;
