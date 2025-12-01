
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const AssessmentDetailsPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  
  return (
    <>
      <Helmet>
        <title>Detalhes da Avaliação | Educare+</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Detalhes da Avaliação</h1>
        <p>ID da avaliação: {assessmentId}</p>
        {/* Assessment details content would go here */}
      </div>
    </>
  );
};

export default AssessmentDetailsPage;
