import { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface CustomTanStackDevToolsProps {
  children?: ReactNode;
  initialIsOpen?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  buttonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Componente personalizado para TanStack DevTools com suporte a plugins customizados
 * 
 * Este componente pode ser estendido no futuro para incluir plugins personalizados
 * para monitorar outros aspectos da aplicação além do React Query.
 */
export const CustomTanStackDevTools = ({
  children,
  initialIsOpen = false,
  position = 'bottom',
  buttonPosition = 'bottom-right',
}: CustomTanStackDevToolsProps) => {
  // Aqui você pode adicionar lógica para registrar plugins personalizados
  // quando o TanStack DevTools suportar isso

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

export default CustomTanStackDevTools;
