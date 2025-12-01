
import { Assessment, AssessmentResponse, AnamneseQuestion } from '@/types/assessment';

/**
 * Normalize Assessment object to ensure compatibility with different formats
 * @param assessment The assessment object to normalize
 * @returns Normalized assessment
 */
export const normalizeAssessment = (assessment: Assessment): Assessment => {
  // Ensure both versions of student ID are available
  if (assessment.studentId && !assessment.student_id) {
    assessment.student_id = assessment.studentId;
  } else if (assessment.student_id && !assessment.studentId) {
    assessment.studentId = assessment.student_id;
  }
  
  // Ensure both versions of student name are available
  if (assessment.studentName && !assessment.student_name) {
    assessment.student_name = assessment.studentName;
  } else if (assessment.student_name && !assessment.studentName) {
    assessment.studentName = assessment.student_name;
  }
  
  // Ensure both versions of user ID are available
  if (assessment.userId && !assessment.user_id) {
    assessment.user_id = assessment.userId;
  } else if (assessment.user_id && !assessment.userId) {
    assessment.userId = assessment.user_id;
  }
  
  // Ensure both versions of created date are available
  if (assessment.createdAt && !assessment.created_at) {
    assessment.created_at = assessment.createdAt;
  } else if (assessment.created_at && !assessment.createdAt) {
    assessment.createdAt = assessment.created_at;
  }
  
  // Ensure both versions of updated date are available
  if (assessment.updatedAt && !assessment.updated_at) {
    assessment.updated_at = assessment.updatedAt;
  } else if (assessment.updated_at && !assessment.updatedAt) {
    assessment.updatedAt = assessment.updated_at;
  }
  
  return assessment;
};

/**
 * Normalize AssessmentResponse object to ensure compatibility with different formats
 * @param response The response object to normalize
 * @returns Normalized response
 */
export const normalizeResponse = (response: AssessmentResponse): AssessmentResponse => {
  // Ensure both versions of question ID are available
  if (response.questionId && !response.question_id) {
    response.question_id = response.questionId;
  } else if (response.question_id && !response.questionId) {
    response.questionId = response.question_id;
  }
  
  return response;
};

/**
 * Normalize AnamneseQuestion object to ensure compatibility with different formats
 * @param question The question object to normalize
 * @returns Normalized question
 */
export const normalizeAnamneseQuestion = (question: AnamneseQuestion): AnamneseQuestion => {
  // Add any necessary compatibility conversions here
  return {
    ...question,
    type: question.type || 'default'
  };
};
