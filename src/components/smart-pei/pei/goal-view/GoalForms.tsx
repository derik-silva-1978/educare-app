
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface GoalFormsProps {
  showProgressForm: boolean;
  showStrategyForm: boolean;
  goalId: string;
  onAddProgress: (progress: any) => void;
  onAddStrategy: (strategy: any) => void;
  onCancelProgressForm: () => void;
  onCancelStrategyForm: () => void;
}

const GoalForms: React.FC<GoalFormsProps> = ({
  showProgressForm,
  showStrategyForm,
  goalId,
  onAddProgress,
  onAddStrategy,
  onCancelProgressForm,
  onCancelStrategyForm
}) => {
  // Progress form state
  const [progressDate, setProgressDate] = useState<Date>(new Date());
  const [progressNotes, setProgressNotes] = useState('');
  const [progressStatus, setProgressStatus] = useState('minor_progress');
  
  // Strategy form state
  const [strategyDescription, setStrategyDescription] = useState('');
  const [strategyResources, setStrategyResources] = useState('');
  const [strategyResponsible, setStrategyResponsible] = useState('');
  const [strategyFrequency, setStrategyFrequency] = useState('');
  
  // Handle progress form submission
  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddProgress({
      date: progressDate.toISOString(),
      notes: progressNotes,
      status: progressStatus,
      evidence: '',
      author: 'Usuário'
    });
    
    // Reset form
    setProgressDate(new Date());
    setProgressNotes('');
    setProgressStatus('minor_progress');
  };
  
  // Handle strategy form submission
  const handleStrategySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddStrategy({
      description: strategyDescription,
      resources: strategyResources,
      responsible: strategyResponsible,
      frequency: strategyFrequency
    });
    
    // Reset form
    setStrategyDescription('');
    setStrategyResources('');
    setStrategyResponsible('');
    setStrategyFrequency('');
  };
  
  return (
    <>
      {/* Progress Form */}
      {showProgressForm && (
        <div className="mt-4 p-4 border rounded-md bg-muted/20">
          <h3 className="font-medium mb-4">Registro de Progresso</h3>
          <form onSubmit={handleProgressSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="progressDate">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {progressDate ? format(progressDate, "PPP") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={progressDate}
                    onSelect={(date) => date && setProgressDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="progressNotes">Observações</Label>
              <Textarea
                id="progressNotes"
                placeholder="Descreva o progresso observado..."
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status do Progresso</Label>
              <RadioGroup 
                value={progressStatus} 
                onValueChange={setProgressStatus}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regression" id="regression" />
                  <Label htmlFor="regression" className="cursor-pointer">Regressão</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no_change" id="no_change" />
                  <Label htmlFor="no_change" className="cursor-pointer">Sem mudança</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minor_progress" id="minor_progress" />
                  <Label htmlFor="minor_progress" className="cursor-pointer">Progresso menor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="significant_progress" id="significant_progress" />
                  <Label htmlFor="significant_progress" className="cursor-pointer">Progresso significativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="achieved" id="achieved" />
                  <Label htmlFor="achieved" className="cursor-pointer">Objetivo alcançado</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancelProgressForm}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Strategy Form */}
      {showStrategyForm && (
        <div className="mt-4 p-4 border rounded-md bg-muted/20">
          <h3 className="font-medium mb-4">Adicionar Estratégia</h3>
          <form onSubmit={handleStrategySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strategyDescription">Descrição da Estratégia</Label>
              <Textarea
                id="strategyDescription"
                placeholder="Descreva a estratégia..."
                value={strategyDescription}
                onChange={(e) => setStrategyDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strategyResources">Recursos</Label>
                <Input
                  id="strategyResources"
                  placeholder="Ex: Livros, jogos, apps..."
                  value={strategyResources}
                  onChange={(e) => setStrategyResources(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strategyResponsible">Responsável</Label>
                <Input
                  id="strategyResponsible"
                  placeholder="Ex: Professor, Terapeuta..."
                  value={strategyResponsible}
                  onChange={(e) => setStrategyResponsible(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strategyFrequency">Frequência</Label>
                <Input
                  id="strategyFrequency"
                  placeholder="Ex: Diária, 3x por semana..."
                  value={strategyFrequency}
                  onChange={(e) => setStrategyFrequency(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancelStrategyForm}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default GoalForms;
