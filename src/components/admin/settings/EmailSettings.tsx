
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { SettingsCard } from './SettingsCard';

interface EmailSettingsProps {
  onSave: () => void;
  isLoading: boolean;
  onTestEmail: () => void;
}

export const EmailSettings = ({ onSave, isLoading, onTestEmail }: EmailSettingsProps) => {
  return (
    <SettingsCard
      title="Configurações de Email"
      description="Gerenciar configurações de servidor de email e templates"
      icon={<Mail className="h-4 w-4" />}
      onSave={onSave}
      isLoading={isLoading}
    >
      <div className="space-y-2">
        <Label htmlFor="smtp-server">Servidor SMTP</Label>
        <Input
          id="smtp-server"
          defaultValue="smtp.gmail.com"
          placeholder="Ex: smtp.gmail.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="smtp-port">Porta SMTP</Label>
        <Input
          id="smtp-port"
          defaultValue="587"
          placeholder="Ex: 587"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="smtp-user">Usuário SMTP</Label>
        <Input
          id="smtp-user"
          defaultValue="noreply@educareplus.com.br"
          placeholder="Email de envio"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="smtp-password">Senha SMTP</Label>
        <Input
          id="smtp-password"
          type="password"
          value="••••••••••••"
          placeholder="Senha da conta de email"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-notifications">Notificações por Email</Label>
          <p className="text-sm text-muted-foreground">
            Enviar notificações do sistema por email
          </p>
        </div>
        <Switch id="email-notifications" defaultChecked />
      </div>
      
      <div className="pt-4 flex gap-2 justify-end">
        <Button variant="outline" onClick={onTestEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Enviar Email de Teste
        </Button>
      </div>
    </SettingsCard>
  );
};
