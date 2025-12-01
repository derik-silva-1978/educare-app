
import { supabase } from '@/integrations/supabase/client';
import { AssessmentItem, Assessment, AssessmentStatus, DevelopmentDomain } from '@/types/assessment';
import type { Database } from '@/types/supabase-schema';
import type { Json } from '@/types/supabase-schema';
import { dbToClientAssessment, clientToDbAssessment, createCompatibleObject } from './supabase-type-helper';
import { safeTableQuery, safeTableInsert } from './supabase-rpc-utils';

// Type alias for easier reference
type AssessmentRow = Database['public']['Tables']['assessments']['Row'];

// Define a type for JSON serializable objects to avoid circular import
type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

// Convert database objects to app objects
export const mapDbAssessmentItem = (item: any): AssessmentItem => {
  return {
    id: item.id,
    domain: item.domain,
    question: item.text || item.skill || 'Untitled question',
    skill: item.skill,
    description: item.description,
    text: item.text,
    level: item.level,
    notes: item.notes || '',
    completed: item.completed || false,
    required: item.required || false,
    title: item.title || item.skill,
    response: item.response || null // Ensure the response field is present
  };
};

// Convert app objects to database format
export const mapAssessmentItemToDb = (item: AssessmentItem): any => {
  return {
    id: item.id,
    domain: item.domain,
    text: item.question,
    skill: item.skill,
    description: item.description,
    level: item.level,
    notes: item.notes,
    completed: item.completed,
    required: item.required,
    title: item.title,
    response: item.response
  };
};

// Save assessment to Supabase
export const saveAssessmentToSupabase = async (assessment: Assessment): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    // Convert assessment items to JSON-serializable format
    const jsonItems = assessment.items.map(item => mapAssessmentItemToDb(item));
    
    // Prepare data for Supabase using the helper function
    const dbAssessment = clientToDbAssessment(assessment);
    dbAssessment.items = jsonItems;
    
    // Use the safe insert utility
    const { error } = await safeTableInsert(supabase, 'assessments', dbAssessment);
    
    if (error) {
      console.error('Error saving assessment:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveAssessmentToSupabase:', error);
    return false;
  }
};

// Load assessment from Supabase
export const loadAssessmentFromSupabase = async (id: string): Promise<Assessment | null> => {
  if (!supabase) return null;
  
  try {
    // Use the safe query utility
    const query = safeTableQuery(supabase, 'assessments');
    const { data: assessmentData, error: assessmentError } = await query
      .select('*')
      .eq('id', id)
      .single();
    
    if (assessmentError || !assessmentData) {
      console.error('Error loading assessment:', assessmentError);
      return null;
    }
    
    // Extract items and observations with safer checks
    let items: AssessmentItem[] = extractItems(assessmentData);
    let observations: Record<string, string> = extractObservations(assessmentData);
    
    // Use the helper to create a compatible assessment object
    const clientAssessment = createCompatibleObject<Assessment>({
      id: assessmentData?.id || '',
      title: assessmentData?.title || '',
      childId: assessmentData?.student_id || '',
      status: (assessmentData?.status as AssessmentStatus) || 'draft',
      domains: (assessmentData?.domains as DevelopmentDomain[]) || [],
      items: items,
      observations: observations,
      progress: calculateProgress(items),
      student_id: assessmentData?.student_id || '',
      student_name: assessmentData?.student_name || '',
      studentId: assessmentData?.student_id || '',
      studentName: assessmentData?.student_name || '',
      childName: assessmentData?.student_name || '',
      evaluator: assessmentData?.evaluator || '',
      date: assessmentData?.date || assessmentData?.created_at || '',
      created_at: assessmentData?.created_at || '',
      updated_at: assessmentData?.updated_at || '',
      createdAt: assessmentData?.created_at || '',
      updatedAt: assessmentData?.updated_at || '',
      completed: assessmentData?.status === 'completed',
      user_id: assessmentData?.user_id || ''
    });
    
    return clientAssessment;
  } catch (error) {
    console.error('Error in loadAssessmentFromSupabase:', error);
    return null;
  }
};

// Helper function to safely extract items
function extractItems(assessmentData: any): AssessmentItem[] {
  if (!assessmentData?.items) return [];
  
  try {
    const rawItems = Array.isArray(assessmentData.items) 
      ? assessmentData.items 
      : [];
      
    return rawItems.map((item: any) => ({
      id: item.id || '',
      domain: item.domain || 'cognitive',
      question: item.text || item.question || '',
      skill: item.skill || '',
      description: item.description || '',
      text: item.text || '',
      level: item.level || null,
      notes: item.notes || '',
      completed: item.completed || false,
      required: item.required || false,
      title: item.title || item.skill || '',
      response: item.response || null
    }));
  } catch (error) {
    console.error('Error parsing assessment items:', error);
    return [];
  }
}

// Helper function to safely extract observations
function extractObservations(assessmentData: any): Record<string, string> {
  const observations: Record<string, string> = {};
  
  if (assessmentData?.observations && typeof assessmentData.observations === 'object') {
    Object.keys(assessmentData.observations).forEach(key => {
      const value = assessmentData.observations[key];
      observations[key] = typeof value === 'string' ? value : String(value);
    });
  }
  
  return observations;
}

// Calculate assessment progress
const calculateProgress = (items: AssessmentItem[]): number => {
  if (!items || items.length === 0) return 0;
  
  const completedItems = items.filter(item => item.level !== null).length;
  return Math.round((completedItems / items.length) * 100);
};

// Export this function as it's used elsewhere
export { calculateProgress };
