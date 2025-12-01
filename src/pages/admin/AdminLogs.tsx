
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Download, Filter, Search, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

// Mock activity log data
const activityLogs = [
  {
    id: '1',
    user: 'Maria Silva',
    action: 'login',
    description: 'Usuário fez login no sistema',
    target: 'auth',
    date: '2025-04-28T10:30:00',
    status: 'success'
  },
  {
    id: '2',
    user: 'Admin',
    action: 'create',
    description: 'Criou novo usuário: João Pereira',
    target: 'users',
    date: '2025-04-28T09:45:00',
    status: 'success'
  },
  {
    id: '3',
    user: 'Carlos Rodrigues',
    action: 'update',
    description: 'Atualizou quiz de 3-4 anos',
    target: 'quiz',
    date: '2025-04-28T09:15:00',
    status: 'success'
  },
  {
    id: '4',
    user: 'Admin',
    action: 'delete',
    description: 'Removeu usuário: Teste Inativo',
    target: 'users',
    date: '2025-04-27T14:22:00',
    status: 'success'
  },
  {
    id: '5',
    user: 'Sistema',
    action: 'error',
    description: 'Falha na sincronização de dados',
    target: 'system',
    date: '2025-04-27T13:54:00',
    status: 'error'
  },
  {
    id: '6',
    user: 'Ana Souza',
    action: 'upload',
    description: 'Enviou novo material de apoio',
    target: 'materials',
    date: '2025-04-27T11:30:00',
    status: 'success'
  },
  {
    id: '7',
    user: 'Pedro Santos',
    action: 'permission',
    description: 'Solicitação de permissão de administrador rejeitada',
    target: 'permissions',
    date: '2025-04-27T10:15:00',
    status: 'warning'
  },
  {
    id: '8',
    user: 'Admin',
    action: 'config',
    description: 'Alterou configurações do sistema',
    target: 'settings',
    date: '2025-04-26T16:40:00',
    status: 'success'
  }
];

const AdminLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Filter logs based on search query and filters
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesTarget = targetFilter === 'all' || log.target === targetFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesDate = !date || new Date(log.date).toDateString() === date.toDateString();
    
    return matchesSearch && matchesAction && matchesTarget && matchesStatus && matchesDate;
  });
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getActionName = (action: string) => {
    switch(action) {
      case 'login': return 'Login';
      case 'create': return 'Criação';
      case 'update': return 'Atualização';
      case 'delete': return 'Exclusão';
      case 'error': return 'Erro';
      case 'upload': return 'Upload';
      case 'permission': return 'Permissão';
      case 'config': return 'Configuração';
      default: return action;
    }
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setActionFilter('all');
    setTargetFilter('all');
    setStatusFilter('all');
    setDate(undefined);
  };
  
  const exportLogs = () => {
    // In a real application, this would generate and download a CSV/Excel file
    alert('Em uma aplicação real, esta função exportaria os logs para um arquivo CSV ou Excel.');
  };

  return (
    <>
      <Helmet>
        <title>Logs de Atividade | Admin Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Logs de Atividade</h1>
          
          <Button onClick={exportLogs} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Atividades</CardTitle>
            <CardDescription>
              Registro detalhado de todas as ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar nos logs..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="h-4 w-4 mr-2 opacity-50" />
                      <SelectValue placeholder="Ação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas ações</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="create">Criação</SelectItem>
                      <SelectItem value="update">Atualização</SelectItem>
                      <SelectItem value="delete">Exclusão</SelectItem>
                      <SelectItem value="error">Erro</SelectItem>
                      <SelectItem value="upload">Upload</SelectItem>
                      <SelectItem value="permission">Permissão</SelectItem>
                      <SelectItem value="config">Configuração</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={targetFilter} onValueChange={setTargetFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Alvo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos alvos</SelectItem>
                      <SelectItem value="auth">Autenticação</SelectItem>
                      <SelectItem value="users">Usuários</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                      <SelectItem value="materials">Materiais</SelectItem>
                      <SelectItem value="permissions">Permissões</SelectItem>
                      <SelectItem value="settings">Configurações</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos status</SelectItem>
                      <SelectItem value="success">Sucesso</SelectItem>
                      <SelectItem value="error">Erro</SelectItem>
                      <SelectItem value="warning">Alerta</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[130px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'dd/MM/yyyy') : 'Data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={resetFilters}
                    title="Limpar filtros"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Data e Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead className="hidden md:table-cell">Descrição</TableHead>
                      <TableHead className="hidden md:table-cell">Alvo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Nenhum log encontrado com os filtros selecionados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">
                            {new Date(log.date).toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getActionName(log.action)}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{log.description}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary">{log.target}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(log.status)}>
                              {log.status === 'success' && 'Sucesso'}
                              {log.status === 'error' && 'Erro'}
                              {log.status === 'warning' && 'Alerta'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminLogs;
