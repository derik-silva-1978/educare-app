
import React from 'react';
import { useTitibotChat } from '../hooks/useTitibotChat';
import TitibotInput from '../TitibotInput';
import TitibotMessagesList from '../TitibotMessagesList';
import TitibotSuggestions from './TitibotSuggestions';
import TitibotTurboPromo from './TitibotTurboPromo';
import { useTitibotSuggestions } from '../hooks/useTitibotSuggestions';
import { useTitibot } from '../TitibotProvider';
import TitibotPremiumIndicator from './TitibotPremiumIndicator';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const TitibotChatTab: React.FC = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    handleSend,
    handleKeyDown,
    sendPrompt,
    isLoading
  } = useTitibotChat();
  
  const { suggestions } = useTitibotSuggestions();
  const { isPremium } = useTitibot();

  return (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-2 px-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          Conversa
          {isPremium && (
            <motion.div 
              className="ml-1.5 text-xs text-amber-600 flex items-center gap-1"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Shield className="h-3 w-3" />
              (Turbo)
            </motion.div>
          )}
        </h3>
        <TitibotPremiumIndicator isPremium={isPremium} />
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <TitibotMessagesList messages={messages} isLoading={isLoading} />
      </div>
      
      <div className="mt-auto border-t border-gray-100">
        <TitibotSuggestions 
          suggestions={suggestions} 
          onSuggestionClick={sendPrompt} 
          show={messages.length > 0} 
        />
        
        {!isPremium && <TitibotTurboPromo />}
      </div>
      
      <div className="p-2 border-t border-gray-200 bg-gray-50/50">
        <TitibotInput 
          input={inputMessage}
          setInput={setInputMessage}
          handleSubmit={handleSend}
          handleKeyDown={handleKeyDown}
          isLoading={isLoading}
          isPremium={isPremium}
        />
      </div>
    </motion.div>
  );
};

export default TitibotChatTab;
