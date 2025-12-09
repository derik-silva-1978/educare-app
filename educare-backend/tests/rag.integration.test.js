/**
 * RAG Integration Tests
 * Testes end-to-end da arquitetura segmentada
 */

const ragService = require('../src/services/ragService');
const migrationService = require('../src/services/migrationService');
const ragMetricsService = require('../src/services/ragMetricsService');
const { sequelize } = require('../src/config/database');

describe('RAG Integration Tests', () => {
  beforeEach(() => {
    ragMetricsService.reset();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Knowledge Base Selection', () => {
    test('Seleciona kb_baby para module_type=baby', async () => {
      const result = await ragService.selectKnowledgeDocuments({
        module_type: 'baby',
        limit: 5
      });

      expect(result.success).toBe(true);
      expect(result.metadata).toHaveProperty('primary_table');
      expect(['kb_baby', 'knowledge_documents']).toContain(result.metadata.primary_table);
    });

    test('Seleciona kb_mother para module_type=mother', async () => {
      const result = await ragService.selectKnowledgeDocuments({
        module_type: 'mother',
        limit: 5
      });

      expect(result.success).toBe(true);
      expect(['kb_mother', 'knowledge_documents']).toContain(result.metadata.primary_table);
    });

    test('Seleciona kb_professional para module_type=professional', async () => {
      const result = await ragService.selectKnowledgeDocuments({
        module_type: 'professional',
        limit: 5
      });

      expect(result.success).toBe(true);
      expect(['kb_professional', 'knowledge_documents']).toContain(result.metadata.primary_table);
    });

    test('Fallback para knowledge_documents quando base primária vazia', async () => {
      const result = await ragService.selectKnowledgeDocuments({
        module_type: 'baby',
        limit: 1
      });

      expect(result.success).toBe(true);
      expect(['kb_baby', 'knowledge_documents']).toContain(result.metadata.used_table);
    });

    test('Força uso de legacy com force_legacy=true', async () => {
      const result = await ragService.selectKnowledgeDocuments({
        module_type: 'baby',
        force_legacy: true,
        limit: 5
      });

      expect(result.success).toBe(true);
      expect(result.metadata.primary_table).toBe('knowledge_documents');
    });
  });

  describe('RAG Ask Functionality', () => {
    test('Retorna resposta para pergunta simples', async () => {
      const result = await ragService.ask('Qual é a importância do brincar no desenvolvimento?', {
        module_type: 'baby'
      });

      expect(result.success).toBe(true);
      expect(result.answer).toBeTruthy();
      expect(result.metadata).toHaveProperty('processing_time_ms');
    });

    test('Registra query nas métricas', async () => {
      ragMetricsService.reset();

      await ragService.ask('Teste de métrica', { module_type: 'baby' });

      const aggregates = ragMetricsService.getAggregates();
      expect(aggregates.data.aggregated.total_queries).toBeGreaterThan(0);
    });

    test('Registra erro quando OpenAI não configurado', async () => {
      const apiKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const result = await ragService.ask('Teste', { module_type: 'baby' });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();

      process.env.OPENAI_API_KEY = apiKey;
    });
  });

  describe('Metrics Collection', () => {
    test('Coleta metadata completa de query bem-sucedida', async () => {
      ragMetricsService.reset();

      const result = await ragService.ask('Teste de coleta', { module_type: 'baby' });

      const recent = ragMetricsService.getRecentQueries(1);
      expect(recent.recent.length).toBeGreaterThan(0);

      const query = recent.recent[0];
      expect(query).toHaveProperty('success');
      expect(query).toHaveProperty('response_time_ms');
      expect(query).toHaveProperty('knowledge_base');
    });

    test('Retorna health check com status válido', () => {
      ragMetricsService.reset();

      // Registra algumas queries
      ragMetricsService.recordQuery({
        question: 'Teste 1',
        module_type: 'baby',
        success: true,
        response_time_ms: 2000,
        documents_found: 3,
        file_search_used: true,
        chunks_retrieved: 2
      });

      const health = ragMetricsService.getHealthCheck();
      expect(health.status).toMatch(/healthy|degraded|unhealthy|no-data/);
      expect(health.metrics).toHaveProperty('success_rate_percent');
    });

    test('Calcula estatísticas por módulo corretamente', () => {
      ragMetricsService.reset();

      ragMetricsService.recordQuery({
        question: 'Teste baby',
        module_type: 'baby',
        success: true,
        response_time_ms: 2000,
        documents_found: 2
      });

      ragMetricsService.recordQuery({
        question: 'Teste mother',
        module_type: 'mother',
        success: true,
        response_time_ms: 2500,
        documents_found: 1
      });

      const stats = ragMetricsService.getModuleStats();
      expect(stats.data.baby.count).toBe(1);
      expect(stats.data.mother.count).toBe(1);
      expect(stats.data.baby.avg_response_time_ms).toBe(2000);
    });
  });

  describe('Migration Workflow', () => {
    test('Classifica documentos corretamente', async () => {
      const result = await migrationService.analyzeAndClassifyDocuments();

      expect(result.success).toBe(true);
      expect(result.classification).toHaveProperty('baby_count');
      expect(result.classification).toHaveProperty('mother_count');
      expect(result.classification).toHaveProperty('professional_count');
    });

    test('Valida integridade após análise', async () => {
      const result = await migrationService.validateMigration();

      expect(result.success).toBe(true);
      expect(result.migration_status).toHaveProperty('documents_in_legacy');
      expect(result.migration_status).toHaveProperty('documents_in_segmented');
      expect(result.recommendations).toBeInstanceOf(Array);
    });
  });

  describe('Backward Compatibility', () => {
    test('askSimple funciona com nova arquitetura', async () => {
      const result = await ragService.askSimple('Teste de compatibilidade');

      expect(result.success).toBe(true);
      expect(result.answer).toBeTruthy();
    });

    test('askWithBabyId força módulo baby', async () => {
      ragMetricsService.reset();

      const result = await ragService.askWithBabyId('Teste', 'baby-123');

      expect(result.success).toBe(true);

      const recent = ragMetricsService.getRecentQueries(1);
      expect(recent.recent[0].module_type).toBe('baby');
    });

    test('Endpoints RAG antigos continuam funcionando', async () => {
      const result = await ragService.ask('Teste compatibilidade antecedente', {
        age_range: '0-6 months',
        domain: 'motor'
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('Trata erro de pergunta vazia graciosamente', async () => {
      const result = await ragService.ask('', { module_type: 'baby' });

      expect(result).toHaveProperty('success');
    });

    test('Recupera de falha de File Search', async () => {
      const result = await ragService.ask('Teste recuperação', {
        module_type: 'baby',
        use_file_search: false
      });

      expect(result.success).toBe(true);
      expect(result.metadata.file_search_used).toBe(false);
    });

    test('Registra erro nas métricas quando falha', async () => {
      ragMetricsService.reset();

      // Força erro desligando OpenAI
      const apiKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      await ragService.ask('Teste erro', { module_type: 'baby' });

      const aggregates = ragMetricsService.getAggregates();
      expect(aggregates.data.aggregated.error_count).toBeGreaterThan(0);

      process.env.OPENAI_API_KEY = apiKey;
    });
  });
});
