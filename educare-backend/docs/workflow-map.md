# Workflow Map — Educare app-chat

**Workflow ID:** `iLDio0CFRs2Qa1VM`  
**Status:** Active  
**Total Nodes:** 41  
**Last Updated:** 2026-02-07  
**Source:** MCP (n8n.educareapp.com.br)

---

## Entrypoint

| Node | Type |
|------|------|
| Webhook (Unified Entry) | webhook |

---

## Normalization Block

| Node | Type | Purpose |
|------|------|---------|
| Source Detector | code | Detecta origem (Chatwoot vs Evolution) |
| É humano? | if | Filtra mensagens de bots |
| Router: Source Type | switch | Roteia para extractor correto |
| Chatwoot Extractor | code | Extrai dados do payload Chatwoot |
| Evolution Extractor | code | Extrai dados do payload Evolution |
| Gate: Not Skipped? | if | Verifica se mensagem deve ser processada |
| Router: Input Type | switch | Roteia por tipo (áudio vs texto) |
| Transcribe a recording | openAi | Transcreve áudio para texto |
| Normalize Audio | code | Normaliza resultado da transcrição |

---

## User Validation Block

| Node | Type | Purpose |
|------|------|---------|
| API: Check User | httpRequest | Verifica se usuário existe no Educare |
| Gate: User Exists? | if | Roteia: existe → continua, não → mensagem |
| Gate: Active Sub? | if | Verifica assinatura ativa |
| Prepare: No User Msg | code | Monta mensagem "usuário não encontrado" |
| Prepare: Inactive Msg | code | Monta mensagem "assinatura inativa" |

---

## Intent/Menu Routing Block

| Node | Type | Purpose |
|------|------|---------|
| Engine: Calc Weeks | code | Calcula semanas de desenvolvimento |
| AI Intent Classifier | openAi | **DISABLED** — Classifica intenção via IA |
| Router: Intent Switch | switch | Roteia por intenção detectada |
| Router: Menu Options | switch | Roteia por opção de menu |

---

## API HTTP Request Nodes

| Node | Method | URL Pattern | Issue? |
|------|--------|-------------|--------|
| API: Check User | `={{constants}}` | `constants.educare.api.base_url + endpoints.users_check.path` | Mixed pattern (uses constants object) |
| API: Biometrics | GET | `={{ $vars.EDUCARE_API_URL }}/api/n8n/biometrics/update` | OK ($vars pattern) |
| API: Sleep Log | GET | `={{ $vars.EDUCARE_API_URL }}/api/n8n/sleep/log` | OK ($vars pattern) |
| API: Vaccines | GET | `={{ $vars.EDUCARE_API_URL }}/api/n8n/vaccines/check` | OK ($vars pattern) |
| API: RAG (TitiNauta) | GET | `={{ $vars.EDUCARE_API_URL }}/api/n8n/rag/ask` | OK ($vars pattern) |
| API: Appointments | GET | `={{ $vars.EDUCARE_API_URL }}/api/n8n/appointments/create` | OK ($vars pattern) |
| API: Child Content | GET | `=EDUCARE_API_URL/api/n8n/content/child` | **BROKEN** — missing `{{ $vars. }}` wrapper |
| API: Mother Content | GET | `={{ $vars.EDUCARE_API_URL }}/api/n8n/content/mother` | OK ($vars pattern) |
| Chatwoot: Send Text | GET | `={{ $vars.CHATWOOT_API_URL }}/api/v1/accounts/...` | OK ($vars pattern) |
| Evo: Send Text | GET | `={{ $vars.EVOLUTION_API_URL }}/message/sendText/...` | OK ($vars pattern) |
| Evo: Send Image | GET | `={{ $vars.EVOLUTION_API_URL }}/message/sendMedia/...` | OK ($vars pattern) |
| Evo: Send Audio | GET | `={{ $vars.EVOLUTION_API_URL }}/message/sendWhatsAppAudio/...` | OK ($vars pattern) |
| Evo: Send Document | GET | `={{ $vars.EVOLUTION_API_URL }}/message/sendMedia/...` | OK ($vars pattern) |

---

## Response/Output Block

| Node | Type | Purpose |
|------|------|---------|
| Prepare Response | code | Monta resposta padronizada |
| Router: Response Source | switch | Roteia por canal (Chatwoot vs Evolution) |
| Chatwoot: Send Text | httpRequest | Envia mensagem via Chatwoot API |
| Router: Evo Output Type | switch | Roteia por tipo de mídia (texto/imagem/áudio/doc) |
| Evo: Send Text | httpRequest | Envia texto via Evolution API |
| Evo: Send Image | httpRequest | Envia imagem via Evolution API |
| Evo: Send Audio | httpRequest | Envia áudio via Evolution API |
| Evo: Send Document | httpRequest | Envia documento via Evolution API |

---

## Fallback/Error Paths

| Node | Type | Purpose |
|------|------|---------|
| Prepare: No User Msg | code | Fallback para usuário não cadastrado |
| Prepare: Inactive Msg | code | Fallback para assinatura inativa |
| Edit Fields → Call 'Agente Lead' | set → executeWorkflow | Redirect para agente de leads (sem cadastro) |
| Edit Fields1 → Call 'Agente Lead - long memory'1 | set → executeWorkflow | Redirect para agente (inativo) |

---

## External Workflow Calls

| Node | Type | Purpose |
|------|------|---------|
| Call 'Agente Lead' | executeWorkflow | Workflow separado para leads não cadastrados |
| Call 'Agente Lead - long memory'1 | executeWorkflow | Workflow para assinatura inativa |

---

## Global Constants

| Node | Type | Purpose |
|------|------|---------|
| Global Constants | globalConstants | Objeto com constantes globais (URLs, endpoints, configs) |

---

## Critical Issues Found

1. **[A1/A4] URL Inconsistency:** `API: Check User` usa `$node["Global Constants"].json.constants...` enquanto os demais usam `$vars.EDUCARE_API_URL` — padrão misto
2. **[A1] URL Broken:** `API: Child Content` tem URL `=EDUCARE_API_URL/api/n8n/content/child` sem `{{ $vars. }}` — **não vai funcionar**
3. **[D4] AI Intent Disabled:** `AI Intent Classifier` está DISABLED mas `Engine: Calc Weeks` ainda conecta a ele — roteamento pode falhar
4. **[D1] Missing Defaults:** Verificar se todos os Switch nodes têm branch default/fallback
5. **[E1] Error Handling:** Nenhum HTTP node parece ter tratamento de erro explícito

---

## Flow Summary (Happy Path)

```
Webhook → Source Detector → É humano? → Router: Source Type
  ├→ Chatwoot Extractor ─┐
  └→ Evolution Extractor ─┤
                          ↓
                  Gate: Not Skipped?
                          ↓
                  Router: Input Type
                    ├→ [audio] Transcribe → Normalize Audio ─┐
                    └→ [text] ──────────────────────────────┤
                                                             ↓
                                                   API: Check User
                                                             ↓
                                                   Gate: User Exists?
                                                     ├→ [yes] Gate: Active Sub?
                                                     │    ├→ [yes] Engine: Calc Weeks → Router: Intent/Menu → APIs → Prepare Response
                                                     │    └→ [no] Prepare: Inactive Msg → Agente Lead
                                                     └→ [no] Prepare: No User Msg → Agente Lead
                                                                                        ↓
                                                                               Prepare Response
                                                                                        ↓
                                                                           Router: Response Source
                                                                             ├→ Chatwoot: Send Text
                                                                             └→ Router: Evo Output Type
                                                                                  ├→ Evo: Send Text
                                                                                  ├→ Evo: Send Image
                                                                                  ├→ Evo: Send Audio
                                                                                  └→ Evo: Send Document
```

---

## Comparison: MCP (Current) vs Local Export (Old)

| Aspect | Current (MCP) | Local (old file) |
|--------|--------------|------------------|
| Nodes | 41 | 81 |
| Structure | Limpa, nomeação semântica | Nomes genéricos (Edit Fields2, If1, etc.) |
| Global Constants | Presente (globalConstants node) | Ausente |
| Source Detection | Unified entry + Source Detector | Múltiplos webhooks |
| AI Intent | Disabled (1 node) | Multiple AI agents |
| Naming | Descritivo (API: Check User, Gate: Active Sub?) | Genérico (HTTP Request1, If2) |

**Conclusão:** O workflow no n8n está significativamente mais avançado que o arquivo local. O arquivo local é uma versão antiga e NÃO deve ser usado como referência.
