import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Check, Calendar, Info, Loader2, FileText, Upload, Download } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MedicalExamsTabProps {
  childId: string;
}

export const MedicalExamsTab: React.FC<MedicalExamsTabProps> = ({ childId }) => {
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newExam, setNewExam] = useState({
    name: '',
    examDate: new Date().toISOString().split('T')[0],
    doctor: '',
    facility: '',
    results: '',
    type: 'blood',
    fileUrl: '',
  });
  const { toast } = useToast();
  
  // Mock exams - in a real implementation, these would come from an API
  const mockExams = [
    { 
      id: '1', 
      name: 'Hemograma Completo', 
      examDate: '2023-04-05',
      doctor: 'Dra. Ana Silva',
      facility: 'Laboratório Central',
      results: 'Resultados normais para a idade',
      type: 'blood',
      fileUrl: '',
    },
    { 
      id: '2', 
      name: 'Raio-X do Tórax', 
      examDate: '2023-03-12',
      doctor: 'Dr. Carlos Mendes',
      facility: 'Hospital Infantil',
      results: 'Sem alterações significativas',
      type: 'imaging',
      fileUrl: '', 
    }
  ];
  
  const examTypes = [
    { value: 'blood', label: 'Exame de Sangue' },
    { value: 'imaging', label: 'Exame de Imagem' },
    { value: 'hearing', label: 'Exame de Audição' },
    { value: 'vision', label: 'Exame de Visão' },
    { value: 'other', label: 'Outro' }
  ];
  
  const handleAddExam = () => {
    setIsAdding(true);
    // In a real implementation, you would save the data to your database
    setTimeout(() => {
      setExams(prev => [...prev, { 
        id: Date.now().toString(), 
        ...newExam 
      }]);
      setNewExam({
        name: '',
        examDate: new Date().toISOString().split('T')[0],
        doctor: '',
        facility: '',
        results: '',
        type: 'blood',
        fileUrl: '',
      });
      setIsAdding(false);
      toast({
        title: "Exame registrado",
        description: "O registro do exame foi salvo com sucesso",
      });
    }, 1000);
  };
  
  // Combine mock and state data for display
  const displayExams = [...mockExams, ...exams];
  
  // Get label for exam type
  const getExamTypeLabel = (type: string) => {
    return examTypes.find(t => t.value === type)?.label || 'Outro';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Registros de Exames</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Novo Exame
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Novo Exame</DialogTitle>
              <DialogDescription>
                Adicione os detalhes do exame realizado
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="exam-name">Nome do Exame</Label>
                <Input 
                  id="exam-name" 
                  value={newExam.name} 
                  onChange={e => setNewExam({...newExam, name: e.target.value})} 
                  placeholder="Ex: Hemograma, Raio-X, etc."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="exam-type">Tipo de Exame</Label>
                <Select 
                  value={newExam.type} 
                  onValueChange={(value) => setNewExam({...newExam, type: value})}
                >
                  <SelectTrigger id="exam-type">
                    <SelectValue placeholder="Selecione o tipo de exame" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="exam-date">Data do Exame</Label>
                <Input 
                  id="exam-date" 
                  type="date" 
                  value={newExam.examDate} 
                  onChange={e => setNewExam({...newExam, examDate: e.target.value})}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="exam-doctor">Médico</Label>
                  <Input 
                    id="exam-doctor" 
                    value={newExam.doctor} 
                    onChange={e => setNewExam({...newExam, doctor: e.target.value})} 
                    placeholder="Nome do médico solicitante"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam-facility">Local</Label>
                  <Input 
                    id="exam-facility" 
                    value={newExam.facility} 
                    onChange={e => setNewExam({...newExam, facility: e.target.value})} 
                    placeholder="Laboratório ou clínica"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="exam-results">Resultados</Label>
                <Textarea 
                  id="exam-results" 
                  value={newExam.results} 
                  onChange={e => setNewExam({...newExam, results: e.target.value})} 
                  placeholder="Descrição dos resultados do exame"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="exam-file">Anexar Arquivo (opcional)</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center border-dashed">
                    <Upload className="h-4 w-4 mb-1" />
                    <span className="text-xs text-muted-foreground">Clique para escolher um arquivo</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddExam} disabled={!newExam.name || isAdding}>
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
      
      {displayExams.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">Nenhum exame registrado</h3>
          <p className="text-muted-foreground mb-4">
            Registre os exames realizados para manter o histórico médico completo
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Registrar Primeiro Exame
              </Button>
            </DialogTrigger>
            {/* Dialog content as above */}
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {displayExams.map(exam => (
            <Card key={exam.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{exam.name}</h4>
                    <Badge variant="outline">{getExamTypeLabel(exam.type)}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {exam.facility} - {exam.doctor}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {new Date(exam.examDate).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              {exam.results && (
                <div className="mt-3 text-sm p-3 bg-slate-50 rounded-md">
                  <div className="font-medium text-xs uppercase text-muted-foreground mb-1">Resultados</div>
                  {exam.results}
                </div>
              )}
              
              {exam.fileUrl && (
                <div className="mt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-3.5 w-3.5 mr-2" />
                    <span className="text-xs">Ver documento</span>
                    <Download className="h-3.5 w-3.5 ml-auto" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
