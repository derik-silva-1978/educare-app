
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import AIAssistSuggestion from './AIAssistSuggestion';

interface PEIStrategyProps {
  strategies: any[];
  onAddStrategy: (strategy: any) => void;
  domain: string;
  suggestStrategies: (goal: any) => Promise<Record<string, string>[]>;
}

const PEIStrategySection: React.FC<PEIStrategyProps> = ({
  strategies,
  onAddStrategy,
  domain,
  suggestStrategies
}) => {
  const [description, setDescription] = useState('');
  const [resources, setResources] = useState('');
  const [responsible, setResponsible] = useState('');
  const [frequency, setFrequency] = useState('');
  
  const handleAddStrategy = () => {
    if (!description.trim()) {
      return;
    }
    
    const newStrategy = {
      id: Date.now().toString(),
      description,
      resources,
      responsible,
      frequency
    };
    
    onAddStrategy(newStrategy);
    
    // Reset form
    setDescription('');
    setResources('');
    setResponsible('');
    setFrequency('');
  };
  
  const handleAcceptStrategy = (strategies: Record<string, string>[] | any) => {
    if (Array.isArray(strategies) && strategies.length > 0) {
      const strategy = strategies[0];
      setDescription(strategy.description || '');
      setResources(strategy.resources || '');
      setResponsible(strategy.responsible || '');
      setFrequency(strategy.frequency || '');
    }
  };
  
  const requestStrategySuggestions = async () => {
    const goal = { domain };
    return await suggestStrategies(goal);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Estratégias</Label>
        
        <AIAssistSuggestion
          title="estratégias"
          onRequestSuggestion={requestStrategySuggestions}
          onAccept={handleAcceptStrategy}
          type="list"
          context="Com base no domínio e objetivos selecionados"
        />
      </div>
      
      {strategies.length > 0 && (
        <div className="space-y-2 mb-4">
          {strategies.map((strategy, index) => (
            <Card key={strategy.id} className="p-3 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium">{strategy.description}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Recursos:</span> {strategy.resources}
                  </div>
                  <div>
                    <span className="font-medium">Responsável:</span> {strategy.responsible}
                  </div>
                  <div>
                    <span className="font-medium">Frequência:</span> {strategy.frequency}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="space-y-4 border p-4 rounded-md">
        <div>
          <Label htmlFor="strategyDescription" className="mb-1 block text-sm">
            Descrição da Estratégia
          </Label>
          <Textarea
            id="strategyDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva a estratégia pedagógica..."
            className="min-h-10 text-sm"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="resources" className="mb-1 block text-sm">
              Recursos Necessários
            </Label>
            <Input
              id="resources"
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              placeholder="Materiais, tecnologias..."
              className="text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="responsible" className="mb-1 block text-sm">
              Responsável
            </Label>
            <Input
              id="responsible"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Professor, terapeuta..."
              className="text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="frequency" className="mb-1 block text-sm">
              Frequência
            </Label>
            <Input
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Diária, semanal..."
              className="text-sm"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleAddStrategy} 
          disabled={!description}
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          <Plus className="mr-2 h-3 w-3" />
          Adicionar Estratégia
        </Button>
      </div>
    </div>
  );
};

export default PEIStrategySection;
