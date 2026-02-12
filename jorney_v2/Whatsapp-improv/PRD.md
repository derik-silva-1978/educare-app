# PRD – Evolução dos Fluxos Conversacionais do Educare App  
**WhatsApp • n8n • TitiNauta • Memória Vetorial • RAG • Multimodal**

---

## 1. Visão Geral

O Educare App utiliza o WhatsApp como uma das principais interfaces da jornada do usuário, integrado via Evolution API e orquestrado pelo n8n, com conexão direta às APIs da plataforma (Jornada do Desenvolvimento, Quiz, Conteúdos, Assinaturas e Dashboards).

Este PRD define a evolução dos fluxos conversacionais para tornar o sistema mais humano, contextual, multimodal e inteligente, integrando memória longa vetorial, RAG especializado, múltiplos assistentes (TitiNauta) e mecanismos contínuos de feedback da experiência do usuário.

---

## 2. Contexto e Status Atual (Baseline)

### 2.1 Fluxos Existentes

Os fluxos abaixo **já existem** e devem ser respeitados, evoluídos incrementalmente e mantidos compatíveis:

- **Educare app-chat**  
  Fluxo principal de entrada (WhatsApp / Chatwoot), responsável por:
  - Recepção das mensagens
  - Detecção de origem
  - Integração com assistentes RAG
  - Chamadas às APIs da Jornada, Quiz e Conteúdos

- **Lead CRM (Sub-fluxo)**  
  Responsável por:
  - Registro e enriquecimento de contatos
  - Consolidação do perfil do usuário
  - Base para personalização futura

- **SUB | Inactive User Reactivation (WhatsApp + Stripe + PG Memory)**  
  Responsável por:
  - Reengajamento de usuários inativos
  - Verificação de status de assinatura
  - Uso inicial de memória persistente

### 2.2 Infraestrutura Atual

- n8n self-hosted
- Replit conectado ao MCP do n8n
- APIs próprias do Educare App
- Base RAG já existente com dois assistentes especializados

---

## 3. Problemas Identificados

### 3.1 Conversa Livre sem Memória Longa

As interações livres com o TitiNauta não são armazenadas de forma estruturada em uma base vetorial, limitando:
- Continuidade semântica
- Personalização avançada
- Uso histórico para recomendações

### 3.2 Personalização Parcial do RAG

O RAG atual responde bem a perguntas pontuais, porém:
- Não utiliza histórico completo do usuário
- Não integra conversa livre + quiz + jornada

### 3.3 Fragmentação de Mensagens no WhatsApp

Usuários enviam mensagens curtas e sequenciais (“oi”, “tudo bem”, “quero continuar…”), causando:
- Acionamento prematuro de APIs
- Perda de contexto real da intenção

### 3.4 UX Limitada no Quiz

Perguntas de múltipla escolha exigem digitação manual, aumentando:
- Fricção
- Taxa de abandono
- Erros de interpretação

### 3.5 Ausência de Feedback Estruturado da Experiência

Atualmente não há mecanismo sistemático para:
- Avaliar satisfação do usuário
- Coletar sugestões
- Identificar problemas de uso em tempo real

---

## 4. Objetivos do Produto

1. Criar uma memória longa vetorial por usuário.
2. Unificar interações livres, respostas de quiz e eventos da jornada.
3. Tornar o RAG verdadeiramente contextual e histórico.
4. Humanizar a experiência no WhatsApp com:
   - Copy UX consistente
   - Buffer de mensagens
   - Botões interativos
   - **List Messages** para menus com múltiplas opções
5. Coletar feedback contínuo da experiência do usuário.
6. Preparar o sistema para recomendações personalizadas de conteúdos, cursos e treinamentos.
7. **Onboarding personalizado** — coletar dados do bebê (nome, gênero, data de nascimento) na primeira interação para personalizar toda a jornada.
8. **Relatório visual semanal** — gerar imagem PNG com barras de progresso por domínio, insights personalizados e timeline de marcos desde o nascimento, enviada via WhatsApp.

---

## 5. Arquitetura Funcional (Visão Lógica)

WhatsApp
→ Evolution API
→ n8n (Educare app-chat)
→ Guardrails & Segurança
→ Buffer de Mensagens
→ Classificação de Intenção
→ Seleção de Assistente (TitiNauta)
→ RAG + Memória Vetorial
→ APIs (Jornada / Quiz / Conteúdo)
→ Persistência + Áudio (ElevenLabs)
→ Resposta Multimodal ao Usuário

---

## 6. Assistentes TitiNauta (Arquitetura Multi-Agente)

### 6.1 Assistentes Existentes

- **TitiNauta – Especialista em Desenvolvimento Infantil**
- **TitiNauta – Especialista em Saúde da Mulher**

Cada assistente possui:
- Prompt próprio
- Base RAG específica
- Tom e objetivos distintos

### 6.2 Camada de UX Conversacional

A **Copy UX** atua como camada de apresentação e humanização **após** a resposta do LLM, garantindo:
- Linguagem simples
- Acolhimento emocional
- Frases curtas e claras
- Uso moderado de emojis

A copy **não substitui** o prompt do assistente, apenas molda a resposta final entregue ao usuário.

---

## 7. Seleção de Assistente (Contexto Conversacional)

Sempre que a conversa iniciar ou for reiniciada, o usuário deve escolher o contexto:

Sobre o que você quer falar agora? 💬

1️⃣ Sobre seu bebê 👶
2️⃣ Sobre você 💚

A escolha define:
- Assistente ativo
- Índice RAG utilizado
- Tipo de orientação e tom

O usuário pode mudar de contexto a qualquer momento.

---

## 8. Memória Longa Vetorial

### 8.1 Objetivo

Registrar o histórico semântico completo das interações para permitir:
- Continuidade contextual
- Personalização profunda
- Recomendações inteligentes

### 8.2 Dados Armazenados

Cada interação relevante deve gerar um registro vetorial contendo:
- user_id / telefone
- role: `user_message` | `assistant_response`
- texto normalizado
- embedding vetorial
- metadados:
  - tipo: conversa | quiz | jornada
  - assistente ativo
  - domínio (motor, emocional, saúde, etc.)
  - semana da jornada (quando aplicável)
  - timestamp

### 8.3 Uso da Memória

A memória vetorial deve ser consultada:
- Antes de respostas relevantes do assistente
- Para recomendações de conteúdo
- Em fluxos de reativação
- Para ajuste de tom e prioridade temática

---

## 9. Buffer de Mensagens Fragmentadas

### 9.1 Objetivo

Evitar acionamento prematuro de APIs e LLMs.

### 9.2 Regras

- Criar buffer por usuário com TTL de 10–15 segundos
- Concatenar mensagens sucessivas
- Processar somente quando:
  - Texto atingir tamanho mínimo
  - Intenção clara for detectada

### 9.3 Resposta Intermediária

Para mensagens muito curtas:

Oi 😊
Me conta um pouquinho mais pra eu conseguir te ajudar melhor.

---

## 10. Quiz no WhatsApp com Botões Interativos

### 10.1 Objetivo

Reduzir fricção e aumentar engajamento.

### 10.2 Implementação

- Uso de mensagens interativas (botões/listas) suportadas pela Evolution API
- Cada botão representa uma resposta normalizada do quiz
- Estilo:
  - Emojis suaves
  - Linguagem acolhedora
  - Feedback positivo após resposta

---

## 11. Integração Multimodal (ElevenLabs)

### 11.1 Objetivo

Adicionar camada emocional, acessibilidade e humanização.

### 11.2 Regras

- Uso de áudio para respostas relevantes
- Cache por hash do texto
- Fallback automático para texto
- Preferência do usuário armazenada na memória

---

## 12. Fallback de LLM

### 12.1 Justificativa

Garantir robustez, disponibilidade e controle de custos.

### 12.2 Estratégia

- LLM principal: respostas profundas e contextuais
- LLM secundário:
  - Mensagens curtas
  - Menus
  - Confirmações
- Decisão feita no n8n conforme tipo de intenção

---

## 13. Monitoramento da Experiência do Usuário (UX Feedback Loop)

### 13.1 Enquete de Satisfação

- Escala de 1 a 5 estrelas
- Disparo contextual, preferencialmente quando:
  - Usuário escolhe “Voltar mais tarde”
  - Finaliza um quiz
  - Encerra naturalmente a conversa

Exemplo:

Antes de você sair, como foi sua experiência até agora? ⭐

### 13.2 Tratamento da Resposta

- Avaliações altas:
  - Mensagem de reforço positivo
- Avaliações baixas:
  - Convite opcional para sugestão

### 13.3 Persistência

- Armazenar score com:
  - etapa da jornada
  - assistente ativo
  - timestamp
- Uso analítico (não vetorial)

---

## 14. Reporte de Problemas e Sugestões

### 14.1 Objetivo

Permitir melhoria contínua sem quebrar a experiência.

### 14.2 Fluxo

- Opção disponível no menu ou após feedback negativo
- Usuário descreve o problema ou sugestão livremente
- Sistema confirma recebimento

### 14.3 Persistência

- Tipo: problema | sugestão
- Texto
- Contexto da jornada
- Assistente ativo

---

## 15. Observabilidade e Controle

- correlationId por conversa
- Logs estruturados (info, warn, error)
- Debug mode para número administrador
- Métricas:
  - Falhas por nó
  - Latência
  - Uso de RAG
  - Uso de áudio
  - Satisfação média

---

## 16. Onboarding Personalizado (Novo)

### 16.1 Objetivo

Coletar dados essenciais do bebê na primeira interação para personalizar toda a jornada conversacional.

### 16.2 Dados Coletados

- **Nome do bebê** — usado em todas as interações subsequentes
- **Gênero** — adapta linguagem (ele/ela, seu filho/sua filha)
- **Data de nascimento** — calcula idade em semanas/meses, define semana da jornada

### 16.3 Fluxo

1. Primeiro contato → estado `ONBOARDING`
2. Sub-estados sequenciais: `ASKING_NAME` → `ASKING_GENDER` → `ASKING_BIRTHDATE`
3. Dados salvos no perfil do usuário
4. Transição para `CONTEXT_SELECTION` com saudação personalizada

### 16.4 Implementação

- Estado `ONBOARDING` adicionado à state machine (entre ENTRY e CONTEXT_SELECTION)
- Sub-estados controlados por campo `onboarding_step` no estado persistido
- Validação de data (formato brasileiro DD/MM/AAAA)
- Botões interativos para gênero (👦 Menino / 👧 Menina)

---

## 17. List Messages (Novo)

### 17.1 Objetivo

Utilizar mensagens do tipo lista (List Messages) do WhatsApp para menus com múltiplas opções, melhorando a UX em comparação com botões limitados a 3 opções.

### 17.2 Casos de Uso

- **Menu contextual** — quando há mais de 3 opções disponíveis
- **Seleção de conteúdo** — escolha de tópicos da jornada semanal
- **Opções de quiz** — perguntas com mais de 3 alternativas
- **Relatórios disponíveis** — seleção de tipo de relatório

### 17.3 Formato Evolution API v2

```json
{
  "number": "5511999999999",
  "options": {
    "delay": 1200,
    "presence": "composing"
  },
  "listMessage": {
    "title": "Menu Educare+",
    "description": "Escolha uma opção:",
    "buttonText": "Ver opções",
    "footerText": "Educare+ • TitiNauta 🚀",
    "sections": [
      {
        "title": "Jornada",
        "rows": [
          { "title": "📚 Conteúdo da semana", "description": "Ver o conteúdo desta semana", "rowId": "content_weekly" },
          { "title": "🧩 Quiz rápido", "description": "Responder quiz interativo", "rowId": "quiz_start" }
        ]
      },
      {
        "title": "Registros",
        "rows": [
          { "title": "📊 Ver progresso", "description": "Relatório de desenvolvimento", "rowId": "report_view" },
          { "title": "📝 Registrar dados", "description": "Biometria, sono, vacinas", "rowId": "log_start" }
        ]
      }
    ]
  }
}
```

---

## 18. Relatório Visual Semanal (Novo)

### 18.1 Objetivo

Gerar uma imagem PNG com o relatório de desenvolvimento do bebê, enviada diretamente no WhatsApp como mídia, proporcionando uma experiência visual rica.

### 18.2 Conteúdo da Imagem

1. **Header** — Logo Educare+, nome do bebê, idade em semanas/meses
2. **Barras de progresso** — uma por domínio de desenvolvimento:
   - 🧠 Cognitivo
   - 🗣️ Linguagem
   - 🏃 Motor
   - 💚 Social-Emocional
   - 🎨 Criativo
3. **Insights personalizados** — 2-3 observações baseadas nos dados recentes
4. **Timeline de marcos** — marcos alcançados desde o nascimento (ex: Social 0-2m ✓, Motor 3-4m ✓, Linguagem 9-12m ✓)
5. **CTA** — "Relatório completo disponível na plataforma Educare+"

### 18.3 Implementação

- Serviço `reportImageService.js` usando `canvas` (node-canvas) para gerar PNG
- Endpoint `GET /api/conversation/report-image/:phone` retorna a imagem
- Imagem enviada via Evolution API como mensagem de mídia
- Fallback: relatório em texto com barras ASCII (ex: `████░░░░ 50%`)

### 18.4 Barras ASCII (Fallback)

Para dispositivos ou situações onde a imagem não é possível:

```
📊 *Progresso do Thiago — Semana 16*

🧠 Cognitivo    ████████░░ 80%
🗣️ Linguagem   ██████░░░░ 60%
🏃 Motor       █████████░ 90%
💚 Social      ███████░░░ 70%
🎨 Criativo    ██████░░░░ 60%

💡 _Thiago está se destacando em habilidades motoras!_
```

---

## 19. Critérios de Sucesso (Atualizado)

- Conversas livres geram memória vetorial
- RAG utiliza histórico real do usuário
- Assistente correto assume no momento adequado
- Quiz grava respostas corretamente
- Botões interativos funcionam no WhatsApp
- **List Messages funcionam para menus com +3 opções**
- **Onboarding coleta nome, gênero e nascimento do bebê**
- **Relatório visual é gerado como imagem PNG e enviado no WhatsApp**
- **Barras ASCII de fallback são formatadas corretamente**
- Feedback de UX é coletado de forma natural
- Sistema evolui continuamente com base no uso real

---

## 20. Fora de Escopo

- UI Web detalhada dos dashboards
- Modelagem financeira de planos
- Integrações externas além das já existentes

---

**Documento preparado para execução técnica pelo Replit, respeitando o status atual dos fluxos e priorizando evolução incremental, experiência humana e inteligência contextual.**