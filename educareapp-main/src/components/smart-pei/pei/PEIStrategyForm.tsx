
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { PEIStrategy } from '@/hooks/usePEI';

interface PEIStrategyFormProps {
  goalId: string;
  initialData?: Partial<PEIStrategy>;
  onAddStrategy: (strategy: Omit<PEIStrategy, 'id'>) => void;
  onCancel: () => void;
  onUpdate?: (strategyId: string, strategy: Partial<PEIStrategy>) => void;
}

const PEIStrategyForm: React.FC<PEIStrategyFormProps> = ({
  goalId,
  initialData,
  onAddStrategy,
  onCancel,
  onUpdate
}) => {
  const [formData, setFormData] = useState<Partial<PEIStrategy>>(
    initialData || {
      description: '',
      resources: '',
      responsible: '',
      frequency: ''
    }
  );
  
  const isEditMode = !!initialData?.id;
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.description) {
      // Show error or validation message
      return;
    }
    
    if (isEditMode && onUpdate && formData.id) {
      // Update existing strategy
      onUpdate(formData.id, formData);
    } else {
      // Add new strategy
      onAddStrategy(formData as Omit<PEIStrategy, 'id'>);
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        {isEditMode ? 'Editar Estratégia' : 'Nova Estratégia'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Descrição da Estratégia</Label>
          <Textarea 
            id="description" 
            value={formData.description} 
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descreva a estratégia a ser utilizada..."
            rows={3}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input 
              id="responsible" 
              value={formData.responsible} 
              onChange={(e) => handleInputChange('responsible', e.target.value)}
              placeholder="Ex: Professora Ana, Pais, Terapeuta"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequência</Label>
            <Select 
              value={formData.frequency} 
              onValueChange={(value) => handleInputChange('frequency', value)}
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="twice_week">2x por semana</SelectItem>
                <SelectItem value="three_week">3x por semana</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
                <SelectItem value="biweekly">Quinzenalmente</SelectItem>
                <SelectItem value="monthly">Mensalmente</SelectItem>
                <SelectItem value="as_needed">Conforme necessário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="resources">Recursos Necessários</Label>
          <Textarea 
            id="resources" 
            value={formData.resources} 
            onChange={(e) => handleInputChange('resources', e.target.value)}
            placeholder="Liste os recursos necessários para implementar esta estratégia..."
            rows={2}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PEIStrategyForm;
