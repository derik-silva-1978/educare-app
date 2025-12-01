
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const AssessmentViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <React.Fragment>
      <Helmet>
        <title>Visualizar Avaliação | Smart PEI</title>
        <meta name="description" content="Visualize e analise avaliações de alunos no Smart PEI" />
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Avaliação #{id}</h1>
        <p>Conteúdo da avaliação será exibido aqui.</p>
      </div>
    </React.Fragment>
  );
};

export default AssessmentViewPage;
