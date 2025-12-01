
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DomainProgress as DomainProgressType, 
  DevelopmentDomain, 
  DomainLabels, 
  DomainIcons, 
  RecommendedActivity 
} from '@/types/assessment';
import DomainProgress from './DomainProgress';
import { Check, Download, Home, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizResultsProps {
  assessmentId: string;
  childName: string;
  date: string;
  domainProgress: DomainProgressType[];
  recommendations: RecommendedActivity[];
  onStartNew?: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  assessmentId,
  childName,
  date,
  domainProgress,
  recommendations,
  onStartNew
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Format date nicely
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Calculate overall score
  const totalScore = domainProgress.reduce((sum, domain) => sum + domain.score, 0);
  const overallScore = domainProgress.length > 0 
    ? Math.round(totalScore / domainProgress.length) 
    : 0;
  
  // Get recommendations grouped by domain
  const recommendationsByDomain: Record<DevelopmentDomain, RecommendedActivity[]> = {} as any;
  
  recommendations.forEach(rec => {
    if (!recommendationsByDomain[rec.domain]) {
      recommendationsByDomain[rec.domain] = [];
    }
    recommendationsByDomain[rec.domain].push(rec);
  });
  
  // Determine development status based on score
  const getDevelopmentStatus = (score: number) => {
    if (score >= 80) return { label: 'Desenvolvimento adequado', class: 'text-green-600', icon: '✓' };
    if (score >= 50) return { label: 'Desenvolvimento em progresso', class: 'text-amber-600', icon: '⟳' };
    return { label: 'Necessita atenção', class: 'text-red-600', icon: '!' };
  };
  
  const status = getDevelopmentStatus(overallScore);
  
  return (
    <Card className="mb-8 max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-2xl">Resultados da Avaliação</CardTitle>
            <CardDescription className="mt-1">
              {childName} | {formattedDate}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${status.class}`}>
              {status.icon} {status.label}
            </div>
            <div className="text-3xl font-bold">
              {overallScore}%
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              Recomendações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Progresso por Domínio</h3>
                <div className="space-y-4">
                  {domainProgress.map((domain) => (
                    <DomainProgress key={domain.domain} progress={domain} />
                  ))}
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Resumo da Avaliação</h3>
                <p className="text-sm text-muted-foreground">
                  A avaliação de desenvolvimento de {childName} obteve um resultado geral de <strong>{overallScore}%</strong>. 
                  {overallScore >= 80 && (
                    <span> Os resultados indicam um desenvolvimento adequado para a idade. Continue com as atividades recomendadas para fortalecer ainda mais o desenvolvimento.</span>
                  )}
                  {overallScore < 80 && overallScore >= 50 && (
                    <span> O desenvolvimento está em progresso, mas há áreas que podem ser fortalecidas. Verifique as recomendações para ajudar a estimular essas áreas.</span>
                  )}
                  {overallScore < 50 && (
                    <span> Algumas áreas precisam de maior atenção. Recomendamos implementar as atividades sugeridas e considerar uma consulta com um especialista em desenvolvimento infantil.</span>
                  )}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6">
            {Object.keys(recommendationsByDomain).length === 0 ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  Não há recomendações específicas para esta avaliação. O desenvolvimento está adequado!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(recommendationsByDomain).map(([domain, activities]) => (
                  <div key={domain} className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <span>{DomainIcons[domain as DevelopmentDomain]}</span>
                      <span>{DomainLabels[domain as DevelopmentDomain]}</span>
                    </h3>
                    
                    <div className="grid gap-4">
                      {activities.map((activity) => (
                        <Card key={activity.id} className="overflow-hidden shadow-sm">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {activity.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            <Home className="mr-2 h-4 w-4" />
            Ir para o Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(`/assessment/${assessmentId}/pdf`)}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
          
          {onStartNew && (
            <Button 
              onClick={onStartNew}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Iniciar Nova Avaliação
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResults;
