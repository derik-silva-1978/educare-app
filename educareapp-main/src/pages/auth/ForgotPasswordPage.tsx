
import React from 'react';
import { Helmet } from 'react-helmet-async';

const ForgotPasswordPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Recuperar Senha | Educare+</title>
      </Helmet>
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold text-center">Recuperar Senha</h1>
        <p className="text-center mt-4">
          Digite seu e-mail para receber um link de recuperação de senha.
        </p>
        {/* Form would go here */}
      </div>
    </>
  );
};

export default ForgotPasswordPage;
