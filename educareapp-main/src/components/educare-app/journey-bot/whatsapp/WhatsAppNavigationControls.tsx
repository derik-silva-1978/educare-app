import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhatsAppNavigationControlsProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onRetry: () => void;
  isAnswered: boolean;
  isLoading?: boolean;
}

export default function WhatsAppNavigationControls({
  canGoPrevious,
  canGoNext,
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onRetry,
  isAnswered,
  isLoading = false
}: WhatsAppNavigationControlsProps) {
  return (
    <motion.div 
      className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-t border-border/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Botão Anterior */}
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={!canGoPrevious || isLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 hover:bg-card/90 border-border/50 disabled:opacity-40 transition-all duration-200"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {/* Centro - Botão Repetir Simples */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRetry}
        disabled={isLoading}
        className="p-2 rounded-full hover:bg-muted/80 transition-colors duration-200"
        title="Repetir pergunta"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      {/* Botão Próximo - Sem animação pulse que causa flickering */}
      <Button
        variant={isAnswered && canGoNext ? "default" : "outline"}
        size="sm"
        onClick={onNext}
        disabled={!canGoNext || !isAnswered || isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
          isAnswered && canGoNext && !isLoading
            ? 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl active:scale-95' 
            : 'disabled:opacity-40'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
            <span className="text-xs">Avançando...</span>
          </div>
        ) : (
          <>
            <span className="hidden sm:inline font-medium">
              {isAnswered ? 'Próximo' : 'Responder primeiro'}
            </span>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </motion.div>
  );
}