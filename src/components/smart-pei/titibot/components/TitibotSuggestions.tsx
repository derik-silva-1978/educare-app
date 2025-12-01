
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface TitibotSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  show?: boolean;
}

const TitibotSuggestions: React.FC<TitibotSuggestionsProps> = ({ 
  suggestions, 
  onSuggestionClick,
  show = true
}) => {
  if (!show || !suggestions.length) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="px-3 py-2 space-y-2"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Sugestões</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs py-1 h-7 bg-muted/50 border-muted-foreground/20 text-muted-foreground"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TitibotSuggestions;
