import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChildData } from '@/hooks/useChildData';
import { useJourneyContent } from '@/hooks/useJourneyContent';
import { calculateAgeInMonths } from '@/utils/dateUtils';
import TitiNautaChat from '@/components/titinauta/TitiNautaChat';
import ResponseHistory from '@/components/titinauta/ResponseHistory';
import BadgesGallery from '@/components/titinauta/BadgesGallery';
import ThemeSelector from '@/components/titinauta/ThemeSelector';
import ShareProgress from '@/components/titinauta/ShareProgress';
import { Button } from '@/components/ui/button';
import { Bot, ArrowLeft } from 'lucide-react';
import mediaJourneyContent from '@/data/titinauta-media-demo';

/**
 * Página do TitiNauta com recursos multimídia
 * Esta página usa o conteúdo de demonstração com recursos multimídia
 */
const TitiNautaMediaPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { child, isLoading: isLoadingChild } = useChildData(childId || '');
  
  // Calcular idade em meses
  const ageInMonths = child ? calculateAgeInMonths(child.birthDate) : 0;
  
  // Usar o conteúdo de demonstração com recursos multimídia
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Simular progresso
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev < 50) return prev + 5;
        return prev;
      });
    }, 500);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);
  
  // Adaptar o objeto child para o formato esperado pelo componente
  const adaptedChild = child ? {
    id: child.id,
    name: child.first_name + ' ' + (child.last_name || ''),
    birthDate: child.birthdate
  } : null;

  return (
    <div className="titinauta-page">
      <div className="titinauta-header bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/educare-app/children')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Bot className="h-6 w-6" /> TitiNauta 2.0
            </h1>
            <p className="text-sm opacity-90">Versão com recursos multimídia</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm bg-white/20 px-2 py-1 rounded">
            Versão Demo
          </span>
        </div>
      </div>
      
      <div className="titinauta-container p-4 md:p-6">
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <h2 className="font-medium mb-2 flex items-center gap-2">
            <Bot className="h-5 w-5" /> Demonstração de Recursos Multimídia
          </h2>
          <p className="text-sm">
            Esta é uma versão de demonstração do TitiNauta com recursos multimídia. 
            Você verá imagens, vídeos e áudios durante a conversa. 
            Esta versão usa dados fictícios para demonstração.
          </p>
        </div>
        
        <TitiNautaChat 
          childId={childId || ''}
          ageInMonths={ageInMonths}
          child={adaptedChild}
          journeyContent={mediaJourneyContent}
          isLoading={isLoading || isLoadingChild}
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
        <div className="titinauta-info mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-2">Sobre o TitiNauta 2.0</h3>
          <p className="text-sm text-gray-600 mb-2">
            O TitiNauta 2.0 é uma evolução do assistente virtual para acompanhamento do desenvolvimento infantil.
            Agora com recursos multimídia para uma experiência mais rica e interativa.
          </p>
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/educare-app/titinauta-media-demo')}
            >
              Ver Demonstração Completa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitiNautaMediaPage;
