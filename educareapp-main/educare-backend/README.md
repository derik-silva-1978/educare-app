# EducareApp - Backend Customizado

Backend customizado para o EducareApp, desenvolvido com Node.js, Express e PostgreSQL (Sequelize ORM).

## Visão Geral

O backend do EducareApp foi projetado para suportar uma plataforma SaaS de acompanhamento do desenvolvimento infantil e monitoramento da saúde materna. O sistema conecta famílias, educadores e profissionais de saúde, com foco em acompanhamento de marcos do desenvolvimento, intervenções precoces e colaboração.

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM para Node.js
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Criptografia de senhas
- **express-validator** - Validação de dados de entrada

## Estrutura do Projeto

```
educare-backend/
├── src/
│   ├── config/           # Configurações (banco de dados, autenticação)
│   ├── controllers/      # Controladores da aplicação
│   ├── middleware/       # Middlewares (autenticação, validação)
│   ├── models/           # Modelos do Sequelize
│   ├── routes/           # Rotas da API
│   ├── test/             # Testes
│   └── server.js         # Ponto de entrada da aplicação
├── .env                  # Variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo Git
├── package.json          # Dependências e scripts
└── README.md             # Documentação
```

## Principais Funcionalidades

- **Autenticação e Autorização**
  - Registro e login de usuários
  - Autenticação baseada em JWT
  - Controle de acesso baseado em papéis (RBAC)

- **Gestão de Usuários e Perfis**
  - Criação e gerenciamento de perfis
  - Múltiplos perfis por usuário
  - Gerenciamento de crianças associadas a perfis

- **Sistema de Assinaturas (SaaS)**
  - Planos de assinatura com diferentes recursos e limites
  - Gerenciamento de assinaturas
  - Verificação de limites por plano

- **Quizzes e Avaliações**
  - Criação e gerenciamento de quizzes
  - Sessões de quiz com pontuação
  - Análise de resultados

- **Jornadas de Desenvolvimento**
  - Criação e gerenciamento de jornadas
  - Acompanhamento de progresso
  - Etapas personalizadas

- **Sistema de Conquistas**
  - Conquistas baseadas em atividades
  - Gamificação do desenvolvimento infantil
  - Acompanhamento de progresso

- **Equipes e Colaboração**
  - Criação e gerenciamento de equipes
  - Adição de membros com diferentes papéis
  - Compartilhamento de informações

## Modelos de Dados

O backend inclui os seguintes modelos principais:

- **User** - Usuários do sistema
- **Profile** - Perfis associados a usuários
- **Child** - Crianças associadas a perfis
- **Team** - Equipes para colaboração
- **TeamMember** - Membros de equipes
- **License** - Licenças de uso
- **SubscriptionPlan** - Planos de assinatura
- **Subscription** - Assinaturas de usuários
- **Quiz** - Quizzes de avaliação
- **Question** - Perguntas de quizzes
- **QuizSession** - Sessões de quiz
- **Answer** - Respostas de sessões
- **Journey** - Jornadas de desenvolvimento
- **UserJourney** - Progresso em jornadas
- **Achievement** - Conquistas disponíveis
- **UserAchievement** - Conquistas de usuários

## Configuração

### Pré-requisitos

- Node.js (v14+)
- PostgreSQL (v12+)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Servidor
PORT=3001
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=educareapp
DB_USER=postgres
DB_PASSWORD=suasenha

# JWT
JWT_SECRET=seu_segredo_jwt
JWT_EXPIRES_IN=24h

# Email (opcional)
EMAIL_HOST=smtp.exemplo.com
EMAIL_PORT=587
EMAIL_USER=seu_email@exemplo.com
EMAIL_PASS=sua_senha
```

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/educareapp.git
cd educareapp/educare-backend
```

2. Instale as dependências
```bash
npm install
```

3. Configure o banco de dados
```bash
# Crie o banco de dados no PostgreSQL
createdb educareapp
```

4. Inicie o servidor
```bash
npm run dev
```

## Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/verify` - Verificar token JWT
- `POST /api/auth/forgot-password` - Solicitar redefinição de senha
- `POST /api/auth/reset-password` - Redefinir senha

### Usuários

- `GET /api/users` - Listar usuários (admin)
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário

### Perfis

- `GET /api/profiles/me` - Obter perfil do usuário logado
- `PUT /api/profiles/me` - Atualizar perfil do usuário logado
- `GET /api/profiles/:id` - Obter perfil por ID
- `PUT /api/profiles/:id` - Atualizar perfil (admin)

### Crianças

- `GET /api/children` - Listar crianças do usuário
- `POST /api/children` - Criar nova criança
- `GET /api/children/:id` - Obter criança por ID
- `PUT /api/children/:id` - Atualizar criança
- `DELETE /api/children/:id` - Excluir criança

### Planos de Assinatura

- `GET /api/subscription-plans/public` - Listar planos públicos
- `GET /api/subscription-plans` - Listar todos os planos (admin)
- `POST /api/subscription-plans` - Criar plano (admin)
- `PUT /api/subscription-plans/:id` - Atualizar plano (admin)
- `DELETE /api/subscription-plans/:id` - Excluir plano (admin)

### Assinaturas

- `GET /api/subscriptions/me` - Listar assinaturas do usuário
- `GET /api/subscriptions/me/active` - Obter assinatura ativa
- `POST /api/subscriptions` - Criar assinatura
- `POST /api/subscriptions/:id/cancel` - Cancelar assinatura
- `POST /api/subscriptions/:id/change-plan` - Mudar plano

### Quizzes

- `GET /api/quizzes` - Listar quizzes disponíveis
- `GET /api/quizzes/:id` - Obter quiz por ID
- `POST /api/quizzes` - Criar quiz (admin/professional)
- `PUT /api/quizzes/:id` - Atualizar quiz
- `DELETE /api/quizzes/:id` - Excluir quiz
- `POST /api/quizzes/sessions` - Iniciar sessão de quiz
- `POST /api/quizzes/sessions/:sessionId/submit` - Submeter respostas

### Jornadas

- `GET /api/journeys` - Listar jornadas disponíveis
- `GET /api/journeys/:id` - Obter jornada por ID
- `POST /api/journeys` - Criar jornada (admin/professional)
- `PUT /api/journeys/:id` - Atualizar jornada
- `DELETE /api/journeys/:id` - Excluir jornada
- `POST /api/journeys/start` - Iniciar jornada
- `PUT /api/journeys/progress/:id` - Atualizar progresso
- `GET /api/journeys/child/:childId` - Listar jornadas de uma criança

### Conquistas

- `GET /api/achievements` - Listar conquistas disponíveis
- `GET /api/achievements/:id` - Obter conquista por ID
- `POST /api/achievements` - Criar conquista (admin)
- `PUT /api/achievements/:id` - Atualizar conquista (admin)
- `DELETE /api/achievements/:id` - Excluir conquista (admin)
- `POST /api/achievements/award` - Atribuir conquista
- `GET /api/achievements/child/:childId` - Listar conquistas de uma criança
- `PATCH /api/achievements/:id/viewed` - Marcar como visualizada

## Scripts

- `npm run dev` - Iniciar servidor em modo desenvolvimento
- `npm start` - Iniciar servidor em modo produção
- `npm test` - Executar testes
- `npm run lint` - Verificar estilo de código

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
