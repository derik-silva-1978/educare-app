# Guia de Integração n8n + Educare+

## Configuração Básica

### Autenticação
Todas as requisições à API Externa requerem autenticação via API Key.

| Método | Valor |
|--------|-------|
| **Query Param** | `?api_key=SUA_API_KEY` |
| **Header** | `x-api-key: SUA_API_KEY` |

### Variável de Ambiente
```
EXTERNAL_API_KEY=educare_external_api_key_2025
```

### Base URLs
- **Desenvolvimento**: `https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001`
- **Produção**: Configure conforme seu domínio

---

## Endpoints Disponíveis

### 1. Planos de Assinatura

#### GET /api/external/subscription-plans
Lista todos os planos ativos e públicos.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Plano Gratuito",
      "description": "Plano básico...",
      "price": 0,
      "currency": "BRL",
      "billing_cycle": "monthly",
      "trial_days": 0,
      "features": {"ai_whatsapp": true, "blog_access": true},
      "limits": {"max_quizzes": 5, "max_children": 1}
    }
  ]
}
```

---

### 2. Usuários

#### GET /api/external/users
Lista todos os usuários com seus perfis.

**Query Params:**
- `email` (opcional): Filtrar por email
- `phone` (opcional): Filtrar por telefone
- `role` (opcional): user, professional, admin, owner

---

#### GET /api/external/users/search
Busca usuário por telefone ou CPF/CNPJ.

**Query Params:**
- `phone`: Telefone do usuário (ex: 5598991801628)
- `cpf_cnpj`: CPF ou CNPJ

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nome",
      "email": "email@exemplo.com",
      "phone": "5598991801628",
      "role": "user",
      "status": "active"
    },
    "profile": {
      "id": "uuid",
      "name": "Nome Perfil",
      "phone": "+5511999999999",
      "type": "professional"
    },
    "subscription": {
      "id": "uuid",
      "status": "active",
      "plan_name": "Plano Premium"
    }
  }
}
```

---

#### POST /api/external/users
Cria novo usuário com perfil e assinatura.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "+5511999999999",
  "password": "senha123",
  "role": "user",
  "plan_id": "uuid-do-plano",
  "subscription_status": "trial",
  "trial_days": 7,
  "profile": {
    "address": "Rua Exemplo, 123",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

---

#### GET /api/external/users/:id
Busca usuário por ID.

---

#### GET /api/external/users/:id/children
Lista filhos de um usuário.

---

### 3. Crianças

#### GET /api/external/children/:id
Dados de uma criança específica.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Maria",
    "birth_date": "2024-01-15",
    "gender": "female",
    "age_months": 11,
    "photo_url": null
  }
}
```

---

#### GET /api/external/users/search/children
Busca crianças por telefone ou CPF do responsável.

**Query Params:**
- `phone`: Telefone do responsável
- `cpf_cnpj`: CPF/CNPJ do responsável

---

### 4. Seleção de Criança Ativa (para WhatsApp)

#### GET /api/external/users/by-phone/:phone/active-child
Retorna a criança atualmente selecionada para interação via WhatsApp.

**Resposta (sucesso):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Maria",
    "birth_date": "2024-01-15",
    "age_months": 11
  },
  "user": {
    "id": "uuid",
    "name": "Nome do Responsável"
  }
}
```

**Resposta (sem crianças):**
```json
{
  "success": false,
  "error": "Nenhuma criança cadastrada",
  "user": {"id": "uuid", "name": "Nome"}
}
```

---

#### POST /api/external/users/by-phone/:phone/select-child/:childId
Seleciona qual criança será usada nas interações WhatsApp.

---

### 5. Jornada de Desenvolvimento (Quiz)

#### GET /api/external/children/:childId/unanswered-questions
Retorna perguntas não respondidas para a criança.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "text": "O bebê consegue sustentar a cabeça?",
      "domain": "motor",
      "age_range_start": 0,
      "age_range_end": 3,
      "options": ["Sim", "Não", "Às vezes"]
    }
  ]
}
```

---

#### POST /api/external/children/:childId/save-answer
Salva resposta de uma pergunta da jornada.

**Body:**
```json
{
  "question_id": "uuid-da-pergunta",
  "answer": "Sim",
  "notes": "Observação opcional"
}
```

---

#### GET /api/external/children/:childId/progress
Retorna progresso geral da criança na jornada.

---

#### GET /api/external/children/:childId/quiz-responses
Histórico de respostas do quiz.

---

### 6. TitiNauta AI (RAG)

#### POST /api/rag/external/ask
Envia pergunta ao assistente de IA TitiNauta.

**Body:**
```json
{
  "question": "Quando meu bebê deve começar a engatinhar?",
  "context": {
    "user_phone": "5598991801628",
    "child_id": "uuid-da-crianca",
    "child_age_months": 8,
    "module_type": "baby"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "answer": "Normalmente, bebês começam a engatinhar entre 7 e 10 meses...",
  "metadata": {
    "documents_found": 3,
    "file_search_used": true,
    "confidence": {
      "level": "high",
      "score": 0.85
    },
    "processing_time_ms": 1250,
    "knowledge_base": {
      "primary_table": "kb_baby",
      "used_table": "kb_baby"
    }
  }
}
```

#### POST /api/rag/external/ask-simple
Versão simplificada sem metadados detalhados.

---

## Fluxo n8n Recomendado para WhatsApp

### Diagrama de Fluxo

```
┌─────────────────────┐
│ 1. WhatsApp Trigger │  ← Evolution API Webhook
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ 2. Identificar      │  → GET /users/search?phone={{phone}}
│    Usuário          │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │ Existe?     │
    ↓             ↓
   SIM           NÃO
    │             │
    │      ┌──────▼──────┐
    │      │ 3. Criar    │ → POST /users
    │      │    Usuário  │
    │      └──────┬──────┘
    │             │
    └──────┬──────┘
           │
┌──────────▼──────────┐
│ 4. Buscar Criança   │  → GET /users/by-phone/:phone/active-child
│    Ativa            │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │ Tem criança?│
    ↓             ↓
   SIM           NÃO
    │             │
    │      ┌──────▼──────┐
    │      │ 5. Pedir    │ → Enviar menu para cadastrar
    │      │    Cadastro │
    │      └─────────────┘
    │
┌───▼─────────────────┐
│ 6. Classificar      │  (Switch node)
│    Intenção         │
└──────────┬──────────┘
     ┌─────┴─────┐
     ↓           ↓
  JORNADA      DÚVIDA
     │           │
┌────▼────┐  ┌───▼────────────┐
│ 7. Quiz │  │ 8. TitiNauta   │
│ Jornada │  │ AI (RAG)       │
└────┬────┘  └───────┬────────┘
     │               │
     │   ┌───────────┘
     │   │
┌────▼───▼────────────┐
│ 9. Enviar Resposta  │ → Evolution API WhatsApp
│    via WhatsApp     │
└─────────────────────┘
```

### Nós n8n Detalhados

#### 1. Webhook Evolution API
```json
{
  "type": "webhook",
  "parameters": {
    "path": "whatsapp-educare",
    "httpMethod": "POST"
  }
}
```

#### 2. HTTP Request - Buscar Usuário
```json
{
  "type": "httpRequest",
  "parameters": {
    "method": "GET",
    "url": "={{$env.EDUCARE_API_URL}}/api/external/users/search",
    "qs": {
      "phone": "={{$json.data.key.remoteJid.replace('@s.whatsapp.net', '')}}",
      "api_key": "={{$env.EDUCARE_API_KEY}}"
    }
  }
}
```

#### 3. HTTP Request - TitiNauta RAG
```json
{
  "type": "httpRequest",
  "parameters": {
    "method": "POST",
    "url": "={{$env.EDUCARE_API_URL}}/api/rag/external/ask",
    "qs": {
      "api_key": "={{$env.EDUCARE_API_KEY}}"
    },
    "body": {
      "question": "={{$json.data.message.conversation}}",
      "context": {
        "user_phone": "={{$json.user_phone}}",
        "child_id": "={{$json.active_child.id}}",
        "child_age_months": "={{$json.active_child.age_months}}",
        "module_type": "baby"
      }
    }
  }
}
```

---

## Variáveis de Ambiente n8n

Configure estas variáveis no seu n8n:

| Variável | Valor |
|----------|-------|
| `EDUCARE_API_URL` | URL base da API Educare |
| `EDUCARE_API_KEY` | `educare_external_api_key_2025` |
| `EVOLUTION_API_URL` | URL da Evolution API |
| `EVOLUTION_API_KEY` | Chave da Evolution API |

---

## Códigos de Erro Comuns

| Código | Descrição |
|--------|-----------|
| 401 | API Key inválida ou não fornecida |
| 404 | Recurso não encontrado (usuário, criança, etc) |
| 400 | Parâmetros inválidos na requisição |
| 500 | Erro interno do servidor |

---

## Testando a Integração

### Via curl
```bash
# Buscar usuário por telefone
curl "https://API_URL/api/external/users/search?phone=5598991801628&api_key=educare_external_api_key_2025"

# Perguntar ao TitiNauta
curl -X POST "https://API_URL/api/rag/external/ask?api_key=educare_external_api_key_2025" \
  -H "Content-Type: application/json" \
  -d '{"question": "Quando meu bebê deve começar a falar?"}'
```

---

## Suporte

Para dúvidas sobre a integração, entre em contato com a equipe de desenvolvimento.
