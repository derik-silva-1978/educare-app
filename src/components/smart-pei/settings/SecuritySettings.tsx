
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, Lock, KeyRound, RotateCw, AlertTriangle, Smartphone } from 'lucide-react';

interface SecuritySettingsProps {
  onSave: () => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onSave }) => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    autoLogout: true,
    passwordExpiryDays: 90,
    requireStrongPassword: true,
    loginNotifications: true
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleToggle = (field: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };
  
  const handleInputChange = (field: string, value: string | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.error('As senhas não coincidem!');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      console.error('A senha deve ter pelo menos 8 caracteres!');
      return;
    }
    
    console.log('Mudando senha:', passwordData);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    onSave();
  };
  
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving security settings:', securitySettings);
    onSave();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handlePasswordSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Recomendamos alterar sua senha a cada 90 dias para maior segurança
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                A senha deve ter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas e números.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!passwordData.currentPassword || 
                !passwordData.newPassword || 
                !passwordData.confirmPassword}
            >
              Atualizar senha
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <form onSubmit={handleSecuritySubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Configurações de Segurança
            </CardTitle>
            <CardDescription>
              Configure as opções de segurança para proteger sua conta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor-auth" className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span>Autenticação de dois fatores</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Adiciona uma camada extra de segurança à sua conta
                  </p>
                </div>
                <Switch 
                  id="two-factor-auth" 
                  checked={securitySettings.twoFactorAuth} 
                  onCheckedChange={() => handleToggle('twoFactorAuth')} 
                />
              </div>
              
              {securitySettings.twoFactorAuth && (
                <Alert className="bg-muted">
                  <AlertTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Configurar autenticação de dois fatores
                  </AlertTitle>
                  <AlertDescription>
                    Para finalizar a configuração, você precisará escanear um QR code com seu aplicativo autenticador.
                    <Button variant="link" className="p-0 h-auto mt-1">
                      Configurar agora
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="login-notifications" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span>Notificações de login</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receba notificações quando sua conta for acessada de um novo dispositivo
                  </p>
                </div>
                <Switch 
                  id="login-notifications" 
                  checked={securitySettings.loginNotifications} 
                  onCheckedChange={() => handleToggle('loginNotifications')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-logout" className="flex items-center space-x-2">
                    <RotateCw className="h-4 w-4 text-muted-foreground" />
                    <span>Logout automático</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Encerrar sessão automaticamente após período de inatividade
                  </p>
                </div>
                <Switch 
                  id="auto-logout" 
                  checked={securitySettings.autoLogout} 
                  onCheckedChange={() => handleToggle('autoLogout')} 
                />
              </div>
              
              {securitySettings.autoLogout && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="session-timeout">Tempo de inatividade (minutos)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min={5}
                    max={120}
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-strong-password" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span>Exigir senha forte</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Requer senhas com letras, números e caracteres especiais
                  </p>
                </div>
                <Switch 
                  id="require-strong-password" 
                  checked={securitySettings.requireStrongPassword} 
                  onCheckedChange={() => handleToggle('requireStrongPassword')} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-expiry">Expiração da senha (dias)</Label>
                <Input
                  id="password-expiry"
                  type="number"
                  min={30}
                  max={365}
                  value={securitySettings.passwordExpiryDays}
                  onChange={(e) => handleInputChange('passwordExpiryDays', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Defina como 0 para nunca expirar a senha
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full">
              Salvar configurações de segurança
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SecuritySettings;
