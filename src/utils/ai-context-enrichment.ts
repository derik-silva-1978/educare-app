
import type { DevelopmentDomain, AssessmentItem, Assessment } from '@/types/assessment';
import { DomainProgressWithTimeline, Milestone } from '@/types/development';
import { getDomainDisplayName } from '@/types/assessment';

/**
 * Formats child assessment data into a structure suitable for AI context
 */
export interface AIChildContext {
  childId: string;
  childName: string;
  childAge: number;
  assessmentSummary: string;
  strengths: string[];
  challenges: string[];
  developmentAreas: AIChildDevelopmentArea[];
  milestones: {
    completed: string[];
    upcoming: string[];
  };
  recentActivities?: string[];
}

export interface AIChildDevelopmentArea {
  domain: DevelopmentDomain;
  displayName: string;
  progress: number;
  items: {
    strength: boolean;
    description: string;
  }[];
}

/**
 * Prepares child assessment data for AI assistant context
 */
export const prepareChildContextForAI = (
  childId: string,
  childName: string,
  childAge: number,
  assessments: Assessment[],
  domainProgress: DomainProgressWithTimeline[],
  milestones: Milestone[],
): AIChildContext => {
  // Get the latest assessment
  const latestAssessment = assessments.length > 0 
    ? assessments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    : null;

  // Extract strengths and challenges
  const strengths: string[] = [];
  const challenges: string[] = [];

  // Process assessment items by domain
  const domainItems = new Map<DevelopmentDomain, AssessmentItem[]>();
  
  if (latestAssessment) {
    latestAssessment.items.forEach(item => {
      // Group by domain
      if (!domainItems.has(item.domain as DevelopmentDomain)) {
        domainItems.set(item.domain as DevelopmentDomain, []);
      }
      domainItems.get(item.domain as DevelopmentDomain)?.push(item);
      
      // Identify strengths and challenges
      if (item.level === 'high' || item.level === 'achieved' || item.level === 'mastered') {
        strengths.push(`${getDomainDisplayName(item.domain as DevelopmentDomain)}: ${item.skill || item.description || item.text || 'No description available'}`);
      } else if (item.level === 'low' || item.level === 'not_present' || item.level === 'emerging') {
        challenges.push(`${getDomainDisplayName(item.domain as DevelopmentDomain)}: ${item.skill || item.description || item.text || 'No description available'}`);
      }
    });
  }
  
  // Create development areas from domain progress
  const developmentAreas = domainProgress.map(dp => {
    const items = domainItems.get(dp.domain) || [];
    
    return {
      domain: dp.domain,
      displayName: getDomainDisplayName(dp.domain),
      progress: dp.progress,
      items: items.map(item => ({
        strength: item.level === 'high' || item.level === 'achieved' || item.level === 'mastered',
        description: item.skill || item.description || item.text || 'No description available'
      }))
    };
  });
  
  // Extract milestones
  const completedMilestones = milestones
    .filter(m => m.completed)
    .map(m => m.title);
    
  const upcomingMilestones = milestones
    .filter(m => !m.completed && m.age <= childAge + 3) // Next 3 months
    .map(m => m.title);
  
  // Generate assessment summary
  let assessmentSummary = 'No assessment data available.';
  if (latestAssessment) {
    const topStrengthDomains = [...domainProgress]
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 2)
      .map(dp => getDomainDisplayName(dp.domain));
      
    const challengeDomains = [...domainProgress]
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 2)
      .map(dp => getDomainDisplayName(dp.domain));
      
    assessmentSummary = `Child shows strengths in ${topStrengthDomains.join(' and ')}. Areas for focus include ${challengeDomains.join(' and ')}.`;
  }

  return {
    childId,
    childName,
    childAge,
    assessmentSummary,
    strengths: strengths.slice(0, 5), // Top 5 strengths
    challenges: challenges.slice(0, 5), // Top 5 challenges
    developmentAreas,
    milestones: {
      completed: completedMilestones,
      upcoming: upcomingMilestones
    }
  };
};

/**
 * Generates conversation starters based on assessment data
 */
export const generateConversationStarters = (childContext: AIChildContext): string[] => {
  const starters: string[] = [];
  
  // Add general starters
  starters.push(`Como posso apoiar o desenvolvimento de ${childContext.childName} hoje?`);
  
  // Add domain-specific starters
  const focusDomains = childContext.developmentAreas
    .filter(area => area.progress < 60) // Areas with less than 60% progress
    .slice(0, 2); // Top 2 areas for focus

  focusDomains.forEach(domain => {
    starters.push(`Quais atividades posso fazer para apoiar o desenvolvimento ${domain.displayName.toLowerCase()} de ${childContext.childName}?`);
  });
  
  // Add milestone-specific starters
  if (childContext.milestones.upcoming.length > 0) {
    starters.push(`Como preparar ${childContext.childName} para alcançar o próximo marco: ${childContext.milestones.upcoming[0]}?`);
  }
  
  return starters;
};

/**
 * Formats child context data into a system prompt for the AI
 */
export const createAISystemPrompt = (childContext: AIChildContext, assistantType: 'titibot' | 'alcibot'): string => {
  let basePrompt = '';
  
  if (assistantType === 'titibot') {
    basePrompt = `Você é Titibot, um coach de desenvolvimento infantil especializado em crianças de 0 a 36 meses.
    
Você está conversando com a família de ${childContext.childName}, uma criança de ${childContext.childAge} meses.

Informações sobre ${childContext.childName}:
- ${childContext.assessmentSummary}
`;

    if (childContext.strengths.length > 0) {
      basePrompt += `\nPontos fortes:\n${childContext.strengths.map(s => `- ${s}`).join('\n')}\n`;
    }
    
    if (childContext.challenges.length > 0) {
      basePrompt += `\nÁreas para desenvolver:\n${childContext.challenges.map(c => `- ${c}`).join('\n')}\n`;
    }
    
    basePrompt += `\nSeu foco é auxiliar com orientações práticas, atividades de estímulo adequadas à idade da criança,
e ajudar a identificar marcos importantes do desenvolvimento. Responda de forma amigável mas informativa,
sempre baseando-se em evidências científicas atuais sobre desenvolvimento infantil e os dados específicos desta criança.`;
  
  } else if (assistantType === 'alcibot') {
    basePrompt = `Você é AlciBot, um assistente especializado em saúde materna para acompanhar gestantes e mães no pós-parto.

Você está conversando com uma mãe de ${childContext.childName}, uma criança de ${childContext.childAge} meses.

Seu tom é sempre calmo, empático e acolhedor. Você fornece orientações baseadas em evidências científicas atuais,
ajuda a compreender sintomas comuns na gestação, oferece suporte emocional, e auxilia com informações práticas
sobre o desenvolvimento da gravidez e cuidados no pós-parto.`;
  }
  
  return basePrompt;
};
