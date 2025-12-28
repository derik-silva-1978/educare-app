import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Baby, Brain, Heart, MessageCircle, Hand, AlertTriangle,
  CheckCircle, Clock, TrendingUp, Loader2
} from 'lucide-react';
import { useProfessionalMilestones, Milestone, MilestoneStatus } from '@/hooks/useProfessionalMilestones';

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
  motor: Baby,
  motor_grosso: Baby,
  motor_fino: Hand,
  cognitivo: Brain,
  linguagem: MessageCircle,
  social: Heart,
  emocional: Heart,
  sensorial: Brain,
};

const domainLabels: Record<string, string> = {
  motor: 'Motor',
  motor_grosso: 'Motor Grosso',
  motor_fino: 'Motor Fino',
  cognitivo: 'Cognitivo',
  linguagem: 'Linguagem',
  social: 'Social/Emocional',
  emocional: 'Emocional',
  sensorial: 'Sensorial',
};

const domainColors: Record<string, string> = {
  motor: 'bg-blue-100 text-blue-700',
  motor_grosso: 'bg-blue-100 text-blue-700',
  motor_fino: 'bg-purple-100 text-purple-700',
  cognitivo: 'bg-amber-100 text-amber-700',
  linguagem: 'bg-green-100 text-green-700',
  social: 'bg-pink-100 text-pink-700',
  emocional: 'bg-pink-100 text-pink-700',
  sensorial: 'bg-teal-100 text-teal-700',
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

const getStatusBadge = (status: MilestoneStatus | string) => {
  switch (status) {
    case 'achieved':
      return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Alcançado</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-700"><Clock className="h-3 w-3 mr-1" />Em progresso</Badge>;
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-700"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
    case 'delayed':
      return <Badge className="bg-red-100 text-red-700"><AlertTriangle className="h-3 w-3 mr-1" />Atrasado</Badge>;
    default:
      return null;
  }
};

const ChildIndicatorsPanel: React.FC<ChildIndicatorsPanelProps> = ({ child }) => {
  const { data, isLoading, error } = useProfessionalMilestones(child.id);
  
  const ageDisplay = data?.child?.ageInMonths 
    ? `${data.child.ageInMonths} mes${data.child.ageInMonths !== 1 ? 'es' : ''}`
    : calculateAgeDisplay(child.birthDate);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-muted-foreground">Carregando indicadores...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <p className="text-sm text-amber-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error === 'Erro ao buscar marcos' 
                ? 'Os marcos oficiais ainda não foram cadastrados. Execute o seed de marcos no painel de administração.'
                : error}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {child.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-blue-900">{child.name}</h2>
                <p className="text-blue-700">{ageDisplay} de vida</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summary = data?.summary || { total: 0, achieved: 0, inProgress: 0, pending: 0 };
  const progressPercent = summary.total > 0 
    ? ((summary.achieved + summary.inProgress * 0.5) / summary.total) * 100 
    : 0;
  const byCategory = data?.byCategory || {};

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {child.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-900">{child.name}</h2>
              <p className="text-blue-700">{ageDisplay} de vida</p>
              {data?.child?.ageInMonths !== undefined && (
                <p className="text-sm text-blue-600">Mês {data.child.ageInMonths}</p>
              )}
            </div>
            <div className="text-right">
              {summary.achieved === summary.total && summary.total > 0 ? (
                <Badge className="bg-green-100 text-green-700 mb-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Desenvolvimento excelente
                </Badge>
              ) : summary.inProgress > 0 ? (
                <Badge className="bg-blue-100 text-blue-700 mb-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {summary.inProgress} em progresso
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
              <span className="font-medium">{summary.achieved} de {summary.total} mapeados</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{summary.inProgress} em progresso</span>
              <span>{summary.pending} pendentes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(byCategory).length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Marcos por Domínio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(byCategory).map(([category, milestones]) => {
              const Icon = domainIcons[category] || Baby;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${domainColors[category] || 'bg-gray-100 text-gray-700'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">{domainLabels[category] || category}</span>
                    <Badge variant="outline" className="text-xs">
                      {milestones.filter(m => m.status === 'achieved').length}/{milestones.length}
                    </Badge>
                  </div>
                  <div className="ml-8 space-y-1.5">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between text-sm py-1 border-b border-dashed last:border-0">
                        <span className="text-muted-foreground flex-1">{milestone.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Mês {milestone.targetMonth}</span>
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
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Nenhum marco de desenvolvimento encontrado para esta faixa etária.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChildIndicatorsPanel;
