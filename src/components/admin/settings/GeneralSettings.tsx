
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { SettingsCard } from './SettingsCard';

interface GeneralSettingsProps {
  onSave: () => void;
  isLoading: boolean;
}

export const GeneralSettings = ({ onSave, isLoading }: GeneralSettingsProps) => {
  return (
    <SettingsCard
      title="Configurações Gerais"
      description="Gerenciar configurações gerais do sistema"
      icon={<Settings className="h-4 w-4" />}
      onSave={onSave}
      isLoading={isLoading}
    >
      <div className="space-y-2">
        <Label htmlFor="site-name">Nome da Plataforma</Label>
        <Input
          id="site-name"
          defaultValue="Educare+"
          placeholder="Nome da aplicação"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="site-description">Descrição da Plataforma</Label>
        <Input
          id="site-description"
          defaultValue="Plataforma de apoio ao desenvolvimento infantil"
          placeholder="Descreva brevemente sua plataforma"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="support-email">Email de Suporte</Label>
        <Input
          id="support-email"
          type="email"
          defaultValue="suporte@educareapp.com.br"
          placeholder="Email para contato de suporte"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pagination">Itens por Página</Label>
        <Select defaultValue="10">
          <SelectTrigger id="pagination">
            <SelectValue placeholder="Escolha um valor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 itens</SelectItem>
            <SelectItem value="10">10 itens</SelectItem>
            <SelectItem value="15">15 itens</SelectItem>
            <SelectItem value="20">20 itens</SelectItem>
            <SelectItem value="50">50 itens</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
          <p className="text-sm text-muted-foreground">
            Ativar o modo de manutenção tornará o site inacessível para usuários não-administradores
          </p>
        </div>
        <Switch id="maintenance-mode" />
      </div>
    </SettingsCard>
  );
};
