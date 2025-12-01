import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
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
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { PhoneLoginResult } from '@/services/api/authService';

// Esquema de validação para o formulário de telefone
const phoneFormSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' })
    .max(15, { message: 'Telefone deve ter no máximo 15 dígitos' })
    .regex(/^\+?[0-9]+$/, { message: 'Formato de telefone inválido' }),
});

// Esquema de validação para o formulário de código
const codeFormSchema = z.object({
  code: z
    .string()
    .length(6, { message: 'O código deve ter 6 dígitos' })
    .regex(/^[0-9]+$/, { message: 'O código deve conter apenas números' }),
});

type PhoneFormValues = z.infer<typeof phoneFormSchema>;
type CodeFormValues = z.infer<typeof codeFormSchema>;

interface PhoneVerificationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PhoneVerification({ onSuccess, onCancel }: PhoneVerificationProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [canUseWithEmail, setCanUseWithEmail] = useState(false);
  const [associatedEmail, setAssociatedEmail] = useState<string | null>(null);
  const { handleLoginByPhone, signIn } = useCustomAuth();
  const { toast } = useToast();

  // Formulário para o número de telefone
  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: '',
    },
  });

  // Formulário para o código de verificação
  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      code: '',
    },
  });

  // Função para enviar o número de telefone e solicitar senha temporária
  const onPhoneSubmit = async (data: PhoneFormValues) => {
    try {
      const formattedPhone = data.phone.startsWith('+') ? data.phone : `+${data.phone}`;
      
      // Usar o novo método de login por telefone
      const result = await handleLoginByPhone(formattedPhone);
      
      if (result.success) {
        setPhoneNumber(formattedPhone);
        
        // Verificar se há email associado
        if (result.canUseWithEmail && result.email) {
          setCanUseWithEmail(true);
          setAssociatedEmail(result.email);
        } else {
          setCanUseWithEmail(false);
          setAssociatedEmail(null);
        }
        
        setStep('code');
        
        // Personalizar a mensagem com base na disponibilidade de email
        const description = result.canUseWithEmail && result.email
          ? `Uma senha temporária foi enviada para o seu telefone. Você pode usar esta senha para entrar com seu email (${result.email}) ou telefone.`
          : 'Uma senha temporária foi enviada para o seu telefone.';
        
        toast({
          title: 'Senha temporária enviada',
          description: description,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar senha temporária:', error);
      
      // Verificar se é o erro específico de usuário não encontrado
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const isUserNotFoundError = errorMessage.includes('Usuário não encontrado com este número');
      
      toast({
        title: isUserNotFoundError ? 'Telefone não cadastrado' : 'Erro',
        description: isUserNotFoundError 
          ? 'Este número de telefone não está cadastrado no sistema. Por favor, verifique o número ou crie uma nova conta.' 
          : 'Não foi possível enviar a senha temporária. Verifique se o telefone está cadastrado e tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Função para fazer login com a senha temporária
  const onCodeSubmit = async (data: CodeFormValues) => {
    try {
      // Usar o método de login normal, mas com telefone e senha temporária
      const result = await signIn(phoneNumber, data.code);
      
      if (result) {
        toast({
          title: 'Sucesso',
          description: 'Login realizado com sucesso!',
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('Senha temporária inválida');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: 'Erro',
        description: 'Senha temporária inválida ou expirada. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Função para voltar para a etapa de telefone
  const handleBack = () => {
    setStep('phone');
  };

  // Função para reenviar a senha temporária
  const handleResendCode = async () => {
    try {
      const result = await handleLoginByPhone(phoneNumber);
      
      if (result.success) {
        // Atualizar informações de email associado se disponível
        if (result.canUseWithEmail && result.email) {
          setCanUseWithEmail(true);
          setAssociatedEmail(result.email);
        }
        
        // Personalizar a mensagem com base na disponibilidade de email
        const description = result.canUseWithEmail && result.email
          ? `Uma nova senha temporária foi enviada para o seu telefone. Você pode usar esta senha para entrar com seu email (${result.email}) ou telefone.`
          : 'Uma nova senha temporária foi enviada para o seu telefone.';
        
        toast({
          title: 'Senha reenviada',
          description: description,
        });
      }
    } catch (error) {
      console.error('Erro ao reenviar senha temporária:', error);
      
      // Verificar se é o erro específico de usuário não encontrado
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const isUserNotFoundError = errorMessage.includes('Usuário não encontrado com este número');
      
      toast({
        title: isUserNotFoundError ? 'Telefone não cadastrado' : 'Erro',
        description: isUserNotFoundError 
          ? 'Este número de telefone não está cadastrado no sistema. Por favor, verifique o número ou crie uma nova conta.' 
          : 'Não foi possível reenviar a senha temporária. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {step === 'phone' ? 'Recuperação de Acesso' : 'Digite a Senha'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === 'phone'
            ? 'Digite seu número de telefone cadastrado para receber uma senha temporária'
            : `Uma senha temporária foi enviada para ${phoneNumber}`}
        </p>
        {step === 'phone' && (
          <p className="text-xs text-muted-foreground mt-2">
            O número deve estar no formato internacional (ex: +5511999999999).
            <br />Apenas números já cadastrados no sistema podem recuperar senha.
          </p>
        )}
        {step === 'code' && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              A senha temporária contém letras maiúsculas, minúsculas e o caractere @.
              <br />Ela é válida por 30 minutos.
            </p>
            
            {canUseWithEmail && associatedEmail && (
              <p className="text-xs font-medium text-blue-600 mt-1">
                Você pode usar esta senha para entrar com seu email ({associatedEmail}) ou telefone.
              </p>
            )}
          </div>
        )}
      </div>

      {step === 'phone' ? (
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+55 (DDD) 99999-9999"
                      {...field}
                      inputMode="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit">Enviar Senha</Button>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...codeForm}>
          <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha Temporária</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: ABC@12"
                      {...field}
                      autoComplete="one-time-code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button type="submit">Entrar</Button>
            </div>
            
            <div className="flex flex-col space-y-2">
              {canUseWithEmail && associatedEmail && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => {
                    // Preencher automaticamente o formulário de login com o email
                    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
                    if (emailInput) {
                      emailInput.value = associatedEmail;
                      // Focar no campo de senha
                      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
                      if (passwordInput) {
                        passwordInput.focus();
                      }
                    }
                    // Fechar o modal de verificação
                    if (onCancel) onCancel();
                  }}
                >
                  Usar email ({associatedEmail}) em vez do telefone
                </Button>
              )}
              
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-xs"
                  onClick={handleResendCode}
                >
                  Reenviar senha
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
