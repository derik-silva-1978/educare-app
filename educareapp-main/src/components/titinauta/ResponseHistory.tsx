import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import * as titiNautaService from '@/services/api/titiNautaService';
import { QuizAnswerResponse } from '@/services/api/titiNautaService';

interface ResponseHistoryProps {
  childId: string;
}

// Usando a interface do serviço para compatibilidade
type HistoryResponse = QuizAnswerResponse;

const ResponseHistory: React.FC<ResponseHistoryProps> = ({ childId }) => {
  const [history, setHistory] = useState<HistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await titiNautaService.getAnswerHistory(childId);
        
        if (!response.success) {
          throw new Error(response.error || 'Erro ao buscar histórico');
        }
        
        setHistory(response.data || []);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (childId) {
      fetchHistory();
    }
  }, [childId]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return (
      <div className="response-history-loading">
        <Loader2 className="animate-spin h-5 w-5 text-primary" />
        <span>Carregando histórico...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="response-history-error">
        <p>Não foi possível carregar o histórico: {error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="response-history-empty">
        <p>Nenhuma resposta anterior encontrada.</p>
      </div>
    );
  }

  return (
    <div className="response-history">
      <div className="response-history-header" onClick={toggleExpand}>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3>Histórico de Respostas</h3>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
      
      {isExpanded && (
        <div className="response-history-content">
          <ul className="response-history-list">
            {history.slice(0, 10).map((item) => (
              <li key={item.id} className="response-history-item">
                <div className="response-history-date">
                  {format(new Date(item.created_at), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
                <div className="response-history-answer">
                  <span className="response-history-answer-text">{item.answer_text}</span>
                </div>
              </li>
            ))}
            {history.length > 10 && (
              <li className="response-history-more">
                + {history.length - 10} respostas anteriores
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResponseHistory;
