import { useState, useEffect } from 'react';

interface StateMonitorPluginProps {
  stateKey: string;
  getState: () => unknown;
  refreshInterval?: number;
}

/**
 * Plugin personalizado para monitorar estados globais da aplicação
 * 
 * Este componente pode ser usado para monitorar qualquer estado global,
 * como contextos, stores, etc.
 */
export const StateMonitorPlugin = ({
  stateKey,
  getState,
  refreshInterval = 2000,
}: StateMonitorPluginProps) => {
  const [state, setState] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Função para atualizar o estado monitorado
    const updateState = () => {
      try {
        const currentState = getState();
        setState(currentState);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(`Erro ao obter estado: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    // Atualiza o estado imediatamente
    updateState();

    // Configura o intervalo de atualização
    const intervalId = setInterval(updateState, refreshInterval);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [getState, refreshInterval]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{stateKey}</h3>
        <span className="text-xs text-gray-500">
          Atualizado: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {error ? (
        <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      ) : (
        <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-60">
          {JSON.stringify(state, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default StateMonitorPlugin;
