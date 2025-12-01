import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface CelebrationProps {
  title: string;
  message: string;
  onComplete?: () => void;
}

const Celebration: React.FC<CelebrationProps> = ({ title, message, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Esconder automaticamente após 5 segundos
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="celebration">
      <div className="celebration-content">
        <div className="celebration-icon">
          <Trophy className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="celebration-title">{title}</h2>
        <p className="celebration-message">{message}</p>
      </div>
    </div>
  );
};

export default Celebration;
