import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface WhatsAppChatContainerProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSendMessage?: (message: string) => void;
  onBack: () => void;
  childName?: string;
}

export const WhatsAppChatContainer: React.FC<WhatsAppChatContainerProps> = ({
  messages,
  isLoading = false,
  onSendMessage,
  onBack,
  childName = 'Criança'
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="font-semibold text-lg">TitiNauta</h2>
              <p className="text-xs text-green-50">Conversando sobre {childName}</p>
            </div>
          </div>
          <MessageCircle className="w-6 h-6 opacity-70" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-400">
            <div>
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Comece a conversa com o TitiNauta</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === 'bot'
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-green-500 text-white'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escreva sua resposta..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};
