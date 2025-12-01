
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  FileText, 
  Settings,
  KeyRound,
  School,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

interface SidebarNavProps {
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const { hasPermission } = usePermissions();
  const { hasRole } = useAuth();
  const location = useLocation();
  
  // Function to determine if a route is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      <NavLink 
        to="/smart-pei/dashboard" 
        className={({ isActive }) => 
          cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative", 
            isActive 
              ? "bg-sky-700 text-white font-medium shadow-md" 
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          )
        }
      >
        <LayoutDashboard className="h-4 w-4" />
        <span>Dashboard</span>
        {isActive("/smart-pei/dashboard") && (
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-300 rounded-l-md" />
        )}
      </NavLink>
      
      {hasPermission('team.view') && (
        <NavLink 
          to="/smart-pei/students" 
          className={({ isActive }) => 
            cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative", 
              isActive 
                ? "bg-sky-700 text-white font-medium shadow-md" 
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )
          }
        >
          <School className="h-4 w-4" />
          <span>Alunos</span>
          {isActive("/smart-pei/students") && (
            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-300 rounded-l-md" />
          )}
        </NavLink>
      )}
      
      <NavLink 
        to="/smart-pei/activities" 
        className={({ isActive: linkActive }) => 
          cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative", 
            linkActive || isActive('/smart-pei/activities')
              ? "bg-sky-700 text-white font-medium shadow-md" 
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          )
        }
      >
        <Calendar className="h-4 w-4" />
        <span>Atividades</span>
        {isActive("/smart-pei/activities") && (
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-300 rounded-l-md" />
        )}
      </NavLink>
      
      {hasPermission('team.view') && (
        <NavLink 
          to="/smart-pei/assessments" 
          className={({ isActive }) => 
            cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative", 
              isActive 
                ? "bg-sky-700 text-white font-medium shadow-md" 
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )
          }
        >
          <ClipboardList className="h-4 w-4" />
          <span>Avaliações</span>
          {isActive("/smart-pei/assessments") && (
            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-300 rounded-l-md" />
          )}
        </NavLink>
      )}
      
      {hasPermission('report.view') && (
        <NavLink 
          to="/smart-pei/reports" 
          className={({ isActive }) => 
            cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative", 
              isActive 
                ? "bg-sky-700 text-white font-medium shadow-md" 
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )
          }
        >
          <BarChart2 className="h-4 w-4" />
          <span>Relatórios</span>
          {isActive("/smart-pei/reports") && (
            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-300 rounded-l-md" />
          )}
        </NavLink>
      )}
      
      {hasRole(['admin', 'manager']) && (
        <NavLink 
          to="/smart-pei/management" 
          className={({ isActive }) => 
            cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative", 
              isActive 
                ? "bg-sky-700 text-white font-medium shadow-md" 
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )
          }
        >
          <KeyRound className="h-4 w-4" />
          <span>Gerenciamento</span>
          {isActive("/smart-pei/management") && (
            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-300 rounded-l-md" />
          )}
        </NavLink>
      )}
      
      <NavLink 
        to="/smart-pei/settings" 
        className={({ isActive }) => 
          cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative", 
            isActive 
              ? "bg-sky-700 text-white font-medium shadow-md" 
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          )
        }
      >
        <Settings className="h-4 w-4" />
        <span>Configurações</span>
        {isActive("/smart-pei/settings") && (
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-300 rounded-l-md" />
        )}
      </NavLink>

      <NavLink 
        to="/smart-pei/help" 
        className={({ isActive }) => 
          cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative", 
            isActive 
              ? "bg-sky-700 text-white font-medium shadow-md" 
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          )
        }
      >
        <HelpCircle className="h-4 w-4" />
        <span>Ajuda</span>
        {isActive("/smart-pei/help") && (
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-300 rounded-l-md" />
        )}
      </NavLink>
    </nav>
  );
};

export default SidebarNav;
