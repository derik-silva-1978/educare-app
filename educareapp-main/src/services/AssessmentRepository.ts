
import { Assessment, AssessmentForm, AssessmentItem, AssessmentStatus } from '@/types/assessment';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { safeTableQuery, safeTableInsert } from '@/utils/supabase-rpc-utils';
import { createCompatibleObject } from '@/utils/supabase-type-helper';

// Cache for assessments
const assessmentCache = new Map<string, Assessment>();

export interface SaveAssessmentResult {
  success: boolean;
  id: string;
  error?: string;
}

export class AssessmentRepository {
  /**
   * Get assessment by ID from cache or storage
   */
  static async getAssessment(id: string): Promise<Assessment | null> {
    // Check cache first
    if (assessmentCache.has(id)) {
      return assessmentCache.get(id) || null;
    }

    try {
      // Try to get from Supabase if it's configured
      if (supabase) {
        // Use our safe query utility
        const query = safeTableQuery(supabase, 'assessments');
        const { data, error } = await query.select('*').eq('id', id).single();

        if (error) {
          console.error('Error fetching assessment from Supabase:', error);
        } else if (data) {
          const assessment = this.mapDatabaseToAssessment(data);
          assessmentCache.set(id, assessment);
          return assessment;
        }
      }

      // Fallback to localStorage
      const storedAssessment = localStorage.getItem(`assessment_${id}`);
      if (storedAssessment) {
        const assessment = JSON.parse(storedAssessment) as Assessment;
        // Ensure all required fields exist
        const compatibleAssessment = createCompatibleObject<Assessment>({
          ...assessment,
          student_id: assessment.studentId || assessment.student_id || '',
          student_name: assessment.studentName || assessment.student_name || '',
          created_at: assessment.createdAt || assessment.created_at || new Date().toISOString(),
          updated_at: assessment.updatedAt || assessment.updated_at || new Date().toISOString(),
          user_id: assessment.userId || assessment.user_id || ''
        });
        assessmentCache.set(id, compatibleAssessment);
        return compatibleAssessment;
      }

      return null;
    } catch (error) {
      console.error('Error getting assessment:', error);
      return null;
    }
  }

  /**
   * Save assessment to storage
   */
  static async saveAssessment(assessment: AssessmentForm): Promise<SaveAssessmentResult> {
    try {
      const timestamp = new Date().toISOString();
      // Make sure we have all the fields needed for the Assessment type
      const compatibleAssessment = createCompatibleObject<Assessment>({
        ...assessment,
        student_id: assessment.studentId || assessment.student_id || '',
        student_name: assessment.studentName || assessment.student_name || '',
        created_at: assessment.createdAt || assessment.created_at || timestamp,
        updated_at: timestamp,
        user_id: assessment.userId || assessment.user_id || ''
      });

      // Save to cache
      assessmentCache.set(compatibleAssessment.id, compatibleAssessment);

      // Try to save to Supabase if it's configured
      if (supabase) {
        // Use our safe insert utility
        const { error } = await safeTableInsert(
          supabase, 
          'assessments', 
          this.mapAssessmentToDatabase(compatibleAssessment)
        );

        if (error) {
          console.error('Error saving assessment to Supabase:', error);
        }
      }

      // Always save to localStorage as fallback
      localStorage.setItem(
        `assessment_${compatibleAssessment.id}`, 
        JSON.stringify(compatibleAssessment)
      );

      return {
        success: true,
        id: compatibleAssessment.id
      };
    } catch (error) {
      console.error('Error saving assessment:', error);
      return {
        success: false,
        id: assessment.id,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all assessments
   */
  static async getAllAssessments(): Promise<Assessment[]> {
    try {
      const assessments: Assessment[] = [];
      
      // Try to get from Supabase if it's configured
      if (supabase) {
        // Use our safe query utility
        const query = safeTableQuery(supabase, 'assessments');
        const { data, error } = await query.select('*').order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching assessments from Supabase:', error);
        } else if (data) {
          return data.map((item: any) => this.mapDatabaseToAssessment(item));
        }
      }

      // Fallback to localStorage
      const keys = Object.keys(localStorage).filter(key => key.startsWith('assessment_'));
      for (const key of keys) {
        const storedAssessment = localStorage.getItem(key);
        if (storedAssessment) {
          try {
            let assessment = JSON.parse(storedAssessment) as Assessment;
            // Ensure compatibility with the Assessment type
            assessment = createCompatibleObject<Assessment>({
              ...assessment,
              student_id: assessment.studentId || assessment.student_id || '',
              student_name: assessment.studentName || assessment.student_name || '',
              created_at: assessment.createdAt || assessment.created_at || '',
              updated_at: assessment.updatedAt || assessment.updated_at || '',
              user_id: assessment.userId || assessment.user_id || ''
            });
            assessments.push(assessment);
          } catch (e) {
            console.error('Error parsing assessment:', e);
          }
        }
      }

      return assessments.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } catch (error) {
      console.error('Error getting all assessments:', error);
      return [];
    }
  }

  /**
   * Create a new assessment
   */
  static createNewAssessment(data: Partial<Assessment>): Assessment {
    const timestamp = new Date().toISOString();
    // Create a compatible Assessment object
    return createCompatibleObject<Assessment>({
      id: data.id || uuidv4(),
      title: data.title || 'New Assessment',
      childName: data.childName || '',
      childId: data.childId || '',
      childAgeMonths: data.childAgeMonths || 0,
      date: data.date || timestamp,
      status: (data.status as AssessmentStatus) || 'draft',
      progress: data.progress || 0,
      completed: data.completed || false,
      domains: data.domains || [],
      feedback: data.feedback || '',
      studentId: data.studentId || data.childId || '',
      student_id: data.student_id || data.studentId || data.childId || '',
      studentName: data.studentName || data.childName || '',
      student_name: data.student_name || data.studentName || data.childName || '',
      evaluator: data.evaluator || '',
      observations: data.observations || {},
      items: data.items || [],
      updatedAt: timestamp,
      updated_at: timestamp,
      createdAt: timestamp,
      created_at: timestamp,
      user_id: data.user_id || data.userId || ''
    });
  }

  /**
   * Delete assessment by ID
   */
  static async deleteAssessment(id: string): Promise<boolean> {
    try {
      // Remove from cache
      assessmentCache.delete(id);

      // Try to delete from Supabase if it's configured
      if (supabase) {
        // Use our safe query utility
        const query = safeTableQuery(supabase, 'assessments');
        const { error } = await query.delete().eq('id', id);

        if (error) {
          console.error('Error deleting assessment from Supabase:', error);
        }
      }

      // Remove from localStorage
      localStorage.removeItem(`assessment_${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      return false;
    }
  }

  /**
   * Get assessments by student ID
   */
  static async getAssessmentsByStudentId(studentId: string): Promise<Assessment[]> {
    try {
      // Try to get from Supabase if it's configured
      if (supabase) {
        // Use our safe query utility
        const query = safeTableQuery(supabase, 'assessments');
        const { data, error } = await query
          .select('*')
          .eq('student_id', studentId)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching assessments from Supabase:', error);
        } else if (data) {
          return data.map((item: any) => this.mapDatabaseToAssessment(item));
        }
      }

      // Fallback to localStorage
      const allAssessments = await this.getAllAssessments();
      return allAssessments.filter(assessment => 
        assessment.studentId === studentId || assessment.student_id === studentId
      );
    } catch (error) {
      console.error('Error getting assessments by student ID:', error);
      return [];
    }
  }

  /**
   * Map database assessment to frontend assessment
   */
  private static mapDatabaseToAssessment(data: any): Assessment {
    return createCompatibleObject<Assessment>({
      id: data.id,
      title: data.title,
      childName: data.student_name || '',
      childId: data.student_id || '',
      childAgeMonths: data.child_age_months || 0,
      date: data.date || '',
      status: data.status || 'in_progress',
      progress: data.progress || 0,
      completed: data.status === 'completed',
      domains: data.domains || [],
      feedback: data.feedback || '',
      studentId: data.student_id || '',
      student_id: data.student_id || '',
      studentName: data.student_name || '',
      student_name: data.student_name || '',
      evaluator: data.evaluator || '',
      observations: data.observations || {},
      items: data.items || [],
      updatedAt: data.updated_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      createdAt: data.created_at || new Date().toISOString(),
      created_at: data.created_at || new Date().toISOString(),
      user_id: data.user_id || ''
    });
  }

  /**
   * Map frontend assessment to database assessment
   */
  private static mapAssessmentToDatabase(assessment: Assessment): any {
    return {
      id: assessment.id,
      title: assessment.title,
      student_id: assessment.student_id || assessment.studentId,
      student_name: assessment.student_name || assessment.studentName,
      child_age_months: assessment.childAgeMonths,
      evaluator: assessment.evaluator,
      date: assessment.date,
      status: assessment.status,
      progress: assessment.progress,
      domains: assessment.domains,
      feedback: assessment.feedback,
      observations: assessment.observations,
      items: assessment.items,
      updated_at: assessment.updated_at || assessment.updatedAt,
      created_at: assessment.created_at || assessment.createdAt,
      user_id: assessment.user_id
    };
  }

  /**
   * Calculate assessment progress
   */
  static calculateProgress(assessment: Assessment): number {
    if (!assessment.items || assessment.items.length === 0) {
      return 0;
    }

    const totalItems = assessment.items.length;
    const completedItems = assessment.items.filter(item => item.level !== null).length;
    
    return Math.round((completedItems / totalItems) * 100);
  }

  /**
   * Get completed domains
   */
  static getCompletedDomains(assessment: Assessment): Record<string, boolean> {
    const completedDomains: Record<string, boolean> = {};
    
    // Initialize all domains as not completed
    assessment.domains.forEach(domain => {
      completedDomains[domain] = false;
    });

    if (!assessment.items || assessment.items.length === 0) {
      return completedDomains;
    }

    // Group items by domain
    const itemsByDomain: Record<string, AssessmentItem[]> = {};
    assessment.items.forEach(item => {
      if (!itemsByDomain[item.domain]) {
        itemsByDomain[item.domain] = [];
      }
      itemsByDomain[item.domain].push(item);
    });

    // Check which domains are completed
    Object.entries(itemsByDomain).forEach(([domain, items]) => {
      const totalItems = items.length;
      const completedItems = items.filter(item => item.level !== null).length;
      
      // Domain is considered completed if all items have a level
      completedDomains[domain] = completedItems === totalItems;
    });

    return completedDomains;
  }
}
