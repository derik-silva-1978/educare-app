/**
 * Script de teste para verificar o salvamento de respostas do TitiNauta
 * e a sincronização com o banco de dados
 */

import * as titiNautaService from '../services/api/titiNautaService';

// Configuração do teste
const childId = 'test-child-id'; // Substitua por um ID real para testes
const questionId = 'test-question-id'; // Substitua por um ID real para testes
const selectedOptionId = 'test-option-id'; // Substitua por um ID real para testes
const journeyId = 'test-journey-id'; // Substitua por um ID real para testes

// Função para testar o salvamento de respostas
async function testSaveAnswer() {
  console.log('=== Teste de Salvamento de Respostas ===');
  console.log(`Criança: ${childId}`);
  console.log(`Pergunta: ${questionId}`);
  console.log(`Opção selecionada: ${selectedOptionId}`);
  
  try {
    console.log('\nEnviando resposta para o servidor...');
    const response = await titiNautaService.saveAnswer(childId, {
      questionId,
      selectedOptionId
    });
    
    if (response.success) {
      console.log('\n✅ Resposta salva com sucesso!');
      console.log('Dados retornados:');
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.error('\n❌ Erro ao salvar resposta:');
      console.error(response.error);
    }
  } catch (error) {
    console.error('\n❌ Exceção ao salvar resposta:');
    console.error(error.message);
  }
}

// Função para testar o salvamento de progresso
async function testSaveProgress() {
  console.log('\n=== Teste de Salvamento de Progresso ===');
  console.log(`Criança: ${childId}`);
  console.log(`Jornada: ${journeyId}`);
  console.log('Etapa atual: 2');
  console.log('Etapas completadas: ["step1", "step2"]');
  
  try {
    console.log('\nEnviando progresso para o servidor...');
    const response = await titiNautaService.saveProgress(childId, {
      journeyId,
      currentStep: 2,
      completedSteps: ['step1', 'step2']
    });
    
    if (response.success) {
      console.log('\n✅ Progresso salvo com sucesso!');
      console.log('Dados retornados:');
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.error('\n❌ Erro ao salvar progresso:');
      console.error(response.error);
    }
  } catch (error) {
    console.error('\n❌ Exceção ao salvar progresso:');
    console.error(error.message);
  }
}

// Função para testar a recuperação do histórico de respostas
async function testGetAnswerHistory() {
  console.log('\n=== Teste de Recuperação de Histórico ===');
  console.log(`Criança: ${childId}`);
  
  try {
    console.log('\nBuscando histórico de respostas...');
    const response = await titiNautaService.getAnswerHistory(childId);
    
    if (response.success) {
      console.log('\n✅ Histórico recuperado com sucesso!');
      console.log(`Total de respostas: ${response.data.length}`);
      console.log('Primeiras 3 respostas:');
      console.log(JSON.stringify(response.data.slice(0, 3), null, 2));
    } else {
      console.error('\n❌ Erro ao recuperar histórico:');
      console.error(response.error);
    }
  } catch (error) {
    console.error('\n❌ Exceção ao recuperar histórico:');
    console.error(error.message);
  }
}

// Executar testes
async function runTests() {
  console.log('Iniciando testes de integração do TitiNauta...\n');
  
  await testSaveAnswer();
  await testSaveProgress();
  await testGetAnswerHistory();
  
  console.log('\nTestes concluídos!');
}

// Executar testes quando o script for carregado
runTests();
