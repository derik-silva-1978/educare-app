/**
 * Prompt Service
 * Gerencia carregamento e substituição de variáveis nos prompts dos assistentes
 */

const AssistantPrompt = require('../models/AssistantPrompt');

const promptCache = {};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

async function getActivePrompt(moduleType) {
  const now = Date.now();
  if (!promptCache[moduleType]) {
    promptCache[moduleType] = { prompt: null, timestamp: 0 };
  }
  const cached = promptCache[moduleType];
  
  if (cached && cached.prompt && (now - cached.timestamp) < CACHE_TTL_MS) {
    console.log(`[PromptService] Retornando prompt em cache para ${moduleType}`);
    return cached.prompt;
  }

  try {
    const prompt = await AssistantPrompt.findOne({
      where: {
        module_type: moduleType,
        is_active: true
      },
      order: [['version', 'DESC']]
    });

    if (prompt) {
      promptCache[moduleType] = {
        prompt: prompt.toJSON(),
        timestamp: now
      };
      console.log(`[PromptService] Prompt carregado do banco para ${moduleType}: v${prompt.version}`);
      return prompt.toJSON();
    }

    console.log(`[PromptService] Nenhum prompt ativo encontrado para ${moduleType}`);
    return null;
  } catch (error) {
    console.error(`[PromptService] Erro ao carregar prompt para ${moduleType}:`, error.message);
    return null;
  }
}

function replaceVariables(promptText, context = {}) {
  if (!promptText) return promptText;

  let result = promptText;

  const variables = {
    child_name: context.childName || context.child_name || 'a criança',
    child_age: formatChildAge(context.childAge || context.age_months || context.ageInMonths),
    child_week: context.childWeek || context.child_week || context.week || '',
    user_name: context.userName || context.user_name || 'usuário',
    current_date: new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    professional_specialty: context.professionalSpecialty || context.professional_specialty || 'profissional de saúde'
  };

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
    result = result.replace(regex, value || '');
  }

  return result;
}

function formatChildAge(ageInMonths) {
  if (!ageInMonths && ageInMonths !== 0) return '';
  
  const months = parseInt(ageInMonths);
  if (isNaN(months)) return '';

  if (months < 1) return 'recém-nascido(a)';
  if (months === 1) return '1 mês';
  if (months < 12) return `${months} meses`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return years === 1 ? '1 ano' : `${years} anos`;
  }
  
  const yearText = years === 1 ? '1 ano' : `${years} anos`;
  const monthText = remainingMonths === 1 ? '1 mês' : `${remainingMonths} meses`;
  
  return `${yearText} e ${monthText}`;
}

async function getProcessedPrompt(moduleType, context = {}) {
  const promptData = await getActivePrompt(moduleType);
  
  if (!promptData) {
    return null;
  }

  const processedPrompt = replaceVariables(promptData.system_prompt, context);
  
  return {
    systemPrompt: processedPrompt,
    promptId: promptData.id,
    version: promptData.version,
    name: promptData.name
  };
}

function invalidateCache(moduleType = null) {
  if (moduleType) {
    promptCache[moduleType] = { prompt: null, timestamp: 0 };
    console.log(`[PromptService] Cache invalidado para ${moduleType}`);
  } else {
    Object.keys(promptCache).forEach(key => {
      promptCache[key] = { prompt: null, timestamp: 0 };
    });
    console.log('[PromptService] Cache completo invalidado');
  }
}

module.exports = {
  getActivePrompt,
  replaceVariables,
  formatChildAge,
  getProcessedPrompt,
  invalidateCache
};
