
import React, { useState, useEffect } from 'react';
import { Student } from '@/hooks/useStudents';
import { StudentCard } from './students/StudentCard';
import { StudentListSkeleton } from './students/StudentListSkeleton';
import { EmptyStudentList } from './students/EmptyStudentList';
import StudentListPagination from './students/StudentListPagination';

interface StudentListProps {
  students: Student[];
  loading: boolean;
  searchTerm?: string;
  totalCount?: number;
  itemsPerPage?: number;
}

export const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  loading, 
  searchTerm,
  totalCount,
  itemsPerPage = 9 // Default to 9 items per page (3x3 grid)
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedStudents, setPaginatedStudents] = useState<Student[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Sort students alphabetically by name
  const sortedStudents = React.useMemo(() => 
    [...students].sort((a, b) => 
      a.name.localeCompare(b.name, 'pt-BR')
    ), [students]
  );
  
  // Calculate pagination when students change
  useEffect(() => {
    if (sortedStudents.length === 0) {
      setPaginatedStudents([]);
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }
    
    // Calculate total pages
    const calculatedTotalPages = Math.ceil(sortedStudents.length / itemsPerPage);
    setTotalPages(calculatedTotalPages);
    
    // Ensure current page is valid
    if (currentPage > calculatedTotalPages) {
      setCurrentPage(calculatedTotalPages);
    }
    
    // Get current page items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sortedStudents.length);
    setPaginatedStudents(sortedStudents.slice(startIndex, endIndex));
  }, [sortedStudents, currentPage, itemsPerPage]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (loading) {
    return <StudentListSkeleton />;
  }

  if (students.length === 0) {
    return (
      <EmptyStudentList 
        message={searchTerm ? `Nenhum estudante encontrado para "${searchTerm}"` : undefined}
        searchTerm={searchTerm}
      />
    );
  }

  return (
    <div className="space-y-4">
      {searchTerm && (
        <p className="text-sm text-muted-foreground">
          {students.length} {students.length === 1 ? 'resultado' : 'resultados'} para "{searchTerm}"
          {totalCount !== undefined && totalCount > 0 && (
            <span> de {totalCount} estudantes</span>
          )}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedStudents.map((student) => (
          <StudentCard 
            key={student.id} 
            student={student} 
          />
        ))}
      </div>
      
      <StudentListPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StudentList;
