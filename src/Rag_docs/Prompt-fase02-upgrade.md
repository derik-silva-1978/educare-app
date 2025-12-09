# FASE 2-UPGRADE — DEFINIÇÃO FORMAL DA NOVA ARQUITETURA E DOS COMPONENTES A SEREM CRIADOS
## Objetivo: Com base no diagnóstico da Fase 1-UPGRADE, você (Replit) deve agora DEFINIR a arquitetura
final da segmentação da Base de Conhecimento do Educare+ e planejar tecnicamente os novos componentes
que serão adicionados.  
**Nenhuma implementação de código ainda deve ser feita nesta fase.**  
Apenas definição, planejamento e validação arquitetural.

---

# 🔒 REGRA DE OURO — NÃO IMPLEMENTAR NADA
Nesta fase:

❌ Não criar arquivos  
❌ Não modificar serviços existentes  
❌ Não alterar rotas  
❌ Não mexer no banco  
❌ Não criar migrations  

Apenas **desenhar, documentar e propor a arquitetura final**.

---

# 🎯 1. OBJETIVOS DA FASE 2-UPGRADE

Você deve:

1. **Definir a arquitetura final da segmentação da Base Vetorial**, contendo:
   - kb_baby  
   - kb_mother  
   - kb_professional  

2. **Definir a camada de seleção de base (Knowledge Base Selector)**  
   Essa camada será responsável por decidir qual tabela vetorial será consultada, com base em:
   - módulo do usuário (bebê, mãe, profissional)
   - rota que acionou o RAG
   - parâmetros enviados no request

3. **Definir o fluxo de ingestão segmentada**, mantendo:
   - compatibilidade total com o fluxo já implementado  
   - reaproveitamento máximo do pipeline existente  
   - integração com a tela do Super Admin  
   - integração futura via API

4. **Definir a nova estrutura de dados das tabelas vetoriais**, garantindo:
   - mesmo padrão da tabela atual  
   - campos adicionais necessários  
   - segurança para evolução futura  

5. **Definir o novo comportamento do RAGService**, incluindo:
   - seleção dinâmica da base  
   - busca segmentada  
   - fallback controlado  
   - integração com Prompt Management  

6. **Garantir que todas as mudanças são NÃO QUEBRADORAS**, ou seja:
   - compatibilidade retroativa com o RAG já funcionando  
   - nenhuma alteração em rotas ou serviços usados pelo n8n  
   - nenhuma quebra no frontend ou app móvel  
   - zero impacto no usuário final  

7. **Produzir a documentação técnica oficial da nova arquitetura**.

---

# 🧠 2. DEFINIÇÃO DO MODELO DE TABELAS VETORIAIS
Você deve definir a estrutura que será usada nas três tabelas:

- `kb_baby`
- `kb_mother`
- `kb_professional`

Cada tabela deve conter:

| Campo | Tipo | Descrição |
|------|------|-----------|
| id | uuid | identificador único |
| title | text | título do conteúdo |
| content | text | texto completo extraído |
| embedding | vetor | embedding gerado via pipeline |
| category | text | subcategoria, ex.: motor, emocional, PEI |
| tag | text | etiqueta auxiliar |
| age_range (opcional) | text | aplicável ao bebê |
| metadata | jsonb | dados adicionais |
| created_at | timestamp | data de criação |
| updated_at | timestamp | data de atualização |

**Requisitos da fase:**
- Somente especificar a estrutura.  
- Nenhuma migration deve ser gerada agora.

---

# 🔧 3. DEFINIÇÃO DO COMPONENTE “KnowledgeBaseSelector”
Você deve projetar (apenas no papel) um módulo que:

### Entrada:
- tipo do módulo: `baby | mother | professional`
- parâmetros do request
- contexto do usuário (se necessário)

### Saída:
- nome da tabela vetorial apropriada

### Responsabilidades:
- evitar consultas na base errada  
- evitar contaminação entre perfis  
- permitir fallback (base unificada antiga) somente quando necessário  
- ser simples e não quebrar compatibilidade

Nenhuma linha de código deve ser escrita agora.

---

# 🧩 4. DEFINIÇÃO DO PIPELINE DE INGESTÃO SEGMENTADA

## Você deve documentar:

### 4.1. Como o Super Admin selecionará a categoria:
- Bebê  
- Mãe  
- Profissional  

### 4.2. Como isso afeta o pipeline atual:
- extrair texto  
- gerar embedding  
- inserir na tabela correta  
- registrar documento original  

### 4.3. Como manter compatibilidade com a ingestão antiga:
Duas opções devem ser definidas:

- **Modo A:** ingestão antiga continua ativa como fallback  
- **Modo B:** ingestão antiga é migrada gradualmente para bases segmentadas  

Nenhuma implementação ainda.

---

# 📡 5. DEFINIÇÃO DO NOVO FLUXO RAG

Você deve documentar como será:

### 5.1. Entrada do RAG
- parâmetros enviados (moduleType, babyId, motherId etc.)

### 5.2. Seleção da base vetorial
- via KnowledgeBaseSelector

### 5.3. Busca vetorial
- somente na base correspondente

### 5.4. Construção do prompt final
- totalmente compatível com Prompt Management  
- adaptado ao módulo

### 5.5. Saída
- resposta segmentada, precisa e segura

---

# 🔐 6. COMPATIBILIDADE COM PROMPT MANAGEMENT

Você deve:

- garantir que nenhum prompt precisa ser alterado para funcionar  
- confirmar que novos prompts opcionais podem ser criados futuramente por categoria  
- documentar como a arquitetura facilita prompts específicos por módulo  

---

# 🛡️ 7. RESTRIÇÕES DE SEGURANÇA

Nesta fase:

❌ NÃO alterar estrutura do banco  
❌ NÃO criar migrations  
❌ NÃO escrever código novo  
❌ NÃO editar serviços existentes  
❌ NÃO excluir tabela anterior  
❌ NÃO alterar rotas ou controllers  
❌ NÃO mexer no frontend  

Apenas **projeto arquitetural**.

---

# 📄 8. ENTREGÁVEIS OBRIGATÓRIOS DA FASE 2-UPGRADE

Você deve entregar:

### ✔️ 1. Arquitetura final documentada  
- diagrama  
- componentes  
- fluxo  

### ✔️ 2. Estrutura das novas tabelas  
- campos  
- tipos  
- regras  

### ✔️ 3. Especificação do KnowledgeBaseSelector  
- entradas  
- saídas  
- comportamento esperado  

### ✔️ 4. Especificação do pipeline segmentado de ingestão  
- passos  
- interações  
- como mantém compatibilidade  

### ✔️ 5. Especificação da nova lógica RAG  
- chamadas  
- filtros  
- montagem final  

### ✔️ 6. Mapa de compatibilidade retroativa  
- como garantir que nada quebra  

---

# ✔️ OBJETIVO FINAL DA FASE 2-UPGRADE

Ao final desta fase, você terá um **plano técnico completo**, seguro e aprovado para iniciar a implementação real na Fase 3-UPGRADE.

Nenhuma modificação deve ocorrer até a próxima fase.