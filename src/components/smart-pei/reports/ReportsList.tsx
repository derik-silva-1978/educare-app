
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Report } from '@/types/report';

interface ReportsListProps {
  searchTerm?: string;
  filters?: object;
}

export const ReportsList: React.FC<ReportsListProps> = ({ searchTerm, filters }) => {
  const navigate = useNavigate();
  
  // Import the original reports list from the reports-dashboard directory
  // This prevents circular dependencies
  const { default: DashboardReportsList } = require('./reports-dashboard/ReportsList');
  
  const handleViewReport = (id: string) => {
    navigate(`/smart-pei/reports/${id}`);
  };
  
  const handleEditReport = (id: string) => {
    navigate(`/smart-pei/reports/${id}/edit`);
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
  
  return (
    <DashboardReportsList
      reports={mockReports}
      onViewReport={handleViewReport}
      onEditReport={handleEditReport}
    />
  );
};

export default ReportsList;
