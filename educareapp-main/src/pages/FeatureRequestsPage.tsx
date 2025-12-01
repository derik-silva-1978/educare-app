
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronUp, 
  Search, 
  Plus, 
  MessageSquare, 
  ThumbsUp, 
  X, 
  Filter, 
  Check, 
  PlusCircle 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

// Mock data for feature requests
const mockFeatureRequests = [
  {
    id: 1,
    title: "Integração com Google Classroom",
    description: "Seria excelente ter integração com o Google Classroom para importar alunos e tarefas automaticamente.",
    votes: 42,
    status: "under-review",
    category: "integração",
    comments: 8,
    date: "2023-02-10",
    userVoted: false
  },
  {
    id: 2,
    title: "Modo escuro para toda a plataforma",
    description: "Por favor, adicionem um modo escuro completo para reduzir o cansaço visual durante o uso noturno.",
    votes: 36,
    status: "planned",
    category: "ui",
    comments: 12,
    date: "2023-03-05",
    userVoted: true
  },
  {
    id: 3,
    title: "Exportação de relatórios em formato PDF",
    description: "Precisamos da capacidade de exportar relatórios de progresso em PDF para compartilhar com pais e administradores.",
    votes: 29,
    status: "in-progress",
    category: "relatórios",
    comments: 5,
    date: "2023-03-15",
    userVoted: false
  },
  {
    id: 4,
    title: "Aplicativo móvel para Android e iOS",
    description: "Um aplicativo móvel facilitaria muito o acompanhamento das atividades e notificações quando estamos fora da escola.",
    votes: 54,
    status: "planned",
    category: "mobile",
    comments: 17,
    date: "2023-01-22",
    userVoted: false
  },
  {
    id: 5,
    title: "Suporte para múltiplos idiomas",
    description: "Seria útil ter a plataforma disponível em mais idiomas, especialmente inglês e espanhol.",
    votes: 23,
    status: "under-review",
    category: "acessibilidade",
    comments: 4,
    date: "2023-04-01",
    userVoted: false
  },
  {
    id: 6,
    title: "Calendário de eventos integrado",
    description: "Um calendário que mostra todas as atividades, avaliações e prazos em um único lugar.",
    votes: 18,
    status: "new",
    category: "organização",
    comments: 2,
    date: "2023-04-10",
    userVoted: false
  },
  {
    id: 7,
    title: "Notificações por WhatsApp",
    description: "Enviar notificações importantes via WhatsApp para garantir que todos os pais as recebam.",
    votes: 31,
    status: "new",
    category: "comunicação",
    comments: 9,
    date: "2023-04-05",
    userVoted: true
  },
  {
    id: 8,
    title: "Sistema de gamificação para alunos",
    description: "Adicionar elementos de gamificação como pontos, conquistas e rankings para motivar os alunos.",
    votes: 26,
    status: "planned",
    category: "engajamento",
    comments: 7,
    date: "2023-03-28",
    userVoted: false
  }
];

// Status display configuration
const statusConfig = {
  "new": { label: "Novo", color: "bg-blue-100 text-blue-800" },
  "under-review": { label: "Em Análise", color: "bg-purple-100 text-purple-800" },
  "planned": { label: "Planejado", color: "bg-amber-100 text-amber-800" },
  "in-progress": { label: "Em Desenvolvimento", color: "bg-green-100 text-green-800" },
  "completed": { label: "Implementado", color: "bg-emerald-100 text-emerald-800" },
  "declined": { label: "Não Aprovado", color: "bg-red-100 text-red-800" }
};

const categories = [
  { value: "all", label: "Todas categorias" },
  { value: "ui", label: "Interface do usuário" },
  { value: "integração", label: "Integrações" },
  { value: "relatórios", label: "Relatórios" },
  { value: "mobile", label: "Aplicativo Móvel" },
  { value: "acessibilidade", label: "Acessibilidade" },
  { value: "organização", label: "Organização" },
  { value: "comunicação", label: "Comunicação" },
  { value: "engajamento", label: "Engajamento" },
];

const FeatureRequestsPage = () => {
  const [features, setFeatures] = useState(mockFeatureRequests);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("votes");
  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
    category: ""
  });

  // Filter and sort features
  const filteredFeatures = features
    .filter(feature => 
      (activeTab === "all" || 
       (activeTab === "my-votes" && feature.userVoted) ||
       (activeTab === "under-review" && feature.status === "under-review") ||
       (activeTab === "planned" && feature.status === "planned") ||
       (activeTab === "in-progress" && feature.status === "in-progress") ||
       (activeTab === "completed" && feature.status === "completed"))
    )
    .filter(feature => 
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      feature.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(feature => 
      selectedCategory === "all" || feature.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      return 0;
    });

  const handleVote = (id) => {
    setFeatures(features.map(feature => {
      if (feature.id === id) {
        return {
          ...feature,
          votes: feature.userVoted ? feature.votes - 1 : feature.votes + 1,
          userVoted: !feature.userVoted
        };
      }
      return feature;
    }));
  };

  const handleCreateFeature = () => {
    if (!newFeature.title || !newFeature.description || !newFeature.category) {
      return; // Don't submit if required fields are missing
    }
    
    const newId = Math.max(...features.map(f => f.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    
    const createdFeature = {
      id: newId,
      title: newFeature.title,
      description: newFeature.description,
      category: newFeature.category,
      votes: 1,
      status: "new",
      comments: 0,
      date: today,
      userVoted: true
    };
    
    setFeatures([createdFeature, ...features]);
    setNewFeature({ title: "", description: "", category: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Solicitações de Funcionalidades | Educare+</title>
        <meta 
          name="description" 
          content="Solicite e vote em novas funcionalidades para a plataforma Educare+. Ajude-nos a construir um produto melhor."
        />
      </Helmet>
      
      {/* Header */}
      <section className="bg-gradient-to-r from-educare-600 to-educare-500 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Solicitações de Funcionalidades</h1>
              <p className="text-white/80 max-w-2xl">
                Compartilhe suas ideias para a plataforma Educare+ e vote nas sugestões que você gostaria de ver implementadas.
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-educare-700 hover:bg-white/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Sugerir Funcionalidade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Sugerir Nova Funcionalidade</DialogTitle>
                  <DialogDescription>
                    Compartilhe sua ideia para melhorar a plataforma Educare+. Seja o mais detalhado possível.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title" 
                      placeholder="Ex: Integração com Google Calendar" 
                      value={newFeature.title}
                      onChange={(e) => setNewFeature({...newFeature, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <select 
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newFeature.category}
                      onChange={(e) => setNewFeature({...newFeature, category: e.target.value})}
                    >
                      <option value="" disabled>Selecione uma categoria</option>
                      {categories.filter(c => c.value !== "all").map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descreva a funcionalidade em detalhes e como ela beneficiaria os usuários..."
                      rows={5}
                      value={newFeature.description}
                      onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button 
                      onClick={handleCreateFeature}
                      disabled={!newFeature.title || !newFeature.description || !newFeature.category}
                    >
                      Enviar Sugestão
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
              <div className="relative w-full sm:w-auto flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Buscar funcionalidades..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Categoria
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filtrar por categoria</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {categories.map((category) => (
                      <DropdownMenuItem 
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className="flex items-center"
                      >
                        {selectedCategory === category.value && (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        <span className={selectedCategory === category.value ? "font-medium" : ""}>
                          {category.label}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ChevronUp className="mr-2 h-4 w-4" />
                      {sortBy === "votes" ? "Mais Votados" : 
                       sortBy === "newest" ? "Mais Recentes" : "Mais Antigos"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("votes")}>
                      {sortBy === "votes" && <Check className="mr-2 h-4 w-4" />}
                      Mais Votados
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      {sortBy === "newest" && <Check className="mr-2 h-4 w-4" />}
                      Mais Recentes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      {sortBy === "oldest" && <Check className="mr-2 h-4 w-4" />}
                      Mais Antigos
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="w-full sm:w-auto bg-slate-100">
                <TabsTrigger value="all" className="flex-1">Todas</TabsTrigger>
                <TabsTrigger value="my-votes" className="flex-1">Meus Votos</TabsTrigger>
                <TabsTrigger value="planned" className="flex-1">Planejadas</TabsTrigger>
                <TabsTrigger value="in-progress" className="flex-1">Em Progresso</TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">Implementadas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Feature List */}
          <div className="space-y-4">
            {filteredFeatures.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <div className="mx-auto w-16 h-16 mb-4 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhuma funcionalidade encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tente ajustar seus filtros ou busque por um termo diferente.
                </p>
                <div className="mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Sugerir uma nova
                      </Button>
                    </DialogTrigger>
                    {/* Reuse dialog content here */}
                  </Dialog>
                </div>
              </div>
            ) : (
              filteredFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="flex flex-col sm:flex-row overflow-hidden border-none shadow-sm hover:shadow transition-shadow duration-200">
                    {/* Vote section */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2 p-4 bg-slate-50 w-full sm:w-20">
                      <button 
                        className={`flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full transition-colors ${
                          feature.userVoted 
                            ? "bg-educare-100 text-educare-700" 
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                        onClick={() => handleVote(feature.id)}
                        aria-label={feature.userVoted ? "Remove vote" : "Add vote"}
                      >
                        <ThumbsUp className={`h-5 w-5 ${feature.userVoted ? "fill-educare-700" : ""}`} />
                        <span className="font-semibold text-sm mt-1">{feature.votes}</span>
                      </button>
                      
                      <div className="sm:mt-4 inline-flex sm:hidden items-center text-muted-foreground">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span className="text-xs">{feature.comments}</span>
                      </div>
                    </div>
                    
                    {/* Content section */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{feature.description}</p>
                        </div>
                        
                        <Badge className={`${statusConfig[feature.status].color} ml-2`}>
                          {statusConfig[feature.status].label}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap items-center justify-between">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {categories.find(c => c.value === feature.category)?.label || feature.category}
                          </Badge>
                          
                          <div className="hidden sm:inline-flex items-center text-muted-foreground">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span className="text-xs">{feature.comments}</span>
                          </div>
                        </div>
                        
                        <span className="text-xs text-muted-foreground">
                          Sugerido em {new Date(feature.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureRequestsPage;
