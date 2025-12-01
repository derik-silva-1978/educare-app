
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AssessmentPage from '@/components/smart-pei/AssessmentPage';
import { ClipboardCheck } from 'lucide-react';

const AssessmentsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Avaliações | Smart PEI</title>
        <meta name="description" content="Sistema de avaliações para Planos de Ensino Individualizados - Parte do Ecossistema Educare+" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="section-header mb-6">
          <h1 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <ClipboardCheck className="h-6 w-6" />
            Sistema de Avaliações
          </h1>
          <p className="text-gray-600 text-center">
            Realize avaliações abrangentes para Planos de Ensino Individualizados
          </p>
        </div>
        
        <AssessmentPage />
      </div>
    </>
  );
};

export default AssessmentsPage;
