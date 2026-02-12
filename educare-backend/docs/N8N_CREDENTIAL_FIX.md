# Correção de Credenciais PostgreSQL no n8n

## Problema Identificado (2026-02-13)

Os testes de maturidade revelaram que o sub-workflow **"Lead CRM"** falha com:

```
password authentication failed for user "postgres"
```

Ao tentar executar `INSERT INTO lead_context (...)` no nó **"UPSERT lead_context"**.

## Credenciais Afetadas

| Credencial | ID | Usada por | Status |
|---|---|---|---|
| **Postgres_n8n** | `GOPEUe1LAiJGNq6A` | Lead CRM, Inactive User Reactivation | **QUEBRADA** - senha incorreta |
| **Postgres RAG (pgvector)** | `QR6UfUfQc6ZJoZMA` | Ingestion Flow, Memória Longa | A verificar |

## Passos para Correção

### 1. Acessar n8n
- URL: `https://n8n.educareapp.com.br`
- Menu: **Settings → Credentials**

### 2. Corrigir "Postgres_n8n" (GOPEUe1LAiJGNq6A)
1. Clicar na credencial **"Postgres_n8n"**
2. Verificar e corrigir os campos:
   - **Host**: deve apontar para o servidor PostgreSQL correto (provavelmente o container Docker interno `postgres` ou `app.voipsimples.com.br`)
   - **Port**: `5432`
   - **Database**: nome do banco que contém as tabelas `lead_context`, `lead_journey`, `lead_summary`
   - **User**: o usuário correto (NÃO `postgres` se estiver usando usuário dedicado)
   - **Password**: a senha correta correspondente ao usuário
3. Clicar em **"Test Connection"** para verificar
4. Salvar

### 3. Verificar tabelas necessárias
O Lead CRM precisa destas tabelas no banco apontado pela credencial:
- `lead_context`
- `lead_journey`
- `lead_summary`
- `inactive_context`
- `inactive_journey`
- `inactive_summary`
- `mem_short`
- `mem_long_events`
- `followup_queue`
- `wa_dedup`

Se não existirem, criar com os schemas do workflow.

### 4. Verificar "Postgres RAG (pgvector)" (QR6UfUfQc6ZJoZMA)
Mesmos passos acima. Este banco PRECISA ter a extensão `pgvector` instalada:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Correção de Auto-Transição (Código)

Também foi corrigido no backend (`stateMachineService.js`) o problema de auto-transição onde o n8n tentava transicionar `CONTEXT_SELECTION → CONTEXT_SELECTION` e recebia erro 400.

A correção torna auto-transições idempotentes: se o estado de destino é igual ao atual, retorna sucesso sem fazer alteração.

**Esta correção precisa ser deployada para produção** (Contabo) para ter efeito, pois o n8n chama `https://educareapp.com.br`.

## Resultados dos Testes de Maturidade

| Cenário | Fluxo no n8n | Resultado | Erro |
|---|---|---|---|
| Não cadastrado | Check User → Lead CRM | FALHA | `password authentication failed` na credencial Postgres_n8n |
| Inativo (belinha) | Check User → Lead CRM* | FALHA | Mesmo erro (Belinha não encontrada no banco produção, tratada como lead) |
| Ativo (Derik) | Check User → State Router → Entry Transition | FALHA | `Transição inválida: CONTEXT_SELECTION → CONTEXT_SELECTION` (CORRIGIDO no código) |

*Nota: Belinha retornou `exists: false` na API de produção, indicando que o telefone `5511996157205` não está cadastrado no banco do Contabo.

## Deploy Necessário

Para aplicar a correção da auto-transição em produção:
1. Fazer push do código para o GitHub (`main` branch)
2. GitHub Actions vai buildar a imagem Docker
3. Portainer no Contabo vai puxar e redeployar
