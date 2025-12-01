const axios = require('axios');

async function testJourneyQuestionsAPI() {
  try {
    console.log('🧪 Testando endpoint da API de perguntas...');
    
    // Simular um token JWT válido (você pode pegar um real do localStorage)
    const testToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Token fictício para teste
    
    // Teste 1: Listar perguntas
    console.log('\n1️⃣ Testando GET /api/admin/journey-questions...');
    try {
      const response = await axios.get('http://localhost:3001/api/admin/journey-questions?page=1&limit=20', {
        headers: {
          'Authorization': testToken,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Status:', response.status);
      console.log('✅ Estrutura da resposta:', {
        success: response.data.success,
        dataLength: response.data.data?.length || 0,
        meta: response.data.meta
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Erro 401 - Token inválido (esperado para este teste)');
      } else {
        console.log('❌ Erro:', error.response?.status, error.response?.data || error.message);
      }
    }
    
    // Teste 2: Estatísticas
    console.log('\n2️⃣ Testando GET /api/admin/journey-questions/statistics...');
    try {
      const response = await axios.get('http://localhost:3001/api/admin/journey-questions/statistics', {
        headers: {
          'Authorization': testToken,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Status:', response.status);
      console.log('✅ Estatísticas:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Erro 401 - Token inválido (esperado para este teste)');
      } else {
        console.log('❌ Erro:', error.response?.status, error.response?.data || error.message);
      }
    }
    
    console.log('\n🎉 Teste de endpoints concluído!');
    console.log('💡 Para testar com token real, faça login no frontend e copie o token do localStorage.');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testJourneyQuestionsAPI();
