
import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { LogOut, User, Settings, Shield, Crown } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { Badge } from '@/components/ui/badge';

interface SmartPEIUserDropdownProps {
  show: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const SmartPEIUserDropdown: React.FC<SmartPEIUserDropdownProps> = ({ 
  show, 
  onClose,
  onLogout
}) => {
  const { currentUser, getRoleName } = useAuth();
  
  if (!show || !currentUser) return null;
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper function to get color for the access level badge
  const getAccessLevelColor = (level?: string) => {
    switch (level) {
      case 'premium': return 'bg-amber-400 text-amber-950';
      case 'enterprise': return 'bg-purple-400 text-purple-950';
      default: return 'bg-blue-400 text-blue-950';
    }
  };
  
  return (
    <div 
      className="absolute top-16 right-4 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
      onMouseLeave={onClose}
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 rounded-full" />
            ) : (
              getInitials(currentUser.name)
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
            <div className="text-xs text-gray-500 flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              {getRoleName(currentUser.role as UserRole)}
            </div>
          </div>
        </div>
        
        {currentUser.accessLevel && (
          <div className="mt-2 flex justify-start">
            <Badge className={`text-xs py-0.5 px-2 ${getAccessLevelColor(currentUser.accessLevel)}`}>
              {currentUser.accessLevel === 'premium' ? (
                <span className="flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </span>
              ) : currentUser.accessLevel === 'enterprise' ? (
                <span className="flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Enterprise
                </span>
              ) : 'Básico'}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="py-1">
        <Link 
          to="/smart-pei/profile" 
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          <User className="h-4 w-4 mr-3 text-gray-400" />
          Perfil
        </Link>
        <Link 
          to="/smart-pei/settings" 
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          <Settings className="h-4 w-4 mr-3 text-gray-400" />
          Configurações
        </Link>
      </div>
      
      <div className="py-1 border-t border-gray-100">
        <button 
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4 mr-3 text-gray-400" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default SmartPEIUserDropdown;
