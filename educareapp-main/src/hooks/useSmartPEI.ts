
import { useState } from 'react';
import { AIReportGenerationOptions } from '@/utils/ai-service';
import { Report } from '@/types/report';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

const useSmartPEI = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const { toast } = useToast();

  // Generate mock report
  const generateReport = async (options: AIReportGenerationOptions, studentId: string, studentName: string): Promise<Report> => {
    // Mock report generation
    const newReport: Report = {
      id: uuidv4(),
      title: `Relatório para ${studentName}`,
      type: 'progress',
      date: new Date().toISOString(),
      status: 'draft',
      progress: 100,
      content: '<h1>Conteúdo do relatório</h1><p>Este é um relatório gerado automaticamente.</p>',
      studentId: studentId,
      studentName: studentName,
      author: 'Sistema Smart PEI',
      description: 'Relatório gerado pelo Smart PEI',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setReports(prev => [...prev, newReport]);
    return newReport;
  };

  // Show notification to user
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    toast({
      title: type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : 'Informação',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  };

  // Add openModal method to fix the error in StudentPEIList.tsx
  const openModal = (modalType: string, data?: any) => {
    console.log(`Opening modal: ${modalType}`, data);
    // This would normally open a modal, but for now it's just a stub
  };

  return {
    reports,
    generateReport,
    showNotification,
    openModal
  };
};

export default useSmartPEI;
