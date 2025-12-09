# Fase 9-UPGRADE: Aposentadoria Definitiva da Base Legado

**Data:** Dezembro 9, 2025  
**Status:** ✅ IMPLEMENTADA  
**Dependências:** FASE 8 completada com todas as flags de fallback como `false`

---

## 1. VISÃO GERAL

A Fase 9 implementa a **aposentadoria definitiva** da base legado (`knowledge_documents`):

- ✅ Verificação de pré-condições automática
- ✅ Backup imutável (JSONL + CSV + metadados)
- ✅ Desativação lógica (sem apagar dados)
- ✅ Bloqueio de ingestão na base legado
- ✅ Testes de consistência pós-desligamento
- ✅ Mecanismo de rollback instantâneo
- ✅ Relatório final de shutdown

---

## 2. PRÉ-REQUISITOS OBRIGATÓRIOS

Antes de executar o desligamento:

### 2.1 Flags de Fallback

```bash
USE_LEGACY_FALLBACK_FOR_BABY=false
USE_LEGACY_FALLBACK_FOR_MOTHER=false
USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=false
```

### 2.2 Métricas Validadas

Por pelo menos 7 dias:
- Score médio dos retornos > 0.75
- Taxa de respostas vazias = 0%
- Ausência de erros silenciosos
- Logs confirmam que a base legado não foi utilizada

### 2.3 Verificação via API

```bash
GET /api/admin/legacy/pre-conditions
```

Resposta esperada:
```json
{
  "success": true,
  "can_proceed": true,
  "conditions": {
    "all_flags_false": true,
    "metrics_validated": true,
    "backup_exists": false
  }
}
```

---

## 3. PROCEDIMENTO DE DESLIGAMENTO

### Passo 1: Verificar Pré-Condições

```bash
GET /api/admin/legacy/pre-conditions
```

### Passo 2: Criar Backup Imutável

```bash
POST /api/admin/legacy/backup
```

Arquivos gerados em `/backups/rag_legacy/YYYY-MM-DD/`:
- `knowledge_documents.jsonl` - Todos os documentos em formato JSONL
- `knowledge_documents.csv` - Campos principais em CSV
- `backup_metadata.json` - Metadados do backup

### Passo 3: Desativar Base Legado

```bash
POST /api/admin/legacy/deactivate
```

Este endpoint:
1. Verifica novamente as pré-condições
2. Marca a base legado como inativa
3. Bloqueia novas ingestões
4. Loga: `[RAG] Legacy knowledge base is now inactive`

### Passo 4: Executar Testes de Consistência

```bash
GET /api/admin/legacy/consistency-tests
```

Testes executados:
1. ✅ Bases segmentadas têm documentos
2. ✅ Todas as flags de fallback são false
3. ✅ Health do RAG não é "unhealthy"
4. ✅ Bloqueio de ingestão está ativo
5. ✅ Backup foi criado

### Passo 5: Gerar Relatório Final

```bash
GET /api/admin/legacy/report
```

Salvar o relatório para documentação.

---

## 4. ENDPOINTS DISPONÍVEIS

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/admin/legacy/pre-conditions` | GET | Verifica pré-condições |
| `/api/admin/legacy/backup` | POST | Cria backup imutável |
| `/api/admin/legacy/deactivate` | POST | Desativa base legado |
| `/api/admin/legacy/consistency-tests` | GET | Executa testes de consistência |
| `/api/admin/legacy/rollback` | POST | Reverte desligamento |
| `/api/admin/legacy/status` | GET | Status atual do shutdown |
| `/api/admin/legacy/report` | GET | Relatório completo |

---

## 5. BLOQUEIO DE INGESTÃO

### 5.1 Configuração

Adicionar ao `.env`:
```bash
LEGACY_INGESTION_DISABLED=true
```

### 5.2 Comportamento

Qualquer tentativa de ingestão na base legado retorna:
```
Error: Ingestão na base legado está desativada permanentemente. 
Use as bases segmentadas (kb_baby, kb_mother, kb_professional).
```

### 5.3 Código de Proteção

```javascript
if (target === 'legacy') {
  throw new Error("Ingestão na base legado está desativada permanentemente.");
}
```

---

## 6. ROLLBACK

### 6.1 Quando Usar

- Detecção de problemas críticos pós-desligamento
- Taxa de sucesso abaixo de 70%
- Muitos resultados vazios
- Solicitação explícita do cliente

### 6.2 Como Executar

```bash
POST /api/admin/legacy/rollback
```

Resultado:
```json
{
  "success": true,
  "message": "Rollback concluído. Base legado disponível novamente.",
  "instructions": [
    "Para reativar fallback, configure no .env:",
    "USE_LEGACY_FALLBACK_FOR_BABY=true",
    "USE_LEGACY_FALLBACK_FOR_MOTHER=true",
    "USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=true",
    "E reinicie o servidor."
  ]
}
```

### 6.3 O Que é Preservado

- Backup permanece intacto
- Dados da base legado intactos
- Bases segmentadas intactas
- Histórico de métricas mantido

---

## 7. TESTES DE CONSISTÊNCIA

### 7.1 Teste de Resposta

Para cada módulo:
- Consultas variadas retornam resultados segmentados
- Não existe consulta à base legado
- Log registra "legacy inactive"

### 7.2 Teste de Estresse (Manual)

Rodar 100+ queries de cada módulo:
- Validar score médio
- Verificar estabilidade do tempo de resposta

### 7.3 Teste de Regressão

Comparar respostas atuais com histórico:
- Nenhuma piora perceptível
- Consistência por módulo

---

## 8. BACKUP IMUTÁVEL

### 8.1 Estrutura de Arquivos

```
/backups/rag_legacy/
└── 2025-12-09/
    ├── knowledge_documents.jsonl
    ├── knowledge_documents.csv
    └── backup_metadata.json
```

### 8.2 Formato JSONL

Cada linha é um documento completo:
```json
{"id":"uuid","title":"..","source_type":"..","file_search_id":"..","created_at":".."}
```

### 8.3 Formato CSV

Campos principais para análise rápida:
```csv
id,title,source_type,age_range,domain,file_search_id,is_active,created_at
```

### 8.4 Metadados

```json
{
  "backup_date": "2025-12-09T...",
  "document_count": 150,
  "files": {
    "jsonl": "knowledge_documents.jsonl",
    "csv": "knowledge_documents.csv"
  },
  "checksums": {
    "jsonl_size": 245678,
    "csv_size": 12345
  }
}
```

---

## 9. STATUS DA BASE LEGADO

### Antes do Shutdown

```
Base legado: ATIVA
Fallback: HABILITADO (por flag)
Ingestão: PERMITIDA
```

### Depois do Shutdown

```
Base legado: INATIVA (deprecated)
Fallback: BLOQUEADO
Ingestão: BLOQUEADA
Dados: PRESERVADOS (apenas leitura)
```

---

## 10. CHECKLIST FINAL

Antes de considerar o shutdown completo:

- [ ] Todas as flags de fallback são false
- [ ] Métricas mostram >80% de sucesso por 7+ dias
- [ ] Backup foi criado e verificado
- [ ] Testes de consistência passaram (5/5)
- [ ] Nenhum erro crítico nos logs
- [ ] Rollback foi testado e funciona
- [ ] Relatório final gerado e salvo

---

## 11. LOG ESPERADO

Após desligamento bem-sucedido:

```
[LegacyShutdown] Verificando pré-condições...
[LegacyShutdown] Criando backup da base legado...
[LegacyShutdown] Encontrados 150 documentos para backup
[LegacyShutdown] Backup criado em: ./backups/rag_legacy/2025-12-09
[LegacyShutdown] Desativando base legado...
[LegacyShutdown] Base legado desativada com sucesso
[RAG] Legacy knowledge base is now inactive. All modules operating under segmented KB mode.
[LegacyShutdown] Executando testes de consistência...
[LegacyShutdown] Testes concluídos: 5/5 passaram
```

---

## 12. PRÓXIMA FASE

**FASE 10-UPGRADE**: Otimizações Avançadas do RAG (Enterprise Level)
- Re-ranking neural
- Confidence Score Layer
- LLM-Assisted Chunking
- Data Augmentation
- Context Safety Auditor
- Versionamento de KBs

---

*Documento gerado automaticamente - Fase 9-UPGRADE*
