
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Timer, Info } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface AutoSaveSettingsProps {
  onSave: () => void;
}

export const AutoSaveSettings: React.FC<AutoSaveSettingsProps> = ({ onSave }) => {
  // Default auto-save settings
  const [autoSaveSettings, setAutoSaveSettings] = useLocalStorage('pei_autosave_settings', {
    enabled: true,
    interval: 30, // seconds
    showNotifications: true
  });
  
  const handleIntervalChange = (value: number[]) => {
    setAutoSaveSettings({
      ...autoSaveSettings,
      interval: value[0]
    });
  };
  
  const handleEnabledChange = (checked: boolean) => {
    setAutoSaveSettings({
      ...autoSaveSettings,
      enabled: checked
    });
  };
  
  const handleNotificationsChange = (checked: boolean) => {
    setAutoSaveSettings({
      ...autoSaveSettings,
      showNotifications: checked
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };
  
  const handleReset = () => {
    setAutoSaveSettings({
      enabled: true,
      interval: 30,
      showNotifications: true
    });
  };
  
  return (
    <Card className="border border-muted shadow-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Configurações de Salvamento Automático
          </CardTitle>
          <CardDescription>
            Personalize como e quando seus dados são salvos automaticamente
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autosave-enabled" className="flex items-center gap-2">
                Salvamento automático
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Quando ativado, suas alterações serão salvas automaticamente no intervalo configurado.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <p className="text-sm text-muted-foreground">
                Salve automaticamente seu progresso enquanto trabalha
              </p>
            </div>
            <Switch
              id="autosave-enabled"
              checked={autoSaveSettings.enabled}
              onCheckedChange={handleEnabledChange}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="autosave-interval" className="text-base">Intervalo de salvamento</Label>
              <span className="text-sm font-medium">{autoSaveSettings.interval} segundos</span>
            </div>
            
            <Slider
              id="autosave-interval"
              defaultValue={[autoSaveSettings.interval]}
              value={[autoSaveSettings.interval]}
              max={120}
              min={5}
              step={5}
              onValueChange={handleIntervalChange}
              disabled={!autoSaveSettings.enabled}
              className="[&>.slider-track]:bg-primary/30"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Frequente (5s)</span>
              <span>Moderado (30s)</span>
              <span>Menos frequente (120s)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="autosave-notifications">Notificações de salvamento</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar notificação quando o salvamento automático ocorrer
              </p>
            </div>
            <Switch
              id="autosave-notifications"
              checked={autoSaveSettings.showNotifications}
              onCheckedChange={handleNotificationsChange}
              disabled={!autoSaveSettings.enabled}
            />
          </div>
          
          <div className="rounded-md bg-muted p-4 mt-4">
            <div className="flex gap-2">
              <Timer className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium">Dica</h4>
                <p className="text-sm text-muted-foreground">
                  Salvamentos mais frequentes ajudam a prevenir perda de dados, mas podem afetar o desempenho em dispositivos mais antigos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
          >
            Restaurar padrões
          </Button>
          <Button type="submit">
            Salvar alterações
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AutoSaveSettings;
