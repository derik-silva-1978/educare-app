import { useState, useEffect } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { httpClient } from '@/services/api/httpClient';
import { toast } from 'sonner';

interface DevelopmentReport {
  id: string;
  child_id: string;
  session_id: string;
  age_range_months: string;
  total_questions: number;
  answered_questions: number;
  completion_percentage: number;
  overall_score: number;
  dimension_scores: Record<string, number>;
  recommendations: string[];
  concerns: string[];
  report_data: any;
  status: string;
  generated_at: string;
  shared_with_professionals: boolean;
  child_name?: string;
}

interface ReportGenerationData {
  session_id?: string;
  child_id: string;
  responses: Array<{
    question_id: string;
    dimension: string;
    answer: number;
    answer_text: string;
    question_text: string;
  }>;
  child_age: number;
}

export function useJourneyBotReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<DevelopmentReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (childId?: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = childId ? `?childId=${childId}` : '';
      const response = await httpClient.get(`/development-reports${params}`);
      
      const reportsData = response.data.reports || [];
      setReports(reportsData);
    } catch (err: any) {
      console.error('Erro ao buscar relatórios:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (data: ReportGenerationData) => {
    if (!user) return null;

    try {
      setIsLoading(true);

      const response = await httpClient.post('/development-reports/generate', {
        session_id: data.session_id,
        child_id: data.child_id,
        responses: data.responses,
        child_age: data.child_age
      });

      if (response.data.success) {
        toast.success('Relatório de desenvolvimento gerado com sucesso!');
        await fetchReports();
        return response.data.report;
      }
      
      return null;
    } catch (err: any) {
      console.error('Erro ao gerar relatório:', err);
      toast.error('Erro ao gerar relatório de desenvolvimento');
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const shareWithProfessionals = async (reportId: string) => {
    try {
      const response = await httpClient.patch(`/development-reports/${reportId}/share`, {});

      if (response.data.success) {
        toast.success('Relatório compartilhado com profissionais');
        await fetchReports();
      }
    } catch (err: any) {
      console.error('Erro ao compartilhar relatório:', err);
      toast.error('Erro ao compartilhar relatório');
    }
  };

  const getDimensionName = (dimension: string): string => {
    const names: Record<string, string> = {
      'motor_grosso': 'Motor Grosso',
      'motor_fino': 'Motor Fino', 
      'linguagem': 'Linguagem',
      'cognitivo': 'Cognitivo',
      'social_emocional': 'Social-Emocional',
      'autocuidado': 'Autocuidado'
    };
    return names[dimension] || dimension;
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  return {
    reports,
    isLoading,
    error,
    fetchReports,
    generateReport,
    shareWithProfessionals,
    getDimensionName
  };
}