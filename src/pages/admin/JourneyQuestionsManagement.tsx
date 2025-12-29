import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  journeyQuestionsService, 
  JourneyV2Quiz,
  JourneyV2,
  JourneyV2Week,
  JourneyQuizzesFilters,
  CreateJourneyQuizData 
} from '../../services/journeyQuestionsService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  BarChart3,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';

const getCategoryBadgeColor = (domain: string | undefined): string => {
  if (!domain) return 'bg-gray-100 text-gray-800';
  
  const domainColors: Record<string, string> = {
    'communication': 'bg-blue-100 text-blue-800',
    'motor': 'bg-green-100 text-green-800',
    'maternal_health': 'bg-pink-100 text-pink-800',
    'maternal_self_care': 'bg-purple-100 text-purple-800',
    'cognitive': 'bg-yellow-100 text-yellow-800',
    'nutrition': 'bg-orange-100 text-orange-800',
    'sensory': 'bg-indigo-100 text-indigo-800',
    'social_emotional': 'bg-red-100 text-red-800',
    'baby_health': 'bg-teal-100 text-teal-800',
    'saude_bebe': 'bg-teal-100 text-teal-800',
    'saude_materna': 'bg-pink-100 text-pink-800',
    'saude_mental': 'bg-purple-100 text-purple-800',
    'autocuidado_materno': 'bg-rose-100 text-rose-800',
    'comunicacao': 'bg-blue-100 text-blue-800',
    'intimidade_conexa': 'bg-amber-100 text-amber-800',
    'saude_mamas': 'bg-fuchsia-100 text-fuchsia-800'
  };
  
  return domainColors[domain] || 'bg-gray-100 text-gray-800';
};

const emptyQuizForm: CreateJourneyQuizData = {
  week_id: '',
  domain: '',
  domain_id: '',
  title: '',
  question: '',
  options: {},
  feedback: {},
  knowledge: {}
};

const JourneyQuestionsManagement: React.FC = () => {
  const [filters, setFilters] = useState<JourneyQuizzesFilters>({
    page: 1,
    limit: 20
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<JourneyV2Quiz | null>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingQuiz, setViewingQuiz] = useState<JourneyV2Quiz | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>('');
  const [formData, setFormData] = useState<CreateJourneyQuizData>(emptyQuizForm);
  const [optionsJson, setOptionsJson] = useState('{}');
  const [feedbackJson, setFeedbackJson] = useState('{}');
  const [knowledgeJson, setKnowledgeJson] = useState('{}');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quizzesData, isLoading } = useQuery({
    queryKey: ['journey-v2-quizzes', filters],
    queryFn: () => journeyQuestionsService.listQuizzes(filters)
  });

  const { data: statsData } = useQuery({
    queryKey: ['journey-v2-quizzes-stats'],
    queryFn: () => journeyQuestionsService.getStatistics()
  });

  const { data: journeysData } = useQuery({
    queryKey: ['journey-v2-journeys'],
    queryFn: () => journeyQuestionsService.listJourneys()
  });

  const { data: weeksData } = useQuery({
    queryKey: ['journey-v2-weeks', selectedJourneyId],
    queryFn: () => journeyQuestionsService.listWeeks(selectedJourneyId || undefined),
    enabled: true
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateJourneyQuizData) => 
      journeyQuestionsService.createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-quizzes-stats'] });
      setShowCreateDialog(false);
      resetForm();
      toast({
        title: "Sucesso",
        description: "Quiz criado com sucesso!",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || "Erro ao criar quiz"
        : "Erro ao criar quiz";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJourneyQuizData> }) => 
      journeyQuestionsService.updateQuiz(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-quizzes-stats'] });
      setShowEditDialog(false);
      setEditingQuiz(null);
      resetForm();
      toast({
        title: "Sucesso",
        description: "Quiz atualizado com sucesso!",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || "Erro ao atualizar quiz"
        : "Erro ao atualizar quiz";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => journeyQuestionsService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-quizzes-stats'] });
      toast({
        title: "Sucesso",
        description: "Quiz excluído com sucesso!",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || "Erro ao excluir quiz"
        : "Erro ao excluir quiz";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => journeyQuestionsService.importFromCSV(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-quizzes-stats'] });
      setShowImportDialog(false);
      setImportFile(null);
      toast({
        title: "Importação concluída",
        description: `${result.imported} quizzes importados. ${result.errors} erros.`,
        variant: result.errors > 0 ? "destructive" : "default"
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Erro na importação",
        description: "Falha ao processar o arquivo CSV",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData(emptyQuizForm);
    setSelectedJourneyId('');
    setOptionsJson('{}');
    setFeedbackJson('{}');
    setKnowledgeJson('{}');
  };

  const openEditDialog = (quiz: JourneyV2Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      week_id: quiz.week_id,
      domain: quiz.domain,
      domain_id: quiz.domain_id,
      title: quiz.title,
      question: quiz.question,
      options: quiz.options,
      feedback: quiz.feedback,
      knowledge: quiz.knowledge
    });
    setSelectedJourneyId(quiz.week?.journey_id || '');
    setOptionsJson(JSON.stringify(quiz.options || {}, null, 2));
    setFeedbackJson(JSON.stringify(quiz.feedback || {}, null, 2));
    setKnowledgeJson(JSON.stringify(quiz.knowledge || {}, null, 2));
    setShowEditDialog(true);
  };

  const handleSubmit = (isEdit: boolean) => {
    try {
      const options = JSON.parse(optionsJson);
      const feedback = JSON.parse(feedbackJson);
      const knowledge = JSON.parse(knowledgeJson);

      const submitData: CreateJourneyQuizData = {
        ...formData,
        options,
        feedback,
        knowledge
      };

      if (isEdit && editingQuiz) {
        updateMutation.mutate({ id: editingQuiz.id, data: submitData });
      } else {
        createMutation.mutate(submitData);
      }
    } catch (e) {
      toast({
        title: "Erro de validação",
        description: "JSON inválido nos campos options, feedback ou knowledge",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const blob = await journeyQuestionsService.exportToCSV();
      journeyQuestionsService.downloadCSV(blob);
      toast({
        title: "Exportação concluída",
        description: "Arquivo CSV baixado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao exportar CSV",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (importFile) {
      importMutation.mutate(importFile);
    }
  };

  const domainLabels = journeyQuestionsService.getDomainLabels();
  const availableDomains = journeyQuestionsService.getAvailableDomains();

  const quizzes = quizzesData?.data || [];
  const meta = quizzesData?.meta;
  const journeys = journeysData?.data || [];
  const weeks = weeksData?.data || [];
  const stats = statsData?.data;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Quizzes da Jornada</h1>
          <p className="text-muted-foreground">
            Gerencie as perguntas e quizzes das jornadas de desenvolvimento (tabela journey_v2_quizzes)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowStatsDialog(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Estatísticas
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
          <Button onClick={() => { resetForm(); setShowCreateDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Quiz
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou pergunta..."
                className="pl-9"
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </div>
            <Select
              value={filters.domain || ''}
              onValueChange={(value) => setFilters({ ...filters, domain: value || undefined, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por domínio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os domínios</SelectItem>
                {availableDomains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domainLabels[domain] || domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.week_id || ''}
              onValueChange={(value) => setFilters({ ...filters, week_id: value || undefined, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por semana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as semanas</SelectItem>
                {weeks.map((week) => (
                  <SelectItem key={week.id} value={week.id}>
                    Semana {week.week} - {week.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ page: 1, limit: 20 })}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Título</TableHead>
                <TableHead className="w-[120px]">Domínio</TableHead>
                <TableHead className="w-[150px]">Semana</TableHead>
                <TableHead>Pergunta</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">Carregando...</p>
                  </TableCell>
                </TableRow>
              ) : quizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Nenhum quiz encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryBadgeColor(quiz.domain)}>
                        {domainLabels[quiz.domain] || quiz.domain}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {quiz.week ? (
                        <span className="text-sm">
                          Semana {quiz.week.week}
                          <br />
                          <span className="text-muted-foreground text-xs">
                            {quiz.week.journey?.title}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {quiz.question}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setViewingQuiz(quiz); setShowViewDialog(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(quiz)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este quiz?')) {
                              deleteMutation.mutate(quiz.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {meta && meta.totalPages && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {quizzes.length} de {meta.total} quizzes
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.page || meta.page <= 1}
              onClick={() => setFilters({ ...filters, page: (meta.page || 1) - 1 })}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="flex items-center px-3 text-sm">
              Página {meta.page} de {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.page || !meta.totalPages || meta.page >= meta.totalPages}
              onClick={() => setFilters({ ...filters, page: (meta.page || 1) + 1 })}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Criar Novo Quiz</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <QuizForm
              formData={formData}
              setFormData={setFormData}
              selectedJourneyId={selectedJourneyId}
              setSelectedJourneyId={setSelectedJourneyId}
              journeys={journeys}
              weeks={weeks}
              domainLabels={domainLabels}
              availableDomains={availableDomains}
              optionsJson={optionsJson}
              setOptionsJson={setOptionsJson}
              feedbackJson={feedbackJson}
              setFeedbackJson={setFeedbackJson}
              knowledgeJson={knowledgeJson}
              setKnowledgeJson={setKnowledgeJson}
            />
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSubmit(false)}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Quiz</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <QuizForm
              formData={formData}
              setFormData={setFormData}
              selectedJourneyId={selectedJourneyId}
              setSelectedJourneyId={setSelectedJourneyId}
              journeys={journeys}
              weeks={weeks}
              domainLabels={domainLabels}
              availableDomains={availableDomains}
              optionsJson={optionsJson}
              setOptionsJson={setOptionsJson}
              feedbackJson={feedbackJson}
              setFeedbackJson={setFeedbackJson}
              knowledgeJson={knowledgeJson}
              setKnowledgeJson={setKnowledgeJson}
            />
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSubmit(true)}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Quiz</DialogTitle>
          </DialogHeader>
          {viewingQuiz && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Título</Label>
                  <p className="font-medium">{viewingQuiz.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Domínio</Label>
                  <p>
                    <Badge className={getCategoryBadgeColor(viewingQuiz.domain)}>
                      {domainLabels[viewingQuiz.domain] || viewingQuiz.domain}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Domain ID</Label>
                  <p className="font-mono text-sm">{viewingQuiz.domain_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Semana</Label>
                  <p>
                    {viewingQuiz.week ? `Semana ${viewingQuiz.week.week} - ${viewingQuiz.week.title}` : '-'}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Pergunta</Label>
                <p className="bg-muted p-3 rounded-md mt-1">{viewingQuiz.question}</p>
              </div>
              <Tabs defaultValue="options">
                <TabsList>
                  <TabsTrigger value="options">Options</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                </TabsList>
                <TabsContent value="options">
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-[200px]">
                    {JSON.stringify(viewingQuiz.options, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="feedback">
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-[200px]">
                    {JSON.stringify(viewingQuiz.feedback, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="knowledge">
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-[200px]">
                    {JSON.stringify(viewingQuiz.knowledge, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Estatísticas dos Quizzes</DialogTitle>
          </DialogHeader>
          {stats ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{stats.total}</p>
                    <p className="text-muted-foreground">Total de Quizzes</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Por Domínio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.byDomain.map((item) => (
                      <div key={item.domain} className="flex justify-between items-center">
                        <Badge className={getCategoryBadgeColor(item.domain)}>
                          {domainLabels[item.domain] || item.domain}
                        </Badge>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.byWeek}</p>
                    <p className="text-muted-foreground">Semanas com Quizzes</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Carregando estatísticas...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Quizzes via CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Arquivo CSV</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Formato esperado:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>week_id (obrigatório)</li>
                <li>domain (obrigatório)</li>
                <li>domain_id (obrigatório)</li>
                <li>title (obrigatório)</li>
                <li>question (obrigatório)</li>
                <li>options (JSON)</li>
                <li>feedback (JSON)</li>
                <li>knowledge (JSON)</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!importFile || importMutation.isPending}
            >
              {importMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface QuizFormProps {
  formData: CreateJourneyQuizData;
  setFormData: React.Dispatch<React.SetStateAction<CreateJourneyQuizData>>;
  selectedJourneyId: string;
  setSelectedJourneyId: React.Dispatch<React.SetStateAction<string>>;
  journeys: JourneyV2[];
  weeks: JourneyV2Week[];
  domainLabels: Record<string, string>;
  availableDomains: string[];
  optionsJson: string;
  setOptionsJson: React.Dispatch<React.SetStateAction<string>>;
  feedbackJson: string;
  setFeedbackJson: React.Dispatch<React.SetStateAction<string>>;
  knowledgeJson: string;
  setKnowledgeJson: React.Dispatch<React.SetStateAction<string>>;
}

const QuizForm: React.FC<QuizFormProps> = ({
  formData,
  setFormData,
  selectedJourneyId,
  setSelectedJourneyId,
  journeys,
  weeks,
  domainLabels,
  availableDomains,
  optionsJson,
  setOptionsJson,
  feedbackJson,
  setFeedbackJson,
  knowledgeJson,
  setKnowledgeJson
}) => {
  const filteredWeeks = selectedJourneyId 
    ? weeks.filter(w => w.journey_id === selectedJourneyId)
    : weeks;

  return (
    <div className="space-y-6 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="journey">Jornada</Label>
          <Select
            value={selectedJourneyId}
            onValueChange={(value) => {
              setSelectedJourneyId(value);
              setFormData(prev => ({ ...prev, week_id: '' }));
            }}
          >
            <SelectTrigger id="journey">
              <SelectValue placeholder="Selecione a jornada" />
            </SelectTrigger>
            <SelectContent>
              {journeys.map((journey) => (
                <SelectItem key={journey.id} value={journey.id}>
                  {journey.title} (Mês {journey.month})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="week_id">Semana *</Label>
          <Select
            value={formData.week_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, week_id: value }))}
          >
            <SelectTrigger id="week_id">
              <SelectValue placeholder="Selecione a semana" />
            </SelectTrigger>
            <SelectContent>
              {filteredWeeks.map((week) => (
                <SelectItem key={week.id} value={week.id}>
                  Semana {week.week} - {week.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="domain">Domínio *</Label>
          <Select
            value={formData.domain}
            onValueChange={(value) => setFormData(prev => ({ ...prev, domain: value }))}
          >
            <SelectTrigger id="domain">
              <SelectValue placeholder="Selecione o domínio" />
            </SelectTrigger>
            <SelectContent>
              {availableDomains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domainLabels[domain] || domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="domain_id">Domain ID *</Label>
          <Input
            id="domain_id"
            value={formData.domain_id}
            onChange={(e) => setFormData(prev => ({ ...prev, domain_id: e.target.value }))}
            placeholder="ex: motor_01, cognitive_02"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Título do quiz"
        />
      </div>

      <div>
        <Label htmlFor="question">Pergunta *</Label>
        <Textarea
          id="question"
          value={formData.question}
          onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
          placeholder="Digite a pergunta do quiz"
          rows={3}
        />
      </div>

      <Tabs defaultValue="options" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="options">Options (JSONB)</TabsTrigger>
          <TabsTrigger value="feedback">Feedback (JSONB)</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge (JSONB)</TabsTrigger>
        </TabsList>
        <TabsContent value="options" className="mt-2">
          <div>
            <Label htmlFor="options" className="text-sm text-muted-foreground">
              Opções de resposta (array ou objeto JSON)
            </Label>
            <Textarea
              id="options"
              value={optionsJson}
              onChange={(e) => setOptionsJson(e.target.value)}
              placeholder={'{\n  "option_1": "Sim",\n  "option_2": "Não",\n  "option_3": "Às vezes"\n}'}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </TabsContent>
        <TabsContent value="feedback" className="mt-2">
          <div>
            <Label htmlFor="feedback" className="text-sm text-muted-foreground">
              Feedbacks para cada resposta (objeto JSON)
            </Label>
            <Textarea
              id="feedback"
              value={feedbackJson}
              onChange={(e) => setFeedbackJson(e.target.value)}
              placeholder={'{\n  "feedback_1": "Ótimo! Continue assim.",\n  "feedback_2": "Tente fazer mais vezes.",\n  "feedback_3": "É normal nessa fase."\n}'}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </TabsContent>
        <TabsContent value="knowledge" className="mt-2">
          <div>
            <Label htmlFor="knowledge" className="text-sm text-muted-foreground">
              Conhecimento adicional: atividades, gamificação, alertas (objeto JSON)
            </Label>
            <Textarea
              id="knowledge"
              value={knowledgeJson}
              onChange={(e) => setKnowledgeJson(e.target.value)}
              placeholder={'{\n  "activities": ["Atividade 1", "Atividade 2"],\n  "gamification_points": 10,\n  "alerts": []\n}'}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JourneyQuestionsManagement;
