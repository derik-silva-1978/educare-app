
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, RefreshCw } from 'lucide-react';
import { SettingsCard } from './SettingsCard';

interface SystemSettingsProps {
  onSave: () => void;
  isLoading: boolean;
  onClearCache: () => void;
}

export const SystemSettings = ({ onSave, isLoading, onClearCache }: SystemSettingsProps) => {
  return (
    <SettingsCard
      title="Configurações do Sistema"
      description="Gerenciar configurações avançadas do sistema"
      icon={<Database className="h-4 w-4" />}
      onSave={onSave}
      isLoading={isLoading}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="debug-mode">Modo de Depuração</Label>
          <p className="text-sm text-muted-foreground">
            Ativar registro detalhado de erros e eventos
          </p>
        </div>
        <Switch id="debug-mode" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="api-logging">Registro de API</Label>
          <p className="text-sm text-muted-foreground">
            Registrar todas as chamadas de API e respostas
          </p>
        </div>
        <Switch id="api-logging" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="log-retention">Retenção de Logs (dias)</Label>
        <Input
          id="log-retention"
          type="number"
          defaultValue="30"
          min="1"
          max="365"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="backup-frequency">Frequência de Backup</Label>
        <Select defaultValue="daily">
          <SelectTrigger id="backup-frequency">
            <SelectValue placeholder="Selecione uma frequência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">A cada hora</SelectItem>
            <SelectItem value="daily">Diário</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-4 flex gap-2 justify-end">
        <Button variant="outline" onClick={onClearCache}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Limpar Cache
        </Button>
      </div>
    </SettingsCard>
  );
};
