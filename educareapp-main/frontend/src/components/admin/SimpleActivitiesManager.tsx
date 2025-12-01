import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Eye, 
  RefreshCw,
  Baby,
  Activity as ActivityIcon,
  Calendar,
  User
} from 'lucide-react';

// Tipos básicos
interface UserChild {
  id: string;
  name: string;
  birth_date: string;
  age_in_months: number;
}

interface UserWithChildren {
  id: string;
  name: string;
  email: string;
  role: string;
  children: UserChild[];
  activities_count: number;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  min_age_months: number;
  max_age_months: number;
  duration_minutes: number;
  materials_needed: string[];
}

export const SimpleActivitiesManager: React.FC = () => {
  const [users, setUsers] = useState<UserWithChildren[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithChildren | null>(null);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [stats, setStats] = useState({
    total_users: 0,
    users_with_children: 0,
    total_children: 0
  });

  // Simular dados para demonstração
  useEffect(() => {
    // Dados mockados para demonstração
    const mockUsers: UserWithChildren[] = [
      {
        id: '1',
        name: 'Maria Silva',
        email: 'maria@email.com',
        role: 'user',
        children: [
          { id: '1', name: 'João', birth_date: '2022-01-15', age_in_months: 24 },
          { id: '2', name: 'Ana', birth_date: '2023-06-10', age_in_months: 8 }
        ],
        activities_count: 15
      },
      {
        id: '2',
        name: 'Carlos Santos',
        email: 'carlos@email.com',
        role: 'user',
        children: [
          { id: '3', name: 'Pedro', birth_date: '2021-03-20', age_in_months: 36 }
        ],
        activities_count: 22
      }
    ];

    setUsers(mockUsers);
    setStats({
      total_users: 50,
      users_with_children: 35,
      total_children: 48
    });
  }, []);

  // Formatação de idade
  const formatAge = (months: number) => {
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    return `${years}a ${remainingMonths}m`;
  };

  // Visualizar atividades de um usuário
  const handleViewUserActivities = (user: UserWithChildren) => {
    setSelectedUser(user);
    
    // Simular atividades baseadas na idade das crianças
    const mockActivities: Activity[] = [
      {
        id: '1',
        title: 'Brincadeira com Blocos',
        description: 'Atividade para desenvolver coordenação motora',
        category: 'motor',
        min_age_months: 12,
        max_age_months: 36,
        duration_minutes: 20,
        materials_needed: ['Blocos coloridos', 'Tapete']
      },
      {
        id: '2',
        title: 'Contação de História',
        description: 'Desenvolvimento da linguagem e imaginação',
        category: 'cognitive',
        min_age_months: 6,
        max_age_months: 48,
        duration_minutes: 15,
        materials_needed: ['Livro infantil', 'Almofadas']
      }
    ];
    
    setUserActivities(mockActivities);
    setShowActivitiesModal(true);
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ActivityIcon className="h-8 w-8 text-blue-600" />
            Gestor de Atividades por Usuário
          </h1>
          <p className="mt-2 text-gray-600">
            Visualize as atividades recomendadas para cada usuário baseado na idade de suas crianças.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold">{stats.total_users}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center space-x-2">
              <Baby className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Com Crianças</p>
                <p className="text-2xl font-bold text-green-600">{stats.users_with_children}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Crianças</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total_children}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg border shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredUsers.length} de {users.length} usuários
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Usuários com Crianças</h3>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="ml-2">Carregando usuários...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Nenhum usuário encontrado com os filtros aplicados.' : 'Nenhum usuário encontrado.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crianças
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Idades
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Atividades
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.role === 'user' ? 'Parent' : user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Baby className="h-3 w-3 text-gray-400" />
                            <span className="text-sm font-medium">
                              {user.children.length} criança{user.children.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.children.map((child) => (
                              <span
                                key={child.id}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {formatAge(child.age_in_months)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <ActivityIcon className="h-3 w-3 text-blue-400" />
                            <span className="text-sm font-medium text-blue-600">
                              {user.activities_count} atividades
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewUserActivities(user)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900"
                            title="Ver atividades recomendadas"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Atividades
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Atividades */}
        {showActivitiesModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ActivityIcon className="h-5 w-5" />
                    Atividades Recomendadas - {selectedUser.name}
                  </h2>
                  <button
                    onClick={() => setShowActivitiesModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Informações do Usuário */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Informações do Usuário</h4>
                    <p className="text-sm text-gray-600">Email: {selectedUser.email}</p>
                    <p className="text-sm text-gray-600">Role: {selectedUser.role}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Crianças</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUser.children.map((child) => (
                        <span
                          key={child.id}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {child.name} - {formatAge(child.age_in_months)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lista de Atividades */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Atividades Recomendadas ({userActivities.length})
                  </h4>
                  
                  {userActivities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Nenhuma atividade encontrada para as idades das crianças deste usuário.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userActivities.map((activity) => (
                        <div key={activity.id} className="border rounded-lg p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h5 className="font-medium text-gray-900">{activity.title}</h5>
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                {activity.category}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatAge(activity.min_age_months)} - {formatAge(activity.max_age_months)}
                              </div>
                              <div>
                                {activity.duration_minutes}min
                              </div>
                            </div>
                            
                            {activity.materials_needed && activity.materials_needed.length > 0 && (
                              <div className="text-xs">
                                <span className="font-medium">Materiais:</span> {activity.materials_needed.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
