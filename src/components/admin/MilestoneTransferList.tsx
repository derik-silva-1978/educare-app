import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronsRight, 
  ChevronsLeft,
  Baby,
  Clock,
  Loader2,
  Star,
  Bot,
  Sparkles
} from 'lucide-react';
import { LinkedQuestion, CandidateQuestion, MilestoneWithCandidates } from '../../services/milestonesService';

const renderStars = (score: number | null | undefined) => {
  if (score === null || score === undefined) return null;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-3 w-3 ${i <= score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const getOpacityClass = (score: number | null | undefined) => {
  if (score === null || score === undefined) return '';
  if (score <= 1) return 'opacity-40';
  if (score === 2) return 'opacity-60';
  return '';
};

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
  const normalized = domain?.toLowerCase() || '';
  const colors: Record<string, string> = {
    'motor': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
    'cognitivo': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
    'linguagem': 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
    'social': 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
    'emocional': 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
    'sensorial': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
  };
  return colors[normalized] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
};

interface MilestoneTransferListProps {
  milestone: MilestoneWithCandidates;
  onLink: (milestoneId: string, questionId: string) => void;
  onUnlink: (mappingId: string) => void;
  onLinkMultiple: (milestoneId: string, questionIds: string[]) => void;
  onUnlinkMultiple: (mappingIds: string[]) => void;
  onAIMatching: (milestoneId: string) => void;
  isLinking: boolean;
  isUnlinking: boolean;
  isAIMatching: boolean;
}

const MilestoneTransferList: React.FC<MilestoneTransferListProps> = ({
  milestone,
  onLink,
  onUnlink,
  onLinkMultiple,
  onUnlinkMultiple,
  onAIMatching,
  isLinking,
  isUnlinking,
  isAIMatching
}) => {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [selectedLinked, setSelectedLinked] = useState<Set<string>>(new Set());

  const toggleCandidate = (id: string) => {
    const newSet = new Set(selectedCandidates);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedCandidates(newSet);
  };

  const toggleLinked = (mappingId: string) => {
    const newSet = new Set(selectedLinked);
    if (newSet.has(mappingId)) {
      newSet.delete(mappingId);
    } else {
      newSet.add(mappingId);
    }
    setSelectedLinked(newSet);
  };

  const handleAddSelected = () => {
    if (selectedCandidates.size === 0) return;
    const ids = Array.from(selectedCandidates);
    if (ids.length === 1) {
      onLink(milestone.id, ids[0]);
    } else {
      onLinkMultiple(milestone.id, ids);
    }
    setSelectedCandidates(new Set());
  };

  const handleRemoveSelected = () => {
    if (selectedLinked.size === 0) return;
    const ids = Array.from(selectedLinked);
    if (ids.length === 1) {
      onUnlink(ids[0]);
    } else {
      onUnlinkMultiple(ids);
    }
    setSelectedLinked(new Set());
  };

  const handleAddAll = () => {
    const ids = milestone.candidate_questions.map(q => q.id);
    onLinkMultiple(milestone.id, ids);
    setSelectedCandidates(new Set());
  };

  const handleRemoveAll = () => {
    const ids = milestone.linked_questions.map(q => q.mapping_id);
    onUnlinkMultiple(ids);
    setSelectedLinked(new Set());
  };

  const selectAllCandidates = () => {
    setSelectedCandidates(new Set(milestone.candidate_questions.map(q => q.id)));
  };

  const selectAllLinked = () => {
    setSelectedLinked(new Set(milestone.linked_questions.map(q => q.mapping_id)));
  };

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-3 bg-muted/30">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2 flex-wrap">
              <Baby className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="break-words">{milestone.title}</span>
            </CardTitle>
            {milestone.description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed bg-background/50 p-2 sm:p-3 rounded-md border-l-4 border-primary/30">
                {milestone.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              size="sm"
              onClick={() => onAIMatching(milestone.id)}
              disabled={isAIMatching}
              className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs sm:text-sm"
              title="Ranquear candidatas com IA"
            >
              {isAIMatching ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  IA...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Ranquear
                </>
              )}
            </Button>
            <Badge className={getCategoryBadgeColor(milestone.category) + " text-xs"}>
              {milestone.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Mês {milestone.target_month}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-4">
          <div className="space-y-2 order-1 lg:order-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Candidatas ({milestone.candidate_questions.length})
              </span>
              {milestone.candidate_questions.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={selectAllCandidates}
                  className="text-xs h-6"
                >
                  Selecionar Todas
                </Button>
              )}
            </div>
            <ScrollArea className="h-[200px] sm:h-[240px] lg:h-[280px] rounded-md border bg-blue-50/30 dark:bg-blue-950/20">
              <div className="p-2 space-y-1">
                {milestone.candidate_questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma candidata disponível
                  </p>
                ) : (
                  milestone.candidate_questions.map((q) => (
                    <TooltipProvider key={q.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            onClick={() => toggleCandidate(q.id)}
                            className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${getOpacityClass(q.relevance_score)} ${
                              selectedCandidates.has(q.id) 
                                ? 'bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-400' 
                                : 'hover:bg-blue-100/50 dark:hover:bg-blue-900/20'
                            }`}
                          >
                            <Checkbox 
                              checked={selectedCandidates.has(q.id)}
                              onCheckedChange={(e) => {
                                e.stopPropagation?.();
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-snug">{q.domain_question}</p>
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                {renderStars(q.relevance_score)}
                                <Badge variant="outline" className="text-[10px] h-5">
                                  Sem. {q.week}
                                </Badge>
                                <Badge className={getDomainBadgeColor(q.domain_name) + " text-[10px] h-5"}>
                                  {q.domain_name}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        {q.ai_reasoning && (
                          <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs">{q.ai_reasoning}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex flex-row lg:flex-col items-center justify-center gap-2 py-4 lg:py-8 order-2 lg:order-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddAll}
              disabled={isLinking || milestone.candidate_questions.length === 0}
              className="w-10 h-8 rotate-90 lg:rotate-0"
              title="Adicionar Todas"
            >
              {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronsRight className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleAddSelected}
              disabled={isLinking || selectedCandidates.size === 0}
              className="w-10 h-8 bg-green-600 hover:bg-green-700 rotate-90 lg:rotate-0"
              title="Adicionar Selecionadas"
            >
              {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemoveSelected}
              disabled={isUnlinking || selectedLinked.size === 0}
              className="w-10 h-8 rotate-90 lg:rotate-0"
              title="Remover Selecionadas"
            >
              {isUnlinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRemoveAll}
              disabled={isUnlinking || milestone.linked_questions.length === 0}
              className="w-10 h-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rotate-90 lg:rotate-0"
              title="Remover Todas"
            >
              {isUnlinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2 order-3 lg:order-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Vinculadas ({milestone.linked_questions.length})
              </span>
              {milestone.linked_questions.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={selectAllLinked}
                  className="text-xs h-6"
                >
                  Selecionar Todas
                </Button>
              )}
            </div>
            <ScrollArea className="h-[200px] sm:h-[240px] lg:h-[280px] rounded-md border bg-green-50/30 dark:bg-green-950/20">
              <div className="p-2 space-y-1">
                {milestone.linked_questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma pergunta vinculada
                  </p>
                ) : (
                  milestone.linked_questions.map((q) => (
                    <TooltipProvider key={q.mapping_id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            onClick={() => toggleLinked(q.mapping_id)}
                            className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedLinked.has(q.mapping_id) 
                                ? 'bg-green-100 dark:bg-green-900/40 ring-1 ring-green-400' 
                                : 'hover:bg-green-100/50 dark:hover:bg-green-900/20'
                            }`}
                          >
                            <Checkbox 
                              checked={selectedLinked.has(q.mapping_id)}
                              onCheckedChange={(e) => {
                                e.stopPropagation?.();
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <p className="text-sm leading-snug flex-1">{q.domain_question}</p>
                                {q.is_auto_generated && (
                                  <Bot className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                {renderStars(q.relevance_score)}
                                <Badge variant="outline" className="text-[10px] h-5">
                                  Sem. {q.week}
                                </Badge>
                                <Badge className={getDomainBadgeColor(q.domain_name) + " text-[10px] h-5"}>
                                  {q.domain_name}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        {q.ai_reasoning && (
                          <TooltipContent side="left" className="max-w-xs">
                            <p className="text-xs">{q.ai_reasoning}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneTransferList;
