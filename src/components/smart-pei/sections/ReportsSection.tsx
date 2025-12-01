
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, FileText, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ReportsList } from '../ReportsList';
import { ReportGenerator } from '../ReportGenerator';
import { TitibotProvider, useTitibot } from '../titibot/TitibotProvider';

// Create a wrapped component that uses useTitibot
const ReportsListWithTitibotHelp: React.FC = () => {
  const { openTitibot } = useTitibot();
  
  const handleOpenTitibotForReports = () => {
    openTitibot();
    // In a real implementation, we could also send a specific message to the Titibot
    // to trigger a helpful response about reports
  };
  
  return <ReportsList />;
};

export const ReportsSection: React.FC = () => {
  const handleOpenTitibotForReports = () => {
    // This is now handled in the wrapped component
    console.log('Opening Titibot for reports help');
  };

  return (
    <div className="reports-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Relatórios</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to="/smart-pei/app/reports/formats">
              <FileText className="h-4 w-4 mr-2" />
              Ver Formatos de Relatórios
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to="/smart-pei/app/profile">
              <User className="h-4 w-4 mr-2" />
              Meu Perfil
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleOpenTitibotForReports}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Ajuda com relatórios</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="existing">
        <TabsList className="mb-4">
          <TabsTrigger value="existing">Meus Relatórios</TabsTrigger>
          <TabsTrigger value="new">Criar Relatório</TabsTrigger>
        </TabsList>
        
        <TabsContent value="existing">
          <TitibotProvider>
            <ReportsListWithTitibotHelp />
          </TitibotProvider>
        </TabsContent>
        
        <TabsContent value="new">
          <TitibotProvider>
            <ReportGenerator />
          </TitibotProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsSection;
