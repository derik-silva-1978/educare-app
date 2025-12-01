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
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/services/api/authService';

// Schema de validação
const formSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPasswordForm: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      console.log('Solicitando recuperação de senha para:', data.email);
      const result = await forgotPassword(data.email);
      
      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: 'Email enviado',
          description: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
          variant: 'default',
        });
      } else {
        // Mesmo em caso de erro, mostramos a mensagem genérica
        // para não revelar se o email existe ou não
        setIsSubmitted(true);
        toast({
          title: 'Email enviado',
          description: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
          variant: 'default',
        });
      }
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

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Recuperação de Senha</h1>
        <p className="text-sm text-muted-foreground">
          Digite seu email para receber instruções de recuperação de senha
        </p>
      </div>

      {!isSubmitted ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar instruções'
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="text-sm">
              Se o email informado estiver cadastrado em nossa base, você receberá um link para redefinir sua senha.
              Por favor, verifique sua caixa de entrada e pasta de spam.
            </p>
          </div>
          
          <Button 
            type="button" 
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              form.reset();
            }}
          >
            Tentar com outro email
          </Button>
        </div>
      )}

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

export default ForgotPasswordForm;
