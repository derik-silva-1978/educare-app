
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { BookOpen, Search, Filter, Tag, Clock, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EducareActivitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample activity data - in a real app, this would come from an API
  const activities = [
    {
      id: '1',
      title: 'Contação de Histórias Interativa',
      description: 'Estimule o desenvolvimento da linguagem e a imaginação através da contação de histórias interativa.',
      ageRange: '2-4 anos',
      category: 'language',
      categoryLabel: 'Linguagem',
      duration: '15-20 min',
      featured: true,
      image: 'https://placehold.co/600x400/e0f2fe/0369a1?text=Atividade+1'
    },
    {
      id: '2',
      title: 'Circuito Motor',
      description: 'Um circuito de atividades para desenvolver coordenação motora grossa e equilíbrio.',
      ageRange: '3-5 anos',
      category: 'motor',
      categoryLabel: 'Motor',
      duration: '20-30 min',
      featured: true,
      image: 'https://placehold.co/600x400/fef3c7/92400e?text=Atividade+2'
    },
    {
      id: '3',
      title: 'Jogo de Classificação',
      description: 'Atividade para desenvolver habilidades cognitivas de classificação e categorização.',
      ageRange: '4-6 anos',
      category: 'cognitive',
      categoryLabel: 'Cognitivo',
      duration: '15 min',
      featured: false,
      image: 'https://placehold.co/600x400/f3e8ff/7e22ce?text=Atividade+3'
    },
    {
      id: '4',
      title: 'Brincadeira Sensorial com Massinha',
      description: 'Estimule os sentidos e a coordenação motora fina com massinha caseira.',
      ageRange: '1-3 anos',
      category: 'sensory',
      categoryLabel: 'Sensorial',
      duration: '20 min',
      featured: false,
      image: 'https://placehold.co/600x400/dcfce7/16a34a?text=Atividade+4'
    }
  ];
  
  const filteredActivities = activities.filter(activity => 
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const featuredActivities = filteredActivities.filter(activity => activity.featured);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Helmet>
        <title>Atividades | Educare</title>
        <meta name="description" content="Atividades para estimular o desenvolvimento infantil" />
      </Helmet>
      
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Atividades</h1>
          <p className="text-muted-foreground">
            Explore atividades para estimular o desenvolvimento infantil
          </p>
        </header>
        
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="language">Linguagem</TabsTrigger>
                <TabsTrigger value="motor">Motor</TabsTrigger>
                <TabsTrigger value="cognitive">Cognitivo</TabsTrigger>
                <TabsTrigger value="sensory">Sensorial</TabsTrigger>
              </TabsList>
              
              <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar atividades..."
                    className="pl-9 w-full sm:w-[240px]"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="all">
              {featuredActivities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Atividades em Destaque</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredActivities.map(activity => (
                      <Card key={activity.id} className="overflow-hidden flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                          <img 
                            src={activity.image} 
                            alt={activity.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{activity.title}</h3>
                              <div className="flex items-center gap-2 mt-1 mb-2">
                                <Badge variant="outline" className="bg-primary/5 text-primary">
                                  {activity.categoryLabel}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {activity.ageRange}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {activity.duration}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {activity.description}
                          </p>
                          <Button>Ver Atividade</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              <h2 className="text-xl font-semibold mb-4">Todas as Atividades</h2>
              {filteredActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredActivities.map(activity => (
                    <Card key={activity.id}>
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={activity.image} 
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{activity.title}</CardTitle>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-primary/5 text-primary">
                            {activity.categoryLabel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {activity.ageRange}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {activity.description}
                        </CardDescription>
                        <Button className="w-full">Ver Atividade</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma atividade encontrada</h3>
                    <p className="text-muted-foreground mb-4">
                      Não encontramos atividades que correspondam à sua busca.
                    </p>
                    <Button onClick={() => setSearchQuery('')}>Limpar Busca</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {['language', 'motor', 'cognitive', 'sensory'].map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredActivities
                    .filter(activity => activity.category === category)
                    .map(activity => (
                      <Card key={activity.id}>
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={activity.image} 
                            alt={activity.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{activity.title}</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-primary/5 text-primary">
                              {activity.categoryLabel}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {activity.ageRange}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4">
                            {activity.description}
                          </CardDescription>
                          <Button className="w-full">Ver Atividade</Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
                
                {filteredActivities.filter(activity => activity.category === category).length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma atividade encontrada</h3>
                      <p className="text-muted-foreground mb-4">
                        Não encontramos atividades nesta categoria que correspondam à sua busca.
                      </p>
                      <Button onClick={() => setSearchQuery('')}>Limpar Busca</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default EducareActivitiesPage;
