
import React, { useState } from 'react';
import { useHealthRecordsOptimized } from '@/hooks/useHealthRecordsOptimized';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Heart, Pill, Stethoscope, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HealthRecordsTabRefactoredProps {
  childId: string;
}

export const HealthRecordsTabRefactored: React.FC<HealthRecordsTabRefactoredProps> = ({ childId }) => {
  const { toast } = useToast();
  const {
    records,
    vaccinations,
    medications,
    exams,
    growthRecords,
    latestGrowthData,
    isLoading,
    error,
    addRecord
  } = useHealthRecordsOptimized(childId);

  const [activeForm, setActiveForm] = useState<string | null>(null);

  const handleAddVaccination = async (data: any) => {
    try {
      await addRecord.mutate({ ...data, type: 'vaccination' });
      setActiveForm(null);
      toast({
        title: "Vacinação adicionada",
        description: "Registro de vacinação salvo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o registro.",
        variant: "destructive",
      });
    }
  };

  const handleAddMedication = async (data: any) => {
    try {
      await addRecord.mutate({ ...data, type: 'medication' });
      setActiveForm(null);
      toast({
        title: "Medicação adicionada",
        description: "Registro de medicação salvo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o registro.",
        variant: "destructive",
      });
    }
  };

  const handleAddExam = async (data: any) => {
    try {
      await addRecord.mutate({ ...data, type: 'exam' });
      setActiveForm(null);
      toast({
        title: "Exame adicionado",
        description: "Registro de exame salvo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o registro.",
        variant: "destructive",
      });
    }
  };

  const handleAddGrowth = async (data: any) => {
    try {
      await addRecord.mutate({ ...data, type: 'growth' });
      setActiveForm(null);
      toast({
        title: "Crescimento registrado",
        description: "Dados de crescimento salvos com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o registro.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Carregando registros de saúde...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Erro ao carregar registros: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacinações</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vaccinations.length}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setActiveForm('vaccination')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medicações</CardTitle>
            <Pill className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setActiveForm('medication')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exames</CardTitle>
            <Stethoscope className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setActiveForm('exam')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{growthRecords.length}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setActiveForm('growth')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder message for simplified scope */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Registros de Saúde - Em Desenvolvimento
          </h3>
          <p className="text-blue-600">
            Esta funcionalidade será implementada em breve. Por enquanto, você pode visualizar 
            esta estrutura que será usada para gerenciar os registros de saúde da criança.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
