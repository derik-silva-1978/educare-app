
import { useState, useEffect } from 'react';
import { Student, StudentFormData } from './useStudents';
import { generateStudentId, getStoredStudent, updateStudentList } from '@/utils/student-utils';
import { generateDemoStudents } from '@/utils/demo-students';

const useStudentStorage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Load students from localStorage or create demo data on first load
  useEffect(() => {
    const loadStudents = () => {
      try {
        setLoading(true);
        const storedList = localStorage.getItem('student_list');
        
        if (storedList) {
          const studentList = JSON.parse(storedList);
          // Fetch full student data for each item in the list
          const fullStudentData = studentList.map((item: { id: string }) => {
            return getStoredStudent(item.id);
          }).filter(Boolean);
          
          // Convert old diagnosis format to new format if needed
          const updatedStudentData = fullStudentData.map((student: Student) => {
            if (student.diagnosisType && !student.diagnoses) {
              const diagnoses = [];
              if (student.diagnosisType) {
                diagnoses.push({
                  type: student.diagnosisType,
                  cid: student.diagnosisCID,
                  date: student.diagnosisDate
                });
              }
              return {
                ...student,
                diagnoses,
                // Keep these for backward compatibility
                diagnosisType: student.diagnosisType,
                diagnosisCID: student.diagnosisCID,
                diagnosisDate: student.diagnosisDate
              };
            }
            return student;
          });
          
          setStudents(updatedStudentData);
        } else {
          // For demo purposes, generate some sample students
          const demoStudents = generateDemoStudents();
          
          // Save demo students to localStorage
          demoStudents.forEach(student => {
            localStorage.setItem(`student_${student.id}`, JSON.stringify(student));
          });
          
          // Save student list
          localStorage.setItem('student_list', JSON.stringify(
            demoStudents.map(s => ({
              id: s.id,
              name: s.name,
              age: s.age,
              gradeLevel: s.gradeLevel,
              hasDiagnosis: s.hasDiagnosis,
              diagnosisType: s.diagnosisType,
              guardianName: s.guardianName,
              photoUrl: s.photoUrl,
              updatedAt: s.updatedAt
            }))
          ));
          
          setStudents(demoStudents);
        }
      } catch (error) {
        console.error('Error loading students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadStudents();
  }, []);

  // Get a specific student by ID
  const getStudent = (id: string): Student | undefined => {
    if (!id) return undefined;
    return students.find(student => student.id === id) || getStoredStudent(id);
  };

  // Add a new student
  const addStudent = (studentData: StudentFormData): Student => {
    const newId = generateStudentId();
    const timestamp = new Date().toISOString();
    
    // Handle backward compatibility
    let finalStudentData = {...studentData};
    
    // If student has diagnoses, set the legacy fields based on the first diagnosis
    if (finalStudentData.diagnoses && finalStudentData.diagnoses.length > 0) {
      const primaryDiagnosis = finalStudentData.diagnoses[0];
      finalStudentData.diagnosisType = primaryDiagnosis.type;
      finalStudentData.diagnosisCID = primaryDiagnosis.cid;
      finalStudentData.diagnosisDate = primaryDiagnosis.date;
    }
    
    const newStudent: Student = {
      ...finalStudentData,
      id: newId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    try {
      // Store full student data
      localStorage.setItem(`student_${newId}`, JSON.stringify(newStudent));
      
      // Update student list
      updateStudentList(newStudent);
      
      // Update state
      setStudents(prevStudents => [...prevStudents, newStudent]);
      
      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      throw new Error('Failed to add student');
    }
  };

  // Update an existing student
  const updateStudent = (id: string, studentData: Partial<Student>): Student => {
    if (!id) {
      throw new Error('Student ID is required for update');
    }
    
    const existingStudent = getStudent(id);
    
    if (!existingStudent) {
      throw new Error(`Student with ID ${id} not found`);
    }
    
    // Handle backward compatibility
    let finalStudentData = {...studentData};
    
    // If updating diagnoses, update the legacy fields based on the first diagnosis
    if (finalStudentData.diagnoses && finalStudentData.diagnoses.length > 0) {
      const primaryDiagnosis = finalStudentData.diagnoses[0];
      finalStudentData.diagnosisType = primaryDiagnosis.type;
      finalStudentData.diagnosisCID = primaryDiagnosis.cid;
      finalStudentData.diagnosisDate = primaryDiagnosis.date;
    }
    
    const updatedStudent: Student = {
      ...existingStudent,
      ...finalStudentData,
      updatedAt: new Date().toISOString()
    };
    
    try {
      // Store full student data
      localStorage.setItem(`student_${id}`, JSON.stringify(updatedStudent));
      
      // Update student list
      updateStudentList(updatedStudent);
      
      // Update state
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === id ? updatedStudent : student
        )
      );
      
      return updatedStudent;
    } catch (error) {
      console.error('Error updating student:', error);
      throw new Error('Failed to update student');
    }
  };

  // Delete a student
  const deleteStudent = (id: string) => {
    if (!id) return;
    
    try {
      // Remove from localStorage
      localStorage.removeItem(`student_${id}`);
      
      // Update student list
      const storedList = localStorage.getItem('student_list');
      if (storedList) {
        const studentList = JSON.parse(storedList);
        const updatedList = studentList.filter((student: { id: string }) => student.id !== id);
        localStorage.setItem('student_list', JSON.stringify(updatedList));
      }
      
      // Update state
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== id)
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw new Error('Failed to delete student');
    }
  };

  // Save student - handles both add and update
  const saveStudent = (studentData: StudentFormData, id?: string): string => {
    try {
      if (id) {
        // Update existing student
        const updated = updateStudent(id, studentData);
        return updated.id;
      } else {
        // Add new student
        const newStudent = addStudent(studentData);
        return newStudent.id;
      }
    } catch (error) {
      console.error('Error saving student:', error);
      throw error;
    }
  };

  return {
    students,
    loading,
    getStudent,
    addStudent,
    updateStudent,
    deleteStudent,
    saveStudent
  };
};

export default useStudentStorage;
