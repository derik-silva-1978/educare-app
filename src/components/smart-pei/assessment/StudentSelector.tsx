
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Search, Loader2, User } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  classroom?: string;
}

interface StudentSelectorProps {
  onSelect: (studentId: string, studentName: string) => void;
  onCancel?: () => void;
  initialStudents?: Student[];
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({ 
  onSelect, 
  onCancel,
  initialStudents = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(initialStudents);
  
  // Simulate loading students (in a real app, this would fetch from an API)
  useEffect(() => {
    if (initialStudents.length > 0) {
      setStudents(initialStudents);
      setFilteredStudents(initialStudents);
      setIsLoading(false);
      return;
    }
    
    const mockStudents: Student[] = [
      { id: 's1', name: 'João Silva', classroom: '5º Ano A' },
      { id: 's2', name: 'Maria Santos', classroom: '3º Ano B' },
      { id: 's3', name: 'Pedro Oliveira', classroom: '4º Ano C' },
      { id: 's4', name: 'Ana Souza', classroom: '2º Ano A' },
      { id: 's5', name: 'Lucas Costa', classroom: '5º Ano B' }
    ];
    
    // Simulate API delay
    const timer = setTimeout(() => {
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [initialStudents]);
  
  // Filter students when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(lowercasedSearch) ||
      (student.classroom && student.classroom.toLowerCase().includes(lowercasedSearch))
    );
    
    setFilteredStudents(filtered);
  }, [searchTerm, students]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <Card className="border-none">
      <CardHeader className="pb-3">
        <CardTitle>Selecionar Estudante</CardTitle>
        <CardDescription>
          Escolha um estudante para realizar a avaliação
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar estudante..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredStudents.map(student => (
                <Button
                  key={student.id}
                  variant="outline"
                  className="w-full justify-start font-normal h-auto py-3 px-4"
                  onClick={() => onSelect(student.id, student.name)}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.classroom || "Sala não definida"}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum estudante encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end border-t bg-muted/30 p-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="mr-2">
            Cancelar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudentSelector;
