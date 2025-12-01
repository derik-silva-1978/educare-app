import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, UserCircle, Bell, ShieldCheck, Shapes } from 'lucide-react';

const EducareSettingsPage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    profession: '',
    specialization: '',
    license: '',
    bio: '',
    phone: '',
    notifyAssessments: true,
    notifyActivities: true,
    notifyMessages: true,
    privateProfile: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggle = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would update the user profile through an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile in auth context
      if (updateProfile) {
        await updateProfile({
          name: formData.name
          // Other fields would be included here in a real app
        });
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao salvar suas informações. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Configurações | Educare</title>
        <meta name="description" content="Gerenciar configurações da sua conta no Educare" />
      </Helmet>
      
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <UserCircle className="h-4 w-4" />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Privacidade</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1">
              <Shapes className="h-4 w-4" />
              <span>Aparência</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e profissionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          disabled={true}
                          readOnly
                        />
                        <p className="text-sm text-muted-foreground">
                          O email não pode ser alterado
                        </p>
                      </div>
                    </div>
                    
                    {currentUser?.role === 'professional' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="profession">Profissão</Label>
                            <Input
                              id="profession"
                              name="profession"
                              value={formData.profession}
                              onChange={handleChange}
                              disabled={isLoading}
                              placeholder="Exemplo: Psicólogo, Fonoaudiólogo"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="specialization">Especialização</Label>
                            <Input
                              id="specialization"
                              name="specialization"
                              value={formData.specialization}
                              onChange={handleChange}
                              disabled={isLoading}
                              placeholder="Sua especialização"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="license">Registro Profissional</Label>
                          <Input
                            id="license"
                            name="license"
                            value={formData.license}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="Número do seu registro profissional"
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Uma breve descrição sobre você"
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Seu número de telefone"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Configure como você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-assessments">Avaliações</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações sobre atualizações de avaliações
                      </p>
                    </div>
                    <Switch
                      id="notify-assessments"
                      checked={formData.notifyAssessments}
                      onCheckedChange={(checked) => handleToggle('notifyAssessments', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-activities">Atividades</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações sobre novas atividades recomendadas
                      </p>
                    </div>
                    <Switch
                      id="notify-activities"
                      checked={formData.notifyActivities}
                      onCheckedChange={(checked) => handleToggle('notifyActivities', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-messages">Mensagens</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações sobre novas mensagens
                      </p>
                    </div>
                    <Switch
                      id="notify-messages"
                      checked={formData.notifyMessages}
                      onCheckedChange={(checked) => handleToggle('notifyMessages', checked)}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Preferências
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacidade</CardTitle>
                <CardDescription>
                  Gerencie suas configurações de privacidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="private-profile">Perfil Privado</Label>
                      <p className="text-sm text-muted-foreground">
                        Tornar seu perfil visível apenas para pessoas autorizadas
                      </p>
                    </div>
                    <Switch
                      id="private-profile"
                      checked={formData.privateProfile}
                      onCheckedChange={(checked) => handleToggle('privateProfile', checked)}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Preferências
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência do aplicativo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Opções de personalização estarão disponíveis em breve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default EducareSettingsPage;
