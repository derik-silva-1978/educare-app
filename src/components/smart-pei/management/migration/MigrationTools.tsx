
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/hooks/usePermissions';
import { Placeholder, LicenseMigrationTool, BulkLicenseCreator } from '@/components/placeholders/SmartPEIPlaceholders';

export const MigrationTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('migration');
  const { hasPermission } = usePermissions();
  
  const canAccessMigrationTools = hasPermission('license.validate');
  
  if (!canAccessMigrationTools) {
    return (
      <div className="p-6 bg-muted rounded-md text-center">
        <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar as ferramentas de migração.
          Entre em contato com um administrador.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="migration">Migração de Licenças</TabsTrigger>
          <TabsTrigger value="bulk">Criação em Massa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="migration">
          <LicenseMigrationTool />
        </TabsContent>
        
        <TabsContent value="bulk">
          <BulkLicenseCreator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MigrationTools;
