
import React from 'react';
import { Helmet } from 'react-helmet-async';

const ResetPasswordPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Redefinir Senha | Educare+</title>
      </Helmet>
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold text-center">Redefinir Senha</h1>
        <p className="text-center mt-4">
          Crie uma nova senha para sua conta.
        </p>
        {/* Form would go here */}
      </div>
    </>
  );
};

export default ResetPasswordPage;
