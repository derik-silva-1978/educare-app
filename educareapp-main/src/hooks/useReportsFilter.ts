
import { useState, useCallback } from 'react';
import { Report, ReportFilters } from '@/types/report';

export function useReportsFilter(initialReports: Report[] = []) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [filteredReports, setFilteredReports] = useState<Report[]>(initialReports);
  
  // Handle search input
  const handleSearch = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm || null }));
    
    applyFilters();
  }, []);
  
  // Handle filter changes (type, status, date range)
  const handleFilterChange = useCallback((newFilters: Partial<ReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    applyFilters();
  }, []);
  
  // Apply all filters
  const applyFilters = useCallback(() => {
    let result = [...reports];
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(report => 
        report.title.toLowerCase().includes(searchTerm) ||
        (report.description?.toLowerCase().includes(searchTerm)) ||
        (report.studentName?.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by type
    if (filters.type) {
      result = result.filter(report => report.type === filters.type);
    }
    
    // Filter by status
    if (filters.status) {
      result = result.filter(report => report.status === filters.status);
    }
    
    // Filter by student
    if (filters.studentId) {
      result = result.filter(report => report.studentId === filters.studentId);
    }
    
    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          result = result.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate.toDateString() === now.toDateString();
          });
          break;
        case 'this-week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          
          result = result.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate >= weekStart;
          });
          break;
        case 'this-month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          
          result = result.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate >= monthStart;
          });
          break;
        case 'this-year':
          const yearStart = new Date(now.getFullYear(), 0, 1);
          
          result = result.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate >= yearStart;
          });
          break;
      }
    }
    
    setFilteredReports(result);
  }, [reports, filters]);
  
  return {
    reports,
    setReports,
    filters,
    filteredReports,
    handleSearch,
    handleFilterChange
  };
}

export default useReportsFilter;
