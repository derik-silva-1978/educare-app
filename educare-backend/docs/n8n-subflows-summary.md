# n8n Sub-Workflows Summary

## Created Sub-Workflows

### 1. Sub: Buffer Processing (ID: M2O311CIHw8KuO5u)
- **Nodes**: 8
- **Function**: Message buffer with TTL-based concatenation (12s)
- **Flow**: Add → Decision → Gate Ready? → Consume/Wait Prompt
- **Input**: phone, message, EDUCARE_API_URL, EDUCARE_API_KEY, EVOLUTION_API_URL, EVOLUTION_INSTANCE, EVOLUTION_API_KEY
- **Output**: buffer_action ("process" or "wait"), message (combined text if ready)

### 2. Sub: Intent & Flows (ID: 87sV1w208s0MmeCW)
- **Nodes**: 11
- **Function**: Intent classification and specialized flow routing
- **Flow**: Calc Weeks → Intent Classifier → Switch → APIs (Biometrics/Sleep/Vaccines/RAG/Appointments)
- **Input**: phone, message, active_context, EDUCARE_API_URL, EDUCARE_API_KEY
- **Output**: response_text, answer, media_type

### 3. Sub: Response Delivery (ID: XRURisA1LysS7a6m)
- **Nodes**: 6
- **Function**: Response formatting, memory save, and delivery via Evolution/Chatwoot
- **Flow**: Prepare → Save Memory + Router → Evo Send Text → Feedback Check
- **Input**: phone, response_text/answer, source, EDUCARE_API_URL, EVOLUTION_API_URL, etc.
- **Output**: Sent message confirmation

## Main Workflow Refactored Version
- **File**: n8n-main-refactored-with-subflows.json
- **Nodes**: 40 (reduced from 65)
- **Status**: Ready to deploy when n8n DB stabilizes

## How to Activate
1. Wait for n8n DB issues to resolve
2. PUT the refactored workflow via n8n API
3. The sub-workflows are already created and ready
