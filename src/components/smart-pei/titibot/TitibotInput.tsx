
import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Loader, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TitibotInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => void;
  handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  isPremium?: boolean;
}

const TitibotInput: React.FC<TitibotInputProps> = ({
  input,
  setInput,
  handleSubmit,
  handleKeyDown,
  isLoading = false,
  isPremium = false
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const defaultHandleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Use the provided handleKeyDown or the default one
  const onKeyDown = handleKeyDown || defaultHandleKeyDown;

  return (
    <div className="flex items-center gap-2 w-full relative">
      <input
        type="text"
        className={cn(
          "flex-grow rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2",
          isPremium ? "focus:ring-amber-300 pr-10" : "focus:ring-primary"
        )}
        placeholder={isPremium ? "Digite sua mensagem (modo Turbo)..." : "Digite sua mensagem..."}
        value={input}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        disabled={isLoading}
      />
      
      {isPremium && (
        <motion.div 
          className="absolute right-12 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none"
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 4 
          }}
        >
          <Sparkles size={16} />
        </motion.div>
      )}
      
      <Button 
        onClick={handleSubmit} 
        disabled={isLoading || !input.trim()} 
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full shadow-sm",
          isPremium ? "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600" : ""
        )}
        aria-label="Enviar mensagem"
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default TitibotInput;
