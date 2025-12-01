
import React from 'react';
import { Helmet } from 'react-helmet-async';

const VerifyEmailPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Verificar Email | Educare+</title>
      </Helmet>
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold text-center">Verificar Email</h1>
        <p className="text-center mt-4">
          Verifique seu email para continuar.
        </p>
        {/* Verification status would go here */}
      </div>
    </>
  );
};

export default VerifyEmailPage;
