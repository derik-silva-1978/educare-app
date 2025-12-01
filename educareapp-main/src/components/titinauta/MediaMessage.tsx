import React, { useState } from 'react';
import { Image as ImageIcon, X, Maximize2, Minimize2 } from 'lucide-react';

interface MediaMessageProps {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  caption?: string;
  isBot?: boolean;
}

const MediaMessage: React.FC<MediaMessageProps> = ({
  type,
  src,
  alt = 'Mídia',
  caption,
  isBot = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`media-message ${isBot ? 'bot-media' : 'user-media'}`}>
      <div className="media-container">
        {isLoading && (
          <div className="media-loading">
            <div className="media-loading-spinner"></div>
            <span>Carregando...</span>
          </div>
        )}
        
        {hasError && (
          <div className="media-error">
            <ImageIcon className="h-8 w-8 text-red-500" />
            <span>Não foi possível carregar a mídia</span>
          </div>
        )}
        
        {type === 'image' && (
          <img 
            src={src} 
            alt={alt}
            className={`media-image ${isExpanded ? 'expanded' : ''} ${isLoading ? 'hidden' : ''}`}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
        
        {type === 'video' && (
          <video 
            src={src}
            className={`media-video ${isExpanded ? 'expanded' : ''} ${isLoading ? 'hidden' : ''}`}
            controls
            onLoadedData={handleLoad}
            onError={handleError}
          />
        )}
        
        {!isLoading && !hasError && (
          <div className="media-controls">
            <button 
              className="media-control-button"
              onClick={toggleExpand}
              aria-label={isExpanded ? 'Minimizar' : 'Expandir'}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            
            {isExpanded && (
              <button 
                className="media-control-button close"
                onClick={toggleExpand}
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {caption && (
        <div className="media-caption">
          {caption}
        </div>
      )}
    </div>
  );
};

export default MediaMessage;
