
import React from 'react';
import { Student } from '@/hooks/useStudents';
import StudentCard from './StudentCard';
import useKeyboardNavigation from './hooks/useKeyboardNavigation';

interface StudentGridProps {
  students: Student[];
  onStudentSelect?: (studentId: string) => void;
}

export const StudentGrid: React.FC<StudentGridProps> = ({ students, onStudentSelect }) => {
  const { focusedIndex, handleKeyDown } = useKeyboardNavigation({
    itemCount: students.length,
    columnsPerRow: 3
  });
  
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="grid"
      aria-label="Lista de estudantes"
    >
      {students.map((student, index) => (
        <div 
          key={student.id} 
          id={`student-card-${index}`}
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onClick={() => onStudentSelect && onStudentSelect(student.id)}
          className="outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-lg cursor-pointer transform transition-transform hover:scale-102"
          role="row"
        >
          <StudentCard student={student} />
        </div>
      ))}
      {students.length === 0 && (
        <div className="col-span-3 py-16 text-center">
          <p className="text-muted-foreground">Nenhum estudante encontrado com os filtros atuais.</p>
        </div>
      )}
    </div>
  );
};

export default StudentGrid;
