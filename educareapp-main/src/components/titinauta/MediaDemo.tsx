import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Video, AudioLines, MessageSquare } from 'lucide-react';

import MediaMessage from './MediaMessage';
import AudioMessage from './AudioMessage';
import ChatMessage from './ChatMessage';
import mediaJourneyContent, { mediaMessageExamples } from '@/data/titinauta-media-demo';

/**
 * Componente de demonstração dos recursos multimídia do TitiNauta
 * Este componente é usado apenas para fins de demonstração e não deve ser usado em produção
 */
const MediaDemo: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<string>('green');
  
  // Temas disponíveis
  const themes = [
    { name: 'green', label: 'Verde', color: '#22c55e' },
    { name: 'blue', label: 'Azul', color: '#3b82f6' },
    { name: 'purple', label: 'Roxo', color: '#8b5cf6' },
    { name: 'orange', label: 'Laranja', color: '#f97316' },
    { name: 'pink', label: 'Rosa', color: '#ec4899' }
  ];
  
  return (
    <div className="media-demo p-4">
      <h1 className="text-2xl font-bold mb-4">TitiNauta - Demonstração de Recursos Multimídia</h1>
      <p className="mb-6 text-gray-600">
        Esta página demonstra os componentes multimídia implementados no TitiNauta.
        Você pode alternar entre os diferentes tipos de mídia e temas visuais.
      </p>
      
      <div className="theme-selector mb-6">
        <h2 className="text-lg font-semibold mb-2">Tema Visual:</h2>
        <div className="flex flex-wrap gap-2">
          {themes.map(theme => (
            <Button
              key={theme.name}
              variant={activeTheme === theme.name ? 'default' : 'outline'}
              onClick={() => setActiveTheme(theme.name)}
              className="flex items-center gap-2"
              style={{
                backgroundColor: activeTheme === theme.name ? theme.color : 'transparent',
                color: activeTheme === theme.name ? 'white' : 'inherit',
                borderColor: theme.color
              }}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: theme.color }}
              />
              {theme.label}
            </Button>
          ))}
        </div>
      </div>
      
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Imagens
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Vídeos
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <AudioLines className="h-4 w-4" />
            Áudio
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Mensagens
          </TabsTrigger>
        </TabsList>
        
        <div className={`demo-container titinauta-chat theme-${activeTheme}`}>
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Componente MediaMessage (Imagens)</CardTitle>
                <CardDescription>
                  Exibe imagens com controles para expandir e legenda opcional.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Imagem do Bot:</h3>
                    <MediaMessage 
                      type="image"
                      src="/assets/images/titinauta-welcome.jpg"
                      alt="TitiNauta dando boas-vindas"
                      caption="Bem-vindo à jornada de desenvolvimento 6-7 meses!"
                      isBot={true}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Imagem do Usuário:</h3>
                    <MediaMessage 
                      type="image"
                      src="/assets/images/motor-development.jpg"
                      alt="Desenvolvimento motor"
                      caption="Foto do meu bebê sentando sozinho pela primeira vez!"
                      isBot={false}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Nota: As imagens se adaptam automaticamente ao tamanho do container.
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Componente MediaMessage (Vídeos)</CardTitle>
                <CardDescription>
                  Reproduz vídeos com controles nativos e opção de tela cheia.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Vídeo do Bot:</h3>
                    <MediaMessage 
                      type="video"
                      src="/assets/videos/motor-exercises.mp4"
                      alt="Exercícios para desenvolvimento motor"
                      caption="Exercícios para fortalecer os músculos das costas"
                      isBot={true}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Vídeo do Usuário:</h3>
                    <MediaMessage 
                      type="video"
                      src="/assets/videos/playtime-activities.mp4"
                      alt="Atividades de brincadeira"
                      caption="Vídeo do nosso momento de brincadeira"
                      isBot={false}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Nota: Os vídeos possuem controles de reprodução, volume e tela cheia.
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="audio">
            <Card>
              <CardHeader>
                <CardTitle>Componente AudioMessage</CardTitle>
                <CardDescription>
                  Reproduz áudios com controles de reprodução e volume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Áudio do Bot:</h3>
                    <AudioMessage 
                      src="/assets/audio/cognitive-tips.mp3"
                      caption="Dicas sobre como estimular a permanência de objeto"
                      isBot={true}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Áudio do Usuário:</h3>
                    <AudioMessage 
                      src="/assets/audio/lullaby.mp3"
                      caption="Canção de ninar que meu bebê adora"
                      isBot={false}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Nota: Os áudios possuem controles de reprodução, progresso e volume.
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Integração com ChatMessage</CardTitle>
                <CardDescription>
                  Mensagens de chat com diferentes tipos de mídia.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="chat-messages-demo">
                    {mediaMessageExamples.map(message => (
                      <ChatMessage 
                        key={message.id}
                        message={message}
                        isBot={message.type === 'bot'}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Nota: O componente ChatMessage detecta automaticamente o tipo de mídia e renderiza o componente apropriado.
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Dados de Demonstração:</h2>
        <p className="text-sm text-gray-600 mb-2">
          Os exemplos acima usam dados de demonstração que podem ser encontrados em:
        </p>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          src/data/titinauta-media-demo.ts
        </pre>
      </div>
    </div>
  );
};

export default MediaDemo;
