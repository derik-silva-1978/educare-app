
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TutorialVideo } from '@/components/smart-pei/help/TutorialVideo';
import { TutorialLevel, TutorialCategory } from '@/types/tutorial';
import { tutorialVideos } from '@/data/help/tutorial-videos';
import { Search, SlidersHorizontal, BookOpen, Play, School, FileText, Users, Settings, BrainCircuit } from 'lucide-react';

export const TutorialSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TutorialCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<TutorialLevel | 'all'>('all');
  
  const filteredVideos = tutorialVideos.filter(video => {
    // Filter by category
    if (activeTab !== 'all' && video.category !== activeTab) return false;
    
    // Filter by level
    if (levelFilter !== 'all' && video.level !== levelFilter) return false;
    
    // Filter by search query
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !video.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="tutorial-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Tutoriais em Vídeo</h2>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar tutoriais..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as TutorialLevel | 'all')}>
            <SelectTrigger className="w-full sm:w-44">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="beginner">Iniciante</SelectItem>
              <SelectItem value="intermediate">Intermediário</SelectItem>
              <SelectItem value="advanced">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TutorialCategory | 'all')} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Play className="h-4 w-4" />
            <span className="hidden md:inline">Todos</span>
          </TabsTrigger>
          
          <TabsTrigger value="getting-started" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Introdução</span>
          </TabsTrigger>
          
          <TabsTrigger value="students" className="flex items-center gap-1">
            <School className="h-4 w-4" />
            <span className="hidden md:inline">Alunos</span>
          </TabsTrigger>
          
          <TabsTrigger value="assessments" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Avaliações</span>
          </TabsTrigger>
          
          <TabsTrigger value="pei" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">PEI</span>
          </TabsTrigger>
          
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Relatórios</span>
          </TabsTrigger>
          
          <TabsTrigger value="teams" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Equipes</span>
          </TabsTrigger>
          
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <BrainCircuit className="h-4 w-4" />
            <span className="hidden md:inline">IA</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map(video => (
                <TutorialVideo key={video.id} tutorial={video} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Play className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Nenhum tutorial encontrado</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Não encontramos tutoriais correspondentes aos seus critérios. Tente ajustar seus filtros ou termos de pesquisa.
              </p>
              <Button 
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearchQuery('');
                  setLevelFilter('all');
                  setActiveTab('all');
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorialSection;
