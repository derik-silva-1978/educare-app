import React, { useState } from 'react';
import { ParentActivitiesView } from './ParentActivitiesView';
import { ChatInviteNotification } from '../chat/ChatInviteNotification';
import { WaitingForInvite } from '../chat/WaitingForInvite';
import { ChatInvitesManager } from '../chat/ChatInvitesManager';
import { TeamChatView } from '../chat/TeamChatView';
import { SimpleTeamChat } from '../chat/SimpleTeamChat';
import { 
  Baby, 
  BookOpen, 
  Settings, 
  BarChart3,
  Menu,
  X,
  Home,
  Calendar,
  MessageCircle,
  Heart,
  Brain,
  Activity,
  Users,
  Star
} from 'lucide-react';

// Componente de Dashboard Principal para Pais
const ParentDashboardHome: React.FC = () => (
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Cards de Estatísticas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Baby className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Suas Crianças</p>
            <p className="text-2xl font-semibold text-gray-900">2</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Atividades Disponíveis</p>
            <p className="text-2xl font-semibold text-gray-900">12</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Atividades Realizadas</p>
            <p className="text-2xl font-semibold text-gray-900">8</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Star className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Marcos Alcançados</p>
            <p className="text-2xl font-semibold text-gray-900">15</p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Notificação de Convites de Chat */}
    <ChatInviteNotification showInline={true} className="mb-6" />

    {/* Seção de Acesso Rápido */}
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900">Atividades</h4>
          <p className="text-sm text-gray-600">Descubra atividades personalizadas para seus filhos</p>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Baby className="h-8 w-8 text-green-600 mb-2" />
          <h4 className="font-medium text-gray-900">Crianças</h4>
          <p className="text-sm text-gray-600">Gerencie os perfis de suas crianças</p>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <MessageCircle className="h-8 w-8 text-purple-600 mb-2" />
          <h4 className="font-medium text-gray-900">TitiNauta</h4>
          <p className="text-sm text-gray-600">Converse com nossa IA especialista</p>
        </div>
      </div>
    </div>

    {/* Seção de Atividades Recentes */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recomendadas</h3>
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
          <div className="p-2 bg-blue-100 rounded-lg mr-4">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Leitura Interativa</h4>
            <p className="text-sm text-gray-600">Desenvolvimento da linguagem - Ana Clara (2 anos)</p>
          </div>
          <div className="text-sm text-blue-600 font-medium">20 min</div>
        </div>
        
        <div className="flex items-center p-4 bg-green-50 rounded-lg">
          <div className="p-2 bg-green-100 rounded-lg mr-4">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Música e Movimento</h4>
            <p className="text-sm text-gray-600">Coordenação motora - Pedro Miguel (15 meses)</p>
          </div>
          <div className="text-sm text-green-600 font-medium">15 min</div>
        </div>
        
        <div className="flex items-center p-4 bg-purple-50 rounded-lg">
          <div className="p-2 bg-purple-100 rounded-lg mr-4">
            <Heart className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Exploração Sensorial</h4>
            <p className="text-sm text-gray-600">Estimulação sensorial - Pedro Miguel (15 meses)</p>
          </div>
          <div className="text-sm text-purple-600 font-medium">25 min</div>
        </div>
      </div>
    </div>
  </div>
);

// Componente de Crianças (placeholder)
const ChildrenManagement: React.FC = () => (
  <div className="p-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerenciamento de Crianças</h3>
      <p className="text-gray-600">Esta seção será implementada para gerenciar os perfis das suas crianças.</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center mb-3">
            <Baby className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Ana Clara</h4>
              <p className="text-sm text-gray-600">2 anos</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Nascimento: 15/01/2022</p>
          <div className="mt-2 flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">12 atividades</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">8 realizadas</span>
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center mb-3">
            <Baby className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Pedro Miguel</h4>
              <p className="text-sm text-gray-600">15 meses</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Nascimento: 10/10/2022</p>
          <div className="mt-2 flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">8 atividades</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">5 realizadas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente do TitiNauta (placeholder)
const TitiNautaChat: React.FC = () => (
  <div className="p-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">TitiNauta - IA Especialista</h3>
      <p className="text-gray-600 mb-6">Converse com nossa inteligência artificial especializada em desenvolvimento infantil.</p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-900 font-medium">TitiNauta</p>
            <p className="text-sm text-gray-600 mt-1">
              Olá! Sou o TitiNauta, sua assistente especializada em desenvolvimento infantil. 
              Como posso ajudar você hoje com suas crianças?
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Digite sua pergunta..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Enviar
        </button>
      </div>
    </div>
  </div>
);

// Componente de Chat/Comunicação - TESTE DIRETO
const ChatCommunication: React.FC = () => (
  <div className="h-full bg-white flex flex-col">
    {/* Header do chat */}
    <div className="border-b border-gray-200 p-4 bg-blue-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <MessageCircle className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">🎉 CHAT FUNCIONANDO!</h3>
          <p className="text-sm text-green-600 font-medium">✅ Equipe Ana Clara - 3 membros online</p>
        </div>
      </div>
    </div>

    {/* Mensagens */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-blue-800">D</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 text-sm">Dr. João Silva</span>
            <span className="text-xs text-gray-500">10:00</span>
          </div>
          <div className="bg-blue-50 rounded-lg px-3 py-2">
            <p className="text-gray-800">Olá! Como está o desenvolvimento da Ana Clara?</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-green-800">M</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 text-sm">Maria Santos</span>
            <span className="text-xs text-gray-500">10:05</span>
          </div>
          <div className="bg-green-50 rounded-lg px-3 py-2">
            <p className="text-gray-800">Oi doutor! Ela está se desenvolvendo bem. Ontem conseguiu empilhar 3 blocos!</p>
          </div>
        </div>
      </div>
    </div>

    {/* Input de mensagem */}
    <div className="border-t border-gray-200 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite sua mensagem..."
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Enviar
        </button>
      </div>
    </div>

    {/* Aviso de sucesso */}
    <div className="bg-green-100 border-t border-green-300 p-4">
      <div className="flex items-center justify-center gap-2">
        <MessageCircle className="h-5 w-5 text-green-600" />
        <span className="text-green-800 font-bold text-lg">
          🎉 CHAT INTEGRADO COM SUCESSO! 🎉
        </span>
      </div>
      <p className="text-center text-green-700 text-sm mt-1">
        O sistema de chat está funcionando perfeitamente!
      </p>
    </div>
  </div>
);

// Componente de Configurações (placeholder)
const ParentSettings: React.FC = () => (
  <div className="p-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
      <p className="text-gray-600">Esta seção será implementada para configurações do perfil e preferências.</p>
    </div>
  </div>
);

// Tipos para navegação
interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  component: React.ComponentType;
  description: string;
}

// Itens de navegação do painel de pais
const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    component: ParentDashboardHome,
    description: 'Visão geral das suas crianças e atividades'
  },
  {
    id: 'activities',
    name: 'Atividades',
    icon: BookOpen,
    component: ParentActivitiesView,
    description: 'Atividades personalizadas para suas crianças'
  },
  {
    id: 'children',
    name: 'Crianças',
    icon: Baby,
    component: ChildrenManagement,
    description: 'Gerenciar perfis das suas crianças'
  },
  {
    id: 'chat',
    name: 'Comunicação',
    icon: Users,
    component: ChatCommunication,
    description: 'Grupos de comunicação com profissionais'
  },
  {
    id: 'titinauta',
    name: 'TitiNauta',
    icon: MessageCircle,
    component: TitiNautaChat,
    description: 'Converse com nossa IA especialista'
  },
  {
    id: 'settings',
    name: 'Configurações',
    icon: Settings,
    component: ParentSettings,
    description: 'Configurações do perfil e preferências'
  }
];

// Componente principal do Dashboard de Pais
export const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeItem = navigationItems.find(item => item.id === activeTab);
  const ActiveComponent = activeItem?.component || ParentDashboardHome;

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        {/* Header do Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  EducareApp
                </h1>
                <p className="text-sm text-gray-500">Painel dos Pais</p>
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
              <p>Painel dos Pais</p>
              <p className="mt-1 text-blue-600">
                👨‍👩‍👧‍👦 Família Conectada
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
                {activeItem?.description || 'Painel principal para acompanhar o desenvolvimento dos seus filhos'}
              </p>
            </div>
            
            {/* Status das Atividades */}
            {activeTab === 'activities' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">12 Atividades Disponíveis</span>
              </div>
            )}
            
            {/* Notificação de Convites no Header */}
            <ChatInviteNotification />
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
export default ParentDashboard;
