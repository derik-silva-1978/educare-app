
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { addMonths } from 'date-fns';
import { AssessmentDomain } from '@/hooks/useAssessment';
import { PEIGoal } from '@/hooks/usePEI';

interface PEIGoalCreatorProps {
  onAddGoal: (goal: Partial<PEIGoal>) => void;
  initialData?: Partial<PEIGoal>;
}

export const PEIGoalCreator: React.FC<PEIGoalCreatorProps> = ({ 
  onAddGoal,
  initialData
}) => {
  const [showForm, setShowForm] = useState(false);
  const [goalData, setGoalData] = useState<Partial<PEIGoal>>(
    initialData || {
      domain: 'communication' as AssessmentDomain,
      title: '',
      description: '',
      targetDate: addMonths(new Date(), 3).toISOString(),
      status: 'not_started',
      evaluationMethod: '',
      strategies: [],
      progress: []
    }
  );
  
  const handleInputChange = (field: string, value: any) => {
    setGoalData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleTargetDateChange = (date: Date | undefined) => {
    if (date) {
      setGoalData(prev => ({
        ...prev,
        targetDate: date.toISOString()
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!goalData.title || !goalData.description || !goalData.domain) {
      // Show error or handle validation
      return;
    }
    
    // Generate unique ID for new goal
    const newGoal = {
      ...goalData,
      id: `goal_${Date.now()}`
    };
    
    // Add goal
    onAddGoal(newGoal);
    
    // Reset form
    setGoalData({
      domain: 'communication' as AssessmentDomain,
      title: '',
      description: '',
      targetDate: addMonths(new Date(), 3).toISOString(),
      status: 'not_started',
      evaluationMethod: '',
      strategies: [],
      progress: []
    });
    
    // Hide form
    setShowForm(false);
  };
  
  if (!showForm) {
    return (
      <Button 
        variant="outline" 
        className="w-full py-4 h-auto flex items-center justify-center gap-2" 
        onClick={() => setShowForm(true)}
      >
        <Plus className="h-4 w-4" />
        Adicionar Novo Objetivo
      </Button>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Novo Objetivo</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Objetivo</Label>
            <Input 
              id="title" 
              value={goalData.title} 
              onChange={(e) => handleInputChange('title', e.target.value)} 
              placeholder="Ex: Desenvolver comunicação verbal"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={goalData.description} 
              onChange={(e) => handleInputChange('description', e.target.value)} 
              placeholder="Descreva o objetivo de forma detalhada"
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domínio</Label>
              <Select 
                value={goalData.domain as string} 
                onValueChange={(value) => handleInputChange('domain', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o domínio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="communication">Comunicação</SelectItem>
                  <SelectItem value="academic">Acadêmico</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="behavioral">Comportamental</SelectItem>
                  <SelectItem value="adaptive">Adaptativo</SelectItem>
                  <SelectItem value="cognitive">Cognitivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Data Alvo</Label>
              <DatePicker 
                date={goalData.targetDate ? new Date(goalData.targetDate) : undefined}
                onSelect={handleTargetDateChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evaluationMethod">Método de Avaliação</Label>
            <Textarea 
              id="evaluationMethod" 
              value={goalData.evaluationMethod} 
              onChange={(e) => handleInputChange('evaluationMethod', e.target.value)} 
              placeholder="Como será avaliado o progresso deste objetivo?"
              rows={2}
            />
          </div>
          
          <CardFooter className="flex justify-between px-0 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Objetivo
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default PEIGoalCreator;
