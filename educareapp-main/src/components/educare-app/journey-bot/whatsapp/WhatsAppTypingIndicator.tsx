import React from 'react';
import { TitiNautaAvatar } from '../TitiNautaAvatar';

export const WhatsAppTypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="mr-3 mt-1 flex-shrink-0">
        <TitiNautaAvatar size="sm" mood="thinking" />
      </div>
      
      <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-md relative border border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-medium">TitiNauta está digitando</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '400ms' }}></div>
          </div>
        </div>
        
        {/* Message Tail */}
        <div className="absolute top-2 -left-2 w-0 h-0 border-r-8 border-r-white border-t-8 border-t-transparent border-b-8 border-b-transparent" />
      </div>
    </div>
  );
};