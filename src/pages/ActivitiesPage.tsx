
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import ActivityPlanningPage from './ActivityPlanningPage';
import ActivityDetailsPage from './ActivityDetailsPage';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TitibotProvider } from '@/components/smart-pei/titibot/TitibotProvider';

const ActivitiesPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  
  return (
    <TitibotProvider>
      <TooltipProvider>
        <Helmet>
          <title>{id ? 'Detalhes da Atividade' : 'Atividades'} | Smart PEI</title>
          <meta 
            name="description" 
            content={id ? 'Detalhes da atividade selecionada' : 'Gerenciamento de atividades do Smart PEI'} 
          />
        </Helmet>
        
        {id ? <ActivityDetailsPage /> : <ActivityPlanningPage />}
      </TooltipProvider>
    </TitibotProvider>
  );
};

export default ActivitiesPage;
