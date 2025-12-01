
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  ClipboardList, 
  FileText, 
  Settings,
  MessageCircle,
  Calendar,
  BarChart,
  Bot
} from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const NavItem = ({ to, icon: Icon, label, active, notification }: { to: string; icon: React.ElementType; label: string; active?: boolean; notification?: boolean }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-4 py-2 rounded-md text-sm transition-colors",
          isActive || active
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {notification && (
        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
      )}
    </NavLink>
  );
};

const ProfessionalSidebar: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <span className="font-display font-bold text-xl bg-gradient-to-r from-educare-600 to-educare-400 bg-clip-text text-transparent">
            Educare+
          </span>
        </div>
      </div>
      
      {/* User profile info */}
      {user && (
        <div className="px-4 py-3 border-b">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">{user.name || user.email}</p>
              <p className="text-xs text-gray-500 truncate">Profissional</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <NavItem to="/educare-app/dashboard" icon={Home} label="Dashboard" />
        <NavItem to="/educare-app/professional/dashboard" icon={Users} label="Pacientes" />
        <NavItem to="/educare-app/titinauta-journey" icon={Bot} label="Jornada TitiNauta" notification={true} />
        <NavItem to="/smart-pei/students" icon={Users} label="Alunos" />
        <NavItem to="/smart-pei/assessments" icon={ClipboardList} label="Avaliações" />
        <NavItem to="/smart-pei/activities" icon={Calendar} label="Atividades" />
        <NavItem to="/smart-pei/reports" icon={BarChart} label="Relatórios" />
        <NavItem to="/educare-app/messages" icon={MessageCircle} label="Mensagens" />
        <NavItem to="/educare-app/settings" icon={Settings} label="Configurações" />
      </nav>
    </div>
  );
};

export default ProfessionalSidebar;
