
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, BookOpen, Video, FileText, Download, BookMarked, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type ResourceType = 'article' | 'video' | 'pdf' | 'activity' | 'guide';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string[];
  ageRange: string;
  timeToComplete?: string;
  thumbnail?: string;
  url: string;
}

const typeIcons = {
  article: BookOpen,
  video: Video,
  pdf: FileText,
  activity: BookMarked,
  guide: BookMarked
};

const typeLabels = {
  article: 'Artigo',
  video: 'Vídeo',
  pdf: 'PDF',
  activity: 'Atividade',
  guide: 'Guia'
};

const MaterialCard = ({ resource }: { resource: Resource }) => {
  const Icon = typeIcons[resource.type];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Badge variant="outline" className="mb-2">
            {typeLabels[resource.type]}
          </Badge>
          {resource.timeToComplete && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {resource.timeToComplete}
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {resource.category.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          Idade: {resource.ageRange}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full gap-2">
          {resource.type === 'pdf' ? (
            <>
              <Download className="h-4 w-4" />
              Baixar Material
            </>
          ) : (
            <>
              <Icon className="h-4 w-4" />
              Acessar Material
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const MaterialApoio = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for resources
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Desenvolvimento Motor nos Primeiros Anos',
      description: 'Guia completo sobre o desenvolvimento motor infantil de 0 a 3 anos.',
      type: 'article',
      category: ['Desenvolvimento Motor', 'Primeira Infância'],
      ageRange: '0-3 anos',
      timeToComplete: '10 min',
      url: '#'
    },
    {
      id: '2',
      title: 'Atividades para Estimulação da Linguagem',
      description: 'Exercícios práticos para estimular o desenvolvimento da fala em crianças.',
      type: 'activity',
      category: ['Linguagem', 'Estimulação'],
      ageRange: '1-4 anos',
      timeToComplete: '20 min',
      url: '#'
    },
    {
      id: '3',
      title: 'Cartilha de Nutrição Infantil',
      description: 'Guia nutricional para uma alimentação saudável na infância.',
      type: 'pdf',
      category: ['Nutrição', 'Saúde'],
      ageRange: 'Todas as idades',
      url: '#'
    },
    {
      id: '4',
      title: 'Como Identificar Sinais de Autismo',
      description: 'Vídeo educativo sobre os primeiros sinais do Transtorno do Espectro Autista.',
      type: 'video',
      category: ['Desenvolvimento Atípico', 'TEA'],
      ageRange: '0-5 anos',
      timeToComplete: '15 min',
      url: '#'
    },
    {
      id: '5',
      title: 'Guia de Brincadeiras Sensoriais',
      description: 'Atividades para estimular os sentidos e promover o desenvolvimento infantil.',
      type: 'guide',
      category: ['Desenvolvimento Sensorial', 'Brincadeiras'],
      ageRange: '0-6 anos',
      url: '#'
    },
    {
      id: '6',
      title: 'Desenvolvimento Socioemocional na Idade Escolar',
      description: 'Artigo sobre a importância das habilidades socioemocionais.',
      type: 'article',
      category: ['Desenvolvimento Social', 'Emocional'],
      ageRange: '6-12 anos',
      timeToComplete: '12 min',
      url: '#'
    },
  ];

  // Filter resources based on search
  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Helmet>
        <title>Material de Apoio | Educare</title>
      </Helmet>
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Material de Apoio</h1>
          <p className="text-muted-foreground">
            Acesse artigos, vídeos e recursos para apoiar o desenvolvimento infantil
          </p>
        </header>

        {/* Search and filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar materiais..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="articles">Artigos</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="guides">Guias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                  <MaterialCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Nenhum material encontrado para sua pesquisa.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="articles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources
                .filter(r => r.type === 'article')
                .map((resource) => (
                  <MaterialCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources
                .filter(r => r.type === 'video')
                .map((resource) => (
                  <MaterialCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources
                .filter(r => r.type === 'activity')
                .map((resource) => (
                  <MaterialCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources
                .filter(r => r.type === 'guide' || r.type === 'pdf')
                .map((resource) => (
                  <MaterialCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-blue-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-800">Precisa de mais recursos?</CardTitle>
            <CardDescription className="text-blue-700">
              Nossa biblioteca é atualizada regularmente com novos materiais de apoio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100">
              Solicitar Material Específico
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MaterialApoio;
