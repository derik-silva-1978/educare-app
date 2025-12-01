import React, { useState } from 'react';
import { Share2, Check, Copy, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import useTitiNautaBadges from '@/hooks/useTitiNautaBadges';
import { useToast } from '@/hooks/use-toast';

interface ShareProgressProps {
  childId: string;
  childName: string;
  ageInMonths: number;
  progress: number;
}

const ShareProgress: React.FC<ShareProgressProps> = ({ childId, childName, ageInMonths, progress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { badges } = useTitiNautaBadges(childId);
  const { toast } = useToast();
  const shareRef = React.useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleCopyLink = () => {
    const shareText = `Veja o progresso de ${childName} no TitiNauta! ${progress.toFixed(0)}% completo no módulo ${ageInMonths}-${ageInMonths+1} meses. Já conquistou ${badges.filter(b => b.unlocked).length} badges!`;
    
    navigator.clipboard.writeText(shareText)
      .then(() => {
        setIsCopied(true);
        toast({
          title: 'Texto copiado!',
          description: 'O texto de compartilhamento foi copiado para a área de transferência.',
          variant: 'default'
        });
        
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar texto:', err);
        toast({
          title: 'Erro ao copiar',
          description: 'Não foi possível copiar o texto para a área de transferência.',
          variant: 'destructive'
        });
      });
  };

  const handleDownloadImage = async () => {
    if (!shareRef.current) return;
    
    try {
      setIsDownloading(true);
      
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Melhor qualidade
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `titinauta-progresso-${childName}-${ageInMonths}m.png`;
      link.click();
      
      toast({
        title: 'Imagem salva!',
        description: 'A imagem do progresso foi salva com sucesso.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast({
        title: 'Erro ao salvar imagem',
        description: 'Não foi possível gerar a imagem do progresso.',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const unlockedBadges = badges.filter(badge => badge.unlocked);

  return (
    <div className="share-progress">
      <button 
        className="share-progress-button" 
        onClick={toggleOpen}
      >
        <Share2 className="h-4 w-4" />
        <span>Compartilhar Progresso</span>
      </button>
      
      {isOpen && (
        <div className="share-progress-modal">
          <div className="share-progress-header">
            <h3>Compartilhar Progresso</h3>
            <button 
              className="share-progress-close" 
              onClick={toggleOpen}
            >
              &times;
            </button>
          </div>
          
          <div className="share-progress-content">
            <div 
              ref={shareRef}
              className="share-progress-card"
            >
              <div className="share-progress-title">
                Progresso de {childName} no TitiNauta
              </div>
              
              <div className="share-progress-details">
                <div className="share-progress-module">
                  Módulo {ageInMonths}-{ageInMonths+1} meses
                </div>
                
                <div className="share-progress-bar-container">
                  <div className="share-progress-label">
                    Progresso: {progress.toFixed(0)}%
                  </div>
                  <div className="share-progress-bar">
                    <div 
                      className="share-progress-bar-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {unlockedBadges.length > 0 && (
                  <div className="share-progress-badges">
                    <div className="share-progress-badges-title">
                      Conquistas ({unlockedBadges.length}/{badges.length})
                    </div>
                    <div className="share-progress-badges-list">
                      {unlockedBadges.slice(0, 3).map(badge => (
                        <div key={badge.id} className="share-progress-badge">
                          <div className="share-progress-badge-icon">{badge.icon}</div>
                          <div className="share-progress-badge-name">{badge.title}</div>
                        </div>
                      ))}
                      {unlockedBadges.length > 3 && (
                        <div className="share-progress-badge-more">
                          +{unlockedBadges.length - 3} mais
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="share-progress-footer">
                  TitiNauta - Educare+ - {new Date().toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
            
            <div className="share-progress-actions">
              <button 
                className="share-progress-action-button"
                onClick={handleCopyLink}
                disabled={isCopied}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
              
              <button 
                className="share-progress-action-button"
                onClick={handleDownloadImage}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4" />
                <span>{isDownloading ? 'Salvando...' : 'Salvar Imagem'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareProgress;
