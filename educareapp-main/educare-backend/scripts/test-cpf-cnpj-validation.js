/**
 * Script de teste para validação de CPF/CNPJ
 * Execute: node scripts/test-cpf-cnpj-validation.js
 */

const User = require('../src/models/User');

// Casos de teste
const testCases = [
  // CPF válidos
  { value: '123.456.789-09', expected: true, description: 'CPF válido com formatação' },
  { value: '12345678909', expected: true, description: 'CPF válido sem formatação' },
  
  // CPF inválidos
  { value: '111.111.111-11', expected: false, description: 'CPF com todos dígitos iguais' },
  { value: '123.456.789-00', expected: false, description: 'CPF com dígito verificador errado' },
  { value: '12345', expected: false, description: 'CPF com menos de 11 dígitos' },
  
  // CNPJ válidos
  { value: '11.222.333/0001-81', expected: true, description: 'CNPJ válido com formatação' },
  { value: '11222333000181', expected: true, description: 'CNPJ válido sem formatação' },
  
  // CNPJ inválidos
  { value: '11.111.111/1111-11', expected: false, description: 'CNPJ com todos dígitos iguais' },
  { value: '11.222.333/0001-00', expected: false, description: 'CNPJ com dígito verificador errado' },
  { value: '123456789012', expected: false, description: 'CNPJ com menos de 14 dígitos' },
  
  // Casos especiais
  { value: null, expected: true, description: 'Valor null (permitido)' },
  { value: '', expected: true, description: 'String vazia (permitido)' },
];

async function runTests() {
  console.log('🧪 Iniciando testes de validação CPF/CNPJ\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    try {
      // Tentar criar um usuário temporário com o CPF/CNPJ
      const user = User.build({
        name: 'Teste',
        email: `teste${Date.now()}@example.com`,
        password: 'senha123',
        cpf_cnpj: testCase.value
      });
      
      // Validar o modelo (não salva no banco)
      await user.validate();
      
      if (testCase.expected) {
        console.log(`✅ PASSOU: ${testCase.description}`);
        console.log(`   Valor: ${testCase.value || '(vazio)'}\n`);
        passed++;
      } else {
        console.log(`❌ FALHOU: ${testCase.description}`);
        console.log(`   Valor: ${testCase.value}`);
        console.log(`   Esperado: erro, mas passou na validação\n`);
        failed++;
      }
    } catch (error) {
      if (!testCase.expected) {
        console.log(`✅ PASSOU: ${testCase.description}`);
        console.log(`   Valor: ${testCase.value}`);
        console.log(`   Erro esperado: ${error.message}\n`);
        passed++;
      } else {
        console.log(`❌ FALHOU: ${testCase.description}`);
        console.log(`   Valor: ${testCase.value}`);
        console.log(`   Erro inesperado: ${error.message}\n`);
        failed++;
      }
    }
  }
  
  console.log('═'.repeat(50));
  console.log(`📊 Resultado dos Testes:`);
  console.log(`   ✅ Passou: ${passed}/${testCases.length}`);
  console.log(`   ❌ Falhou: ${failed}/${testCases.length}`);
  console.log('═'.repeat(50));
  
  if (failed === 0) {
    console.log('\n🎉 Todos os testes passaram!');
  } else {
    console.log('\n⚠️  Alguns testes falharam. Revise a implementação.');
  }
}

// Executar testes
runTests()
  .then(() => {
    console.log('\n✨ Testes concluídos');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Erro ao executar testes:', error);
    process.exit(1);
  });
