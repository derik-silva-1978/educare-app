import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { milestonesService, MilestoneMapping, CurationStats, ChartData } from '../../services/milestonesService';
import { curationService, MaternalCurationMapping as MaternalMappingType } from '../../services/curationService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  BarChart3, 
  ListChecks,
  Sparkles,
  RefreshCw,
  FileText,
  Baby,
  Calendar,
  Heart
} from 'lucide-react';
import MilestonesCurationTimeline from './MilestonesCurationTimeline';

const getCategoryBadgeColor = (category: string | undefined): string => {
  if (!category) return 'bg-gray-100 text-gray-800';
  
  const colors: Record<string, string> = {
    'motor': 'bg-green-100 text-green-800',
    'cognitivo': 'bg-yellow-100 text-yellow-800',
    'linguagem': 'bg-blue-100 text-blue-800',
    'social': 'bg-purple-100 text-purple-800',
    'emocional': 'bg-pink-100 text-pink-800',
    'sensorial': 'bg-indigo-100 text-indigo-800'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const getMaternalDomainBadgeColor = (domain: string | undefined): string => {
  if (!domain) return 'bg-gray-100 text-gray-800';

  const colors: Record<string, string> = {
    'nutricao': 'bg-emerald-100 text-emerald-800',
    'saude_mental': 'bg-violet-100 text-violet-800',
    'recuperacao': 'bg-amber-100 text-amber-800',
    'amamentacao': 'bg-pink-100 text-pink-800',
    'saude_fisica': 'bg-sky-100 text-sky-800',
    'autocuidado': 'bg-rose-100 text-rose-800'
  };

  return colors[domain] || 'bg-gray-100 text-gray-800';
};

const MATERNAL_DOMAIN_LABELS: Record<string, string> = {
  nutricao: 'Nutrição',
  saude_mental: 'Saúde Mental',
  recuperacao: 'Recuperação',
  amamentacao: 'Amamentação',
  saude_fisica: 'Saúde Física',
  autocuidado: 'Autocuidado',
};

const MilestonesCuration: React.FC = () => {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<MilestoneMapping | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [mainView, setMainView] = useState<'list' | 'timeline'>('timeline');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMappings, setSelectedMappings] = useState<Set<string>>(new Set());

  const [topTab, setTopTab] = useState('baby');

  const [maternalActiveTab, setMaternalActiveTab] = useState('pending');
  const [selectedMaternalDomain, setSelectedMaternalDomain] = useState<string | null>(null);
  const [selectedMaternalMappings, setSelectedMaternalMappings] = useState<Set<string>>(new Set());
  const [showMaternalVerifyDialog, setShowMaternalVerifyDialog] = useState(false);
  const [showMaternalDeleteDialog, setShowMaternalDeleteDialog] = useState(false);
  const [selectedMaternalMapping, setSelectedMaternalMapping] = useState<MaternalMappingType | null>(null);
  const [maternalVerifyNotes, setMaternalVerifyNotes] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['milestones-stats'],
    queryFn: () => milestonesService.getCurationStats()
  });

  const { data: pendingMappings, isLoading: loadingPending } = useQuery({
    queryKey: ['milestones-mappings', false],
    queryFn: () => milestonesService.listMappings(false)
  });

  const { data: verifiedMappings } = useQuery({
    queryKey: ['milestones-mappings', true],
    queryFn: () => milestonesService.listMappings(true)
  });

  const { data: chartData } = useQuery({
    queryKey: ['milestones-chart'],
    queryFn: () => milestonesService.getMilestonesChart()
  });

  const { data: maternalStats, isLoading: loadingMaternalStats } = useQuery({
    queryKey: ['maternal-curation-stats'],
    queryFn: () => curationService.getStatistics()
  });

  const { data: maternalPendingRaw, isLoading: loadingMaternalPending } = useQuery({
    queryKey: ['maternal-mappings-pending'],
    queryFn: () => curationService.getMaternalMappings({ verified: 'false' })
  });

  const { data: maternalVerifiedRaw } = useQuery({
    queryKey: ['maternal-mappings-verified'],
    queryFn: () => curationService.getMaternalMappings({ verified: 'true' })
  });

  const maternalPendingMappings: MaternalMappingType[] = (maternalPendingRaw as any)?.data || (Array.isArray(maternalPendingRaw) ? maternalPendingRaw : []);
  const maternalVerifiedMappings: MaternalMappingType[] = (maternalVerifiedRaw as any)?.data || (Array.isArray(maternalVerifiedRaw) ? maternalVerifiedRaw : []);

  const maternalStatsData = maternalStats?.axes?.mother_quiz?.maternal_mappings;
  const maternalTotal = maternalStatsData?.total || 0;
  const maternalVerified = maternalStatsData?.verified || 0;
  const maternalPendingCount = maternalTotal - maternalVerified;
  const maternalVerificationRate = maternalTotal > 0 ? Math.round((maternalVerified / maternalTotal) * 100) : 0;

  const verifyMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      milestonesService.verifyMapping(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones-mappings'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-stats'] });
      setShowVerifyDialog(false);
      setSelectedMapping(null);
      setVerifyNotes('');
      toast({
        title: "Sucesso",
        description: "Mapeamento verificado com sucesso!"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao verificar mapeamento",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => milestonesService.deleteMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones-mappings'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-stats'] });
      setShowDeleteDialog(false);
      setSelectedMapping(null);
      toast({
        title: "Sucesso",
        description: "Mapeamento removido com sucesso!"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover mapeamento",
        variant: "destructive"
      });
    }
  });

  const autoLinkMutation = useMutation({
    mutationFn: () => milestonesService.autoLink(4),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['milestones-mappings'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-stats'] });
      toast({
        title: "Auto-Linker Concluido",
        description: `${data.totalMappings} novos mapeamentos criados`
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao executar Auto-Linker",
        variant: "destructive"
      });
    }
  });

  const maternalVerifyMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      curationService.verifyMaternalMapping(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-mappings-pending'] });
      queryClient.invalidateQueries({ queryKey: ['maternal-mappings-verified'] });
      queryClient.invalidateQueries({ queryKey: ['maternal-curation-stats'] });
      setShowMaternalVerifyDialog(false);
      setSelectedMaternalMapping(null);
      setMaternalVerifyNotes('');
      toast({
        title: "Sucesso",
        description: "Mapeamento maternal verificado com sucesso!"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao verificar mapeamento maternal",
        variant: "destructive"
      });
    }
  });

  const maternalDeleteMutation = useMutation({
    mutationFn: (id: string) => curationService.deleteMaternalMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-mappings-pending'] });
      queryClient.invalidateQueries({ queryKey: ['maternal-mappings-verified'] });
      queryClient.invalidateQueries({ queryKey: ['maternal-curation-stats'] });
      setShowMaternalDeleteDialog(false);
      setSelectedMaternalMapping(null);
      toast({
        title: "Sucesso",
        description: "Mapeamento maternal removido com sucesso!"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover mapeamento maternal",
        variant: "destructive"
      });
    }
  });

  const handleVerify = (mapping: MilestoneMapping) => {
    setSelectedMapping(mapping);
    setShowVerifyDialog(true);
  };

  const handleDelete = (mapping: MilestoneMapping) => {
    setSelectedMapping(mapping);
    setShowDeleteDialog(true);
  };

  const confirmVerify = () => {
    if (selectedMapping) {
      verifyMutation.mutate({ id: selectedMapping.id, notes: verifyNotes });
    }
  };

  const confirmDelete = () => {
    if (selectedMapping) {
      deleteMutation.mutate(selectedMapping.id);
    }
  };

  const handleMaternalVerify = (mapping: MaternalMappingType) => {
    setSelectedMaternalMapping(mapping);
    setShowMaternalVerifyDialog(true);
  };

  const handleMaternalDelete = (mapping: MaternalMappingType) => {
    setSelectedMaternalMapping(mapping);
    setShowMaternalDeleteDialog(true);
  };

  const confirmMaternalVerify = () => {
    if (selectedMaternalMapping) {
      maternalVerifyMutation.mutate({ id: selectedMaternalMapping.id, notes: maternalVerifyNotes });
    }
  };

  const confirmMaternalDelete = () => {
    if (selectedMaternalMapping) {
      maternalDeleteMutation.mutate(selectedMaternalMapping.id);
    }
  };

  const renderStatsCards = (statsData: CurationStats | undefined) => {
    if (!statsData) return null;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{statsData.totalMilestones}</div>
            <p className="text-xs text-muted-foreground">Marcos Oficiais</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">{statsData.totalMappings}</div>
            <p className="text-xs text-muted-foreground">Total Mapeamentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{statsData.autoGenerated}</div>
            <p className="text-xs text-muted-foreground">Auto-Gerados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{statsData.verified}</div>
            <p className="text-xs text-muted-foreground">Verificados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{statsData.pendingReview}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-teal-600">{statsData.verificationRate}%</div>
            <p className="text-xs text-muted-foreground">Taxa Verificacao</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMaternalStatsCards = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">{maternalTotal}</div>
            <p className="text-xs text-muted-foreground">Total Mapeamentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{maternalVerified}</div>
            <p className="text-xs text-muted-foreground">Verificados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{maternalPendingCount}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-teal-600">{maternalVerificationRate}%</div>
            <p className="text-xs text-muted-foreground">Taxa Verificação</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCoverageChart = (data: ChartData[] | undefined) => {
    if (!data) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Cobertura por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryBadgeColor(item.category)}>
                      {item.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.mapped}/{item.total} marcos mapeados
                    </span>
                  </div>
                  <span className="text-sm font-medium">{item.coverage}%</span>
                </div>
                <Progress value={item.coverage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMaternalDomainChart = () => {
    const quizzes = maternalStats?.axes?.mother_quiz?.quizzes || [];
    const domainKeys = ['nutricao', 'saude_mental', 'recuperacao', 'amamentacao', 'saude_fisica', 'autocuidado'];

    const domainData = domainKeys.map(key => {
      const found = quizzes.find(q => q.dev_domain === key);
      const count = found ? parseInt(found.count, 10) : 0;
      return {
        domain: key,
        label: MATERNAL_DOMAIN_LABELS[key] || key,
        count,
      };
    });

    const totalQuizzes = domainData.reduce((sum, d) => sum + d.count, 0);

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Cobertura por Domínio Materno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domainData.map((item) => {
              const pct = totalQuizzes > 0 ? Math.round((item.count / totalQuizzes) * 100) : 0;
              return (
                <div key={item.domain} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={getMaternalDomainBadgeColor(item.domain)}>
                        {item.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.count} quizzes
                      </span>
                    </div>
                    <span className="text-sm font-medium">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const toggleMapping = (id: string) => {
    const newSelected = new Set(selectedMappings);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMappings(newSelected);
  };

  const batchApprove = () => {
    selectedMappings.forEach(id => {
      const mapping = pendingMappings?.find(m => m.id === id);
      if (mapping) {
        verifyMutation.mutate({ id, notes: '' });
      }
    });
    setSelectedMappings(new Set());
  };

  const toggleMaternalMapping = (id: string) => {
    const newSelected = new Set(selectedMaternalMappings);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMaternalMappings(newSelected);
  };

  const batchApproveMaternal = () => {
    selectedMaternalMappings.forEach(id => {
      maternalVerifyMutation.mutate({ id, notes: '' });
    });
    setSelectedMaternalMappings(new Set());
  };

  const filteredMappings = (mappings: MilestoneMapping[] | undefined) => {
    if (!mappings) return [];
    return selectedCategory 
      ? mappings.filter(m => m.milestone?.category === selectedCategory)
      : mappings;
  };

  const filteredMaternalMappings = (mappings: MaternalMappingType[]) => {
    if (!mappings) return [];
    return selectedMaternalDomain
      ? mappings.filter(m => m.maternal_domain === selectedMaternalDomain)
      : mappings;
  };

  const renderMappingsCards = (mappings: MilestoneMapping[] | undefined, isPending: boolean) => {
    const filtered = filteredMappings(mappings);

    if (!filtered || filtered.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{isPending ? 'Nenhum mapeamento pendente' : 'Nenhum mapeamento verificado'}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((mapping) => (
          <Card 
            key={mapping.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMappings.has(mapping.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => isPending && toggleMapping(mapping.id)}
          >
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Marco Oficial</div>
                  <p className="font-medium text-sm">{mapping.milestone?.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getCategoryBadgeColor(mapping.milestone?.category)}>
                      {mapping.milestone?.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Mês {mapping.milestone?.target_month}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Pergunta da Jornada</div>
                  <p className="font-medium text-sm">{mapping.journeyQuestion?.domain_question}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Sem. {mapping.journeyQuestion?.week}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {mapping.journeyQuestion?.domain_name}
                    </span>
                  </div>
                </div>
              </div>

              {isPending ? (
                <div className="flex gap-2 mt-4 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:bg-green-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerify(mapping);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(mapping);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2 mt-4 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Aprovado
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderMaternalMappingsCards = (mappings: MaternalMappingType[], isPending: boolean) => {
    const filtered = filteredMaternalMappings(mappings);

    if (!filtered || filtered.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{isPending ? 'Nenhum mapeamento pendente' : 'Nenhum mapeamento verificado'}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((mapping) => (
          <Card
            key={mapping.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMaternalMappings.has(mapping.id) ? 'ring-2 ring-pink-500 bg-pink-50' : ''
            }`}
            onClick={() => isPending && toggleMaternalMapping(mapping.id)}
          >
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Domínio Materno</div>
                  <Badge className={getMaternalDomainBadgeColor(mapping.maternal_domain)}>
                    {MATERNAL_DOMAIN_LABELS[mapping.maternal_domain] || mapping.maternal_domain}
                  </Badge>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                    {mapping.quiz ? 'Quiz' : 'Tópico'}
                  </div>
                  <p className="font-medium text-sm">
                    {mapping.quiz?.title || mapping.topic?.title || '—'}
                  </p>
                  {mapping.quiz?.question && (
                    <p className="text-sm text-muted-foreground mt-1">{mapping.quiz.question}</p>
                  )}
                </div>
              </div>

              {isPending ? (
                <div className="flex gap-2 mt-4 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:bg-green-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMaternalVerify(mapping);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMaternalDelete(mapping);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2 mt-4 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Aprovado
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Baby className="h-5 w-5 sm:h-6 sm:w-6" />
            Curadoria Quiz
          </h1>
          <p className="text-sm text-muted-foreground">
            Verifique e aprove os mapeamentos de quiz da Criança e da Mãe
          </p>
        </div>
      </div>

      <Tabs value={topTab} onValueChange={setTopTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="baby" className="flex items-center gap-2">
            <Baby className="h-4 w-4" />
            Quiz Criança
          </TabsTrigger>
          <TabsTrigger value="mother" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Quiz Mãe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="baby">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={mainView === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMainView('timeline')}
              >
                <Calendar className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Timeline</span>
              </Button>
              <Button
                variant={mainView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMainView('list')}
              >
                <ListChecks className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Lista</span>
              </Button>
            </div>
            <Button
              onClick={() => autoLinkMutation.mutate()}
              disabled={autoLinkMutation.isPending}
              size="sm"
              className="text-xs sm:text-sm"
            >
              {autoLinkMutation.isPending ? (
                <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">Executar Auto-Linker</span>
              <span className="sm:hidden">Auto-Link</span>
            </Button>
          </div>

          {renderStatsCards(stats)}
          {renderCoverageChart(chartData)}

          {mainView === 'timeline' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Visao Cronologica por Faixa Etaria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MilestonesCurationTimeline />
              </CardContent>
            </Card>
          ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  Mapeamentos
                </CardTitle>
                {activeTab === 'pending' && selectedMappings.size > 0 && (
                  <Button 
                    size="sm" 
                    onClick={batchApprove}
                    disabled={verifyMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar {selectedMappings.size} selecionados
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Pendentes ({pendingMappings?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="verified" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Verificados ({verifiedMappings?.length || 0})
                  </TabsTrigger>
                </TabsList>

                {activeTab === 'pending' && (
                  <div className="mb-4 flex gap-2 flex-wrap">
                    <Button 
                      variant={selectedCategory === null ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Todas
                    </Button>
                    {['motor', 'cognitivo', 'linguagem', 'social', 'emocional', 'sensorial'].map(cat => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                        className={selectedCategory === cat ? getCategoryBadgeColor(cat) : ''}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Button>
                    ))}
                  </div>
                )}

                <TabsContent value="pending">
                  {loadingPending ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    renderMappingsCards(pendingMappings, true)
                  )}
                </TabsContent>
                <TabsContent value="verified">
                  {renderMappingsCards(verifiedMappings, false)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          )}
        </TabsContent>

        <TabsContent value="mother">
          {loadingMaternalStats ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {renderMaternalStatsCards()}
              {renderMaternalDomainChart()}

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5" />
                      Mapeamentos Maternos
                    </CardTitle>
                    {maternalActiveTab === 'pending' && selectedMaternalMappings.size > 0 && (
                      <Button
                        size="sm"
                        onClick={batchApproveMaternal}
                        disabled={maternalVerifyMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar {selectedMaternalMappings.size} selecionados
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={maternalActiveTab} onValueChange={setMaternalActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="pending" className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Pendentes ({maternalPendingMappings.length})
                      </TabsTrigger>
                      <TabsTrigger value="verified" className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Verificados ({maternalVerifiedMappings.length})
                      </TabsTrigger>
                    </TabsList>

                    {maternalActiveTab === 'pending' && (
                      <div className="mb-4 flex gap-2 flex-wrap">
                        <Button
                          variant={selectedMaternalDomain === null ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedMaternalDomain(null)}
                        >
                          Todas
                        </Button>
                        {Object.entries(MATERNAL_DOMAIN_LABELS).map(([key, label]) => (
                          <Button
                            key={key}
                            variant={selectedMaternalDomain === key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedMaternalDomain(key)}
                            className={selectedMaternalDomain === key ? getMaternalDomainBadgeColor(key) : ''}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    )}

                    <TabsContent value="pending">
                      {loadingMaternalPending ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : (
                        renderMaternalMappingsCards(maternalPendingMappings, true)
                      )}
                    </TabsContent>
                    <TabsContent value="verified">
                      {renderMaternalMappingsCards(maternalVerifiedMappings, false)}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Mapeamento</DialogTitle>
            <DialogDescription>
              Confirme que o mapeamento entre o marco e a pergunta esta correto.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedMapping?.milestone?.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedMapping?.journeyQuestion?.domain_question}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Notas (opcional)</label>
              <Textarea
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="Adicione observacoes sobre este mapeamento..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmVerify} disabled={verifyMutation.isPending}>
              {verifyMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Mapeamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja rejeitar este mapeamento? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">{selectedMapping?.milestone?.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedMapping?.journeyQuestion?.domain_question}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Rejeitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMaternalVerifyDialog} onOpenChange={setShowMaternalVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Mapeamento Materno</DialogTitle>
            <DialogDescription>
              Confirme que o mapeamento materno está correto.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getMaternalDomainBadgeColor(selectedMaternalMapping?.maternal_domain)}>
                  {MATERNAL_DOMAIN_LABELS[selectedMaternalMapping?.maternal_domain || ''] || selectedMaternalMapping?.maternal_domain}
                </Badge>
              </div>
              <p className="font-medium">
                {selectedMaternalMapping?.quiz?.title || selectedMaternalMapping?.topic?.title || '—'}
              </p>
              {selectedMaternalMapping?.quiz?.question && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedMaternalMapping.quiz.question}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Notas (opcional)</label>
              <Textarea
                value={maternalVerifyNotes}
                onChange={(e) => setMaternalVerifyNotes(e.target.value)}
                placeholder="Adicione observações sobre este mapeamento..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaternalVerifyDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmMaternalVerify} disabled={maternalVerifyMutation.isPending}>
              {maternalVerifyMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMaternalDeleteDialog} onOpenChange={setShowMaternalDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Mapeamento Materno</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja rejeitar este mapeamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getMaternalDomainBadgeColor(selectedMaternalMapping?.maternal_domain)}>
                {MATERNAL_DOMAIN_LABELS[selectedMaternalMapping?.maternal_domain || ''] || selectedMaternalMapping?.maternal_domain}
              </Badge>
            </div>
            <p className="font-medium">
              {selectedMaternalMapping?.quiz?.title || selectedMaternalMapping?.topic?.title || '—'}
            </p>
            {selectedMaternalMapping?.quiz?.question && (
              <p className="text-sm text-muted-foreground mt-1">
                {selectedMaternalMapping.quiz.question}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaternalDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmMaternalDelete} disabled={maternalDeleteMutation.isPending}>
              {maternalDeleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Rejeitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MilestonesCuration;
