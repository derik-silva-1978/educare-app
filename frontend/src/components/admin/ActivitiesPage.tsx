import React from 'react';
import { AdminActivities } from './AdminActivities';

export const ActivitiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Atividades</h1>
          <p className="mt-2 text-gray-600">
            Gerencie atividades educacionais para diferentes faixas etárias e categorias de desenvolvimento.
          </p>
        </div>
        
        <AdminActivities />
      </div>
    </div>
  );
};
