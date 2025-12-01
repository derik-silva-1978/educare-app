import { useState, useEffect, useMemo } from 'react';
import { Student } from './useStudents';
import { useDebounce } from '@/hooks/useDebounce';

export interface FilterState {
  minAge: string;
  maxAge: string;
  gradeLevels: string[];
  diagnosisFilter: 'all' | 'with' | 'without';
  diagnosisTypes: string[];
  therapies: string[];
  accommodations: string[];
  supportLevels: string[];
}

const defaultFilters: FilterState = {
  minAge: '',
  maxAge: '',
  gradeLevels: [],
  diagnosisFilter: 'all',
  diagnosisTypes: [],
  therapies: [],
  accommodations: [],
  supportLevels: []
};

const useStudentFilters = (students: Student[]) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.diagnosisTypes.length) count++;
    if (filters.gradeLevels.length) count++;
    if (filters.minAge || filters.maxAge) count++;
    if (filters.diagnosisFilter !== 'all') count++;
    if (filters.therapies.length) count++;
    if (filters.accommodations.length) count++;
    if (filters.supportLevels.length) count++;
    return count;
  }, [filters]);

  const getStudentDiagnosisTypes = (student: Student): string[] => {
    const types: string[] = [];
    
    if (student.diagnoses && student.diagnoses.length > 0) {
      student.diagnoses.forEach(d => types.push(d.type));
    } 
    else if (student.diagnosisType) {
      types.push(student.diagnosisType);
    }
    
    return types;
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      if (debouncedSearchTerm) {
        const searchValue = debouncedSearchTerm.toLowerCase();
        const diagnosisTypes = getStudentDiagnosisTypes(student);
        const diagnosisTypeStr = diagnosisTypes.join(' ').toLowerCase();
        
        const matchesSearch = 
          student.name.toLowerCase().includes(searchValue) ||
          student.guardianName.toLowerCase().includes(searchValue) ||
          student.gradeLevel.toLowerCase().includes(searchValue) ||
          diagnosisTypeStr.includes(searchValue);
        
        if (!matchesSearch) return false;
      }

      if (filters.diagnosisFilter === 'with' && !student.hasDiagnosis) return false;
      if (filters.diagnosisFilter === 'without' && student.hasDiagnosis) return false;

      if (filters.diagnosisTypes.length > 0) {
        if (!student.hasDiagnosis) return false;
        
        const studentDiagnosisTypes = getStudentDiagnosisTypes(student);
        if (studentDiagnosisTypes.length === 0) return false;
        
        const matchesDiagnosisType = studentDiagnosisTypes.some(type => 
          filters.diagnosisTypes.includes(type)
        );
        
        if (!matchesDiagnosisType) return false;
      }

      if (filters.gradeLevels.length > 0 && !filters.gradeLevels.includes(student.gradeLevel)) {
        return false;
      }

      if (filters.minAge && student.age < parseInt(filters.minAge)) return false;
      if (filters.maxAge && student.age > parseInt(filters.maxAge)) return false;

      if (filters.therapies.length > 0) {
        if (!student.therapies || student.therapies.length === 0) return false;
        
        const hasTherapy = filters.therapies.some(therapy => 
          student.therapies?.includes(therapy)
        );
        if (!hasTherapy) return false;
      }

      if (filters.accommodations.length > 0) {
        if (!student.accommodations || student.accommodations.length === 0) return false;
        
        const hasAccommodation = filters.accommodations.some(accommodation => 
          student.accommodations?.includes(accommodation)
        );
        if (!hasAccommodation) return false;
      }

      if (filters.supportLevels.length > 0) {
        if (!student.supportLevel) return false;
        if (!filters.supportLevels.includes(student.supportLevel)) return false;
      }

      return true;
    });
  }, [students, debouncedSearchTerm, filters]);

  return {
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredStudents,
    resetFilters,
    activeFilterCount,
    showFilters,
    setShowFilters
  };
};

export { useStudentFilters };
export default useStudentFilters;
