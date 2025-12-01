import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  journeyQuestionsService, 
  JourneyQuestion, 
  JourneyQuestionsFilters,
  CreateJourneyQuestionData 
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
  DialogTrigger 
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
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
  Eye
} from 'lucide-react';

// Função para definir cores dos badges por domínio
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
    'baby_health': 'bg-teal-100 text-teal-800'
  };
  
  return domainColors[domain] || 'bg-gray-100 text-gray-800';
};

const JourneyQuestionsManagement: React.FC = () => {
  const [filters, setFilters] = useState<JourneyQuestionsFilters>({
    page: 1,
    limit: 20
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<JourneyQuestion | null>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para listar perguntas
  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['journey-questions', filters],
    queryFn: () => journeyQuestionsService.listQuestions(filters)
  });

  // Debug dos dados recebidos
  React.useEffect(() => {
    if (questionsData) {
      console.log('🔍 DEBUG: Dados recebidos na query:', questionsData);
      console.log('🔍 DEBUG: questionsData.data.length:', questionsData?.data?.length);
      console.log('🔍 DEBUG: questionsData.meta:', questionsData?.meta);
    }
  }, [questionsData]);

  // Query para estatísticas
  const { data: statsData } = useQuery({
    queryKey: ['journey-questions-stats'],
    queryFn: () => journeyQuestionsService.getStatistics()
  });

  // Mutation para criar pergunta
  const createMutation = useMutation({
    mutationFn: (data: CreateJourneyQuestionData) => 
      journeyQuestionsService.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-questions'] });
      queryClient.invalidateQueries({ queryKey: ['journey-questions-stats'] });
      setShowCreateDialog(false);
      toast({
        title: "Sucesso",
        description: "Pergunta criada com sucesso!",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || "Erro ao criar pergunta"
        : "Erro ao criar pergunta";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  // Mutation para atualizar pergunta
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJourneyQuestionData> }) => 
      journeyQuestionsService.updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-questions'] });
      queryClient.invalidateQueries({ queryKey: ['journey-questions-stats'] });
      setShowEditDialog(false);
      setEditingQuestion(null);
      toast({
        title: "Sucesso",
        description: "Pergunta atualizada com sucesso!",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || "Erro ao atualizar pergunta"
        : "Erro ao atualizar pergunta";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  // Mutation para excluir pergunta
  const deleteMutation = useMutation({
    mutationFn: (id: string) => journeyQuestionsService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-questions'] });
      queryClient.invalidateQueries({ queryKey: ['journey-questions-stats'] });
      toast({
        title: "Sucesso",
        description: "Pergunta excluída com sucesso!",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || "Erro ao excluir pergunta"
        : "Erro ao excluir pergunta";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  // Mutation para importar CSV
  const importMutation = useMutation({
    mutationFn: (file: File) => journeyQuestionsService.importFromCSV(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['journey-questions'] });
      queryClient.invalidateQueries({ queryKey: ['journey-questions-stats'] });
      setImportFile(null);
      toast({
        title: "Importação Concluída",
        description: `${result.imported} perguntas importadas. ${result.errors} erros encontrados.`,
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || "Erro ao importar CSV"
        : "Erro ao importar CSV";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const handleExport = async () => {
    try {
      const blob = await journeyQuestionsService.exportToCSV();
      journeyQuestionsService.downloadCSV(blob);
      toast({
        title: "Sucesso",
        description: "Arquivo CSV exportado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar arquivo CSV",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (importFile) {
      importMutation.mutate(importFile);
    }
  };

  const handleEdit = (question: JourneyQuestion) => {
    setEditingQuestion(question);
    setShowEditDialog(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      deleteMutation.mutate(id);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      motor: 'bg-blue-100 text-blue-800',
      cognitivo: 'bg-purple-100 text-purple-800',
      linguagem: 'bg-green-100 text-green-800',
      social: 'bg-yellow-100 text-yellow-800',
      emocional: 'bg-pink-100 text-pink-800',
      sensorial: 'bg-orange-100 text-orange-800',
      autonomia: 'bg-indigo-100 text-indigo-800',
      brincadeira: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Perguntas da Jornada</h1>
          <p className="text-muted-foreground">
            Gerencie as perguntas do TitiNauta por faixa etária e categoria
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowStatsDialog(true)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Estatísticas
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Pergunta
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {statsData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{statsData.data.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                  <p className="text-2xl font-bold text-green-600">{statsData.data.active}</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inativas</p>
                  <p className="text-2xl font-bold text-red-600">{statsData.data.inactive}</p>
                </div>
                <Eye className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categorias</p>
                  <p className="text-2xl font-bold">{statsData.data.byCategory.length}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pergunta..."
                  className="pl-10"
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                />
              </div>
            </div>
            <div>
              <Label>Categoria</Label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) => 
                  setFilters({ ...filters, category: value === 'all' ? undefined : value, page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {journeyQuestionsService.getAvailableCategories().map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Idade Mín. (meses)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.min_age_months || ''}
                onChange={(e) => 
                  setFilters({ 
                    ...filters, 
                    min_age_months: e.target.value ? parseInt(e.target.value) : undefined,
                    page: 1 
                  })
                }
              />
            </div>
            <div>
              <Label>Idade Máx. (meses)</Label>
              <Input
                type="number"
                placeholder="60"
                value={filters.max_age_months || ''}
                onChange={(e) => 
                  setFilters({ 
                    ...filters, 
                    max_age_months: e.target.value ? parseInt(e.target.value) : undefined,
                    page: 1 
                  })
                }
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={filters.is_active === undefined ? 'all' : filters.is_active.toString()}
                onValueChange={(value) => 
                  setFilters({ 
                    ...filters, 
                    is_active: value === 'all' ? undefined : value === 'true',
                    page: 1 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ page: 1, limit: 20 })}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Perguntas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
            <Button
              onClick={handleImport}
              disabled={!importFile || importMutation.isPending}
            >
              {importMutation.isPending ? 'Importando...' : 'Importar CSV'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Formato esperado (31 campos):</strong> meta_title, meta_min_months, meta_max_months, week, week_title, domain_name, domain_question, domain_feedback_1, domain_feedback_2, domain_feedback_3, gamification_welcome_title, gamification_badge_name, gamification_tips, domain_activities, domain_alert_missing, etc.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            📋 <strong>Estrutura completa:</strong> Metadados, Semana, Pergunta Principal, Feedbacks, Gamificação, Atividades e Controles
          </p>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Perguntas ({questionsData?.meta?.total || questionsData?.data?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando perguntas...</div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pergunta</TableHead>
                    <TableHead>Domínio</TableHead>
                    <TableHead>Faixa Etária</TableHead>
                    <TableHead>Semana</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionsData?.data?.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={question.domain_question || question.meta_title}>
                          {question.domain_question || question.meta_title || 'Sem pergunta'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadgeColor(question.domain_name)}>
                          {question.domain_name || 'Sem categoria'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {question.meta_min_months || 0}-{question.meta_max_months || 0} meses
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Semana {question.week || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={question.is_active ? "default" : "secondary"}>
                          {question.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {questionsData?.meta && questionsData.meta.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={questionsData.meta.page === 1}
                    onClick={() => setFilters({ ...filters, page: questionsData.meta.page - 1 })}
                  >
                    Anterior
                  </Button>
                  <span className="flex items-center px-4">
                    Página {questionsData.meta.page} de {questionsData.meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={questionsData.meta.page === questionsData.meta.totalPages}
                    onClick={() => setFilters({ ...filters, page: questionsData.meta.page + 1 })}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog - Simplified for space */}
      <QuestionFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
        title="Nova Pergunta"
      />

      <QuestionFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={(data) => editingQuestion && updateMutation.mutate({ id: editingQuestion.id, data })}
        isLoading={updateMutation.isPending}
        title="Editar Pergunta"
        initialData={editingQuestion}
      />

      {/* Stats Dialog */}
      <StatsDialog
        open={showStatsDialog}
        onOpenChange={setShowStatsDialog}
        stats={statsData?.data}
      />
    </div>
  );
};

// Componente auxiliar para o formulário de pergunta
interface QuestionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateJourneyQuestionData) => void;
  isLoading: boolean;
  title: string;
  initialData?: JourneyQuestion | null;
}

const QuestionFormDialog: React.FC<QuestionFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  title,
  initialData
}) => {
  const [formData, setFormData] = useState<CreateJourneyQuestionData>({
    // Metadados obrigatórios
    meta_min_months: 0,
    meta_max_months: 12,
    
    // Dados da pergunta principal (obrigatórios)
    domain_name: '',
    domain_question: '',
    
    // Campos de controle
    order_index: 0,
    is_active: true,
    
    // Campos opcionais
    meta_title: '',
    meta_description: '',
    week: 1,
    week_title: '',
    week_description: '',
    domain_importance: '',
    domain_feedback_1: '',
    domain_feedback_2: '',
    domain_feedback_3: '',
    domain_activities: '',
    domain_alert_missing: '',
    
    // Gamificação (todos opcionais)
    gamification_welcome_title: '',
    gamification_welcome_message: '',
    gamification_badge_name: '',
    gamification_badge_description: '',
    gamification_progress_message: '',
    gamification_weekly_challenge_title: '',
    gamification_weekly_challenge_description: '',
    gamification_tips: '',
    gamification_closing_message_title: '',
    gamification_closing_message_message: '',
    gamification_registro_afetivo_question: '',
    gamification_registro_afetivo_options: '',
    gamification_personalized_message_title: '',
    gamification_personalized_message_message: '',
    
    // Campos legados (compatibilidade)
    question_text: '',
    question_type: 'multiple_choice',
    min_age_months: 0,
    max_age_months: 12,
    category: '',
    feedback_positive: '',
    feedback_negative: '',
    feedback_neutral: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        // Metadados do módulo
        meta_title: initialData.meta_title,
        meta_min_months: initialData.meta_min_months,
        meta_max_months: initialData.meta_max_months,
        meta_description: initialData.meta_description,
        
        // Dados da semana
        week: initialData.week,
        week_title: initialData.week_title,
        week_description: initialData.week_description,
        
        // Dados da pergunta principal (obrigatórios)
        domain_name: initialData.domain_name,
        domain_question: initialData.domain_question,
        domain_importance: initialData.domain_importance,
        
        // Feedbacks
        domain_feedback_1: initialData.domain_feedback_1,
        domain_feedback_2: initialData.domain_feedback_2,
        domain_feedback_3: initialData.domain_feedback_3,
        
        // Atividades e alertas
        domain_activities: initialData.domain_activities,
        domain_alert_missing: initialData.domain_alert_missing,
        
        // Gamificação - Boas-vindas
        gamification_welcome_title: initialData.gamification_welcome_title,
        gamification_welcome_message: initialData.gamification_welcome_message,
        
        // Gamificação - Badge
        gamification_badge_name: initialData.gamification_badge_name,
        gamification_badge_description: initialData.gamification_badge_description,
        
        // Gamificação - Progresso
        gamification_progress_message: initialData.gamification_progress_message,
        
        // Gamificação - Desafio semanal
        gamification_weekly_challenge_title: initialData.gamification_weekly_challenge_title,
        gamification_weekly_challenge_description: initialData.gamification_weekly_challenge_description,
        
        // Gamificação - Dicas
        gamification_tips: initialData.gamification_tips,
        
        // Gamificação - Mensagem de encerramento
        gamification_closing_message_title: initialData.gamification_closing_message_title,
        gamification_closing_message_message: initialData.gamification_closing_message_message,
        
        // Gamificação - Registro afetivo
        gamification_registro_afetivo_question: initialData.gamification_registro_afetivo_question,
        gamification_registro_afetivo_options: initialData.gamification_registro_afetivo_options,
        
        // Gamificação - Mensagem personalizada
        gamification_personalized_message_title: initialData.gamification_personalized_message_title,
        gamification_personalized_message_message: initialData.gamification_personalized_message_message,
        
        // Campos de controle
        order_index: initialData.order_index,
        is_active: initialData.is_active,
        
        // Campos legados (compatibilidade)
        question_text: initialData.question_text,
        question_type: initialData.question_type,
        min_age_months: initialData.min_age_months,
        max_age_months: initialData.max_age_months,
        category: initialData.category,
        feedback_positive: initialData.feedback_positive,
        feedback_negative: initialData.feedback_negative,
        feedback_neutral: initialData.feedback_neutral
      });
    } else {
      setFormData({
        // Metadados do módulo
        meta_title: '',
        meta_min_months: 0,
        meta_max_months: 12,
        meta_description: '',
        
        // Dados da semana
        week: 1,
        week_title: '',
        week_description: '',
        
        // Dados da pergunta principal (obrigatórios)
        domain_name: '',
        domain_question: '',
        domain_importance: '',
        
        // Feedbacks
        domain_feedback_1: '',
        domain_feedback_2: '',
        domain_feedback_3: '',
        
        // Atividades e alertas
        domain_activities: '',
        domain_alert_missing: '',
        
        // Gamificação - Boas-vindas
        gamification_welcome_title: '',
        gamification_welcome_message: '',
        
        // Gamificação - Badge
        gamification_badge_name: '',
        gamification_badge_description: '',
        
        // Gamificação - Progresso
        gamification_progress_message: '',
        
        // Gamificação - Desafio semanal
        gamification_weekly_challenge_title: '',
        gamification_weekly_challenge_description: '',
        
        // Gamificação - Dicas
        gamification_tips: '',
        
        // Gamificação - Mensagem de encerramento
        gamification_closing_message_title: '',
        gamification_closing_message_message: '',
        
        // Gamificação - Registro afetivo
        gamification_registro_afetivo_question: '',
        gamification_registro_afetivo_options: '',
        
        // Gamificação - Mensagem personalizada
        gamification_personalized_message_title: '',
        gamification_personalized_message_message: '',
        
        // Campos de controle
        order_index: 0,
        is_active: true,
        
        // Campos legados (compatibilidade)
        question_text: '',
        question_type: 'multiple_choice' as const,
        min_age_months: 0,
        max_age_months: 12,
        category: 'motor'
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção: Metadados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Metadados do Módulo</h3>
            <div>
              <Label>Título do Módulo</Label>
              <Input
                value={formData.meta_title || ''}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Título do módulo..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Idade Mín. (meses) *</Label>
                <Input
                  type="number"
                  value={formData.meta_min_months}
                  onChange={(e) => setFormData({ ...formData, meta_min_months: parseInt(e.target.value) || 0 })}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label>Idade Máx. (meses) *</Label>
                <Input
                  type="number"
                  value={formData.meta_max_months}
                  onChange={(e) => setFormData({ ...formData, meta_max_months: parseInt(e.target.value) || 12 })}
                  min="0"
                  required
                />
              </div>
            </div>
            <div>
              <Label>Descrição do Módulo</Label>
              <Textarea
                value={formData.meta_description || ''}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Descrição do módulo..."
              />
            </div>
          </div>

          {/* Seção: Semana */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados da Semana</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Semana</Label>
                <Input
                  type="number"
                  value={formData.week || 1}
                  onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) || 1 })}
                  min="1"
                />
              </div>
              <div className="col-span-2">
                <Label>Título da Semana</Label>
                <Input
                  value={formData.week_title || ''}
                  onChange={(e) => setFormData({ ...formData, week_title: e.target.value })}
                  placeholder="Título da semana..."
                />
              </div>
            </div>
            <div>
              <Label>Descrição da Semana</Label>
              <Textarea
                value={formData.week_description || ''}
                onChange={(e) => setFormData({ ...formData, week_description: e.target.value })}
                placeholder="Descrição da semana..."
              />
            </div>
          </div>

          {/* Seção: Pergunta Principal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pergunta Principal</h3>
            <div>
              <Label>Domínio *</Label>
              <Select
                value={formData.domain_name}
                onValueChange={(value) => setFormData({ ...formData, domain_name: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o domínio" />
                </SelectTrigger>
                <SelectContent>
                  {journeyQuestionsService.getAvailableCategories().map((cat) => {
                    const labels = journeyQuestionsService.getCategoryLabels();
                    return (
                      <SelectItem key={cat} value={cat}>
                        {labels[cat] || cat}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Texto da Pergunta *</Label>
              <Textarea
                value={formData.domain_question}
                onChange={(e) => setFormData({ ...formData, domain_question: e.target.value })}
                placeholder="Digite a pergunta principal..."
                required
              />
            </div>
            <div>
              <Label>Importância/Relevância</Label>
              <Textarea
                value={formData.domain_importance || ''}
                onChange={(e) => setFormData({ ...formData, domain_importance: e.target.value })}
                placeholder="Descreva a importância desta pergunta..."
              />
            </div>
          </div>

          {/* Seção: Feedbacks */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Feedbacks por Resposta</h3>
            <div>
              <Label>Feedback 1 (Positivo)</Label>
              <Textarea
                value={formData.domain_feedback_1 || ''}
                onChange={(e) => setFormData({ ...formData, domain_feedback_1: e.target.value })}
                placeholder="Feedback para resposta positiva..."
              />
            </div>
            <div>
              <Label>Feedback 2 (Neutro)</Label>
              <Textarea
                value={formData.domain_feedback_2 || ''}
                onChange={(e) => setFormData({ ...formData, domain_feedback_2: e.target.value })}
                placeholder="Feedback para resposta neutra..."
              />
            </div>
            <div>
              <Label>Feedback 3 (Negativo)</Label>
              <Textarea
                value={formData.domain_feedback_3 || ''}
                onChange={(e) => setFormData({ ...formData, domain_feedback_3: e.target.value })}
                placeholder="Feedback para resposta negativa..."
              />
            </div>
          </div>

          {/* Seção: Gamificação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gamificação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Badge</Label>
                <Input
                  value={formData.gamification_badge_name || ''}
                  onChange={(e) => setFormData({ ...formData, gamification_badge_name: e.target.value })}
                  placeholder="Nome do badge/conquista..."
                />
              </div>
              <div>
                <Label>Título de Boas-vindas</Label>
                <Input
                  value={formData.gamification_welcome_title || ''}
                  onChange={(e) => setFormData({ ...formData, gamification_welcome_title: e.target.value })}
                  placeholder="Título da mensagem de boas-vindas..."
                />
              </div>
            </div>
            <div>
              <Label>Mensagem de Boas-vindas</Label>
              <Textarea
                value={formData.gamification_welcome_message || ''}
                onChange={(e) => setFormData({ ...formData, gamification_welcome_message: e.target.value })}
                placeholder="Mensagem de boas-vindas..."
              />
            </div>
            <div>
              <Label>Dicas de Gamificação</Label>
              <Textarea
                value={formData.gamification_tips || ''}
                onChange={(e) => setFormData({ ...formData, gamification_tips: e.target.value })}
                placeholder="Dicas e sugestões..."
              />
            </div>
          </div>

          {/* Seção: Controles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Controles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={formData.order_index || 0}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  checked={formData.is_active ?? true}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Pergunta ativa</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Componente auxiliar para estatísticas
interface CategoryStats {
  category: string;
  count: number;
}

interface AgeRangeStats {
  min_age_months: number;
  max_age_months: number;
  count: number;
}

interface QuestionStats {
  total: number;
  active: number;
  inactive: number;
  byCategory: CategoryStats[];
  byAgeRange: AgeRangeStats[];
}

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats?: QuestionStats;
}

const StatsDialog: React.FC<StatsDialogProps> = ({ open, onOpenChange, stats }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Estatísticas das Perguntas</DialogTitle>
        </DialogHeader>
        {stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                  <p className="text-sm text-muted-foreground">Inativas</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Por Categoria</h3>
              <div className="space-y-2">
                {stats.byCategory.map((item: CategoryStats) => (
                  <div key={item.category} className="flex justify-between items-center">
                    <Badge className="capitalize">
                      {item.category}
                    </Badge>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Por Faixa Etária</h3>
              <div className="space-y-2">
                {stats.byAgeRange.map((item: AgeRangeStats, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.min_age_months}-{item.max_age_months} meses</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JourneyQuestionsManagement;
