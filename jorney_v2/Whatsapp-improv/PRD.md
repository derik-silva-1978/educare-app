# PRD – Evolução dos Fluxos Conversacionais do Educare App  
**WhatsApp • n8n • TitiNauta • Memória Vetorial • RAG • Multimodal**

---

## 1. Visão Geral

O Educare App utiliza o WhatsApp como uma das principais interfaces da jornada do usuário, integrado via Evolution API e orquestrado pelo n8n, com conexão direta às APIs da plataforma (Jornada do Desenvolvimento, Quiz, Conteúdos, Assinaturas e Dashboards).

Este PRD define a evolução dos fluxos conversacionais para tornar o sistema mais humano, contextual, multimodal e inteligente, com uso de memória longa vetorial, RAG especializado e UX aprimorada no WhatsApp.

---

## 2. Contexto e Status Atual (Baseline)

Os seguintes fluxos já existem e devem ser respeitados e evoluídos, sem quebra de compatibilidade:

### 2.1 Fluxos Existentes
- **Educare app-chat**  
  Fluxo principal de entrada (WhatsApp / Chatwoot), com:
  - Detecção de origem
  - Integração com assistente RAG
  - Chamadas às APIs da Jornada e Quiz

- **Lead CRM (Sub-fluxo)**  
  Responsável por:
  - Registro e enriquecimento de contatos
  - Consolidação de perfil do usuário

- **SUB | Inactive User Reactivation (WhatsApp + Stripe + PG Memory)**  
  Responsável por:
  - Reengajamento de usuários inativos
  - Integração com status de assinatura
  - Uso inicial de memória (Postgres / vetorial)

### 2.2 Infraestrutura
- n8n self-hosted
- Replit conectado ao MCP do n8n
- APIs próprias do Educare App
- Base RAG já existente com dois assistentes

---

## 3. Problemas Identificados

### 3.1 Conversa Livre sem Memória Longa
As interações livres com o TitiNauta não são armazenadas de forma estruturada em uma base vetorial, o que limita:
- Personalização
- Continuidade semântica
- Recomendações inteligentes

### 3.2 Personalização Parcial
O RAG atual responde bem a perguntas pontuais, mas:
- Não considera histórico profundo do usuário
- Não conecta conversa + quiz + jornada + perfil

### 3.3 Fragmentação de Mensagens
Usuários enviam mensagens curtas e sequenciais no WhatsApp, acionando APIs antes de haver contexto suficiente.

### 3.4 UX de Quiz Limitada
Perguntas de múltipla escolha exigem digitação manual, aumentando fricção e erro.

---

## 4. Objetivos do Produto

1. Criar uma memória longa vetorial por usuário.
2. Unificar interações livres, respostas de quiz e eventos da jornada.
3. Ativar RAG contextual com base no histórico real do usuário.
4. Melhorar a experiência no WhatsApp com:
   - Buffer de mensagens
   - Botões interativos
   - Linguagem humanizada
5. Preparar o sistema para recomendações personalizadas de conteúdos, cursos e treinamentos.

---

## 5. Arquitetura Funcional (Visão Lógica)

WhatsApp
→ Evolution API
→ n8n (Educare app-chat)
→ Guardrails & Segurança
→ Buffer de Mensagens
→ Classificação de Intenção
→ Seleção de Assistente
→ RAG + Memória Vetorial
→ APIs (Jornada / Quiz / Conteúdo)
→ Persistência + Áudio (ElevenLabs)
→ Resposta ao Usuário

---

## 6. Memória Longa Vetorial

### 6.1 Objetivo
Armazenar o histórico semântico das interações para permitir personalização avançada, continuidade de contexto e recomendações inteligentes.

### 6.2 Dados Armazenados
Cada interação relevante deve gerar um registro vetorial contendo:
- user_id / telefone
- role: `user_message` | `assistant_response`
- texto normalizado
- embedding vetorial
- metadados:
  - tipo: conversa | quiz | jornada
  - assistente: infantil | mulher
  - domínio (motor, emocional, saúde, etc.)
  - semana da jornada (se aplicável)
  - timestamp

### 6.3 Uso da Memória
A memória vetorial deve ser consultada:
- Antes de respostas relevantes do assistente
- Para recomendações de conteúdo
- Em fluxos de reativação
- Para ajuste de tom e prioridade temática

---

## 7. RAG Multi-Assistente

### 7.1 Assistentes Existentes
- **TitiNauta – Desenvolvimento Infantil**
- **TitiNauta – Saúde da Mulher**

### 7.2 Seleção de Assistente
No WhatsApp, sempre que iniciar ou reiniciar a conversa:

Sobre o que você quer falar agora? 💬

1️⃣ Sobre seu bebê 👶
2️⃣ Sobre você 💚

A escolha define:
- Assistente ativo
- Índice RAG utilizado
- Tom e tipo de resposta

A escolha pode ser alterada a qualquer momento pelo usuário.

---

## 8. Buffer de Mensagens Fragmentadas

### 8.1 Objetivo
Evitar acionamento prematuro de APIs e LLMs.

### 8.2 Regras
- Criar buffer por usuário com TTL (10–15 segundos)
- Concatenar mensagens sucessivas
- Acionar processamento apenas quando:
  - Texto atingir tamanho mínimo
  - Intenção clara for detectada

### 8.3 Resposta Intermediária
Para mensagens muito curtas:
> “Oi 😊 Me conta melhor o que você precisa hoje?”

---

## 9. Quiz no WhatsApp com Botões Interativos

### 9.1 Objetivo
Reduzir fricção e aumentar engajamento.

### 9.2 Implementação
- Uso de mensagens interativas (botões/listas) suportadas pela Evolution API
- Cada opção representa uma resposta limpa do quiz
- Estilo:
  - Emojis suaves
  - Linguagem acolhedora
  - Feedback positivo

Exemplo:

Como foi o sono do bebê hoje? 🌙

😴 Dormiu bem
😐 Dormiu pouco
😢 Teve dificuldade

---

## 10. Integração com ElevenLabs (Áudio)

### 10.1 Objetivo
Adicionar camada emocional e acessibilidade.

### 10.2 Regras
- Áudio para respostas relevantes (feedback, orientações sensíveis)
- Cache por hash do texto
- Fallback automático para texto
- Preferência do usuário pode ser armazenada na memória

---

## 11. Fallback de LLM

### 11.1 Justificativa
Garantir robustez, custo controlado e disponibilidade.

### 11.2 Estratégia
- LLM principal: respostas profundas e contextuais
- LLM secundário:
  - Mensagens curtas
  - Menus
  - Confirmações
- Decisão feita no n8n por tipo de intenção

---

## 12. Observabilidade e Controle

- correlationId por conversa
- Logs estruturados (info, warn, error)
- Debug mode para número administrador
- Métricas:
  - Falhas por nó
  - Latência
  - Uso de RAG
  - Uso de áudio

---

## 13. Critérios de Sucesso

- Conversas livres geram memória vetorial
- RAG utiliza histórico real do usuário
- Quiz grava respostas corretamente no banco
- Botões interativos funcionam no WhatsApp
- Assistente correto assume no momento adequado
- Recomendações personalizadas emergem do histórico

---

## 14. Fora de Escopo (neste PRD)
- UI Web detalhada dos dashboards
- Modelagem financeira de planos
- Integrações externas além das já existentes

---

**Documento preparado para execução técnica pelo Replit, respeitando o status atual dos fluxos, com foco em evolução incremental, sem overengineering.