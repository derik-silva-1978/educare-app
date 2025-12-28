import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, Video, FileText, GraduationCap, 
  ExternalLink, Clock, Star, TrendingUp, Loader2
} from 'lucide-react';
import { useContentItems, ContentItem } from '@/hooks/useContentItems';

const staticResourceItems = [
  {
    id: '1',
    title: 'Caderneta da Criança - MS',
    description: 'Documento oficial com marcos e orientações do Ministério da Saúde.',
    type: 'PDF',
    icon: FileText,
    status: 'coming_soon' as const,
  },
  {
    id: '2',
    title: 'Escala Denver II - Guia de Aplicação',
    description: 'Manual para aplicação da escala de triagem do desenvolvimento.',
    type: 'PDF',
    icon: FileText,
    status: 'coming_soon' as const,
  },
  {
    id: '3',
    title: 'Protocolo de Vigilância do Desenvolvimento',
    description: 'Fluxograma de acompanhamento e encaminhamento.',
    type: 'PDF',
    icon: FileText,
    status: 'coming_soon' as const,
  },
];

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const ContentCard: React.FC<{ item: ContentItem; featured?: boolean }> = ({ item, featured }) => {
  return (
    <Card className={featured ? 'border-blue-200 bg-blue-50/50' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={featured ? 'default' : 'secondary'}>
                {item.category || item.type}
              </Badge>
              {item.duration && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.duration}
                </span>
              )}
            </div>
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.summary || item.description}
            </p>
            {item.publish_date && (
              <p className="text-xs text-muted-foreground mt-2">
                Publicado em {formatDate(item.publish_date)}
              </p>
            )}
          </div>
          {item.cta_url && (
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <a href={item.cta_url} target="_blank" rel="noopener noreferrer">
                {item.cta_text || 'Ler mais'}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TrainingCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  const Icon = item.type === 'course' ? GraduationCap : Video;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {item.summary || item.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {item.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.duration}
                </span>
              )}
              {item.level && (
                <Badge variant="outline" className="text-xs">
                  {item.level}
                </Badge>
              )}
            </div>
          </div>
          {item.cta_url && (
            <Button variant="default" size="sm" asChild>
              <a href={item.cta_url} target="_blank" rel="noopener noreferrer">
                Acessar
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ProfessionalResourcesHub: React.FC = () => {
  const { items: newsItems, isLoading: newsLoading } = useContentItems({ 
    type: 'news', 
    audience: 'professionals',
    limit: 10 
  });
  
  const { items: trainingItems, isLoading: trainingLoading } = useContentItems({ 
    type: 'training',
    audience: 'professionals',
    limit: 10 
  });
  
  const { items: courseItems, isLoading: courseLoading } = useContentItems({ 
    type: 'course',
    audience: 'professionals',
    limit: 10 
  });

  const allTrainings = [...trainingItems, ...courseItems];

  return (
    <>
      <Helmet>
        <title>Recursos e Qualificação | Educare+</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Recursos e Qualificação
          </h1>
          <p className="text-muted-foreground mt-1">
            Notícias, cursos e materiais de apoio para sua prática profissional
          </p>
        </div>

        <Tabs defaultValue="news" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="training">Capacitação</TabsTrigger>
            <TabsTrigger value="resources">Material de Apoio</TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-4">
            {newsLoading ? (
              <LoadingSkeleton />
            ) : newsItems.length > 0 ? (
              newsItems.map((item, index) => (
                <ContentCard key={item.id} item={item} featured={index === 0} />
              ))
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Nenhuma notícia disponível no momento.
                  </p>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    As notícias são gerenciadas pelo administrador do sistema.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            {(trainingLoading || courseLoading) ? (
              <LoadingSkeleton />
            ) : allTrainings.length > 0 ? (
              allTrainings.map((item) => (
                <TrainingCard key={item.id} item={item} />
              ))
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Nenhum treinamento disponível no momento.
                  </p>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Os treinamentos e cursos são gerenciados pelo administrador.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            {staticResourceItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow relative overflow-hidden">
                  {item.status === 'coming_soon' && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-300">
                        Em Desenvolvimento
                      </Badge>
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${item.status === 'coming_soon' ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${item.status === 'coming_soon' ? 'text-muted-foreground' : ''}`}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        {item.status === 'coming_soon' && (
                          <p className="text-xs text-amber-600 mt-2">
                            Este recurso estará disponível em breve.
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfessionalResourcesHub;
