
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LicenseTeam, License } from '@/types/license';
import { Building, Plus } from 'lucide-react';
import TeamsList from '../TeamsList';
import { useTeamManagement } from '@/hooks/useTeamManagement';

interface EnterpriseLicensesTabProps {
  licenses: License[];
  isLoadingTeams: boolean;
  onAllocateTeam: (license: License) => void;
}

const EnterpriseLicensesTab: React.FC<EnterpriseLicensesTabProps> = ({
  licenses,
  isLoadingTeams,
  onAllocateTeam
}) => {
  const [expandedLicense, setExpandedLicense] = useState<string | null>(null);
  
  const { 
    getTeamsByLicense, 
    updateTeam, 
    deleteTeam 
  } = useTeamManagement();
  
  const toggleLicense = (licenseId: string) => {
    setExpandedLicense(prev => prev === licenseId ? null : licenseId);
  };
  
  return (
    <div className="space-y-6">
      {licenses.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">Nenhuma licença empresarial encontrada.</p>
        </div>
      ) : (
        licenses.map(license => {
          const teams = getTeamsByLicense(license.id);
          const isExpanded = expandedLicense === license.id;
          
          return (
            <Card key={license.id} className={isExpanded ? 'border-primary' : ''}>
              <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleLicense(license.id)}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Licença: {license.key} ({license.usedCount}/{license.totalCount} alocações)
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAllocateTeam(license);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Alocar Equipe
                  </Button>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Esta licença possui {teams.length} equipes alocadas 
                      de um total de {license.totalCount} disponíveis.
                    </p>
                    
                    <TeamsList
                      teams={teams}
                      isLoading={isLoadingTeams}
                      onTeamUpdate={updateTeam}
                      onTeamDelete={deleteTeam}
                      licenseId={license.id}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
};

export default EnterpriseLicensesTab;
