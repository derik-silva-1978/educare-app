
import React from 'react';
import { useTitibot } from '../TitibotProvider';
import TitibotPositionSettings from './TitibotPositionSettings';
import TitibotPremium from './TitibotPremium';
import TitibotTurboCard from './TitibotTurboCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TitibotSettings: React.FC = () => {
  const { 
    isEnabled, 
    enableTitibot, 
    disableTitibot, 
    isSubscribed, 
    subscribeTitibot, 
    unsubscribeTitibot,
    isPremium,
    upgradeToPremium,
    downgradeFromPremium
  } = useTitibot();

  return (
    <div className="p-4 space-y-4">
      <Tabs defaultValue="general">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="general" className="flex-1">Configurações Gerais</TabsTrigger>
          <TabsTrigger value="appearance" className="flex-1">Aparência</TabsTrigger>
          <TabsTrigger value="premium" className="flex-1">Premium</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="titibot-enabled">Ativar Titibot</Label>
                <p className="text-xs text-muted-foreground">
                  Exibir o assistente virtual no sistema
                </p>
              </div>
              <Switch 
                checked={isEnabled}
                onCheckedChange={(checked) => checked ? enableTitibot() : disableTitibot()}
                id="titibot-enabled"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="titibot-subscribed">Sugestões Automáticas</Label>
                <p className="text-xs text-muted-foreground">
                  Receber sugestões contextuais baseadas na página atual
                </p>
              </div>
              <Switch 
                checked={isSubscribed}
                onCheckedChange={(checked) => checked ? subscribeTitibot() : unsubscribeTitibot()}
                id="titibot-subscribed"
              />
            </div>

            <div className="bg-primary/5 rounded-md p-3 mt-2">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-primary mr-2 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Personalize como o Titibot é exibido no sistema. Você pode alterar sua posição e controlar quando ele aparece para se adaptar melhor ao seu fluxo de trabalho.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <TitibotPositionSettings />
        </TabsContent>
        
        <TabsContent value="premium" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Turbo - Assistente Avançado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Acesse recursos avançados de análise e assistência educacional com o Titibot Turbo.
            </p>
          </div>
          
          <TitibotTurboCard compact={true} />
          
          <TitibotPremium
            isPremium={isPremium}
            upgradeToPremium={upgradeToPremium}
            downgradeFromPremium={downgradeFromPremium}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TitibotSettings;
