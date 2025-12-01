
import React from 'react';
import { Helmet } from 'react-helmet-async';

const ReportGeneratorPage: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Gerador de Relatórios | Smart PEI</title>
        <meta name="description" content="Crie relatórios personalizados a partir dos dados do Smart PEI" />
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Gerador de Relatórios</h1>
        <p>Interface de geração de relatórios personalizados.</p>
      </div>
    </React.Fragment>
  );
};

export default ReportGeneratorPage;
