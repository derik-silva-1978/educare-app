
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ReportsList from './reports-dashboard/ReportsList';
import { TitibotProvider } from '../titibot/TitibotProvider';
import { Report } from '@/types/report';

const EnhancedReportsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCreateReport = () => {
    navigate('/smart-pei/reports/new');
  };
  
  // Mock reports data for demonstration
  const mockReports: Report[] = [
    {
      id: '1',
      title: 'Relatório de Avaliação - João Silva',
      date: '2023-10-15',
      type: 'assessment',
      status: 'completed',
      studentName: 'João Silva',
      progress: 100,
      createdAt: '2023-10-10T14:30:00Z',
      updatedAt: '2023-10-15T09:45:00Z'
    },
    {
      id: '2',
      title: 'Progresso Trimestral - Maria Santos',
      date: '2023-11-05',
      type: 'progress',
      status: 'draft',
      studentName: 'Maria Santos',
      progress: 65,
      createdAt: '2023-11-02T10:15:00Z',
      updatedAt: '2023-11-05T16:20:00Z'
    }
  ];
  
  const handleViewReport = (id: string) => {
    navigate(`/smart-pei/reports/${id}`);
  };
  
  const handleEditReport = (id: string) => {
    navigate(`/smart-pei/reports/${id}/edit`);
  };
  
  return (
    <TitibotProvider>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Helmet>
          <title>Relatórios | Smart PEI</title>
        </Helmet>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">
              Gerencie e visualize os relatórios dos alunos
            </p>
          </div>
          
          <Button onClick={handleCreateReport} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Novo Relatório
          </Button>
        </div>
        
        <ReportsList 
          reports={mockReports}
          onViewReport={handleViewReport}
          onEditReport={handleEditReport}
        />
      </div>
    </TitibotProvider>
  );
};

export default EnhancedReportsPage;
