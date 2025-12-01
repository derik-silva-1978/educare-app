import { useState } from 'react';
import { useExampleQuery, useParameterizedQuery } from '@/hooks/useExampleQuery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Componente de demonstração para o TanStack DevTools
 * 
 * Este componente faz várias consultas para demonstrar o funcionamento do DevTools
 */
export const DevToolsDemo = () => {
  const [id, setId] = useState('1');
  const [isEnabled, setIsEnabled] = useState(false);
  
  // Consulta básica - será exibida no DevTools
  const { data: exampleData, isLoading: exampleLoading, refetch: refetchExample } = 
    useExampleQuery(isEnabled);
  
  // Consulta parametrizada - também será exibida no DevTools
  const { data: paramData, isLoading: paramLoading, refetch: refetchParam } = 
    useParameterizedQuery(id, isEnabled);
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">TanStack DevTools Demo</h1>
      <p className="text-gray-500">
        Este componente demonstra o uso do TanStack DevTools. 
        Abra o DevTools clicando no botão flutuante no canto inferior direito da tela.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Controles</CardTitle>
            <CardDescription>Ative as consultas e veja-as no DevTools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="enable-queries" 
                checked={isEnabled}
                onChange={() => setIsEnabled(prev => !prev)}
                className="h-4 w-4"
              />
              <Label htmlFor="enable-queries">Ativar consultas</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="param-id">ID para consulta parametrizada</Label>
              <Input 
                id="param-id" 
                value={id} 
                onChange={(e) => setId(e.target.value)}
                placeholder="Digite um ID"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => refetchExample()}>
              Recarregar Exemplo
            </Button>
            <Button onClick={() => refetchParam()}>
              Recarregar Parametrizado
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>Dados retornados pelas consultas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Consulta de Exemplo:</h3>
              {exampleLoading ? (
                <p>Carregando...</p>
              ) : (
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-32">
                  {exampleData ? JSON.stringify(exampleData, null, 2) : 'Sem dados'}
                </pre>
              )}
            </div>
            
            <div>
              <h3 className="font-medium">Consulta Parametrizada (ID: {id}):</h3>
              {paramLoading ? (
                <p>Carregando...</p>
              ) : (
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-32">
                  {paramData ? JSON.stringify(paramData, null, 2) : 'Sem dados'}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-lg font-medium text-blue-800 mb-2">Como usar o TanStack DevTools</h2>
        <ul className="list-disc pl-5 space-y-1 text-blue-700">
          <li>Clique no botão flutuante no canto inferior direito para abrir o DevTools</li>
          <li>Veja todas as consultas ativas no painel "Queries"</li>
          <li>Explore os estados de cada consulta (fresh, stale, fetching)</li>
          <li>Use os botões "Refetch" e "Invalidate" para testar o comportamento</li>
          <li>Observe como as consultas são agrupadas por queryKey</li>
        </ul>
      </div>
    </div>
  );
};

export default DevToolsDemo;
