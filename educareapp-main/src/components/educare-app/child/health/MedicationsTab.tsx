import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Check, Calendar, Info, Loader2, Clock, AlertCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface MedicationsTabProps {
  childId: string;
}

export const MedicationsTab: React.FC<MedicationsTabProps> = ({ childId }) => {
  const [medications, setMedications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    dosage: '',
    frequency: '',
    reason: '',
    isActive: true,
  });
  const { toast } = useToast();
  
  // Mock medications - in a real implementation, these would come from an API
  const mockMedications = [
    { 
      id: '1', 
      name: 'Dipirona', 
      startDate: '2023-05-10',
      endDate: '2023-05-12', 
      dosage: '15 gotas', 
      frequency: 'A cada 6 horas se houver febre', 
      reason: 'Febre',
      isActive: false 
    },
    { 
      id: '2', 
      name: 'Prednisolona', 
      startDate: '2023-06-20',
      endDate: '', 
      dosage: '5ml', 
      frequency: '1x ao dia', 
      reason: 'Asma',
      isActive: true 
    }
  ];
  
  const handleAddMedication = () => {
    setIsAdding(true);
    // In a real implementation, you would save the data to your database
    setTimeout(() => {
      setMedications(prev => [...prev, { 
        id: Date.now().toString(), 
        ...newMedication 
      }]);
      setNewMedication({
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        dosage: '',
        frequency: '',
        reason: '',
        isActive: true,
      });
      setIsAdding(false);
      toast({
        title: "Medicamento registrado",
        description: "O registro do medicamento foi salvo com sucesso",
      });
    }, 1000);
  };
  
  // Combine mock and state data for display
  const displayMedications = [...mockMedications, ...medications];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Registros de Medicamentos</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Novo Medicamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Novo Medicamento</DialogTitle>
              <DialogDescription>
                Adicione os detalhes do medicamento prescrito
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="med-name">Nome do Medicamento</Label>
                <Input 
                  id="med-name" 
                  value={newMedication.name} 
                  onChange={e => setNewMedication({...newMedication, name: e.target.value})} 
                  placeholder="Ex: Amoxicilina, Ibuprofeno, etc."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="med-start">Data de Início</Label>
                  <Input 
                    id="med-start" 
                    type="date" 
                    value={newMedication.startDate} 
                    onChange={e => setNewMedication({...newMedication, startDate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="med-end">Data de Término (opcional)</Label>
                  <Input 
                    id="med-end" 
                    type="date" 
                    value={newMedication.endDate} 
                    onChange={e => setNewMedication({...newMedication, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="med-dosage">Dosagem</Label>
                <Input 
                  id="med-dosage" 
                  value={newMedication.dosage} 
                  onChange={e => setNewMedication({...newMedication, dosage: e.target.value})} 
                  placeholder="Ex: 5ml, 1 comprimido, etc."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="med-frequency">Frequência</Label>
                <Input 
                  id="med-frequency" 
                  value={newMedication.frequency} 
                  onChange={e => setNewMedication({...newMedication, frequency: e.target.value})} 
                  placeholder="Ex: 3x ao dia, a cada 8 horas, etc."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="med-reason">Motivo / Condição</Label>
                <Textarea 
                  id="med-reason" 
                  value={newMedication.reason} 
                  onChange={e => setNewMedication({...newMedication, reason: e.target.value})} 
                  placeholder="Motivo da prescrição"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  id="med-active"
                  checked={newMedication.isActive}
                  onCheckedChange={(checked) => 
                    setNewMedication({...newMedication, isActive: checked})
                  }
                />
                <Label htmlFor="med-active">Medicamento em uso ativo</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddMedication} disabled={!newMedication.name || isAdding}>
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
      
      {displayMedications.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">Nenhum medicamento registrado</h3>
          <p className="text-muted-foreground mb-4">
            Registre os medicamentos prescritos para manter o histórico médico atualizado
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Registrar Primeiro Medicamento
              </Button>
            </DialogTrigger>
            {/* Dialog content as above */}
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {displayMedications.map(med => (
            <Card key={med.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{med.name}</h4>
                    {med.isActive ? (
                      <Badge className="bg-green-500">Em uso</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">Concluído</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {new Date(med.startDate).toLocaleDateString('pt-BR')}
                  {med.endDate && ` até ${new Date(med.endDate).toLocaleDateString('pt-BR')}`}
                </div>
              </div>
              
              {med.reason && (
                <div className="mt-2 text-sm flex items-start gap-1">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-amber-500" />
                  <span>{med.reason}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
