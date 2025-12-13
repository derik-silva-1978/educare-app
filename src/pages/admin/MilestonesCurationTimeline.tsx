import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  milestonesService, 
  AgeRangeGroup, 
  MilestoneWithCandidates
} from '../../services/milestonesService';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '../../components/ui/accordion';
import { useToast } from '../../hooks/use-toast';
import { 
  Loader2, 
  Baby, 
  Filter
} from 'lucide-react';
import MilestoneTransferList from '../../components/admin/MilestoneTransferList';

const getDomainBadgeColor = (domain: string): string => {
  const colors: Record<string, string> = {
    'Motor': 'bg-emerald-600 text-white hover:bg-emerald-700',
    'Cognitivo': 'bg-amber-600 text-white hover:bg-amber-700',
    'Linguagem': 'bg-sky-600 text-white hover:bg-sky-700',
    'Social': 'bg-violet-600 text-white hover:bg-violet-700',
    'Emocional': 'bg-rose-600 text-white hover:bg-rose-700',
  };
  return colors[domain] || 'bg-gray-600 text-white';
};

const MilestonesCurationTimeline: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [expandedRanges, setExpandedRanges] = useState<string[]>(['0-3']);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: curationData, isLoading } = useQuery({
    queryKey: ['curation-view'],
    queryFn: () => milestonesService.getCurationView()
  });

  const linkMutation = useMutation({
    mutationFn: ({ milestoneId, questionId }: { milestoneId: string; questionId: string }) =>
      milestonesService.createMapping(milestoneId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curation-view'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-stats'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-mappings'] });
      toast({
        title: "Sucesso",
        description: "Pergunta vinculada ao marco!"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao vincular pergunta",
        variant: "destructive"
      });
    }
  });

  const unlinkMutation = useMutation({
    mutationFn: (mappingId: string) => milestonesService.deleteMapping(mappingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curation-view'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-stats'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-mappings'] });
      toast({
        title: "Sucesso",
        description: "Vínculo removido!"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao remover vínculo",
        variant: "destructive"
      });
    }
  });

  const handleLink = (milestoneId: string, questionId: string) => {
    linkMutation.mutate({ milestoneId, questionId });
  };

  const handleUnlink = (mappingId: string) => {
    unlinkMutation.mutate(mappingId);
  };

  const linkMultipleMutation = useMutation({
    mutationFn: async ({ milestoneId, questionIds }: { milestoneId: string; questionIds: string[] }) => {
      const results = [];
      for (const questionId of questionIds) {
        try {
          const result = await milestonesService.createMapping(milestoneId, questionId);
          results.push(result);
        } catch (err) {
          console.error('Erro ao vincular:', err);
        }
      }
      return results;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curation-view'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-stats'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-mappings'] });
      toast({
        title: "Sucesso",
        description: `${variables.questionIds.length} perguntas vinculadas!`
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao vincular algumas perguntas",
        variant: "destructive"
      });
    }
  });

  const unlinkMultipleMutation = useMutation({
    mutationFn: async (mappingIds: string[]) => {
      for (const mappingId of mappingIds) {
        try {
          await milestonesService.deleteMapping(mappingId);
        } catch (err) {
          console.error('Erro ao desvincular:', err);
        }
      }
      return mappingIds.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['curation-view'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-stats'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-mappings'] });
      toast({
        title: "Sucesso",
        description: `${count} vínculos removidos!`
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao remover alguns vínculos",
        variant: "destructive"
      });
    }
  });

  const handleLinkMultiple = (milestoneId: string, questionIds: string[]) => {
    if (linkMultipleMutation.isPending) return;
    linkMultipleMutation.mutate({ milestoneId, questionIds });
  };

  const handleUnlinkMultiple = (mappingIds: string[]) => {
    if (unlinkMultipleMutation.isPending) return;
    unlinkMultipleMutation.mutate(mappingIds);
  };

  const [aiMatchingMilestoneId, setAiMatchingMilestoneId] = useState<string | null>(null);

  const aiMatchingMutation = useMutation({
    mutationFn: (milestoneId: string) => milestonesService.runAIMatching(milestoneId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['curation-view'] });
      queryClient.invalidateQueries({ queryKey: ['milestones-stats'] });
      toast({
        title: "Ranqueamento concluído",
        description: `${result.totalProcessed} candidatas analisadas, ${result.autoLinked} auto-vinculadas`
      });
      setAiMatchingMilestoneId(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao ranquear candidatas",
        variant: "destructive"
      });
      setAiMatchingMilestoneId(null);
    }
  });

  const handleAIMatching = (milestoneId: string) => {
    if (aiMatchingMutation.isPending) return;
    setAiMatchingMilestoneId(milestoneId);
    aiMatchingMutation.mutate(milestoneId);
  };

  const domains = ['Motor', 'Cognitivo', 'Linguagem', 'Social', 'Emocional'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const ageRanges = curationData?.data || [];

  const filterMilestonesByDomain = (milestones: MilestoneWithCandidates[]) => {
    if (!selectedDomain) return milestones;
    return milestones.filter(m => 
      m.category?.toLowerCase() === selectedDomain.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground mr-2">Filtrar por domínio:</span>
          <Button
            variant={selectedDomain === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDomain(null)}
            className={selectedDomain === null ? 'bg-gray-800 text-white hover:bg-gray-900' : ''}
          >
            Todos
          </Button>
          {domains.map((domain) => (
            <Button
              key={domain}
              variant={selectedDomain === domain ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDomain(domain)}
              className={selectedDomain === domain ? getDomainBadgeColor(domain) : ''}
            >
              {domain}
            </Button>
          ))}
        </div>
      </div>

      <Accordion 
        type="multiple" 
        value={expandedRanges}
        onValueChange={setExpandedRanges}
        className="space-y-4"
      >
        {ageRanges.map((range: AgeRangeGroup) => {
          const filteredMilestones = filterMilestonesByDomain(range.milestones);
          if (filteredMilestones.length === 0 && selectedDomain) return null;
          
          return (
            <AccordionItem 
              key={range.range_id} 
              value={range.range_id}
              className="border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Baby className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{range.range_label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {filteredMilestones.length} marcos do desenvolvimento
                        {selectedDomain && ` (${selectedDomain})`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-auto mr-4">
                    {range.min_month} - {range.max_month} meses
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4 pt-2">
                  {filteredMilestones.map((milestone: MilestoneWithCandidates) => (
                    <MilestoneTransferList
                      key={milestone.id}
                      milestone={milestone}
                      onLink={handleLink}
                      onUnlink={handleUnlink}
                      onLinkMultiple={handleLinkMultiple}
                      onUnlinkMultiple={handleUnlinkMultiple}
                      onAIMatching={handleAIMatching}
                      isLinking={linkMutation.isPending || linkMultipleMutation.isPending}
                      isUnlinking={unlinkMutation.isPending || unlinkMultipleMutation.isPending}
                      isAIMatching={aiMatchingMutation.isPending && aiMatchingMilestoneId === milestone.id}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {ageRanges.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Baby className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum marco encontrado. Execute o Auto-Linker primeiro.</p>
        </div>
      )}
    </div>
  );
};

export default MilestonesCurationTimeline;
