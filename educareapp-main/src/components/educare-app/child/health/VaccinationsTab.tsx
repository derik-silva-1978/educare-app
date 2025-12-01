
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Check, Calendar, Info, Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface VaccinationsTabProps {
  childId: string;
}

export const VaccinationsTab: React.FC<VaccinationsTabProps> = ({ childId }) => {
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newVaccine, setNewVaccine] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    dose: '',
    notes: '',
  });
  const { toast } = useToast();
  
  // This would fetch actual vaccination data in a real implementation
  // For now, we'll use placeholder data
  const mockVaccinations = [
    { id: '1', name: 'BCG', date: '2023-01-15', dose: 'Única', notes: 'Aplicada na maternidade' },
    { id: '2', name: 'Hepatite B', date: '2023-01-15', dose: '1ª dose', notes: '' },
  ];
  
  const handleAddVaccination = () => {
    setIsAdding(true);
    // In a real implementation, you would save the data to your database
    setTimeout(() => {
      setVaccinations(prev => [...prev, { 
        id: Date.now().toString(), 
        ...newVaccine 
      }]);
      setNewVaccine({
        name: '',
        date: new Date().toISOString().split('T')[0],
        dose: '',
        notes: '',
      });
      setIsAdding(false);
      toast({
        title: "Vacina registrada",
        description: "O registro de vacinação foi salvo com sucesso",
      });
    }, 1000);
  };
  
  // Combine mock and state data for display
  const displayVaccinations = [...mockVaccinations, ...vaccinations];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Carteira de Vacinação</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nova Vacina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Vacina</DialogTitle>
              <DialogDescription>
                Adicione os detalhes da vacina aplicada
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="vaccine-name">Nome da Vacina</Label>
                <Input 
                  id="vaccine-name" 
                  value={newVaccine.name} 
                  onChange={e => setNewVaccine({...newVaccine, name: e.target.value})} 
                  placeholder="Ex: BCG, Hepatite B, etc."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="vaccine-date">Data de Aplicação</Label>
                <Input 
                  id="vaccine-date" 
                  type="date" 
                  value={newVaccine.date} 
                  onChange={e => setNewVaccine({...newVaccine, date: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="vaccine-dose">Dose</Label>
                <Input 
                  id="vaccine-dose" 
                  value={newVaccine.dose} 
                  onChange={e => setNewVaccine({...newVaccine, dose: e.target.value})} 
                  placeholder="Ex: 1ª dose, 2ª dose, Reforço, etc."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="vaccine-notes">Observações</Label>
                <Input 
                  id="vaccine-notes" 
                  value={newVaccine.notes} 
                  onChange={e => setNewVaccine({...newVaccine, notes: e.target.value})} 
                  placeholder="Observações adicionais (opcional)"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddVaccination} disabled={!newVaccine.name || isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Salvar Registro
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {displayVaccinations.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">Nenhuma vacina registrada</h3>
          <p className="text-muted-foreground mb-4">
            Registre as vacinas aplicadas para manter o histórico de vacinação atualizado
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Registrar Primeira Vacina
              </Button>
            </DialogTrigger>
            {/* Dialog content as above */}
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayVaccinations.map(vaccine => (
            <Card key={vaccine.id} className="p-4 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{vaccine.name}</h4>
                  <div className="text-sm text-muted-foreground">{vaccine.dose}</div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {new Date(vaccine.date).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              {vaccine.notes && (
                <div className="mt-2 text-sm">
                  {vaccine.notes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
