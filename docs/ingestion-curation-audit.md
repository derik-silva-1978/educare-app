# Auditoria: Ingestão (Quiz + Conteúdo) e Módulo de Curadoria (Marcos do Desenvolvimento)

**Data:** Fevereiro 2026  
**Status:** Auditoria completa — base para evolução do sistema

---

## 1. Inventário de Fluxos de Ingestão

### 1.1 Fontes de Ingestão

| # | Fonte | Tipo | Script/Endpoint | Destino DB |
|---|-------|------|-----------------|------------|
| 1 | `conteudo_quiz/baby-journey.json` | JSON (conteúdo educacional bebê) | `importJourneyV2.js`, `import-journey-v2-data-fixed.js` | `journey_v2`, `journey_v2_weeks`, `journey_v2_topics` |
| 2 | `conteudo_quiz/mother-journey.json` | JSON (conteúdo educacional mãe) | `importJourneyV2.js`, `import-journey-v2-data-fixed.js` | `journey_v2`, `journey_v2_weeks`, `journey_v2_topics` |
| 3 | `conteudo_quiz/quizzes.json` | JSON (quizzes semana 5+) | `importJourneyV2.js`, `import-journey-v2-data-fixed.js` | `journey_v2_quizzes`, `journey_v2_badges` |
| 4 | Upload CSV via API | CSV | `POST /api/admin/journey-questions/import` | `journey_bot_questions` (modelo legado) |
| 5 | CRUD Manual via Admin | Form/API | `POST /api/admin/journey-v2/topics`, `/quizzes` | `journey_v2_topics`, `journey_v2_quizzes` |
| 6 | CRUD Manual Legado | Form/API | `POST /api/admin/journey-questions` | `journey_bot_questions` |
| 7 | Reimport V2 | API | `POST /api/admin/journey-v2/reimport` | Recria dados V2 a partir dos JSONs fonte |

### 1.2 Estruturas JSON Aceitas

**baby-journey.json / mother-journey.json** (Conteúdo educacional):
```json
[
  {
    "trail": "baby",
    "title": "Jornada do Bebê - Mês 1",
    "journey": [
      {
        "week": 1,
        "title": "Semana 1 - A Chegada",
        "description": "Cuidados vitais...",
        "topics": [
          {
            "title": "Sono Seguro",
            "content": {
              "trail": "baby",
              "microcard": { "titulo": "...", "itens": ["..."] },
              "acaoTexto": "...",
              "acaoAudio": "...",
              "links": [{ "titulo": "...", "url": "..." }]
            }
          }
        ]
      }
    ]
  }
]
```

**quizzes.json** (Quizzes):
```json
{
  "week5": {
    "trail": "baby",
    "month": 2,
    "week": 5,
    "title": "Semana 5",
    "baby_domains": [
      {
        "domain": null,
        "domain_id": null,
        "quizzes": [
          {
            "title": "...",
            "question": "...",
            "options": [...],
            "feedback": {...},
            "knowledge": {...}
          }
        ]
      }
    ],
    "mother_domains": [...],
    "badge_on_complete": {...}
  }
}
```

### 1.3 Mapeamento JSON → DB

| Campo JSON | Tabela DB | Campo DB | Observação |
|-----------|----------|---------|------------|
| `trail` | `journey_v2` | `trail` | 'baby' ou 'mother' |
| `month` | `journey_v2` | `month` | 1-5 |
| `week` | `journey_v2_weeks` | `week` | 1-20 |
| `topics[].title` | `journey_v2_topics` | `title` | — |
| `topics[].content` | `journey_v2_topics` | `content` (JSONB) | Armazena microcard, acaoTexto, acaoAudio, links inteiros |
| `baby_domains[].domain` | `journey_v2_quizzes` | `domain` | **PROBLEMA: Valores null no JSON** |
| `baby_domains[].domain_id` | `journey_v2_quizzes` | `domain_id` | **PROBLEMA: Valores null no JSON** |
| `quizzes[].question` | `journey_v2_quizzes` | `question` | — |
| `quizzes[].options` | `journey_v2_quizzes` | `options` (JSONB) | — |
| `quizzes[].feedback` | `journey_v2_quizzes` | `feedback` (JSONB) | — |
| `quizzes[].knowledge` | `journey_v2_quizzes` | `knowledge` (JSONB) | — |

---

## 2. Módulo de Curadoria (Marcos do Desenvolvimento)

### 2.1 Localização

| Componente | Arquivo |
|-----------|--------|
| Controller | `educare-backend/src/controllers/milestonesController.js` |
| Model OfficialMilestone | `educare-backend/src/models/OfficialMilestone.js` |
| Model MilestoneMapping | `educare-backend/src/models/MilestoneMapping.js` |
| Model MilestoneCandidateScore | `educare-backend/src/models/MilestoneCandidateScore.js` |
| Routes | `educare-backend/src/routes/milestonesRoutes.js` |
| Seeds | `educare-backend/src/seeds/officialMilestones.js` |

### 2.2 Entradas Esperadas pelo Módulo

O módulo de curadoria espera receber dados de **`JourneyBotQuestion`** (modelo legado) com os seguintes campos essenciais:

| Campo | Tipo | Obrigatório | Uso na Curadoria |
|-------|------|------------|-----------------|
| `domain_name` | STRING | Sim | Normalizado via `DOMAIN_MAPPING` → match com `OfficialMilestone.category` |
| `domain_question` | TEXT | Sim | Texto da pergunta usado no AI Matching (prompt do GPT-4o-mini) |
| `week` | INTEGER | Não | Convertido para faixa de semanas (±toleranceWeeks) para match temporal |
| `meta_min_months` | INTEGER | Sim | Fallback quando `week` é null: `monthToWeeks(meta_min_months)` |
| `meta_max_months` | INTEGER | Sim | Delimitação de faixa etária |
| `is_active` | BOOLEAN | Sim | Somente perguntas ativas são processadas |

### 2.3 Cadeia de Processamento (AutoLinker + AI Matching)

```
OfficialMilestone (seed: 6 categorias × 0-60 meses)
    ↓
autoLinkMilestones():
    Para cada marco → calcular targetWeek = monthToWeeks(target_month)
    → Filtrar JourneyBotQuestion por:
        1. normalizeDomain(domain_name) === milestone.category
        2. questionWeek dentro de [targetWeek-4, targetWeek+4]
    → Criar MilestoneMapping (is_auto_generated=true)
    ↓
runAIMatching():
    Para cada marco → buscar perguntas candidatas (mesma lógica de filtro)
    → Para cada par (marco, pergunta) → prompt GPT-4o-mini:
        "Atue como Pediatra Especialista... Note 0-5..."
    → Score salvo em MilestoneCandidateScore
    → Se score === 5 → auto-criar MilestoneMapping
    ↓
MilestoneMapping (tabela de vínculo)
    → verified_by_curator: false (aguarda curadoria humana)
    → Dashboard (getMilestonesChart, getChildMilestones)
```

### 2.4 Saídas do Módulo

| Função | Saída | Consumidor |
|--------|-------|-----------|
| `getMilestonesChart` | Cobertura por categoria + marcos por mês | Dashboard do bebê |
| `getChildMilestones` | Marcos por categoria com status (achieved/in_progress/pending) | Tela da criança |
| `getCurationStats` | Total mappings, auto-gerados, verificados, pendentes | Painel de curadoria |
| `getCurationView` | Visão cronológica: marcos + perguntas vinculadas + candidatas com scores | Painel de curadoria |
| `listMappings` | Lista de vínculos para revisão | Painel de curadoria |

### 2.5 Domínios de Desenvolvimento (Baby)

6 categorias definidas no enum do `OfficialMilestone.category`:

| Domínio | Exemplos de marcos |
|---------|-------------------|
| `motor` | Sustenta cabeça, Senta sem apoio, Anda |
| `cognitivo` | Segue objetos com olhar, Explora objetos |
| `linguagem` | Balbucia, Primeiras palavras |
| `social` | Sorriso social, Interação com pares |
| `emocional` | Reconhece cuidador, Expressa emoções |
| `sensorial` | Reage a sons, Explora texturas |

### 2.6 DOMAIN_MAPPING (Normalização)

```javascript
{
  'motor': 'motor',
  'motordesenvolvimento': 'motor',
  'motor_grosso': 'motor',
  'motor_fino': 'motor',
  'cognitivo': 'cognitivo',
  'cognitive': 'cognitivo',
  'cognição': 'cognitivo',
  'linguagem': 'linguagem',
  'language': 'linguagem',
  'communication': 'linguagem',
  'comunicação': 'linguagem',
  'social': 'social',
  'socialização': 'social',
  'social_emotional': 'social',
  'emocional': 'emocional',
  'emotional': 'emocional',
  'socioemocional': 'emocional',
  'sensorial': 'sensorial',
  'sensory': 'sensorial'
}
```

---

## 3. Banco de Dados e Dashboard

### 3.1 Tabelas Envolvidas

| Tabela | Modelo Sequelize | Papel |
|--------|-----------------|-------|
| `official_milestones` | OfficialMilestone | Marcos oficiais (seed, 6 categorias, 0-60 meses) |
| `milestone_mappings` | MilestoneMapping | Vínculo marco ↔ pergunta (auto/manual + curadoria) |
| `milestone_candidate_scores` | MilestoneCandidateScore | Scores 0-5 do AI Matching |
| `journey_bot_questions` | JourneyBotQuestion | **Perguntas legadas** (com domain_name, week, meta_min/max_months) |
| `journey_v2` | JourneyV2 | Jornadas V2 (trail + month) |
| `journey_v2_weeks` | JourneyV2Week | Semanas V2 (week number) |
| `journey_v2_topics` | JourneyV2Topic | **Conteúdo educacional V2** (content JSONB) |
| `journey_v2_quizzes` | JourneyV2Quiz | **Quizzes V2** (domain, options, feedback, knowledge) |
| `journey_v2_badges` | JourneyV2Badge | Badges por completar semana |
| `media_resources` | MediaResource | **Gestão de mídia** (text/audio/image/pdf/video/link + TTS) |

### 3.2 Queries do Dashboard

**`getMilestonesChart`:**
```sql
-- Cadeia: OfficialMilestone → MilestoneMapping → JourneyBotQuestion
SELECT official_milestones.*, milestone_mappings.*, journey_bot_questions.*
FROM official_milestones
LEFT JOIN milestone_mappings ON official_milestone_id = official_milestones.id
LEFT JOIN journey_bot_questions ON journey_question_id = journey_bot_questions.id
WHERE official_milestones.is_active = true
ORDER BY category ASC, target_month ASC
```

**`getChildMilestones`:**
```sql
SELECT * FROM official_milestones
WHERE is_active = true AND target_month <= (age_in_months + 3)
ORDER BY target_month ASC, category ASC, order_index ASC
```

### 3.3 Onde "domínio" é Usado

| Local | Como é usado | Risco |
|-------|-------------|-------|
| `autoLinkMilestones` | `normalizeDomain(q.domain_name) === milestone.category` | **V2 quizzes não têm domain_name** |
| `runAIMatching` | Mesmo filtro por domínio normalizado | **V2 quizzes invisíveis** |
| `getMilestonesChart` | Agrupa por `category` (6 domínios) | OK para dados existentes, **não inclui V2** |
| `getChildMilestones` | Agrupa milestones por `category` | OK, mas **sem vínculo V2** |
| `getCurationView` | Filtra por `category`, mostra perguntas vinculadas | **Só mostra JourneyBotQuestion** |
| `getCurationStats` | Conta mappings (JourneyBotQuestion apenas) | **Desconsidera V2** |

---

## 4. Endpoints Relacionados

### 4.1 Ingestão de Perguntas (Legado: JourneyBotQuestion)

| Método | Endpoint | Função |
|--------|---------|--------|
| GET | `/api/admin/journey-questions` | Listar com filtros |
| GET | `/api/admin/journey-questions/statistics` | Estatísticas |
| GET | `/api/admin/journey-questions/:id` | Buscar por ID |
| POST | `/api/admin/journey-questions` | Criar pergunta |
| PUT | `/api/admin/journey-questions/:id` | Atualizar |
| DELETE | `/api/admin/journey-questions/:id` | Excluir |
| POST | `/api/admin/journey-questions/import` | Importar CSV |
| GET | `/api/admin/journey-questions/export` | Exportar CSV |

### 4.2 Ingestão V2 (Journey V2: Topics + Quizzes)

| Método | Endpoint | Função |
|--------|---------|--------|
| GET | `/api/admin/journey-v2/statistics` | Estatísticas V2 |
| GET | `/api/admin/journey-v2/content` | Listar conteúdo/quizzes |
| GET | `/api/admin/journey-v2/weeks` | Listar semanas |
| GET | `/api/admin/journey-v2/topics/:id` | Buscar tópico |
| POST | `/api/admin/journey-v2/topics` | Criar tópico |
| PUT | `/api/admin/journey-v2/topics/:id` | Atualizar tópico |
| DELETE | `/api/admin/journey-v2/topics/:id` | Excluir tópico |
| GET | `/api/admin/journey-v2/quizzes/:id` | Buscar quiz |
| POST | `/api/admin/journey-v2/quizzes` | Criar quiz |
| PUT | `/api/admin/journey-v2/quizzes/:id` | Atualizar quiz |
| DELETE | `/api/admin/journey-v2/quizzes/:id` | Excluir quiz |
| POST | `/api/admin/journey-v2/reimport` | Reimportar de JSONs |

### 4.3 Curadoria (Marcos do Desenvolvimento)

| Método | Endpoint | Função | Acesso |
|--------|---------|--------|--------|
| GET | `/api/milestones/dashboard/milestones-chart` | Gráfico para dashboard | Autenticado |
| GET | `/api/milestones/child/:childId` | Marcos de uma criança | Autenticado |
| GET | `/api/milestones/milestones` | Listar marcos oficiais | Curador+ |
| GET | `/api/milestones/mappings` | Listar mapeamentos | Curador+ |
| POST | `/api/milestones/mappings` | Criar mapeamento | Curador+ |
| POST | `/api/milestones/mappings/:id/verify` | Verificar mapeamento | Curador+ |
| DELETE | `/api/milestones/mappings/:id` | Remover mapeamento | Curador+ |
| GET | `/api/milestones/curation-view` | Visão cronológica | Curador+ |
| GET | `/api/milestones/stats` | Estatísticas curadoria | Curador+ |
| POST | `/api/milestones/setup/seed` | Seed marcos oficiais | Owner |
| POST | `/api/milestones/setup/auto-link` | Auto-Linker | Owner |
| POST | `/api/milestones/ai-matching` | AI Matching (GPT) | Curador+ |

### 4.4 Gestão de Mídia (MediaResource)

| Método | Endpoint | Função |
|--------|---------|--------|
| GET | `/api/media-resources` | Listar com filtros |
| GET | `/api/media-resources/stats` | Estatísticas |
| GET | `/api/media-resources/category/:category` | Por categoria |
| GET | `/api/media-resources/:id` | Buscar por ID |
| POST | `/api/media-resources` | Criar (com upload) |
| PUT | `/api/media-resources/:id` | Atualizar |
| DELETE | `/api/media-resources/:id` | Excluir |
| POST | `/api/media-resources/:id/tts` | Gerar áudio TTS |

---

## 5. Análise de Riscos e Gaps

### 5.1 Riscos Críticos

| # | Risco | Severidade | Impacto |
|---|-------|-----------|---------|
| R1 | **V2 Quizzes invisíveis à curadoria** — autoLinker, AI Matching, dashboard só consultam `JourneyBotQuestion` | ALTA | Perguntas V2 nunca serão vinculadas a marcos oficiais |
| R2 | **`domain` em JourneyV2Quiz = 'baby_domains'/'mother_domains'** (trilha), não domínio de desenvolvimento | ALTA | Impossível classificar por motor/cognitivo/etc. no V2 |
| R3 | **Valores `domain` e `domain_id` são null** nos JSONs fonte de quizzes | ALTA | Dados entram sem classificação |
| R4 | **Dashboard (`getMilestonesChart`) ignora V2** — cobertura reportada é apenas de perguntas legadas | MÉDIA | Indicadores incompletos quando V2 for o sistema principal |
| R5 | **Sem anti-duplicidade** — nenhum hash de conteúdo ou verificação de duplicatas na ingestão | MÉDIA | Reimportações podem criar duplicatas |
| R6 | **MediaResource desconectado do V2** — assets de mídia não são vinculados a tópicos/quizzes | MÉDIA | Perda de rastreabilidade de assets |
| R7 | **JourneyV2Topic.content é JSONB monolítico** — todo o conteúdo (microcard + texto + áudio + links) em um único campo | BAIXA | Dificulta busca, indexação e evolução para blocos compostos |

### 5.2 Gaps Estruturais

| # | Gap | Consequência |
|---|-----|-------------|
| G1 | `JourneyV2Quiz` não tem campo `dev_domain` (motor, cognitivo, etc.) | Impossível fazer match com `OfficialMilestone.category` |
| G2 | `JourneyV2Topic` não tem campo `dev_domain` | Conteúdo educacional não classificável por área de desenvolvimento |
| G3 | `milestone_mappings.journey_question_id` é FK **obrigatória** para `journey_bot_questions` | Impossível vincular quizzes V2 a marcos sem alterar a tabela |
| G4 | Nenhuma tabela de curadoria para eixo Mãe | Curadoria materna inexistente |
| G5 | Sem `content_hash` em nenhum modelo | Duplicatas não detectáveis |
| G6 | Sem FK de `journey_v2_topics/quizzes` para `media_resources` | Mídia não vinculada |
| G7 | JSON de conteúdo não suporta blocos tipados (audio.provider, file.mime) | Limitação para integração ElevenLabs e rich media |

---

## 6. Módulo de Mídia (MediaResource) — Potencial de Integração

### 6.1 Capacidades Existentes

O `MediaResource` já suporta:
- **6 tipos**: text, audio, image, pdf, video, link
- **TTS integrado**: `tts_enabled`, `tts_endpoint`, `tts_voice`
- **Faixa etária**: `age_range_min`, `age_range_max` (0-216 meses)
- **Categorização**: `category`, `tags[]`
- **Upload de arquivos**: via multer, com `file_url`, `file_name`, `file_size`, `mime_type`
- **Estatísticas**: contagem por tipo, views, ativos, públicos
- **Lifecycle**: `is_active`, `is_public`, `view_count`, `created_by`

### 6.2 Oportunidade de Integração com V2

A integração pode acontecer via **tabela ponte** `journey_v2_media`:

```
JourneyV2Topic/Quiz ←→ journey_v2_media ←→ MediaResource
                        (position, type)
```

Benefícios:
- Conteúdo V2 que referencia áudio/imagem/PDF/link registra no MediaResource automaticamente
- TTS do MediaResource pode ser a base para futura integração ElevenLabs
- Assets rastreáveis com lifecycle (ativo/inativo, views)
- Centralização de uploads e gestão de arquivos

---

## 7. Agentes IA — Responsabilidades por Eixo

### 7.1 Divisão Atual

| Agente | KB | Escopo Atual | Escopo Proposto |
|--------|-----|-------------|-----------------|
| TitiNauta (Criança) | `kb_baby` | Respostas contextuais para pais sobre desenvolvimento infantil | + Classificação e ranqueamento de Quiz Bebê por domínio de desenvolvimento (6 categorias) |
| TitiNauta Materna | `kb_mother` | Respostas sobre saúde materna (gravidez, pós-parto, nutrição, sono, saúde mental) | + Classificação e ranqueamento de Quiz Mãe por domínios maternos (nutricao, saude_mental, recuperacao, amamentacao, saude_fisica, autocuidado) |
| TitiNauta Especialista | `kb_professional` | Protocolos clínicos para profissionais | Sem alteração nesta fase |

### 7.2 Quatro Eixos de Curadoria

| Eixo | Trilha | Tipo | Agente IA | Domínios | Sistema de Marcos |
|------|--------|------|-----------|----------|------------------|
| **Conteúdo Bebê** | baby | topic | TitiNauta Criança | motor, cognitivo, linguagem, social, emocional, sensorial | Vinculado a OfficialMilestone existente |
| **Conteúdo Mãe** | mother | topic | TitiNauta Materna | nutricao, saude_mental, recuperacao, amamentacao, saude_fisica, autocuidado | Sistema maternal independente |
| **Quiz Bebê** | baby | quiz | TitiNauta Criança | motor, cognitivo, linguagem, social, emocional, sensorial | autoLinker + AI Matching (extensão do existente) |
| **Quiz Mãe** | mother | quiz | TitiNauta Materna | nutricao, saude_mental, recuperacao, amamentacao, saude_fisica, autocuidado | Ranqueamento LLM via kb_mother |

---

## 8. Dependências para Evolução

### 8.1 Mudanças Necessárias no DB

1. **ALTER TABLE** `journey_v2_quizzes`: adicionar `dev_domain VARCHAR(30)`, `content_hash VARCHAR(64)`
2. **ALTER TABLE** `journey_v2_topics`: adicionar `dev_domain VARCHAR(30)`, `content_hash VARCHAR(64)`
3. **ALTER TABLE** `milestone_mappings`: adicionar `journey_v2_quiz_id UUID NULL` (coexistir com `journey_question_id`)
4. **CREATE TABLE** `maternal_curation_mappings`: sistema independente para curadoria materna
5. **CREATE TABLE** `journey_v2_media`: tabela ponte V2 ↔ MediaResource

### 8.2 Mudanças Necessárias no Código

1. **milestonesController.js**: autoLinker e AI Matching devem consultar `JourneyV2Quiz` além de `JourneyBotQuestion`
2. **milestonesController.js**: getMilestonesChart e getChildMilestones devem incluir dados V2
3. **Novo serviço**: `domainClassifier.js` com dois dicionários (baby_dev_domains + mother_dev_domains)
4. **Novo controller**: curadoria por eixo (4 endpoints separados)
5. **adminJourneyV2Controller.js**: integrar classificador de domínio na criação/edição + anti-duplicidade
6. **models/index.js**: novas associações (V2 ↔ MilestoneMapping, V2 ↔ MediaResource)

### 8.3 Backward Compatibility

- `JourneyBotQuestion` e seus endpoints continuam funcionando sem alteração
- `milestone_mappings` mantém `journey_question_id` funcional
- Dashboard existente não quebra — apenas ganha dados adicionais do V2
- APIs de ingestão legada (CSV import) continuam operacionais
