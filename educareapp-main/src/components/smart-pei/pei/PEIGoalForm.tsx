
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Plus, Sparkles } from 'lucide-react';
import { AssessmentForm } from '@/hooks/useAssessment';
import { PEIGoal } from '@/hooks/usePEI';
import { usePEIAIAssistance } from '@/hooks/usePEIAIAssistance';
import AIAssistSuggestion from './AIAssistSuggestion';
import PEIStrategySection from './PEIStrategySection';

interface PEIGoalFormProps {
  onAddGoal: (goal: any) => void;
  assessment: AssessmentForm | null;
}

export const PEIGoalForm: React.FC<PEIGoalFormProps> = ({ onAddGoal, assessment }) => {
  const { suggestGoals, suggestStrategies } = usePEIAIAssistance();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState<string>('comunicacao');
  const [evaluationMethod, setEvaluationMethod] = useState('');
  const [strategies, setStrategies] = useState<any[]>([]);
  const [targetDate, setTargetDate] = useState('');
  
  const handleAddGoal = () => {
    if (!title.trim() || !domain || !description.trim()) {
      return;
    }
    
    const newGoal = {
      id: Date.now().toString(),
      title,
      description,
      domain,
      evaluationMethod,
      strategies,
      targetDate: targetDate || new Date().toISOString().split('T')[0],
      status: 'not_started',
      progress: []
    };
    
    onAddGoal(newGoal);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDomain('comunicacao');
    setEvaluationMethod('');
    setStrategies([]);
    setTargetDate('');
  };
  
  const handleAcceptGoal = (goals: any) => {
    if (Array.isArray(goals) && goals.length > 0) {
      const goal = goals[0];
      setTitle(goal.title || '');
      setDescription(goal.description || '');
      setDomain(goal.domain || 'comunicacao');
      setEvaluationMethod(goal.evaluationMethod || '');
    }
  };
  
  const handleAddStrategy = (strategy: any) => {
    setStrategies([...strategies, strategy]);
  };
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Objetivos e Estratégias</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Defina os objetivos educacionais e as estratégias para alcançá-los.
          </p>
          
          <AIAssistSuggestion
            title="objetivos"
            onRequestSuggestion={suggestGoals}
            onAccept={handleAcceptGoal}
            type="list"
            context="Com base nos resultados da avaliação e áreas de desenvolvimento"
          />
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="domain" className="mb-2 block">
                Domínio
              </Label>
              <Select
                value={domain}
                onValueChange={(value) => setDomain(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um domínio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comunicacao">Comunicação</SelectItem>
                  <SelectItem value="socioemocional">Socioemocional</SelectItem>
                  <SelectItem value="academico">Acadêmico</SelectItem>
                  <SelectItem value="motor">Desenvolvimento Motor</SelectItem>
                  <SelectItem value="cognitivo">Desenvolvimento Cognitivo</SelectItem>
                  <SelectItem value="autonomia">Autonomia e Vida Prática</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="targetDate" className="mb-2 block">
                Data Alvo
              </Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="title" className="mb-2 block">
              Título do Objetivo
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Desenvolver habilidades de comunicação expressiva"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="mb-2 block">
              Descrição Detalhada
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o objetivo de forma detalhada, incluindo comportamentos esperados..."
              className="min-h-20"
            />
          </div>
          
          <div>
            <Label htmlFor="evaluationMethod" className="mb-2 block">
              Método de Avaliação
            </Label>
            <Textarea
              id="evaluationMethod"
              value={evaluationMethod}
              onChange={(e) => setEvaluationMethod(e.target.value)}
              placeholder="Como o progresso deste objetivo será mensurado e avaliado..."
              className="min-h-20"
            />
          </div>
          
          <PEIStrategySection
            strategies={strategies}
            onAddStrategy={handleAddStrategy}
            domain={domain}
            suggestStrategies={suggestStrategies}
          />
          
          <Button
            onClick={handleAddGoal}
            disabled={!title || !domain || !description}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Objetivo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PEIGoalForm;
