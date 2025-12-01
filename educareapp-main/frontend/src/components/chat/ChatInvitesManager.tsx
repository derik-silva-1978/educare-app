import React, { useState } from 'react';
import { useChatInvites } from '../../hooks/useChatInvites';
import { 
  MessageCircle, 
  Users, 
  Plus, 
  Check, 
  X, 
  Clock, 
  Send,
  UserPlus,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Loader2
} from 'lucide-react';

// Componente para criar novo convite
const CreateInviteForm: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const { createInvite, searchUsers, loading } = useChatInvites();
  const [formData, setFormData] = useState({
    invitee_email: '',
    team_name: '',
    team_description: '',
    message: ''
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (email: string) => {
    if (!email.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchUsers(email);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createInvite(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar convite:', error);
    }
  };

  const selectUser = (user: any) => {
    setFormData(prev => ({
      ...prev,
      invitee_email: user.email
    }));
    setSearchResults([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Criar Convite para Chat
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email do usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email do usuário
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.invitee_email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, invitee_email: e.target.value }));
                    handleSearch(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="usuario@exemplo.com"
                  required
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 animate-spin" />
                )}
              </div>
              
              {/* Resultados da busca */}
              {searchResults.length > 0 && (
                <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => selectUser(user)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nome do grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do grupo
              </label>
              <input
                type="text"
                value={formData.team_name}
                onChange={(e) => setFormData(prev => ({ ...prev, team_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Acompanhamento - Ana Clara"
                required
              />
            </div>

            {/* Descrição (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.team_description}
                onChange={(e) => setFormData(prev => ({ ...prev, team_description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Breve descrição do grupo..."
              />
            </div>

            {/* Mensagem personalizada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem (opcional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Mensagem personalizada para o convite..."
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Enviar Convite
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente principal de gerenciamento de convites
export const ChatInvitesManager: React.FC = () => {
  const {
    receivedInvites,
    sentInvites,
    pendingCount,
    loading,
    error,
    acceptInvite,
    declineInvite,
    cancelInvite,
    refreshInvites,
    clearError
  } = useChatInvites();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId);
      // Mostrar sucesso
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await declineInvite(inviteId);
      // Mostrar sucesso
    } catch (error) {
      console.error('Erro ao recusar convite:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceito';
      case 'declined':
        return 'Recusado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              Convites para Chat
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie convites para grupos de comunicação
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Criar Convite
          </button>
        </div>

        {/* Contador de pendentes */}
        {pendingCount > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                Você tem {pendingCount} convite{pendingCount > 1 ? 's' : ''} pendente{pendingCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('received')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Convites Recebidos ({receivedInvites.filter(i => i.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Convites Enviados ({sentInvites.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Conteúdo das tabs */}
      <div className="space-y-4">
        {activeTab === 'received' && (
          <>
            {receivedInvites.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum convite recebido
                </h3>
                <p className="text-gray-600">
                  Quando alguém te convidar para um grupo, aparecerá aqui.
                </p>
              </div>
            ) : (
              receivedInvites.map((invite) => (
                <div key={invite.id} className="bg-white rounded-lg shadow border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {invite.team?.name || 'Grupo de Comunicação'}
                        </h3>
                        {getStatusIcon(invite.status)}
                        <span className="text-sm text-gray-600">
                          {getStatusText(invite.status)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        Convite de: <span className="font-medium">
                          {invite.inviter?.profile?.first_name} {invite.inviter?.profile?.last_name}
                        </span>
                      </p>
                      
                      {invite.team?.description && (
                        <p className="text-gray-600 mb-2">
                          {invite.team.description}
                        </p>
                      )}
                      
                      {invite.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-gray-700 text-sm italic">
                            "{invite.message}"
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(invite.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    {invite.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleAcceptInvite(invite.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <Check className="h-4 w-4" />
                          Aceitar
                        </button>
                        <button
                          onClick={() => handleDeclineInvite(invite.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <X className="h-4 w-4" />
                          Recusar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'sent' && (
          <>
            {sentInvites.length === 0 ? (
              <div className="text-center py-12">
                <Send className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum convite enviado
                </h3>
                <p className="text-gray-600">
                  Clique em "Criar Convite" para convidar alguém para um grupo.
                </p>
              </div>
            ) : (
              sentInvites.map((invite) => (
                <div key={invite.id} className="bg-white rounded-lg shadow border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {invite.team?.name || 'Grupo de Comunicação'}
                        </h3>
                        {getStatusIcon(invite.status)}
                        <span className="text-sm text-gray-600">
                          {getStatusText(invite.status)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        Enviado para: <span className="font-medium">
                          {invite.invitee_id}
                        </span>
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(invite.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    {invite.status === 'pending' && (
                      <button
                        onClick={() => cancelInvite(invite.id)}
                        disabled={loading}
                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Modal de criar convite */}
      {showCreateForm && (
        <CreateInviteForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => refreshInvites()}
        />
      )}
    </div>
  );
};

export default ChatInvitesManager;
