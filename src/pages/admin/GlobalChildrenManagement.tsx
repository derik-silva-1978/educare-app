import React from 'react';
import { Helmet } from 'react-helmet-async';
import GlobalChildrenManagement from '@/components/educare-app/admin/GlobalChildrenManagement';

const GlobalChildrenManagementPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Gestão de Crianças | Educare+ Admin</title>
        <meta name="description" content="Módulo administrativo para gestão global de crianças, visualização de grupos e acompanhamento de desenvolvimento" />
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <GlobalChildrenManagement />
      </div>
    </>
  );
};

export default GlobalChildrenManagementPage;
