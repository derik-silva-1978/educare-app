import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import useSmartPEI from '@/hooks/useSmartPEI';
import { PEI, PEIGoal } from './usePEI';
import { AssessmentDomain } from '../types/assessment';

interface PEIAIAssistanceOptions {
  studentId?: string;
  assessmentId?: string;
}

// Define the domains that match both our extended type and the PEIGoal type
type SupportedDomain = 'comunicacao' | 'socioemocional' | 'academico' | 'motor' | 'cognitivo' | 'autonomia';

// Make domain required in this interface
interface ExtendedPEIGoal {
  domain: SupportedDomain;
  title?: string;
  description?: string;
  evaluationMethod?: string;
}

export const usePEIAIAssistance = (options: PEIAIAssistanceOptions = {}) => {
  const { studentId, assessmentId } = options;
  const { toast } = useToast();
  const { showNotification } = useSmartPEI();
  const [isLoading, setIsLoading] = useState(false);
  
  const simulateAIResponse = async <T,>(data: T, delay: number = 1200): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  };

  const generateTitleSuggestions = async (): Promise<string> => {
    setIsLoading(true);
    try {
      const title = "PEI 2023-2024: Desenvolvimento de Habilidades Sociais e Acadêmicas";
      
      return await simulateAIResponse(title);
    } catch (error) {
      console.error('Error generating title suggestions:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar sugestões de título',
        variant: 'destructive'
      });
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummarySuggestions = async (): Promise<string> => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      // For demo purposes, we'll simulate the response
      const summary = "Este PEI foca no desenvolvimento de habilidades sociais e acadêmicas, com ênfase em comunicação expressiva, interação com pares e habilidades de leitura. As estratégias incluem abordagens multissensoriais e suporte visual para promover autonomia e participação ativa em sala de aula.";
      
      return await simulateAIResponse(summary);
    } catch (error) {
      console.error('Error generating summary suggestions:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar sugestões de resumo',
        variant: 'destructive'
      });
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  const suggestTeamMembers = async (): Promise<string[]> => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      // For demo purposes, we'll simulate the response
      const members = [
        "Professor(a) da sala regular",
        "Especialista em Educação Especial",
        "Psicólogo(a) Escolar",
        "Fonoaudiólogo(a)",
        "Terapeuta Ocupacional"
      ];
      
      return await simulateAIResponse(members);
    } catch (error) {
      console.error('Error suggesting team members:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível sugerir membros da equipe',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const suggestGoals = async (): Promise<ExtendedPEIGoal[]> => {
    setIsLoading(true);
    try {
      const goals: ExtendedPEIGoal[] = [
        {
          domain: "comunicacao",
          title: "Desenvolvimento de habilidades comunicativas expressivas",
          description: "Ampliar o repertório comunicativo utilizando suportes visuais e estratégias multimodais para expressão de necessidades, preferências e ideias.",
          evaluationMethod: "Observação direta, registros de frequência e qualidade das iniciativas comunicativas em diferentes contextos."
        },
        {
          domain: "socioemocional",
          title: "Fortalecimento de interações sociais com pares",
          description: "Desenvolver habilidades de interação social em pequenos grupos, respeitando turnos e demonstrando interesse nas atividades compartilhadas.",
          evaluationMethod: "Escala de observação comportamental, feedback dos professores e registros de participação em atividades em grupo."
        },
        {
          domain: "academico",
          title: "Aprimoramento da compreensão leitora",
          description: "Desenvolver estratégias de compreensão textual com apoio de recursos visuais e adaptações de material didático.",
          evaluationMethod: "Avaliações específicas de leitura, atividades de reconto e interpretação com suportes visuais."
        }
      ];
      
      return await simulateAIResponse(goals);
    } catch (error) {
      console.error('Error suggesting goals:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível sugerir objetivos',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const suggestStrategies = async (goal: ExtendedPEIGoal): Promise<Record<string, string>[]> => {
    setIsLoading(true);
    try {
      let strategies: Record<string, string>[] = [];
      
      if (goal.domain === "comunicacao") {
        strategies = [
          {
            description: "Implementar um sistema de comunicação por imagens (PECS) para apoiar a expressão de necessidades básicas.",
            resources: "Cartões de comunicação, pasta PECS, velcro, imagens personalizadas",
            responsible: "Fonoaudiólogo e Professor de AEE",
            frequency: "Diária (momentos estruturados)"
          },
          {
            description: "Utilizar histórias sociais para antecipar e explicar situações comunicativas relevantes.",
            resources: "Histórias sociais impressas, aplicativos de criação de histórias sociais",
            responsible: "Professor regente e Psicólogo",
            frequency: "Semanal (situações novas)"
          }
        ];
      } else if (goal.domain === "socioemocional") {
        strategies = [
          {
            description: "Criar oportunidades de interação em pequenos grupos com atividades estruturadas e mediadas.",
            resources: "Jogos cooperativos, atividades de interesse do aluno",
            responsible: "Professor regente",
            frequency: "3 vezes por semana"
          },
          {
            description: "Implementar sistema de apoio entre pares (buddy system) com rodízio de colegas parceiros.",
            resources: "Quadro de parceiros, guia de orientação para colegas",
            responsible: "Professor regente e Coordenador pedagógico",
            frequency: "Diariamente"
          }
        ];
      } else if (goal.domain === "academico") {
        strategies = [
          {
            description: "Adaptar textos com recursos visuais complementares e vocabulário de apoio destacado.",
            resources: "Textos adaptados, imagens de apoio, dicionário ilustrado personalizado",
            responsible: "Professor AEE e Professor regente",
            frequency: "Em todas as atividades de leitura"
          },
          {
            description: "Utilizar mapas mentais e organizadores gráficos para apoiar a compreensão textual.",
            resources: "Templates de organizadores gráficos, software de criação de mapas mentais",
            responsible: "Professor regente",
            frequency: "Semanalmente"
          }
        ];
      }
      
      return await simulateAIResponse(strategies);
    } catch (error) {
      console.error('Error suggesting strategies:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível sugerir estratégias',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const validatePEIAlignment = async (pei: PEI): Promise<{score: number, feedback: string[]}> => {
    setIsLoading(true);
    try {
      const validation = {
        score: 85,
        feedback: [
          "Excelente alinhamento com os campos de experiência da BNCC para o desenvolvimento linguístico.",
          "Objetivos bem estruturados seguindo o modelo SMART (específicos, mensuráveis, atingíveis, relevantes e temporais).",
          "Sugestão: Fortalecer a conexão entre os objetivos acadêmicos e as competências gerais da BNCC.",
          "Recomendação: Incluir mais estratégias relacionadas à cultura digital e tecnologias assistivas para ampliar o acesso ao currículo."
        ]
      };
      
      return await simulateAIResponse(validation);
    } catch (error) {
      console.error('Error validating PEI alignment:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível validar o alinhamento do PEI',
        variant: 'destructive'
      });
      return {score: 0, feedback: []};
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateTitleSuggestions,
    generateSummarySuggestions,
    suggestTeamMembers,
    suggestGoals,
    suggestStrategies,
    validatePEIAlignment
  };
};

export default usePEIAIAssistance;
