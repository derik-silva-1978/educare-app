# Educare+ n8n API Reference

**URL Base de Produção:**
```
https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001
```

**API Key:** `educare_external_api_key_2025`

**Header obrigatório em todas as requisições:**
```
x-api-key: educare_external_api_key_2025
```

---

## 1. Verificar Usuário

**Endpoint:** `GET /api/n8n/users/check`

**URL Completa:**
```
https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/users/check?phone={{phone}}
```

**Parâmetros Query:**
| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| phone | string | Sim | Telefone do usuário (ex: 559891628206) |

**Configuração n8n (HTTP Request):**
```json
{
  "method": "GET",
  "url": "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/users/check",
  "qs": {
    "phone": "={{$json.phone}}"
  },
  "headers": {
    "x-api-key": "educare_external_api_key_2025"
  }
}
```

**Resposta (usuário existe):**
```json
{
  "exists": true,
  "user_id": "uuid-do-usuario",
  "user_name": "Nome do Usuário",
  "subscription_status": "active",
  "plan_name": "Premium",
  "child": {
    "id": "uuid-da-crianca",
    "name": "Nome da Criança",
    "dob": "2024-06-15"
  }
}
```

**Resposta (usuário não existe):**
```json
{
  "exists": false,
  "subscription_status": null,
  "child": null
}
```

---

## 2. Perguntar ao TitiNauta AI (RAG)

**Endpoint:** `POST /api/n8n/rag/ask`

**URL Completa:**
```
https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/rag/ask
```

**Body (JSON):**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| question | string | Sim | Pergunta do usuário |
| user_id | string | Não | UUID do usuário (opcional) |
| child_id | string | Não | UUID da criança (opcional) |

**Configuração n8n (HTTP Request):**
```json
{
  "method": "POST",
  "url": "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/rag/ask",
  "headers": {
    "Content-Type": "application/json",
    "x-api-key": "educare_external_api_key_2025"
  },
  "body": {
    "question": "={{$json.message}}",
    "user_id": "={{$json.user_id}}",
    "child_id": "={{$json.child_id}}"
  }
}
```

**Resposta:**
```json
{
  "response_text": "Resposta do TitiNauta sobre desenvolvimento infantil...",
  "media_type": "text",
  "media_url": null,
  "sources": ["documento1.pdf", "documento2.pdf"]
}
```

---

## 3. Atualizar Biometria (Peso/Altura)

**Endpoint:** `POST /api/n8n/biometrics/update`

**URL Completa:**
```
https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/biometrics/update
```

**Body (JSON):**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| child_id | string | Sim | UUID da criança |
| raw_text | string | Sim | Texto natural (ex: "Peso 8.5kg altura 72cm") |

**Configuração n8n (HTTP Request):**
```json
{
  "method": "POST",
  "url": "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/biometrics/update",
  "headers": {
    "Content-Type": "application/json",
    "x-api-key": "educare_external_api_key_2025"
  },
  "body": {
    "child_id": "={{$json.child_id}}",
    "raw_text": "={{$json.message}}"
  }
}
```

**Resposta:**
```json
{
  "response_text": "✅ Registrado para Maria: peso: 8.5kg, altura: 72cm. Continue acompanhando o desenvolvimento!",
  "media_type": "text",
  "media_url": null,
  "data": {
    "id": "uuid-do-registro",
    "weight": 8.5,
    "height": 72,
    "head_circumference": null
  }
}
```

---

## 4. Registrar Sono

**Endpoint:** `POST /api/n8n/sleep/log`

**URL Completa:**
```
https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/sleep/log
```

**Body (JSON):**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| child_id | string | Sim | UUID da criança |
| raw_text | string | Sim | Texto natural (ex: "dormiu das 20h às 6h") |

**Configuração n8n (HTTP Request):**
```json
{
  "method": "POST",
  "url": "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/sleep/log",
  "headers": {
    "Content-Type": "application/json",
    "x-api-key": "educare_external_api_key_2025"
  },
  "body": {
    "child_id": "={{$json.child_id}}",
    "raw_text": "={{$json.message}}"
  }
}
```

**Resposta:**
```json
{
  "response_text": "😴 Sono registrado para João: início: 20:00, fim: 06:00, tipo: noturno. Bons sonhos!",
  "media_type": "text",
  "media_url": null,
  "data": {
    "id": "uuid-do-registro",
    "start_time": "20:00",
    "end_time": "06:00",
    "duration_minutes": 600,
    "sleep_type": "night"
  }
}
```

---

## 5. Criar Agendamento/Consulta

**Endpoint:** `POST /api/n8n/appointments/create`

**URL Completa:**
```
https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/appointments/create
```

**Body (JSON):**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| child_id | string | Sim | UUID da criança |
| raw_text | string | Sim | Texto natural (ex: "consulta com pediatra dia 25/12 às 14h") |

**Configuração n8n (HTTP Request):**
```json
{
  "method": "POST",
  "url": "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/appointments/create",
  "headers": {
    "Content-Type": "application/json",
    "x-api-key": "educare_external_api_key_2025"
  },
  "body": {
    "child_id": "={{$json.child_id}}",
    "raw_text": "={{$json.message}}"
  }
}
```

**Resposta:**
```json
{
  "response_text": "🏥 Consulta agendada para Maria: Pediatra com Dr. Silva em 25/12/2025 às 14:00. Vou te lembrar!",
  "media_type": "text",
  "media_url": null,
  "data": {
    "id": "uuid-do-agendamento",
    "specialty": "Pediatra",
    "doctor_name": "Dr. Silva",
    "appointment_date": "2025-12-25",
    "appointment_time": "14:00"
  }
}
```

---

## 6. Verificar Vacinas

**Endpoint:** `GET /api/n8n/vaccines/check`

**URL Completa:**
```
https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/vaccines/check?age_weeks={{age_weeks}}&child_id={{child_id}}
```

**Parâmetros Query:**
| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| age_weeks | number | Sim | Idade da criança em semanas |
| child_id | string | Não | UUID da criança (para verificar histórico) |

**Configuração n8n (HTTP Request):**
```json
{
  "method": "GET",
  "url": "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/vaccines/check",
  "qs": {
    "age_weeks": "={{$json.age_weeks}}",
    "child_id": "={{$json.child_id}}"
  },
  "headers": {
    "x-api-key": "educare_external_api_key_2025"
  }
}
```

**Resposta:**
```json
{
  "response_text": "💉 **Calendário Vacinal - 24 semanas**\n\n✅ Todas as vacinas em dia até 24 semanas!\n\n📅 **Próximas vacinas:**\n• Febre Amarela (dose 1) - 36 semanas",
  "media_type": "text",
  "media_url": null,
  "data": {
    "pending": [],
    "upcoming": [
      { "vaccine": "Febre Amarela", "weeks": 36, "dose": 1 }
    ]
  }
}
```

---

## 7. Conteúdo sobre Bebê

**Endpoint:** `GET /api/n8n/content/child`

**URL Completa:**
```
https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/content/child?week={{week}}
```

**Parâmetros Query:**
| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| week | number | Não | Idade da criança em semanas (0-312, padrão: 0) |

**Configuração n8n (HTTP Request):**
```json
{
  "method": "GET",
  "url": "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/content/child",
  "qs": {
    "week": "={{$json.week}}"
  },
  "headers": {
    "x-api-key": "educare_external_api_key_2025"
  }
}
```

**Resposta:**
```json
{
  "response_text": "👶 **Conteúdo para semana 24:**\n\n1. **Título do Artigo**\nResumo do conteúdo...",
  "media_type": "text",
  "media_url": null,
  "data": [
    { "id": "uuid", "title": "Título", "type": "news" }
  ]
}
```

---

## 8. Conteúdo sobre Mãe

**Endpoint:** `GET /api/n8n/content/mother`

**URL Completa:**
```
https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/content/mother?week={{week}}
```

**Parâmetros Query:**
| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| week | number | Não | Semanas pós-parto (0-312, padrão: 0) |

**Configuração n8n (HTTP Request):**
```json
{
  "method": "GET",
  "url": "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/content/mother",
  "qs": {
    "week": "={{$json.week}}"
  },
  "headers": {
    "x-api-key": "educare_external_api_key_2025"
  }
}
```

**Resposta:**
```json
{
  "response_text": "👩 **Conteúdo para mães - semana 24:**\n\n1. **Título do Artigo**\nResumo do conteúdo...",
  "media_type": "text",
  "media_url": null,
  "data": [
    { "id": "uuid", "title": "Título", "type": "news" }
  ]
}
```

---

## Resumo Rápido - URLs Prontas para Copiar

```bash
# 1. Verificar Usuário
GET https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/users/check?phone=559891628206

# 2. Perguntar ao TitiNauta
POST https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/rag/ask

# 3. Atualizar Biometria
POST https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/biometrics/update

# 4. Registrar Sono
POST https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/sleep/log

# 5. Criar Agendamento
POST https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/appointments/create

# 6. Verificar Vacinas
GET https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/vaccines/check?age_weeks=24

# 7. Conteúdo Bebê
GET https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/content/child?week=24

# 8. Conteúdo Mãe
GET https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/content/mother?week=24
```

---

## Teste com cURL

```bash
# Testar conexão
curl -X GET "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/users/check?phone=559891628206" \
  -H "x-api-key: educare_external_api_key_2025"

# Testar TitiNauta
curl -X POST "https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001/api/n8n/rag/ask" \
  -H "Content-Type: application/json" \
  -H "x-api-key: educare_external_api_key_2025" \
  -d '{"question": "Quando meu bebê vai começar a andar?"}'
```

---

*Documento gerado em 21 de Dezembro de 2025*
*Educare+ API Reference para n8n*
