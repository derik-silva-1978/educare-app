import { useState, useEffect } from 'react';
import { Diagnosis } from '@/types/diagnosis';

// Student interface
export interface Student {
  id: string;
  name: string;
  classroom?: string;
  age?: number;
  avatarUrl?: string;
  photoUrl?: string;
  hasDiagnosis?: boolean;
  diagnoses?: Diagnosis[];
  diagnosisType?: string;
  diagnosisCID?: string;
  diagnosisDate?: string;
  gradeLevel?: string;
  guardianName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  address?: string;
  city?: string;
  state?: string;
  birthDate?: string;
  gender?: string;
  schoolName?: string;
  teacherName?: string;
  schoolYear?: string;
  academicNotes?: string;
  supportLevel?: string;
  diagnosisNotes?: string;
  therapyNotes?: string;
  accommodations?: string[];
  medicationNotes?: string;
  therapies?: string[];
  schoolSupport?: boolean;
  medicationUse?: boolean;
  grade?: string; // For backward compatibility
  updatedAt?: string;
  createdAt?: string;
}

// Student form data interface
export interface StudentFormData {
  name: string;
  age?: number;
  classroom?: string;
  photoUrl?: string;
  gradeLevel?: string;
  guardianName?: string;
  hasDiagnosis?: boolean;
  diagnosisType?: string;
  diagnosisCID?: string;
  diagnosisDate?: string;
  diagnoses?: Diagnosis[];
  therapies?: string[];
  schoolSupport?: boolean;
  medicationUse?: boolean;
  birthDate?: string;
  gender?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  address?: string;
  city?: string;
  state?: string;
  schoolName?: string;
  teacherName?: string;
  schoolYear?: string;
  academicNotes?: string;
  supportLevel?: string;
  diagnosisNotes?: string;
  therapyNotes?: string;
  accommodations?: string[];
  medicationNotes?: string;
  grade?: string; // For backward compatibility
}

// Mock student data
const MOCK_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'João Pedro Santos',
    classroom: '3º Ano A',
    age: 9
  },
  {
    id: 's2',
    name: 'Ana Luiza Ferreira',
    classroom: '2º Ano B',
    age: 8
  },
  {
    id: 's3',
    name: 'Lucas Oliveira',
    classroom: '5º Ano C',
    age: 11
  },
  {
    id: 's4',
    name: 'Mariana Silva',
    classroom: '4º Ano A',
    age: 10
  },
  {
    id: 's5',
    name: 'Gabriel Almeida',
    classroom: '3º Ano B',
    age: 9
  }
];

export const useStudents = (initialFilter: string = '') => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(initialFilter);

  // Simulate API fetch
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter students if needed
        let filteredStudents = MOCK_STUDENTS;
        if (filter) {
          filteredStudents = MOCK_STUDENTS.filter(s => 
            s.name.toLowerCase().includes(filter.toLowerCase()) ||
            s.classroom?.toLowerCase().includes(filter.toLowerCase())
          );
        }
        
        setStudents(filteredStudents);
        setError(null);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [filter]);

  // Add compatibility methods for older code
  const getStudent = (id: string) => students.find(s => s.id === id);
  const loading = isLoading; // Alias for backward compatibility

  return {
    students,
    isLoading,
    loading, // For backward compatibility
    error,
    setFilter,
    getStudentById: (id: string) => students.find(s => s.id === id),
    getStudent, // For backward compatibility
    getStudents: () => students, // For backward compatibility
    saveStudent: (data: StudentFormData, id?: string) => {
      console.log("Mock save student:", data, id);
      return id || 'new-student-id';
    }
  };
};

export default useStudents;
