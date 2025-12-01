
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, MessageSquare, Users, Activity, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simplified domain type for this component only
type AnalysisDomain = 'cognitive' | 'language' | 'social' | 'motor' | 'sensory' | 'emotional';

const domainIcons: Record<AnalysisDomain, React.ComponentType<any>> = {
  cognitive: Brain,
  language: MessageSquare,
  social: Users,
  motor: Activity,
  sensory: Eye,
  emotional: Heart
};

const ChildAnalysis: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Análise da Criança</h1>
          <p className="text-muted-foreground">
            Análise detalhada do desenvolvimento baseada no Journey Bot
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise do Journey Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A análise detalhada será implementada com base nos dados coletados pelo Journey Bot.
            Esta funcionalidade complementa o sistema de avaliação interativa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildAnalysis;
