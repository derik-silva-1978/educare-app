
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ReportGenerator } from './ReportGenerator';
import { TitibotProvider } from '../titibot/TitibotProvider';

const ReportCreationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState<string | undefined>();
  const [studentName, setStudentName] = useState<string | undefined>();
  
  useEffect(() => {
    // Extract student info from URL params
    const idParam = searchParams.get('studentId');
    const nameParam = searchParams.get('studentName');
    
    if (idParam) {
      setStudentId(idParam);
    }
    
    if (nameParam) {
      setStudentName(decodeURIComponent(nameParam));
    }
  }, [searchParams]);
  
  const handleGoBack = () => {
    navigate('/smart-pei/app/reports');
  };
  
  const handleReportCreated = () => {
    navigate('/smart-pei/app/reports');
  };
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Helmet>
        <title>Novo Relatório | Smart PEI</title>
      </Helmet>
      
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Relatórios
        </Button>
        
        <h1 className="text-2xl font-bold">Criar Novo Relatório</h1>
        <p className="text-muted-foreground">
          {studentName 
            ? `Criando relatório para ${studentName}` 
            : 'Selecione um modelo e configure seu relatório'}
        </p>
      </div>
      
      <TitibotProvider>
        <ReportGenerator 
          onReportCreated={handleReportCreated}
          initialStudentId={studentId}
          initialStudentName={studentName}
        />
      </TitibotProvider>
    </div>
  );
};

export default ReportCreationPage;
