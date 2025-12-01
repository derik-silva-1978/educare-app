
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { AccessibilitySettings } from './AccessibilitySettings';
import { SecuritySettings } from './SecuritySettings';
import { AutoSaveSettings } from './AutoSaveSettings';
import { useToast } from '@/hooks/use-toast';
import { TipBanner } from '@/components/smart-pei/onboarding/TipBanner';
import { useNavigate, useLocation } from 'react-router-dom';

export const UserSettings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  
  // Check for tab query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'notifications', 'appearance', 'autosave', 'accessibility', 'security'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/smart-pei/settings?tab=${value}`, { replace: true });
  };
  
  const handleSettingsSaved = (section: string) => {
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Configurações do Usuário</h1>
        <p className="text-muted-foreground">Personalize sua experiência no Smart PEI</p>
      </div>
      
      <TipBanner
        id="user-settings-intro"
        title="Personalize sua experiência"
        description="Aqui você pode gerenciar seu perfil, preferências de notificação, aparência e segurança da conta."
      />
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="autosave">Auto-Salvar</TabsTrigger>
          <TabsTrigger value="accessibility">Acessibilidade</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings onSave={() => handleSettingsSaved('perfil')} />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings onSave={() => handleSettingsSaved('notificações')} />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettings onSave={() => handleSettingsSaved('aparência')} />
        </TabsContent>

        <TabsContent value="autosave">
          <AutoSaveSettings onSave={() => handleSettingsSaved('auto-salvar')} />
        </TabsContent>
        
        <TabsContent value="accessibility">
          <AccessibilitySettings onSave={() => handleSettingsSaved('acessibilidade')} />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings onSave={() => handleSettingsSaved('segurança')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
