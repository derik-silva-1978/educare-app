
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { 
  Home, Users, BookOpen, Lightbulb, Calendar, 
  BarChart, Settings, Shield, Activity,
  FileText, School, Baby, Heart
} from 'lucide-react';

interface DashboardLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  disabled?: boolean;
}

const DashboardLink: React.FC<DashboardLinkProps> = ({ 
  to, icon: Icon, label, active, disabled 
}) => {
  const baseClasses = cn(
    "w-full justify-start",
    active ? "bg-accent" : "hover:bg-accent/50",
    disabled && "opacity-50 pointer-events-none"
  );
  
  return (
    <Button variant="ghost" className={baseClasses} asChild disabled={disabled}>
      <Link to={to}>
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
};

const DashboardSidebarNav: React.FC = () => {
  const location = useLocation();
  const { user, hasRole } = useAuth();
  
  const isPathActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const isAdmin = hasRole('admin');
  const isParent = hasRole('parent');
  const isProfessional = hasRole(['professional', 'therapist', 'teacher']);
  
  return (
    <nav className="flex-1 p-4 space-y-1">
      {/* Common links for all users */}
      <DashboardLink 
        to="/dashboard" 
        icon={Home} 
        label="Dashboard" 
        active={isPathActive('/dashboard')} 
      />
      
      {/* Parent/Guardian specific links */}
      {isParent && (
        <>
          <DashboardLink 
            to="/educare-app/children" 
            icon={Baby} 
            label="Crianças" 
            active={isPathActive('/educare-app/children')} 
          />
          
          <DashboardLink 
            to="/educare-app/journey" 
            icon={Activity} 
            label="Jornada" 
            active={isPathActive('/educare-app/journey')} 
          />
          
          <DashboardLink 
            to="/educare-app/maternal-health" 
            icon={Heart} 
            label="Saúde Materna" 
            active={isPathActive('/educare-app/maternal-health')} 
          />
          
          <DashboardLink 
            to="/educare-app/support-material" 
            icon={BookOpen} 
            label="Material de Apoio" 
            active={isPathActive('/educare-app/support-material')} 
          />
        </>
      )}
      
      {/* Professional specific links */}
      {isProfessional && (
        <>
          <DashboardLink 
            to="/educare-app/professional/dashboard" 
            icon={Activity} 
            label="Painel Profissional" 
            active={isPathActive('/educare-app/professional')} 
          />
          
          <DashboardLink 
            to="/smart-pei/students" 
            icon={School} 
            label="Alunos" 
            active={isPathActive('/smart-pei/students')} 
          />
          
          <DashboardLink 
            to="/smart-pei/assessments" 
            icon={FileText} 
            label="Avaliações" 
            active={isPathActive('/smart-pei/assessments')} 
          />
          
          <DashboardLink 
            to="/smart-pei/activities" 
            icon={Calendar} 
            label="Atividades" 
            active={isPathActive('/smart-pei/activities')} 
          />
        </>
      )}
      
      {/* Admin specific links */}
      {isAdmin && (
        <>
          <DashboardLink 
            to="/educare-app/quiz-admin" 
            icon={Shield} 
            label="Admin Quiz" 
            active={isPathActive('/educare-app/quiz-admin')} 
          />
          
          <DashboardLink 
            to="/smart-pei/management" 
            icon={Users} 
            label="Gerenciamento" 
            active={isPathActive('/smart-pei/management')} 
          />
          
          <DashboardLink 
            to="/smart-pei/reports" 
            icon={BarChart} 
            label="Relatórios" 
            active={isPathActive('/smart-pei/reports')} 
          />
        </>
      )}
      
      {/* Common links at the bottom */}
      <DashboardLink 
        to={isProfessional ? "/smart-pei/settings" : "/educare-app/settings"} 
        icon={Settings} 
        label="Configurações" 
        active={isPathActive('/settings') || isPathActive('/smart-pei/settings')} 
      />
    </nav>
  );
};

export default DashboardSidebarNav;
