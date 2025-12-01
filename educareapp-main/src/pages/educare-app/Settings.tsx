
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Profile settings state
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    occupation: ''
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    reminderBeforeQuiz: true,
    newMaterials: true,
    monthlyReport: true,
    developmentTips: true
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    showProfileToOthers: true,
    allowFriendRequests: true,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileSettings({
      ...profileSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleToggleChange = (setting: string, value: boolean, settingType: 'notification' | 'privacy') => {
    if (settingType === 'notification') {
      setNotificationSettings({
        ...notificationSettings,
        [setting]: value
      });
    } else {
      setPrivacySettings({
        ...privacySettings,
        [setting]: value
      });
    }
  };

  const handleSaveSettings = (settingType: string) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Configurações Salvas",
        description: `Suas configurações de ${settingType} foram atualizadas com sucesso.`,
      });
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>Configurações | Educare</title>
      </Helmet>
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e informações pessoais
          </p>
        </header>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize seus dados pessoais e informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={profileSettings.name}
                    onChange={handleProfileChange}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email"
                    name="email"
                    value={profileSettings.email}
                    onChange={handleProfileChange}
                    placeholder="seu@email.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={profileSettings.phone}
                    onChange={handleProfileChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Ocupação/Profissão</Label>
                  <Input 
                    id="occupation"
                    name="occupation"
                    value={profileSettings.occupation}
                    onChange={handleProfileChange}
                    placeholder="Sua ocupação ou profissão"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('perfil')} 
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificações</CardTitle>
                <CardDescription>
                  Escolha como e quando deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Canais de Comunicação</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="font-medium">Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">Receba atualizações por e-mail</p>
                    </div>
                    <Switch 
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleToggleChange('emailNotifications', checked, 'notification')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications" className="font-medium">Notificações por SMS</Label>
                      <p className="text-sm text-muted-foreground">Receba lembretes por mensagem de texto</p>
                    </div>
                    <Switch 
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleToggleChange('smsNotifications', checked, 'notification')}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tipos de Notificação</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reminderBeforeQuiz" className="font-medium">Lembrete de Quiz</Label>
                      <p className="text-sm text-muted-foreground">Receba um lembrete antes de um quiz agendado</p>
                    </div>
                    <Switch 
                      id="reminderBeforeQuiz"
                      checked={notificationSettings.reminderBeforeQuiz}
                      onCheckedChange={(checked) => handleToggleChange('reminderBeforeQuiz', checked, 'notification')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newMaterials" className="font-medium">Novos Materiais</Label>
                      <p className="text-sm text-muted-foreground">Seja notificado quando novos materiais forem adicionados</p>
                    </div>
                    <Switch 
                      id="newMaterials"
                      checked={notificationSettings.newMaterials}
                      onCheckedChange={(checked) => handleToggleChange('newMaterials', checked, 'notification')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="monthlyReport" className="font-medium">Relatório Mensal</Label>
                      <p className="text-sm text-muted-foreground">Receba um relatório mensal do progresso</p>
                    </div>
                    <Switch 
                      id="monthlyReport"
                      checked={notificationSettings.monthlyReport}
                      onCheckedChange={(checked) => handleToggleChange('monthlyReport', checked, 'notification')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="developmentTips" className="font-medium">Dicas de Desenvolvimento</Label>
                      <p className="text-sm text-muted-foreground">Receba dicas semanais de desenvolvimento infantil</p>
                    </div>
                    <Switch 
                      id="developmentTips"
                      checked={notificationSettings.developmentTips}
                      onCheckedChange={(checked) => handleToggleChange('developmentTips', checked, 'notification')}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('notificações')} 
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
                <CardDescription>
                  Gerencie como seus dados são compartilhados e utilizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shareData" className="font-medium">Compartilhar Dados Anônimos</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir o compartilhamento anônimo de dados para melhorar o serviço
                    </p>
                  </div>
                  <Switch 
                    id="shareData"
                    checked={privacySettings.shareData}
                    onCheckedChange={(checked) => handleToggleChange('shareData', checked, 'privacy')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showProfileToOthers" className="font-medium">Visibilidade do Perfil</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que outros usuários vejam seu perfil
                    </p>
                  </div>
                  <Switch 
                    id="showProfileToOthers"
                    checked={privacySettings.showProfileToOthers}
                    onCheckedChange={(checked) => handleToggleChange('showProfileToOthers', checked, 'privacy')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowFriendRequests" className="font-medium">Solicitações de Conexão</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que profissionais solicitem conexão com você
                    </p>
                  </div>
                  <Switch 
                    id="allowFriendRequests"
                    checked={privacySettings.allowFriendRequests}
                    onCheckedChange={(checked) => handleToggleChange('allowFriendRequests', checked, 'privacy')}
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Gerenciamento de Dados</h3>
                  
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Exportar Meus Dados
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      Solicitar Exclusão da Conta
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('privacidade')} 
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
