import React, { useState } from 'react';
import { useChatInvites } from '../../hooks/useChatInvites';
import { 
  Bell, 
  MessageCircle, 
  Check, 
  X, 
  Users,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';

interface ChatInviteNotificationProps {
  className?: string;
  showInline?: boolean;
}

export const ChatInviteNotification: React.FC<ChatInviteNotificationProps> = ({
  className = '',
  showInline = false
}) => {
  const {
    receivedInvites,
    pendingCount,
    acceptInvite,
    declineInvite,
    loading
  } = useChatInvites();

  const [isExpanded, setIsExpanded] = useState(false);

  const pendingInvites = receivedInvites.filter(invite => invite.status === 'pending');

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId);
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await declineInvite(inviteId);
    } catch (error) {
      console.error('Erro ao recusar convite:', error);
    }
  };

  if (pendingCount === 0) {
    return null;
  }

  if (showInline) {
    // Versão inline para dashboard
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">
                {pendingCount} convite{pendingCount > 1 ? 's' : ''} para chat
              </h4>
              <p className="text-sm text-blue-700">
                Você tem convites pendentes para grupos de comunicação
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-blue-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-blue-600" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {pendingInvites.slice(0, 3).map((invite) => (
              <div key={invite.id} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 text-sm">
                      {invite.team?.name || 'Grupo de Comunicação'}
                    </h5>
                    <p className="text-xs text-gray-600 mt-1">
                      De: {invite.inviter?.profile?.first_name} {invite.inviter?.profile?.last_name}
                    </p>
                    {invite.message && (
                      <p className="text-xs text-gray-600 mt-1 italic">
                        "{invite.message}"
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleAcceptInvite(invite.id)}
                      disabled={loading}
                      className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                      title="Aceitar"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeclineInvite(invite.id)}
                      disabled={loading}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                      title="Recusar"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {pendingInvites.length > 3 && (
              <p className="text-xs text-blue-600 text-center">
                +{pendingInvites.length - 3} convite{pendingInvites.length - 3 > 1 ? 's' : ''} a mais
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Versão dropdown para header/navbar
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              Convites para Chat ({pendingCount})
            </h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium text-gray-900 text-sm">
                        {invite.team?.name || 'Grupo de Comunicação'}
                      </h4>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-1">
                      De: {invite.inviter?.profile?.first_name} {invite.inviter?.profile?.last_name}
                    </p>
                    
                    {invite.message && (
                      <p className="text-xs text-gray-600 mb-2 italic">
                        "{invite.message}"
                      </p>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(invite.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleAcceptInvite(invite.id)}
                      disabled={loading}
                      className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                      title="Aceitar"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeclineInvite(invite.id)}
                      disabled={loading}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                      title="Recusar"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todos os convites
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInviteNotification;
