
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import TitibotAvatar from './TitibotAvatar';
import { formatTitibotMessage } from './TitibotUtils';

interface TitibotMessageProps {
  message: string;
  isBot: boolean;
  isTyping?: boolean;
  timestamp?: Date;
}

export const TitibotMessage: React.FC<TitibotMessageProps> = ({ 
  message, 
  isBot, 
  isTyping = false,
  timestamp
}) => {
  // Format timestamp if provided
  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <motion.div 
      className={cn(
        "flex gap-2 mb-3",
        !isBot && "flex-row-reverse"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isBot && (
        <div className="flex-shrink-0 mt-1">
          <TitibotAvatar size={24} />
        </div>
      )}
      
      <div className="flex flex-col max-w-[80%]">
        <div 
          className={cn(
            "rounded-2xl py-3 px-4",
            isBot 
              ? "bg-primary/10 text-foreground rounded-tl-sm" 
              : "bg-primary text-white rounded-tr-sm"
          )}
        >
          {isTyping ? (
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          ) : (
            <div 
              className="text-sm message-content" 
              dangerouslySetInnerHTML={{ 
                __html: isBot ? formatTitibotMessage(message) : message 
              }}
            />
          )}
        </div>
        
        {timestamp && (
          <div className={cn(
            "text-[10px] text-muted-foreground mt-1",
            !isBot && "self-end"
          )}>
            {formattedTime}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TitibotMessage;
