
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Baby, 
  Bot,
  Calendar,
  BookOpen, 
  Settings,
  AlertCircle
} from 'lucide-react';
import { useCustomChildren } from '@/hooks/educare-app/useCustomChildren';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  active, 
  notification 
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  active?: boolean; 
  notification?: boolean 
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-4 py-3 rounded-md text-sm transition-colors relative",
          isActive || active
            ? "bg-primary/10 text-primary font-medium"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      {notification && (
        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
      )}
    </NavLink>
  );
};

const ParentSidebar: React.FC = () => {
  const { user } = useAuth();
  const { children } = useCustomChildren();
  const [hasTitiNautaContent, setHasTitiNautaContent] = useState(false);
  
  // Verificar se há crianças com conteúdo disponível para o TitiNauta
  useEffect(() => {
    if (children && children.length > 0) {
      // Se há pelo menos uma criança, consideramos que há conteúdo disponível
      setHasTitiNautaContent(true);
    }
  }, [children]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-slate-700">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            Educare+
          </span>
        </Link>
      </div>
      
      {/* User profile info */}
      {user && (
        <div className="px-4 py-3 border-b dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user.name || user.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Responsável</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation - Simplified core features */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem to="/educare-app/dashboard" icon={Home} label="Dashboard" />
        <NavItem to="/educare-app/children" icon={Baby} label="Crianças" />
        <NavItem 
          to="/educare-app/titinauta-journey" 
          icon={Bot} 
          label="Jornada TitiNauta" 
          notification={hasTitiNautaContent} 
        />
        <NavItem to="/educare-app/activities" icon={Calendar} label="Atividades" />
        <NavItem to="/educare-app/material-apoio" icon={BookOpen} label="Material de Apoio" />
        <NavItem to="/educare-app/settings" icon={Settings} label="Configurações" />
      </nav>
    </div>
  );
};

export default ParentSidebar;
