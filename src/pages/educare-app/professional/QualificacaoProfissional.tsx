import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, Video, FileText, GraduationCap, 
  ExternalLink, Clock, Newspaper, Loader2
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
    <Card className={featured ? 'border-primary/30 bg-primary/5' : 'hover:shadow-md transition-shadow'}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={featured ? 'default' : 'secondary'} className="font-medium">
                {item.category || item.type}
              </Badge>
              {item.duration && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.duration}
                </span>
              )}
            </div>
            <h3 className="font-semibold mb-1 text-foreground">{item.title}</h3>
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
            <Button variant="default" size="sm" className="shrink-0 font-medium" asChild>
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
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1 text-foreground">{item.title}</h3>
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
                <Badge variant="outline" className="text-xs font-medium">
                  {item.level}
                </Badge>
              )}
            </div>
          </div>
          {item.cta_url && (
            <Button variant="default" size="sm" className="font-medium" asChild>
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

const QualificacaoProfissional: React.FC = () => {
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

  return (
    <>
      <Helmet>
        <title>Qualificação Profissional | Educare+</title>
      </Helmet>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <GraduationCap className="h-7 w-7 text-primary" />
            Qualificação Profissional
          </h1>
          <p className="text-muted-foreground mt-2">
            Acesse materiais de apoio, artigos, treinamentos e cursos para aprimorar sua prática profissional
          </p>
        </div>

        <Tabs defaultValue="material" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50">
            <TabsTrigger 
              value="material" 
              className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="h-4 w-4 mr-2" />
              Material de Apoio
            </TabsTrigger>
            <TabsTrigger 
              value="artigos"
              className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Newspaper className="h-4 w-4 mr-2" />
              Artigos
            </TabsTrigger>
            <TabsTrigger 
              value="treinamentos"
              className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Video className="h-4 w-4 mr-2" />
              Treinamentos
            </TabsTrigger>
            <TabsTrigger 
              value="cursos"
              className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Cursos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="material" className="space-y-4">
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Materiais de Apoio
                </CardTitle>
              </CardHeader>
            </Card>
            {staticResourceItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow relative overflow-hidden border-l-4 border-l-amber-500">
                  {item.status === 'coming_soon' && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-300 font-medium">
                        Em Desenvolvimento
                      </Badge>
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${item.status === 'coming_soon' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${item.status === 'coming_soon' ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        {item.status === 'coming_soon' && (
                          <p className="text-xs text-amber-600 mt-2 font-medium">
                            Este recurso estará disponível em breve.
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="font-medium">{item.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="artigos" className="space-y-4">
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                  Artigos e Notícias
                </CardTitle>
              </CardHeader>
            </Card>
            {newsLoading ? (
              <LoadingSkeleton />
            ) : newsItems.length > 0 ? (
              newsItems.map((item, index) => (
                <ContentCard key={item.id} item={item} featured={index === 0} />
              ))
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Newspaper className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Nenhum artigo disponível no momento.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Os artigos são gerenciados pelo administrador do sistema.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="treinamentos" className="space-y-4">
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Treinamentos
                </CardTitle>
              </CardHeader>
            </Card>
            {trainingLoading ? (
              <LoadingSkeleton />
            ) : trainingItems.length > 0 ? (
              trainingItems.map((item) => (
                <TrainingCard key={item.id} item={item} />
              ))
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Nenhum treinamento disponível no momento.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Os treinamentos são gerenciados pelo administrador.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cursos" className="space-y-4">
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Cursos
                </CardTitle>
              </CardHeader>
            </Card>
            {courseLoading ? (
              <LoadingSkeleton />
            ) : courseItems.length > 0 ? (
              courseItems.map((item) => (
                <TrainingCard key={item.id} item={item} />
              ))
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12">
                  <div className="text-center">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Nenhum curso disponível no momento.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Os cursos são gerenciados pelo administrador.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default QualificacaoProfissional;
