
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReportsFilters } from './reports/hooks/useReportsFilters';
import { Report } from '@/types/report';
import ReportsFiltersBar from './reports/filters/ReportsFiltersBar';
import ReportsTabContent from './reports/tabs/ReportsTabContent';
import EmptyReportsState from './reports/EmptyReportsState';

// Mock initial reports with recent and important flags
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Relatório de Avaliação - João Silva',
    description: 'Resultados da avaliação diagnóstica inicial',
    date: '2023-10-15',
    type: 'assessment',
    status: 'completed',
    studentName: 'João Silva',
    coverImage: '/placeholder.svg',
    recent: true,
    important: false,
    domainTracking: true,
    skillsTracking: true,
    progress: 100,
    createdAt: '2023-10-10T14:30:00Z',
    updatedAt: '2023-10-15T09:45:00Z'
  },
  {
    id: '2',
    title: 'Progresso Trimestral - Maria Santos',
    description: 'Acompanhamento do progresso nos objetivos do PEI',
    date: '2023-11-05',
    type: 'progress',
    status: 'draft',
    studentName: 'Maria Santos',
    coverImage: '/placeholder.svg',
    recent: true,
    important: true,
    domainTracking: true,
    skillsTracking: true,
    progress: 65,
    createdAt: '2023-11-02T10:15:00Z',
    updatedAt: '2023-11-05T16:20:00Z'
  }
];

export const ReportsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string | null>(null);
  
  const { 
    reports, 
    filteredReports, 
    handleSearch, 
    handleFilterChange,
  } = useReportsFilters(mockReports);
  
  // Replace direct useTitibot dependency with a simple function
  const openTitibotWithReportHelp = () => {
    console.log('Open Titibot with report help');
    // This will be handled by the parent component that has the TitibotProvider
  };
  
  // Type guard functions  
  const hasRecent = (report: Report): report is Report & { recent?: boolean } => 
    'recent' in report;
  
  const hasImportant = (report: Report): report is Report & { important?: boolean } => 
    'important' in report;
  
  // Handler functions  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };
  
  const handleTypeFilter = (value: string) => {
    const reportType = value === 'all' ? null : value as any;
    setTypeFilter(reportType);
    handleFilterChange({ type: reportType });
  };
  
  const handleStatusFilter = (value: string) => {
    const reportStatus = value === 'all' ? null : value as any;
    setStatusFilter(reportStatus);
    handleFilterChange({ status: reportStatus });
  };
  
  const handleTimeFilter = (value: string) => {
    setTimeFilter(value === 'all' ? null : value);
    handleFilterChange({ dateRange: value === 'all' ? undefined : value });
  };
  
  const onViewReport = (id: string) => {
    console.log('View report:', id);
  };

  const onEditReport = (id: string) => {
    console.log('Edit report:', id);
  };
  
  return (
    <div className="space-y-4">
      <ReportsFiltersBar 
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        timeFilter={timeFilter}
        onSearchChange={handleSearchChange}
        onTypeFilter={handleTypeFilter}
        onStatusFilter={handleStatusFilter}
        onTimeFilter={handleTimeFilter}
        onHelpClick={openTitibotWithReportHelp}
      />
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="important">Importantes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {filteredReports.length > 0 ? (
            <ReportsTabContent 
              reports={filteredReports} 
              onViewReport={onViewReport}
              onEditReport={onEditReport}
            />
          ) : (
            <EmptyReportsState searchQuery={searchQuery} />
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="mt-4">
          <ReportsTabContent 
            reports={reports} 
            filterPredicate={(r) => hasRecent(r) && r.recent === true}
            emptyMessage="Não há relatórios recentes disponíveis."
            onViewReport={onViewReport}
            onEditReport={onEditReport}
          />
        </TabsContent>
        
        <TabsContent value="important" className="mt-4">
          <ReportsTabContent 
            reports={reports} 
            filterPredicate={(r) => hasImportant(r) && r.important === true}
            emptyMessage="Não há relatórios marcados como importantes."
            onViewReport={onViewReport}
            onEditReport={onEditReport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsList;
