import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { milestonesService, MilestoneMapping, CurationStats, ChartData } from '../../services/milestonesService';
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
  Baby
} from 'lucide-react';

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

const MilestonesCuration: React.FC = () => {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<MilestoneMapping | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

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

  const renderStatsCards = (statsData: CurationStats | undefined) => {
    if (!statsData) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
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

  const renderMappingsTable = (mappings: MilestoneMapping[] | undefined, isPending: boolean) => {
    if (!mappings || mappings.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{isPending ? 'Nenhum mapeamento pendente' : 'Nenhum mapeamento verificado'}</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marco Oficial</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Pergunta da Jornada</TableHead>
            <TableHead>Semana</TableHead>
            <TableHead className="text-right">Acoes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping) => (
            <TableRow key={mapping.id}>
              <TableCell>
                <div className="font-medium">{mapping.milestone?.title}</div>
                <div className="text-xs text-muted-foreground">
                  Mes alvo: {mapping.milestone?.target_month}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getCategoryBadgeColor(mapping.milestone?.category)}>
                  {mapping.milestone?.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="max-w-md truncate">{mapping.journeyQuestion?.domain_question}</div>
                <div className="text-xs text-muted-foreground">
                  Dominio: {mapping.journeyQuestion?.domain_name}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">Semana {mapping.journeyQuestion?.week}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {isPending ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleVerify(mapping)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(mapping)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Verificado</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Baby className="h-6 w-6" />
            Curadoria de Marcos do Desenvolvimento
          </h1>
          <p className="text-muted-foreground">
            Verifique e aprove os mapeamentos entre marcos oficiais e perguntas da jornada
          </p>
        </div>
        <Button
          onClick={() => autoLinkMutation.mutate()}
          disabled={autoLinkMutation.isPending}
        >
          {autoLinkMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Executar Auto-Linker
        </Button>
      </div>

      {renderStatsCards(stats)}
      {renderCoverageChart(chartData)}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Mapeamentos
          </CardTitle>
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
            <TabsContent value="pending">
              {loadingPending ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                renderMappingsTable(pendingMappings, true)
              )}
            </TabsContent>
            <TabsContent value="verified">
              {renderMappingsTable(verifiedMappings, false)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default MilestonesCuration;
