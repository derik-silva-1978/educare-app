import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
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
  session_id: string;
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

  // Buscar relatórios existentes
  const fetchReports = async (childId?: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      let query = (supabase as any)
        .from('child_development_reports')
        .select(`
          *,
          educare_children!inner(name)
        `)
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false });

      if (childId) {
        query = query.eq('child_id', childId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const reportsWithChildName = data?.map(report => ({
        ...report,
        child_name: report.educare_children?.name
      })) || [];

      setReports(reportsWithChildName);
    } catch (err: any) {
      console.error('Erro ao buscar relatórios:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar relatório automático após completar sessão
  const generateReport = async (data: ReportGenerationData) => {
    if (!user) return null;

    try {
      setIsLoading(true);

      // Calcular scores por dimensão
      const dimensionScores: Record<string, number> = {};
      const dimensionCounts: Record<string, number> = {};

      data.responses.forEach(response => {
        if (!dimensionScores[response.dimension]) {
          dimensionScores[response.dimension] = 0;
          dimensionCounts[response.dimension] = 0;
        }
        
        // Converter resposta para score (1=Sim=100%, 2=Às vezes=50%, 3=Não=0%)
        const score = response.answer === 1 ? 100 : response.answer === 2 ? 50 : 0;
        dimensionScores[response.dimension] += score;
        dimensionCounts[response.dimension] += 1;
      });

      // Calcular médias por dimensão
      Object.keys(dimensionScores).forEach(dimension => {
        dimensionScores[dimension] = Math.round(
          dimensionScores[dimension] / dimensionCounts[dimension]
        );
      });

      // Calcular score geral
      const overallScore = Math.round(
        Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / 
        Object.keys(dimensionScores).length
      );

      // Gerar recomendações baseadas nos scores
      const recommendations: string[] = [];
      const concerns: string[] = [];

      Object.entries(dimensionScores).forEach(([dimension, score]) => {
        if (score < 50) {
          concerns.push(`Área de atenção: ${getDimensionName(dimension)} (${score}%)`);
          recommendations.push(`Estimule atividades de ${getDimensionName(dimension).toLowerCase()}`);
        } else if (score >= 80) {
          recommendations.push(`Excelente desenvolvimento em ${getDimensionName(dimension).toLowerCase()}`);
        }
      });

      // Determinar faixa etária
      const ageRangeMonths = `${Math.floor(data.child_age / 12)}a${data.child_age % 12}m`;

      const reportData = {
        child_id: data.child_id,
        user_id: user.id,
        session_id: data.session_id,
        age_range_months: ageRangeMonths,
        total_questions: data.responses.length,
        answered_questions: data.responses.length,
        completion_percentage: 100,
        overall_score: overallScore,
        dimension_scores: dimensionScores,
        recommendations,
        concerns,
        report_data: {
          responses: data.responses,
          generation_date: new Date().toISOString(),
          child_age_months: data.child_age
        }
      };

      const { data: newReport, error } = await (supabase as any)
        .from('child_development_reports')
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Relatório de desenvolvimento gerado com sucesso!');
      
      // Atualizar lista de relatórios
      await fetchReports();
      
      return newReport;
    } catch (err: any) {
      console.error('Erro ao gerar relatório:', err);
      toast.error('Erro ao gerar relatório de desenvolvimento');
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Compartilhar relatório com profissionais
  const shareWithProfessionals = async (reportId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('child_development_reports')
        .update({ shared_with_professionals: true })
        .eq('id', reportId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Relatório compartilhado com profissionais');
      await fetchReports();
    } catch (err: any) {
      console.error('Erro ao compartilhar relatório:', err);
      toast.error('Erro ao compartilhar relatório');
    }
  };

  // Utilitário para nome das dimensões
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