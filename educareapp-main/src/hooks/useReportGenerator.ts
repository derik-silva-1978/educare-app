
import { useState, useEffect } from 'react';
import { AIReportGenerationOptions } from '@/utils/ai-service';
import { useToast } from '@/hooks/use-toast';
import { createReportFromTemplate, generateReportContent } from '@/components/smart-pei/reports/generators/ReportGenerationService';
import { ReportTemplateConfig } from '@/components/smart-pei/reports/templates/TemplateConfig';
import useSmartPEI from './useSmartPEI';
import { AssessmentForm } from '@/types/assessment';
import usePEI from './usePEI';
import useStudents from './useStudents';
import { Report } from '@/types/report';
import { useNavigate } from 'react-router-dom';
import useAssessmentStorage from './useAssessmentStorage';

export type ReportGeneratorStep = 'template' | 'configure' | 'preview';

export function useReportGenerator(onReportCreated?: () => void) {
  const [currentStep, setCurrentStep] = useState<ReportGeneratorStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplateConfig | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportSettings, setReportSettings] = useState({
    student: '',
    period: '',
    includeGraph: true,
    includeRecommendations: true,
    includeComparison: false,
    aiAnalysis: true
  });
  
  const [aiOptions, setAIOptions] = useState<AIReportGenerationOptions>({
    includeStrengths: true,
    includeWeaknesses: true,
    includeRecommendations: true,
    includeNextSteps: true,
    detailLevel: 'detailed',
    tone: 'supportive',
    targetAudience: 'all',
    includeVisualData: false,
    period: 'month',
    includeMilestoneComparison: false,
    includeResourceLinks: false,
    includeCrossAnalysis: false
  });
  
  const [assessmentId, setAssessmentId] = useState('');
  const [peiId, setPeiId] = useState('');
  const [generatedReport, setGeneratedReport] = useState('');
  const [createdReport, setCreatedReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [availableAssessments, setAvailableAssessments] = useState<AssessmentForm[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generateReport } = useSmartPEI();
  const { form } = useAssessment(assessmentId);
  const { pei } = usePEI(peiId);
  const { getStudents } = useStudents();
  const assessmentStorage = useAssessmentStorage();

  // Load available assessments when a student is selected
  useEffect(() => {
    if (reportSettings.student && reportSettings.student !== "select-student") {
      const loadAssessments = async () => {
        try {
          const allAssessments = await assessmentStorage.getAllAssessments();
          const studentAssessments = allAssessments.filter(
            assessment => assessment.studentId === reportSettings.student
          );
          setAvailableAssessments(studentAssessments);
        } catch (error) {
          console.error("Error loading assessments:", error);
        }
      };
      
      loadAssessments();
    }
  }, [reportSettings.student, assessmentStorage]);

  const handleTemplateSelect = (template: ReportTemplateConfig) => {
    setSelectedTemplate(template);
    setReportTitle(`${template.title} - ${new Date().toLocaleDateString('pt-BR')}`);
    setCurrentStep('configure');
  };

  const handleSettingChange = (setting: string, value: any) => {
    setReportSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleAssessmentSelect = (assessmentId: string) => {
    setAssessmentId(assessmentId);
  };

  const handleStudentSelect = (studentId: string) => {
    handleSettingChange('student', studentId);
    
    // Find PEI for this student
    const mockPeiId = 'pei_' + studentId;
    setPeiId(mockPeiId);
    
    // Reset assessment selection
    setAssessmentId('');
  };

  const handleGeneratePreview = async () => {
    if (!reportTitle || !reportSettings.student || !reportSettings.period) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast({
        title: "Gerando relatório",
        description: "A IA está processando os dados para gerar o relatório...",
      });
      
      // Update AI options with period from settings
      const updatedAIOptions = {
        ...aiOptions,
        period: reportSettings.period
      };
      
      // Generate report content
      const reportContent = await generateReportContent(
        pei, 
        form, 
        updatedAIOptions, 
        reportSettings.student, 
        getStudentName(reportSettings.student)
      );
      
      setGeneratedReport(reportContent);
      
      // Create full report object for saving later
      if (selectedTemplate) {
        const report = await createReportFromTemplate(
          selectedTemplate.id,
          reportTitle,
          reportSettings.student,
          getStudentName(reportSettings.student),
          updatedAIOptions,
          form,
          pei
        );
        
        setCreatedReport(report);
      }
      
      setPreviewReady(true);
      setCurrentStep('preview');
      
      toast({
        title: "Relatório gerado",
        description: "O relatório foi gerado com sucesso!",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o relatório",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveReport = (status: 'draft' | 'complete') => {
    if (!createdReport) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o relatório, dados incompletos",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, we would save to database
    // For now, just show a toast
    toast({
      title: status === 'draft' ? "Rascunho salvo" : "Relatório finalizado",
      description: status === 'draft' 
        ? "O rascunho do relatório foi salvo. Você pode continuar editando mais tarde." 
        : "O relatório foi finalizado e está disponível na lista de relatórios.",
    });
    
    if (onReportCreated) {
      onReportCreated();
    }
    
    // Navigate to reports list or report view
    if (status === 'complete') {
      navigate(`/smart-pei/report/${createdReport.id}`);
    } else {
      navigate('/smart-pei/reports');
    }
    
    resetForm();
  };
  
  const getStudentName = (studentId: string): string => {
    if (studentId === 'all') return 'Todos os Alunos';
    
    // Mock student names
    const studentNames: Record<string, string> = {
      'thiago': 'Thiago Henrique',
      'maria': 'Maria Eduarda',
      'joao': 'João Pedro',
      'sofia': 'Sofia Santos'
    };
    
    return studentNames[studentId] || studentId;
  };
  
  const resetForm = () => {
    setSelectedTemplate(null);
    setReportTitle('');
    setReportSettings({
      student: '',
      period: '',
      includeGraph: true,
      includeRecommendations: true,
      includeComparison: false,
      aiAnalysis: true
    });
    setAIOptions({
      includeStrengths: true,
      includeWeaknesses: true,
      includeRecommendations: true,
      includeNextSteps: true,
      detailLevel: 'detailed',
      tone: 'supportive',
      targetAudience: 'all',
      includeVisualData: false,
      period: 'month',
      includeMilestoneComparison: false,
      includeResourceLinks: false,
      includeCrossAnalysis: false
    });
    setGeneratedReport('');
    setCreatedReport(null);
    setPreviewReady(false);
    setCurrentStep('template');
  };

  return {
    currentStep,
    setCurrentStep,
    selectedTemplate,
    reportTitle,
    setReportTitle,
    reportSettings,
    aiOptions,
    setAIOptions,
    generatedReport,
    createdReport,
    isGenerating,
    previewReady,
    availableAssessments,
    handleTemplateSelect,
    handleSettingChange,
    handleStudentSelect,
    handleAssessmentSelect,
    handleGeneratePreview,
    handleSaveReport
  };
}

// Add missing import for useAssessment
import { useAssessment } from './useAssessment';

export default useReportGenerator;
