import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WhatsAppMessage } from './WhatsAppChatContainer';
import { TitiNautaAvatar } from '../TitiNautaAvatar';
import { HelpCircle, CheckCircle, Lightbulb, Info, Sparkles } from 'lucide-react';

interface WhatsAppMessageBubbleProps {
  message: WhatsAppMessage;
}

const getMessageType = (content: string) => {
  if (content.includes('?')) return 'question';
  if (content.includes('Parabéns') || content.includes('Ótimo') || content.includes('Excelente')) return 'feedback';
  if (content.includes('atividade') || content.includes('exercício') || content.includes('brincadeira')) return 'activity';
  if (content.includes('vamos') || content.includes('começar') || content.includes('iniciar')) return 'intro';
  return 'default';
};

const getMessageIcon = (type: string) => {
  switch (type) {
    case 'question':
      return <HelpCircle className="w-3 h-3 text-blue-600" />;
    case 'feedback':
      return <CheckCircle className="w-3 h-3 text-green-600" />;
    case 'activity':
      return <Lightbulb className="w-3 h-3 text-orange-600" />;
    case 'intro':
      return <Sparkles className="w-3 h-3 text-purple-600" />;
    default:
      return <Info className="w-3 h-3 text-gray-600" />;
  }
};

const getMessageStyles = (type: string) => {
  switch (type) {
    case 'question':
      return 'bg-blue-50 border-l-4 border-blue-400 shadow-sm';
    case 'feedback':
      return 'bg-green-50 border-l-4 border-green-400 shadow-sm';
    case 'activity':
      return 'bg-orange-50 border-l-4 border-orange-400 shadow-sm';
    case 'intro':
      return 'bg-purple-50 border-l-4 border-purple-400 shadow-sm';
    default:
      return 'bg-white shadow-sm';
  }
};

const formatMessageContent = (content: string, childName: string) => {
  return content.replace(new RegExp(childName, 'gi'), `<strong>${childName}</strong>`);
};

export const WhatsAppMessageBubble: React.FC<WhatsAppMessageBubbleProps> = ({
  message
}) => {
  const isBot = message.type === 'bot';
  const messageType = isBot ? getMessageType(message.content) : 'user';
  const messageIcon = isBot ? getMessageIcon(messageType) : null;
  const messageStyles = isBot ? getMessageStyles(messageType) : '';
  
  // Extract child name from message for formatting (simplified approach)
  const childNameMatch = message.content.match(/\b[A-Z][a-z]+\b/);
  const childName = childNameMatch ? childNameMatch[0] : '';
  
  return (
    <div className={`flex mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      {isBot && (
        <div className="mr-3 mt-1 flex-shrink-0">
          <TitiNautaAvatar size="sm" mood="happy" />
        </div>
      )}
      
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 relative transition-all duration-200 hover:shadow-md
          ${isBot 
            ? `${messageStyles} rounded-tl-md` 
            : 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-tr-md shadow-md'
          }
        `}
      >
        {/* Message Header with Icon */}
        {isBot && messageIcon && (
          <div className="flex items-center gap-2 mb-2">
            {messageIcon}
            <div className="w-full h-px bg-gray-200"></div>
          </div>
        )}

        {/* Message Content */}
        <div 
          className={`text-sm leading-relaxed ${isBot ? 'text-gray-800' : 'text-white'}`}
          dangerouslySetInnerHTML={{
            __html: isBot ? formatMessageContent(message.content, childName) : message.content
          }}
        />

        {/* Timestamp and status */}
        <div className={`
          flex items-center justify-end gap-1 text-xs mt-2 
          ${isBot ? 'text-gray-500' : 'text-green-100'}
        `}>
          <span>{format(message.timestamp, 'HH:mm', { locale: ptBR })}</span>
          {!isBot && (
            <span className="text-xs">✓✓</span>
          )}
        </div>

        {/* Message Tail */}
        <div 
          className={`
            absolute top-2 w-0 h-0 
            ${isBot 
              ? `-left-2 border-r-8 ${messageType === 'question' ? 'border-r-blue-50' : 
                   messageType === 'feedback' ? 'border-r-green-50' : 
                   messageType === 'activity' ? 'border-r-orange-50' : 
                   messageType === 'intro' ? 'border-r-purple-50' : 'border-r-white'} border-t-8 border-t-transparent border-b-8 border-b-transparent`
              : '-right-2 border-l-8 border-l-green-500 border-t-8 border-t-transparent border-b-8 border-b-transparent'
            }
          `}
        />
      </div>
    </div>
  );
};