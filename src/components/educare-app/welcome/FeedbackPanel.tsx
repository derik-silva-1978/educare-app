import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquarePlus, Send, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const FeedbackPanel: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim() && !rating) {
      toast.error('Por favor, adicione um comentário ou selecione uma avaliação');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Obrigado pelo seu feedback! Sua opinião nos ajuda a melhorar.');
      setFeedback('');
      setRating(null);
    } catch (error) {
      toast.error('Erro ao enviar feedback. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquarePlus className="h-5 w-5 text-green-600" />
          Sua Opinião
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Nos ajude a melhorar! Como está sendo sua experiência com o Educare+?
        </p>
        
        <div className="flex gap-2">
          <Button
            variant={rating === 'positive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRating(rating === 'positive' ? null : 'positive')}
            className={rating === 'positive' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Gostando
          </Button>
          <Button
            variant={rating === 'negative' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRating(rating === 'negative' ? null : 'negative')}
            className={rating === 'negative' ? 'bg-amber-600 hover:bg-amber-700' : ''}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Pode melhorar
          </Button>
        </div>

        <Textarea
          placeholder="Conte-nos mais sobre sua experiência ou sugestões..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          className="resize-none"
        />

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (!feedback.trim() && !rating)}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackPanel;
