
import React from 'react';
import StudentPagination from './StudentPagination';

interface StudentListFooterProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  displayedItems: number;
  searchTerm?: string;
  totalCount?: number;
  onPageChange: (page: number) => void;
}

export const StudentListFooter: React.FC<StudentListFooterProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  displayedItems,
  searchTerm,
  totalCount,
  onPageChange
}) => {
  return (
    <div>
      {totalItems > itemsPerPage && (
        <StudentPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange} 
        />
      )}
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Exibindo {displayedItems} de {totalItems} alunos
        {searchTerm && totalItems !== totalCount && ` filtrados por "${searchTerm}"`}
      </div>
    </div>
  );
};

export default StudentListFooter;
