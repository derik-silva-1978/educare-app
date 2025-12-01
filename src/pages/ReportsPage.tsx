
import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedReportsPage from '@/components/smart-pei/reports/EnhancedReportsPage';

const ReportsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Relatórios | Smart PEI</title>
        <meta name="description" content="Geração e visualização de relatórios do Smart PEI" />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 pt-8 pb-12">
          <EnhancedReportsPage />
        </div>
      </main>
    </>
  );
};

export default ReportsPage;
