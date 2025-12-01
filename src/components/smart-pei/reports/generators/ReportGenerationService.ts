
import { AIReportGenerationOptions, generateAIReport } from '@/utils/ai-service';
import { AssessmentForm } from '@/types/assessment';
import { PEI } from '@/hooks/usePEI';
import { Report, ReportType, toReportType } from '@/types/report';
import { v4 as uuidv4 } from 'uuid';

// Define the expected shape for the generateAIReport function
interface ReportGenerationRequest {
  studentId: string;
  studentName: string;
  reportType: ReportType;
  period?: string;
  includeGraphs?: boolean;
  options: AIReportGenerationOptions;
}

export const generateReportContent = async (
  pei: PEI | null, 
  assessment: AssessmentForm | null, 
  options: AIReportGenerationOptions,
  studentId?: string,
  studentName?: string,
  reportType: ReportType = 'progress'
): Promise<string> => {
  // In a real implementation, this would use actual data from the PEI and assessment
  
  // Create a request to generate the report with data from PEI and assessment
  const mockStudentId = studentId || pei?.studentId || assessment?.studentId || 'student_123';
  const mockStudentName = studentName || pei?.studentName || assessment?.studentName || 'Aluno Exemplo';
  
  try {
    const request: ReportGenerationRequest = {
      studentId: mockStudentId,
      studentName: mockStudentName,
      reportType: reportType,
      period: options.period || 'month',
      includeGraphs: options.includeVisualData,
      options
    };
    
    // Call the AI service to generate the report
    const reportContent = await generateAIReport(request);
    return reportContent;
  } catch (error) {
    console.error('Error generating report content:', error);
    throw new Error('Falha ao gerar o conteúdo do relatório');
  }
};

export const createReportFromTemplate = async (
  templateId: string,
  title: string,
  studentId: string,
  studentName: string,
  aiOptions: AIReportGenerationOptions,
  assessmentData?: AssessmentForm | null,
  peiData?: PEI | null
): Promise<Report> => {
  // Map template ID to report type
  const reportTypeMap: Record<string, ReportType> = {
    'pei-complete': 'pei-complete',
    'monthly-progress': 'monthly-progress',
    'quarterly-report': 'quarterly-report',
    'biannual-report': 'progress',
    'yearly-report': 'assessment',
    'comprehensive-report': 'complete',
    'team-report': 'team',
    'custom-report': 'custom'
  };
  
  const reportType = reportTypeMap[templateId] || 'custom';
  
  try {
    // Generate content
    const content = await generateReportContent(
      peiData, 
      assessmentData, 
      aiOptions, 
      studentId, 
      studentName, 
      reportType
    );
    
    // Create report object
    const report: Report = {
      id: uuidv4(),
      title,
      type: reportType,
      date: new Date().toISOString(),
      status: 'draft',
      progress: 100,
      content,
      studentId,
      studentName,
      author: 'Sistema Smart PEI',
      description: `Relatório gerado com base em ${assessmentData ? 'avaliação' : ''} ${assessmentData && peiData ? 'e' : ''} ${peiData ? 'PEI' : ''}.`,
      domainTracking: true,
      skillsTracking: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return report;
  } catch (error) {
    console.error('Error creating report from template:', error);
    throw new Error('Falha ao criar relatório a partir do modelo');
  }
};

export default { generateReportContent, createReportFromTemplate };
