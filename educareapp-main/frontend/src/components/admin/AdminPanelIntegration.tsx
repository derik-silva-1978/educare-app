import React, { useState } from 'react';
import { SimpleActivitiesManager } from './SimpleActivitiesManager';
import { AdminActivities } from './AdminActivities';
import { 
  Users, 
  Activity, 
  Settings, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';

// Tipos para navegação
interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

// Itens de navegação do painel admin
const navigationItems: NavItem[] = [
  {
    id: 'users',
    name: 'Usuários',
    icon: Users,
    component: () => <div className="p-6">Página de Usuários</div>
  },
  {
    id: 'activities-crud',
    name: 'Atividades (CRUD)',
    icon: Settings,
    component: AdminActivities
  },
  {
    id: 'activities-manager',
    name: 'Gestor de Atividades',
    icon: Activity,
    component: SimpleActivitiesManager
  },
  {
    id: 'reports',
    name: 'Relatórios',
    icon: BarChart3,
    component: () => <div className="p-6">Página de Relatórios</div>
  }
];

export const AdminPanelIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activities-manager');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeItem = navigationItems.find(item => item.id === activeTab);
  const ActiveComponent = activeItem?.component || (() => <div>Página não encontrada</div>);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header do Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-900">
                Painel Admin
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={!sidebarOpen ? item.name : undefined}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                    {sidebarOpen && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer do Sidebar */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>EducareApp v1.0</p>
              <p>Painel Administrativo</p>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header do Conteúdo */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeItem?.name || 'Página'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {activeTab === 'activities-manager' && 'Gerencie atividades por usuário baseado na idade das crianças'}
                {activeTab === 'activities-crud' && 'Criar, editar e gerenciar atividades do sistema'}
                {activeTab === 'users' && 'Gerenciar usuários do sistema'}
                {activeTab === 'reports' && 'Visualizar relatórios e estatísticas'}
              </p>
            </div>
            
            {/* Indicador da página ativa */}
            <div className="flex items-center gap-2">
              {activeItem && (
                <>
                  <activeItem.icon className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {activeItem.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Área de Conteúdo */}
        <main className="flex-1 overflow-auto">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

// Exemplo de como usar em uma aplicação React
export const AdminPanelExample: React.FC = () => {
  return (
    <div>
      <AdminPanelIntegration />
    </div>
  );
};

// Exportação para uso direto
export default AdminPanelIntegration;
