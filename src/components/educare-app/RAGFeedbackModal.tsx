/**
 * RAG Feedback Modal
 * Coleta feedback do usuário sobre respostas do TitiNauta
 * Integração FASE 11
 */

import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ragService from '@/services/api/ragService';
import { useToast } from '@/hooks/use-toast';

export interface RAGFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  responseId: string;
  question?: string;
  answer?: string;
  module?: 'baby' | 'mother' | 'professional';
}

export const RAGFeedbackModal: React.FC<RAGFeedbackModalProps> = ({
  isOpen,
  onClose,
  responseId,
  question = '',
  answer = '',
  module = 'baby',
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<'helpful' | 'not_helpful' | 'incorrect' | 'unclear'>('helpful');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast({
        title: 'Avaliação necessária',
        description: 'Por favor, selecione uma classificação (1-5 estrelas)',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await ragService.submitFeedback({
        response_id: responseId,
        rating,
        feedback_type: feedbackType,
        comment,
        module,
      });

      if (result.success) {
        toast({
          title: 'Obrigado!',
          description: 'Seu feedback foi registrado com sucesso e nos ajuda a melhorar.',
          variant: 'default',
        });
        resetForm();
        onClose();
      } else {
        toast({
          title: 'Erro',
          description: result.error || 'Não foi possível registrar seu feedback',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao submeter feedback:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao registrar seu feedback',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setFeedbackType('helpful');
    setComment('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Qual sua opinião?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Pergunta original */}
          {question && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Sua pergunta:</p>
              <p className="text-sm text-gray-900 mt-1">{question}</p>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Como foi a resposta? *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {rating === 0
                ? 'Clique para avaliar'
                : `${rating} estrela${rating !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Tipo de feedback:
            </label>
            <div className="space-y-2">
              {(
                [
                  { value: 'helpful', label: '👍 Útil e clara' },
                  { value: 'not_helpful', label: '👎 Não foi útil' },
                  { value: 'incorrect', label: '❌ Informação incorreta' },
                  { value: 'unclear', label: '❓ Não entendi bem' },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded"
                >
                  <input
                    type="radio"
                    name="feedbackType"
                    value={option.value}
                    checked={feedbackType === option.value}
                    onChange={(e) => setFeedbackType(e.target.value as typeof feedbackType)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Deixe um comentário (opcional):
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Seu feedback nos ajuda a melhorar..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              ℹ️ Seu feedback é anônimo e ajuda nosso TitiNauta a ficar cada vez melhor!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-3 p-6 border-t bg-gray-50">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitFeedback}
            disabled={isSubmitting || rating === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RAGFeedbackModal;
