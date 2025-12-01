import React, { useState } from 'react';
import { SimpleActivitiesManager } from './SimpleActivitiesManager';
import { AdminActivities } from './AdminActivities';
import { 
  Users, 
  Activity, 
  Settings, 
  BarChart3,
  Menu,
  X,
  Home,
  UserCheck,
  Calendar,
  FileText
} from 'lucide-react';

// Componente de Dashboard Principal
const DashboardHome: React.FC = () => (
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Cards de Estatísticas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Usuários</p>
            <p className="text-2xl font-semibold text-gray-900">1,234</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Atividades</p>
            <p className="text-2xl font-semibold text-gray-900">456</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <UserCheck className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Crianças</p>
            <p className="text-2xl font-semibold text-gray-900">789</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Relatórios</p>
            <p className="text-2xl font-semibold text-gray-900">123</p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Seção de Acesso Rápido */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Activity className="h-8 w-8 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900">Gestor de Atividades</h4>
          <p className="text-sm text-gray-600">Visualize atividades por usuário e idade das crianças</p>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Settings className="h-8 w-8 text-green-600 mb-2" />
          <h4 className="font-medium text-gray-900">CRUD Atividades</h4>
          <p className="text-sm text-gray-600">Criar, editar e gerenciar atividades</p>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Users className="h-8 w-8 text-purple-600 mb-2" />
          <h4 className="font-medium text-gray-900">Gerenciar Usuários</h4>
          <p className="text-sm text-gray-600">Administrar usuários e permissões</p>
        </div>
      </div>
    </div>
  </div>
);

// Componente de Usuários (placeholder)
const UsersManagement: React.FC = () => (
  <div className="p-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerenciamento de Usuários</h3>
      <p className="text-gray-600">Esta seção será implementada para gerenciar usuários do sistema.</p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Funcionalidades planejadas:</strong>
        </p>
        <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
          <li>Listar todos os usuários</li>
          <li>Editar perfis de usuário</li>
          <li>Gerenciar permissões</li>
          <li>Ativar/desativar contas</li>
        </ul>
      </div>
    </div>
  </div>
);

// Componente de Relatórios (placeholder)
const ReportsManagement: React.FC = () => (
  <div className="p-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios e Estatísticas</h3>
      <p className="text-gray-600">Esta seção será implementada para visualizar relatórios detalhados.</p>
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Relatórios disponíveis:</strong>
        </p>
        <ul className="mt-2 text-sm text-green-700 list-disc list-inside">
          <li>Uso de atividades por faixa etária</li>
          <li>Engajamento dos usuários</li>
          <li>Estatísticas de desenvolvimento</li>
          <li>Relatórios de progresso</li>
        </ul>
      </div>
    </div>
  </div>
);

// Tipos para navegação
interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  description: string;
}

// Itens de navegação do painel admin
const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    component: DashboardHome,
    description: 'Visão geral do sistema'
  },
  {
    id: 'activities-manager',
    name: 'Gestor de Atividades',
    icon: Activity,
    component: SimpleActivitiesManager,
    description: 'Atividades por usuário e idade das crianças'
  },
  {
    id: 'activities-crud',
    name: 'CRUD Atividades',
    icon: Settings,
    component: AdminActivities,
    description: 'Criar, editar e gerenciar atividades'
  },
  {
    id: 'users',
    name: 'Usuários',
    icon: Users,
    component: UsersManagement,
    description: 'Gerenciar usuários do sistema'
  },
  {
    id: 'reports',
    name: 'Relatórios',
    icon: BarChart3,
    component: ReportsManagement,
    description: 'Visualizar relatórios e estatísticas'
  }
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activities-manager'); // Inicia no Gestor de Atividades
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeItem = navigationItems.find(item => item.id === activeTab);
  const ActiveComponent = activeItem?.component || DashboardHome;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header do Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  EducareApp
                </h1>
                <p className="text-sm text-gray-500">Painel Admin</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
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
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={!sidebarOpen ? item.name : undefined}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {sidebarOpen && (
                      <div className="flex-1">
                        <span className="font-medium block">{item.name}</span>
                        {isActive && (
                          <span className="text-xs text-blue-100 mt-1 block">
                            {item.description}
                          </span>
                        )}
                      </div>
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
            <div className="text-xs text-gray-500">
              <p className="font-medium">EducareApp v1.0</p>
              <p>Painel Administrativo</p>
              <p className="mt-1 text-green-600">
                ✅ Gestor de Atividades Integrado
              </p>
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
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {activeItem && <activeItem.icon className="h-6 w-6 text-blue-600" />}
                {activeItem?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {activeItem?.description || 'Painel administrativo do EducareApp'}
              </p>
            </div>
            
            {/* Status do Gestor de Atividades */}
            {activeTab === 'activities-manager' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Integrado com Sucesso</span>
              </div>
            )}
          </div>
        </header>

        {/* Área de Conteúdo */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

// Exportação padrão
export default AdminDashboard;
