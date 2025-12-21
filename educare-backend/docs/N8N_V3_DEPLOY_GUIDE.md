# Educare+ Chat v3.0 - Guia de Deploy n8n

## Status: ✅ PRONTO PARA DEPLOY

Este guia documenta a integração completa do workflow n8n v3.0 com o backend Educare+.

---

## 📋 Novos Endpoints Implementados

### Grupo A: Gatekeeper
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/n8n/users/check` | GET | Verifica usuário por telefone, retorna subscription_status e child |

### Grupo B: Saúde com NLP
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/n8n/biometrics/update` | POST | Registra peso/altura com parsing OpenAI |
| `/api/n8n/sleep/log` | POST | Registra sono com parsing OpenAI |
| `/api/n8n/appointments/create` | POST | Agenda consultas com parsing OpenAI |

### Grupo C: Conteúdo e Vacinas
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/n8n/vaccines/check` | GET | Calendário vacinal SBP + histórico |
| `/api/n8n/content/child` | GET | Conteúdo por semana (bebê) |
| `/api/n8n/content/mother` | GET | Conteúdo por semana (mãe) |
| `/api/n8n/rag/ask` | POST | TitiNauta RAG com formato multimodal |

---

## 🔧 Contrato de Resposta Multimodal

**TODAS as respostas seguem este formato:**

```json
{
  "response_text": "Texto da resposta...",
  "media_type": "text|image|audio|document",
  "media_url": "https://..." // ou null
}
```

---

## 📊 Tabelas Criadas no Banco

```sql
-- Registros de peso/altura
CREATE TABLE biometrics_logs (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  head_circumference DECIMAL(5,2),
  raw_input TEXT,
  source VARCHAR(20) DEFAULT 'app',
  recorded_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Registros de sono
CREATE TABLE sleep_logs (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  sleep_type VARCHAR(20),
  quality VARCHAR(20),
  raw_input TEXT,
  source VARCHAR(20) DEFAULT 'app',
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Agendamentos médicos
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL,
  doctor_name VARCHAR(255),
  specialty VARCHAR(255),
  appointment_date TIMESTAMP,
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'scheduled',
  raw_input TEXT,
  source VARCHAR(20) DEFAULT 'app',
  notes TEXT,
  reminder BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Histórico de vacinas
CREATE TABLE vaccine_history (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL,
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_code VARCHAR(50),
  dose_number INTEGER,
  taken_at DATE,
  scheduled_at DATE,
  status VARCHAR(20) DEFAULT 'pending',
  age_weeks_when_taken INTEGER,
  raw_input TEXT,
  source VARCHAR(20) DEFAULT 'app',
  notes TEXT,
  batch_number VARCHAR(100),
  location VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 🚀 Deploy do Workflow n8n

### 1. Variáveis Necessárias no n8n

```env
EDUCARE_API_URL=https://[SEU-REPLIT].replit.dev:3001
EDUCARE_API_KEY=educare_external_api_key_2025
EVOLUTION_API_URL=https://api.educareapp.com.br
EVOLUTION_API_KEY=eff3ea025256694c10422fd0fc5ff169
EVOLUTION_INSTANCE=evolution
```

### 2. Importar Workflow

1. Acesse https://n8n.educareapp.com.br/
2. Clique em **Import**
3. Selecione o arquivo: `n8n-workflow-template-v3.json`
4. Configure as variáveis acima
5. Substitua `YOUR_OPENAI_CREDENTIAL_ID` pela credencial OpenAI
6. Ative o workflow

### 3. Configurar Webhook na Evolution API

```bash
curl -X POST "https://api.educareapp.com.br/webhook/set/evolution" \
  -H "apikey: eff3ea025256694c10422fd0fc5ff169" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://webhook.educareapp.com.br/webhook/chat",
    "webhook_by_events": true,
    "events": ["MESSAGES_UPSERT"]
  }'
```

---

## 📱 Fluxo de Mensagem

```
[WhatsApp] → [Evolution API] → [n8n Webhook]
                                    ↓
                           [Smart Extraction]
                                    ↓
                         [Áudio?] → [Whisper] → [Normalize]
                                    ↓
                           [Check User API]
                                    ↓
                     [Exists?] → [Sub Active?]
                                    ↓
                           [Calc Weeks Engine]
                                    ↓
                         [Intent Classifier GPT]
                                    ↓
    ┌──────────┬──────────┬──────────┬──────────┬──────────┐
    ↓          ↓          ↓          ↓          ↓          ↓
  [Menu]   [Biometrics] [Sleep]  [Vaccine] [Question] [Appoint]
    ↓          ↓          ↓          ↓          ↓          ↓
    └──────────┴──────────┴──────────┴──────────┴──────────┘
                                    ↓
                          [Router Output Type]
                                    ↓
              ┌─────────┬─────────┬─────────┐
              ↓         ↓         ↓         ↓
          [Text]    [Image]   [Audio]  [Document]
              ↓         ↓         ↓         ↓
              └─────────┴─────────┴─────────┘
                                    ↓
                          [Evolution API Send]
                                    ↓
                             [WhatsApp User]
```

---

## ✅ Testes Realizados

| Endpoint | Status | Resposta |
|----------|--------|----------|
| `/api/n8n/users/check` | ✅ OK | `{exists, subscription_status, child}` |
| `/api/n8n/vaccines/check` | ✅ OK | Calendário SBP com pendências |
| `/api/n8n/content/child` | ✅ OK | Conteúdo + media_type |
| `/api/n8n/rag/ask` | ✅ OK | Resposta multimodal |
| `/api/n8n/biometrics/update` | ✅ OK | NLP parsing funcional |

---

## 📦 Arquivos do Deploy

- `n8n-workflow-template-v3.json` - Template completo do workflow
- `N8N_INTEGRATION_GUIDE.md` - Documentação de endpoints
- `N8N_V3_DEPLOY_GUIDE.md` - Este guia

---

## ⚠️ Respostas de Erro Esperadas

### Códigos HTTP

| Código | Situação | Resposta |
|--------|----------|----------|
| **200** | Sucesso | `{response_text, media_type, media_url}` |
| **400** | Dados inválidos | `{response_text: "erro de validação", media_type: "text"}` |
| **401** | API key faltando/inválida | `{success: false, error: "API key..."}` |
| **404** | Criança não encontrada | `{response_text: "Criança não encontrada.", media_type: "text"}` |
| **500** | Erro interno | `{response_text: "Erro ao processar...", media_type: "text"}` |

### Erros Comuns

**API Key:**
```
GET /api/n8n/vaccines/check (sem ?api_key=...)
→ 401 {success: false, error: "API key não fornecida"}
```

**UUID Inválido:**
```
POST /api/n8n/biometrics/update
Body: {"child_id": "abc123", "raw_text": "..."}
→ 400 {response_text: "child_id inválido. Deve ser um UUID válido.", media_type: "text"}
```

**Criança Não Existe:**
```
POST /api/n8n/biometrics/update
Body: {"child_id": "550e8400-e29b-41d4-a716-446655440000", "raw_text": "..."}
→ 404 {response_text: "Criança não encontrada.", media_type: "text"}
```

**OpenAI Timeout (>30s):**
```
POST /api/n8n/biometrics/update (se OpenAI demora >30s)
→ 500 {response_text: "Erro ao registrar dados...", media_type: "text"}
```

---

## 🔐 Segurança

- ✅ API Key obrigatória em todos os endpoints n8n
- ✅ Validação de UUID para child_id
- ✅ Timeout de 30s para chamadas OpenAI (evita travamentos)
- ✅ Input sanitization no NLP Parser
- ✅ Sem exposição de dados sensíveis em respostas de erro

---

**Última atualização:** 2025-12-11
