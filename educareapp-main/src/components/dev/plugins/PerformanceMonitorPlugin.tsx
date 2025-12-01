import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  memory: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  } | null;
  navigation: {
    type: string;
    redirectCount: number;
  } | null;
  timing: {
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
  } | null;
}

interface PerformanceMonitorPluginProps {
  refreshInterval?: number;
}

/**
 * Plugin para monitorar métricas de desempenho da aplicação
 */
export const PerformanceMonitorPlugin = ({
  refreshInterval = 5000,
}: PerformanceMonitorPluginProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memory: null,
    navigation: null,
    timing: null,
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const updateMetrics = () => {
      try {
        // Métricas de memória (apenas Chrome)
        // Definindo interface para a propriedade memory do Chrome
        interface PerformanceMemory {
          jsHeapSizeLimit: number;
          totalJSHeapSize: number;
          usedJSHeapSize: number;
        }
        
        // Usando type assertion com interface definida
        const chromePerformance = performance as unknown as { memory?: PerformanceMemory };
        const memory = chromePerformance.memory ? {
          jsHeapSizeLimit: chromePerformance.memory.jsHeapSizeLimit,
          totalJSHeapSize: chromePerformance.memory.totalJSHeapSize,
          usedJSHeapSize: chromePerformance.memory.usedJSHeapSize,
        } : null;

        // Métricas de navegação
        const navigation = performance.navigation ? {
          type: ['navigate', 'reload', 'back_forward', 'reserved'][performance.navigation.type],
          redirectCount: performance.navigation.redirectCount,
        } : null;

        // Métricas de timing
        const timing = performance.timing ? {
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
          firstPaint: 0,
          firstContentfulPaint: 0,
        } : null;

        // Métricas de paint (se disponíveis)
        if (window.performance && window.performance.getEntriesByType) {
          const paintMetrics = performance.getEntriesByType('paint');
          const firstPaint = paintMetrics.find(entry => entry.name === 'first-paint');
          const firstContentfulPaint = paintMetrics.find(entry => entry.name === 'first-contentful-paint');

          if (timing && firstPaint) {
            timing.firstPaint = firstPaint.startTime;
          }

          if (timing && firstContentfulPaint) {
            timing.firstContentfulPaint = firstContentfulPaint.startTime;
          }
        }

        setMetrics({ memory, navigation, timing });
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Erro ao coletar métricas de desempenho:', error);
      }
    };

    // Atualiza as métricas imediatamente
    updateMetrics();

    // Configura o intervalo de atualização
    const intervalId = setInterval(updateMetrics, refreshInterval);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Formatar bytes para exibição legível
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Formatar milissegundos para exibição legível
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Métricas de Desempenho</h3>
        <span className="text-xs text-gray-500">
          Atualizado: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-4">
        {/* Métricas de memória */}
        <div>
          <h4 className="font-medium mb-2">Memória (Chrome):</h4>
          {metrics.memory ? (
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Heap Usado:</span>
                <span className="text-sm font-medium">{formatBytes(metrics.memory.usedJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Heap Total:</span>
                <span className="text-sm font-medium">{formatBytes(metrics.memory.totalJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Limite do Heap:</span>
                <span className="text-sm font-medium">{formatBytes(metrics.memory.jsHeapSizeLimit)}</span>
              </div>
              
              {/* Barra de progresso de uso de memória */}
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${(metrics.memory.usedJSHeapSize / metrics.memory.jsHeapSizeLimit) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{Math.round((metrics.memory.usedJSHeapSize / metrics.memory.jsHeapSizeLimit) * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Não disponível neste navegador</p>
          )}
        </div>

        {/* Métricas de timing */}
        {metrics.timing && (
          <div>
            <h4 className="font-medium mb-2">Timing:</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tempo de Carregamento:</span>
                <span className="text-sm font-medium">{formatTime(metrics.timing.loadTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">DOM Content Loaded:</span>
                <span className="text-sm font-medium">{formatTime(metrics.timing.domContentLoaded)}</span>
              </div>
              {metrics.timing.firstPaint > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">First Paint:</span>
                  <span className="text-sm font-medium">{formatTime(metrics.timing.firstPaint)}</span>
                </div>
              )}
              {metrics.timing.firstContentfulPaint > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">First Contentful Paint:</span>
                  <span className="text-sm font-medium">{formatTime(metrics.timing.firstContentfulPaint)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Métricas de navegação */}
        {metrics.navigation && (
          <div>
            <h4 className="font-medium mb-2">Navegação:</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tipo:</span>
                <span className="text-sm font-medium">{metrics.navigation.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Redirecionamentos:</span>
                <span className="text-sm font-medium">{metrics.navigation.redirectCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitorPlugin;
