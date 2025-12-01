
import { DevelopmentDomain, AssessmentStatus, AssessmentLevel, Assessment, AssessmentItem, AssessmentResponse } from '@/types/assessment';

/**
 * This file provides utility functions to handle the transformation between client-side 
 * and server-side models when working with Supabase.
 */

/**
 * Creates a proxy that handles properties in both camelCase and snake_case formats.
 * Useful for Supabase integrations where server returns snake_case but client uses camelCase.
 */
export function createCompatibleObject<T>(obj: Record<string, any>): T {
  return new Proxy(obj, {
    get(target, prop) {
      if (typeof prop === 'string') {
        // Convert camelCase to snake_case for lookup
        const snakeCaseProp = prop.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        
        // Try getting the property directly
        if (prop in target) {
          return target[prop];
        }
        
        // Try snake_case version if camelCase doesn't exist
        if (snakeCaseProp in target) {
          return target[snakeCaseProp];
        }
        
        // Convert snake_case to camelCase for lookup
        const camelCaseProp = prop.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        
        // Try camelCase version if snake_case doesn't exist
        if (camelCaseProp in target) {
          return target[camelCaseProp];
        }
      }
      return undefined;
    },
    set(target, prop, value) {
      if (typeof prop === 'string') {
        target[prop] = value;
        
        // Also set the snake_case version
        const snakeCaseProp = prop.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        if (snakeCaseProp !== prop) {
          target[snakeCaseProp] = value;
        }
        
        // Also set the camelCase version
        const camelCaseProp = prop.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        if (camelCaseProp !== prop) {
          target[camelCaseProp] = value;
        }
      }
      return true;
    }
  }) as T;
}

/**
 * Convert a database assessment to client assessment.
 */
export function dbToClientAssessment(dbAssessment: any): Assessment {
  // Create an object with both camelCase and snake_case properties
  return createCompatibleObject<Assessment>({
    id: dbAssessment.id,
    title: dbAssessment.title,
    status: dbAssessment.status,
    student_id: dbAssessment.student_id,
    studentId: dbAssessment.student_id,
    student_name: dbAssessment.student_name,
    studentName: dbAssessment.student_name,
    domains: dbAssessment.domains || [],
    items: dbAssessment.items || [],
    observations: dbAssessment.observations || {},
    created_at: dbAssessment.created_at,
    createdAt: dbAssessment.created_at,
    updated_at: dbAssessment.updated_at,
    updatedAt: dbAssessment.updated_at,
    evaluator: dbAssessment.evaluator || '',
    date: dbAssessment.date || dbAssessment.created_at,
    childId: dbAssessment.student_id,
    childName: dbAssessment.student_name,
    childAgeMonths: dbAssessment.childAgeMonths || 0,
    progress: dbAssessment.progress || 0,
    completed: dbAssessment.status === 'completed',
    feedback: dbAssessment.feedback || '',
    user_id: dbAssessment.user_id || ''
  });
}

/**
 * Convert client assessment to database assessment.
 */
export function clientToDbAssessment(clientAssessment: Assessment): any {
  return {
    id: clientAssessment.id,
    title: clientAssessment.title,
    status: clientAssessment.status,
    student_id: clientAssessment.studentId || clientAssessment.student_id || clientAssessment.childId,
    student_name: clientAssessment.studentName || clientAssessment.student_name || clientAssessment.childName,
    domains: clientAssessment.domains,
    items: clientAssessment.items,
    observations: clientAssessment.observations,
    created_at: clientAssessment.createdAt || clientAssessment.created_at,
    updated_at: clientAssessment.updatedAt || clientAssessment.updated_at,
    evaluator: clientAssessment.evaluator,
    date: clientAssessment.date,
    progress: clientAssessment.progress,
    feedback: clientAssessment.feedback,
    user_id: clientAssessment.userId || clientAssessment.user_id
  };
}

/**
 * This function wraps any Supabase rpc call for "never" type constraint errors.
 * It's a workaround for TypeScript issues with Supabase RPC functions.
 */
export function safeRpcCall<T>(fn: Function, params: any): Promise<T> {
  // @ts-ignore: This is a workaround for TypeScript's constraints with Supabase RPC
  return fn(params) as Promise<T>;
}

export default {
  createCompatibleObject,
  dbToClientAssessment,
  clientToDbAssessment,
  safeRpcCall
};
