import React from 'react';
import { useParams } from 'react-router-dom';
import TitiNautaChat from '@/components/titinauta/TitiNautaChat';
import ResponseHistory from '@/components/titinauta/ResponseHistory';
import BadgesGallery from '@/components/titinauta/BadgesGallery';
import ThemeSelector from '@/components/titinauta/ThemeSelector';
import ShareProgress from '@/components/titinauta/ShareProgress';
import { useJourneyContent } from '@/hooks/useJourneyContent';
import { useChildData } from '@/hooks/useChildData';
import { calculateAgeInMonths } from '@/utils/dateUtils';

// Importar estilos
import './TitiNautaPage.css';

const TitiNautaPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  
  // Buscar dados da criança
  const { child, isLoading: isLoadingChild } = useChildData(childId || '');
  
  // Calcular idade em meses
  const ageInMonths = child ? calculateAgeInMonths(child.birthDate) : 0;
  
  // Usar o hook real para buscar dados do backend
  const { journeyContent, isLoading: isLoadingJourney } = useJourneyContent(childId || '', ageInMonths);
  
  // Determinar estado de carregamento geral
  const isLoading = isLoadingChild || isLoadingJourney;
  
  // Calcular progresso baseado no número de passos
  const progress = journeyContent ? 50 : 0; // Valor fixo para demonstração
  
  // Adaptar o objeto child para o formato esperado pelo componente
  const adaptedChild = child ? {
    id: child.id,
    name: child.first_name + ' ' + (child.last_name || ''),
    birthDate: child.birthdate
  } : null;

  return (
    <div className="titinauta-page">
      <div className="titinauta-container">
        {/* Cabeçalho da página */}
        <div className="titinauta-header">
          <h1>TitiNauta - Acompanhamento de Desenvolvimento</h1>
          <p>Converse com o TitiNauta para acompanhar o desenvolvimento do seu bebê</p>
        </div>
        
        {/* Componente principal do chat */}
        <TitiNautaChat 
          childId={childId || ''}
          ageInMonths={ageInMonths}
          child={adaptedChild}
          journeyContent={journeyContent}
          isLoading={isLoading}
        />
        
        {/* Histórico de respostas */}
        {childId && <ResponseHistory childId={childId} />}
        
        {/* Galeria de conquistas */}
        {childId && <BadgesGallery childId={childId} />}
        
        {/* Seletor de temas */}
        {childId && <ThemeSelector childId={childId} />}
        
        {/* Compartilhar progresso */}
        {childId && adaptedChild && (
          <ShareProgress 
            childId={childId} 
            childName={adaptedChild.name} 
            ageInMonths={ageInMonths}
            progress={progress}
          />
        )}
        
        {/* Informações adicionais */}
        <div className="titinauta-info">
          <p>O TitiNauta usa inteligência artificial para ajudar no acompanhamento do desenvolvimento infantil.</p>
          <p>Responda às perguntas para receber orientações personalizadas.</p>
        </div>
      </div>
    </div>
  );
};

export default TitiNautaPage;
