import React from 'react';
import { MessageCircle, Clock, Users, Mail } from 'lucide-react';

interface WaitingForInviteProps {
  message?: string;
  showInstructions?: boolean;
  onRefresh?: () => void;
}

export const WaitingForInvite: React.FC<WaitingForInviteProps> = ({
  message = "O grupo de comunicação sobre 1 ainda não foi criado.",
  showInstructions = true,
  onRefresh
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* Ícone */}
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageCircle className="h-8 w-8 text-gray-600" />
      </div>

      {/* Título */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        Aguardando Convite
      </h3>

      {/* Mensagem */}
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>

      {showInstructions && (
        <>
          {/* Instruções */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-md">
            <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Um profissional criará o grupo de comunicação
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Você receberá um convite para participar
              </li>
            </ul>
          </div>

          {/* Botão de atualizar */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Verificar Convites
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default WaitingForInvite;
