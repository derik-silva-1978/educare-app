
import { v4 as uuidv4 } from 'uuid';
import { Assessment, DevelopmentDomain, AssessmentItem, AssessmentLevel, AssessmentStatus } from '@/types/assessment';

export const useAssessmentUtils = () => {
  // Generate a new assessment item
  const generateAssessmentItem = (domain: DevelopmentDomain, title: string): AssessmentItem => {
    return {
      id: uuidv4(),
      domain,
      question: `Assessment for ${title}`,
      level: null as AssessmentLevel,
      notes: '',
      completed: false,
      title,
      skill: title,
      description: `Description for ${title}`,
      text: `Assessment for ${title}`,
      required: true,
      response: null // Adding required response field
    };
  };

  // Generate a set of items for all domains
  const generateItemsForDomains = (domains: DevelopmentDomain[]): AssessmentItem[] => {
    const items: AssessmentItem[] = [];
    
    domains.forEach(domain => {
      if (domain === 'cognitive') {
        items.push(
          generateAssessmentItem(domain, 'Memory'),
          generateAssessmentItem(domain, 'Attention'),
          generateAssessmentItem(domain, 'Problem Solving')
        );
      } else if (domain === 'motor') {
        items.push(
          generateAssessmentItem(domain, 'Fine Motor Skills'),
          generateAssessmentItem(domain, 'Gross Motor Skills'),
          generateAssessmentItem(domain, 'Balance')
        );
      } else if (domain === 'social') {
        items.push(
          generateAssessmentItem(domain, 'Interaction'),
          generateAssessmentItem(domain, 'Empathy'),
          generateAssessmentItem(domain, 'Cooperation')
        );
      } else {
        // Generic items for other domains
        items.push(
          generateAssessmentItem(domain, 'Basic Skills'),
          generateAssessmentItem(domain, 'Advanced Skills')
        );
      }
    });
    
    return items;
  };

  // Calculate progress for an assessment
  const calculateProgress = (assessment: Assessment): number => {
    if (!assessment.items || assessment.items.length === 0) {
      return 0;
    }
    
    const totalItems = assessment.items.length;
    const completedItems = assessment.items.filter(item => item.level !== null).length;
    
    return Math.round((completedItems / totalItems) * 100);
  };

  // Create an empty assessment form
  const createEmptyForm = (id: string, studentId: string): Assessment => {
    const timestamp = new Date().toISOString();
    const domains: DevelopmentDomain[] = ['motor', 'cognitive', 'language', 'social'];
    
    return {
      id,
      title: 'New Assessment',
      domains,
      items: generateItemsForDomains(domains),
      status: 'draft' as AssessmentStatus,
      progress: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      childId: studentId,
      studentId: studentId,
      studentName: '',
      observations: {},
      date: timestamp,
      // Required server fields
      student_id: studentId,
      student_name: '',
      evaluator: '',
      created_at: timestamp,
      updated_at: timestamp,
      user_id: '',
      // Additional fields
      childName: '',
      childAgeMonths: 0,
      completed: false,
      feedback: ''
    };
  };

  return {
    generateAssessmentItem,
    generateItemsForDomains,
    calculateProgress,
    createEmptyForm
  };
};

export default useAssessmentUtils;
