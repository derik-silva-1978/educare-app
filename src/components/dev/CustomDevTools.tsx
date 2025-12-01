import { useState } from 'react';
import TanStackDevTools from './TanStackDevTools';
import {
  StateMonitorPlugin,
  AuthMonitorPlugin,
  PerformanceMonitorPlugin,
  HTTPMonitorPlugin
} from './plugins';

interface CustomDevToolsProps {
  initialIsOpen?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  buttonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Componente que integra o TanStack DevTools com plugins personalizados
 */
export const CustomDevTools = ({
  initialIsOpen = false,
  position = 'bottom',
  buttonPosition = 'bottom-right',
}: CustomDevToolsProps) => {
  // Sempre declarar hooks no nível superior, mesmo que o componente retorne null
  const [showCustomTools, setShowCustomTools] = useState(false);
  
  // Não renderizar nada em ambiente de produção
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Estilo do botão flutuante para plugins personalizados
  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    padding: '8px 12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    bottom: '10px',
    left: '10px',
  };

  // Estilo do painel de plugins personalizados
  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9998,
    bottom: '60px',
    left: '10px',
    width: '400px',
    maxHeight: '80vh',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    overflow: 'auto',
    padding: '16px',
  };

  // Exemplo de função para obter estado de um contexto ou store
  const getAuthState = () => {
    try {
      // Aqui você pode acessar qualquer estado global da sua aplicação
      // Por exemplo, localStorage, sessionStorage, etc.
      const authData = localStorage.getItem('auth');
      return authData ? JSON.parse(authData) : { status: 'não autenticado' };
    } catch (error) {
      return { error: 'Erro ao obter dados de autenticação' };
    }
  };

  return (
    <>
      {/* TanStack DevTools para React Query */}
      <TanStackDevTools 
        initialIsOpen={initialIsOpen} 
        position={position} 
        buttonPosition={buttonPosition} 
      />

      {/* Botão para mostrar/ocultar plugins personalizados */}
      <button
        onClick={() => setShowCustomTools(!showCustomTools)}
        style={buttonStyle}
      >
        {showCustomTools ? 'Ocultar Plugins' : 'Mostrar Plugins'}
      </button>

      {/* Painel de plugins personalizados */}
      {showCustomTools && (
        <div style={panelStyle}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Plugins de Desenvolvimento</h2>
            
            {/* Plugin para monitorar localStorage */}
            <StateMonitorPlugin 
              stateKey="LocalStorage Auth" 
              getState={getAuthState} 
              refreshInterval={5000}
            />
            
            {/* Plugin para monitorar contexto de autenticação */}
            <AuthMonitorPlugin refreshInterval={5000} />
            
            {/* Plugin para monitorar desempenho */}
            <PerformanceMonitorPlugin refreshInterval={5000} />
            
            {/* Plugin para monitorar requisições HTTP */}
            <HTTPMonitorPlugin maxRequests={15} refreshInterval={2000} />
            
            {/* Você pode adicionar mais plugins aqui */}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomDevTools;
