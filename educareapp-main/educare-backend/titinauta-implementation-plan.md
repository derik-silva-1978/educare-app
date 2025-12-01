# Plano de Implementação do Novo Layout do TitiNauta

## Visão Geral
Este documento detalha o plano para adaptar o layout visual do TitiNauta da versão em `@educare-backend\titnautav2_para analise\Titinauta-main` para o TitiNauta existente, mantendo toda a infraestrutura atual de APIs e banco de dados.

## Objetivos
- Implementar a nova interface visual do TitiNauta
- Manter compatibilidade com as APIs existentes
- Preservar a estrutura de dados atual
- Melhorar a experiência do usuário

## Cronograma de Implementação

### Fase 1: Análise e Preparação (1 semana)
- [x] Analisar o código do layout de referência
- [ ] Mapear componentes visuais a serem implementados
- [ ] Identificar pontos de integração com APIs existentes
- [ ] Criar estrutura de arquivos para os novos componentes

### Fase 2: Desenvolvimento do Frontend (2-3 semanas)
- [ ] Implementar componente de chat estilo WhatsApp
- [ ] Desenvolver cabeçalho com informações da criança
- [ ] Criar sistema de exibição de mensagens
- [ ] Implementar componentes interativos (quiz, opções de resposta)
- [ ] Adaptar para consumir dados das APIs existentes
- [ ] Implementar sistema de progresso visual

### Fase 3: Testes (1 semana)
- [ ] Realizar testes de integração com APIs
- [ ] Verificar funcionamento com dados reais
- [ ] Testar em diferentes dispositivos e navegadores
- [ ] Validar fluxos de usuário

### Fase 4: Lançamento (1 semana)
- [ ] Implementar feature flag para lançamento gradual
- [ ] Configurar monitoramento
- [ ] Realizar lançamento para grupo piloto
- [ ] Expandir acesso para todos os usuários
- [ ] Monitorar e resolver problemas

## Componentes a Implementar

### 1. Chat Container
- Layout principal do chat
- Sistema de rolagem e histórico
- Exibição de data/hora

### 2. Header do Chat
- Avatar do TitiNauta
- Informações da criança (nome, idade)
- Indicador de status (online)
- Barra de progresso

### 3. Mensagem do Bot
- Estilo de bolha para mensagens do TitiNauta
- Suporte para diferentes tipos de conteúdo (texto, imagem)
- Animação de digitação

### 4. Mensagem do Usuário
- Estilo de bolha para mensagens do usuário
- Indicador de status (enviado, lido)

### 5. Input de Mensagem
- Campo de texto para digitação
- Botão de envio
- Opções de resposta pré-definidas (para quiz)

### 6. Componentes de Quiz
- Exibição de perguntas
- Opções de resposta clicáveis
- Feedback visual para respostas

## Integrações com APIs Existentes

### API de Conteúdo
- Endpoint: `/api/journey/:childId`
- Uso: Buscar conteúdo da jornada baseado na idade da criança

### API de Progresso
- Endpoint: `/api/progress/:childId`
- Uso: Salvar progresso do usuário na jornada

### API de Quiz
- Endpoint: `/api/quiz/:quizId`
- Uso: Buscar perguntas e opções de resposta

### API de Respostas
- Endpoint: `/api/quiz/:quizId/answers`
- Uso: Salvar respostas do usuário

## Recursos Necessários
- 1 Desenvolvedor Frontend (principal)
- 1 Desenvolvedor Backend (suporte parcial)
- 1 Tester
- Acesso ao ambiente de desenvolvimento

## Riscos e Mitigações
| Risco | Mitigação |
|-------|-----------|
| Incompatibilidade com formato de dados | Criar adaptadores para formatar dados |
| Problemas de desempenho | Implementar carregamento lazy e paginação |
| Bugs em dispositivos específicos | Testar em múltiplos dispositivos |

## Próximos Passos Imediatos
1. Criar estrutura de arquivos para os novos componentes
2. Implementar componente base de chat
3. Desenvolver protótipo funcional com dados mockados
4. Integrar com APIs existentes

---
Data de início: 08/10/2025
Data prevista de conclusão: 15/11/2025
