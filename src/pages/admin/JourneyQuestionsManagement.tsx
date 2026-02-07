import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  curationService,
  CurationAxis,
  CurationStatistics,
  BatchImportResult,
  BatchImportItem,
  BabyMilestoneMapping,
  MaternalCurationMapping,
  JourneyV2MediaLink,
  AIGenerateParams,
} from '../../services/curationService';
import {
  journeyV2AdminService,
  JourneyV2Topic,
  JourneyV2Quiz,
  ContentFilters,
} from '../../services/journeyV2AdminService';
import { mediaResourceService } from '../../services/mediaResourceService';
import { milestonesService, OfficialMilestone } from '../../services/milestonesService';
import { MediaResource } from '../../types/mediaResource';
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
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useToast } from '../../hooks/use-toast';
import {
  Search,
  Filter,
  Upload,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  HelpCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
  Link,
  AlertTriangle,
  FileText,
  Sparkles,
  Image,
  Baby,
  Heart,
} from 'lucide-react';

/* ======================== HELPERS ======================== */

const getTrailBadgeColor = (trail: string | undefined): string => {
  if (!trail) return 'bg-gray-100 text-gray-800';
  const colors: Record<string, string> = {
    baby: 'bg-blue-100 text-blue-800',
    mother: 'bg-pink-100 text-pink-800',
  };
  return colors[trail] || 'bg-gray-100 text-gray-800';
};

const getAxisStatsData = (stats: CurationStatistics | null, axis: CurationAxis) => {
  if (!stats?.axes) return null;
  const map: Record<CurationAxis, keyof CurationStatistics['axes']> = {
    'baby-content': 'baby_content',
    'mother-content': 'mother_content',
    'baby-quiz': 'baby_quiz',
    'mother-quiz': 'mother_quiz',
  };
  return stats.axes[map[axis]];
};

const CONTENT_TEMPLATE = `// month: mês (1-72), week: semana relativa (1-5)
[
  {
    "month": 1,
    "week": 1,
    "title": "Nome do tópico",
    "content": { "microcards": [], "action_text": "" },
    "order_index": 0
  }
]`;

const QUIZ_TEMPLATE = `// month: mês (1-72), week: semana relativa (1-5)
[
  {
    "month": 2,
    "week": 1,
    "title": "Título do quiz",
    "question": "Texto da pergunta?",
    "options": [
      { "id": "opt1", "text": "Opção 1", "value": 1 },
      { "id": "opt2", "text": "Opção 2", "value": 2 },
      { "id": "opt3", "text": "Opção 3", "value": 3 }
    ],
    "feedback": { "positive": "Feedback positivo acolhedor", "negative": "Feedback negativo respeitoso" },
    "knowledge": {}
  }
]`;

/* ======================== COMPONENT ======================== */

const JourneyQuestionsManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /* ======================== STATE ======================== */

  const [activeAxis, setActiveAxis] = useState<CurationAxis>('baby-content');
  const trail = curationService.getAxisTrail(activeAxis);
  const type = curationService.getAxisType(activeAxis);

  const [filters, setFilters] = useState<ContentFilters>({
    type: 'topic',
    trail: 'baby',
    page: 1,
    limit: 20,
  });
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  const [viewTopicDialog, setViewTopicDialog] = useState(false);
  const [viewQuizDialog, setViewQuizDialog] = useState(false);
  const [editTopicDialog, setEditTopicDialog] = useState(false);
  const [editQuizDialog, setEditQuizDialog] = useState(false);
  const [createTopicDialog, setCreateTopicDialog] = useState(false);
  const [createQuizDialog, setCreateQuizDialog] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState<JourneyV2Topic | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<JourneyV2Quiz | null>(null);

  const [editTopicData, setEditTopicData] = useState<{
    title: string;
    content: string;
    order_index: number;
  }>({ title: '', content: '{}', order_index: 0 });

  const [editQuizData, setEditQuizData] = useState<{
    title: string;
    question: string;
    domain: string;
    options: Array<{ id: string; text: string; value: number }>;
    feedbackPositive: string;
    feedbackNegative: string;
    knowledge: string;
  }>({
    title: '',
    question: '',
    domain: '',
    options: [],
    feedbackPositive: '',
    feedbackNegative: '',
    knowledge: '{}',
  });

  const [createTopicData, setCreateTopicData] = useState<{
    week_id: string;
    title: string;
    content: string;
    order_index: number;
  }>({ week_id: '', title: '', content: '{}', order_index: 0 });

  const [createQuizData, setCreateQuizData] = useState<{
    week_id: string;
    domain: string;
    title: string;
    question: string;
    options: Array<{ id: string; text: string; value: number }>;
    feedbackPositive: string;
    feedbackNegative: string;
    knowledge: string;
  }>({
    week_id: '',
    domain: 'baby',
    title: '',
    question: '',
    options: [{ id: 'opt1', text: '', value: 1 }],
    feedbackPositive: '',
    feedbackNegative: '',
    knowledge: '{}',
  });

  const [batchImportDialog, setBatchImportDialog] = useState(false);
  const [batchImportJson, setBatchImportJson] = useState('');
  const [batchImportResult, setBatchImportResult] = useState<BatchImportResult | null>(null);

  const [mediaDialog, setMediaDialog] = useState(false);
  const [mediaSearchText, setMediaSearchText] = useState('');
  const [mediaTargetType, setMediaTargetType] = useState<'topic' | 'quiz'>('topic');
  const [mediaTargetId, setMediaTargetId] = useState<string>('');

  const [milestoneDialog, setMilestoneDialog] = useState(false);
  const [milestoneQuizId, setMilestoneQuizId] = useState<string>('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');

  const [maternalDomainDialog, setMaternalDomainDialog] = useState(false);
  const [maternalQuizId, setMaternalQuizId] = useState<string>('');
  const [selectedMaternalDomain, setSelectedMaternalDomain] = useState<string>('');

  const [aiGeneratorDialog, setAiGeneratorDialog] = useState(false);
  const [aiGenAxis, setAiGenAxis] = useState<CurationAxis>(activeAxis);
  const [aiGenYear, setAiGenYear] = useState(1);
  const [aiGenMonthInYear, setAiGenMonthInYear] = useState(1);
  const [aiGenWeeks, setAiGenWeeks] = useState<number[]>([1]);
  const [aiGenCount, setAiGenCount] = useState(2);
  const [aiGenDomain, setAiGenDomain] = useState('all');
  const [aiGenInstructions, setAiGenInstructions] = useState('');
  const [aiGenResult, setAiGenResult] = useState<any[] | null>(null);
  const [aiGenResultJson, setAiGenResultJson] = useState('');
  const aiGenOverallMonth = (aiGenYear - 1) * 12 + aiGenMonthInYear;

  /* ======================== EFFECTS ======================== */

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      trail: curationService.getAxisTrail(activeAxis),
      type: curationService.getAxisType(activeAxis),
      page: 1,
    }));
    setDomainFilter('all');
  }, [activeAxis]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchText || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const currentDomains = trail === 'baby'
    ? curationService.getBabyDomains()
    : curationService.getMotherDomains();

  /* ======================== QUERIES ======================== */

  const { data: statsResponse } = useQuery({
    queryKey: ['journey-v2-stats'],
    queryFn: () => journeyV2AdminService.getStatistics(),
  });
  const stats = statsResponse?.data;

  const { data: curationStatsData } = useQuery({
    queryKey: ['curation-stats'],
    queryFn: () => curationService.getStatistics(),
  });
  const curationStats: CurationStatistics | null = curationStatsData || null;
  const activeAxisStats = getAxisStatsData(curationStats, activeAxis);

  const queryFilters: Record<string, any> = { ...filters };
  if (domainFilter !== 'all') queryFilters.dev_domain = domainFilter;

  const { data: contentResponse, isLoading } = useQuery({
    queryKey: ['journey-v2-content', queryFilters],
    queryFn: () => journeyV2AdminService.listContent(queryFilters as ContentFilters),
  });
  const contentData = contentResponse?.data || [];
  const meta = contentResponse?.meta || { total: 0, page: 1, limit: 20, totalPages: 1 };

  const { data: weeksResponse } = useQuery({
    queryKey: ['journey-v2-weeks'],
    queryFn: () => journeyV2AdminService.listWeeks(),
  });
  const allWeeks = weeksResponse?.data || [];

  const viewItemId = selectedTopic?.id || selectedQuiz?.id || '';
  const viewItemType: 'topic' | 'quiz' = viewTopicDialog ? 'topic' : 'quiz';

  const { data: linkedMedia, refetch: refetchMedia } = useQuery({
    queryKey: ['linked-media', viewItemType, viewItemId],
    queryFn: () => curationService.getMediaForItem(viewItemType, viewItemId),
    enabled: (viewTopicDialog || viewQuizDialog) && !!viewItemId,
  });

  const { data: milestoneMappingsResponse } = useQuery({
    queryKey: ['baby-milestone-mappings', selectedQuiz?.id],
    queryFn: () => curationService.getBabyMilestoneMappings({ quiz_id: selectedQuiz!.id }),
    enabled: viewQuizDialog && !!selectedQuiz && trail === 'baby',
  });
  const milestoneMappings: BabyMilestoneMapping[] = (milestoneMappingsResponse as any)?.data || [];

  const { data: maternalMappingsResponse } = useQuery({
    queryKey: ['maternal-mappings', selectedQuiz?.id],
    queryFn: () => curationService.getMaternalMappings({ quiz_id: selectedQuiz!.id }),
    enabled: viewQuizDialog && !!selectedQuiz && trail === 'mother',
  });
  const maternalMappings: MaternalCurationMapping[] = (maternalMappingsResponse as any)?.data || [];

  const { data: allMilestones } = useQuery({
    queryKey: ['official-milestones'],
    queryFn: () => milestonesService.listMilestones(),
    enabled: milestoneDialog,
  });

  const { data: mediaSearchResponse } = useQuery({
    queryKey: ['media-search', mediaSearchText],
    queryFn: () => mediaResourceService.list({ search: mediaSearchText, limit: 10 }),
    enabled: mediaDialog && mediaSearchText.length > 1,
  });
  const mediaSearchResults: MediaResource[] = mediaSearchResponse?.data || [];

  /* ======================== MUTATIONS ======================== */

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      type === 'topic'
        ? journeyV2AdminService.deleteTopic(id)
        : journeyV2AdminService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      toast({ title: 'Sucesso', description: `${type === 'topic' ? 'Tópico' : 'Quiz'} excluído com sucesso!` });
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

  const createTopicMutation = useMutation({
    mutationFn: (data: { week_id: string; title: string; content: Record<string, unknown>; order_index: number }) =>
      journeyV2AdminService.createTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
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
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      setCreateQuizDialog(false);
      setCreateQuizData({
        week_id: '', domain: 'baby', title: '', question: '',
        options: [{ id: 'opt1', text: '', value: 1 }],
        feedbackPositive: '', feedbackNegative: '', knowledge: '{}',
      });
      toast({ title: 'Sucesso', description: 'Quiz criado com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao criar quiz.', variant: 'destructive' });
    },
  });

  const reimportMutation = useMutation({
    mutationFn: () => journeyV2AdminService.reimport(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      toast({ title: 'Sucesso', description: 'Reimportação realizada com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao reimportar dados.', variant: 'destructive' });
    },
  });

  const classifyAllMutation = useMutation({
    mutationFn: ({ t, tp }: { t: 'baby' | 'mother'; tp: 'topic' | 'quiz' }) =>
      curationService.classifyAll(t, tp),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      toast({
        title: 'Classificação concluída',
        description: `${data.classified} itens classificados${data.ai_filled ? `, ${data.ai_filled} preenchidos por IA` : ''}${data.duplicates_found ? `, ${data.duplicates_found} duplicatas` : ''}`,
      });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro na classificação.', variant: 'destructive' });
    },
  });

  const batchImportMutation = useMutation({
    mutationFn: ({ axis, items }: { axis: CurationAxis; items: BatchImportItem[] }) =>
      curationService.batchImport(axis, items),
    onSuccess: (data) => {
      setBatchImportResult(data);
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      queryClient.invalidateQueries({ queryKey: ['journey-v2-stats'] });
      toast({
        title: 'Importação concluída',
        description: `${data.summary.created} criados, ${data.summary.duplicates} duplicados, ${data.summary.errors} erros`,
      });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro na importação em lote.', variant: 'destructive' });
    },
  });

  const updateDomainMutation = useMutation({
    mutationFn: ({ id, tp, dev_domain }: { id: string; tp: 'topic' | 'quiz'; dev_domain: string }) =>
      curationService.updateDomain(id, tp, dev_domain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-v2-content'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      toast({ title: 'Sucesso', description: 'Domínio atualizado!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao atualizar domínio.', variant: 'destructive' });
    },
  });

  const linkMediaMutation = useMutation({
    mutationFn: ({ tp, id, mediaResourceId }: { tp: 'topic' | 'quiz'; id: string; mediaResourceId: string }) =>
      curationService.linkMedia(tp, id, { media_resource_id: mediaResourceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linked-media'] });
      setMediaDialog(false);
      setMediaSearchText('');
      toast({ title: 'Sucesso', description: 'Mídia vinculada!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao vincular mídia.', variant: 'destructive' });
    },
  });

  const unlinkMediaMutation = useMutation({
    mutationFn: (mediaLinkId: string) => curationService.unlinkMedia(mediaLinkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linked-media'] });
      toast({ title: 'Sucesso', description: 'Mídia desvinculada!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao desvincular mídia.', variant: 'destructive' });
    },
  });

  const createMilestoneMappingMutation = useMutation({
    mutationFn: (data: { official_milestone_id: string; journey_v2_quiz_id: string }) =>
      curationService.createBabyMilestoneMapping(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baby-milestone-mappings'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      setMilestoneDialog(false);
      setSelectedMilestoneId('');
      toast({ title: 'Sucesso', description: 'Marco vinculado ao quiz!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao vincular marco.', variant: 'destructive' });
    },
  });

  const verifyMilestoneMappingMutation = useMutation({
    mutationFn: (id: string) => curationService.verifyBabyMilestoneMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baby-milestone-mappings'] });
      toast({ title: 'Sucesso', description: 'Mapeamento verificado!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao verificar mapeamento.', variant: 'destructive' });
    },
  });

  const deleteMilestoneMappingMutation = useMutation({
    mutationFn: (id: string) => curationService.deleteBabyMilestoneMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baby-milestone-mappings'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      toast({ title: 'Sucesso', description: 'Mapeamento removido!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao remover mapeamento.', variant: 'destructive' });
    },
  });

  const createMaternalMappingMutation = useMutation({
    mutationFn: (data: { maternal_domain: string; journey_v2_quiz_id: string }) =>
      curationService.createMaternalMapping(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-mappings'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      setMaternalDomainDialog(false);
      setSelectedMaternalDomain('');
      toast({ title: 'Sucesso', description: 'Domínio materno vinculado!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao vincular domínio materno.', variant: 'destructive' });
    },
  });

  const verifyMaternalMappingMutation = useMutation({
    mutationFn: (id: string) => curationService.verifyMaternalMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-mappings'] });
      toast({ title: 'Sucesso', description: 'Mapeamento materno verificado!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao verificar mapeamento materno.', variant: 'destructive' });
    },
  });

  const deleteMaternalMappingMutation = useMutation({
    mutationFn: (id: string) => curationService.deleteMaternalMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-mappings'] });
      queryClient.invalidateQueries({ queryKey: ['curation-stats'] });
      toast({ title: 'Sucesso', description: 'Mapeamento materno removido!' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao remover mapeamento materno.', variant: 'destructive' });
    },
  });

  const aiGenerateMutation = useMutation({
    mutationFn: (params: AIGenerateParams) => curationService.generateWithAI(params),
    onSuccess: (data) => {
      setAiGenResult(data.items);
      setAiGenResultJson(JSON.stringify(data.items, null, 2));
      toast({
        title: 'Conteúdo gerado com sucesso!',
        description: `${data.count} itens gerados para ${curationService.getAxisLabel(data.axis as CurationAxis)}`,
      });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao gerar conteúdo com IA.', variant: 'destructive' });
    },
  });

  /* ======================== HANDLERS ======================== */

  const getWeekNumber = (item: any): number => item?.week?.week || 0;
  const getTrail = (item: any): string => item?.week?.journey?.trail || '';
  const getMonth = (item: any): number => item?.week?.journey?.month || 0;

  const handleDelete = (id: string) => {
    if (window.confirm(`Tem certeza que deseja excluir este ${type === 'topic' ? 'tópico' : 'quiz'}?`)) {
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
    const opts = Array.isArray(item.options) ? item.options : [];
    const fb = (item.feedback || {}) as any;
    setEditQuizData({
      title: item.title || '',
      question: item.question || '',
      domain: item.domain || '',
      options: opts.map((o) => ({ id: o.id || '', text: o.text || '', value: o.value || 0 })),
      feedbackPositive: fb.positive || '',
      feedbackNegative: fb.negative || '',
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
    let parsedKnowledge: Record<string, unknown>;
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
        options: editQuizData.options as JourneyV2Quiz['options'],
        feedback: { positive: editQuizData.feedbackPositive, negative: editQuizData.feedbackNegative },
        knowledge: parsedKnowledge,
      },
    });
  };

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
    createTopicMutation.mutate({
      week_id: createTopicData.week_id,
      title: createTopicData.title,
      content: parsedContent,
      order_index: createTopicData.order_index,
    });
  };

  const handleCreateQuiz = () => {
    if (!createQuizData.week_id || !createQuizData.title || !createQuizData.question) {
      toast({ title: 'Erro', description: 'Semana, título e pergunta são obrigatórios.', variant: 'destructive' });
      return;
    }
    const validOptions = createQuizData.options.filter((o) => o.text.trim());
    if (validOptions.length < 2) {
      toast({ title: 'Erro', description: 'Adicione pelo menos 2 opções com texto.', variant: 'destructive' });
      return;
    }
    let parsedKnowledge: Record<string, unknown>;
    try {
      parsedKnowledge = JSON.parse(createQuizData.knowledge);
    } catch {
      toast({ title: 'Erro', description: 'JSON do conhecimento inválido.', variant: 'destructive' });
      return;
    }
    createQuizMutation.mutate({
      week_id: createQuizData.week_id,
      domain: createQuizData.domain,
      title: createQuizData.title,
      question: createQuizData.question,
      options: validOptions,
      feedback: { positive: createQuizData.feedbackPositive, negative: createQuizData.feedbackNegative },
      knowledge: parsedKnowledge,
    });
  };

  const handleBatchImport = () => {
    let items: BatchImportItem[];
    try {
      items = JSON.parse(batchImportJson);
      if (!Array.isArray(items)) throw new Error('Not array');
    } catch {
      toast({ title: 'Erro', description: 'JSON inválido. Deve ser um array.', variant: 'destructive' });
      return;
    }
    batchImportMutation.mutate({ axis: activeAxis, items });
  };

  const handleAIGenerateImport = () => {
    let items: BatchImportItem[];
    try {
      items = JSON.parse(aiGenResultJson);
      if (!Array.isArray(items)) throw new Error('Not array');
    } catch {
      toast({ title: 'Erro', description: 'JSON inválido.', variant: 'destructive' });
      return;
    }
    batchImportMutation.mutate({ axis: aiGenAxis, items }, {
      onSuccess: (data) => {
        setBatchImportResult(data);
        setAiGenResult(null);
        setAiGenResultJson('');
        setAiGeneratorDialog(false);
        setBatchImportDialog(true);
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBatchImportJson((event.target?.result as string) || '');
      };
      reader.readAsText(file);
    }
  };

  const openMediaDialog = (targetType: 'topic' | 'quiz', targetId: string) => {
    setMediaTargetType(targetType);
    setMediaTargetId(targetId);
    setMediaSearchText('');
    setMediaDialog(true);
  };

  const openMilestoneDialog = (quizId: string) => {
    setMilestoneQuizId(quizId);
    setSelectedMilestoneId('');
    setMilestoneDialog(true);
  };

  const openMaternalDomainDialog = (quizId: string) => {
    setMaternalQuizId(quizId);
    setSelectedMaternalDomain('');
    setMaternalDomainDialog(true);
  };

  /* ======================== OPTIONS BUILDER ======================== */

  const renderOptionsBuilder = (
    options: Array<{ id: string; text: string; value: number }>,
    setOptions: (opts: Array<{ id: string; text: string; value: number }>) => void
  ) => (
    <div className="space-y-2">
      <Label>Opções</Label>
      {options.map((opt, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <Input
            className="w-20"
            value={opt.id}
            onChange={(e) => {
              const n = [...options];
              n[idx] = { ...n[idx], id: e.target.value };
              setOptions(n);
            }}
            placeholder="ID"
          />
          <Input
            className="flex-1"
            value={opt.text}
            onChange={(e) => {
              const n = [...options];
              n[idx] = { ...n[idx], text: e.target.value };
              setOptions(n);
            }}
            placeholder="Texto da opção"
          />
          <Input
            className="w-20"
            type="number"
            value={opt.value}
            onChange={(e) => {
              const n = [...options];
              n[idx] = { ...n[idx], value: parseInt(e.target.value) || 0 };
              setOptions(n);
            }}
            placeholder="Valor"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOptions(options.filter((_, i) => i !== idx))}
            disabled={options.length <= 1}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setOptions([
            ...options,
            { id: `opt${options.length + 1}`, text: '', value: options.length + 1 },
          ])
        }
      >
        <Plus className="h-4 w-4 mr-1" /> Adicionar Opção
      </Button>
    </div>
  );

  /* ======================== MEDIA SECTION RENDERER ======================== */

  const renderMediaSection = (itemType: 'topic' | 'quiz', itemId: string) => {
    const mediaList: JourneyV2MediaLink[] = linkedMedia || [];
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Image className="h-4 w-4" /> Mídia Vinculada
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openMediaDialog(itemType, itemId)}
          >
            <Link className="h-4 w-4 mr-1" /> Vincular Mídia
          </Button>
        </div>
        {mediaList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma mídia vinculada.</p>
        ) : (
          <div className="space-y-2">
            {mediaList.map((ml) => (
              <div key={ml.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{ml.mediaResource?.resource_type || ml.block_type}</Badge>
                  <span className="text-sm">{ml.mediaResource?.title || 'Mídia'}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => unlinkMediaMutation.mutate(ml.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ======================== RENDER ======================== */

  return (
    <div className="container mx-auto p-6 space-y-6">

      {/* ======================== HEADER ======================== */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Conteúdo Jornada V2</h1>
          <p className="text-muted-foreground">
            Curadoria de conteúdo educativo e quizzes por eixo temático
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => reimportMutation.mutate()}
            disabled={reimportMutation.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${reimportMutation.isPending ? 'animate-spin' : ''}`} />
            {reimportMutation.isPending ? 'Reimportando...' : 'Reimportar'}
          </Button>
          <Button
            variant="outline"
            onClick={() => classifyAllMutation.mutate({ t: trail, tp: type })}
            disabled={classifyAllMutation.isPending}
          >
            <Sparkles className={`h-4 w-4 mr-2 ${classifyAllMutation.isPending ? 'animate-spin' : ''}`} />
            {classifyAllMutation.isPending ? 'Classificando...' : 'Classificar Todos'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAiGenAxis(activeAxis);
              setAiGenResult(null);
              setAiGenResultJson('');
              setAiGeneratorDialog(true);
            }}
            className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950"
          >
            <Sparkles className="h-4 w-4 mr-2" /> Gerar com IA
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setBatchImportJson('');
              setBatchImportResult(null);
              setBatchImportDialog(true);
            }}
          >
            <Upload className="h-4 w-4 mr-2" /> Importar JSON
          </Button>
          <Button onClick={() => (type === 'topic' ? setCreateTopicDialog(true) : setCreateQuizDialog(true))}>
            <Plus className="h-4 w-4 mr-2" /> Novo {type === 'topic' ? 'Tópico' : 'Quiz'}
          </Button>
        </div>
      </div>

      {/* ======================== GENERAL STATS ======================== */}

      {stats?.totals && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Jornadas</p>
                  <p className="text-2xl font-bold">{stats.totals.journeys}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
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
                <FileText className="h-8 w-8 text-green-500" />
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
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ======================== CURATION STATS ======================== */}

      {activeAxisStats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Curadoria — {curationService.getAxisLabel(activeAxis)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Domínios:</span>
                {('topics' in activeAxisStats ? activeAxisStats.topics : (activeAxisStats as any).quizzes || []).map(
                  (d: any) => (
                    <Badge key={d.dev_domain || 'null'} className={curationService.getDomainColor(d.dev_domain, trail)}>
                      {curationService.getDomainLabel(d.dev_domain, trail)} ({d.count})
                    </Badge>
                  )
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeAxisStats.unclassified > 0 ? (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {activeAxisStats.unclassified} não classificados
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Todos classificados
                  </Badge>
                )}
              </div>
              {activeAxis === 'baby-quiz' && 'milestone_mappings' in activeAxisStats && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Marcos:</span>
                  <Badge variant="outline">
                    {(activeAxisStats as any).milestone_mappings.verified}/{(activeAxisStats as any).milestone_mappings.total} verificados
                  </Badge>
                </div>
              )}
              {activeAxis === 'mother-quiz' && 'maternal_mappings' in activeAxisStats && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Mapeamentos:</span>
                  <Badge variant="outline">
                    {(activeAxisStats as any).maternal_mappings.verified}/{(activeAxisStats as any).maternal_mappings.total} verificados
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ======================== FOUR-AXIS TABS ======================== */}

      <Tabs value={activeAxis} onValueChange={(v) => setActiveAxis(v as CurationAxis)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="baby-content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span>Conteúdo Bebê</span>
          </TabsTrigger>
          <TabsTrigger value="mother-content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-pink-500" />
            <span>Conteúdo Mãe</span>
          </TabsTrigger>
          <TabsTrigger value="baby-quiz" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            <span>Quiz Bebê</span>
          </TabsTrigger>
          <TabsTrigger value="mother-quiz" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-pink-500" />
            <span>Quiz Mãe</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ======================== FILTERS ======================== */}

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
                  placeholder="Buscar por título..."
                  className="pl-10"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
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
            <div>
              <Label>Domínio</Label>
              <Select
                value={domainFilter}
                onValueChange={(value) => {
                  setDomainFilter(value);
                  setFilters({ ...filters, page: 1 });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="unclassified">Sem classificação</SelectItem>
                  {currentDomains.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
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
                  setDomainFilter('all');
                  setFilters({ type, trail, page: 1, limit: 20 });
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ======================== CONTENT TABLE ======================== */}

      <Card>
        <CardHeader>
          <CardTitle>
            {curationService.getAxisLabel(activeAxis)} ({meta.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando conteúdo...</div>
          ) : contentData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item encontrado para este eixo.
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trilha</TableHead>
                    <TableHead>Semana</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Domínio</TableHead>
                    <TableHead>Confiança</TableHead>
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
                        <Badge variant="outline">S{getWeekNumber(item) || '?'}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={item.title}>
                          {item.title || 'Sem título'}
                        </div>
                        {type === 'quiz' && item.question && (
                          <div className="text-xs text-muted-foreground truncate mt-1" title={item.question}>
                            {item.question}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={curationService.getDomainColor(item.dev_domain, trail)}>
                          {curationService.getDomainLabel(item.dev_domain, trail)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.classification_confidence != null ? (
                          <span className={`text-xs font-medium ${curationService.getConfidenceColor(item.classification_confidence)}`}>
                            {curationService.getConfidenceLabel(item.classification_confidence)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              type === 'topic'
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
                              type === 'topic'
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
                          <Select
                            value={item.dev_domain || 'none'}
                            onValueChange={(val) => {
                              if (val !== (item.dev_domain || 'none')) {
                                updateDomainMutation.mutate({
                                  id: item.id,
                                  tp: type,
                                  dev_domain: val === 'none' ? '' : val,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="w-[110px] h-8 text-xs">
                              <SelectValue placeholder="Domínio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhum</SelectItem>
                              {currentDomains.map((d) => (
                                <SelectItem key={d.value} value={d.value}>
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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

      {/* ======================== VIEW TOPIC DIALOG ======================== */}

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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Domínio</Label>
                  <div className="mt-1">
                    <Badge className={curationService.getDomainColor((selectedTopic as any).dev_domain, trail)}>
                      {curationService.getDomainLabel((selectedTopic as any).dev_domain, trail)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Classificação</Label>
                  <p className="text-sm mt-1">
                    {(selectedTopic as any).classification_source || 'N/A'}
                    {(selectedTopic as any).classification_confidence != null && (
                      <span className={`ml-2 font-medium ${curationService.getConfidenceColor((selectedTopic as any).classification_confidence)}`}>
                        ({curationService.getConfidenceLabel((selectedTopic as any).classification_confidence)})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Hash</Label>
                  <p className="text-xs font-mono mt-1 truncate" title={(selectedTopic as any).content_hash}>
                    {(selectedTopic as any).content_hash
                      ? String((selectedTopic as any).content_hash).substring(0, 16) + '...'
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Conteúdo (JSON)</Label>
                <pre className="mt-1 bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(selectedTopic.content, null, 2)}
                </pre>
              </div>

              {renderMediaSection('topic', selectedTopic.id)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ======================== VIEW QUIZ DIALOG ======================== */}

      <Dialog open={viewQuizDialog} onOpenChange={setViewQuizDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Domínio Dev</Label>
                  <div className="mt-1">
                    <Badge className={curationService.getDomainColor((selectedQuiz as any).dev_domain, trail)}>
                      {curationService.getDomainLabel((selectedQuiz as any).dev_domain, trail)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Classificação</Label>
                  <p className="text-sm mt-1">
                    {(selectedQuiz as any).classification_source || 'N/A'}
                    {(selectedQuiz as any).classification_confidence != null && (
                      <span className={`ml-2 font-medium ${curationService.getConfidenceColor((selectedQuiz as any).classification_confidence)}`}>
                        ({curationService.getConfidenceLabel((selectedQuiz as any).classification_confidence)})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Hash</Label>
                  <p className="text-xs font-mono mt-1 truncate" title={(selectedQuiz as any).content_hash}>
                    {(selectedQuiz as any).content_hash
                      ? String((selectedQuiz as any).content_hash).substring(0, 16) + '...'
                      : 'N/A'}
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

              {renderMediaSection('quiz', selectedQuiz.id)}

              {/* ======================== BABY QUIZ: MILESTONE MAPPINGS ======================== */}

              {trail === 'baby' && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Baby className="h-4 w-4" /> Ranqueamento — Marcos do Desenvolvimento
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openMilestoneDialog(selectedQuiz.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Vincular Marco
                    </Button>
                  </div>
                  {milestoneMappings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum marco vinculado.</p>
                  ) : (
                    <div className="space-y-2">
                      {milestoneMappings.map((mm) => (
                        <div key={mm.id} className="flex items-center justify-between bg-muted p-3 rounded-md">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{mm.milestone?.title || mm.official_milestone_id}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {mm.milestone?.category} — Mês {mm.milestone?.target_month}
                              </Badge>
                              <span className="text-xs text-muted-foreground">Peso: {mm.weight}</span>
                              {mm.verified_by_curator && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  <Check className="h-3 w-3 mr-1" /> Verificado
                                </Badge>
                              )}
                              {mm.is_auto_generated && (
                                <Badge variant="outline" className="text-xs">Auto</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {!mm.verified_by_curator && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => verifyMilestoneMappingMutation.mutate(mm.id)}
                                title="Verificar"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (window.confirm('Remover este mapeamento?')) {
                                  deleteMilestoneMappingMutation.mutate(mm.id);
                                }
                              }}
                              title="Remover"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ======================== MOTHER QUIZ: MATERNAL MAPPINGS ======================== */}

              {trail === 'mother' && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Heart className="h-4 w-4" /> Curadoria Materna — Domínios
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openMaternalDomainDialog(selectedQuiz.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Vincular Domínio
                    </Button>
                  </div>
                  {maternalMappings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum domínio materno vinculado.</p>
                  ) : (
                    <div className="space-y-2">
                      {maternalMappings.map((mm) => (
                        <div key={mm.id} className="flex items-center justify-between bg-muted p-3 rounded-md">
                          <div className="flex-1">
                            <Badge className={curationService.getDomainColor(mm.maternal_domain, 'mother')}>
                              {curationService.getDomainLabel(mm.maternal_domain, 'mother')}
                            </Badge>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">Peso: {mm.weight}</span>
                              {mm.relevance_score != null && (
                                <span className="text-xs text-muted-foreground">Relevância: {mm.relevance_score}</span>
                              )}
                              {mm.verified_by_curator && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  <Check className="h-3 w-3 mr-1" /> Verificado
                                </Badge>
                              )}
                              {mm.is_auto_generated && (
                                <Badge variant="outline" className="text-xs">Auto</Badge>
                              )}
                            </div>
                            {mm.ai_reasoning && (
                              <p className="text-xs text-muted-foreground mt-1 italic">{mm.ai_reasoning}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {!mm.verified_by_curator && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => verifyMaternalMappingMutation.mutate(mm.id)}
                                title="Verificar"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (window.confirm('Remover este mapeamento materno?')) {
                                  deleteMaternalMappingMutation.mutate(mm.id);
                                }
                              }}
                              title="Remover"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ======================== EDIT TOPIC DIALOG ======================== */}

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
                onChange={(e) =>
                  setEditTopicData({ ...editTopicData, order_index: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>Conteúdo (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[300px]"
                value={editTopicData.content}
                onChange={(e) => setEditTopicData({ ...editTopicData, content: e.target.value })}
                placeholder='{"microcards": [...], "action_text": "..."}'
              />
            </div>

            {selectedTopic && renderMediaSection('topic', selectedTopic.id)}

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

      {/* ======================== EDIT QUIZ DIALOG ======================== */}

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

            {renderOptionsBuilder(editQuizData.options, (opts) =>
              setEditQuizData({ ...editQuizData, options: opts })
            )}

            <div>
              <Label>Feedback Positivo</Label>
              <Textarea
                value={editQuizData.feedbackPositive}
                onChange={(e) => setEditQuizData({ ...editQuizData, feedbackPositive: e.target.value })}
                placeholder="Parabéns! Você acertou..."
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label>Feedback Negativo</Label>
              <Textarea
                value={editQuizData.feedbackNegative}
                onChange={(e) => setEditQuizData({ ...editQuizData, feedbackNegative: e.target.value })}
                placeholder="Tente novamente..."
                className="min-h-[80px]"
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

            {selectedQuiz && renderMediaSection('quiz', selectedQuiz.id)}

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

      {/* ======================== CREATE TOPIC DIALOG ======================== */}

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
                onValueChange={(value) =>
                  setCreateTopicData({ ...createTopicData, week_id: value === 'none' ? '' : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma semana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione...</SelectItem>
                  {allWeeks
                    .filter((w: any) => w.journey?.trail === trail)
                    .map((w: any) => (
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
                onChange={(e) =>
                  setCreateTopicData({ ...createTopicData, order_index: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>Conteúdo (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[200px]"
                value={createTopicData.content}
                onChange={(e) => setCreateTopicData({ ...createTopicData, content: e.target.value })}
                placeholder='{"microcards": [{"title": "...", "body": "..."}], "action_text": "Dica prática aqui"}'
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

      {/* ======================== CREATE QUIZ DIALOG ======================== */}

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
                  const weekTrail = selectedWeek?.journey?.trail || createQuizData.domain;
                  setCreateQuizData({
                    ...createQuizData,
                    week_id: value === 'none' ? '' : value,
                    domain: weekTrail,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma semana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione...</SelectItem>
                  {allWeeks
                    .filter((w: any) => w.journey?.trail === trail && w.journey?.month > 1)
                    .map((w: any) => (
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
              <p className="text-xs text-muted-foreground mt-1">Definido automaticamente pela trilha</p>
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

            {renderOptionsBuilder(createQuizData.options, (opts) =>
              setCreateQuizData({ ...createQuizData, options: opts })
            )}

            <div>
              <Label>Feedback Positivo</Label>
              <Textarea
                value={createQuizData.feedbackPositive}
                onChange={(e) => setCreateQuizData({ ...createQuizData, feedbackPositive: e.target.value })}
                placeholder="Parabéns! Resposta correta..."
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label>Feedback Negativo</Label>
              <Textarea
                value={createQuizData.feedbackNegative}
                onChange={(e) => setCreateQuizData({ ...createQuizData, feedbackNegative: e.target.value })}
                placeholder="Ops! Tente novamente..."
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label>Conhecimento (JSON)</Label>
              <Textarea
                className="font-mono text-xs min-h-[100px]"
                value={createQuizData.knowledge}
                onChange={(e) => setCreateQuizData({ ...createQuizData, knowledge: e.target.value })}
                placeholder="{}"
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

      {/* ======================== BATCH IMPORT DIALOG ======================== */}

      <Dialog open={batchImportDialog} onOpenChange={setBatchImportDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar JSON — {curationService.getAxisLabel(activeAxis)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!batchImportResult ? (
              <>
                <div>
                  <Label>Cole o JSON ou faça upload de um arquivo .json</Label>
                  <Textarea
                    className="font-mono text-xs min-h-[250px]"
                    value={batchImportJson}
                    onChange={(e) => setBatchImportJson(e.target.value)}
                    placeholder="Cole aqui o array JSON..."
                  />
                </div>
                <div>
                  <Label>Ou selecione um arquivo</Label>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                </div>
                {batchImportJson.trim() && (() => {
                  try {
                    const parsed = JSON.parse(batchImportJson);
                    if (!Array.isArray(parsed)) return (
                      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-md flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700 dark:text-red-300">JSON deve ser um array [ ]</span>
                      </div>
                    );
                    const validCount = parsed.filter((item: any) => item.title).length;
                    const invalidCount = parsed.length - validCount;
                    return (
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium text-blue-700 dark:text-blue-300">{parsed.length} itens detectados</span>
                          <span className="text-green-600">{validCount} válidos</span>
                          {invalidCount > 0 && <span className="text-red-600">{invalidCount} sem título</span>}
                        </div>
                      </div>
                    );
                  } catch {
                    return (
                      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-md flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700 dark:text-red-300">JSON inválido — verifique a sintaxe</span>
                      </div>
                    );
                  }
                })()}
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-sm font-semibold">Formato esperado:</Label>
                  <pre className="text-xs mt-1 overflow-x-auto">
                    {type === 'topic' ? CONTENT_TEMPLATE : QUIZ_TEMPLATE}
                  </pre>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setBatchImportDialog(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleBatchImport}
                    disabled={batchImportMutation.isPending || !batchImportJson.trim()}
                  >
                    {batchImportMutation.isPending ? 'Importando...' : 'Importar'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{batchImportResult.summary.created}</p>
                      <p className="text-sm text-muted-foreground">Criados</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{batchImportResult.summary.duplicates}</p>
                      <p className="text-sm text-muted-foreground">Duplicados</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">{batchImportResult.summary.errors}</p>
                      <p className="text-sm text-muted-foreground">Erros</p>
                    </CardContent>
                  </Card>
                </div>

                {batchImportResult.details.created.length > 0 && (
                  <div>
                    <Label className="text-green-700 font-semibold">Criados ({batchImportResult.details.created.length})</Label>
                    <div className="mt-1 max-h-40 overflow-y-auto space-y-1">
                      {batchImportResult.details.created.map((c) => (
                        <div key={c.id} className="text-xs bg-green-50 p-2 rounded flex justify-between">
                          <span>{c.title}</span>
                          <span className="text-muted-foreground">#{c.index}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {batchImportResult.details.duplicates.length > 0 && (
                  <div>
                    <Label className="text-yellow-700 font-semibold">Duplicados ({batchImportResult.details.duplicates.length})</Label>
                    <div className="mt-1 max-h-40 overflow-y-auto space-y-1">
                      {batchImportResult.details.duplicates.map((d, i) => (
                        <div key={i} className="text-xs bg-yellow-50 p-2 rounded flex justify-between">
                          <span>{d.title}</span>
                          <span className="text-muted-foreground">duplicata de {d.duplicate_of}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {batchImportResult.details.errors.length > 0 && (
                  <div>
                    <Label className="text-red-700 font-semibold">Erros ({batchImportResult.details.errors.length})</Label>
                    <div className="mt-1 max-h-40 overflow-y-auto space-y-1">
                      {batchImportResult.details.errors.map((er, i) => (
                        <div key={i} className="text-xs bg-red-50 p-2 rounded">
                          <span className="font-medium">#{er.index}</span> {er.title && `(${er.title})`}: {er.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBatchImportResult(null);
                      setBatchImportJson('');
                    }}
                  >
                    Nova Importação
                  </Button>
                  <Button onClick={() => setBatchImportDialog(false)}>
                    Fechar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================== MEDIA SELECTOR DIALOG ======================== */}

      <Dialog open={mediaDialog} onOpenChange={setMediaDialog}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" /> Vincular Mídia
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar recurso de mídia..."
                className="pl-10"
                value={mediaSearchText}
                onChange={(e) => setMediaSearchText(e.target.value)}
              />
            </div>
            {mediaSearchResults.length === 0 && mediaSearchText.length > 1 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum recurso encontrado.</p>
            )}
            {mediaSearchResults.length > 0 && (
              <div className="space-y-2">
                {mediaSearchResults.map((mr) => (
                  <div key={mr.id} className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Badge variant="outline">{mr.resource_type}</Badge>
                      <span className="text-sm truncate">{mr.title}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        linkMediaMutation.mutate({
                          tp: mediaTargetType,
                          id: mediaTargetId,
                          mediaResourceId: mr.id,
                        })
                      }
                      disabled={linkMediaMutation.isPending}
                    >
                      <Link className="h-4 w-4 mr-1" /> Vincular
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================== MILESTONE SELECTOR DIALOG ======================== */}

      <Dialog open={milestoneDialog} onOpenChange={setMilestoneDialog}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" /> Vincular Marco do Desenvolvimento
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecione um marco</Label>
              <Select
                value={selectedMilestoneId || 'none'}
                onValueChange={(v) => setSelectedMilestoneId(v === 'none' ? '' : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um marco..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione...</SelectItem>
                  {(allMilestones || []).map((m: OfficialMilestone) => (
                    <SelectItem key={m.id} value={m.id}>
                      [{m.category}] {m.title} (Mês {m.target_month})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMilestoneDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (!selectedMilestoneId) {
                    toast({ title: 'Erro', description: 'Selecione um marco.', variant: 'destructive' });
                    return;
                  }
                  createMilestoneMappingMutation.mutate({
                    official_milestone_id: selectedMilestoneId,
                    journey_v2_quiz_id: milestoneQuizId,
                  });
                }}
                disabled={createMilestoneMappingMutation.isPending || !selectedMilestoneId}
              >
                {createMilestoneMappingMutation.isPending ? 'Vinculando...' : 'Vincular'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================== MATERNAL DOMAIN DIALOG ======================== */}

      <Dialog open={maternalDomainDialog} onOpenChange={setMaternalDomainDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" /> Vincular Domínio Materno
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecione um domínio materno</Label>
              <Select
                value={selectedMaternalDomain || 'none'}
                onValueChange={(v) => setSelectedMaternalDomain(v === 'none' ? '' : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione...</SelectItem>
                  {curationService.getMotherDomains().map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMaternalDomainDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (!selectedMaternalDomain) {
                    toast({ title: 'Erro', description: 'Selecione um domínio.', variant: 'destructive' });
                    return;
                  }
                  createMaternalMappingMutation.mutate({
                    maternal_domain: selectedMaternalDomain,
                    journey_v2_quiz_id: maternalQuizId,
                  });
                }}
                disabled={createMaternalMappingMutation.isPending || !selectedMaternalDomain}
              >
                {createMaternalMappingMutation.isPending ? 'Vinculando...' : 'Vincular'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* ======================== AI GENERATOR DIALOG ======================== */}

      <Dialog open={aiGeneratorDialog} onOpenChange={setAiGeneratorDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Gerar Conteúdo com IA — {curationService.getAxisLabel(aiGenAxis)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!aiGenResult ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Eixo</Label>
                    <Select value={aiGenAxis} onValueChange={(v) => setAiGenAxis(v as CurationAxis)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baby-content">Conteúdo Bebê</SelectItem>
                        <SelectItem value="mother-content">Conteúdo Mãe</SelectItem>
                        <SelectItem value="baby-quiz">Quiz Bebê</SelectItem>
                        <SelectItem value="mother-quiz">Quiz Mãe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Ano</Label>
                    <Select value={aiGenYear.toString()} onValueChange={(v) => { setAiGenYear(parseInt(v)); setAiGenWeeks([1]); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}º Ano {y === 1 ? '(0-12 meses)' : `(${(y-1)*12+1}-${y*12} meses)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Mês</Label>
                    <Select value={aiGenMonthInYear.toString()} onValueChange={(v) => { setAiGenMonthInYear(parseInt(v)); setAiGenWeeks([1]); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <SelectItem key={m} value={m.toString()}>
                            Mês {m} (geral: {(aiGenYear - 1) * 12 + m})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-2 rounded-md text-sm text-blue-700 dark:text-blue-300">
                  Mês <strong>{aiGenOverallMonth}</strong> do acompanhamento —{' '}
                  {aiGenOverallMonth <= 12
                    ? `Bebê com ~${aiGenOverallMonth} ${aiGenOverallMonth === 1 ? 'mês' : 'meses'} de vida`
                    : `Criança com ~${Math.floor(aiGenOverallMonth / 12)} ano${Math.floor(aiGenOverallMonth / 12) > 1 ? 's' : ''}${aiGenOverallMonth % 12 > 0 ? ` e ${aiGenOverallMonth % 12} ${aiGenOverallMonth % 12 === 1 ? 'mês' : 'meses'}` : ''}`
                  }
                </div>

                <div>
                  <Label>Semanas do mês (selecione uma ou mais)</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((w) => (
                      <Button
                        key={w}
                        variant={aiGenWeeks.includes(w) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setAiGenWeeks(prev =>
                            prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w].sort((a, b) => a - b)
                          );
                        }}
                      >
                        Semana {w}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600"
                      onClick={() => setAiGenWeeks([1, 2, 3, 4, 5])}
                    >
                      Todas
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantidade por semana</Label>
                    <Select value={aiGenCount.toString()} onValueChange={(v) => setAiGenCount(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'item' : 'itens'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Domínio (opcional)</Label>
                    <Select value={aiGenDomain} onValueChange={setAiGenDomain}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os domínios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {(aiGenAxis.startsWith('baby') ? curationService.getBabyDomains() : curationService.getMotherDomains()).map((d) => (
                          <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Instruções adicionais (opcional)</Label>
                  <Textarea
                    value={aiGenInstructions}
                    onChange={(e) => setAiGenInstructions(e.target.value)}
                    placeholder="Ex: Foque em atividades de estimulação sensorial para bebês de 3 meses..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 p-3 rounded-md text-sm text-purple-700 dark:text-purple-300">
                  <strong>Total estimado:</strong> {aiGenWeeks.length * aiGenCount} itens ({aiGenWeeks.length} semana{aiGenWeeks.length > 1 ? 's' : ''} × {aiGenCount} por semana)
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAiGeneratorDialog(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => aiGenerateMutation.mutate({
                      axis: aiGenAxis,
                      month: aiGenOverallMonth,
                      weeks: aiGenWeeks,
                      count: aiGenCount,
                      domain: aiGenDomain === 'all' ? null : aiGenDomain,
                      instructions: aiGenInstructions,
                    })}
                    disabled={aiGenerateMutation.isPending || aiGenWeeks.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {aiGenerateMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Gerar Conteúdo
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium">
                    <Check className="h-4 w-4" />
                    {aiGenResult.length} itens gerados com sucesso!
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Revise e edite o JSON abaixo se necessário, depois clique em Importar.
                  </p>
                </div>

                <div>
                  <Label>JSON gerado (editável)</Label>
                  <Textarea
                    className="font-mono text-xs min-h-[300px]"
                    value={aiGenResultJson}
                    onChange={(e) => setAiGenResultJson(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAiGenResult(null);
                      setAiGenResultJson('');
                    }}
                  >
                    Gerar Novamente
                  </Button>
                  <Button
                    onClick={handleAIGenerateImport}
                    disabled={batchImportMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {batchImportMutation.isPending ? 'Importando...' : 'Importar Conteúdo'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JourneyQuestionsManagement;
