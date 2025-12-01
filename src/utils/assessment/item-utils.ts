
import { v4 as uuidv4 } from 'uuid';
import { AssessmentItem, DevelopmentDomain, AssessmentLevel, ResponseType } from '@/types/assessment';

/**
 * Create an empty assessment item with required fields
 */
export const createEmptyItem = (domain: DevelopmentDomain): AssessmentItem => {
  return {
    id: uuidv4(),
    domain,
    question: '',
    response: null,
    notes: '',
    level: null,
    completed: false,
    required: true,
    title: '',
    skill: '',
    description: '',
    text: ''
  };
};

/**
 * Ensure an assessment item has all required fields
 */
export const ensureValidItem = (item: Partial<AssessmentItem>): AssessmentItem => {
  return {
    id: item.id || uuidv4(),
    domain: item.domain || 'cognitive',
    question: item.question || item.text || '',
    response: item.response || null,
    notes: item.notes || '',
    level: item.level || null,
    completed: item.completed || false,
    required: item.required !== undefined ? item.required : true,
    title: item.title || item.skill || '',
    skill: item.skill || '',
    description: item.description || '',
    text: item.text || ''
  };
};

/**
 * Update an assessment item
 */
export const updateItem = (
  item: AssessmentItem, 
  updates: Partial<AssessmentItem>
): AssessmentItem => {
  return {
    ...item,
    ...updates,
    response: updates.response !== undefined ? updates.response : item.response,
    level: updates.level !== undefined ? updates.level : item.level,
    notes: updates.notes !== undefined ? updates.notes : item.notes,
    completed: updates.completed !== undefined ? updates.completed : item.completed
  };
};

export default {
  createEmptyItem,
  ensureValidItem,
  updateItem
};
