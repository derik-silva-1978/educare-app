import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EmDesenvolvimento: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full text-center">
        <CardContent className="pt-10 pb-8 px-8 space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-4">
              <Construction className="h-12 w-12 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700">
            Em Desenvolvimento
          </Badge>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Funcionalidade em Construção
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Estamos trabalhando para trazer esta funcionalidade para você em breve.
              Nossa equipe está dedicada a criar a melhor experiência possível.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmDesenvolvimento;
