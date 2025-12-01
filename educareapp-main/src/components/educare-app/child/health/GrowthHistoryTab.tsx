import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Check, Calendar, Info, Loader2, LineChart, Ruler, Scale } from 'lucide-react';
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
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface GrowthHistoryTabProps {
  childId: string;
}

interface GrowthRecord {
  id: string;
  date: string;
  height: number;  // in cm
  weight: number;  // in kg
  age: number;     // in months
  headCircumference?: number; // in cm, optional for older children
}

// Function to calculate months between two dates
const getMonthsDiff = (dateFrom: Date, dateTo: Date) => {
  return (
    dateTo.getMonth() - 
    dateFrom.getMonth() + 
    12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  );
};

export const GrowthHistoryTab: React.FC<GrowthHistoryTabProps> = ({ childId }) => {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [childBirthdate, setChildBirthdate] = useState<string>('2020-01-01'); // This would come from the child data
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    headCircumference: '',
  });
  const { toast } = useToast();
  
  // Mock growth records - in a real implementation, these would come from an API
  const mockRecords: GrowthRecord[] = [
    { 
      id: '1',
      date: '2020-01-15', // Two weeks after birth
      height: 50,
      weight: 3.2,
      age: 0.5,
      headCircumference: 34.5
    },
    { 
      id: '2',
      date: '2020-03-01', // 2 months
      height: 55,
      weight: 4.7,
      age: 2,
      headCircumference: 36.8
    },
    { 
      id: '3',
      date: '2020-07-01', // 6 months
      height: 65,
      weight: 7.1,
      age: 6,
      headCircumference: 42.3
    },
    { 
      id: '4',
      date: '2021-01-01', // 12 months (1 year)
      height: 74,
      weight: 9.5,
      age: 12,
      headCircumference: 45.8
    },
    { 
      id: '5',
      date: '2022-01-01', // 24 months (2 years)
      height: 86,
      weight: 12.3,
      age: 24,
      headCircumference: 48.2
    },
    { 
      id: '6',
      date: '2023-01-01', // 36 months (3 years)
      height: 94,
      weight: 14.5,
      age: 36,
    }
  ];
  
  // Calculate the child's age in months at the time of the new record
  const calculateAgeAtRecord = (recordDate: string): number => {
    const birthDate = new Date(childBirthdate);
    const recordDateObj = new Date(recordDate);
    return getMonthsDiff(birthDate, recordDateObj);
  };
  
  const handleAddRecord = () => {
    if (!newRecord.height || !newRecord.weight) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha pelo menos altura e peso",
        variant: "destructive"
      });
      return;
    }
    
    setIsAdding(true);
    
    // In a real implementation, you would save the data to your database
    setTimeout(() => {
      const newEntry: GrowthRecord = {
        id: Date.now().toString(),
        date: newRecord.date,
        height: parseFloat(newRecord.height),
        weight: parseFloat(newRecord.weight),
        age: calculateAgeAtRecord(newRecord.date),
      };
      
      if (newRecord.headCircumference) {
        newEntry.headCircumference = parseFloat(newRecord.headCircumference);
      }
      
      setRecords(prev => [...prev, newEntry]);
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        height: '',
        weight: '',
        headCircumference: '',
      });
      setIsAdding(false);
      toast({
        title: "Medidas registradas",
        description: "As medidas de crescimento foram salvas com sucesso",
      });
    }, 1000);
  };
  
  // Combine mock and state data for display, and sort by date
  const displayRecords = [...mockRecords, ...records].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Prepare chart data
  const chartData = displayRecords.map(record => ({
    age: record.age,
    date: new Date(record.date).toLocaleDateString('pt-BR'),
    weight: record.weight,
    height: record.height,
    headCircumference: record.headCircumference || 0,
  }));
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Crescimento e Desenvolvimento</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nova Medição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Medidas de Crescimento</DialogTitle>
              <DialogDescription>
                Registre as medidas atuais de crescimento da criança
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="growth-date">Data da Medição</Label>
                <Input 
                  id="growth-date" 
                  type="date" 
                  value={newRecord.date} 
                  onChange={e => setNewRecord({...newRecord, date: e.target.value})}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="growth-height">Altura (cm)</Label>
                  <Input 
                    id="growth-height" 
                    type="number"
                    step="0.1"
                    value={newRecord.height} 
                    onChange={e => setNewRecord({...newRecord, height: e.target.value})}
                    placeholder="Ex: 86.5"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="growth-weight">Peso (kg)</Label>
                  <Input 
                    id="growth-weight"
                    type="number"
                    step="0.01"
                    value={newRecord.weight} 
                    onChange={e => setNewRecord({...newRecord, weight: e.target.value})}
                    placeholder="Ex: 12.5"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="growth-head">Perímetro Cefálico (cm) - opcional</Label>
                <Input 
                  id="growth-head"
                  type="number"
                  step="0.1"
                  value={newRecord.headCircumference} 
                  onChange={e => setNewRecord({...newRecord, headCircumference: e.target.value})}
                  placeholder="Ex: 46.5"
                />
                <p className="text-xs text-muted-foreground">
                  Geralmente medido apenas até os 36 meses de idade
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddRecord} disabled={!newRecord.height || !newRecord.weight || isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Salvar Medidas
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {displayRecords.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">Nenhum registro de crescimento</h3>
          <p className="text-muted-foreground mb-4">
            Registre as medidas de crescimento para acompanhar o desenvolvimento
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Registrar Primeira Medição
              </Button>
            </DialogTrigger>
            {/* Dialog content as above */}
          </Dialog>
        </div>
      ) : (
        <>
          {/* Growth Charts */}
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-1">
                <LineChart className="h-4 w-4" /> Gráfico de Crescimento
              </h4>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: 'Idade (meses)', position: 'insideBottom', offset: -5 }} />
                    <YAxis yAxisId="left" label={{ value: 'Altura (cm)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Peso (kg)', angle: 90, position: 'insideRight' }} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'height') return [`${value} cm`, 'Altura'];
                      if (name === 'weight') return [`${value} kg`, 'Peso'];
                      if (name === 'headCircumference') return [`${value} cm`, 'Perím. Cefálico'];
                      return [value, name];
                    }} />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="height" 
                      name="Altura" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="weight" 
                      name="Peso" 
                      stroke="#82ca9d" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    {displayRecords.some(r => r.headCircumference) && (
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="headCircumference" 
                        name="Perím. Cefálico" 
                        stroke="#ffc658" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    )}
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          {/* Recent Records */}
          <div>
            <h4 className="font-medium mb-3">Registros de Crescimento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayRecords.slice(-4).reverse().map(record => (
                <Card key={record.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <div className="text-sm text-muted-foreground mb-2 flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(record.date)}
                        <span className="ml-2 text-xs px-2 py-0.5 bg-slate-100 rounded-full">
                          {record.age} {record.age === 1 ? 'mês' : 'meses'}
                        </span>
                      </div>
                      <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
                        <div className="flex items-center gap-1 text-sm">
                          <Ruler className="h-3.5 w-3.5 text-blue-500" />
                          <span className="font-medium">{record.height} cm</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Scale className="h-3.5 w-3.5 text-green-500" />
                          <span className="font-medium">{record.weight} kg</span>
                        </div>
                        {record.headCircumference && (
                          <div className="flex items-center gap-1 text-sm">
                            <span className="h-3.5 w-3.5 text-amber-500 flex items-center justify-center text-xs">PC</span>
                            <span className="font-medium">{record.headCircumference} cm</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
