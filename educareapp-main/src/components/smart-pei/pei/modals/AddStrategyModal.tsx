
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';

interface AddStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (strategy: any) => void;
}

const AddStrategyModal: React.FC<AddStrategyModalProps> = ({ 
  isOpen, 
  onClose, 
  onAdd 
}) => {
  const [description, setDescription] = useState("");
  const [resources, setResources] = useState("");
  const [responsible, setResponsible] = useState("");
  const [frequency, setFrequency] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStrategy = {
      id: uuidv4(),
      description,
      resources,
      responsible,
      frequency
    };
    
    onAdd(newStrategy);
    resetForm();
  };
  
  const resetForm = () => {
    setDescription("");
    setResources("");
    setResponsible("");
    setFrequency("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Estratégia</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Estratégia</Label>
            <Textarea 
              id="description"
              placeholder="Descreva a estratégia para alcançar o objetivo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resources">Recursos Necessários</Label>
            <Input 
              id="resources"
              placeholder="Ex: Material didático adaptado, software especializado"
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input 
              id="responsible"
              placeholder="Quem irá implementar esta estratégia?"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequência</Label>
            <Input 
              id="frequency"
              placeholder="Ex: Diariamente, 3x por semana, Durante aulas de matemática"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStrategyModal;
