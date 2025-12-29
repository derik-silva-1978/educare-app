const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const LLM_PROVIDERS = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    type: 'openai-compatible',
    envKey: 'OPENAI_API_KEY',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Rápido e econômico', context_window: 128000 },
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Mais capaz, maior custo', context_window: 128000 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Versão turbo do GPT-4', context_window: 128000 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Econômico para tarefas simples', context_window: 16385 },
      { id: 'o1-mini', name: 'O1 Mini', description: 'Modelo de raciocínio otimizado', context_window: 128000 },
      { id: 'o1-preview', name: 'O1 Preview', description: 'Modelo de raciocínio avançado', context_window: 128000 }
    ]
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    type: 'gemini',
    envKey: 'GEMINI_API_KEY',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Modelo mais recente e rápido', context_window: 1000000 },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Rápido com grande contexto', context_window: 1000000 },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Mais capaz, melhor raciocínio', context_window: 2000000 }
    ]
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    type: 'openai-compatible',
    envKey: 'DEEPSEEK_API_KEY',
    baseUrl: 'https://api.deepseek.com/v1',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', description: 'Chat otimizado, baixo custo', context_window: 64000 },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', description: 'Raciocínio avançado (R1)', context_window: 64000 }
    ]
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    type: 'openai-compatible',
    envKey: 'GROQ_API_KEY',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Modelo versátil de alta performance', context_window: 128000 },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', description: 'Ultra-rápido para tarefas simples', context_window: 128000 },
      { id: 'llama-3.2-90b-vision-preview', name: 'Llama 3.2 90B Vision', description: 'Multimodal com visão', context_window: 128000 },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Mixture of Experts eficiente', context_window: 32768 },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: 'Google Gemma otimizado', context_window: 8192 }
    ]
  },
  xai: {
    id: 'xai',
    name: 'xAI (Grok)',
    type: 'openai-compatible',
    envKey: 'XAI_API_KEY',
    baseUrl: 'https://api.x.ai/v1',
    models: [
      { id: 'grok-beta', name: 'Grok Beta', description: 'Modelo flagship do xAI', context_window: 131072 },
      { id: 'grok-2-1212', name: 'Grok 2', description: 'Segunda geração do Grok', context_window: 131072 }
    ]
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    type: 'anthropic',
    envKey: 'ANTHROPIC_API_KEY',
    baseUrl: 'https://api.anthropic.com/v1',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Equilíbrio entre velocidade e capacidade', context_window: 200000 },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Rápido e econômico', context_window: 200000 },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Mais capaz, tarefas complexas', context_window: 200000 }
    ]
  },
  together: {
    id: 'together',
    name: 'Together AI',
    type: 'openai-compatible',
    envKey: 'TOGETHER_API_KEY',
    baseUrl: 'https://api.together.xyz/v1',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', name: 'Llama 3.3 70B Turbo', description: 'Llama otimizado', context_window: 128000 },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', name: 'Qwen 2.5 72B', description: 'Modelo chinês de alta capacidade', context_window: 32768 },
      { id: 'mistralai/Mixtral-8x22B-Instruct-v0.1', name: 'Mixtral 8x22B', description: 'Grande MoE da Mistral', context_window: 65536 }
    ]
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    type: 'openai-compatible',
    envKey: 'OPENROUTER_API_KEY',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (via OR)', description: 'Claude via OpenRouter', context_window: 200000 },
      { id: 'openai/gpt-4o', name: 'GPT-4o (via OR)', description: 'OpenAI via OpenRouter', context_window: 128000 },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B (via OR)', description: 'Llama via OpenRouter', context_window: 128000 },
      { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5 (via OR)', description: 'Gemini via OpenRouter', context_window: 2000000 }
    ]
  },
  custom: {
    id: 'custom',
    name: 'Custom OpenAI-Compatible',
    type: 'openai-compatible',
    envKey: 'CUSTOM_LLM_API_KEY',
    baseUrl: null,
    models: [
      { id: 'custom-model', name: 'Custom Model', description: 'Configure via additional_params', context_window: 8192 }
    ]
  }
};

class LLMProviderRegistry {
  constructor() {
    this.providers = { ...LLM_PROVIDERS };
    this.clientCache = new Map();
  }

  getAllProviders() {
    return Object.values(this.providers);
  }

  getProvider(providerId) {
    return this.providers[providerId] || null;
  }

  getAvailableProviders() {
    return this.getAllProviders().map(provider => ({
      id: provider.id,
      name: provider.name,
      type: provider.type,
      available: this.isProviderAvailable(provider.id),
      reason: this.isProviderAvailable(provider.id) ? null : `${provider.envKey} não configurada`,
      models: provider.models
    }));
  }

  isProviderAvailable(providerId) {
    const provider = this.getProvider(providerId);
    if (!provider) return false;
    
    if (providerId === 'custom') {
      return true;
    }
    
    return !!process.env[provider.envKey];
  }

  getApiKey(providerId) {
    const provider = this.getProvider(providerId);
    if (!provider) return null;
    return process.env[provider.envKey] || null;
  }

  getModelsForProvider(providerId) {
    const provider = this.getProvider(providerId);
    return provider?.models || [];
  }

  getBaseUrl(providerId, additionalParams = {}) {
    const provider = this.getProvider(providerId);
    if (!provider) return null;
    
    if (additionalParams?.base_url) {
      return additionalParams.base_url;
    }
    
    return provider.baseUrl;
  }

  async callLLM(config, messages) {
    const { provider, model_name, temperature, max_tokens, additional_params } = config;
    const providerInfo = this.getProvider(provider);
    
    if (!providerInfo) {
      throw new Error(`Provider '${provider}' não encontrado`);
    }
    
    if (!this.isProviderAvailable(provider) && provider !== 'custom') {
      throw new Error(`Provider '${provider}' não está disponível. Configure a variável ${providerInfo.envKey}`);
    }

    switch (providerInfo.type) {
      case 'openai-compatible':
        return this.callOpenAICompatible(providerInfo, config, messages);
      case 'gemini':
        return this.callGemini(config, messages);
      case 'anthropic':
        return this.callAnthropic(config, messages);
      default:
        return this.callOpenAICompatible(providerInfo, config, messages);
    }
  }

  async callOpenAICompatible(providerInfo, config, messages) {
    const { model_name, temperature, max_tokens, additional_params } = config;
    const apiKey = additional_params?.api_key || this.getApiKey(providerInfo.id);
    const baseUrl = this.getBaseUrl(providerInfo.id, additional_params);
    
    if (!apiKey) {
      throw new Error(`API key não configurada para ${providerInfo.name}`);
    }

    const clientKey = `${providerInfo.id}-${baseUrl}`;
    let client = this.clientCache.get(clientKey);
    
    if (!client) {
      const clientConfig = { apiKey };
      if (baseUrl) {
        clientConfig.baseURL = baseUrl;
      }
      client = new OpenAI(clientConfig);
      this.clientCache.set(clientKey, client);
    }

    const requestParams = {
      model: model_name,
      messages,
      temperature,
      max_tokens
    };

    if (providerInfo.id === 'openrouter') {
      requestParams.headers = {
        'HTTP-Referer': process.env.APP_URL || 'https://educareapp.com',
        'X-Title': 'Educare+'
      };
    }

    const response = await client.chat.completions.create(requestParams);
    
    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
      model: response.model,
      provider: providerInfo.id
    };
  }

  async callGemini(config, messages) {
    const { model_name, temperature, max_tokens } = config;
    const apiKey = this.getApiKey('gemini');
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: model_name,
      generationConfig: {
        temperature,
        maxOutputTokens: max_tokens
      }
    });

    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const history = userMessages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({
      history,
      systemInstruction: systemMessage?.content
    });

    const lastMessage = userMessages[userMessages.length - 1];
    const result = await chat.sendMessage(lastMessage?.content || '');
    const response = await result.response;

    return {
      content: response.text(),
      usage: null,
      model: model_name,
      provider: 'gemini'
    };
  }

  async callAnthropic(config, messages) {
    const { model_name, temperature, max_tokens, additional_params } = config;
    const apiKey = additional_params?.api_key || this.getApiKey('anthropic');
    
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY não configurada');
    }

    const systemMessage = messages.find(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model_name,
        max_tokens,
        temperature,
        system: systemMessage?.content,
        messages: chatMessages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();

    return {
      content: data.content[0]?.text || '',
      usage: {
        prompt_tokens: data.usage?.input_tokens,
        completion_tokens: data.usage?.output_tokens,
        total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      },
      model: model_name,
      provider: 'anthropic'
    };
  }

  clearCache() {
    this.clientCache.clear();
  }
}

const providerRegistry = new LLMProviderRegistry();

module.exports = {
  LLMProviderRegistry,
  providerRegistry,
  LLM_PROVIDERS
};
