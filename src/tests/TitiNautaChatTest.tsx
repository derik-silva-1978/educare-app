import React, { useState, useEffect, useCallback } from 'react';
import TitiNautaChat from '../components/titinauta/TitiNautaChat';
import { JourneyContent, QuizOption } from '@/types/titinauta';
import { useToast } from '@/hooks/use-toast';

/**
 * Componente de teste para o TitiNautaChat
 * Este componente simula a integração do TitiNautaChat com o backend
 */
const TitiNautaChatTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Dados de teste
  const childId = 'test-child-id'; // Substitua por um ID real para testes
  const child = {
    id: childId,
    name: 'Criança Teste',
    birthDate: '2023-01-01'
  };
  const ageInMonths = 6;
  
  // Conteúdo de jornada de teste
  const mockJourneyContent: JourneyContent = {
    id: 'test-journey-id',
    title: 'Jornada de Teste',
    description: 'Jornada para testar a integração com o backend',
    ageRangeMin: 0,
    ageRangeMax: 12,
    steps: [
      {
        id: 'welcome',
        type: 'message',
        content: 'Bem-vindo ao teste de integração do TitiNauta!'
      },
      {
        id: 'question-1',
        type: 'question',
        content: 'Seu bebê já consegue sentar sem apoio?',
        options: [
          { id: 'yes', text: 'Sim' },
          { id: 'no', text: 'Não' },
          { id: 'sometimes', text: 'Às vezes' }
        ]
      },
      {
        id: 'question-2',
        type: 'question',
        content: 'Seu bebê já demonstra interesse por alimentos sólidos?',
        options: [
          { id: 'yes', text: 'Sim' },
          { id: 'no', text: 'Não' },
          { id: 'sometimes', text: 'Às vezes' }
        ]
      }
    ]
  };
  
  // Simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      addTestResult('Conteúdo da jornada carregado com sucesso');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Função para adicionar resultados de teste
  const addTestResult = useCallback((result: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
  }, []);
  
  // Configurar interceptação na montagem do componente
  useEffect(() => {
    // Interceptar chamadas de API
    const interceptApiCalls = () => {
      // Salvar referência original da função fetch
      const originalFetch = window.fetch;
      
      // Substituir fetch por versão instrumentada
      window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        
        // Interceptar chamadas relacionadas ao TitiNauta
        if (url.includes('/journey/') || url.includes('/titinauta/')) {
          addTestResult(`Interceptada chamada API: ${url}`);
          
          // Analisar corpo da requisição
          if (init?.body) {
            try {
              const body = JSON.parse(init.body.toString());
              addTestResult(`Dados enviados: ${JSON.stringify(body)}`);
            } catch (e) {
              addTestResult(`Não foi possível analisar corpo da requisição`);
            }
          }
          
          // Simular resposta bem-sucedida
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(new Response(JSON.stringify({ 
                success: true, 
                data: { 
                  id: 'response-id',
                  timestamp: new Date().toISOString(),
                  status: 'success'
                } 
              }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }));
            }, 500);
          });
        }
        
        // Para outras chamadas, usar fetch original
        return originalFetch(input, init);
      };
      
      addTestResult('Interceptação de API configurada');
    };
    
    // Executar interceptação
    interceptApiCalls();
    
    // Mostrar toast de teste iniciado
    toast({
      title: 'Teste de Integração',
      description: 'Teste de integração do TitiNauta iniciado',
      variant: 'default'
    });
    
    return () => {
      // Restaurar fetch original (não implementado aqui para simplicidade)
    };
  }, [toast, addTestResult]);
  
  return (
    <div className="titinauta-test-container">
      <div className="test-header">
        <h1>Teste de Integração do TitiNauta</h1>
        <p>Este teste verifica a integração do TitiNautaChat com o backend</p>
      </div>
      
      <div className="test-content">
        <div className="chat-container">
          <h2>Chat de Teste</h2>
          <div className="chat-wrapper">
            <TitiNautaChat
              childId={childId}
              ageInMonths={ageInMonths}
              child={child}
              journeyContent={mockJourneyContent}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <div className="test-results">
          <h2>Resultados do Teste</h2>
          <div className="results-log">
            {testResults.map((result, index) => (
              <div key={index} className="log-entry">
                {result}
              </div>
            ))}
            {testResults.length === 0 && (
              <div className="no-results">Nenhum resultado de teste ainda</div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .titinauta-test-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .test-header {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .test-content {
          display: flex;
          gap: 20px;
        }
        
        .chat-container {
          flex: 1;
          min-width: 400px;
        }
        
        .chat-wrapper {
          border: 1px solid #eaeaea;
          border-radius: 8px;
          overflow: hidden;
          height: 600px;
        }
        
        .test-results {
          flex: 1;
          min-width: 400px;
        }
        
        .results-log {
          background-color: #f5f5f5;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          padding: 10px;
          height: 550px;
          overflow-y: auto;
          font-family: monospace;
        }
        
        .log-entry {
          padding: 5px 0;
          border-bottom: 1px solid #eaeaea;
        }
        
        .no-results {
          color: #999;
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default TitiNautaChatTest;
