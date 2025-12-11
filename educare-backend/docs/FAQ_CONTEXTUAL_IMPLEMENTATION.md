# FAQ Dinâmica Contextual - Implementação Técnica

**Data:** Dezembro 2025  
**Status:** ✅ Implementada e Pronta para Deploy

---

## 📋 Visão Geral

A funcionalidade "FAQ Dinâmica Contextual" fornece sugestões de perguntas frequentes contextualizadas pela idade (semana) da criança. Utiliza um algoritmo de ranqueamento baseado em engajamento dos usuários (upvotes, downvotes) para melhorar continuamente a relevância das sugestões.

**Objetivo Principal:** Ajudar pais e cuidadores encontrando respostas rápidas e contextualizadas sem buscar toda a base de conhecimento.

---

## 🗄️ Modelagem de Dados

### Tabela: `app_faqs`

```sql
CREATE TABLE app_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL CHECK (category IN ('child', 'mother', 'system')),
  question_text TEXT NOT NULL,
  answer_rag_context TEXT,
  min_week INT NOT NULL DEFAULT 0,
  max_week INT NOT NULL DEFAULT 999,
  is_seed BOOLEAN NOT NULL DEFAULT FALSE,
  usage_count INT NOT NULL DEFAULT 0,
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Colunas Principais:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único, gerado automaticamente |
| `category` | ENUM | **child** (bebê), **mother** (mãe), **system** (sistema/geral) |
| `question_text` | TEXT | Texto da pergunta em primeira pessoa (ex: "Meu bebê dorme pouco") |
| `answer_rag_context` | TEXT | Contexto opcional para injetar no prompt da IA (pode ativar RAG) |
| `min_week` | INT | Semana mínima de aplicabilidade (ex: 0 para recém-nascido) |
| `max_week` | INT | Semana máxima de aplicabilidade (ex: 24 para 6 meses) |
| `is_seed` | BOOLEAN | TRUE = inserida pelo sistema, FALSE = inserida manualmente |
| `usage_count` | INT | Contador de acessos (alimenta algoritmo) |
| `upvotes` | INT | Avaliações positivas dos usuários |
| `downvotes` | INT | Avaliações negativas dos usuários |

#### Índices de Performance:

1. **`idx_faqs_weeks(min_week, max_week)`** - Filtro por intervalo de semanas (CRÍTICO)
2. **`idx_faqs_ranking(usage_count, upvotes)`** - Ordenação por relevância
3. **`idx_faqs_category(category)`** - Filtro por categoria
4. **`idx_faqs_seed(is_seed)`** - Filtro por dados semente

---

## 🧠 Algoritmo de Ranqueamento

### Fórmula do Score:

```
relevance_score = (usage_count × 1.0) + (upvotes × 2.0) - (downvotes × 5.0)
```

### Explicação:

- **`usage_count × 1.0`**: Cada acesso soma 1 ponto. FAQ popular = mais relevante
- **`upvotes × 2.0`**: Cada upvote vale 2 pontos (reforça qualidade percebida)
- **`downvotes × 5.0`**: Cada downvote subtrai 5 pontos (desestimula FAQ ruim)

### Exemplo:

**FAQ A:**
- usage_count: 100
- upvotes: 20
- downvotes: 2
- **Score:** (100 × 1.0) + (20 × 2.0) - (2 × 5.0) = 100 + 40 - 10 = **130**

**FAQ B:**
- usage_count: 50
- upvotes: 30
- downvotes: 1
- **Score:** (50 × 1.0) + (30 × 2.0) - (1 × 5.0) = 50 + 60 - 5 = **105**

→ **FAQ A será retornada primeiro** (score 130 > 105)

---

## 📡 Endpoints da API

### 1. GET `/api/faqs/suggestions`

**Obter 5 FAQs mais relevantes para a semana da criança.**

**Parâmetros:**
- `week` (obrigatório, query): Semana atual da criança (0-999)
- `category` (opcional, query): Filtrar por 'child', 'mother', ou 'system'

**Exemplo:**
```bash
GET /api/faqs/suggestions?week=8&category=child
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "category": "child",
      "question_text": "Meu bebê tem cólicas, o que ajuda?",
      "answer_rag_context": "Massagem na barriguinha, posições diferentes...",
      "min_week": 4,
      "max_week": 12,
      "is_seed": true,
      "usage_count": 150,
      "upvotes": 45,
      "downvotes": 3,
      "relevance_score": 210
    },
    // ... 4 FAQs adicionais
  ],
  "count": 5,
  "week": 8
}
```

**Comportamento:**
- Filtra por `min_week <= week <= max_week`
- Ordena por `relevance_score DESC`
- Incrementa `usage_count` automaticamente
- Retorna apenas top 5

---

### 2. GET `/api/faqs`

**Listar todas as FAQs (admin/owner apenas).**

**Parâmetros:**
- `page` (optional): Página (padrão: 1)
- `limit` (optional): Itens por página (padrão: 20)

**Exemplo:**
```bash
GET /api/faqs?page=1&limit=20
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 35,
    "page": 1,
    "limit": 20,
    "pages": 2
  }
}
```

---

### 3. POST `/api/faqs`

**Criar nova FAQ (admin/owner apenas).**

**Body:**
```json
{
  "question_text": "Meu bebê não dorme à noite",
  "category": "child",
  "answer_rag_context": "Estabelecer rotina, ambiente escuro, temperatura adequada...",
  "min_week": 2,
  "max_week": 52
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "FAQ criada com sucesso",
  "data": {
    "id": "uuid",
    "question_text": "...",
    "category": "child",
    ...
  }
}
```

---

### 4. PUT `/api/faqs/:id`

**Atualizar FAQ existente (admin/owner apenas).**

**Body (qualquer campo):**
```json
{
  "question_text": "Texto atualizado...",
  "max_week": 60
}
```

---

### 5. DELETE `/api/faqs/:id`

**Deletar FAQ (admin/owner apenas).**

**Resposta (200):**
```json
{
  "success": true,
  "message": "FAQ deletada com sucesso"
}
```

---

### 6. POST `/api/faqs/:id/feedback`

**Registrar feedback do usuário (upvote/downvote).**

Endpoint **público** (não requer autenticação) para coletar feedback anônimo.

**Body:**
```json
{
  "type": "upvote"  // ou "downvote"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "upvote registrado com sucesso",
  "data": {
    "id": "uuid",
    "upvotes": 46,
    "downvotes": 3,
    "relevance_score": 211
  }
}
```

---

## 🔌 Integração com Frontend

### Hook React para Obter Sugestões:

```jsx
import { useQuery } from '@tanstack/react-query';

function FAQSuggestions({ weekNum, childCategory = 'child' }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['faqSuggestions', weekNum, childCategory],
    queryFn: async () => {
      const res = await fetch(
        `/api/faqs/suggestions?week=${weekNum}&category=${childCategory}`
      );
      if (!res.ok) throw new Error('Falha ao carregar FAQs');
      return res.json();
    }
  });

  if (isLoading) return <div>Carregando FAQs...</div>;
  if (error) return <div>Erro ao carregar FAQs</div>;

  return (
    <div>
      {data.data.map(faq => (
        <div key={faq.id}>
          <h4>{faq.question_text}</h4>
          <p>{faq.answer_rag_context}</p>
          <button onClick={() => handleFeedback(faq.id, 'upvote')}>👍</button>
          <button onClick={() => handleFeedback(faq.id, 'downvote')}>👎</button>
        </div>
      ))}
    </div>
  );
}
```

### Registrando Feedback:

```jsx
async function handleFeedback(faqId, type) {
  const res = await fetch(`/api/faqs/${faqId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type })
  });
  const data = await res.json();
  console.log('Feedback registrado:', data.data.relevance_score);
}
```

---

## 📊 Dados de Semente (Seed Data)

35-40 FAQs pré-carregadas, distribuídas em 3 períodos:

| Período | Semanas | FAQs | Foco |
|---------|---------|------|------|
| Recém-nascido | 0-4 | 9 | Cólicas, amamentação, cuidados básicos, puerpério |
| Primeiros meses | 4-12 | 8 | Tummy time, febre, eczema, retorno ao trabalho |
| 4-6 meses | 12-24 | 18 | Introdução de sólidos, desenvolvimento motor, desmame |

**Cada FAQ inclui:**
- Pergunta curta em primeira pessoa
- Contexto para injetar no RAG
- Intervalo de semanas aplicável
- Flag `is_seed = TRUE`

---

## 🚀 Implementação (Passo-a-Passo)

### 1. Criar Tabela

```bash
# Via Sequelize sync
npm run db:push --force

# OU manualmente:
psql -U seu_usuario -d seu_banco -f migrations/003_create_app_faqs_table.sql
```

### 2. Inserir Dados de Semente

```bash
psql -U seu_usuario -d seu_banco -f scripts/seed-app-faqs.sql
```

### 3. Registrar Modelo em `models/index.js`

```javascript
const AppFaq = require('./AppFaq');
// ... adicionar à lista de exports
module.exports = {
  // ...
  AppFaq,
  // ...
};
```

### 4. Registrar Rotas em `src/app.js`

```javascript
const faqRoutes = require('./routes/faqRoutes');
// ...
app.use('/api/faqs', faqRoutes);
```

### 5. Testar Endpoints

```bash
# Obter sugestões para semana 8
curl "http://localhost:3001/api/faqs/suggestions?week=8"

# Registrar upvote
curl -X POST "http://localhost:3001/api/faqs/uuid-aqui/feedback" \
  -H "Content-Type: application/json" \
  -d '{"type":"upvote"}'
```

---

## 🔒 Segurança e Boas Práticas

1. **Endpoints Públicos:** `/api/faqs/suggestions` (anônimo) e `/api/faqs/:id/feedback` (anônimo)
2. **Endpoints Protegidos:** `/api/faqs` (list, create, update, delete) - admin/owner apenas
3. **Validação:** Todos os parâmetros validados via `express-validator`
4. **Rate Limiting:** Considere adicionar rate limit ao endpoint de feedback para evitar spam
5. **Soft Delete:** Atualmente é hard delete, pode ser modificado para soft delete se necessário

---

## 📈 Métricas e Monitoramento

### Métricas Importantes:

1. **FAQ Média por Semana:** `COUNT(*) / MAX(max_week)`
2. **Taxa de Upvote:** `SUM(upvotes) / SUM(usage_count)`
3. **FAQ com Melhor Score:** Top 10 por relevância global
4. **FAQs com Downvote Alto:** Candidate para revisão

### Query para Análise:

```sql
SELECT 
  category,
  COUNT(*) as total,
  AVG(usage_count) as uso_medio,
  AVG((usage_count * 1.0 + upvotes * 2.0 - downvotes * 5.0)) as score_medio
FROM app_faqs
GROUP BY category;
```

---

## 🔄 Auto-Melhoria e Feedback

O sistema é projetado para melhorar continuamente:

1. **Feedback Coletado:** Cada upvote/downvote alimenta o algoritmo
2. **Score Dinâmico:** Perguntas boas "flutuam" para o topo
3. **Análise Regular:** Identificar FAQs com downvote alto para revisão
4. **Novas FAQs:** Pode adicionar manualmente conforme demanda identificada

---

## 🛠️ Próximas Melhorias Potenciais

1. **Soft Delete:** Preservar histórico sem deletar
2. **Rate Limiting:** Limitar feedback por IP/sessão
3. **Multi-idioma:** Suportar perguntas em múltiplos idiomas
4. **Analytics:** Dashboard de utilização de FAQs
5. **Busca Full-Text:** Adicionar busca além do filtro por semana
6. **Integração com RAG:** Usar `answer_rag_context` para enriquecer prompts do TitiNauta

---

## 📚 Arquivos Criados

1. **`src/models/AppFaq.js`** - Modelo Sequelize
2. **`src/migrations/003_create_app_faqs_table.sql`** - Script de criação
3. **`scripts/seed-app-faqs.sql`** - Dados de semente (35 FAQs)
4. **`src/routes/faqRoutes.js`** - Rotas da API
5. **`src/controllers/faqController.js`** - Lógica de negócio
6. **`docs/FAQ_CONTEXTUAL_IMPLEMENTATION.md`** - Esta documentação

