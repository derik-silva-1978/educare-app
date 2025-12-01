
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, FileText, Calendar, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PEI } from '@/hooks/usePEI';
import usePEI from '@/hooks/usePEI';
import useSmartPEI from '@/hooks/useSmartPEI';

interface StudentPEIListProps {
  studentId: string;
}

export const StudentPEIList: React.FC<StudentPEIListProps> = ({ studentId }) => {
  const navigate = useNavigate();
  const { getStudentPEIs } = usePEI();
  const { openModal } = useSmartPEI();
  const [peis, setPeis] = useState<PEI[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'all' | 'archived'>('active');
  
  useEffect(() => {
    // Load PEIs for the student
    const studentPeis = getStudentPEIs(studentId);
    setPeis(studentPeis);
  }, [studentId]);
  
  // Filter PEIs based on active tab
  const filteredPeis = peis.filter(pei => {
    if (activeTab === 'active') return pei.status === 'active';
    if (activeTab === 'archived') return pei.status === 'archived' || pei.status === 'completed';
    return true; // 'all' tab
  });
  
  const handleCreatePEI = () => {
    navigate(`/smart-pei/students/${studentId}/pei`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="archived">Arquivados</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={handleCreatePEI} className="ml-4">
          <Plus className="h-4 w-4 mr-2" /> Novo PEI
        </Button>
      </div>
      
      {filteredPeis.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPeis.map((pei) => (
            <PEICard key={pei.id} pei={pei} studentId={studentId} />
          ))}
        </div>
      ) : (
        <EmptyPEIState onCreatePEI={handleCreatePEI} />
      )}
    </div>
  );
};

// PEI Card Component
interface PEICardProps {
  pei: PEI;
  studentId: string;
}

const PEICard: React.FC<PEICardProps> = ({ pei, studentId }) => {
  const navigate = useNavigate();
  const { getOverallProgress } = usePEI(pei.id);
  
  // Get overall progress for the PEI
  const progress = getOverallProgress() || 0;
  
  // Format dates
  const startDate = new Date(pei.startDate).toLocaleDateString('pt-BR');
  const endDate = new Date(pei.endDate).toLocaleDateString('pt-BR');
  
  // Status badge color
  const statusColor = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-amber-100 text-amber-800'
  }[pei.status];
  
  // Format status text
  const statusText = {
    draft: 'Rascunho',
    active: 'Ativo',
    completed: 'Concluído',
    archived: 'Arquivado'
  }[pei.status];
  
  const goToPEI = () => {
    navigate(`/smart-pei/students/${studentId}/pei/${pei.id}`);
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{pei.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center mt-1">
                <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="text-xs">{startDate} - {endDate}</span>
              </div>
            </CardDescription>
          </div>
          <Badge variant="outline" className={statusColor}>
            {statusText}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span>Progresso Geral</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>
              <GraduationCap className="h-4 w-4 mr-1 inline-block" />
              <span>{pei.goals.length} objetivos</span>
            </div>
            <div>
              <Calendar className="h-4 w-4 mr-1 inline-block" />
              <span>Revisão: {pei.reviewFrequency}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={goToPEI}
        >
          <FileText className="h-4 w-4 mr-2" /> Ver PEI
        </Button>
      </CardFooter>
    </Card>
  );
};

// Empty State Component
interface EmptyPEIStateProps {
  onCreatePEI: () => void;
}

const EmptyPEIState: React.FC<EmptyPEIStateProps> = ({ onCreatePEI }) => {
  return (
    <Card className="bg-gray-50/50 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum PEI encontrado</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Crie um novo Plano de Ensino Individualizado para este aluno para começar a acompanhar seu progresso.
        </p>
        <Button onClick={onCreatePEI}>
          <Plus className="h-4 w-4 mr-2" /> Criar Novo PEI
        </Button>
      </CardContent>
    </Card>
  );
};

export default StudentPEIList;
