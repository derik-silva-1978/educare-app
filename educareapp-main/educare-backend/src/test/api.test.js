const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

// Testes básicos para verificar se as rotas estão funcionando
describe('API Routes', () => {
  // Teste da rota raiz
  describe('GET /', () => {
    it('deve retornar uma mensagem de boas-vindas', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('Bem-vindo à API do EducareApp!');
    });
  });

  // Teste da rota de status da API
  describe('GET /api/status', () => {
    it('deve retornar o status da API', async () => {
      const res = await request(app).get('/api/status');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status');
      expect(res.body.status).toEqual('online');
    });
  });

  // Teste da rota de registro de usuário
  describe('POST /api/auth/register', () => {
    it('deve validar os campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'teste',
          password: '123',
          name: ''
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // Teste da rota de login
  describe('POST /api/auth/login', () => {
    it('deve validar os campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'teste',
          password: ''
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // Teste da rota de planos de assinatura públicos
  describe('GET /api/subscription-plans/public', () => {
    it('deve retornar a lista de planos públicos', async () => {
      const res = await request(app).get('/api/subscription-plans/public');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('plans');
      expect(Array.isArray(res.body.plans)).toBeTruthy();
    });
  });
});

// Fechar a conexão com o banco de dados após os testes
afterAll(async () => {
  await db.close();
});
