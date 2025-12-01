
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface AIAssistSuggestionProps<T = any> {
  title: string;
  onRequestSuggestion: () => Promise<T>;
  onAccept: (suggestion: T) => void;
  type: 'text' | 'list' | 'object' | 'custom';
  context?: string;
  renderSuggestion?: (suggestion: T) => React.ReactNode;
}

const AIAssistSuggestion = <T extends any>({
  title,
  onRequestSuggestion,
  onAccept,
  type,
  context,
  renderSuggestion
}: AIAssistSuggestionProps<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<T | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  const handleRequestSuggestion = async () => {
    setIsLoading(true);
    try {
      const result = await onRequestSuggestion();
      setSuggestion(result);
      setShowSuggestion(true);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAccept = () => {
    if (suggestion) {
      onAccept(suggestion);
      setShowSuggestion(false);
    }
  };
  
  const handleDismiss = () => {
    setShowSuggestion(false);
  };

  // Helper to determine how to render the suggestion based on its type
  const renderSuggestionContent = () => {
    if (!suggestion) return null;
    
    // If a custom renderer is provided, use it
    if (renderSuggestion) {
      return renderSuggestion(suggestion);
    }
    
    if (type === 'text') {
      if (typeof suggestion === 'string') {
        return <p className="text-sm">{suggestion}</p>;
      }
      return <p className="text-sm">Conteúdo indisponível</p>;
    } 
    else if (type === 'list') {
      if (Array.isArray(suggestion)) {
        if (suggestion.length === 0) {
          return <p className="text-sm">Nenhuma sugestão disponível</p>;
        }
        
        return (
          <ul className="text-sm space-y-1 list-disc pl-4">
            {suggestion.map((item, idx) => {
              // Handle different item types
              if (typeof item === 'string') {
                return <li key={idx}>{item}</li>;
              } else if (typeof item === 'object' && item !== null) {
                // For objects, try to extract title/description or just stringify
                const objItem = item as Record<string, any>;
                if (objItem.title || objItem.description) {
                  return (
                    <li key={idx}>
                      {objItem.title && <strong>{objItem.title}</strong>}
                      {objItem.title && objItem.description && ': '}
                      {objItem.description && objItem.description}
                    </li>
                  );
                } else {
                  // For strategy objects
                  if (objItem.description) {
                    return <li key={idx}>{objItem.description}</li>;
                  }
                  // Default case: just show the first value
                  const firstValue = Object.values(objItem)[0];
                  return <li key={idx}>{typeof firstValue === 'string' ? firstValue : 'Item '+idx}</li>;
                }
              }
              return <li key={idx}>Item {idx}</li>;
            })}
          </ul>
        );
      }
      
      return <p className="text-sm">Formato de sugestão inválido</p>;
    }
    else if (type === 'object') {
      if (typeof suggestion === 'object' && suggestion !== null) {
        return (
          <div className="text-sm space-y-2">
            {Object.entries(suggestion as Record<string, any>).map(([key, value], idx) => (
              <div key={idx}>
                <strong className="text-primary-foreground">{key}:</strong> {' '}
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </div>
            ))}
          </div>
        );
      }
      return <p className="text-sm">Formato de sugestão inválido</p>;
    }
    
    // Default fallback
    return <p className="text-sm">Tipo de sugestão não suportado</p>;
  };
  
  return (
    <>
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRequestSuggestion}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-1 text-primary" />
          )}
          Solicitar sugestão de {title}
        </Button>
        
        {context && (
          <p className="text-xs text-muted-foreground mt-1">{context}</p>
        )}
      </div>
      
      {showSuggestion && suggestion && (
        <Alert className="mb-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2 bg-primary/10">
                Sugestão IA
              </Badge>
              <AlertDescription className="text-sm font-medium text-primary-foreground">
                Sugestão para {title}
              </AlertDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleAccept}
                title="Aceitar sugestão"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleDismiss}
                title="Descartar sugestão"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2 bg-background/80 rounded-md p-3 border">
            {renderSuggestionContent()}
          </div>
        </Alert>
      )}
    </>
  );
};

export default AIAssistSuggestion;
