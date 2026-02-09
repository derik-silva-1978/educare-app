import React, { useState } from 'react';
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
import { Loader2, ArrowLeft, Mail, MessageCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forgotPassword, forgotPasswordByPhone } from '@/services/api/authService';

const emailSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
});

const phoneSchema = z.object({
  phone: z.string()
    .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' })
    .regex(/^[\d\s()+-]+$/, { message: 'Formato de telefone inválido' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;

type RecoveryMethod = null | 'whatsapp' | 'email';

const ForgotPasswordForm: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [method, setMethod] = useState<RecoveryMethod>(null);
  const [submittedMethod, setSubmittedMethod] = useState<RecoveryMethod>(null);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const onSubmitEmail = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
      setSubmittedMethod('email');
      toast({
        title: 'Email enviado',
        description: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
      });
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPhone = async (data: PhoneFormValues) => {
    setIsLoading(true);
    try {
      await forgotPasswordByPhone(data.phone);
      setIsSubmitted(true);
      setSubmittedMethod('whatsapp');
      toast({
        title: 'Mensagem enviada',
        description: 'Se o telefone estiver cadastrado, você receberá instruções via WhatsApp.',
      });
    } catch (error) {
      console.error('Erro ao solicitar recuperação via WhatsApp:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedMethod(null);
    setMethod(null);
    emailForm.reset();
    phoneForm.reset();
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-7 w-7 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Instruções Enviadas</h1>
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          {submittedMethod === 'whatsapp' ? (
            <p className="text-sm text-center">
              Se o telefone informado estiver cadastrado, você receberá um link via <strong>WhatsApp</strong> para redefinir sua senha.
            </p>
          ) : (
            <p className="text-sm text-center">
              Se o email informado estiver cadastrado, você receberá um link por <strong>email</strong> para redefinir sua senha.
              Verifique também sua pasta de spam.
            </p>
          )}
        </div>

        <Button
          type="button"
          className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium"
          onClick={handleReset}
        >
          Tentar novamente
        </Button>

        <div className="text-center">
          <Link
            to="/educare-app/auth"
            className="inline-flex items-center text-sm font-medium text-[#7c3aed] hover:text-[#6d28d9] hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  if (method === null) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Recuperação de Senha</h1>
          <p className="text-sm text-muted-foreground">
            Escolha como deseja receber as instruções para redefinir sua senha
          </p>
        </div>

        <div className="grid gap-3">
          <button
            onClick={() => setMethod('whatsapp')}
            className="group flex items-center gap-4 rounded-xl border-2 border-transparent bg-gradient-to-r from-green-50 to-green-100/50 p-4 text-left transition-all hover:border-green-400 hover:shadow-md hover:shadow-green-100 active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-200 group-hover:shadow-green-300 transition-shadow">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="flex-1">
              <span className="block text-base font-semibold text-gray-900">WhatsApp</span>
              <span className="block text-sm text-gray-500">Receba o link de recuperação direto no seu WhatsApp</span>
            </div>
            <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setMethod('email')}
            className="group flex items-center gap-4 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 text-left transition-all hover:border-blue-400 hover:shadow-md hover:shadow-blue-100 active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <span className="block text-base font-semibold text-gray-900">Email</span>
              <span className="block text-sm text-gray-500">Receba as instruções na sua caixa de entrada</span>
            </div>
            <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="text-center">
          <Link
            to="/educare-app/auth"
            className="inline-flex items-center text-sm font-medium text-[#7c3aed] hover:text-[#6d28d9] hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  if (method === 'whatsapp') {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-green-600 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Recuperar via WhatsApp</h1>
          <p className="text-sm text-muted-foreground">
            Digite seu telefone cadastrado para receber o link de recuperação
          </p>
        </div>

        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone com DDD</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      type="tel"
                      autoComplete="tel"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar via WhatsApp
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => { setMethod(null); phoneForm.reset(); }}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Outras opções
          </button>
          <Link
            to="/educare-app/auth"
            className="inline-flex items-center text-sm font-medium text-[#7c3aed] hover:text-[#6d28d9] hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-7 w-7 text-blue-600" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Recuperar via Email</h1>
        <p className="text-sm text-muted-foreground">
          Digite seu email cadastrado para receber as instruções
        </p>
      </div>

      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="seu@email.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar por Email
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => { setMethod(null); emailForm.reset(); }}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Outras opções
        </button>
        <Link
          to="/educare-app/auth"
          className="inline-flex items-center text-sm font-medium text-[#7c3aed] hover:text-[#6d28d9] hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
