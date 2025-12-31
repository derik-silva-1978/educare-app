import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { User, Bell, Shield, Palette, LogOut, Moon, Sun, Monitor, Key, Smartphone, Save, Loader2 } from 'lucide-react';
import { httpClient } from '@/services/api/httpClient';

const EducareSettingsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast({
        title: 'Erro',
        description: 'O nome não pode estar vazio.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await httpClient.put('/api/profiles/me', {
        firstName,
        lastName,
        name: name.trim()
      });

      if (response.success) {
        toast({
          title: 'Perfil atualizado',
          description: 'Suas informações foram salvas com sucesso.',
        });
      } else {
        throw new Error(response.error || 'Erro ao salvar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Não foi possível salvar suas alterações.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    navigate('/educare-app/settings/change-password');
  };

  return (
    <>
      <Helmet>
        <title>Configurações | Educare</title>
        <meta name="description" content="Configurações da sua conta no Educare" />
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email || ''} 
                    placeholder="seu@email.com"
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
                <Badge variant="secondary" className="ml-2 text-xs">Em Desenvolvimento</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between opacity-60">
                <div>
                  <p className="font-medium">Notificações por email</p>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações sobre o desenvolvimento das crianças
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>Em breve</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between opacity-60">
                <div>
                  <p className="font-medium">Lembretes de atividades</p>
                  <p className="text-sm text-muted-foreground">
                    Seja notificado sobre atividades pendentes
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>Em breve</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alterar senha</p>
                  <p className="text-sm text-muted-foreground">
                    Mantenha sua conta segura com uma senha forte
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleChangePassword}>
                  <Key className="mr-2 h-4 w-4" />
                  Alterar
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between opacity-60">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Autenticação em duas etapas</p>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Em Desenvolvimento</Badge>
                  <Button variant="outline" size="sm" disabled>Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-3 block">Tema da Interface</Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Claro
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Escuro
                  </Button>
                  <Button 
                    variant={theme === 'system' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTheme('system')}
                    className="flex items-center gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    Automático
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {theme === 'system' 
                    ? 'O tema será ajustado automaticamente conforme as configurações do seu sistema'
                    : `Tema ${theme === 'light' ? 'claro' : 'escuro'} selecionado`
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <LogOut className="h-5 w-5" />
                Sair da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Você será desconectado desta sessão. Seus dados permanecerão salvos.
              </p>
              <Button variant="destructive" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EducareSettingsPage;
