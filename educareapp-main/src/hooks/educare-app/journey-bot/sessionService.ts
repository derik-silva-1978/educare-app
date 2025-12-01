import { supabase } from '@/integrations/supabase/client';
import { JourneyBotSession, JourneyBotQuestion } from '@/types/journey-bot';

export class JourneyBotSessionService {
  static async fetchQuestions(childAgeInMonths: number): Promise<JourneyBotQuestion[]> {
    try {
      console.log('Fetching questions for age:', childAgeInMonths, 'months');
      
      // Use the DatabaseAdapter for consistent loading
      const questions = await import('@/data/journey-bot/adapters/DatabaseAdapter').then(
        module => module.DatabaseAdapter.getQuestionsForAge(childAgeInMonths)
      );
      
      console.log('Found questions using DatabaseAdapter:', questions.length);
      return questions;
      
    } catch (err: any) {
      console.error('Exception fetching questions:', err);
      throw new Error(`Erro ao carregar perguntas: ${err.message}`);
    }
  }

  static async fetchOrCreateSession(
    userId: string,
    childId: string,
    availableQuestions: JourneyBotQuestion[]
  ): Promise<JourneyBotSession | null> {
    try {
      // First, try to find an existing active session
      const { data: existingSessions, error: sessionError } = await supabase
        .from('journey_bot_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('child_id', childId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (sessionError) {
        console.error('Error fetching sessions:', sessionError);
        throw sessionError;
      }

      if (existingSessions && existingSessions.length > 0) {
        console.log('Found existing session:', existingSessions[0].id);
        return this.mapToTypedSession(existingSessions[0]);
      }

      // Create new session if none exists and we have questions
      if (availableQuestions.length === 0) {
        console.log('No questions available, cannot create session');
        return null;
      }

      console.log('Creating new session for child:', childId);
      
      const { data: newSession, error: createError } = await supabase
        .from('journey_bot_sessions')
        .insert({
          user_id: userId,
          child_id: childId,
          total_questions: availableQuestions.length,
          answered_questions: 0,
          status: 'active',
          session_data: {}
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating session:', createError);
        throw createError;
      }

      console.log('Created new session:', newSession.id);
      return this.mapToTypedSession(newSession);
      
    } catch (err: any) {
      console.error('Exception in fetchOrCreateSession:', err);
      throw new Error(`Erro ao criar sessão: ${err.message}`);
    }
  }

  private static mapToTypedSession(session: any): JourneyBotSession {
    return {
      ...session,
      status: session.status as 'active' | 'completed' | 'paused',
      completed_at: session.completed_at || null,
      current_dimension: session.current_dimension || null,
      session_data: (session.session_data as Record<string, any>) || {}
    };
  }
}