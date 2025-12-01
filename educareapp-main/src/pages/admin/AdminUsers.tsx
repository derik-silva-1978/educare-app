
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserRole, User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRoleName } from '@/utils/auth-utils';
import { Search, UserPlus, Edit, Trash2, Filter, CreditCard } from 'lucide-react';
import httpClient from '@/services/api/httpClient';

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: string;
}

interface UserWithPlan extends User {
  subscriptionPlan?: SubscriptionPlan;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (userData: Partial<User>) => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSubmit
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'parent');
  
  // Reset form when user changes
  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || 'parent');
    } else {
      setName('');
      setEmail('');
      setRole('parent');
    }
  }, [user]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      role,
      ...(user ? { id: user.id } : {})
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="admin" className="bg-white border-gray-300">
        <DialogHeader>
          <DialogTitle variant="admin" className="text-gray-900 text-xl">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription variant="admin" className="text-gray-700">
            {user 
              ? 'Edite as informações do usuário' 
              : 'Preencha os dados para criar um novo usuário'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900 font-medium">Nome</Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 font-medium">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={email}
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-900 font-medium">Função</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="admin" className="text-gray-900">Administrador</SelectItem>
                <SelectItem value="parent" className="text-gray-900">Responsável</SelectItem>
                <SelectItem value="teacher" className="text-gray-900">Professor</SelectItem>
                <SelectItem value="therapist" className="text-gray-900">Terapeuta</SelectItem>
                <SelectItem value="psychologist" className="text-gray-900">Psicólogo</SelectItem>
                <SelectItem value="specialist" className="text-gray-900">Especialista</SelectItem>
                <SelectItem value="professional" className="text-gray-900">Profissional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {user ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminUsers: React.FC = () => {
  const { users, isLoading, addUser, updateUser, deleteUser } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usersWithPlans, setUsersWithPlans] = useState<UserWithPlan[]>([]);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [assignPlanDialogOpen, setAssignPlanDialogOpen] = useState(false);
  const [userToAssignPlan, setUserToAssignPlan] = useState<User | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
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
              // Buscar assinatura ativa do usuário - USANDO ROTA DE TESTE
              const response = await httpClient.get<{subscription: {plan: SubscriptionPlan}}>(`/api/subscriptions/test/user/${user.id}/active`);
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
  
  const filteredUsers = usersWithPlans.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    const matchesPlan = selectedPlan === 'all' || 
      (selectedPlan === 'no-plan' && !user.subscriptionPlan) ||
      (user.subscriptionPlan && user.subscriptionPlan.id === selectedPlan);
    
    return matchesSearch && matchesRole && matchesPlan;
  });
  
  const handleAddUser = () => {
    setCurrentUser(null);
    setDialogOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setDialogOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUser(userId);
    }
  };

  const handleAssignPlan = (user: User) => {
    setUserToAssignPlan(user);
    setSelectedPlanId('');
    setAssignPlanDialogOpen(true);
  };

  const handleSubmitPlanAssignment = async () => {
    if (!userToAssignPlan || !selectedPlanId) {
      alert('Por favor, selecione um plano.');
      return;
    }

    try {
      // Criar assinatura para o usuário
      const response = await httpClient.post('/api/subscriptions', {
        planId: selectedPlanId,
        userId: userToAssignPlan.id,
        isTrial: false
      });

      if (response.success) {
        alert('Plano atribuído com sucesso!');
        setAssignPlanDialogOpen(false);
        setUserToAssignPlan(null);
        setSelectedPlanId('');
        // Recarregar dados dos usuários com planos
        window.location.reload();
      } else {
        alert('Erro ao atribuir plano: ' + (response.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao atribuir plano:', error);
      alert('Erro ao atribuir plano. Tente novamente.');
    }
  };
  
  const handleSubmitUser = (userData: Partial<User>) => {
    if (currentUser) {
      updateUser({
        ...currentUser,
        ...userData
      } as User);
    } else {
      if ('id' in userData) {
        delete (userData as Partial<User> & { id?: string }).id; // Remove id if it's a new user
      }
      
      addUser({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'parent',
        password: '123456' // Default password
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Gerenciar Usuários | Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          
          <Button onClick={handleAddUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou email..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os perfis</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="parent">Responsáveis</SelectItem>
                <SelectItem value="teacher">Professores</SelectItem>
                <SelectItem value="therapist">Terapeutas</SelectItem>
                <SelectItem value="psychologist">Psicólogos</SelectItem>
                <SelectItem value="specialist">Especialistas</SelectItem>
                <SelectItem value="professional">Profissionais</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-[180px]">
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
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="admins">Administradores</TabsTrigger>
            <TabsTrigger value="professionals">Profissionais</TabsTrigger>
            <TabsTrigger value="parents">Responsáveis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>
                  {filteredUsers.length} usuários encontrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading || loadingPlans ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Carregando usuários...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Nenhum usuário encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name || '-'}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`
                                  ${user.role === 'admin' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}
                                  ${user.role === 'parent' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                  ${['teacher', 'therapist', 'specialist', 'psychologist', 'professional'].includes(user.role) ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                                `}
                              >
                                {getRoleName(user.role as UserRole)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.subscriptionPlan ? (
                                <Badge
                                  variant="outline"
                                  className="bg-purple-100 text-purple-800 border-purple-200"
                                >
                                  {user.subscriptionPlan.name}
                                </Badge>
                              ) : (
                                <span className="text-gray-500 text-sm">Sem plano</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50" 
                                  onClick={() => handleAssignPlan(user)}
                                  title="Atribuir Plano"
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8" 
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <CardTitle>Administradores</CardTitle>
                <CardDescription>
                  Usuários com privilégios administrativos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Similar table for admins only */}
                <div className="text-center py-8 text-gray-500">
                  Filtro implementado através da tab "Todos"
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="professionals">
            <Card>
              <CardHeader>
                <CardTitle>Profissionais</CardTitle>
                <CardDescription>
                  Professores, terapeutas e especialistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Similar table for professionals only */}
                <div className="text-center py-8 text-gray-500">
                  Filtro implementado através da tab "Todos"
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="parents">
            <Card>
              <CardHeader>
                <CardTitle>Responsáveis</CardTitle>
                <CardDescription>
                  Pais e responsáveis por crianças
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Similar table for parents only */}
                <div className="text-center py-8 text-gray-500">
                  Filtro implementado através da tab "Todos"
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <UserDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={currentUser}
        onSubmit={handleSubmitUser}
      />
      
      {/* Modal de Atribuição de Planos */}
      <Dialog open={assignPlanDialogOpen} onOpenChange={setAssignPlanDialogOpen}>
        <DialogContent variant="admin" className="bg-white border-gray-300">
          <DialogHeader>
            <DialogTitle variant="admin" className="text-gray-900 text-xl">
              Atribuir Plano
            </DialogTitle>
            <DialogDescription variant="admin" className="text-gray-700">
              Selecione um plano para atribuir ao usuário {userToAssignPlan?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan" className="text-gray-900 font-medium">Plano de Assinatura</Label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{plan.name}</span>
                        <span className="text-sm text-gray-500">
                          {plan.currency} {plan.price.toFixed(2)}/{plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedPlanId && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Atenção:</strong> Ao atribuir este plano, uma nova assinatura será criada para o usuário.
                  Se o usuário já possuir uma assinatura ativa, ela poderá ser substituída.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setAssignPlanDialogOpen(false)}
              className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button 
              type="button"
              onClick={handleSubmitPlanAssignment}
              disabled={!selectedPlanId}
              className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              Atribuir Plano
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsers;
