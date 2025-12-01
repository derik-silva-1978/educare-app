
import { ReactNode } from 'react';
import { FileText, BarChart2, GraduationCap, Calendar, Users, Layers, BookOpen, ChartBar } from 'lucide-react';
import { ReportType } from '@/types/report';

export interface ReportTemplateConfig {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  helpText: string;
  sections?: string[];
  domainTracking: boolean;
  skillsTracking: boolean;
}

export const getReportTemplates = (): ReportTemplateConfig[] => [
  // 1. PEI - Plano de Ensino Individualizado
  {
    id: 'pei-complete',
    title: 'Plano de Ensino Individualizado',
    description: 'Formato oficial para apresentação do PEI completo',
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    helpText: 'Documento oficial que contém todos os elementos do Plano de Ensino Individualizado, incluindo informações do aluno, equipe responsável, objetivos, estratégias e métodos de avaliação.',
    sections: ['Informações Gerais', 'Equipe', 'Objetivos', 'Estratégias', 'Avaliação'],
    domainTracking: true,
    skillsTracking: true
  },
  // 2. Relatório de Progresso Mensal
  {
    id: 'monthly-progress',
    title: 'Relatório de Progresso Mensal',
    description: 'Acompanhamento mensal do desenvolvimento do aluno',
    icon: <Calendar className="h-8 w-8 text-primary" />,
    helpText: 'Relatório mensal que documenta o progresso contínuo do aluno em seus objetivos de aprendizagem, destacando conquistas, desafios e ajustes necessários no curto prazo.',
    sections: ['Resumo', 'Progresso nos Domínios', 'Atividades Realizadas', 'Próximos Passos'],
    domainTracking: true,
    skillsTracking: true
  },
  // 3. Relatório de Progresso Trimestral
  {
    id: 'quarterly-report',
    title: 'Relatório de Progresso Trimestral',
    description: 'Formato resumido para entregas trimestrais aos pais e responsáveis',
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    helpText: 'Resumo trimestral do progresso do aluno, ideal para compartilhar com pais e responsáveis em reuniões periódicas. Inclui análise do desenvolvimento em cada domínio e recomendações.',
    sections: ['Resumo', 'Conquistas', 'Desafios', 'Recomendações'],
    domainTracking: true,
    skillsTracking: true
  },
  // 4. Relatório de Progresso Semestral
  {
    id: 'biannual-report',
    title: 'Relatório de Progresso Semestral',
    description: 'Análise aprofundada do desenvolvimento semestral',
    icon: <ChartBar className="h-8 w-8 text-primary" />,
    helpText: 'Documento semestral que avalia de forma aprofundada o progresso do aluno, revisa os objetivos do PEI e propõe ajustes para o próximo período. Inclui dados quantitativos e qualitativos.',
    sections: ['Resumo Executivo', 'Análise por Domínio', 'Revisão de Objetivos', 'Plano para Próximo Semestre'],
    domainTracking: true,
    skillsTracking: true
  },
  // 5. Relatório de Progresso Anual
  {
    id: 'yearly-report',
    title: 'Relatório de Progresso Anual',
    description: 'Avaliação completa do desenvolvimento anual',
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    helpText: 'Relatório anual abrangente que analisa todo o progresso do aluno durante o ano letivo, avalia a eficácia das intervenções e estabelece bases para o planejamento do próximo ano.',
    sections: ['Visão Geral Anual', 'Progresso nos Objetivos', 'Resultados de Avaliações', 'Recomendações para o Próximo Ano'],
    domainTracking: true,
    skillsTracking: true
  },
  // 6. Relatório de Progresso Abrangente
  {
    id: 'comprehensive-report',
    title: 'Relatório de Progresso Abrangente',
    description: 'Compilação completa de todos os dados e histórico do aluno',
    icon: <Layers className="h-8 w-8 text-primary" />,
    helpText: 'Documento abrangente que reúne todo o histórico acadêmico, terapêutico e de desenvolvimento do aluno. Ideal para transferências escolares, transições importantes ou documentação formal completa.',
    sections: ['Histórico Completo', 'Evolução por Períodos', 'Intervenções e Resultados', 'Recomendações de Longo Prazo'],
    domainTracking: true,
    skillsTracking: true
  },
  // 7. Relatório para Equipe (kept as additional option)
  {
    id: 'team-report',
    title: 'Relatório para Equipe',
    description: 'Compartilhamento com a equipe multidisciplinar',
    icon: <Users className="h-8 w-8 text-primary" />,
    helpText: 'Desenvolvido especificamente para comunicação entre membros da equipe multidisciplinar. Inclui informações técnicas e recomendações específicas para cada área de intervenção. Ideal para reuniões de equipe e planejamento colaborativo.',
    sections: ['Visão Geral', 'Contribuições por Especialidade', 'Discussão Integrada', 'Plano de Ação'],
    domainTracking: true,
    skillsTracking: true
  },
  // 8. Relatório Personalizado (kept as additional option)
  {
    id: 'custom-report',
    title: 'Relatório Personalizado',
    description: 'Crie um relatório com seções personalizadas',
    icon: <FileText className="h-8 w-8 text-primary" />,
    helpText: 'Permite criar um relatório totalmente personalizado, selecionando quais seções e elementos incluir. Ideal para situações específicas que não se encaixam nos modelos padronizados.',
    domainTracking: true,
    skillsTracking: true
  }
];

export default { getReportTemplates };
