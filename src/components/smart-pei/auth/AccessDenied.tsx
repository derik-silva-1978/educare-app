
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/auth';
import type { Permission } from '@/hooks/usePermissions';

interface AccessDeniedProps {
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  requiredRoles = [], 
  requiredPermissions = [],
  message,
  showBackButton = true,
  showHomeButton = true
}) => {
  const auth = useAuth();
  const navigate = useNavigate();
  
  const getRoleName = (role: UserRole): string => {
    switch(role) {
      case 'teacher': return 'Professor';
      case 'specialist': return 'Especialista';
      case 'admin': return 'Administrador';
      case 'coordinator': return 'Coordenador';
      case 'psychologist': return 'Psicólogo';
      case 'therapist': return 'Terapeuta';
      case 'parent': return 'Responsável';
      case 'professional': return 'Profissional';
      case 'manager': return 'Gerente';
      case 'student': return 'Estudante';
      case 'guest': return 'Convidado';
      default: return 'Usuário';
    }
  };
  
  const defaultMessage = requiredPermissions.length 
    ? 'Você não tem as permissões necessárias para acessar esta funcionalidade.'
    : 'Você não tem permissão para acessar esta funcionalidade.';
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
      
      <p className="text-gray-600 mb-4">
        {message || defaultMessage}
      </p>
      
      <div className="bg-gray-100 rounded-lg p-4 mb-6 max-w-md">
        <h3 className="font-medium text-gray-900 mb-2">Informações de acesso:</h3>
        <p className="text-sm text-gray-700 mb-2">
          Seu perfil: <span className="font-semibold">{auth.user ? getRoleName(auth.user.role as UserRole) : 'Não autenticado'}</span>
        </p>
        
        {requiredRoles.length > 0 && (
          <p className="text-sm text-gray-700">
            Perfis permitidos: <span className="font-semibold">{requiredRoles.map(role => getRoleName(role)).join(', ')}</span>
          </p>
        )}
        
        {requiredPermissions.length > 0 && (
          <p className="text-sm text-gray-700">
            Permissões necessárias: <span className="font-semibold">{requiredPermissions.join(', ')}</span>
          </p>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Entre em contato com o administrador do sistema se você precisar acessar esta funcionalidade.
      </p>
      
      <div className="flex space-x-4">
        {showBackButton && (
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        )}
        
        {showHomeButton && (
          <Button onClick={() => navigate('/')}>
            Ir para Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccessDenied;
