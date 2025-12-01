
import React, { useState } from 'react';
import CourseCard from '@/components/learning/course/CourseCard';
import CourseFilters from '@/components/learning/course/CourseFilters';

const CourseCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    {
      id: '1',
      title: 'Desenvolvimento Infantil: 0-2 Anos',
      description: 'Compreenda os marcos fundamentais do desenvolvimento nos primeiros anos de vida.',
      instructor: 'Dra. Maria Santos',
      rating: 4.8,
      students: 1234,
      duration: '8 horas',
      category: 'Desenvolvimento Infantil',
      level: 'Iniciante',
      price: 'R$ 199,00',
      image: '/images/course-desenvolvimento.jpg'
    },
    {
      id: '2',
      title: 'Tecnologia na Educação Infantil',
      description: 'Explore ferramentas digitais seguras e educativas para crianças.',
      instructor: 'Prof. João Silva',
      rating: 4.6,
      students: 856,
      duration: '6 horas',
      category: 'Tecnologia Educacional',
      level: 'Intermediário',
      price: 'R$ 149,00',
      image: '/images/course-tecnologia.jpg'
    },
    {
      id: '3',
      title: 'Arte e Criatividade na Primeira Infância',
      description: 'Desenvolva atividades artísticas estimulantes para crianças pequenas.',
      instructor: 'Ana Carolina',
      rating: 4.9,
      students: 2156,
      duration: '5 horas',
      category: 'Arte & Criatividade',
      level: 'Iniciante',
      price: 'R$ 129,00',
      image: '/images/course-arte.jpg'
    },
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Cursos</h1>
        <p className="text-gray-600">Descubra cursos especializados em desenvolvimento infantil e educação</p>
      </div>

      <CourseFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseCatalog;
