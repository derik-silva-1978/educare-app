import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Video, FileText, GraduationCap, 
  ExternalLink, Clock, Star, TrendingUp 
} from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: 'Novas Diretrizes para Triagem do Desenvolvimento',
    description: 'Sociedade Brasileira de Pediatria atualiza recomendações para acompanhamento nos primeiros anos.',
    category: 'Diretrizes',
    date: '27/12/2025',
    readTime: '8 min',
    featured: true,
  },
  {
    id: 2,
    title: 'Impacto das Telas no Desenvolvimento Infantil',
    description: 'Estudo recente analisa efeitos do tempo de tela em crianças de 0 a 3 anos.',
    category: 'Pesquisa',
    date: '25/12/2025',
    readTime: '6 min',
    featured: false,
  },
  {
    id: 3,
    title: 'Marcos de Linguagem: O Que Esperar em Cada Fase',
    description: 'Guia prático para profissionais sobre desenvolvimento da linguagem.',
    category: 'Artigo',
    date: '22/12/2025',
    readTime: '10 min',
    featured: false,
  },
];

const trainingItems = [
  {
    id: 1,
    title: 'Intervenção Precoce: Fundamentos e Práticas',
    type: 'Curso Online',
    duration: '12 horas',
    level: 'Intermediário',
    icon: GraduationCap,
  },
  {
    id: 2,
    title: 'Avaliação do Desenvolvimento Motor',
    type: 'Workshop',
    duration: '4 horas',
    level: 'Básico',
    icon: Video,
  },
  {
    id: 3,
    title: 'Orientação Familiar em Contexto Clínico',
    type: 'Webinar',
    duration: '2 horas',
    level: 'Todos',
    icon: Video,
  },
];

const resourceItems = [
  {
    id: 1,
    title: 'Caderneta da Criança - MS',
    description: 'Documento oficial com marcos e orientações do Ministério da Saúde.',
    type: 'PDF',
    icon: FileText,
  },
  {
    id: 2,
    title: 'Escala Denver II - Guia de Aplicação',
    description: 'Manual para aplicação da escala de triagem do desenvolvimento.',
    type: 'PDF',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Protocolo de Vigilância do Desenvolvimento',
    description: 'Fluxograma de acompanhamento e encaminhamento.',
    type: 'PDF',
    icon: FileText,
  },
];

const ProfessionalResourcesHub: React.FC = () => {
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
            {newsItems.map((item) => (
              <Card key={item.id} className={item.featured ? 'border-blue-200 bg-blue-50/50' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={item.featured ? 'default' : 'secondary'}>
                          {item.category}
                        </Badge>
                        {item.featured && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">
                            <Star className="h-3 w-3 mr-1" />
                            Destaque
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{item.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.readTime}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trainingItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <item.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration}
                      </span>
                      <Badge variant="secondary">{item.level}</Badge>
                    </div>
                    <Button className="w-full" variant="outline">
                      Acessar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Trilha de Capacitação Educare+</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete cursos e ganhe certificados para sua carreira profissional.
                    </p>
                  </div>
                  <Badge className="bg-blue-600">Em breve</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            {resourceItems.map((item) => (
              <Card key={item.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <item.icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      {item.type}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Mais materiais serão adicionados em breve. 
                  <br />
                  Tem sugestões? Entre em contato conosco.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfessionalResourcesHub;
