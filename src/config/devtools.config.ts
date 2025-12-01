/**
 * Configuração para o TanStack DevTools
 * 
 * Este arquivo pode ser usado para configurar plugins personalizados
 * e outras opções para o TanStack DevTools.
 */

export const devToolsConfig = {
  // Configurações gerais
  enabled: process.env.NODE_ENV === 'development',
  
  // Configurações do React Query
  reactQuery: {
    initialIsOpen: false,
    position: 'bottom' as const,
    buttonPosition: 'bottom-right' as const,
  },
  
  // Configurações para plugins personalizados (futuro)
  customPlugins: {
    // Exemplo: plugin personalizado para monitorar o estado global
    // stateMonitor: {
    //   enabled: true,
    //   options: {
    //     // opções específicas do plugin
    //   }
    // }
  }
};

export default devToolsConfig;
