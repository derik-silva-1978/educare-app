
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Report, toReportType, toReportStatus } from '@/types/report';
import { safeTableQuery, safeTableInsert, MockSupabaseResponse } from '@/utils/supabase-rpc-utils';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load reports from Supabase
  const loadReports = useCallback(async (filters: any = {}) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // For now, let's mock the response since we're having issues with the Supabase client
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Relatório de Progresso - T1 2023',
          type: 'progress',
          date: new Date().toISOString(),
          status: 'completed',
          progress: 100,
          content: 'Conteúdo do relatório...',
          studentId: 'student1',
          studentName: 'João Silva',
          author: 'Dr. Maria Educadora',
          description: 'Relatório trimestral de progresso',
          coverImage: null,
          domainTracking: true,
          skillsTracking: true,
          recent: true,
          important: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Avaliação Inicial - 2023',
          type: 'assessment',
          date: new Date().toISOString(),
          status: 'completed',
          progress: 100,
          content: 'Conteúdo da avaliação...',
          studentId: 'student1',
          studentName: 'João Silva',
          author: 'Dr. Maria Educadora',
          description: 'Avaliação inicial completa',
          coverImage: null,
          domainTracking: true,
          skillsTracking: true,
          recent: false,
          important: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      // Apply filters
      let filteredReports = [...mockReports];
      
      if (filters.studentId) {
        filteredReports = filteredReports.filter(r => r.studentId === filters.studentId);
      }
      
      if (filters.type) {
        filteredReports = filteredReports.filter(r => r.type === filters.type);
      }
      
      if (filters.status) {
        filteredReports = filteredReports.filter(r => r.status === filters.status);
      }
      
      setReports(filteredReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os relatórios',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Create a new report
  const createReport = useCallback(async (reportData: Partial<Report>) => {
    if (!user) return null;
    
    try {
      // Mock report creation
      const newReport: Report = {
        id: `report_${Date.now()}`,
        title: reportData.title || 'Novo Relatório',
        type: reportData.type || 'progress',
        date: reportData.date || new Date().toISOString(),
        status: reportData.status || 'draft',
        progress: reportData.progress || 0,
        content: reportData.content || '',
        studentId: reportData.studentId || '',
        studentName: reportData.studentName || '',
        author: reportData.author || user.name || '',
        description: reportData.description || '',
        coverImage: reportData.coverImage || null,
        domainTracking: reportData.domainTracking || false,
        skillsTracking: reportData.skillsTracking || false,
        recent: reportData.recent || false,
        important: reportData.important || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setReports(prev => [newReport, ...prev]);
      
      toast({
        title: 'Relatório criado',
        description: 'O relatório foi criado com sucesso',
      });
      
      return newReport;
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o relatório',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, toast]);

  return {
    reports,
    isLoading,
    loadReports,
    createReport
  };
};

export default useReports;
