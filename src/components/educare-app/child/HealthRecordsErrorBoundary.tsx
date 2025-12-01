
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface HealthRecordsErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

interface HealthRecordsErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class HealthRecordsErrorBoundary extends React.Component<
  HealthRecordsErrorBoundaryProps, 
  HealthRecordsErrorBoundaryState
> {
  constructor(props: HealthRecordsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): HealthRecordsErrorBoundaryState {
    console.error('🚨 HealthRecordsErrorBoundary caught an error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 HealthRecordsErrorBoundary error details:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="w-full bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-800">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">
                Erro ao carregar registros de saúde
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Ocorreu um problema inesperado. Tente recarregar a página ou entre em contato com o suporte se o problema persistir.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={this.handleRetry} className="px-6">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="px-6">
                  Recarregar Página
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return <>{this.props.children}</>;
  }
}
