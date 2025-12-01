import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  RefreshCw,
  Clock,
  Target,
  Users,
  Activity as ActivityIcon
} from 'lucide-react';
import { useActivityManagement } from '../../hooks/useActivityManagement';
import { ActivityForm } from './ActivityForm';
import { Activity } from '../../services/activityService';

const CATEGORIES = [
  { value: '', label: 'Todas as categorias' },
  { value: 'motor', label: 'Motor' },
  { value: 'cognitive', label: 'Cognitivo' },
  { value: 'sensory', label: 'Sensorial' },
  { value: 'communication', label: 'Comunicação' },
  { value: 'social_emotional', label: 'Social/Emocional' },
  { value: 'nutrition', label: 'Nutrição' },
  { value: 'baby_health', label: 'Saúde do Bebê' },
  { value: 'maternal_health', label: 'Saúde Materna' },
  { value: 'maternal_self_care', label: 'Autocuidado Materno' }
];

const DIFFICULTY_LEVELS = [
  { value: '', label: 'Todos os níveis' },
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Médio' },
  { value: 'hard', label: 'Difícil' }
];

export const AdminActivities: React.FC = () => {
  const {
    activities,
    loading,
    error,
    stats,
    currentPage,
    totalPages,
    totalItems,
    filters,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivityStatus,
    setPage,
    setFilters,
    clearFilters,
    refreshData
  } = useActivityManagement();

  // Estados locais
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Aplicar filtros
  const applyFilters = () => {
    setFilters({
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      difficulty_level: selectedDifficulty || undefined
    });
  };

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    clearFilters();
  };

  // Formatação de idade
  const formatAgeRange = (minMonths: number, maxMonths: number) => {
    const formatAge = (months: number) => {
      if (months < 12) return `${months}m`;
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) return `${years}a`;
      return `${years}a${remainingMonths}m`;
    };
    
    return `${formatAge(minMonths)} - ${formatAge(maxMonths)}`;
  };

  // Formatação de categoria
  const formatCategory = (category: string) => {
    return category.replace('_', ' ').toUpperCase();
  };

  // Formatação de dificuldade
  const formatDifficulty = (difficulty: string) => {
    const map: Record<string, string> = {
      'easy': 'Fácil',
      'medium': 'Médio',
      'hard': 'Difícil'
    };
    return map[difficulty] || difficulty;
  };

  // Cor do badge de dificuldade
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  // Handlers
  const handleCreateActivity = async (data: Parameters<typeof createActivity>[0]) => {
    const success = await createActivity(data);
    if (success) {
      setShowCreateDialog(false);
    }
    return success;
  };

  const handleUpdateActivity = async (data: Parameters<typeof updateActivity>[1]) => {
    if (!editingActivity) return false;
    
    const success = await updateActivity(editingActivity.id, data);
    if (success) {
      setEditingActivity(null);
    }
    return success;
  };

  const handleDeleteActivity = async (id: string) => {
    await deleteActivity(id);
  };

  const handleToggleStatus = async (id: string) => {
    await toggleActivityStatus(id);
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ActivityIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Atividades</p>
                <p className="text-2xl font-bold">
                  {stats?.total_activities || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.active_activities || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Inativas</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats?.inactive_activities || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.categories?.length || 0}
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
              <ActivityIcon className="h-5 w-5" />
              Gerenciar Atividades
            </CardTitle>
            
            <div className="flex gap-2">
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Atividade
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Atividade</DialogTitle>
                  </DialogHeader>
                  <ActivityForm
                    onSubmit={handleCreateActivity}
                    onCancel={() => setShowCreateDialog(false)}
                    loading={loading}
                  />
                </DialogContent>
              </Dialog>
            </div>
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
                    placeholder="Pesquisar atividades..."
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
                {(filters.category || filters.difficulty_level) && (
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
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Dificuldade</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
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
                Mostrando {activities.length} de {totalItems} atividades
              </span>
              {(filters.search || filters.category || filters.difficulty_level) && (
                <Badge variant="outline">
                  Filtros aplicados
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Atividades */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando atividades...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Erro ao carregar atividades: {error}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {(filters.search || filters.category || filters.difficulty_level) 
                ? 'Nenhuma atividade encontrada com os filtros aplicados.'
                : 'Nenhuma atividade cadastrada ainda.'
              }
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {activity.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatCategory(activity.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {formatAgeRange(activity.min_age_months, activity.max_age_months)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(activity.difficulty_level)}>
                        {formatDifficulty(activity.difficulty_level)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{activity.duration_minutes}min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={activity.is_active ? "default" : "secondary"}
                        className={activity.is_active ? "bg-green-100 text-green-800" : ""}
                      >
                        {activity.is_active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(activity.id)}
                          title={activity.is_active ? 'Desativar' : 'Ativar'}
                        >
                          {activity.is_active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Dialog 
                          open={editingActivity?.id === activity.id} 
                          onOpenChange={(open) => !open && setEditingActivity(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingActivity(activity)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar Atividade</DialogTitle>
                            </DialogHeader>
                            <ActivityForm
                              activity={editingActivity || undefined}
                              onSubmit={handleUpdateActivity}
                              onCancel={() => setEditingActivity(null)}
                              loading={loading}
                            />
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a atividade "{activity.title}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
    </div>
  );
};
