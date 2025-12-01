
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import StudentProfile from '@/components/smart-pei/students/StudentProfile';

const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <React.Fragment>
      <Helmet>
        <title>Perfil do Estudante | Smart PEI</title>
        <meta name="description" content="Detalhes e informações do estudante" />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 pt-12 pb-12">
          <StudentProfile studentId={id} />
        </div>
      </main>
    </React.Fragment>
  );
};

export default StudentProfilePage;
