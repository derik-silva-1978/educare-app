# FASE 2 — PROMPT PARA O REPLIT (BACKEND)
## Objetivo: Implementar com segurança a base técnica do módulo de INGESTÃO DE CONHECIMENTO (Super Admin → Upload → PostgreSQL + File Search)

Você já executou a Fase 1 e tem uma visão clara:
- da estrutura do projeto;
- da forma como o backend fala com o PostgreSQL;
- do fluxo atual com n8n;
- dos pontos seguros para encaixar o módulo RAG.

Nesta Fase 2, você deve **começar a implementar código de verdade**, mas com o máximo de cuidado para **não quebrar nada existente**.

---

## ✔️ 1. CRIAR/CONFIGURAR A TABELA `knowledge_documents` NO POSTGRESQL (COM MÁXIMA SEGURANÇA)

### 1.1. Regras obrigatórias

- Antes de criar qualquer tabela:
  - verifique se a tabela já existe (usando o padrão do projeto: migrations, ORM ou SQL cru);
  - use sempre comandos idempotentes (`IF NOT EXISTS`, equivalentes no ORM, etc.);
  - não altere tabelas existentes, a menos que haja instrução explícita (não é o caso).

### 1.2. Estrutura sugerida da tabela

Adapte à convenção do projeto (nomes de campos, tipos, timestamps), mas preserve a essência:

- `id` (uuid, PK, default gen_random_uuid ou equivalente)
- `title` (text, obrigatório)
- `description` (text, opcional)
- `source_type` (text) – exemplos: 'educare', 'oms', 'bncc', 'outro'
- `file_search_id` (text, obrigatório) – id retornado pela API do File Search
- `tags` (array de text)
- `age_range` (text) – ex: '0-3m', '4-6m', 'gestante'
- `domain` (text) – ex: 'motor', 'cognitivo', 'sensorial'
- `is_active` (boolean, default true)
- `created_by` (uuid / id do admin que subiu, se a arquitetura permitir)
- `created_at` (timestamp com default now())
- `updated_at` (timestamp com default now())

### 1.3. O que você deve fazer

- Implementar a criação dessa tabela usando **o mesmo padrão de migrations / schema** que o projeto já usa.
- Garantir que a criação:
  - seja repetível sem erro;
  - não exija derrubar o banco;
  - possa ser aplicada em produção sem downtime.

### 1.4. Documentação

- Atualizar a documentação (arquivo de docs apropriado) com:
  - estrutura completa da tabela;
  - finalidade da tabela;
  - relacionamento lógico com o restante do sistema (mesmo que não haja FK explícito).

---

## ✔️ 2. IMPLEMENTAR O SERVIÇO DE INTEGRAÇÃO COM FILE SEARCH (SEM ACOPLAR AO FLUXO AINDA)

Crie um módulo de serviço para lidar com o File Search, respeitando a arquitetura atual.

### 2.1. Nome e local

- Use o padrão do projeto para serviços.
- Sugestão: `src/services/fileSearchService.*` ou equivalente na estrutura existente.

### 2.2. Responsabilidades do serviço

- Ler as variáveis de ambiente necessárias (por exemplo):
  - chave de API do Gemini;
  - endpoint/base URL do File Search;
  - qualquer outra config exigida.
- Expor funções (nomes ilustrativos, adapte ao padrão do projeto):

  - `uploadDocumentToFileSearch(fileBuffer, fileName, metadata)`
    - recebe binário/stream do arquivo + nome + metadados básicos;
    - envia para o File Search;
    - retorna `file_search_id` (ou objeto com dados relevantes).

  - `deleteDocumentFromFileSearch(file_search_id)`
    - remove um documento do índice, caso seja necessário no futuro.

- Implementar tratamento de erros robusto:
  - timeouts;
  - erros de autenticação;
  - resposta inválida da API;
  - logs claros.

### 2.3. Boas práticas

- Não acoplar esse serviço diretamente às rotas ainda.  
- Criar testes básicos, se o projeto tiver estrutura para isso.
- Centralizar toda chamada ao File Search neste serviço, não espalhar lógica de integração pelo código.

### 2.4. Variáveis de ambiente

- Criar/atualizar o template `.env.example` (ou equivalente) com:
  - `GEMINI_API_KEY` (ou nome padrão do projeto)
  - `GEMINI_FILE_SEARCH_ENDPOINT` (se necessário)
  - outras chaves relevantes

---

## ✔️ 3. IMPLEMENTAR O ENDPOINT DE UPLOAD DE CONHECIMENTO PARA SUPER ADMIN

Agora, crie um endpoint dedicado para o **Super Admin (owner)** fazer a ingestão de documentos.

### 3.1. Nome e rota sugeridos (ajuste ao padrão do projeto)

- Método: `POST`
- Rota sugerida: `/admin/knowledge/upload`
- Agrupar a rota no módulo/controller de admin existente.
- Se houver versionamento de API (`/api/v1` etc.), seguir o padrão.

### 3.2. Fluxo do endpoint

1. **Autenticação e autorização**
   - Validar a sessão/token do usuário.
   - Verificar se o usuário é realmente **Super Admin / Owner**, usando o mecanismo da aplicação.
   - Se não for, retornar erro (401/403) sem avançar.

2. **Receber o arquivo e metadados**
   - Receber o arquivo (PDF, imagem, etc.) via `multipart/form-data` (ou outro padrão já usado no projeto).
   - Receber no corpo (ou campos correspondentes):
     - `title`
     - `description`
     - `source_type`
     - `age_range`
     - `domain`
     - `tags` (lista)
   - Validar campos obrigatórios (`title`, `source_type`, etc.).

3. **Armazenar o arquivo em storage**
   - Usar o mesmo serviço de storage que o projeto já utiliza (ex: Cloud Storage, S3, Google Drive, pasta local em dev).
   - Obter uma URL ou path de referência do arquivo, se o padrão atual fizer isso.

4. **Indexar no File Search**
   - Usar o `fileSearchService` criado anteriormente:
     - passar o arquivo;
     - incluir metadados importantes;
     - recuperar o `file_search_id`.

5. **Registrar no PostgreSQL**
   - Criar uma entrada em `knowledge_documents` com:
     - `title`
     - `description`
     - `source_type`
     - `file_search_id`
     - `tags`
     - `age_range`
     - `domain`
     - `is_active = true`
     - `created_by` (se houver user_id)
   - Garantir que qualquer erro de DB seja tratado com try/catch e log.

6. **Retornar resposta**
   - Em caso de sucesso, retornar algo como:
     ```json
     {
       "success": true,
       "message": "Documento de conhecimento cadastrado com sucesso.",
       "data": {
         "id": "...",
         "title": "...",
         "file_search_id": "..."
       }
     }
     ```
   - Em caso de erro, retornar resposta estruturada com:
     - código HTTP apropriado;
     - mensagem clara;
     - nunca vazar detalhes sensíveis da infra.

### 3.3. Requisitos de segurança adicionais

- Não permitir ingestão por outro perfil que não o Super Admin.
- Validar tamanho máximo de arquivo (configurável).
- Validar tipos de arquivo permitidos (ex.: PDF, PNG, JPG, etc.).
- Logar:
  - id do admin;
  - horário;
  - nome do arquivo;
  - tags/age_range/domain.

---

## ✔️ 4. NÃO MEXER EM NENHUM FLUXO EXISTENTE DO n8n NESTA FASE

- Nesta fase, você **não deve alterar** os webhooks nem endpoints já usados pelo n8n.
- Não mover lógica de n8n para o backend.
- Apenas criar:
  - a tabela `knowledge_documents`;
  - o serviço de File Search;
  - o endpoint seguro de upload para o Super Admin.

---

## ✔️ 5. ATUALIZAR A DOCUMENTAÇÃO

Ao final da implementação desta fase, atualize a documentação (por exemplo em `docs/RAG-EDUCARE.md` ou equivalente) com:

1. Estrutura da tabela `knowledge_documents`.
2. Assinatura e fluxo do serviço de File Search.
3. Especificação do endpoint `/admin/knowledge/upload`:
   - método;
   - parâmetros;
   - autenticação exigida;
   - exemplos de request/response.
4. Variáveis de ambiente novas (se houver).
5. Qualquer impacto observado no projeto.

---

## ⚠️ REGRAS DE SEGURANÇA PARA ESTA FASE

- Não remover código existente.
- Não alterar assinaturas de funções antigas sem motivo crítico.
- Não renomear rotas antigas.
- Não mexer em tabelas existentes.
- Qualquer erro deve ser tratado com logs e não derrubar o servidor.

---

## 📌 SAÍDA ESPERADA DA FASE 2

- Tabela `knowledge_documents` criada com segurança no Postgres.
- Serviço de integração com o File Search implementado e testado isoladamente.
- Endpoint de upload de documentos de conhecimento disponível, funcional e restrito ao Super Admin.
- Documentação atualizada com tudo que foi implementado.