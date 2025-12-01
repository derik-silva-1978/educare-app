
import React, { useEffect, useRef } from 'react';
import { TitibotMessage } from './hooks/useTitibotChat';
import { cn } from '@/lib/utils';
import { Loader2, Bot, User, Zap } from 'lucide-react';
import { useTitibot } from './TitibotProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TitibotMessagesListProps {
  messages: TitibotMessage[];
  isLoading?: boolean;
}

const formatTime = (date: Date) => {
  return format(date, 'HH:mm', { locale: ptBR });
};

const TitibotMessagesList: React.FC<TitibotMessagesListProps> = ({ 
  messages,
  isLoading = false 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isPremium } = useTitibot();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div 
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex",
                message.isUser ? "justify-end" : "justify-start"
              )}
            >
              <div 
                className={cn(
                  "max-w-[85%] sm:max-w-[75%] rounded-xl p-3 shadow-sm flex gap-2",
                  message.isUser
                    ? "bg-primary text-primary-foreground ml-6"
                    : "bg-muted text-muted-foreground mr-6",
                  message.content === "..." && "animate-pulse"
                )}
              >
                <div className="flex-shrink-0 mt-1">
                  {message.isUser ? (
                    <div className="h-6 w-6 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center">
                      {isPremium ? (
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm break-words">
                    {message.content === "..." ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Gerando resposta{isPremium ? " turbo" : ""}...</span>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                  
                  <div className="mt-1 text-xs opacity-70 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default TitibotMessagesList;
