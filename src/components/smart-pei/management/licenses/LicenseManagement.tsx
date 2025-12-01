
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, RefreshCcw, BarChart2, Database } from 'lucide-react';
import { LicensesList } from './LicensesList';
import { LicenseDialog } from './LicenseDialog';
import { useLicenseManagement } from '@/hooks/useLicenseManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LicenseUtilizationDashboard from '../analytics/LicenseUtilizationDashboard';
import { MigrationTool } from '../MigrationTool';
import { toast } from "@/hooks/use-toast";

export const LicenseManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('licenses');
  
  const { licenses, isLoading, refreshLicenses } = useLicenseManagement();
  
  const filteredLicenses = licenses.filter(license => 
    license.key.toLowerCase().includes(search.toLowerCase()) || 
    license.type.toLowerCase().includes(search.toLowerCase()) ||
    (license.assignedTo && license.assignedTo.toLowerCase().includes(search.toLowerCase()))
  );
  
  const handleEditLicense = (license: any) => {
    setEditingLicense(license);
    setIsDialogOpen(true);
  };
  
  const handleAddNewLicense = () => {
    setEditingLicense(null);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLicense(null);
  };

  const handleRefresh = () => {
    refreshLicenses();
    toast({
      title: "Dados Atualizados",
      description: "A lista de licenças foi atualizada com sucesso.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <TabsList>
            <TabsTrigger value="licenses">Licenças</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
            <TabsTrigger value="migration">Migração</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button size="sm" onClick={handleAddNewLicense}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Licença
            </Button>
          </div>
        </div>
        
        <TabsContent value="licenses" className="space-y-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar licenças..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <LicensesList 
            licenses={filteredLicenses} 
            isLoading={isLoading} 
            onEditLicense={handleEditLicense} 
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <LicenseUtilizationDashboard />
        </TabsContent>
        
        <TabsContent value="migration">
          <div className="flex flex-col items-center py-8">
            <div className="mb-8 text-center">
              <h3 className="text-lg font-medium">Migração para Supabase</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Transfira seus dados do armazenamento local para o banco de dados Supabase
              </p>
            </div>
            
            <MigrationTool />
          </div>
        </TabsContent>
      </Tabs>
      
      <LicenseDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        license={editingLicense} 
        onClose={handleCloseDialog} 
      />
    </div>
  );
};

export default LicenseManagement;
