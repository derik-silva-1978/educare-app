/**
 * Testes Automatizados - API Externa
 * 
 * Para rodar os testes:
 * npm test
 */

const request = require('supertest');
const app = require('../src/server');

// API Key de teste (deve estar no .env)
const API_KEY = process.env.EXTERNAL_API_KEY || 'educare_external_api_key_2025';

describe('API Externa - Autenticação', () => {
  test('Deve rejeitar requisição sem API key', async () => {
    const response = await request(app)
      .get('/api/external/subscription-plans');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('API key');
  });

  test('Deve rejeitar requisição com API key inválida', async () => {
    const response = await request(app)
      .get('/api/external/subscription-plans?api_key=invalid_key');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('Deve aceitar requisição com API key válida via query', async () => {
    const response = await request(app)
      .get(`/api/external/subscription-plans?api_key=${API_KEY}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('Deve aceitar requisição com API key válida via header', async () => {
    const response = await request(app)
      .get('/api/external/subscription-plans')
      .set('X-API-Key', API_KEY);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('API Externa - Planos de Assinatura', () => {
  test('Deve listar planos de assinatura', async () => {
    const response = await request(app)
      .get(`/api/external/subscription-plans?api_key=${API_KEY}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('Planos devem ter estrutura correta', async () => {
    const response = await request(app)
      .get(`/api/external/subscription-plans?api_key=${API_KEY}`);
    
    if (response.body.data.length > 0) {
      const plan = response.body.data[0];
      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('price');
      expect(plan).toHaveProperty('currency');
      expect(plan).toHaveProperty('billing_cycle');
    }
  });
});

describe('API Externa - Usuários', () => {
  let createdUserId = null;

  test('Deve criar usuário com dados válidos', async () => {
    const userData = {
      name: 'Teste API Externa',
      email: `teste_${Date.now()}@example.com`,
      phone: `+5511${Math.floor(Math.random() * 1000000000)}`,
      password: 'senha123',
      role: 'user'
    };

    const response = await request(app)
      .post(`/api/external/users?api_key=${API_KEY}`)
      .send(userData);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toHaveProperty('id');
    expect(response.body.data.user.email).toBe(userData.email);
    
    createdUserId = response.body.data.user.id;
  });

  test('Deve rejeitar criação com email duplicado', async () => {
    const userData = {
      name: 'Teste Duplicado',
      email: 'owner@educareapp.com', // Email já existente
      password: 'senha123'
    };

    const response = await request(app)
      .post(`/api/external/users?api_key=${API_KEY}`)
      .send(userData);
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('já cadastrado');
  });

  test('Deve rejeitar criação sem campos obrigatórios', async () => {
    const userData = {
      name: 'Teste Incompleto'
      // Faltando email e password
    };

    const response = await request(app)
      .post(`/api/external/users?api_key=${API_KEY}`)
      .send(userData);
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('Deve buscar usuário por ID', async () => {
    if (!createdUserId) {
      return; // Skip se não criou usuário
    }

    const response = await request(app)
      .get(`/api/external/users/${createdUserId}?api_key=${API_KEY}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(createdUserId);
  });

  test('Deve retornar 404 para usuário inexistente', async () => {
    const response = await request(app)
      .get(`/api/external/users/00000000-0000-0000-0000-000000000000?api_key=${API_KEY}`);
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});

describe('API Externa - Busca de Usuários', () => {
  test('Deve buscar usuário por telefone', async () => {
    const response = await request(app)
      .get(`/api/external/users/search?api_key=${API_KEY}&phone=+5511999999999`);
    
    // Pode retornar 404 se não existir, mas não deve dar erro 500
    expect([200, 404]).toContain(response.status);
    expect(response.body).toHaveProperty('success');
  });

  test('Deve rejeitar busca sem parâmetros', async () => {
    const response = await request(app)
      .get(`/api/external/users/search?api_key=${API_KEY}`);
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('parâmetro');
  });
});

describe('API Externa - Crianças', () => {
  test('Deve buscar crianças de um usuário', async () => {
    // Usando usuário owner que deve ter crianças
    const response = await request(app)
      .get(`/api/external/users/search/children?api_key=${API_KEY}&phone=+5511999999999`);
    
    // Pode retornar 404 se não existir
    expect([200, 404]).toContain(response.status);
    expect(response.body).toHaveProperty('success');
  });

  test('Estrutura de resposta de crianças deve estar correta', async () => {
    const response = await request(app)
      .get(`/api/external/users/search/children?api_key=${API_KEY}&phone=+5511999999999`);
    
    if (response.status === 200 && response.body.data.children.length > 0) {
      const child = response.body.data.children[0];
      expect(child).toHaveProperty('id');
      expect(child).toHaveProperty('full_name');
      expect(child).toHaveProperty('age_months');
      expect(child).toHaveProperty('age_display');
    }
  });
});

describe('API Externa - Performance', () => {
  test('Endpoint de planos deve responder em menos de 1 segundo', async () => {
    const start = Date.now();
    
    await request(app)
      .get(`/api/external/subscription-plans?api_key=${API_KEY}`);
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });

  test('Busca de usuário deve responder em menos de 2 segundos', async () => {
    const start = Date.now();
    
    await request(app)
      .get(`/api/external/users/search?api_key=${API_KEY}&phone=+5511999999999`);
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });
});

// Cleanup após todos os testes
afterAll(async () => {
  // Fechar conexões do banco de dados se necessário
  // await sequelize.close();
});
