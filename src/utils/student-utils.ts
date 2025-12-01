
import { Student } from '@/hooks/useStudents';

// Generate a unique ID for a new student
export const generateStudentId = (): string => {
  return `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Get a stored student from localStorage
export const getStoredStudent = (id: string): Student | undefined => {
  try {
    const student = localStorage.getItem(`student_${id}`);
    return student ? JSON.parse(student) : undefined;
  } catch (error) {
    console.error('Error retrieving student:', error);
    return undefined;
  }
};

// Update the student list in localStorage
export const updateStudentList = (student: Student): void => {
  try {
    const storedList = localStorage.getItem('student_list');
    const studentList = storedList ? JSON.parse(storedList) : [];
    
    // Check if student already exists in list
    const existingIndex = studentList.findIndex((s: { id: string }) => s.id === student.id);
    
    if (existingIndex >= 0) {
      // Update existing entry
      studentList[existingIndex] = {
        id: student.id,
        name: student.name,
        age: student.age,
        grade: student.grade,
        gradeLevel: student.gradeLevel,
        hasDiagnosis: student.hasDiagnosis,
        diagnosisType: student.diagnosisType,
        guardianName: student.guardianName,
        photoUrl: student.photoUrl,
        updatedAt: student.updatedAt
      };
    } else {
      // Add new entry
      studentList.push({
        id: student.id,
        name: student.name,
        age: student.age,
        grade: student.grade,
        gradeLevel: student.gradeLevel,
        hasDiagnosis: student.hasDiagnosis,
        diagnosisType: student.diagnosisType,
        guardianName: student.guardianName,
        photoUrl: student.photoUrl,
        updatedAt: student.updatedAt
      });
    }
    
    localStorage.setItem('student_list', JSON.stringify(studentList));
  } catch (error) {
    console.error('Error updating student list:', error);
  }
};
