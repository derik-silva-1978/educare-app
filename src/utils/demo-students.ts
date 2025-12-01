
import { Student } from '@/hooks/useStudents';
import { DiagnosisType } from '@/types/diagnosis';

// Generate some demo students with detailed information
export const DEMO_STUDENTS: Student[] = [
  {
    id: 'student-001',
    name: 'João Pedro Silva',
    age: 9,
    birthDate: '2015-03-15',
    gender: 'male',
    classroom: '3º Ano A',
    hasDiagnosis: true,
    diagnoses: [
      {
        type: 'autism' as DiagnosisType,
        cid: 'F84.0',
        date: '2018-11-10'
      }
    ],
    diagnosisNotes: 'Apresenta comprometimento moderado na interação social e comunicação verbal.',
    supportLevel: 'moderate',
    guardianName: 'Maria Silva',
    guardianRelationship: 'Mãe',
    guardianPhone: '(11) 98765-4321',
    guardianEmail: 'maria.silva@email.com',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    schoolName: 'Escola Municipal Paulo Freire',
    teacherName: 'Ana Cristina Santos',
    schoolYear: '2024',
    academicNotes: 'Está progredindo na alfabetização e demonstra interesse particular por matemática.',
    therapies: ['speech', 'occupational', 'psychological'],
    therapyNotes: 'Frequenta terapia ocupacional semanalmente. Terapia de fala duas vezes por semana.',
    accommodations: ['extended_time', 'simplified_instructions', 'visual_supports'],
    schoolSupport: true,
    medicationUse: true,
    medicationNotes: 'Risperidona 0,5mg 1x ao dia',
    photoUrl: '/img/avatar1.png'
  },
  {
    id: 'student-002',
    name: 'Ana Luiza Ferreira',
    age: 8,
    birthDate: '2016-07-22',
    gender: 'female',
    classroom: '2º Ano B',
    hasDiagnosis: true,
    diagnoses: [
      {
        type: 'adhd' as DiagnosisType,
        cid: 'F90.0',
        date: '2020-03-15'
      },
      {
        type: 'dyslexia' as DiagnosisType,
        date: '2021-05-10'
      }
    ],
    diagnosisNotes: 'Apresenta dificuldade de concentração e hiperatividade moderada. Dificuldades na leitura foram identificadas posteriormente.',
    supportLevel: 'moderate',
    guardianName: 'Roberto Ferreira',
    guardianRelationship: 'Pai',
    guardianPhone: '(11) 91234-5678',
    guardianEmail: 'roberto.ferreira@email.com',
    address: 'Av. Paulista, 1578, Apto 302',
    city: 'São Paulo',
    state: 'SP',
    schoolName: 'Colégio Objetivo',
    teacherName: 'Márcia Rodrigues',
    schoolYear: '2024',
    academicNotes: 'Demonstra grande criatividade em artes. Precisa de apoio extra em português.',
    therapies: ['psychological', 'pedagogical'],
    therapyNotes: 'Tem sessões de psicoterapia semanais e acompanhamento pedagógico 2x por semana.',
    accommodations: ['preferential_seating', 'extended_time', 'oral_instructions'],
    schoolSupport: true,
    medicationUse: true,
    medicationNotes: 'Metilfenidato 10mg pela manhã antes da escola',
    photoUrl: '/img/avatar2.png'
  },
  {
    id: 'student-003',
    name: 'Lucas Oliveira',
    age: 11,
    birthDate: '2013-01-30',
    gender: 'male',
    classroom: '5º Ano C',
    hasDiagnosis: true,
    diagnoses: [
      {
        type: 'intellectual_disability' as DiagnosisType,
        cid: 'F70',
        date: '2017-08-12'
      }
    ],
    diagnosisNotes: 'Deficiência intelectual leve. Apresenta desenvolvimento mais lento em relação aos colegas.',
    supportLevel: 'high',
    guardianName: 'Claudia Oliveira',
    guardianRelationship: 'Mãe',
    guardianPhone: '(11) 97777-8888',
    guardianEmail: 'claudia.oliveira@email.com',
    address: 'Rua Ipiranga, 450',
    city: 'Guarulhos',
    state: 'SP',
    schoolName: 'Escola Estadual Castro Alves',
    teacherName: 'Paulo Mendes',
    schoolYear: '2024',
    academicNotes: 'Responde bem a atividades práticas. Precisa de mediação constante nas tarefas escolares.',
    therapies: ['occupational', 'speech', 'pedagogical'],
    therapyNotes: 'Acompanhamento com psicopedagoga duas vezes por semana. Terapia ocupacional uma vez por semana.',
    accommodations: ['curricular_adaptations', 'simplified_assessments', 'visual_supports'],
    schoolSupport: true,
    medicationUse: false,
    medicationNotes: '',
    photoUrl: '/img/avatar3.png'
  },
  {
    id: 'student-004',
    name: 'Mariana Santos',
    age: 7,
    classroom: '1º Ano A',
    hasDiagnosis: true,
    diagnoses: [
      {
        type: 'hearing_impairment' as DiagnosisType,
        date: '2020-10-05'
      }
    ],
    guardianName: 'José Santos',
    supportLevel: 'moderate',
    therapies: ['speech'],
    accommodations: ['preferential_seating', 'visual_supports'],
    schoolSupport: true,
    medicationUse: false
  },
  {
    id: 'student-005',
    name: 'Gabriel Almeida',
    age: 10,
    classroom: '4º Ano B',
    hasDiagnosis: true,
    diagnoses: [
      {
        type: 'autism' as DiagnosisType,
        cid: 'F84.5',
        date: '2018-05-22'
      }
    ],
    guardianName: 'Patricia Almeida',
    supportLevel: 'high',
    therapies: ['occupational', 'speech', 'psychological', 'art'],
    accommodations: ['sensory_breaks', 'visual_supports', 'noise_cancelling'],
    schoolSupport: true,
    medicationUse: true
  }
];

// Add the missing export function
export const generateDemoStudents = (): Student[] => {
  return DEMO_STUDENTS.map(student => ({
    ...student,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

export default DEMO_STUDENTS;
