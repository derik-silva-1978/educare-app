import React, { useState } from 'react';
import { useTitiNautaBadges, Badge } from '@/hooks/useTitiNautaBadges';
import { Loader2, Medal, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BadgesGalleryProps {
  childId: string;
}

const BadgesGallery: React.FC<BadgesGalleryProps> = ({ childId }) => {
  const { badges, isLoading } = useTitiNautaBadges(childId);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  if (isLoading) {
    return (
      <div className="badges-loading">
        <Loader2 className="animate-spin h-5 w-5 text-primary" />
        <span>Carregando conquistas...</span>
      </div>
    );
  }

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  const closeBadgeDetails = () => {
    setSelectedBadge(null);
  };

  return (
    <div className="badges-gallery">
      <div className="badges-header">
        <div className="flex items-center gap-2">
          <Medal className="h-4 w-4 text-yellow-500" />
          <h3>Conquistas e Badges</h3>
        </div>
        <span className="badges-count">
          {unlockedBadges.length} de {badges.length}
        </span>
      </div>
      
      <div className="badges-content">
        {unlockedBadges.length === 0 ? (
          <div className="badges-empty">
            <p>Nenhuma conquista desbloqueada ainda.</p>
            <p className="badges-empty-hint">Continue respondendo perguntas para desbloquear conquistas!</p>
          </div>
        ) : (
          <div className="badges-grid">
            {unlockedBadges.map(badge => (
              <div 
                key={badge.id} 
                className="badge-item unlocked"
                onClick={() => handleBadgeClick(badge)}
              >
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-title">{badge.title}</div>
              </div>
            ))}
          </div>
        )}
        
        {lockedBadges.length > 0 && (
          <>
            <div className="badges-section-title">Próximas Conquistas</div>
            <div className="badges-grid">
              {lockedBadges.map(badge => (
                <div key={badge.id} className="badge-item locked">
                  <div className="badge-icon">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="badge-title">{badge.title}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {selectedBadge && (
        <div className="badge-details-overlay" onClick={closeBadgeDetails}>
          <div className="badge-details" onClick={e => e.stopPropagation()}>
            <div className="badge-details-icon">{selectedBadge.icon}</div>
            <h3 className="badge-details-title">{selectedBadge.title}</h3>
            <p className="badge-details-description">{selectedBadge.description}</p>
            {selectedBadge.unlockedAt && (
              <p className="badge-details-date">
                Conquistado em: {format(new Date(selectedBadge.unlockedAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </p>
            )}
            <button className="badge-details-close" onClick={closeBadgeDetails}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesGallery;
