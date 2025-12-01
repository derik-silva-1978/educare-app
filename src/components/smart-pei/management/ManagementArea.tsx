
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LicenseManagement } from './licenses/LicenseManagement';
import { RoleManagement } from './roles/RoleManagement';
import { TeamsManagement } from './teams/TeamsManagement';
import { MigrationTools } from './migration/MigrationTools';
import { LicenseUtilizationDashboard } from './analytics/LicenseUtilizationDashboard';
import { SupabaseConfigWarning } from './SupabaseConfigWarning';
import { UserManagement } from '@/components/placeholders/SmartPEIPlaceholders';
import { TeamAccessManagement } from './teams/TeamAccessManagement';

export const ManagementArea: React.FC = () => {
  const [activeTab, setActiveTab] = useState('licenses');
  
  return (
    <>
      <SupabaseConfigWarning />
      
      <h1 className="text-3xl font-bold mb-6">Área de Gerenciamento</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2">
          <TabsTrigger value="licenses">Licenças</TabsTrigger>
          <TabsTrigger value="teams">Equipes</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="roles">Funções</TabsTrigger>
          <TabsTrigger value="access">Acessos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="migration">Migração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="licenses" className="space-y-4">
          <LicenseManagement />
        </TabsContent>
        
        <TabsContent value="teams" className="space-y-4">
          <TeamsManagement />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <RoleManagement />
        </TabsContent>
        
        <TabsContent value="access" className="space-y-4">
          <TeamAccessManagement />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <LicenseUtilizationDashboard />
        </TabsContent>
        
        <TabsContent value="migration" className="space-y-4">
          <MigrationTools />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ManagementArea;
