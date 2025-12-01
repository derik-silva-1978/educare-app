/**
 * Utilitário para gerar documentação Swagger para todas as rotas principais
 * Este script adiciona comentários JSDoc para Swagger em todos os arquivos de rotas
 */

const fs = require('fs');
const path = require('path');

// Diretório de rotas
const routesDir = path.join(__dirname, '..', 'routes');

// Esquemas comuns para reutilização
const commonSchemas = {
  User: `/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         role:
 *           type: string
 *           enum: [user, professional, admin, owner]
 *           description: Papel do usuário no sistema
 *         status:
 *           type: string
 *           enum: [active, inactive, pending, blocked]
 *           description: Status da conta do usuário
 *         email_verified:
 *           type: boolean
 *           description: Indica se o email foi verificado
 *         last_login:
 *           type: string
 *           format: date-time
 *           description: Data e hora do último login
 */`,

  Profile: `/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do perfil
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID do usuário associado
 *         name:
 *           type: string
 *           description: Nome do perfil
 *         type:
 *           type: string
 *           enum: [personal, professional, parent]
 *           description: Tipo do perfil
 *         phone:
 *           type: string
 *           description: Número de telefone
 *         address:
 *           type: string
 *           description: Endereço
 *         city:
 *           type: string
 *           description: Cidade
 *         state:
 *           type: string
 *           description: Estado
 *         country:
 *           type: string
 *           description: País
 *         zip_code:
 *           type: string
 *           description: CEP
 *         bio:
 *           type: string
 *           description: Biografia ou descrição
 *         professional_id:
 *           type: string
 *           description: ID profissional (CRM, CRP, etc)
 *         professional_specialty:
 *           type: string
 *           description: Especialidade profissional
 *         is_primary:
 *           type: boolean
 *           description: Indica se é o perfil principal do usuário
 *         is_verified:
 *           type: boolean
 *           description: Indica se o perfil foi verificado
 */`,

  Child: `/**
 * @swagger
 * components:
 *   schemas:
 *     Child:
 *       type: object
 *       required:
 *         - name
 *         - birthdate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da criança
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID do usuário responsável
 *         name:
 *           type: string
 *           description: Nome da criança
 *         birthdate:
 *           type: string
 *           format: date
 *           description: Data de nascimento
 *         gender:
 *           type: string
 *           enum: [male, female, other, not_specified]
 *           description: Gênero da criança
 *         photo_url:
 *           type: string
 *           description: URL da foto
 *         notes:
 *           type: string
 *           description: Observações gerais
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *           description: Documentos associados
 *         development_notes:
 *           type: array
 *           items:
 *             type: object
 *           description: Notas de desenvolvimento
 */`,

  SubscriptionPlan: `/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionPlan:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - currency
 *         - billing_cycle
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do plano de assinatura
 *         name:
 *           type: string
 *           description: Nome do plano
 *         description:
 *           type: string
 *           description: Descrição detalhada do plano
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do plano
 *         currency:
 *           type: string
 *           description: Moeda do preço (ex: BRL, USD)
 *         billing_cycle:
 *           type: string
 *           enum: [monthly, yearly]
 *           description: Ciclo de cobrança
 *         trial_days:
 *           type: integer
 *           description: Dias de teste gratuito
 *         features:
 *           type: object
 *           description: Recursos incluídos no plano
 *         limits:
 *           type: object
 *           description: Limites do plano (ex: número máximo de crianças)
 *         is_active:
 *           type: boolean
 *           description: Indica se o plano está ativo
 *         is_public:
 *           type: boolean
 *           description: Indica se o plano é visível publicamente
 */`,

  Subscription: `/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da assinatura
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID do usuário assinante
 *         plan_id:
 *           type: string
 *           format: uuid
 *           description: ID do plano de assinatura
 *         status:
 *           type: string
 *           enum: [active, canceled, expired, trial, pending]
 *           description: Status da assinatura
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Data de início da assinatura
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Data de término da assinatura
 *         trial_end_date:
 *           type: string
 *           format: date-time
 *           description: Data de término do período de teste
 *         payment_method:
 *           type: string
 *           description: Método de pagamento
 *         payment_details:
 *           type: object
 *           description: Detalhes do pagamento
 *         auto_renew:
 *           type: boolean
 *           description: Indica se a assinatura renova automaticamente
 */`,

  Quiz: `/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do quiz
 *         title:
 *           type: string
 *           description: Título do quiz
 *         description:
 *           type: string
 *           description: Descrição do quiz
 *         type:
 *           type: string
 *           enum: [assessment, survey, educational, developmental]
 *           description: Tipo do quiz
 *         category:
 *           type: string
 *           description: Categoria do quiz
 *         age_range_min:
 *           type: integer
 *           description: Idade mínima recomendada (em meses)
 *         age_range_max:
 *           type: integer
 *           description: Idade máxima recomendada (em meses)
 *         estimated_time:
 *           type: integer
 *           description: Tempo estimado para conclusão (em minutos)
 *         is_active:
 *           type: boolean
 *           description: Indica se o quiz está ativo
 *         is_public:
 *           type: boolean
 *           description: Indica se o quiz é público
 *         created_by:
 *           type: string
 *           format: uuid
 *           description: ID do usuário que criou o quiz
 */`,

  Journey: `/**
 * @swagger
 * components:
 *   schemas:
 *     Journey:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da jornada
 *         name:
 *           type: string
 *           description: Nome da jornada
 *         description:
 *           type: string
 *           description: Descrição da jornada
 *         type:
 *           type: string
 *           enum: [development, educational, therapeutic]
 *           description: Tipo da jornada
 *         category:
 *           type: string
 *           description: Categoria da jornada
 *         age_range_min:
 *           type: integer
 *           description: Idade mínima recomendada (em meses)
 *         age_range_max:
 *           type: integer
 *           description: Idade máxima recomendada (em meses)
 *         steps:
 *           type: array
 *           description: Etapas da jornada
 *         duration:
 *           type: integer
 *           description: Duração estimada (em dias)
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Nível de dificuldade
 *         is_active:
 *           type: boolean
 *           description: Indica se a jornada está ativa
 *         is_public:
 *           type: boolean
 *           description: Indica se a jornada é pública
 */`,

  Achievement: `/**
 * @swagger
 * components:
 *   schemas:
 *     Achievement:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da conquista
 *         name:
 *           type: string
 *           description: Nome da conquista
 *         description:
 *           type: string
 *           description: Descrição da conquista
 *         type:
 *           type: string
 *           enum: [milestone, badge, reward]
 *           description: Tipo da conquista
 *         category:
 *           type: string
 *           description: Categoria da conquista
 *         icon_url:
 *           type: string
 *           description: URL do ícone da conquista
 *         points:
 *           type: integer
 *           description: Pontos atribuídos à conquista
 *         conditions:
 *           type: object
 *           description: Condições para obter a conquista
 *         is_active:
 *           type: boolean
 *           description: Indica se a conquista está ativa
 */`
};

// Tags para cada grupo de rotas
const routeTags = {
  authRoutes: `/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para autenticação e gerenciamento de usuários
 */`,
  userRoutes: `/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */`,
  profileRoutes: `/**
 * @swagger
 * tags:
 *   name: Perfis
 *   description: Gerenciamento de perfis de usuário
 */`,
  childRoutes: `/**
 * @swagger
 * tags:
 *   name: Crianças
 *   description: Gerenciamento de perfis de crianças
 */`,
  subscriptionPlanRoutes: `/**
 * @swagger
 * tags:
 *   name: Planos de Assinatura
 *   description: Gerenciamento de planos de assinatura
 */`,
  subscriptionRoutes: `/**
 * @swagger
 * tags:
 *   name: Assinaturas
 *   description: Gerenciamento de assinaturas de usuários
 */`,
  quizRoutes: `/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Gerenciamento de quizzes e avaliações
 */`,
  journeyRoutes: `/**
 * @swagger
 * tags:
 *   name: Jornadas
 *   description: Gerenciamento de jornadas de desenvolvimento
 */`,
  achievementRoutes: `/**
 * @swagger
 * tags:
 *   name: Conquistas
 *   description: Gerenciamento de conquistas e recompensas
 */`
};

// Mapeamento de rotas para esquemas
const routeSchemaMap = {
  authRoutes: ['User'],
  userRoutes: ['User', 'Profile'],
  profileRoutes: ['Profile', 'User'],
  childRoutes: ['Child', 'User'],
  subscriptionPlanRoutes: ['SubscriptionPlan'],
  subscriptionRoutes: ['Subscription', 'SubscriptionPlan', 'User'],
  quizRoutes: ['Quiz', 'User'],
  journeyRoutes: ['Journey', 'User'],
  achievementRoutes: ['Achievement', 'User']
};

// Função para adicionar documentação Swagger a um arquivo de rotas
function addSwaggerDocsToRouteFile(filePath, fileName) {
  // Lê o conteúdo do arquivo
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Verifica se o arquivo já tem documentação Swagger
  if (fileContent.includes('@swagger')) {
    console.log(`${fileName} já possui documentação Swagger.`);
    return;
  }
  
  // Obtém o nome base do arquivo sem extensão
  const baseName = path.basename(fileName, '.js');
  
  // Prepara a documentação a ser adicionada
  let swaggerDocs = '';
  
  // Adiciona os esquemas relevantes
  if (routeSchemaMap[baseName]) {
    routeSchemaMap[baseName].forEach(schema => {
      swaggerDocs += commonSchemas[schema] + '\n\n';
    });
  }
  
  // Adiciona a tag para o grupo de rotas
  if (routeTags[baseName]) {
    swaggerDocs += routeTags[baseName] + '\n\n';
  }
  
  // Encontra a posição após as importações para inserir a documentação
  const importEndIndex = fileContent.lastIndexOf('require(');
  const importEndLineIndex = fileContent.indexOf(';', importEndIndex) + 1;
  
  // Insere a documentação após as importações
  const updatedContent = 
    fileContent.substring(0, importEndLineIndex) + 
    '\n\n' + swaggerDocs + 
    fileContent.substring(importEndLineIndex);
  
  // Escreve o conteúdo atualizado no arquivo
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Documentação Swagger adicionada a ${fileName}`);
}

// Função principal para processar todos os arquivos de rotas
function processRouteFiles() {
  // Lê todos os arquivos no diretório de rotas
  const files = fs.readdirSync(routesDir);
  
  // Filtra apenas os arquivos JavaScript
  const jsFiles = files.filter(file => file.endsWith('.js'));
  
  // Processa cada arquivo
  jsFiles.forEach(file => {
    const filePath = path.join(routesDir, file);
    addSwaggerDocsToRouteFile(filePath, file);
  });
  
  console.log('Processamento concluído!');
}

// Executa o processamento
processRouteFiles();
