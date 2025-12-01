import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  RefreshCw,
  Clock,
  Target,
  Baby,
  Activity as ActivityIcon,
  Calendar,
  User
} from 'lucide-react';
import { useUserActivitiesManagement } from '../../hooks/useUserActivitiesManagement';

// Componentes UI básicos
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 pb-4">{children}</div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default', 
  disabled = false, 
  className = '',
  title
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
  disabled?: boolean;
  className?: string;
  title?: string;
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100'
  };
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-8 px-3 text-sm'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};

const Input = ({ 
  placeholder, 
  value, 
  onChange, 
  className = '',
  onKeyPress
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
);

const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 bg-white text-gray-700'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Select = ({ 
  value, 
  onValueChange, 
  children 
}: { 
  value: string; 
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </select>
  </div>
);

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);

const Dialog = ({ 
  open, 
  onOpenChange, 
  children 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

const DialogTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

const USER_ROLES = [
  { value: '', label: 'Todos os roles' },
  { value: 'user', label: 'Usuário/Parent' },
  { value: 'professional', label: 'Profissional' },
  { value: 'admin', label: 'Administrador' }
];

export const UserActivitiesManager: React.FC = () => {
  const {
    users,
    selectedUser,
    userActivities,
    loading,
    error,
    stats,
    currentPage,
    totalPages,
    totalItems,
    filters,
    loadUserActivities,
    setPage,
    setFilters,
    clearFilters,
    selectUser,
    refreshData
  } = useUserActivitiesManagement();

  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showActivitiesDialog, setShowActivitiesDialog] = useState(false);

  // Aplicar filtros
  const applyFilters = () => {
    setFilters({
      search: searchTerm || undefined,
      role: selectedRole || undefined,
      has_children: true // Sempre mostrar apenas usuários com crianças
    });
  };

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    clearFilters();
  };

  // Visualizar atividades de um usuário
  const handleViewUserActivities = async (userId: string) => {
    await loadUserActivities(userId);
    setShowActivitiesDialog(true);
  };

  // Formatação de idade
  const formatAge = (months: number) => {
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    return `${years}a ${remainingMonths}m`;
  };

  // Formatação de categoria
  const formatCategory = (category: string) => {
    const categories: Record<string, string> = {
      'motor': 'Motor',
      'cognitive': 'Cognitivo',
      'sensory': 'Sensorial',
      'communication': 'Comunicação',
      'social_emotional': 'Social/Emocional',
      'nutrition': 'Nutrição',
      'baby_health': 'Saúde do Bebê',
      'maternal_health': 'Saúde Materna',
      'maternal_self_care': 'Autocuidado Materno'
    };
    return categories[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold">
                  {stats?.total_users || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Baby className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Com Crianças</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.users_with_children || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Crianças</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.total_children || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ActivityIcon className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Atividades Disponíveis</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats?.activities_by_category?.reduce((total, cat) => total + cat.activities_count, 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles e Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Gestor de Atividades por Usuário
            </CardTitle>
            
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Barra de Pesquisa e Filtros */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        applyFilters();
                      }
                    }}
                  />
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {(filters.role) && (
                  <Badge variant="secondary" className="ml-1">
                    Ativos
                  </Badge>
                )}
              </Button>
              
              <Button onClick={applyFilters}>
                Buscar
              </Button>
            </div>

            {/* Painel de Filtros */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">Role do Usuário</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            )}

            {/* Contador de Resultados */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Mostrando {users.length} de {totalItems} usuários
              </span>
              {(filters.search || filters.role) && (
                <Badge variant="outline">
                  Filtros aplicados
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando usuários...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Erro ao carregar usuários: {error}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {(filters.search || filters.role) 
                ? 'Nenhum usuário encontrado com os filtros aplicados.'
                : 'Nenhum usuário com crianças cadastradas encontrado.'
              }
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Crianças</TableHead>
                  <TableHead>Idades</TableHead>
                  <TableHead>Atividades Disponíveis</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.role === 'user' ? 'Parent' : user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Baby className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">
                          {user.children.length} criança{user.children.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.children.map((child, index) => (
                          <Badge key={child.id} variant="secondary" className="text-xs">
                            {formatAge(child.age_in_months)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ActivityIcon className="h-3 w-3 text-blue-400" />
                        <span className="text-sm font-medium text-blue-600">
                          {user.activities_count} atividades
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUserActivities(user.id)}
                        title="Ver atividades recomendadas"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(page)}
                disabled={loading}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Dialog de Atividades do Usuário */}
      <Dialog open={showActivitiesDialog} onOpenChange={setShowActivitiesDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5" />
              Atividades Recomendadas - {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              {/* Informações do Usuário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Informações do Usuário</h4>
                  <p className="text-sm text-gray-600">Email: {selectedUser.email}</p>
                  <p className="text-sm text-gray-600">Role: {selectedUser.role}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Crianças</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedUser.children.map((child) => (
                      <Badge key={child.id} variant="outline" className="text-xs">
                        {child.name} - {formatAge(child.age_in_months)}
                      </Badge>
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
                      <Card key={activity.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-gray-900">{activity.title}</h5>
                            <Badge variant="outline">
                              {formatCategory(activity.category)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {activity.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatAge(activity.min_age_months)} - {formatAge(activity.max_age_months)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.duration_minutes}min
                            </div>
                          </div>
                          
                          {activity.materials_needed && activity.materials_needed.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">Materiais:</span> {activity.materials_needed.slice(0, 2).join(', ')}
                              {activity.materials_needed.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
