import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Message } from '@/types/titinauta';
import MediaMessage from './MediaMessage';
import AudioMessage from './AudioMessage';

interface ChatMessageProps {
  message: Message;
  isBot: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot }) => {
  // Formatar hora da mensagem
  const formattedTime = format(new Date(message.timestamp), 'HH:mm', { locale: ptBR });
  
  // Verificar se é uma mensagem de mídia
  if (message.media) {
    switch (message.media.type) {
      case 'image':
        return (
          <MediaMessage 
            type="image"
            src={message.media.url}
            alt={message.media.alt || 'Imagem'}
            caption={message.content}
            isBot={isBot}
          />
        );
      case 'video':
        return (
          <MediaMessage 
            type="video"
            src={message.media.url}
            alt={message.media.alt || 'Vídeo'}
            caption={message.content}
            isBot={isBot}
          />
        );
      case 'audio':
        return (
          <AudioMessage 
            src={message.media.url}
            caption={message.content}
            isBot={isBot}
          />
        );
      default:
        // Caso não reconheça o tipo de mídia, exibe como mensagem normal
        break;
    }
  }

  // Mensagem de texto padrão
  return (
    <div className={`chat-message ${isBot ? 'bot-message' : 'user-message'}`}>
      {isBot && (
        <div className="message-avatar">
          <img 
            src="/assets/images/titinauta-avatar.png" 
            alt="TitiNauta" 
            className="avatar-image-small"
          />
        </div>
      )}
      
      <div className="message-content">
        <div className="message-bubble">
          {message.content}
        </div>
        <div className="message-time">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
