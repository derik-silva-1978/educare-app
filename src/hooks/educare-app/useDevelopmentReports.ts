import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';

export const useDevelopmentReports = (childId: string) => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch existing reports from journey bot sessions
  const fetchReports = async () => {
    if (!user || !childId) return;

    try {
      setIsLoading(true);
      
      // Get completed journey bot sessions as reports
      const { data: sessionsData, error } = await supabase
        .from('journey_bot_sessions')
        .select('*')
        .eq('child_id', childId)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os relatórios.',
          variant: 'destructive',
        });
        return;
      }

      // Transform sessions into report format
      const transformedReports = await Promise.all((sessionsData || []).map(async (session) => {
        // Get responses for this session
        const { data: responses } = await supabase
          .from('journey_bot_responses')
          .select('*')
          .eq('session_id', session.id);

        // Calculate dimension scores from responses
        const dimensionScores: { [key: string]: number } = {};
        const dimensionCounts: { [key: string]: number } = {};

        (responses || []).forEach((response: any) => {
          const dimension = response.dimension;
          if (!dimensionScores[dimension]) {
            dimensionScores[dimension] = 0;
            dimensionCounts[dimension] = 0;
          }
          
          const scoreValue = response.answer === 0 ? 0 : response.answer === 1 ? 50 : 100;
          dimensionScores[dimension] += scoreValue;
          dimensionCounts[dimension]++;
        });

        Object.keys(dimensionScores).forEach(dimension => {
          if (dimensionCounts[dimension] > 0) {
            dimensionScores[dimension] = dimensionScores[dimension] / dimensionCounts[dimension];
          }
        });

        const overallScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / Math.max(Object.keys(dimensionScores).length, 1);

        // Extract report data from session_data if available
        const reportData = session.session_data?.report_data || {};

        return {
          id: session.id,
          generated_at: session.completed_at,
          overall_score: reportData.overall_score || overallScore,
          dimension_scores: reportData.dimension_scores || dimensionScores,
          completion_percentage: (session.answered_questions / session.total_questions) * 100,
          answered_questions: session.answered_questions,
          total_questions: session.total_questions,
          concerns: reportData.concerns || [],
          recommendations: reportData.recommendations || [],
          status: 'complete'
        };
      }));

      setReports(transformedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao carregar relatórios.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate standard report based on journey bot responses
  const generateStandardReport = async () => {
    if (!user || !childId) return;

    try {
      setIsLoading(true);

      // Get the latest completed session for this child
      const { data: sessions, error: sessionsError } = await supabase
        .from('journey_bot_sessions')
        .select('*')
        .eq('child_id', childId)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1);

      if (sessionsError) {
        throw sessionsError;
      }

      if (!sessions || sessions.length === 0) {
        toast({
          title: 'Avaliação necessária',
          description: 'É necessário completar uma avaliação do TitiNauta antes de gerar um relatório.',
          variant: 'destructive',
        });
        return;
      }

      const latestSession = sessions[0];

      // Get responses from the latest session
      const { data: responses, error: responsesError } = await supabase
        .from('journey_bot_responses')
        .select('*')
        .eq('session_id', latestSession.id)
        .eq('user_id', user.id);

      if (responsesError) {
        throw responsesError;
      }

      // Calculate dimension scores
      const dimensionScores: { [key: string]: number } = {};
      const dimensionCounts: { [key: string]: number } = {};

      responses?.forEach((response) => {
        const dimension = response.dimension;
        if (!dimensionScores[dimension]) {
          dimensionScores[dimension] = 0;
          dimensionCounts[dimension] = 0;
        }
        
        // Convert answer to percentage (0=0%, 1=50%, 2=100%)
        const scoreValue = response.answer === 0 ? 0 : response.answer === 1 ? 50 : 100;
        dimensionScores[dimension] += scoreValue;
        dimensionCounts[dimension]++;
      });

      // Calculate average scores for each dimension
      Object.keys(dimensionScores).forEach(dimension => {
        if (dimensionCounts[dimension] > 0) {
          dimensionScores[dimension] = dimensionScores[dimension] / dimensionCounts[dimension];
        }
      });

      // Calculate overall score
      const overallScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / Object.keys(dimensionScores).length;

      // Generate concerns and recommendations
      const concerns: string[] = [];
      const recommendations: string[] = [];

      Object.entries(dimensionScores).forEach(([dimension, score]) => {
        if (score < 50) {
          concerns.push(`Desenvolvimento ${dimension.replace('_', ' ')} requer atenção especial`);
          recommendations.push(`Estimular atividades relacionadas ao desenvolvimento ${dimension.replace('_', ' ')}`);
        } else if (score < 75) {
          recommendations.push(`Continuar estimulando o desenvolvimento ${dimension.replace('_', ' ')}`);
        }
      });

      // Get child's age in months for age_range_months
      const { data: childData } = await supabase
        .from('educare_children')
        .select('birthdate')
        .eq('id', childId)
        .single();

      let ageInMonths = 0;
      if (childData?.birthdate) {
        const birthDate = new Date(childData.birthdate);
        const currentDate = new Date();
        ageInMonths = Math.floor((currentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
      }

      // Mark session as having a generated report (we can use session_data field)
      const updatedSessionData = {
        ...latestSession.session_data,
        report_generated: true,
        report_data: {
          overall_score: overallScore,
          dimension_scores: dimensionScores,
          concerns: concerns,
          recommendations: recommendations,
          age_range_months: `${ageInMonths} meses`
        }
      };

      const { error: updateError } = await supabase
        .from('journey_bot_sessions')
        .update({ 
          session_data: updatedSessionData
        })
        .eq('id', latestSession.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh reports list
      await fetchReports();

      toast({
        title: 'Sucesso',
        description: 'Relatório gerado com sucesso!',
      });

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o relatório.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (childId && user) {
      fetchReports();
    }
  }, [childId, user]);

  return {
    reports,
    isLoading,
    generateStandardReport,
    refreshReports: fetchReports
  };
};