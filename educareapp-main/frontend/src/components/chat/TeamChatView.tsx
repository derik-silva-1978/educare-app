import React, { useState, useEffect } from 'react';
import { WaitingForInvite } from './WaitingForInvite';
import { 
  MessageCircle, 
  Users, 
  Send, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  MoreVertical,
  Search,
  Info,
  Settings
} from 'lucide-react';

// Interfaces
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
}

interface UserTeam {
  id: string;
  name: string;
  description?: string;
  type: 'professional' | 'family' | 'mixed';
  members: TeamMember[];
  chat_active: boolean;
}

// Dados mockados para demonstração - simulando equipes do usuário logado
const mockUserTeams: UserTeam[] = [
  {
    id: '1',
    name: 'Equipe Ana Clara',
    description: 'Acompanhamento desenvolvimento - Ana Clara (2 anos)',
    type: 'family',
    members: [
      { id: '1', name: 'Dr. João Silva', email: 'joao@exemplo.com', role: 'professional', status: 'online' },
      { id: '2', name: 'Maria Santos', email: 'maria@exemplo.com', role: 'user', status: 'online' },
      { id: '3', name: 'Dra. Ana Costa', email: 'ana@exemplo.com', role: 'professional', status: 'away' }
    ],
    chat_active: true
  },
  {
    id: '2',
    name: 'Equipe Pedro Miguel',
    description: 'Suporte especializado - Pedro Miguel (15 meses)',
    type: 'professional',
    members: [
      { id: '1', name: 'Dr. João Silva', email: 'joao@exemplo.com', role: 'professional', status: 'online' },
      { id: '2', name: 'Maria Santos', email: 'maria@exemplo.com', role: 'user', status: 'online' },
      { id: '4', name: 'Dra. Carla Lima', email: 'carla@exemplo.com', role: 'professional', status: 'offline' }
    ],
    chat_active: true
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    user_id: '1',
    user_name: 'Dr. João Silva',
    message: 'Olá! Como está o desenvolvimento da Ana Clara?',
    timestamp: '2024-01-30T10:00:00Z',
    type: 'text'
  },
  {
    id: '2',
    user_id: '2',
    user_name: 'Maria Santos',
    message: 'Oi doutor! Ela está se desenvolvendo bem. Ontem conseguiu empilhar 3 blocos!',
    timestamp: '2024-01-30T10:05:00Z',
    type: 'text'
  },
  {
    id: '3',
    user_id: '1',
    user_name: 'Dr. João Silva',
    message: 'Que ótimo! Isso é um marco importante para a idade dela. Continue estimulando com as atividades que recomendei.',
    timestamp: '2024-01-30T10:07:00Z',
    type: 'text'
  },
  {
    id: '4',
    user_id: '3',
    user_name: 'Dra. Ana Costa',
    message: 'Concordo com o Dr. João. Vou enviar algumas atividades complementares que podem ajudar.',
    timestamp: '2024-01-30T10:10:00Z',
    type: 'text'
  }
];

// Componente de Chat Ativo
const ActiveTeamChat: React.FC<{ team: UserTeam }> = ({ team }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user_id: 'current_user',
      user_name: 'Você',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="flex h-full bg-white">
      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col">
        {/* Header do chat */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-600">
                  {team.members.filter(m => m.status === 'online').length} online de {team.members.length} membros
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMembers(!showMembers)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Ver membros"
              >
                <Users className="h-5 w-5 text-gray-600" />
              </button>
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
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
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
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Anexar arquivo"
            >
              <Paperclip className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite sua mensagem..."
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                title="Emoji"
              >
                <Smile className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar de membros */}
      {showMembers && (
        <div className="w-64 border-l border-gray-200 bg-gray-50">
          <div className="p-4">
            <h4 className="font-medium text-gray-900 mb-4">
              Membros ({team.members.length})
            </h4>
            
            <div className="space-y-3">
              {team.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-600 capitalize">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal
export const TeamChatView: React.FC = () => {
  // Para teste, vamos forçar o carregamento imediato das equipes
  const [userTeams] = useState<UserTeam[]>(mockUserTeams);
  const [selectedTeam] = useState<UserTeam | null>(mockUserTeams[0] || null);
  const [loading] = useState(false);

  console.log('TeamChatView renderizado - Equipes:', userTeams.length, 'Selecionada:', selectedTeam?.name);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando equipes...</p>
        </div>
      </div>
    );
  }

  // Se não há equipes, mostrar tela de aguardando convite
  if (userTeams.length === 0) {
    console.log('Nenhuma equipe encontrada, mostrando WaitingForInvite');
    return (
      <WaitingForInvite 
        message="Você ainda não faz parte de nenhuma equipe de comunicação."
        showInstructions={true}
      />
    );
  }

  console.log('Renderizando chat - Equipes encontradas:', userTeams.length, 'Equipe selecionada:', selectedTeam?.name);

  return (
    <div className="h-full flex flex-col">
      {/* Seletor de equipes (se houver múltiplas) */}
      {userTeams.length > 1 && (
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <select
              value={selectedTeam?.id || ''}
              onChange={(e) => {
                console.log('Selecionando equipe:', e.target.value);
                // Para teste, vamos manter a equipe fixa
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {userTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Chat da equipe selecionada */}
      <div className="flex-1">
        {selectedTeam ? (
          <ActiveTeamChat team={selectedTeam} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-600">Selecione uma equipe para conversar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamChatView;
