# RAG Quick Reference - Educare+

## Verificar Status da Base Vetorial

### Via API
```bash
# Health Check
curl http://localhost:3001/api/rag/hybrid/health

# Status Completo (precisa de token)
curl -X GET http://localhost:3001/api/rag/hybrid/status \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Resposta Esperada (Base Carregada)
```json
{
  "success": true,
  "providers": {
    "qdrant": {
      "configured": true,
      "stats": {
        "vectors_count": 150,  // <-- Número de chunks indexados
        "status": "green"
      }
    }
  }
}
```

## Testar Query RAG

```bash
curl -X POST http://localhost:3001/api/rag/hybrid/query \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "marcos desenvolvimento 6 meses", "limit": 5}'
```

## Onde Ficam os Dados

| Dados | Local | Como Verificar |
|-------|-------|----------------|
| Vetores | Qdrant Cloud | Dashboard Qdrant ou `/api/rag/hybrid/status` |
| Metadata | PostgreSQL | Tabelas `kb_baby`, `kb_mother`, `kb_professional` |
| Arquivos | OpenAI Files | Dashboard OpenAI |

## Custos Estimados

| Operação | Custo |
|----------|-------|
| Upload 10 páginas | ~$0.0015 |
| 1 Query RAG | ~$0.001 |
| 1000 Queries/mês | ~$1.00 |

## Credenciais de Teste

- **Owner**: owner@educareapp.com / abc123
- **Admin**: admin@educareapp.com / abc123

## Arquivos Importantes

```
educare-backend/src/services/
├── qdrantService.js           # Cliente Qdrant
├── hybridIngestionService.js  # Pipeline de ingestão
├── ragService.js              # Serviço principal
└── ragMetricsService.js       # Métricas
```

## Variáveis de Ambiente (Secrets)

- `QDRANT_URL` - URL do Qdrant Cloud
- `QDRANT_API_KEY` - API Key Qdrant
- `GEMINI_API_KEY` - API Key Google (OCR + Embeddings)
- `OPENAI_API_KEY` - API Key OpenAI (LLM + File Search)
