import { ReactNode } from 'react';

// Importação dinâmica para evitar problemas no build de produção
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ReactQueryDevtools: any = () => null;

// Apenas em desenvolvimento, tenta importar o componente
if (process.env.NODE_ENV === 'development') {
  // Usando import dinâmico para evitar problemas no build
  import('@tanstack/react-query-devtools')
    .then((module) => {
      ReactQueryDevtools = module.ReactQueryDevtools;
    })
    .catch((err) => {
      console.error('Erro ao carregar ReactQueryDevtools:', err);
    });
}

interface TanStackDevToolsProps {
  children?: ReactNode;
  initialIsOpen?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  buttonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Componente para TanStack DevTools que permite customização
 */
export const TanStackDevTools = ({
  children,
  initialIsOpen = false,
  position = 'bottom',
  buttonPosition = 'bottom-right',
}: TanStackDevToolsProps) => {
  // Renderizar o componente apenas em ambiente de desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }
  
  return (
    <>
      {children}
      <ReactQueryDevtools 
        initialIsOpen={initialIsOpen} 
        position={position}
        buttonPosition={buttonPosition}
      />
    </>
  );
};

export default TanStackDevTools;
