
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock } from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminAuth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleLogin, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (isAuthenticated && user?.role !== 'admin') {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissões de administrador.",
      });
    }
  }, [isAuthenticated, user, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const authenticatedUser = await handleLogin(email, password);
      
      if (authenticatedUser.role !== 'admin') {
        setError('Você não tem permissões de administrador.');
        return;
      }
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao painel administrativo."
      });
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Admin Login | Educare+</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-block p-3 rounded-full bg-amber-100 mb-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold mb-1">Admin Portal</h1>
            <p className="text-gray-600">Acesso restrito para administradores</p>
          </div>
          
          <Card className="shadow-lg border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle>Login Administrativo</CardTitle>
              <CardDescription>Entre com suas credenciais de administrador</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300"
                  />
                </div>
              
                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Autenticando...' : 'Entrar como Administrador'}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t py-4 text-sm text-gray-600">
              <a href="/" className="text-amber-700 hover:text-amber-900">Voltar para página inicial</a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminAuth;
