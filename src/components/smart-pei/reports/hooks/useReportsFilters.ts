
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Report, ReportFilters } from '@/types/report';

export const useReportsFilters = (initialReports: Report[]) => {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [filters, setFilters] = useState<ReportFilters>({
    type: null,
    status: null,
    studentId: null,
    dateRange: null,
    search: null,
  });
  const [filteredReports, setFilteredReports] = useState<Report[]>(initialReports);

  // Update original reports if initialReports changes
  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  // Apply filters to reports
  const applyFilters = useCallback(() => {
    let result = [...reports];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(report => 
        report.title.toLowerCase().includes(searchLower) || 
        (report.studentName && report.studentName.toLowerCase().includes(searchLower)) ||
        (report.description && report.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter(report => report.type === filters.type);
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(report => report.status === filters.status);
    }

    // Apply student filter
    if (filters.studentId) {
      result = result.filter(report => report.studentId === filters.studentId);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      result = result.filter(report => {
        const reportDate = new Date(report.date);
        if (filters.dateRange === 'today') {
          return reportDate.toDateString() === now.toDateString();
        }
        if (filters.dateRange === 'week') {
          return reportDate >= lastWeek;
        }
        if (filters.dateRange === 'month') {
          return reportDate >= lastMonth;
        }
        return true;
      });
    }

    setFilteredReports(result);
  }, [reports, filters]);

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle search changes
  const handleSearch = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm || null }));
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<ReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      type: null,
      status: null,
      studentId: null,
      dateRange: null,
      search: null,
    });
  }, []);

  return {
    reports,
    filteredReports,
    filters,
    setFilters,
    handleSearch,
    handleFilterChange,
    resetFilters,
    searchTerm: filters.search || '',
    setSearchTerm: (term: string) => handleSearch(term)
  };
};

export default useReportsFilters;
