const axios = require('axios');
require('dotenv').config();

// URL base da API
const API_URL = 'http://localhost:3001';

// Chave de API definida no .env
const API_KEY = process.env.EXTERNAL_API_KEY;

// Função para testar o endpoint de planos de assinatura
async function testSubscriptionPlansEndpoint() {
  try {
    console.log('Testando endpoint de planos de assinatura...');
    console.log(`URL: ${API_URL}/api/external/subscription-plans?api_key=${API_KEY}`);
    
    const response = await axios.get(`${API_URL}/api/external/subscription-plans`, {
      params: {
        api_key: API_KEY
      }
    });
    
    console.log('\nResposta do servidor:');
    console.log('Status:', response.status);
    console.log('Dados:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('\nErro ao testar endpoint:');
    
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor. Verifique se o servidor está rodando.');
    } else {
      // Erro ao configurar a requisição
      console.error('Erro:', error.message);
    }
    
    return false;
  }
}

// Função para testar o endpoint de listar usuários
async function testListUsersEndpoint() {
  try {
    console.log('\nTestando endpoint de listar usuários...');
    console.log(`URL: ${API_URL}/api/external/users?api_key=${API_KEY}`);
    
    const response = await axios.get(`${API_URL}/api/external/users`, {
      params: {
        api_key: API_KEY
      }
    });
    
    console.log('\nResposta do servidor:');
    console.log('Status:', response.status);
    console.log('Total de usuários:', response.data.data.length);
    console.log('Primeiro usuário:');
    
    if (response.data.data.length > 0) {
      const firstUser = response.data.data[0];
      console.log(JSON.stringify({
        id: firstUser.id,
        name: firstUser.name,
        email: firstUser.email,
        phone: firstUser.phone || 'Não informado',
        profile: firstUser.profile ? {
          phone: firstUser.profile.phone || 'Não informado'
        } : null
      }, null, 2));
    } else {
      console.log('Nenhum usuário encontrado');
    }
    
    return true;
  } catch (error) {
    console.error('\nErro ao testar endpoint de usuários:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor. Verifique se o servidor está rodando.');
    } else {
      console.error('Erro:', error.message);
    }
    
    return false;
  }
}

// Função para testar o endpoint de buscar usuário por ID
async function testGetUserByIdEndpoint() {
  try {
    // Primeiro, vamos buscar um ID de usuário válido
    console.log('\nBuscando um ID de usuário válido...');
    
    const usersResponse = await axios.get(`${API_URL}/api/external/users`, {
      params: {
        api_key: API_KEY
      }
    });
    
    if (usersResponse.data.data.length === 0) {
      console.log('Nenhum usuário encontrado para testar o endpoint de busca por ID');
      return false;
    }
    
    const userId = usersResponse.data.data[0].id;
    
    console.log(`\nTestando endpoint de buscar usuário por ID (${userId})...`);
    console.log(`URL: ${API_URL}/api/external/users/${userId}?api_key=${API_KEY}`);
    
    const response = await axios.get(`${API_URL}/api/external/users/${userId}`, {
      params: {
        api_key: API_KEY
      }
    });
    
    console.log('\nResposta do servidor:');
    console.log('Status:', response.status);
    console.log('Dados do usuário:');
    
    const user = response.data.data;
    console.log(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || 'Não informado',
      profile: user.profile ? {
        phone: user.profile.phone || 'Não informado'
      } : null
    }, null, 2));
    
    return true;
  } catch (error) {
    console.error('\nErro ao testar endpoint de buscar usuário por ID:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor. Verifique se o servidor está rodando.');
    } else {
      console.error('Erro:', error.message);
    }
    
    return false;
  }
}

// Função para testar o endpoint de buscar filhos de um usuário
async function testGetUserChildrenEndpoint() {
  try {
    // Primeiro, vamos buscar um ID de usuário válido
    console.log('\nBuscando um ID de usuário válido para testar filhos...');
    
    const usersResponse = await axios.get(`${API_URL}/api/external/users`, {
      params: {
        api_key: API_KEY
      }
    });
    
    if (usersResponse.data.data.length === 0) {
      console.log('Nenhum usuário encontrado para testar o endpoint de filhos');
      return false;
    }
    
    const userId = usersResponse.data.data[0].id;
    
    console.log(`\nTestando endpoint de buscar filhos do usuário (${userId})...`);
    console.log(`URL: ${API_URL}/api/external/users/${userId}/children?api_key=${API_KEY}`);
    
    const response = await axios.get(`${API_URL}/api/external/users/${userId}/children`, {
      params: {
        api_key: API_KEY
      }
    });
    
    console.log('\nResposta do servidor:');
    console.log('Status:', response.status);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`Total de filhos encontrados: ${response.data.data.length}`);
      console.log('Primeiro filho:');
      console.log(JSON.stringify(response.data.data[0], null, 2));
    } else {
      console.log('Mensagem:', response.data.message || 'Nenhum filho encontrado');
    }
    
    // Se encontrou filhos, vamos testar o endpoint de buscar criança por ID
    if (response.data.data && response.data.data.length > 0) {
      const childId = response.data.data[0].id;
      await testGetChildByIdEndpoint(childId);
    }
    
    return true;
  } catch (error) {
    console.error('\nErro ao testar endpoint de buscar filhos do usuário:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor. Verifique se o servidor está rodando.');
    } else {
      console.error('Erro:', error.message);
    }
    
    return false;
  }
}

// Função para testar o endpoint de buscar criança por ID
async function testGetChildByIdEndpoint(childId) {
  try {
    if (!childId) {
      console.log('\nNenhum ID de criança fornecido para testar o endpoint');
      return false;
    }
    
    console.log(`\nTestando endpoint de buscar criança por ID (${childId})...`);
    console.log(`URL: ${API_URL}/api/external/children/${childId}?api_key=${API_KEY}`);
    
    const response = await axios.get(`${API_URL}/api/external/children/${childId}`, {
      params: {
        api_key: API_KEY
      }
    });
    
    console.log('\nResposta do servidor:');
    console.log('Status:', response.status);
    console.log('Dados da criança:');
    console.log(JSON.stringify(response.data.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('\nErro ao testar endpoint de buscar criança por ID:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor. Verifique se o servidor está rodando.');
    } else {
      console.error('Erro:', error.message);
    }
    
    return false;
  }
}

// Função para testar com API key inválida
async function testInvalidApiKey() {
  try {
    console.log('\nTestando com API key inválida...');
    
    const response = await axios.get(`${API_URL}/api/external/subscription-plans`, {
      params: {
        api_key: 'chave_invalida'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Dados:', response.data);
    
    return true;
  } catch (error) {
    console.log('\nErro esperado com API key inválida:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', error.response.data);
      return error.response.status === 401; // Deve retornar 401 Unauthorized
    }
    
    console.error('Erro inesperado:', error.message);
    return false;
  }
}

// Função para testar sem API key
async function testNoApiKey() {
  try {
    console.log('\nTestando sem API key...');
    
    const response = await axios.get(`${API_URL}/api/external/subscription-plans`);
    
    console.log('Status:', response.status);
    console.log('Dados:', response.data);
    
    return true;
  } catch (error) {
    console.log('\nErro esperado sem API key:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', error.response.data);
      return error.response.status === 401; // Deve retornar 401 Unauthorized
    }
    
    console.error('Erro inesperado:', error.message);
    return false;
  }
}

// Executar testes
async function runTests() {
  console.log('=== TESTE DA API EXTERNA ===\n');
  
  // Testar endpoint de planos de assinatura
  console.log('\n=== TESTANDO ENDPOINT DE PLANOS DE ASSINATURA ===');
  const plansTest = await testSubscriptionPlansEndpoint();
  
  // Testar endpoint de listar usuários
  console.log('\n=== TESTANDO ENDPOINT DE LISTAR USUÁRIOS ===');
  const usersListTest = await testListUsersEndpoint();
  
  // Testar endpoint de buscar usuário por ID
  console.log('\n=== TESTANDO ENDPOINT DE BUSCAR USUÁRIO POR ID ===');
  const userByIdTest = await testGetUserByIdEndpoint();
  
  // Testar endpoint de buscar filhos de um usuário
  console.log('\n=== TESTANDO ENDPOINT DE BUSCAR FILHOS DE UM USUÁRIO ===');
  const userChildrenTest = await testGetUserChildrenEndpoint();
  
  // Testar com API key inválida
  console.log('\n=== TESTANDO AUTENTICAÇÃO ===');
  const invalidKeyTest = await testInvalidApiKey();
  
  // Testar sem API key
  const noKeyTest = await testNoApiKey();
  
  console.log('\n=== RESULTADO DOS TESTES ===');
  console.log('Endpoint de planos:', plansTest ? '✅ PASSOU' : '❌ FALHOU');
  console.log('Endpoint de listar usuários:', usersListTest ? '✅ PASSOU' : '❌ FALHOU');
  console.log('Endpoint de buscar usuário por ID:', userByIdTest ? '✅ PASSOU' : '❌ FALHOU');
  console.log('Endpoint de buscar filhos de um usuário:', userChildrenTest ? '✅ PASSOU' : '❌ FALHOU');
  console.log('API key inválida:', invalidKeyTest ? '✅ PASSOU' : '❌ FALHOU');
  console.log('Sem API key:', noKeyTest ? '✅ PASSOU' : '❌ FALHOU');
}

// Executar testes
runTests();
