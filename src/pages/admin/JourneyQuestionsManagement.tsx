import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  journeyV2AdminService,
  JourneyV2Topic,
  JourneyV2Quiz,
  ContentFilters,
} from '../../services/journeyV2AdminService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { useToast } from '../../hooks/use-toast';
import {
  Search,
  Filter,
  Upload,
  Edit,
  Trash2,
  BarChart3,
  FileText,
  Eye,
  BookOpen,
  HelpCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Award,
  Calendar,
  Layers,
} from 'lucide-react';

const getTrailBadgeColor = (trail: string | undefined): string => {
  if (!trail) return 'bg-gray-100 text-gray-800';
  const colors: Record<string, string> = {
    baby: 'bg-blue-100 text-blue-800',
    mother: 'bg-pink-100 text-pink-800',
  };
  return colors[trail] || 'bg-gray-100 text-gray-800';
};

const JourneyQuestionsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topic' | 'quiz'>('topic');
  const [filters, setFilters] = useState<ContentFilters>({
    type: 'topic',
    page: 1,
    limit: 20,
  });
  const [searchText, setSearchText] = useState('');
  const [viewTopicDialog, setViewTopicDialog] = useState(false);
  const [viewQuizDialog, setViewQuizDialog] = useState(false);
  const [editTopicDialog, setEditTopicDialog] = useState(false);
  const [editQuizDialog, setEditQuizDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<JourneyV2Topic | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<JourneyV2Quiz | null>(null);
  const [editTopicData, setEditTopicData] = useState<{ title: string; content: string; order_index: number }>({ title: '', content: '{}', order_index: 0 });
  const [editQuizData, setEditQuizData] = useState<{ title: string; question: string; domain: string; options: string; feedback: string; knowledge: string }>({ title: '', question: '', domain: '', options: '[]', feedback: '{}', knowledge: '{}' });
  const [createTopicDialog, setCreateTopicDialog] = useState(false);
  const [createQuizDialog, setCreateQuizDialog] = useState(false);
  const [createTopicData, setCreateTopicData] = useState<{ week_id: string; title: string; content: string; order_index: number }>({ week_id: '', title: '', content: '{}', order_index: 0 });
  const [createQuizData, setCreateQuizData] = useState<{ week_id: string; domain: string; title: string; question: string; options: string; feedback: string; knowledge: string }>({ week_id: '', domain: 'baby', title: '', question: '', options: '[]', feedback: '{}', knowledge: '{}' });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setFilters((prev) => ({ ...prev, type: activeTab, page: 1 }));
  }, [activeTab]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchText || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const { data: statsResponse } = useQuery({
    queryKey: ['journey-v2-stats'],
    queryFn: () => journeyV2AdminService.getStatistics(),
  });

  const stats = statsResponse?.data;

  const { data: contentResponse, isLoading } = useQuery({
    queryKey: ['journey-v2-content', filters],
    queryFn: () => journeyV2AdminService.listContent(filters),
  });

  const contentData = contentResponse?.data || [];
  const meta = contentResponse?.meta || { total: 0, page: 1, limit: 20, totalPages: 1 };

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      activeTab === 'topic'
        ? journeyV2AdminService.deleteTopic(id)
        : journeyV2AdminService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      toast({ title: 'Sucesso', description: `${activeTab === 'topic' ? 'Tópico' : 'Quiz'} excluído com sucesso!` });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao excluir item.', variant: 'destructive' });
    },
  });

  const updateTopicMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JourneyV2Topic> }) =>
      journeyV2AdminService.updateTopic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      setEditTopicDialog(false);
      setSelectedTopic(null);
      toast({ title: 'Sucesso', description: 'Tópico atualizado com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao atualizar tópico.', variant: 'destructive' });
    },
  });

  const updateQuizMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JourneyV2Quiz> }) =>
      journeyV2AdminService.updateQuiz(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      setEditQuizDialog(false);
      setSelectedQuiz(null);
      toast({ title: 'Sucesso', description: 'Quiz atualizado com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao atualizar quiz.', variant: 'destructive' });
    },
  });

  const reimportMutation = useMutation({
    mutationFn: () => journeyV2AdminService.reimport(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      toast({ title: 'Sucesso', description: 'Reimportação realizada com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao reimportar dados.', variant: 'destructive' });
    },
  });

  const { data: weeksResponse } = useQuery({
    queryKey: ['journey-v2-weeks'],
    queryFn: () => journeyV2AdminService.listWeeks(),
  });

  const allWeeks = weeksResponse?.data || [];

  const createTopicMutation = useMutation({
    mutationFn: (data: { week_id: string; title: string; content: Record<string, unknown>; order_index: number }) =>
      journeyV2AdminService.createTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      setCreateTopicDialog(false);
      setCreateTopicData({ week_id: '', title: '', content: '{}', order_index: 0 });
      toast({ title: 'Sucesso', description: 'Tópico criado com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao criar tópico.', variant: 'destructive' });
    },
  });

  const createQuizMutation = useMutation({
    mutationFn: (data: { week_id: string; domain: string; title: string; question: string; options: unknown[]; feedback: Record<string, unknown>; knowledge: Record<string, unknown> }) =>
      journeyV2AdminService.createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      setCreateQuizDialog(false);
      setCreateQuizData({ week_id: '', domain: 'baby', title: '', question: '', options: '[]', feedback: '{}', knowledge: '{}' });
      toast({ title: 'Sucesso', description: 'Quiz criado com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao criar quiz.', variant: 'destructive' });
    },
  });

  const handleCreateTopic = () => {
    if (!createTopicData.week_id || !createTopicData.title) {
      toast({ title: 'Erro', description: 'Semana e título são obrigatórios.', variant: 'destructive' });
      return;
    }
    let parsedContent: Record<string, unknown>;
    try {
      parsedContent = JSON.parse(createTopicData.content);
    } catch {
      toast({ title: 'Erro', description: 'JSON do conteúdo inválido.', variant: 'destructive' });
      return;
    }
    createTopicMutation.mutate({ week_id: createTopicData.week_id, title: createTopicData.title, content: parsedContent, order_index: createTopicData.order_index });
  };

  const handleCreateQuiz = () => {
    if (!createQuizData.week_id || !createQuizData.title || !createQuizData.question) {
      toast({ title: 'Erro', description: 'Semana, título e pergunta são obrigatórios.', variant: 'destructive' });
      return;
    }
    let parsedOptions: unknown[];
    let parsedFeedback: Record<string, unknown>;
    let parsedKnowledge: Record<string, unknown>;
    try { parsedOptions = JSON.parse(createQuizData.options); } catch { toast({ title: 'Erro', description: 'JSON das opções inválido.', variant: 'destructive' }); return; }
    try { parsedFeedback = JSON.parse(createQuizData.feedback); } catch { toast({ title: 'Erro', description: 'JSON do feedback inválido.', variant: 'destructive' }); return; }
    try { parsedKnowledge = JSON.parse(createQuizData.knowledge); } catch { toast({ title: 'Erro', description: 'JSON do conhecimento inválido.', variant: 'destructive' }); return; }
    createQuizMutation.mutate({ week_id: createQuizData.week_id, domain: createQuizData.domain, title: createQuizData.title, question: createQuizData.question, options: parsedOptions, feedback: parsedFeedback, knowledge: parsedKnowledge });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Tem certeza que deseja excluir este ${activeTab === 'topic' ? 'tópico' : 'quiz'}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewTopic = (item: JourneyV2Topic) => {
    setSelectedTopic(item);
    setViewTopicDialog(true);
  };

  const handleViewQuiz = (item: JourneyV2Quiz) => {
    setSelectedQuiz(item);
    setViewQuizDialog(true);
  };

  const handleEditTopic = (item: JourneyV2Topic) => {
    setSelectedTopic(item);
    setEditTopicData({
      title: item.title || '',
      content: JSON.stringify(item.content || {}, null, 2),
      order_index: item.order_index || 0,
    });
    setEditTopicDialog(true);
  };

  const handleEditQuiz = (item: JourneyV2Quiz) => {
    setSelectedQuiz(item);
    setEditQuizData({
      title: item.title || '',
      question: item.question || '',
      domain: item.domain || '',
      options: JSON.stringify(item.options || [], null, 2),
      feedback: JSON.stringify(item.feedback || {}, null, 2),
      knowledge: JSON.stringify(item.knowledge || {}, null, 2),
    });
    setEditQuizDialog(true);
  };

  const handleSaveTopic = () => {
    if (!selectedTopic) return;
    let parsedContent: Record<string, unknown>;
    try {
      parsedContent = JSON.parse(editTopicData.content);
    } catch {
      toast({ title: 'Erro', description: 'JSON do conteúdo inválido.', variant: 'destructive' });
      return;
    }
    updateTopicMutation.mutate({
      id: selectedTopic.id,
      data: { title: editTopicData.title, content: parsedContent, order_index: editTopicData.order_index },
    });
  };

  const handleSaveQuiz = () => {
    if (!selectedQuiz) return;
    let parsedOptions: unknown[];
    let parsedFeedback: Record<string, unknown>;
    let parsedKnowledge: Record<string, unknown>;
    try {
      parsedOptions = JSON.parse(editQuizData.options);
    } catch {
      toast({ title: 'Erro', description: 'JSON das opções inválido.', variant: 'destructive' });
      return;
    }
    try {
      parsedFeedback = JSON.parse(editQuizData.feedback);
    } catch {
      toast({ title: 'Erro', description: 'JSON do feedback inválido.', variant: 'destructive' });
      return;
    }
    try {
      parsedKnowledge = JSON.parse(editQuizData.knowledge);
    } catch {
      toast({ title: 'Erro', description: 'JSON do conhecimento inválido.', variant: 'destructive' });
      return;
    }
    updateQuizMutation.mutate({
      id: selectedQuiz.id,
      data: {
        title: editQuizData.title,
        question: editQuizData.question,
        domain: editQuizData.domain,
        options: parsedOptions as JourneyV2Quiz['options'],
        feedback: parsedFeedback,
        knowledge: parsedKnowledge,
      },
    });
  };

  const getWeekNumber = (item: any): number => {
    return item?.week?.week || 0;
  };

  const getTrail = (item: any): string => {
    return item?.week?.journey?.trail || '';
  };

  const getMonth = (item: any): number => {
    return item?.week?.journey?.month || 0;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Conteúdo Jornada V2</h1>
          <p className="text-muted-foreground">
            Gerencie tópicos educativos e quizzes do sistema de jornadas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => reimportMutation.mutate()}
            disabled={reimportMutation.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${reimportMutation.isPending ? 'animate-spin' : ''}`} />
            {reimportMutation.isPending ? 'Reimportando...' : 'Reimportar Dados'}
          </Button>
          <Button
            onClick={() => activeTab === 'topic' ? setCreateTopicDialog(true) : setCreateQuizDialog(true)}
          >
            + Novo {activeTab === 'topic' ? 'Tópico' : 'Quiz'}
          </Button>
        </div>
      </div>

      {stats?.totals && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Jornadas</p>
                  <p className="text-2xl font-bold">{stats.totals.journeys}</p>
                </div>
                <Layers className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Semanas</p>
                  <p className="text-2xl font-bold">{stats.totals.weeks}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tópicos</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totals.topics}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quizzes</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totals.quizzes}</p>
                </div>
                <HelpCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Badges</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.totals.badges}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex gap-0">
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'topic'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          onClick={() => setActiveTab('topic')}
        >
          <BookOpen className="h-4 w-4 inline-block mr-2" />
          Conteúdo Educativo
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'quiz'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          onClick={() => setActiveTab('quiz')}
        >
          <HelpCircle className="h-4 w-4 inline-block mr-2" />
          Quizzes
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  className="pl-10"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Trilha</Label>
              <Select
                value={filters.trail || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, trail: value === 'all' ? undefined : value, page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="baby">Bebê</SelectItem>
                  <SelectItem value="mother">Mãe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mês</Label>
              <Select
                value={filters.month?.toString() || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, month: value === 'all' ? undefined : parseInt(value), page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Mês 1</SelectItem>
                  <SelectItem value="2">Mês 2</SelectItem>
                  <SelectItem value="3">Mês 3</SelectItem>
                  <SelectItem value="4">Mês 4</SelectItem>
                  <SelectItem value="5">Mês 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Semana</Label>
              <Select
                value={filters.week?.toString() || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, week: value === 'all' ? undefined : parseInt(value), page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((w) => (
                    <SelectItem key={w} value={w.toString()}>
                      Semana {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchText('');
                  setFilters({ type: activeTab, page: 1, limit: 20 });
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'topic' ? 'Tópicos Educativos' : 'Quizzes'} ({meta.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando conteúdo...</div>
          ) : contentData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum {activeTab === 'topic' ? 'tópico' : 'quiz'} encontrado.
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trilha</TableHead>
                    <TableHead>Semana</TableHead>
                    <TableHead>Título</TableHead>
                    {activeTab === 'quiz' && <TableHead>Domínio</TableHead>}
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentData.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge className={getTrailBadgeColor(getTrail(item))}>
                          {journeyV2AdminService.getTrailLabel(getTrail(item)) || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Semana {getWeekNumber(item) || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={item.title}>
                          {item.title || 'Sem título'}
                        </div>
                        {activeTab === 'quiz' && item.question && (
                          <div className="text-xs text-muted-foreground truncate mt-1" title={item.question}>
                            {item.question}
                          </div>
                        )}
                      </TableCell>
                      {activeTab === 'quiz' && (
                        <TableCell>
                          <Badge variant="secondary">
                            {journeyV2AdminService.getDomainLabel(item.domain) || item.domain || 'N/A'}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              activeTab === 'topic'
                                ? handleViewTopic(item as JourneyV2Topic)
                                : handleViewQuiz(item as JourneyV2Quiz)
                            }
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              activeTab === 'topic'
                                ? handleEditTopic(item as JourneyV2Topic)
                                : handleEditQuiz(item as JourneyV2Quiz)
                            }
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {meta.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page <= 1}
                    onClick={() => setFilters({ ...filters, page: meta.page - 1 })}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Página {meta.page} de {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => setFilters({ ...filters, page: meta.page + 1 })}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewTopicDialog} onOpenChange={setViewTopicDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Tópico</DialogTitle>
          </DialogHeader>
          {selectedTopic && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Título</Label>
                  <p className="font-medium">{selectedTopic.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ordem</Label>
                  <p className="font-medium">{selectedTopic.order_index}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Trilha</Label>
                  <div className="mt-1">
                    <Badge className={getTrailBadgeColor(selectedTopic.week?.journey?.trail || '')}>
                      {journeyV2AdminService.getTrailLabel(selectedTopic.week?.journey?.trail || '')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Semana</Label>
                  <p className="font-medium">
                    Semana {selectedTopic.week?.week} - {selectedTopic.week?.title}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Conteúdo (JSON)</Label>
                <pre className="mt-1 bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(selectedTopic.content, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={viewQuizDialog} onOpenChange={setViewQuizDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Quiz</DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Título</Label>
                  <p className="font-medium">{selectedQuiz.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Domínio</Label>
                  <div className="mt-1">
                    <Badge variant="secondary">
                      {journeyV2AdminService.getDomainLabel(selectedQuiz.domain)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Trilha</Label>
                  <div className="mt-1">
                    <Badge className={getTrailBadgeColor(selectedQuiz.week?.journey?.trail || '')}>
                      {journeyV2AdminService.getTrailLabel(selectedQuiz.week?.journey?.trail || '')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Semana</Label>
                  <p className="font-medium">
                    Semana {selectedQuiz.week?.week} - {selectedQuiz.week?.title}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Pergunta</Label>
                <p className="mt-1 bg-muted p-3 rounded-md">{selectedQuiz.question}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Opções</Label>
                <div className="mt-1 space-y-2">
                  {selectedQuiz.options?.map((opt, idx) => (
                    <div key={opt.id || idx} className="flex items-center gap-3 bg-muted p-2 rounded-md">
                      <Badge variant="outline" className="min-w-[32px] justify-center">{opt.value}</Badge>
                      <span className="text-sm">{opt.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Feedback</Label>
                <pre className="mt-1 bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-48 overflow-y-auto">
                  {JSON.stringify(selectedQuiz.feedback, null, 2)}
                </pre>
              </div>
              {selectedQuiz.knowledge && Object.keys(selectedQuiz.knowledge).length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Conhecimento</Label>
                  <pre className="mt-1 bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-48 overflow-y-auto">
                    {JSON.stringify(selectedQuiz.knowledge, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editTopicDialog} onOpenChange={setEditTopicDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Tópico</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={editTopicData.title}
                onChange={(e) => setEditTopicData({ ...editTopicData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={editTopicData.order_index}
                onChange={(e) => setEditTopicData({ ...editTopicData, order_index: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Conteúdo (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[300px]"
                value={editTopicData.content}
                onChange={(e) => setEditTopicData({ ...editTopicData, content: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditTopicDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTopic} disabled={updateTopicMutation.isPending}>
                {updateTopicMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editQuizDialog} onOpenChange={setEditQuizDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={editQuizData.title}
                onChange={(e) => setEditQuizData({ ...editQuizData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Domínio</Label>
              <Input
                value={editQuizData.domain}
                onChange={(e) => setEditQuizData({ ...editQuizData, domain: e.target.value })}
              />
            </div>
            <div>
              <Label>Pergunta</Label>
              <Textarea
                value={editQuizData.question}
                onChange={(e) => setEditQuizData({ ...editQuizData, question: e.target.value })}
              />
            </div>
            <div>
              <Label>Opções (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[150px]"
                value={editQuizData.options}
                onChange={(e) => setEditQuizData({ ...editQuizData, options: e.target.value })}
              />
            </div>
            <div>
              <Label>Feedback (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[150px]"
                value={editQuizData.feedback}
                onChange={(e) => setEditQuizData({ ...editQuizData, feedback: e.target.value })}
              />
            </div>
            <div>
              <Label>Conhecimento (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[100px]"
                value={editQuizData.knowledge}
                onChange={(e) => setEditQuizData({ ...editQuizData, knowledge: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditQuizDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveQuiz} disabled={updateQuizMutation.isPending}>
                {updateQuizMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={createTopicDialog} onOpenChange={setCreateTopicDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Tópico Educativo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Semana *</Label>
              <Select
                value={createTopicData.week_id || 'none'}
                onValueChange={(value) => setCreateTopicData({ ...createTopicData, week_id: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma semana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione...</SelectItem>
                  {allWeeks.map((w: any) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.journey?.trail === 'baby' ? 'Bebê' : 'Mãe'} - Mês {w.journey?.month} - Semana {w.week}: {w.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Título *</Label>
              <Input
                value={createTopicData.title}
                onChange={(e) => setCreateTopicData({ ...createTopicData, title: e.target.value })}
                placeholder="Título do tópico"
              />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={createTopicData.order_index}
                onChange={(e) => setCreateTopicData({ ...createTopicData, order_index: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Conteúdo (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[200px]"
                value={createTopicData.content}
                onChange={(e) => setCreateTopicData({ ...createTopicData, content: e.target.value })}
                placeholder='{"microcards": [], "action_text": ""}'
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateTopicDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTopic} disabled={createTopicMutation.isPending}>
                {createTopicMutation.isPending ? 'Criando...' : 'Criar Tópico'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={createQuizDialog} onOpenChange={setCreateQuizDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Semana *</Label>
              <Select
                value={createQuizData.week_id || 'none'}
                onValueChange={(value) => {
                  const selectedWeek = allWeeks.find((w: any) => w.id === value);
                  const trail = selectedWeek?.journey?.trail || createQuizData.domain;
                  setCreateQuizData({ ...createQuizData, week_id: value === 'none' ? '' : value, domain: trail });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma semana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione...</SelectItem>
                  {allWeeks.filter((w: any) => w.journey?.month > 1).map((w: any) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.journey?.trail === 'baby' ? 'Bebê' : 'Mãe'} - Mês {w.journey?.month} - Semana {w.week}: {w.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Quizzes só podem ser criados a partir do Mês 2 (semana 5+)</p>
            </div>
            <div>
              <Label>Domínio</Label>
              <Input
                value={createQuizData.domain === 'baby' ? 'Bebê' : createQuizData.domain === 'mother' ? 'Mãe' : createQuizData.domain}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">Definido automaticamente pela trilha da semana selecionada</p>
            </div>
            <div>
              <Label>Título *</Label>
              <Input
                value={createQuizData.title}
                onChange={(e) => setCreateQuizData({ ...createQuizData, title: e.target.value })}
                placeholder="Título do quiz"
              />
            </div>
            <div>
              <Label>Pergunta *</Label>
              <Textarea
                value={createQuizData.question}
                onChange={(e) => setCreateQuizData({ ...createQuizData, question: e.target.value })}
                placeholder="Texto da pergunta"
              />
            </div>
            <div>
              <Label>Opções (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[150px]"
                value={createQuizData.options}
                onChange={(e) => setCreateQuizData({ ...createQuizData, options: e.target.value })}
                placeholder='[{"id": "opt1", "text": "Opção 1", "value": 1}]'
              />
            </div>
            <div>
              <Label>Feedback (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[100px]"
                value={createQuizData.feedback}
                onChange={(e) => setCreateQuizData({ ...createQuizData, feedback: e.target.value })}
                placeholder='{"positive": "Muito bem!", "negative": "Tente novamente"}'
              />
            </div>
            <div>
              <Label>Conhecimento (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[100px]"
                value={createQuizData.knowledge}
                onChange={(e) => setCreateQuizData({ ...createQuizData, knowledge: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateQuizDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateQuiz} disabled={createQuizMutation.isPending}>
                {createQuizMutation.isPending ? 'Criando...' : 'Criar Quiz'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JourneyQuestionsManagement;
