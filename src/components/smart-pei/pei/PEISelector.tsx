
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PEI, usePEI } from '@/hooks/usePEI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, File, FileX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStudents from '@/hooks/useStudents';
import { StudentPEIList } from '@/components/smart-pei/students/StudentPEIList';

interface PEISelectorProps {
  studentId: string;
  onSelectPEI: (peiId: string) => void;
}

export const PEISelector: React.FC<PEISelectorProps> = ({ 
  studentId, 
  onSelectPEI 
}) => {
  const { getStudentPEIs } = usePEI();
  const { getStudent } = useStudents();
  const [peis, setPeis] = useState<PEI[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const student = getStudent(studentId);
  
  useEffect(() => {
    if (studentId) {
      const studentPeis = getStudentPEIs(studentId);
      setPeis(studentPeis);
    }
  }, [studentId, getStudentPEIs]);
  
  const handleCreateNewPEI = () => {
    navigate(`/smart-pei/students/${studentId}/pei`);
  };
  
  const filteredPeis = peis.filter(pei => 
    pei.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {student ? `PEIs de ${student.name}` : 'PEIs do Estudante'}
          </h2>
          <p className="text-muted-foreground">
            Selecione um dos PEIs existentes ou crie um novo.
          </p>
        </div>
        
        <div className="flex gap-2 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar PEIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={handleCreateNewPEI}>
            <Plus className="mr-2 h-4 w-4" />
            Novo PEI
          </Button>
        </div>
        
        {peis.length > 0 ? (
          <StudentPEIList studentId={studentId} />
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <FileX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum PEI encontrado</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Este estudante ainda não possui Planos de Ensino Individualizados.
              Crie um novo PEI para começar a acompanhar o progresso.
            </p>
            <Button onClick={handleCreateNewPEI}>
              <File className="mr-2 h-4 w-4" />
              Criar Primeiro PEI
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PEISelector;
