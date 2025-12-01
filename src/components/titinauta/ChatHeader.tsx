import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  childName: string;
  ageRange: string;
  progress: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ childName, ageRange, progress }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="chat-header">
      <div className="header-top">
        <button 
          className="back-button" 
          onClick={handleBack}
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="avatar">
          <img 
            src="/assets/images/titinauta-avatar.png" 
            alt="TitiNauta" 
            className="avatar-image"
          />
        </div>
        
        <div className="chat-info">
          <h3 className="chat-title">TitiNauta</h3>
          <div className="chat-status">
            <span className="status-indicator"></span>
            <span className="status-text">online</span>
          </div>
          <div className="child-info">
            <span className="child-name">{childName}</span>
            <span className="age-range">{ageRange}</span>
          </div>
        </div>
      </div>
      
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ChatHeader;
