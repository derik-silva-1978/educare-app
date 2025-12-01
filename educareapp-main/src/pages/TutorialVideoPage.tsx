import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TutorialVideo } from '@/components/smart-pei/help/TutorialVideo';
import { tutorialVideos } from '@/data/help/tutorial-videos';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  BookOpen 
} from 'lucide-react';

const TutorialVideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const tutorial = tutorialVideos.find(video => video.id === id);
  
  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold mb-4">Tutorial não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O tutorial solicitado não está disponível ou foi removido.
          </p>
          <Button asChild>
            <Link to="/smart-pei/help">Voltar para Ajuda</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const relatedTutorials = tutorialVideos
    .filter(video => video.category === tutorial.category && video.id !== tutorial.id)
    .slice(0, 3);
  
  const currentIndex = tutorialVideos.findIndex(video => video.id === id);
  const nextTutorial = currentIndex < tutorialVideos.length - 1 ? tutorialVideos[currentIndex + 1] : null;
  const prevTutorial = currentIndex > 0 ? tutorialVideos[currentIndex - 1] : null;
  
  return (
    <>
      <Helmet>
        <title>{tutorial.title} | Tutoriais Smart PEI</title>
        <meta name="description" content={tutorial.description} />
      </Helmet>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{tutorial.title}</h1>
              <p className="text-muted-foreground mt-2">{tutorial.description}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={tutorial.level === 'beginner' ? 'default' : tutorial.level === 'intermediate' ? 'secondary' : 'outline'}>
                {tutorial.level === 'beginner' ? 'Iniciante' : tutorial.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </Badge>
              
              <Badge variant="outline" className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {tutorial.duration}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0 aspect-video">
                <iframe 
                  src={tutorial.videoUrl} 
                  title={tutorial.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Descrição</TabsTrigger>
                <TabsTrigger value="transcript">Transcrição</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4 p-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sobre este tutorial</h3>
                  <p>{tutorial.description}</p>
                </div>
                
                {tutorial.topics && tutorial.topics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tópicos abordados</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {tutorial.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Adicionado em {new Date(tutorial.dateAdded).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="transcript" className="space-y-4 p-4">
                <h3 className="text-lg font-semibold mb-2">Transcrição</h3>
                {tutorial.transcript ? (
                  <div className="prose max-w-none">
                    <p>{tutorial.transcript}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Transcrição não disponível para este vídeo.</p>
                )}
              </TabsContent>
              
              <TabsContent value="resources" className="space-y-4 p-4">
                <h3 className="text-lg font-semibold mb-2">Recursos adicionais</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/smart-pei/help/manual/${tutorial.relatedManualSection}`}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Ver documentação relacionada
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar slides da apresentação (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Planilha de exercícios (XLSX)
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between items-center pt-4">
              {prevTutorial ? (
                <Button variant="outline" asChild>
                  <Link to={`/smart-pei/help/tutorials/${prevTutorial.id}`} className="flex items-center">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Anterior:</span>
                    <span className="ml-1 truncate max-w-[150px]">{prevTutorial.title}</span>
                  </Link>
                </Button>
              ) : (
                <div></div>
              )}
              
              {nextTutorial ? (
                <Button variant="outline" asChild>
                  <Link to={`/smart-pei/help/tutorials/${nextTutorial.id}`} className="flex items-center">
                    <span className="hidden sm:inline">Próximo:</span>
                    <span className="ml-1 truncate max-w-[150px]">{nextTutorial.title}</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Tutoriais Relacionados</h3>
              <div className="space-y-4">
                {relatedTutorials.length > 0 ? (
                  relatedTutorials.map(relatedVideo => (
                    <Link 
                      key={relatedVideo.id} 
                      to={`/smart-pei/help/tutorials/${relatedVideo.id}`}
                      className="block"
                    >
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex space-x-4">
                            <div className="w-24 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                              <img 
                                src={relatedVideo.thumbnail || `https://placehold.co/600x400/eee/ccc?text=Tutorial`} 
                                alt={relatedVideo.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium line-clamp-2">{relatedVideo.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{relatedVideo.duration}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground">Nenhum tutorial relacionado disponível.</p>
                )}
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/smart-pei/help">Ver todos os tutoriais</Link>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Manual do Usuário</h3>
              <Card>
                <CardContent className="p-4">
                  <p className="mb-4">
                    Para informações mais detalhadas sobre este tópico, consulte nosso manual do usuário.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to={`/smart-pei/help/manual/${tutorial.relatedManualSection}`}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Ver no Manual
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TutorialVideoPage;
