import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  milestonesService, 
  AgeRangeGroup, 
  MilestoneWithCandidates, 
  LinkedQuestion, 
  CandidateQuestion 
} from '../../services/milestonesService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '../../components/ui/accordion';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useToast } from '../../hooks/use-toast';
import { 
  Loader2, 
  Baby, 
  ChevronRight, 
  Link2, 
  Unlink, 
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';

const getCategoryBadgeColor = (category: string | undefined): string => {
  if (!category) return 'bg-gray-100 text-gray-800';
  
  const colors: Record<string, string> = {
    'motor': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'cognitivo': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'linguagem': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'social': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'emocional': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'sensorial': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const getDomainBadgeColor = (domain: string): string => {
  const colors: Record<string, string> = {
    'Motor': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'Cognitivo': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'Linguagem': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    'Social': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
    'Emocional': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  };
  return colors[domain] || 'bg-gray-100 text-gray-800';
};

interface MilestoneCardProps {
  milestone: MilestoneWithCandidates;
  onLink: (milestoneId: string, questionId: string) => void;
  onUnlink: (mappingId: string) => void;
  isLinking: boolean;
  isUnlinking: boolean;
  selectedDomain: string | null;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ 
  milestone, 
  onLink, 
  onUnlink, 
  isLinking, 
  isUnlinking,
  selectedDomain 
}) => {
  const filteredCandidates = selectedDomain 
    ? milestone.candidate_questions.filter(q => q.domain_name === selectedDomain)
    : milestone.candidate_questions;

  const filteredLinked = selectedDomain
    ? milestone.linked_questions.filter(q => q.domain_name === selectedDomain)
    : milestone.linked_questions;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Baby className="h-4 w-4 text-primary" />
              {milestone.title}
            </CardTitle>
            {milestone.description && (
              <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getCategoryBadgeColor(milestone.category)}>
              {milestone.category}
            </Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              Mês {milestone.target_month}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <Link2 className="h-4 w-4" />
              Perguntas Vinculadas ({filteredLinked.length})
            </div>
            <ScrollArea className="h-[200px] rounded-md border p-3">
              {filteredLinked.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma pergunta vinculada
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredLinked.map((q) => (
                    <div 
                      key={q.mapping_id} 
                      className="flex items-start justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{q.domain_question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Sem. {q.week}
                          </Badge>
                          <Badge className={getDomainBadgeColor(q.domain_name) + " text-xs"}>
                            {q.domain_name}
                          </Badge>
                          {q.is_verified && (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                        onClick={() => onUnlink(q.mapping_id)}
                        disabled={isUnlinking}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <ChevronRight className="h-4 w-4" />
              Perguntas Candidatas ({filteredCandidates.length})
            </div>
            <ScrollArea className="h-[200px] rounded-md border p-3">
              {filteredCandidates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma candidata disponível
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredCandidates.map((q) => (
                    <div 
                      key={q.id} 
                      className="flex items-start justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{q.domain_question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Sem. {q.week}
                          </Badge>
                          <Badge className={getDomainBadgeColor(q.domain_name) + " text-xs"}>
                            {q.domain_name}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 ml-2"
                        onClick={() => onLink(milestone.id, q.id)}
                        disabled={isLinking}
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
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

  const domains = ['Motor', 'Cognitivo', 'Linguagem', 'Social', 'Emocional'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const ageRanges = curationData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filtrar por domínio:</span>
        <Button
          variant={selectedDomain === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDomain(null)}
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

      <Accordion 
        type="multiple" 
        value={expandedRanges}
        onValueChange={setExpandedRanges}
        className="space-y-4"
      >
        {ageRanges.map((range: AgeRangeGroup) => (
          <AccordionItem 
            key={range.range_id} 
            value={range.range_id}
            className="border rounded-lg px-4"
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
                      {range.milestones_count} marcos do desenvolvimento
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
                {range.milestones.map((milestone: MilestoneWithCandidates) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    onLink={handleLink}
                    onUnlink={handleUnlink}
                    isLinking={linkMutation.isPending}
                    isUnlinking={unlinkMutation.isPending}
                    selectedDomain={selectedDomain}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
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
