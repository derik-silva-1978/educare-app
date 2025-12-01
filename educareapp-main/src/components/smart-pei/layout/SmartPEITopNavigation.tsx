
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart2,
  Settings,
  HelpCircle,
  Bell,
  Calendar,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useNotifications from '@/hooks/useNotifications';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

interface SmartPEITopNavigationProps {
  activeSection?: string;
}

const SmartPEITopNavigation: React.FC<SmartPEITopNavigationProps> = ({ activeSection }) => {
  const { unreadCount } = useNotifications();
  const { hasRole } = useAuth();
  const location = useLocation();
  
  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const navItems = [
    { to: '/smart-pei/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/smart-pei/students', icon: Users, label: 'Alunos' },
    { to: '/smart-pei/assessments', icon: ClipboardList, label: 'Avaliações' },
    { to: '/smart-pei/activities', icon: Calendar, label: 'Atividades' },
    { to: '/smart-pei/reports', icon: BarChart2, label: 'Relatórios' },
    { 
      to: '/smart-pei/notifications', 
      icon: Bell, 
      label: 'Notificações',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { to: '/smart-pei/help', icon: HelpCircle, label: 'Ajuda' },
    { to: '/smart-pei/settings', icon: Settings, label: 'Configurações' },
  ];

  // Add management link only for admins
  if (hasRole(['admin'])) {
    navItems.splice(6, 0, { to: '/smart-pei/management', icon: Shield, label: 'Gerenciamento' });
  }

  return (
    <div className="w-full bg-sky-800 text-white shadow-md fixed top-16 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex overflow-x-auto py-2 hide-scrollbar">
          <ul className="flex space-x-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive: linkActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      linkActive || isActive(item.to)
                        ? "bg-sky-700 text-white"
                        : "text-sky-100 hover:bg-sky-700 hover:text-white"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-400 text-[10px] font-medium text-sky-900">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SmartPEITopNavigation;
