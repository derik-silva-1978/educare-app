
import React from "react";
import { BookOpen, HelpCircle, Settings, Users } from 'lucide-react';

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export const HelpSidebarNav: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { key: 'inicio', label: 'Primeiros Passos', icon: BookOpen },
    { key: 'faq', label: 'Perguntas Frequentes', icon: HelpCircle },
    { key: 'guias', label: 'Guias Rápidos', icon: Settings },
    { key: 'suporte', label: 'Suporte', icon: Users },
  ];

  return (
    <nav className="w-60 bg-white border-r shadow-sm py-8 px-3 hidden md:block">
      <ul className="space-y-2">
        {navItems.map(item => (
          <li key={item.key}>
            <button
              className={`flex items-center w-full px-3 py-2 rounded text-left transition
                ${activeTab === item.key ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-blue-50 text-gray-700'}`}
              onClick={() => onTabChange(item.key)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
