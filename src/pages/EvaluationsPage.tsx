
import React from 'react';
import { Helmet } from 'react-helmet-async';

const EvaluationsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Avaliações | Smart PEI</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Avaliações</h1>
        <p>Sistema de avaliações e diagnósticos.</p>
        {/* Evaluations content will go here */}
      </div>
    </>
  );
};

export default EvaluationsPage;
