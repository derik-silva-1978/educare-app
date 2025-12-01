import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class JourneyErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('JourneyErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Algo deu errado</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Não foi possível carregar a Jornada 2.0. Por favor, tente novamente mais tarde.
          </p>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
            <Button 
              onClick={() => window.location.href = '/educare-app/dashboard'}
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Voltar para o Dashboard
            </Button>
          </div>
          {this.state.error && (
            <div className="mt-6 p-4 bg-muted rounded-md w-full overflow-auto">
              <p className="font-mono text-xs text-muted-foreground">
                {this.state.error.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
