import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, AlertCircle } from 'lucide-react';

interface RAGProgressBarProps {
  isLoading: boolean;
  status?: 'idle' | 'retrieving' | 'processing' | 'generating' | 'error';
  message?: string;
  error?: string;
}

const RAGProgressBar: React.FC<RAGProgressBarProps> = ({
  isLoading,
  status = 'idle',
  message = 'Processando pergunta...',
  error
}) => {
  const [progress, setProgress] = useState(0);

  // Animar progresso enquanto está carregando
  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(90, (elapsed / 60000) * 100); // Max 90% em 60s
      setProgress(newProgress);
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Mensagens por status
  const statusMessages = {
    idle: '⏳ Aguardando...',
    retrieving: '🔍 Recuperando documentos...',
    processing: '⚙️ Processando informações...',
    generating: '✍️ Gerando resposta...',
    error: '❌ Erro ao processar'
  };

  if (!isLoading && !error) return null;

  return (
    <div className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {error ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {error ? 'Erro ao processar' : statusMessages[status]}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            {error || message}
          </p>
        </div>
      </div>

      {!error && (
        <div className="space-y-2">
          <Progress
            value={progress}
            className="h-2"
            indicatorClassName={`bg-gradient-to-r ${
              status === 'generating'
                ? 'from-purple-500 to-indigo-600'
                : 'from-purple-400 to-indigo-500'
            }`}
          />
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Zap className="h-3 w-3" />
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RAGProgressBar;
