
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const PasswordResetConfirmPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get hash parameters from URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type !== 'recovery') {
      setError('Link de redefinição inválido. Por favor, solicite um novo link.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas informadas não são iguais. Por favor, verifique.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "Sua senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      setError(error.message || "Não foi possível redefinir sua senha. Tente novamente.");
      toast({
        title: "Erro",
        description: error.message || "Não foi possível redefinir sua senha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Definir Nova Senha | Smart PEI</title>
        <meta 
          name="description" 
          content="Defina uma nova senha para sua conta no Smart PEI" 
        />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart PEI</h1>
            <p className="text-gray-600">Plataforma Inteligente para Planos de Ensino Individualizados</p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto" 
                  asChild
                >
                  <Link to="/auth" className="flex items-center gap-1 text-muted-foreground">
                    <ArrowLeft size={16} />
                    <span>Voltar</span>
                  </Link>
                </Button>
              </div>
              <CardTitle>Definir Nova Senha</CardTitle>
              <CardDescription>
                {!isSuccess ? 'Crie uma nova senha para sua conta.' : 'Sua senha foi atualizada com sucesso.'}
              </CardDescription>
            </CardHeader>
            
            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                <CardContent>
                  {error && (
                    <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Nova Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading || isSuccess}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading || isSuccess}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || isSuccess}
                  >
                    {isLoading ? "Processando..." : "Definir Nova Senha"}
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <CardContent>
                <div className="flex flex-col items-center py-4 text-center">
                  <CheckCircle className="h-16 w-16 text-primary mb-4" />
                  <p className="text-lg font-medium mb-2">Senha atualizada com sucesso!</p>
                  <p className="text-muted-foreground mb-4">
                    Você será redirecionado para a página de login em instantes.
                  </p>
                  <Button asChild>
                    <Link to="/auth/login">Ir para Login</Link>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Ao utilizar o Smart PEI, você concorda com nossos{' '}
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                Política de Privacidade
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default PasswordResetConfirmPage;
