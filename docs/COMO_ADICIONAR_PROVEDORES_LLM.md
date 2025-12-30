# Como Adicionar Novos Provedores de LLM ao Educare+

Este guia explica o passo a passo para integrar novos provedores de LLM (como Claude, Llama, etc) à plataforma Educare+.

---

## 📋 Visão Geral da Arquitetura

O sistema de LLM do Educare+ é dividido em 4 camadas:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND (PromptManagement.tsx)                          │
│    - Seleciona Provedor + Modelo                            │
│    - Ajusta Temperatura e Max Tokens                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 2. API REST (llmConfigController.js)                        │
│    - PUT /api/llm-configs/:module_type                      │
│    - GET /api/llm-configs/providers                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 3. BANCO DE DADOS (AssistantLLMConfig)                      │
│    - Persiste provider, model_name, temperature, max_tokens │
│    - Cache de 5 minutos para performance                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 4. LLM PROVIDER REGISTRY (llmProviderRegistry.js)           │
│    - Carrega config do banco                                │
│    - Chama o provedor correto (OpenAI, Gemini, etc)        │
│    - Retorna resposta para o RAG                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Passo a Passo para Adicionar um Novo Provedor

### **Passo 1: Configurar a Variável de Ambiente**

Toda API precisa de uma chave de autenticação. Adicione a variável no seu `.env`:

```bash
# .env (desenvolvimento)
NOVO_PROVEDOR_API_KEY=sk-xxx-seu-token-aqui

# Ou solicite via Replit Secrets (produção)
# Replit GUI → Secrets → Adicionar NOVO_PROVEDOR_API_KEY
```

**Exemplos de provedores reais:**
```bash
OPENAI_API_KEY=sk-proj-xxx
GEMINI_API_KEY=AIzaSyxxx
ANTHROPIC_API_KEY=sk-ant-xxx
GROQ_API_KEY=gsk_xxx
DEEPSEEK_API_KEY=sk-xxx
```

### **Passo 2: Registrar o Provedor no Registry**

Edite `educare-backend/src/services/llmProviderRegistry.js` e adicione sua entrada na const `LLM_PROVIDERS`:

```javascript
// Dentro de const LLM_PROVIDERS = { ... }

novo_provedor: {
  id: 'novo_provedor',                              // ID único (sem espaços/caracteres especiais)
  name: 'Nome do Provedor',                         // Nome exibido na UI
  type: 'openai-compatible',                        // Tipo: 'openai-compatible', 'gemini', 'anthropic'
  envKey: 'NOVO_PROVEDOR_API_KEY',                  // Chave de env
  baseUrl: 'https://api.novo-provedor.com/v1',     // URL base (deixe null para Custom)
  models: [
    {
      id: 'model-id-1',                             // ID que será enviado à API
      name: 'Model Display Name',                   // Nome exibido na UI
      description: 'Breve descrição do modelo',     // Tooltip na UI
      context_window: 128000                        // Janela de contexto (tokens)
    },
    {
      id: 'model-id-2',
      name: 'Outro Modelo',
      description: 'Descrição...',
      context_window: 64000
    }
  ]
}
```

**Exemplo Prático (Anthropic Claude):**
```javascript
anthropic: {
  id: 'anthropic',
  name: 'Anthropic (Claude)',
  type: 'anthropic',                                // Tipo especial (requer callAnthropic)
  envKey: 'ANTHROPIC_API_KEY',
  baseUrl: 'https://api.anthropic.com/v1',
  models: [
    {
      id: 'claude-3-5-sonnet-20241022',
      name: 'Claude 3.5 Sonnet',
      description: 'Equilíbrio entre velocidade e capacidade',
      context_window: 200000
    }
  ]
}
```

### **Passo 3: Implementar o Método de Chamada**

Adicione um método na classe `LLMProviderRegistry` para chamar sua API. Escolha conforme o tipo:

#### **Opção A: Compatível com OpenAI** 
Se sua API usa o mesmo formato da OpenAI (request/response), use:

```javascript
// Já existe: callOpenAICompatible()
// Funciona para: OpenAI, DeepSeek, Groq, Together, xAI, OpenRouter, Custom

// Apenas certifique-se de que:
// 1. type: 'openai-compatible'
// 2. baseUrl está correto
// 3. Env key está definida
```

#### **Opção B: Implementar Método Customizado**

Se a API é diferente (como Gemini ou Claude), implemente um novo método:

```javascript
// Adicione ao final da classe LLMProviderRegistry

async callNovoProvedor(config, messages) {
  const { model_name, temperature, max_tokens, additional_params } = config;
  const apiKey = additional_params?.api_key || this.getApiKey('novo_provedor');
  
  if (!apiKey) {
    throw new Error('NOVO_PROVEDOR_API_KEY não configurada');
  }

  // 1. Extrair system message (se houver)
  const systemMessage = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system');

  // 2. Fazer request para a API
  const response = await fetch('https://api.novo-provedor.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
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
    throw new Error(`Novo Provedor API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();

  // 3. Retornar no formato padrão Educare
  return {
    content: data.content[0]?.text || '',           // Texto da resposta
    usage: {
      prompt_tokens: data.usage?.input_tokens,
      completion_tokens: data.usage?.output_tokens,
      total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
    },
    model: model_name,
    provider: 'novo_provedor'
  };
}
```

### **Passo 4: Registrar o Método no `callLLM()`**

Adicione um case no método principal:

```javascript
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
    case 'novo_provedor':  // ← ADICIONE AQUI
      return this.callNovoProvedor(config, messages);
    default:
      return this.callOpenAICompatible(providerInfo, config, messages);
  }
}
```

### **Passo 5: Atualizar o Frontend (TypeScript)**

No arquivo `src/services/api/llmConfigService.ts`, adicione o novo tipo de provedor:

```typescript
export type ProviderType = 'openai' | 'gemini' | 'deepseek' | 'groq' | 'xai' | 'anthropic' | 'together' | 'openrouter' | 'novo_provedor' | 'custom';
```

### **Passo 6: Testar o Novo Provedor**

**Teste 1: Verificar Disponibilidade**
```bash
cd educare-backend

node -e "
const { providerRegistry } = require('./src/services/llmProviderRegistry');
const providers = providerRegistry.getAvailableProviders();
const novo = providers.find(p => p.id === 'novo_provedor');
console.log('Novo Provedor:', novo);
"
```

**Teste 2: Testar Chamada Completa**
```bash
node -e "
const llmConfigService = require('./src/services/llmConfigService');

(async () => {
  // Atualizar config para usar novo provedor
  await llmConfigService.updateConfig('baby', {
    provider: 'novo_provedor',
    model_name: 'model-id-1',
    temperature: 0.7,
    max_tokens: 1500
  });

  // Carregar e verificar
  const config = await llmConfigService.getConfig('baby');
  console.log('Config atualizada:', config);
})();
"
```

**Teste 3: Teste End-to-End**
```bash
# 1. Abra o navegador em /educare-app/owner/prompt-management
# 2. Faça login como Owner
# 3. Clique em "Configurações do Modelo" (seção TitiNauta)
# 4. Verifique se "Novo Provedor" aparece na lista
# 5. Selecione-o e veja se os modelos aparecem
# 6. Salve a configuração
# 7. Verifique nos logs do backend se a configuração foi salva
```

---

## 📚 Exemplos de Provedores Implementados

### **OpenAI (OpenAI-Compatible)**
```javascript
openai: {
  id: 'openai',
  name: 'OpenAI',
  type: 'openai-compatible',  // ← Usa callOpenAICompatible
  envKey: 'OPENAI_API_KEY',
  baseUrl: 'https://api.openai.com/v1',
  models: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', ... },
    { id: 'gpt-4o', name: 'GPT-4o', ... }
  ]
}
```

### **Google Gemini (Customizado)**
```javascript
gemini: {
  id: 'gemini',
  name: 'Google Gemini',
  type: 'gemini',              // ← Tem callGemini próprio
  envKey: 'GEMINI_API_KEY',
  models: [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', ... }
  ]
}
// Implementação: callGemini() usa GoogleGenerativeAI SDK
```

### **Anthropic Claude (Customizado)**
```javascript
anthropic: {
  id: 'anthropic',
  name: 'Anthropic (Claude)',
  type: 'anthropic',           // ← Tem callAnthropic próprio
  envKey: 'ANTHROPIC_API_KEY',
  baseUrl: 'https://api.anthropic.com/v1',
  models: [
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', ... }
  ]
}
// Implementação: callAnthropic() usa fetch direto (não tem SDK oficial em Node)
```

### **Custom (OpenAI-Compatible)**
```javascript
custom: {
  id: 'custom',
  name: 'Custom OpenAI-Compatible',
  type: 'openai-compatible',   // ← Usa callOpenAICompatible
  envKey: 'CUSTOM_LLM_API_KEY',
  baseUrl: null,               // ← Vem do additional_params.base_url
  models: [
    { id: 'custom-model', name: 'Custom Model', ... }
  ]
}
```

---

## 🔑 Variáveis de Ambiente Recomendadas

| Provedor | Env Key | Exemplo | Docs |
|----------|---------|---------|------|
| OpenAI | `OPENAI_API_KEY` | `sk-proj-xxx` | https://platform.openai.com/api-keys |
| Google Gemini | `GEMINI_API_KEY` | `AIzaSyxxx` | https://aistudio.google.com/app/apikey |
| Anthropic Claude | `ANTHROPIC_API_KEY` | `sk-ant-xxx` | https://console.anthropic.com |
| Groq | `GROQ_API_KEY` | `gsk_xxx` | https://console.groq.com |
| DeepSeek | `DEEPSEEK_API_KEY` | `sk-xxx` | https://platform.deepseek.com |
| Together AI | `TOGETHER_API_KEY` | `xxx` | https://api.together.xyz |
| xAI Grok | `XAI_API_KEY` | `xxx` | https://console.x.ai |
| OpenRouter | `OPENROUTER_API_KEY` | `sk-or-xxx` | https://openrouter.ai/keys |

---

## 🔄 Fluxo de Dados (Exemplo Prático)

**Cenário:** Owner seleciona "Claude 3.5 Sonnet" para TitiNauta Materna

```
1. FRONTEND (PromptManagement.tsx)
   ├─ Seleciona provider: "anthropic"
   ├─ Seleciona model: "claude-3-5-sonnet-20241022"
   ├─ Define temperature: 0.8
   ├─ Define max_tokens: 2000
   └─ PUT /api/llm-configs/mother
       { provider: "anthropic", model_name: "claude-3-5-sonnet-20241022", ... }

2. BACKEND API (llmConfigController)
   ├─ Recebe request
   ├─ Valida se anthropic_api_key existe
   └─ Chama llmConfigService.updateConfig()

3. BANCO DE DADOS
   ├─ INSERT/UPDATE assistant_llm_configs
   │  SET provider='anthropic', model_name='claude-3-5-sonnet-20241022', ...
   │  WHERE module_type='mother'
   └─ Retorna config salva

4. FRONTEND (recebe resposta)
   └─ Toast de sucesso: "Configuração salva!"

5. DURANTE CONVERSA (RAG usa config)
   ├─ Usuário: "Qual é a melhor posição para dormir?"
   ├─ RAG carrega config da madre
   │  { provider: 'anthropic', model_name: 'claude-3-5-sonnet-20241022', ... }
   ├─ llmProviderRegistry.callLLM(config, messages)
   ├─ Identifica type='anthropic'
   ├─ Chama callAnthropic()
   ├─ Faz request para https://api.anthropic.com/v1/messages
   └─ Retorna resposta ao usuário
```

---

## ⚠️ Troubleshooting

### Provedor não aparece na UI
- [ ] Verificou se a `envKey` está definida em `.env`?
- [ ] Restart backend e frontend?
- [ ] Cheque console logs: `providerRegistry.getAvailableProviders()`

### Erro "API key não configurada"
```bash
# Solução 1: Adicionar ao .env
NOVO_PROVEDOR_API_KEY=sua-chave-aqui

# Solução 2: Se em produção, usar Replit Secrets
# Replit GUI → Secrets → Adicionar nova variável
```

### Modelo não retorna respostas corretas
- [ ] Verifique o formato de request da API
- [ ] Confira se o `model_name` existe no provedor
- [ ] Monitore os logs: `console.log()` no método `callNovoProvedor()`

### Cache não invalida após update
```javascript
// O sistema já invalida automaticamente:
llmConfigService.invalidateCache('baby');  // Invoca ao atualizar
llmConfigService.invalidateAllCaches();    // Limpa tudo
```

---

## 📖 Leitura Recomendada

- **LLM Provider Registry**: `educare-backend/src/services/llmProviderRegistry.js`
- **LLM Config Service**: `educare-backend/src/services/llmConfigService.js`
- **LLM Config Controller**: `educare-backend/src/controllers/llmConfigController.js`
- **Prompt Management UI**: `src/pages/admin/PromptManagement.tsx`
- **RAG Service (integração)**: `educare-backend/src/services/ragService.js`

---

## ✅ Checklist de Implementação

- [ ] Criar `NOVO_PROVEDOR_API_KEY` no `.env`
- [ ] Adicionar provedor em `LLM_PROVIDERS` (llmProviderRegistry.js)
- [ ] Implementar método `callNovoProvedor()` se necessário
- [ ] Adicionar case no `callLLM()` se type for customizado
- [ ] Atualizar `ProviderType` no frontend (llmConfigService.ts)
- [ ] Testar disponibilidade com script Node
- [ ] Testar seleção na UI (PromptManagement.tsx)
- [ ] Testar salvamento no banco de dados
- [ ] Testar chamada real da API durante chat
- [ ] Documentar os models suportados
- [ ] Adicionar ao README/documentação do projeto

---

Dúvidas? Consulte os exemplos de OpenAI, Gemini e Anthropic no código-fonte!
