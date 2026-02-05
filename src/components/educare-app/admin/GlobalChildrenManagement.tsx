import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  Loader2,
  Baby,
  Calendar,
  TrendingUp,
  UserCheck,
  Users2,
  BarChart3,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2
} from 'lucide-react';
import { useGlobalChildrenManagement } from '@/hooks/useGlobalChildrenManagement';
import { GlobalChildrenFilters, GlobalChild } from '@/services/globalChildrenService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GlobalChildrenManagementProps {
  className?: string;
}

const GlobalChildrenManagement: React.FC<GlobalChildrenManagementProps> = ({ className }) => {
  const {
    children,
    stats,
    totalChildren,
    currentPage,
    totalPages,
    filters,
    isLoading,
    error,
    permissions,
    applyFilters,
    clearFilters,
    goToPage,
    getChildDetails,
    deleteChild,
    refreshData
  } = useGlobalChildrenManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<GlobalChildrenFilters>({});
  const [selectedChild, setSelectedChild] = useState<GlobalChild | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [childToDelete, setChildToDelete] = useState<GlobalChild | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewDetails = async (child: GlobalChild) => {
    setSelectedChild(child);
    setShowDetailDialog(true);
  };

  const handleDeleteClick = (child: GlobalChild) => {
    setChildToDelete(child);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!childToDelete) return;
    setIsDeleting(true);
    const success = await deleteChild(childToDelete.id);
    setIsDeleting(false);
    if (success) {
      setShowDeleteDialog(false);
      setChildToDelete(null);
    }
  };

  // Aplicar busca
  const handleSearch = () => {
    const searchFilters: GlobalChildrenFilters = {
      ...tempFilters,
      search: searchTerm.trim() || undefined
    };
    applyFilters(searchFilters);
  };

  // Aplicar filtros avançados
  const handleApplyFilters = () => {
    const combinedFilters: GlobalChildrenFilters = {
      ...tempFilters,
      search: searchTerm.trim() || undefined
    };
    applyFilters(combinedFilters);
    setShowFilters(false);
  };

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setTempFilters({});
    clearFilters();
    setShowFilters(false);
  };

  // Calcular idade em meses
  const calculateAgeInMonths = (birthdate: string): number => {
    const birth = new Date(birthdate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
  };

  // Formatar idade para exibição
  const formatAge = (birthdate: string): string => {
    const months = calculateAgeInMonths(birthdate);
    if (months < 12) {
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'ano' : 'anos'}`;
      } else {
        return `${years}a ${remainingMonths}m`;
      }
    }
  };

  // Obter cor do progresso
  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Filtros ativos
  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.trim() !== '';

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestão Global de Crianças
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gestão de Crianças | Educare+</title>
      </Helmet>

      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Gestão Global de Crianças
            </h1>
            <p className="text-gray-600">
              {permissions.isProfessional 
                ? 'Crianças dos grupos que você participa'
                : 'Visão completa de todas as crianças do sistema'
              }
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Atualizar
          </Button>
        </div>

        {/* Estatísticas (apenas para admin/owner) */}
        {permissions.canViewStats && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Baby className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Crianças</p>
                    <p className="text-xl font-bold">{stats.total_children}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Com Equipes</p>
                    <p className="text-xl font-bold">{stats.children_with_teams}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Progresso Médio</p>
                    <p className="text-xl font-bold">{stats.average_progress.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Alto Desempenho</p>
                    <p className="text-xl font-bold">{stats.quiz_completion_stats.high_performers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Busca e Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome da criança..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                  Buscar
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      Ativos
                    </Badge>
                  )}
                </Button>
                
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={handleClearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Painel de Filtros */}
            {showFilters && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Faixa Etária</label>
                    <Select
                      value={tempFilters.age_range ? `${tempFilters.age_range.min_months}-${tempFilters.age_range.max_months}` : ''}
                      onValueChange={(value) => {
                        if (value === '') {
                          setTempFilters(prev => ({ ...prev, age_range: undefined }));
                        } else {
                          const [min, max] = value.split('-').map(Number);
                          setTempFilters(prev => ({ 
                            ...prev, 
                            age_range: { min_months: min, max_months: max }
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a idade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as idades</SelectItem>
                        <SelectItem value="0-12">0-12 meses</SelectItem>
                        <SelectItem value="13-24">13-24 meses</SelectItem>
                        <SelectItem value="25-36">25-36 meses</SelectItem>
                        <SelectItem value="37-48">37-48 meses</SelectItem>
                        <SelectItem value="49-999">49+ meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Participação em Equipes</label>
                    <Select
                      value={tempFilters.has_teams === undefined ? '' : tempFilters.has_teams.toString()}
                      onValueChange={(value) => {
                        if (value === '') {
                          setTempFilters(prev => ({ ...prev, has_teams: undefined }));
                        } else {
                          setTempFilters(prev => ({ ...prev, has_teams: value === 'true' }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Participação em equipes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="true">Com equipes</SelectItem>
                        <SelectItem value="false">Sem equipes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Faixa de Progresso</label>
                    <Select
                      value={tempFilters.progress_range ? `${tempFilters.progress_range.min}-${tempFilters.progress_range.max}` : ''}
                      onValueChange={(value) => {
                        if (value === '') {
                          setTempFilters(prev => ({ ...prev, progress_range: undefined }));
                        } else {
                          const [min, max] = value.split('-').map(Number);
                          setTempFilters(prev => ({ 
                            ...prev, 
                            progress_range: { min, max }
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Progresso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os níveis</SelectItem>
                        <SelectItem value="0-25">0-25%</SelectItem>
                        <SelectItem value="26-50">26-50%</SelectItem>
                        <SelectItem value="51-75">51-75%</SelectItem>
                        <SelectItem value="76-100">76-100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowFilters(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleApplyFilters}>
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Crianças */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Crianças Encontradas
                {totalChildren > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {totalChildren}
                  </Badge>
                )}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Carregando crianças...</span>
              </div>
            ) : children.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Baby className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma criança encontrada</p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={handleClearFilters} className="mt-2">
                    Limpar filtros para ver todas
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {children.map((child, index) => (
                  <div key={child.id}>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" alt={`${child.first_name} ${child.last_name}`} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {(child.first_name || 'N')?.charAt(0)?.toUpperCase()}{(child.last_name || 'N')?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {child.first_name} {child.last_name}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {formatAge(child.birthdate)}
                          </Badge>
                        </div>
                        
                        {child.parent && (
                          <p className="text-sm text-gray-600 mb-2">
                            <UserCheck className="h-4 w-4 inline mr-1" />
                            Responsável: {child.parent.name}
                          </p>
                        )}
                        
                        {child.teams && child.teams.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {child.teams.map((team) => (
                              <Badge key={team.id} variant="secondary" className="text-xs">
                                <Users2 className="h-3 w-3 mr-1" />
                                {team.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {child.journey_progress !== undefined && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600">Progresso:</span>
                            <div className="flex-1 max-w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(child.journey_progress)}`}
                                style={{ width: `${child.journey_progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{child.journey_progress}%</span>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Cadastrado {child.created_at && !isNaN(new Date(child.created_at).getTime()) 
                              ? formatDistanceToNow(new Date(child.created_at), { addSuffix: true, locale: ptBR })
                              : 'data não disponível'
                            }</span>
                          </div>
                          {child.quiz_stats && (
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              <span>
                                {child.quiz_stats.total_completed}/{child.quiz_stats.total_available} quizzes
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => handleViewDetails(child)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Detalhes
                        </Button>
                        {permissions.canEdit && (
                          <Button size="sm" variant="ghost" className="text-xs">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        )}
                        {permissions.canDelete && (
                          <Button size="sm" variant="ghost" className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteClick(child)}>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {index < children.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages} ({totalChildren} crianças)
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm px-2">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Criança</DialogTitle>
            <DialogDescription>Informações completas do perfil</DialogDescription>
          </DialogHeader>
          {selectedChild && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    {(selectedChild.first_name || 'N')?.charAt(0)?.toUpperCase()}{(selectedChild.last_name || 'N')?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedChild.first_name} {selectedChild.last_name}</h3>
                  <Badge variant="outline">{formatAge(selectedChild.birthdate)}</Badge>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{new Date(selectedChild.birthdate).toLocaleDateString('pt-BR')}</p>
                </div>
                {selectedChild.parent && (
                  <div>
                    <p className="text-muted-foreground">Responsável</p>
                    <p className="font-medium">{selectedChild.parent.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedChild.parent.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Progresso</p>
                  <p className="font-medium">{selectedChild.journey_progress ?? 0}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cadastrado em</p>
                  <p className="font-medium">{selectedChild.created_at && !isNaN(new Date(selectedChild.created_at).getTime()) ? new Date(selectedChild.created_at).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </div>
              {selectedChild.teams && selectedChild.teams.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Equipes</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedChild.teams.map(team => (
                        <Badge key={team.id} variant="secondary">
                          <Users2 className="h-3 w-3 mr-1" />
                          {team.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o perfil de <strong>{childToDelete?.first_name} {childToDelete?.last_name}</strong>? Esta ação não pode ser desfeita e removerá todos os dados associados a esta criança.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Excluindo...</> : 'Confirmar Exclusão'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GlobalChildrenManagement;
