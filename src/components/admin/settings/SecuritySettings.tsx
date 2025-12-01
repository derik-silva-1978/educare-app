
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';
import { SettingsCard } from './SettingsCard';

interface SecuritySettingsProps {
  onSave: () => void;
  isLoading: boolean;
}

export const SecuritySettings = ({ onSave, isLoading }: SecuritySettingsProps) => {
  return (
    <SettingsCard
      title="Configurações de Segurança"
      description="Gerenciar configurações de segurança e autenticação"
      icon={<Shield className="h-4 w-4" />}
      onSave={onSave}
      isLoading={isLoading}
    >
      <div className="space-y-2">
        <Label htmlFor="session-timeout">Tempo de Sessão (minutos)</Label>
        <Input
          id="session-timeout"
          type="number"
          defaultValue="60"
          min="5"
          max="1440"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-verification">Verificação de Email</Label>
          <p className="text-sm text-muted-foreground">
            Exigir verificação de email para novos registros
          </p>
        </div>
        <Switch id="email-verification" defaultChecked />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="password-complexity">Complexidade de Senha</Label>
          <p className="text-sm text-muted-foreground">
            Exigir senhas fortes (8+ caracteres, letras, números e símbolos)
          </p>
        </div>
        <Switch id="password-complexity" defaultChecked />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="login-attempts">Limitar Tentativas de Login</Label>
          <p className="text-sm text-muted-foreground">
            Bloquear conta após 5 tentativas de login mal-sucedidas
          </p>
        </div>
        <Switch id="login-attempts" defaultChecked />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="admin-approval">Aprovação de Administrador</Label>
          <p className="text-sm text-muted-foreground">
            Exigir aprovação de administrador para novos registros de profissionais
          </p>
        </div>
        <Switch id="admin-approval" />
      </div>
    </SettingsCard>
  );
};
