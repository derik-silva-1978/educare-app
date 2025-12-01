
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Book, BookOpen, Bookmark, BookmarkCheck, HelpCircle, AlertTriangle, Download } from 'lucide-react';
import { manualTopics } from '@/data/help/manual-topics';
import { Link } from 'react-router-dom';

export const UserManualSection: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const currentTopic = selectedTopic 
    ? manualTopics.find(topic => topic.id === selectedTopic) 
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Topics sidebar */}
      <Card className="md:col-span-1">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Tópicos</h3>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-1">
              {manualTopics.map((topic) => (
                <Button
                  key={topic.id}
                  variant={selectedTopic === topic.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <topic.icon className="mr-2 h-4 w-4" />
                  <span className="truncate">{topic.title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Content area */}
      <Card className="md:col-span-3">
        <CardContent className="p-6">
          {currentTopic ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{currentTopic.title}</h2>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
              </div>
              
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentTopic.content }} />
              
              {currentTopic.relatedVideos && currentTopic.relatedVideos.length > 0 && (
                <div className="mt-8 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Tutoriais Relacionados</h3>
                  <div className="space-y-2">
                    {currentTopic.relatedVideos.map((videoId) => {
                      const video = tutorialVideos.find(v => v.id === videoId);
                      return video ? (
                        <Link 
                          key={video.id} 
                          to={`/smart-pei/help/tutorials/${video.id}`}
                          className="flex items-center p-2 rounded-md border hover:bg-muted"
                        >
                          <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{video.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Book className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">Manual do Usuário</h3>
              <p className="mt-2 text-muted-foreground">
                Selecione um tópico no menu lateral para ver seu conteúdo.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// This import will be used by the component
const tutorialVideos = [
  { id: "getting-started", title: "Primeiros Passos com o Smart PEI" },
  { id: "creating-pei", title: "Como Criar um PEI" },
  { id: "assessments", title: "Realizando Avaliações" },
  { id: "reports", title: "Gerando Relatórios" },
];
