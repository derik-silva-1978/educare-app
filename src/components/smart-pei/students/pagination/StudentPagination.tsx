
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface StudentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const StudentPagination: React.FC<StudentPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Handle page change
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {currentPage > 1 ? (
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)}
              className="cursor-pointer"
            />
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationPrevious 
              className="pointer-events-none opacity-50"
              aria-disabled="true"
              tabIndex={-1}
            />
          </PaginationItem>
        )}
        
        {/* First page */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => handlePageChange(1)}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}
        
        {/* Ellipsis */}
        {currentPage > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          // Create a window of 5 pages centered around the current page
          const pageNum = Math.min(
            Math.max(currentPage - 2, 1) + i,
            totalPages
          );
          
          // Skip rendering if outside the valid range or if we'd be rendering the first/last page which is handled separately
          if (
            pageNum < Math.max(currentPage - 2, 1) || 
            pageNum > Math.min(currentPage + 2, totalPages) ||
            (currentPage > 3 && pageNum === 1) ||
            (currentPage < totalPages - 2 && pageNum === totalPages)
          ) {
            return null;
          }
          
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink 
                onClick={() => handlePageChange(pageNum)}
                isActive={currentPage === pageNum}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        {/* Ellipsis */}
        {currentPage < totalPages - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {/* Last page */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {currentPage < totalPages ? (
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)}
              className="cursor-pointer"
            />
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationNext 
              className="pointer-events-none opacity-50"
              aria-disabled="true"
              tabIndex={-1}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default StudentPagination;
