import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  Send, 
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';

// Componente de chat simples para teste
export const SimpleTeamChat: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages] = useState([
    {
      id: '1',
      user_name: 'Dr. João Silva',
      message: 'Olá! Como está o desenvolvimento da Ana Clara?',
      timestamp: '10:00'
    },
    {
      id: '2',
      user_name: 'Maria Santos',
      message: 'Oi doutor! Ela está se desenvolvendo bem. Ontem conseguiu empilhar 3 blocos!',
      timestamp: '10:05'
    },
    {
      id: '3',
      user_name: 'Dr. João Silva',
      message: 'Que ótimo! Isso é um marco importante para a idade dela.',
      timestamp: '10:07'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    console.log('Enviando mensagem:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header do chat */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Equipe Ana Clara</h3>
              <p className="text-sm text-gray-600">3 membros online</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Chamada de voz">
              <Phone className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Videochamada">
              <Video className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Mais opções">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-gray-600">
                {message.user_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">{message.user_name}</span>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-gray-800">{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input de mensagem */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite sua mensagem..."
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Aviso de teste */}
      <div className="bg-green-50 border-t border-green-200 p-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800 font-medium">
            ✅ Chat funcionando! Você está conectado à Equipe Ana Clara
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleTeamChat;
