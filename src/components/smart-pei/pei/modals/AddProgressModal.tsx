
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AddProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (progress: any) => void;
}

const AddProgressModal: React.FC<AddProgressModalProps> = ({ 
  isOpen, 
  onClose, 
  onAdd 
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState("");
  const [evidence, setEvidence] = useState("");
  const [status, setStatus] = useState<string>("minor_progress");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProgress = {
      id: uuidv4(),
      date: date?.toISOString() || new Date().toISOString(),
      notes,
      evidence,
      status
    };
    
    onAdd(newProgress);
    resetForm();
  };
  
  const resetForm = () => {
    setDate(new Date());
    setNotes("");
    setEvidence("");
    setStatus("minor_progress");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Progresso</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: pt }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={pt}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status do Progresso</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regression">Regressão</SelectItem>
                <SelectItem value="no_change">Sem Alteração</SelectItem>
                <SelectItem value="minor_progress">Progresso Mínimo</SelectItem>
                <SelectItem value="significant_progress">Progresso Significativo</SelectItem>
                <SelectItem value="achieved">Objetivo Alcançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes"
              placeholder="Descreva o progresso observado"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evidence">Evidências (opcional)</Label>
            <Input 
              id="evidence"
              placeholder="Ex: Fotos, vídeos, trabalhos realizados"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
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
            <Button type="submit">Registrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProgressModal;
