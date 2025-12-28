import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Baby, Brain, Heart, MessageCircle, Hand, AlertTriangle,
  CheckCircle, Clock, TrendingUp
} from 'lucide-react';

interface ChildIndicatorsPanelProps {
  child: {
    id: string;
    name: string;
    birthDate: string;
    photo?: string;
  };
  onClose?: () => void;
}

const domainIcons: Record<string, React.ElementType> = {
  motor_grosso: Baby,
  motor_fino: Hand,
  cognitivo: Brain,
  linguagem: MessageCircle,
  social: Heart,
};

const domainLabels: Record<string, string> = {
  motor_grosso: 'Motor Grosso',
  motor_fino: 'Motor Fino',
  cognitivo: 'Cognitivo',
  linguagem: 'Linguagem',
  social: 'Social/Emocional',
};

const domainColors: Record<string, string> = {
  motor_grosso: 'bg-blue-100 text-blue-700',
  motor_fino: 'bg-purple-100 text-purple-700',
  cognitivo: 'bg-amber-100 text-amber-700',
  linguagem: 'bg-green-100 text-green-700',
  social: 'bg-pink-100 text-pink-700',
};

const calculateAgeInWeeks = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - birth.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

const calculateAgeDisplay = (birthDate: string): string => {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - birth.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffDays / 30);
  const weeks = Math.floor((diffDays % 30) / 7);
  
  if (months === 0) {
    return `${weeks} semana${weeks !== 1 ? 's' : ''}`;
  }
  return `${months} mes${months !== 1 ? 'es' : ''} e ${weeks} semana${weeks !== 1 ? 's' : ''}`;
};

const mockMilestones = [
  { domain: 'motor_grosso', description: 'Sustenta a cabeça', status: 'achieved', week: 8 },
  { domain: 'motor_grosso', description: 'Rola de bruços para costas', status: 'pending', week: 16 },
  { domain: 'motor_fino', description: 'Segura objetos com as mãos', status: 'achieved', week: 12 },
  { domain: 'cognitivo', description: 'Segue objetos com os olhos', status: 'achieved', week: 8 },
  { domain: 'cognitivo', description: 'Reconhece rostos familiares', status: 'pending', week: 12 },
  { domain: 'linguagem', description: 'Emite sons vocais (balbucio)', status: 'achieved', week: 8 },
  { domain: 'linguagem', description: 'Responde ao próprio nome', status: 'pending', week: 24 },
  { domain: 'social', description: 'Sorri socialmente', status: 'achieved', week: 6 },
  { domain: 'social', description: 'Demonstra ansiedade com estranhos', status: 'delayed', week: 32 },
];

const mockQuizResponses = [
  { date: '2025-12-20', topic: 'Desenvolvimento Motor', score: 85 },
  { date: '2025-12-15', topic: 'Sono e Rotina', score: 70 },
  { date: '2025-12-10', topic: 'Alimentação', score: 90 },
];

const DATA_IS_DEMO = true;

const ChildIndicatorsPanel: React.FC<ChildIndicatorsPanelProps> = ({ child }) => {
  const ageInWeeks = calculateAgeInWeeks(child.birthDate);
  const ageDisplay = calculateAgeDisplay(child.birthDate);
  
  const achievedCount = mockMilestones.filter(m => m.status === 'achieved').length;
  const totalExpected = mockMilestones.filter(m => m.week <= ageInWeeks).length;
  const delayedCount = mockMilestones.filter(m => m.status === 'delayed').length;
  
  const progressPercent = totalExpected > 0 ? (achievedCount / totalExpected) * 100 : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'achieved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Alcançado</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'delayed':
        return <Badge className="bg-red-100 text-red-700"><AlertTriangle className="h-3 w-3 mr-1" />Atrasado</Badge>;
      default:
        return null;
    }
  };

  const groupedMilestones = mockMilestones.reduce((acc, milestone) => {
    if (!acc[milestone.domain]) {
      acc[milestone.domain] = [];
    }
    acc[milestone.domain].push(milestone);
    return acc;
  }, {} as Record<string, typeof mockMilestones>);

  return (
    <div className="space-y-4">
      {DATA_IS_DEMO && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-3">
            <p className="text-sm text-amber-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Dados demonstrativos. Integração com marcos reais em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {child.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-900">{child.name}</h2>
              <p className="text-blue-700">{ageDisplay} de vida</p>
              <p className="text-sm text-blue-600">Semana {ageInWeeks}</p>
            </div>
            <div className="text-right">
              {delayedCount > 0 ? (
                <Badge variant="destructive" className="mb-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {delayedCount} marco(s) atrasado(s)
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700 mb-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Desenvolvimento adequado
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Marcos alcançados</span>
              <span className="font-medium">{achievedCount} de {totalExpected} esperados</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Baseado nos marcos esperados até a semana {ageInWeeks}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Marcos por Domínio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(groupedMilestones).map(([domain, milestones]) => {
            const Icon = domainIcons[domain] || Baby;
            return (
              <div key={domain} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${domainColors[domain]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{domainLabels[domain]}</span>
                </div>
                <div className="ml-8 space-y-1.5">
                  {milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-dashed last:border-0">
                      <span className="text-muted-foreground">{milestone.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Sem. {milestone.week}</span>
                        {getStatusBadge(milestone.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Avaliações Recentes (Quizzes)</CardTitle>
        </CardHeader>
        <CardContent>
          {mockQuizResponses.length > 0 ? (
            <div className="space-y-2">
              {mockQuizResponses.map((quiz, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{quiz.topic}</p>
                    <p className="text-xs text-muted-foreground">{quiz.date}</p>
                  </div>
                  <Badge variant={quiz.score >= 80 ? 'default' : quiz.score >= 60 ? 'secondary' : 'destructive'}>
                    {quiz.score}%
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma avaliação respondida ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildIndicatorsPanel;
