
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';
import { Settings, Shield, Mail, Globe, Database } from 'lucide-react';

// Import our new components
import { GeneralSettings } from '@/components/admin/settings/GeneralSettings';
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings';
import { EmailSettings } from '@/components/admin/settings/EmailSettings';
import { LocalizationSettings } from '@/components/admin/settings/LocalizationSettings';
import { SystemSettings } from '@/components/admin/settings/SystemSettings';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso.",
      });
    }, 1000);
  };
  
  const handleClearCache = () => {
    toast({
      title: "Cache limpo",
      description: "O cache do sistema foi limpo com sucesso.",
    });
  };
  
  const handleTestEmail = () => {
    toast({
      title: "Email de teste enviado",
      description: "Foi enviado um email de teste para o administrador.",
    });
  };
  
  return (
    <>
      <Helmet>
        <title>Configurações do Sistema | Admin Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Versão 2.0.1
          </Badge>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="localization">
              <Globe className="h-4 w-4 mr-2" />
              Localização
            </TabsTrigger>
            <TabsTrigger value="system">
              <Database className="h-4 w-4 mr-2" />
              Sistema
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettings onSave={handleSaveSettings} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings onSave={handleSaveSettings} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="email">
            <EmailSettings 
              onSave={handleSaveSettings} 
              isLoading={isLoading} 
              onTestEmail={handleTestEmail} 
            />
          </TabsContent>
          
          <TabsContent value="localization">
            <LocalizationSettings onSave={handleSaveSettings} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="system">
            <SystemSettings 
              onSave={handleSaveSettings} 
              isLoading={isLoading}
              onClearCache={handleClearCache} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminSettings;
