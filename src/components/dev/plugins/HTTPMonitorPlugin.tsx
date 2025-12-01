import { useState, useEffect } from 'react';

interface HTTPRequest {
  url: string;
  method: string;
  status: number | null;
  duration: number | null;
  timestamp: Date;
  error?: string;
}

interface HTTPMonitorPluginProps {
  maxRequests?: number;
  refreshInterval?: number;
}

/**
 * Plugin para monitorar requisições HTTP da aplicação
 * 
 * Este plugin intercepta as requisições fetch e XMLHttpRequest para
 * monitorar o tráfego HTTP da aplicação.
 */
export const HTTPMonitorPlugin = ({
  maxRequests = 10,
  refreshInterval = 2000,
}: HTTPMonitorPluginProps) => {
  const [requests, setRequests] = useState<HTTPRequest[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Array para armazenar as requisições
    const requestsArray: HTTPRequest[] = [];

    // Interceptar o fetch API
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      // Extrair URL da requisição
      let url: string;
      if (typeof input === 'string') {
        url = input;
      } else if (input instanceof Request) {
        url = input.url;
      } else {
        // URL object
        url = input.toString();
      }
      
      const method = init?.method || 'GET';
      const startTime = performance.now();
      
      const request: HTTPRequest = {
        url,
        method,
        status: null,
        duration: null,
        timestamp: new Date(),
      };
      
      try {
        const response = await originalFetch(input, init);
        
        // Atualizar a requisição com o status e duração
        request.status = response.status;
        request.duration = performance.now() - startTime;
        
        // Clonar a resposta para não interferir com o fluxo normal
        const clonedResponse = response.clone();
        
        // Adicionar a requisição ao array
        addRequest(request);
        
        return clonedResponse;
      } catch (error) {
        // Atualizar a requisição com o erro
        request.error = error instanceof Error ? error.message : String(error);
        request.duration = performance.now() - startTime;
        
        // Adicionar a requisição ao array
        addRequest(request);
        
        throw error;
      }
    };

    // Interceptar o XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    // Estender a interface XMLHttpRequest para incluir nossas propriedades
    interface ExtendedXMLHttpRequest extends XMLHttpRequest {
      _method?: string;
      _url?: string;
    }
    
    XMLHttpRequest.prototype.open = function(this: ExtendedXMLHttpRequest, method: string, url: string, ...args: unknown[]) {
      // Armazenar o método e URL para uso posterior
      this._method = method;
      this._url = url;
      
      return originalXHROpen.apply(this, [method, url, ...args]);
    };
    
    XMLHttpRequest.prototype.send = function(this: ExtendedXMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
      const xhr = this as ExtendedXMLHttpRequest;
      const startTime = performance.now();
      
      const request: HTTPRequest = {
        url: xhr._url || 'unknown',
        method: xhr._method || 'unknown',
        status: null,
        duration: null,
        timestamp: new Date(),
      };
      
      // Interceptar o evento load
      xhr.addEventListener('load', function() {
        request.status = xhr.status;
        request.duration = performance.now() - startTime;
        addRequest(request);
      });
      
      // Interceptar o evento error
      xhr.addEventListener('error', function() {
        request.error = 'Network Error';
        request.duration = performance.now() - startTime;
        addRequest(request);
      });
      
      return originalXHRSend.apply(xhr, body !== undefined ? [body] : []);
    };

    // Função para adicionar uma requisição ao array
    const addRequest = (request: HTTPRequest) => {
      requestsArray.unshift(request);
      
      // Limitar o número de requisições armazenadas
      if (requestsArray.length > maxRequests) {
        requestsArray.pop();
      }
      
      // Atualizar o estado
      setRequests([...requestsArray]);
      setLastUpdated(new Date());
    };

    // Função para atualizar o estado periodicamente
    const updateState = () => {
      setRequests([...requestsArray]);
      setLastUpdated(new Date());
    };

    // Configurar o intervalo de atualização
    const intervalId = setInterval(updateState, refreshInterval);

    // Limpar interceptações e intervalo quando o componente é desmontado
    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
      clearInterval(intervalId);
    };
  }, [maxRequests, refreshInterval]);

  // Função para formatar a duração
  const formatDuration = (ms: number | null): string => {
    if (ms === null) return 'N/A';
    if (ms < 1000) return `${ms.toFixed(0)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  };

  // Função para obter a classe de cor baseada no status HTTP
  const getStatusColorClass = (status: number | null): string => {
    if (status === null) return 'bg-gray-100 text-gray-800';
    if (status < 300) return 'bg-green-100 text-green-800';
    if (status < 400) return 'bg-blue-100 text-blue-800';
    if (status < 500) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Função para truncar URL
  const truncateUrl = (url: string, maxLength: number = 40): string => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Monitoramento HTTP</h3>
        <span className="text-xs text-gray-500">
          Atualizado: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma requisição HTTP interceptada ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duração
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request, index) => (
                <tr key={index} className={request.error ? 'bg-red-50' : ''}>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                      request.method === 'POST' ? 'bg-green-100 text-green-800' :
                      request.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.method}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs" title={request.url}>
                    {truncateUrl(request.url)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {request.status !== null ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(request.status)}`}>
                        {request.status}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {formatDuration(request.duration)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {request.timestamp.toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HTTPMonitorPlugin;
