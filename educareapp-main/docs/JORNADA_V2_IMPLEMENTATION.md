# Implementação da Jornada 2.0

Este documento descreve o processo de implementação da Jornada 2.0 no EducareApp, migrando os dados dos arquivos JSON para tabelas no banco de dados.

## Estrutura de Tabelas

A Jornada 2.0 utiliza as seguintes tabelas:

1. `journey_v2` - Jornadas principais (bebê, mãe)
2. `journey_v2_weeks` - Semanas de cada jornada
3. `journey_v2_topics` - Tópicos de cada semana
4. `journey_v2_quizzes` - Quizzes de cada semana
5. `journey_v2_badges` - Badges/conquistas
6. `user_journey_v2_progress` - Progresso do usuário em cada jornada
7. `user_journey_v2_badges` - Badges conquistadas pelo usuário

## Processo de Implementação

### 1. Criação das Tabelas

As tabelas foram criadas manualmente via SQL usando o script `create-journey-v2-tables.js`:

```javascript
node scripts/create-journey-v2-tables.js
```

### 2. Importação dos Dados

Os dados foram importados dos arquivos JSON usando o script `import-journey-v2-data-fixed.js`:

```javascript
node scripts/import-journey-v2-data-fixed.js
```

### 3. Modelos Sequelize

Foram criados modelos Sequelize para cada tabela:

- `JourneyV2.js`
- `JourneyV2Week.js`
- `JourneyV2Topic.js`
- `JourneyV2Quiz.js`
- `JourneyV2Badge.js`
- `UserJourneyV2Progress.js`
- `UserJourneyV2Badge.js`

### 4. Controllers e Rotas

Foi implementado um controller `journeyV2Controller.js` com os seguintes endpoints:

- `GET /api/journey-v2/journeys` - Listar todas as jornadas
- `GET /api/journey-v2/journeys/:id` - Obter uma jornada específica
- `GET /api/journey-v2/journeys/:journeyId/weeks` - Listar semanas de uma jornada
- `GET /api/journey-v2/weeks/:id` - Obter uma semana específica
- `GET /api/journey-v2/weeks/:weekId/topics` - Listar tópicos de uma semana
- `GET /api/journey-v2/weeks/:weekId/quizzes` - Listar quizzes de uma semana
- `GET /api/journey-v2/users/:userId/progress/:journeyId` - Obter progresso do usuário
- `POST /api/journey-v2/users/:userId/weeks/:weekId/progress` - Atualizar progresso
- `POST /api/journey-v2/users/:userId/badges` - Conceder badge ao usuário
- `GET /api/journey-v2/users/:userId/badges` - Listar badges do usuário

### 5. Frontend

No frontend, foram implementados:

- Serviço `journeyV2Service.ts` para consumir a API
- Hook `useJourneyV2.ts` para gerenciar estado
- Componente `JourneyV2Explorer.tsx` para visualização
- Página `JourneyV2Page.tsx` para roteamento

### 6. Rotas no Frontend

Foram adicionadas as seguintes rotas:

- `/educare-app/journey-v2` - Lista de jornadas
- `/educare-app/journey-v2/:journeyId` - Detalhes de uma jornada
- `/educare-app/journey-v2/:journeyId/:weekId` - Detalhes de uma semana

### 7. Menu de Navegação

Foi adicionado um item "Jornada 2.0" no menu lateral com ícone 🚀.

## Problemas Encontrados e Soluções

1. **Erro nas migrações Sequelize**
   - Solução: Criar tabelas manualmente via SQL

2. **Campo `week` não pode ser nulo**
   - Solução: Usar `month * 100` para representar resumos mensais

3. **Chaves duplicadas em `journey_v2_badges`**
   - Solução: Verificar se a badge já existe antes de criar

## Próximos Passos

1. Adicionar mais funcionalidades à interface de usuário
2. Implementar sistema de notificações para novas jornadas
3. Integrar com o sistema de gamificação existente
