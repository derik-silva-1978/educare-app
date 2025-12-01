
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  BarChart2, 
  Settings, 
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/smart-pei/dashboard' },
  { icon: Users, label: 'Alunos', path: '/smart-pei/students' },
  { icon: ClipboardList, label: 'Avaliações', path: '/smart-pei/assessments' },
  { icon: Calendar, label: 'Atividades', path: '/smart-pei/activities' },
  { icon: BarChart2, label: 'Relatórios', path: '/smart-pei/reports' },
  { icon: HelpCircle, label: 'Ajuda', path: '/smart-pei/help' },
  { icon: Settings, label: 'Configurações', path: '/smart-pei/settings' },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "bg-slate-800 text-white transition-all duration-300 h-screen",
        collapsed ? "w-16" : "w-64",
        "hidden md:block"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
        {!collapsed && (
          <span className="text-xl font-bold">Smart PEI</span>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-slate-700 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center p-2 rounded-md transition-colors",
                  collapsed ? "justify-center" : "space-x-3",
                  isActive 
                    ? "bg-slate-700 text-white" 
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
