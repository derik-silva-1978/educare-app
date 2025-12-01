
import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade | Educare+</title>
      </Helmet>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold">Política de Privacidade</h1>
        <div className="mt-6 prose max-w-none">
          <p>
            Esta política de privacidade descreve como a Educare+ coleta, usa e 
            protege seus dados pessoais.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
