# TanStack DevTools para o Projeto Educare

Este diretório contém componentes e plugins para o TanStack DevTools, uma ferramenta de desenvolvimento para monitorar e depurar bibliotecas TanStack como React Query, React Table, etc.

## Componentes Disponíveis

### TanStackDevTools

Componente básico que integra o ReactQueryDevtools do TanStack.

```tsx
<TanStackDevTools 
  initialIsOpen={false} 
  position="bottom" 
  buttonPosition="bottom-right" 
/>
```

### CustomDevTools

Componente avançado que integra o TanStack DevTools com plugins personalizados.

```tsx
<CustomDevTools 
  initialIsOpen={false} 
  position="bottom" 
  buttonPosition="bottom-right" 
/>
```

## Plugins Disponíveis

### StateMonitorPlugin

Plugin para monitorar qualquer estado global da aplicação.

```tsx
<StateMonitorPlugin 
  stateKey="Nome do Estado" 
  getState={() => /* função que retorna o estado */} 
  refreshInterval={5000} // opcional, padrão: 2000ms
/>
```

### AuthMonitorPlugin

Plugin para monitorar o estado de autenticação da aplicação.

```tsx
<AuthMonitorPlugin 
  refreshInterval={5000} // opcional, padrão: 5000ms
/>
```

### PerformanceMonitorPlugin

Plugin para monitorar métricas de desempenho da aplicação.

```tsx
<PerformanceMonitorPlugin 
  refreshInterval={5000} // opcional, padrão: 5000ms
/>
```

### HTTPMonitorPlugin

Plugin para monitorar requisições HTTP da aplicação. Intercepta chamadas fetch e XMLHttpRequest para exibir informações sobre as requisições em tempo real.

```tsx
<HTTPMonitorPlugin 
  maxRequests={15} // opcional, padrão: 10
  refreshInterval={2000} // opcional, padrão: 2000ms
/>
```

## Como Usar

O TanStack DevTools já está configurado no arquivo `App.tsx` e é ativado automaticamente em ambiente de desenvolvimento. Para acessá-lo, basta clicar no botão flutuante no canto inferior direito da tela.

Para acessar os plugins personalizados, clique no botão "Mostrar Plugins" no canto inferior esquerdo da tela.

## Criando Novos Plugins

Para criar um novo plugin, siga o padrão dos plugins existentes:

1. Crie um arquivo `MeuPlugin.tsx` na pasta `plugins`
2. Implemente o componente React com a lógica necessária
3. Adicione o plugin ao `CustomDevTools.tsx`

Exemplo:

```tsx
// plugins/MeuPlugin.tsx
import { useState, useEffect } from 'react';

interface MeuPluginProps {
  refreshInterval?: number;
}

export const MeuPlugin = ({
  refreshInterval = 5000,
}: MeuPluginProps) => {
  const [data, setData] = useState<unknown>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const updateData = () => {
      // Lógica para obter dados
      setData(/* dados */);
      setLastUpdated(new Date());
    };

    updateData();
    const intervalId = setInterval(updateData, refreshInterval);
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Meu Plugin</h3>
        <span className="text-xs text-gray-500">
          Atualizado: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>
      
      {/* Conteúdo do plugin */}
    </div>
  );
};

export default MeuPlugin;
```

## Página de Demonstração

Uma página de demonstração está disponível em `/dev/tools` para testar o TanStack DevTools e seus plugins.

## Configuração

A configuração do TanStack DevTools está no arquivo `src/config/devtools.config.ts`. Você pode modificar este arquivo para alterar o comportamento padrão do DevTools.

```tsx
// devtools.config.ts
export const devToolsConfig = {
  enabled: process.env.NODE_ENV === 'development',
  reactQuery: {
    initialIsOpen: false,
    position: 'bottom',
    buttonPosition: 'bottom-right',
  },
};
```
