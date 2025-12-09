📘 PRD COMPLETO — Segmentação da Base de Conhecimento Educare+

Versão 1.0 — Expansão da Arquitetura RAG sem regressões

⸻

1. Visão Geral

O Educare+ App passou a operar com:
  •	módulos distintos (Meu Bebê, Minha Saúde, Profissionais),
  •	conteúdo híbrido (dados estruturados no PostgreSQL + conhecimento vetorial),
  •	interfaces específicas para bebê, mãe e profissional,
  •	Prompt Management centralizado.

O RAG existente (já implementado pelo Replit com base no PRD anterior) utiliza uma base vetorial unificada.
Agora, o objetivo é expandir a arquitetura, segmentando o conhecimento em três bases independentes, sem provocar quebras no backend existente.

Esta expansão precisa ser:
  •	progressiva
  •	não destrutiva
  •	compatível com código existente
  •	integrada ao fluxo atual de ingestão
  •	totalmente segura

⸻

2. Problema e Motivação

Com uma única base vetorial:
  •	conteúdos de bebê, mãe e profissional começam a se misturar;
  •	custo aumenta (filtros semânticos mais amplos);
  •	relevância de resposta diminui;
  •	risco de contaminação de linguagem aumenta (ex.: resposta técnica para mãe).

Para manter escalabilidade, coerência e segurança, é necessária a segmentação.

⸻

3. Objetivo da Reestruturação

Criar três bases de conhecimento independentes, cada uma com:
  •	tabela vetorial própria,
  •	fluxo de ingestão dedicado,
  •	filtros semânticos específicos,
  •	integração automática com o TitiNauta e demais agentes.

Além disso:
  •	manter intacto o backend atual
  •	preservar toda a estrutura do RAG já criada
  •	reutilizar componentes (embedding service, ingestion pipeline, db client)
  •	não alterar endpoints existentes — apenas ampliar
  •	manter compatibilidade com o fluxo do n8n
  •	manter compatibilidade com o Prompt Management System

⸻

4. Escopo da Reestruturação

4.1. Criar três novas tabelas vetoriais

Recomendação:

Tabela	Conteúdo
kb_baby	marcos, estimulação, guias OMS/BNCC, rotinas, atividades
kb_mother	saúde mental, pós-parto, nutrição, sono, práticas emocionais
kb_professional	PEI, guidelines técnicos, avaliações, artigos científicos

Cada tabela deve conter:
  •	id
  •	title / tag
  •	content textual
  •	embedding vetor
  •	metadata (fonte, categoria, faixa etária etc.)
  •	created_at
  •	updated_at

4.2. Atualizar o fluxo de ingestão via Super Admin

Novos campos no formulário:
  •	Categoria do Conhecimento → (Bebê / Mãe / Profissional)
  •	Faixa etária (se aplicável)
  •	Domínio (motor, linguagem etc.)

A ingestão deve:
  1.	Armazenar o documento original (PDF, texto).
  2.	Extrair texto.
  3.	Gerar embedding.
  4.	Inserir na tabela correspondente.

4.3. Atualizar o RAG existente para reconhecer “contexto de consulta”

O pipeline existente deve ser expandido para:
  •	identificar qual módulo fez a chamada:
  •	Meu Bebê → buscar apenas em kb_baby
  •	Minha Saúde → buscar apenas em kb_mother
  •	Profissional / Smart PEI → buscar apenas em kb_professional
  •	se necessário, buscar em múltiplas bases (comportamento controlado)

4.4. Atualizar Prompt Builder

Estrutura final deve incluir:

SYSTEM (via Prompt Management)
SAFETY (via Prompt Management)
MODULO ATUAL (bebê/mãe/profissional)
CONTEXT VECTORIAL (base correspondente)
DADOS DO USUÁRIO (PostgreSQL)
INSTRUÇÕES DE FORMATAÇÃO
PERGUNTA DO USUÁRIO

4.5. Ajustes no Backend

Requisitos:
  •	manter serviços atuais intactos
  •	criar novos serviços para múltiplas bases
  •	criar nova rota opcional para ingestão segmentada (se necessário)
  •	adicionar camada de seleção da base vetorial no RAGService

4.6. Ajustes no Frontend

Apenas no Super Admin:
  •	opção de selecionar categoria ao ingerir conteúdo
  •	listagem separada conforme categoria

Nenhuma mudança no app usuário final.

⸻

5. Escopo Não Funcional
  •	Não alterar tabelas ou rotas legadas.
  •	Não impactar login, cadastro, notificações.
  •	Não impactar rotas usadas pelo n8n.
  •	Performance deve melhorar (filtro semântico reduzido).
  •	Custos de embedding devem diminuir.
  •	Indexação deve ser mais rápida.

⸻

6. Arquitetura Final da Solução

┌─────────────────────────┐
│ Educare+ App / Chat     │
└───────────┬─────────────┘
            │
            ▼
      Module Selector
    (bebê / mãe / prof.)
            │
            │
            ▼
 ┌──────────────────────┐
 │    RAG Service       │
 └──────────┬───────────┘
            │
     Base Selector Layer
            │
 ┌─────────┼─────────────┬────────────┐
 │ kb_baby │ kb_mother   │ kb_prof.   │
 └─────────┴─────────────┴────────────┘
            │
            ▼
   Prompt Builder (dinâmico)
            │
            ▼
   Modelo LLM (OpenAI / Gemini)


⸻

7. Requisitos Técnicos do Backend

7.1. Criar novo serviço:
  •	knowledgeBaseService
  •	inserir documentos nas 3 bases
  •	buscar documentos na base correta
  •	buscar em múltiplas bases quando solicitado

7.2. Atualizar RAGService
  •	adicionar parâmetro moduleType (baby, mother, professional)
  •	escolher tabela vetorial apropriada

7.3. Ingestão Auto-Adaptada

O sistema deve usar o mesmo pipeline existente, apenas direcionando para outra tabela.

⸻

8. Requisitos Técnicos do Banco de Dados

Criar tabelas com migrations seguras:
  •	NÃO DELETAR tabela vetorial antiga (pode servir como fallback)
  •	criar novas tabelas incrementalmente
  •	não quebrar schemas existentes

⸻

9. Requisitos do Frontend (Super Admin)

Adicionar:
  •	seletor de categoria
  •	indicador visual de para qual base o conteúdo foi ingerido
  •	filtros por categoria na listagem

Nenhum outro módulo do app deve ser alterado.

⸻

10. Integração com n8n

Nada precisa mudar, desde que:
  •	as rotas do backend permaneçam idênticas
  •	apenas o comportamento interno do RAG é adaptado

⸻

11. Critérios de Aceite
  1.	RAG responde com precisão maior (testes de relevância).
  2.	RAG não mistura conteúdos entre módulos.
  3.	Nenhuma funcionalidade antiga quebra.
  4.	Ingestão via Super Admin funciona segmentada.
  5.	Prompt Builder funciona para todos os módulos.
  6.	O app de usuário final permanece inalterado.
  7.	Testes automatizados cobrem:
  •	ingestão segmentada
  •	busca segmentada
  •	pipeline com fallback

⸻

✔️ PRD FINALIZADO.

⸻