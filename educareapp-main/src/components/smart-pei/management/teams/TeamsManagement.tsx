import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building } from 'lucide-react';
import TeamAllocationDialog from './TeamAllocationDialog';
import { useLicenseManagement } from '@/hooks/useLicenseManagement';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { UserRoleGuard } from '@/components/placeholders/SmartPEIPlaceholders';
import { License } from '@/types/license';
import { TeamFilters } from './filters/TeamFilters';
import IndividualLicensesTab from './tabs/IndividualLicensesTab';
import EnterpriseLicensesTab from './tabs/EnterpriseLicensesTab';
import AllTeamsTab from './tabs/AllTeamsTab';

export const TeamsManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [licenseFilter, setLicenseFilter] = useState('all');
  const [licenseModelFilter, setLicenseModelFilter] = useState('all');
  
  const { licenses, isLoading: isLoadingLicenses, refreshLicenses } = useLicenseManagement();
  const { 
    getAllTeams, 
    isLoading: isLoadingTeams,
    updateTeam,
    deleteTeam 
  } = useTeamManagement();
  
  const handleAllocateTeam = (license: License) => {
    setSelectedLicense(license);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLicense(null);
    refreshLicenses();
  };

  const handleRefreshClick = () => {
    refreshLicenses(true);
  };
  
  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = 
      license.key.toLowerCase().includes(search.toLowerCase()) || 
      (license.assignedTo && license.assignedTo.toLowerCase().includes(search.toLowerCase()));
    
    const matchesModel = licenseModelFilter === 'all' || license.model === licenseModelFilter;
    const matchesType = licenseFilter === 'all' || license.type === licenseFilter;
    
    return matchesSearch && matchesModel && matchesType && license.isActive;
  });

  const individualLicenses = filteredLicenses.filter(license => license.model === 'individual');
  const enterpriseLicenses = filteredLicenses.filter(license => license.model === 'enterprise');
  
  const allTeams = getAllTeams();
  
  return (
    <UserRoleGuard roles={['admin', 'coordinator']}>
      <div className="space-y-4">
        <TeamFilters
          search={search}
          onSearchChange={setSearch}
          licenseModelFilter={licenseModelFilter}
          onLicenseModelFilterChange={setLicenseModelFilter}
          licenseFilter={licenseFilter}
          onLicenseFilterChange={setLicenseFilter}
          onRefresh={handleRefreshClick}
        />
        
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Individuais ({individualLicenses.length})
            </TabsTrigger>
            <TabsTrigger value="enterprise" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Empresariais ({enterpriseLicenses.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Todas Equipes ({allTeams.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="space-y-4 pt-4">
            <IndividualLicensesTab
              licenses={individualLicenses}
              isLoadingTeams={isLoadingTeams}
              onAllocateTeam={handleAllocateTeam}
            />
          </TabsContent>
          
          <TabsContent value="enterprise" className="space-y-4 pt-4">
            <EnterpriseLicensesTab
              licenses={enterpriseLicenses}
              isLoadingTeams={isLoadingTeams}
              onAllocateTeam={handleAllocateTeam}
            />
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4 pt-4">
            <AllTeamsTab 
              teams={allTeams} 
              isLoading={isLoadingTeams}
              onUpdateTeam={updateTeam}
              onDeleteTeam={deleteTeam}
            />
          </TabsContent>
        </Tabs>
        
        {selectedLicense && (
          <TeamAllocationDialog
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen}
            licenseId={selectedLicense.id} 
            onClose={handleCloseDialog}
          />
        )}
      </div>
    </UserRoleGuard>
  );
};

export default TeamsManagement;
