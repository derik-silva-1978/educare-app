
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { ReportFilters } from './ReportFilters';

// Create wrapper components for ReportsList and ReportGenerator
interface ReportsListWrapperProps {
  searchTerm?: string;
  filters?: object;
}

const ReportsListWrapper: React.FC<ReportsListWrapperProps> = ({ 
  searchTerm = '',
  filters = {}
}) => {
  // Import dynamically to avoid circular dependencies
  const { default: ReportsList } = require('@/components/smart-pei/reports/ReportsList');
  return <ReportsList />;
};

interface ReportGeneratorWrapperProps {
  onReportCreated?: () => void;
}

const ReportGeneratorWrapper: React.FC<ReportGeneratorWrapperProps> = ({
  onReportCreated
}) => {
  // Import dynamically to avoid circular dependencies
  const { default: ReportGenerator } = require('@/components/smart-pei/reports/ReportGenerator');
  return <ReportGenerator onReportCreated={onReportCreated} />;
};

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'generator'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleReportCreated = () => {
    setActiveTab('list');
  };
  
  return (
    <>
      <Helmet>
        <title>Relatórios | Smart PEI</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gere diferentes tipos de relatórios para seus alunos.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'generator')} className="w-full lg:w-auto">
            <TabsList>
              <TabsTrigger value="list">Meus Relatórios</TabsTrigger>
              <TabsTrigger value="generator">Criar Relatório</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {activeTab === 'list' ? (
          <div className="space-y-4">
            <ReportFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />
            <ReportsListWrapper searchTerm={searchTerm} filters={filters} />
          </div>
        ) : (
          <div className="space-y-4">
            <ReportGeneratorWrapper onReportCreated={handleReportCreated} />
          </div>
        )}
      </div>
    </>
  );
};

export default ReportsPage;
