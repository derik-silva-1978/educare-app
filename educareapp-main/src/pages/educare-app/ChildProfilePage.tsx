
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const ChildProfilePage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  
  return (
    <>
      <Helmet>
        <title>Perfil da Criança | Educare+</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Perfil da Criança</h1>
        <p>ID da criança: {childId}</p>
        {/* Child profile content would go here */}
      </div>
    </>
  );
};

export default ChildProfilePage;
