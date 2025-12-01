
import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsOfServicePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Termos de Serviço | Educare+</title>
      </Helmet>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold">Termos de Serviço</h1>
        <div className="mt-6 prose max-w-none">
          <p>
            Os termos e condições a seguir estabelecem os direitos e obrigações dos 
            usuários ao utilizar a plataforma Educare+.
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage;
