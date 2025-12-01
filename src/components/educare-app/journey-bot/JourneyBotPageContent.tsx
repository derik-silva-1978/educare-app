import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import JourneyBotChildSelector from './JourneyBotChildSelector';
import JourneyBotSessionManager from './JourneyBotSessionManager';
import JourneyBotErrorBoundary from './JourneyBotErrorBoundary';
import JourneyBotLoading from './JourneyBotLoading';
import JourneyBotErrorDisplay from './JourneyBotErrorDisplay';
import JourneyBotSampleDataImporter from './JourneyBotSampleDataImporter';

interface Child {
  id: string;
  name: string;
  birthdate: string;
  age: number;
  gender?: string;
}

interface JourneyBotPageContentProps {
  isLoading: boolean;
  error: string | null;
  showChildSelector: boolean;
  selectedChild: Child | null;
  children: Child[];
  onChildSelect: (childId: string) => void;
  onBackToSelector: () => void;
  onBackToDashboard: () => void;
  onShowChildSelector: () => void;
}

export default function JourneyBotPageContent({
  isLoading,
  error,
  showChildSelector,
  selectedChild,
  children,
  onChildSelect,
  onBackToSelector,
  onBackToDashboard,
  onShowChildSelector
}: JourneyBotPageContentProps) {
  if (isLoading) {
    return <JourneyBotLoading message="Carregando crianças..." />;
  }

  if (error) {
    return (
      <JourneyBotErrorDisplay
        error={error}
        onBackToDashboard={onBackToDashboard}
      />
    );
  }

  if (showChildSelector) {
    return (
      <div className="space-y-6">
        <JourneyBotChildSelector
          children={children}
          onChildSelect={onChildSelect}
        />
        
        {/* Admin controls for importing sample data */}
        <div className="flex justify-center">
          <details className="text-center">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Opções de Administrador
            </summary>
            <div className="mt-4">
              <JourneyBotSampleDataImporter />
            </div>
          </details>
        </div>
      </div>
    );
  }

  if (selectedChild) {
    return (
      <JourneyBotErrorBoundary onBack={onBackToSelector}>
        <JourneyBotSessionManager
          child={{
            id: selectedChild.id,
            name: selectedChild.name,
            age: selectedChild.age
          }}
          onBack={onBackToSelector}
        />
      </JourneyBotErrorBoundary>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <div className="text-gray-400 mb-4">🤔</div>
        <h3 className="text-lg font-semibold mb-2">Nenhuma criança selecionada</h3>
        <p className="text-muted-foreground mb-4">
          Por favor, selecione uma criança para iniciar a jornada.
        </p>
        <Button onClick={onShowChildSelector}>
          Selecionar Criança
        </Button>
      </CardContent>
    </Card>
  );
}