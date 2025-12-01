import { useState, useEffect } from 'react';
import useCustomAuth from '@/hooks/useCustomAuth';

interface AuthMonitorPluginProps {
  refreshInterval?: number;
}

/**
 * Plugin personalizado para monitorar o estado de autenticação
 * 
 * Este componente usa o contexto de autenticação para mostrar informações
 * sobre o usuário atual e o estado de autenticação.
 */
export const AuthMonitorPlugin = ({
  refreshInterval = 5000,
}: AuthMonitorPluginProps) => {
  const auth = useCustomAuth();
  const [authState, setAuthState] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Função para atualizar o estado de autenticação
    const updateAuthState = () => {
      try {
        // Extrair informações relevantes do contexto de autenticação
        const state = {
          isAuthenticated: auth.isAuthenticated,
          user: auth.user ? {
            id: auth.user.id,
            email: auth.user.email,
            role: auth.user.role,
            // Omitir informações sensíveis como tokens
          } : null,
          isLoading: auth.isLoading,
        };
        
        setAuthState(state);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(`Erro ao obter estado de autenticação: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    // Atualiza o estado imediatamente
    updateAuthState();

    // Configura o intervalo de atualização
    const intervalId = setInterval(updateAuthState, refreshInterval);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [auth, refreshInterval]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Estado de Autenticação</h3>
        <span className="text-xs text-gray-500">
          Atualizado: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {error ? (
        <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center">
            <span className="font-medium mr-2">Status:</span>
            {auth.isAuthenticated ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Autenticado
              </span>
            ) : (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                Não Autenticado
              </span>
            )}
          </div>
          
          {auth.isLoading && (
            <div className="mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Carregando...
              </span>
            </div>
          )}
          
          {auth.user && (
            <div className="mt-3 border-t pt-3">
              <h4 className="font-medium mb-2">Dados do Usuário:</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-40">
                {JSON.stringify(authState, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthMonitorPlugin;
