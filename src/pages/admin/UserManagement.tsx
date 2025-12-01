import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  Crown,
  User
} from 'lucide-react';
import { userService, UserData, UserFilters } from '@/services/userService';
import httpClient from '@/services/api/httpClient';

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: string;
}

interface UserWithPlan extends UserData {
  subscriptionPlan?: SubscriptionPlan;
}



const UserManagement: React.FC = () => {
  const { user, hasRole } = useCustomAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersWithPlans, setUsersWithPlans] = useState<UserWithPlan[]>([]);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Buscar planos de assinatura disponíveis
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await httpClient.get<{plans: SubscriptionPlan[]}>('/api/subscription-plans');
        if (response.success && response.data) {
          setAvailablePlans(response.data.plans || []);
        }
      } catch (error) {
        console.error('Erro ao buscar planos:', error);
      } finally {
        setLoadingPlans(false);
      }
    };
    
    fetchPlans();
  }, []);

  // Buscar dados dos planos dos usuários
  useEffect(() => {
    const fetchUsersWithPlans = async () => {
      if (users.length === 0) return;
      
      try {
        const usersWithPlanData = await Promise.all(
          users.map(async (user) => {
            try {
              // Buscar assinatura ativa do usuário
              const response = await httpClient.get<{subscription: {plan: SubscriptionPlan}}>(`/api/subscriptions/user/${user.id}/active`);
              if (response.success && response.data?.subscription?.plan) {
                return {
                  ...user,
                  subscriptionPlan: response.data.subscription.plan
                };
              }
            } catch (error) {
              // Usuário pode não ter plano ativo
              console.debug(`Usuário ${user.id} sem plano ativo`);
            }
            return { ...user };
          })
        );
        
        setUsersWithPlans(usersWithPlanData);
      } catch (error) {
        console.error('Erro ao buscar planos dos usuários:', error);
        // Em caso de erro, usar usuários sem dados de plano
        setUsersWithPlans(users.map(user => ({ ...user })));
      }
    };
    
    fetchUsersWithPlans();
  }, [users]);

  // Carregar usuários
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        
        const filters: UserFilters = {
          page: currentPage,
          limit: 50,
          role: roleFilter !== 'all' ? roleFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        };
        
        const response = await userService.getAllUsers(filters);
        setUsers(response.users);
        setTotalUsers(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os usuários.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [toast, currentPage, roleFilter, statusFilter]);

  // Redirect if not owner or admin
  if (!hasRole(['owner', 'admin'])) {
    return <Navigate to="/educare-app/dashboard" replace />;
  }

  // Filtrar usuários
  const filteredUsers = usersWithPlans.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPlan = planFilter === 'all' || 
      (planFilter === 'no-plan' && !user.subscriptionPlan) ||
      (user.subscriptionPlan && user.subscriptionPlan.id === planFilter);
    
    return matchesSearch && matchesRole && matchesStatus && matchesPlan;
  });

  // Funções de ação
  const handleActivateUser = async (userId: string) => {
    try {
      await userService.updateUserStatus(userId, 'active');
      
      // Atualizar a lista local
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: 'active' } : user
      ));
      
      toast({
        title: "Usuário ativado",
        description: "O usuário foi ativado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível ativar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      await userService.updateUserStatus(userId, 'inactive');
      
      // Atualizar a lista local
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: 'inactive' } : user
      ));
      
      toast({
        title: "Usuário desativado",
        description: "O usuário foi desativado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível desativar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleSendVerificationEmail = async (userId: string) => {
    try {
      await userService.sendVerificationEmail(userId);
      toast({
        title: "Email enviado",
        description: "Email de verificação enviado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de verificação.",
        variant: "destructive",
      });
    }
  };

  // Utilitários
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'professional': return <UserCheck className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'owner': return 'Proprietário';
      case 'admin': return 'Administrador';
      case 'professional': return 'Profissional';
      default: return 'Usuário';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">Inativo</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gestão de Usuários - EducareApp</title>
        <meta name="description" content="Gerenciamento de usuários da plataforma EducareApp" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mr-3" />
              Gestão de Usuários
            </h1>
            <p className="text-muted-foreground mt-1">Gerenciar usuários e permissões da plataforma</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              {totalUsers} usuários
            </Badge>
          </div>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Buscar e filtrar usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os roles</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="professional">Profissional</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="owner">Proprietário</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os planos</SelectItem>
                  <SelectItem value="no-plan">Sem plano</SelectItem>
                  {availablePlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
                setPlanFilter('all');
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
            <CardDescription>
              {filteredUsers.length} usuário(s) encontrado(s) de {totalUsers} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{userData.name}</div>
                            <div className="text-sm text-gray-500">ID: {userData.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {userData.email}
                            {userData.email_verified && (
                              <UserCheck className="h-3 w-3 ml-1 text-green-500" />
                            )}
                          </div>
                          {userData.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {userData.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(userData.role)}
                          <span>{getRoleName(userData.role)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(userData.status)}
                      </TableCell>
                      <TableCell>
                        {userData.subscriptionPlan ? (
                          <Badge
                            variant="outline"
                            className="bg-purple-100 text-purple-800 border-purple-200"
                          >
                            {userData.subscriptionPlan.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-500 text-sm">Sem plano</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {userData.last_login ? (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(userData.last_login)}
                          </div>
                        ) : (
                          <span className="text-gray-400">Nunca</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(userData.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {userData.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleDeactivateUser(userData.id)}>
                                <UserX className="mr-2 h-4 w-4" />
                                Desativar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleActivateUser(userData.id)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Ativar
                              </DropdownMenuItem>
                            )}
                            {!userData.email_verified && (
                              <DropdownMenuItem onClick={() => handleSendVerificationEmail(userData.id)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar Verificação
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserManagement;
