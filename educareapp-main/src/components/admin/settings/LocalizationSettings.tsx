
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { SettingsCard } from './SettingsCard';

interface LocalizationSettingsProps {
  onSave: () => void;
  isLoading: boolean;
}

export const LocalizationSettings = ({ onSave, isLoading }: LocalizationSettingsProps) => {
  return (
    <SettingsCard
      title="Configurações de Localização"
      description="Gerenciar configurações de idioma, fuso horário e formatos"
      icon={<Globe className="h-4 w-4" />}
      onSave={onSave}
      isLoading={isLoading}
    >
      <div className="space-y-2">
        <Label htmlFor="default-language">Idioma Padrão</Label>
        <Select defaultValue="pt-BR">
          <SelectTrigger id="default-language">
            <SelectValue placeholder="Selecione um idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
            <SelectItem value="en-US">Inglês (Estados Unidos)</SelectItem>
            <SelectItem value="es">Espanhol</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timezone">Fuso Horário</Label>
        <Select defaultValue="America/Sao_Paulo">
          <SelectTrigger id="timezone">
            <SelectValue placeholder="Selecione um fuso horário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="America/Sao_Paulo">Brasília (UTC-3)</SelectItem>
            <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
            <SelectItem value="America/Rio_Branco">Rio Branco (UTC-5)</SelectItem>
            <SelectItem value="America/New_York">Nova York (UTC-5/UTC-4)</SelectItem>
            <SelectItem value="Europe/London">Londres (UTC+0/UTC+1)</SelectItem>
            <SelectItem value="UTC">UTC</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date-format">Formato de Data</Label>
        <Select defaultValue="dd/MM/yyyy">
          <SelectTrigger id="date-format">
            <SelectValue placeholder="Selecione um formato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
            <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
            <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="currency">Moeda</Label>
        <Select defaultValue="BRL">
          <SelectTrigger id="currency">
            <SelectValue placeholder="Selecione uma moeda" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
            <SelectItem value="USD">Dólar Americano ($)</SelectItem>
            <SelectItem value="EUR">Euro (€)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </SettingsCard>
  );
};
