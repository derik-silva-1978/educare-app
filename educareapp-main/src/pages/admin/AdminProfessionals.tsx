/**
 * Componente refatorado para gestão de profissionais
 * Versão simplificada e mais robusta
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

import { useProfessionalManagement, Professional, CreateProfessionalData } from '@/hooks/useProfessionalManagement';
import { formatDate } from '@/utils/dateUtils';
import EditProfessionalModal from '@/components/admin/EditProfessionalModal';
import CreateProfessionalModal from '@/components/admin/CreateProfessionalModal';
import TemporaryPasswordModal from '@/components/admin/TemporaryPasswordModal';

const AdminProfessionals: React.FC = () => {
  // Hook simplificado
  const {
    professionals,
    loading,
    error,
    total,
    temporaryPasswordData,
    refreshData,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    clearTemporaryPasswordData,
  } = useProfessionalManagement();

  // Estados locais para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Estados para edição
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Estados para criação
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtrar profissionais localmente
  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = searchTerm === '' || 
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prof.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Função para abrir modal de edição
  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setIsEditModalOpen(true);
  };

  // Função para fechar modal de edição
  const handleCloseEditModal = () => {
    setEditingProfessional(null);
    setIsEditModalOpen(false);
  };

  // Função para salvar edição
  const handleSaveEdit = async (updatedData: Partial<Professional>) => {
    if (!editingProfessional) return false;
    
    const success = await updateProfessional(editingProfessional.id, updatedData);
    if (success) {
      handleCloseEditModal();
    }
    return success;
  };

  // Função para confirmar exclusão
  const handleDelete = async () => {
    if (!deleteId) return;
    
    const success = await deleteProfessional(deleteId);
    if (success) {
      setDeleteId(null);
    }
  };

  // Função para atualizar dados
  const handleRefresh = async () => {
    await refreshData();
  };

  // Funções para modal de criação
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveCreate = async (professionalData: CreateProfessionalData): Promise<boolean> => {
    const result = await createProfessional(professionalData);
    if (result.success) {
      handleCloseCreateModal();
      // Não precisa fazer nada aqui, o modal de senha temporária será aberto automaticamente
      // se houver temporaryPasswordData no hook
    }
    return result.success;
  };

  return (
    <>
      <Helmet>
        <title>Gestão de Profissionais - EducareApp</title>
        <meta name="description" content="Gerencie profissionais da plataforma" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Profissionais</h1>
            <p className="text-muted-foreground">
              Gerencie professores, terapeutas e especialistas da plataforma
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button onClick={handleOpenCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Profissional
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
            <CardDescription>Buscar e filtrar profissionais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lista de Profissionais</CardTitle>
            <CardDescription>
              {loading ? 'Carregando...' : `${filteredProfessionals.length} profissional(is) encontrado(s) de ${total} total`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  Tentar novamente
                </Button>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando profissionais...</p>
              </div>
            )}

            {!loading && !error && filteredProfessionals.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Nenhum profissional encontrado com os filtros aplicados'
                    : 'Nenhum profissional cadastrado'
                  }
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}

            {!loading && !error && filteredProfessionals.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfessionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{professional.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {professional.profile?.profession || 'Não informado'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{professional.email}</div>
                            {professional.phone && (
                              <div className="text-sm text-muted-foreground">
                                {professional.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {professional.profile?.specialization || 'Não informado'}
                          </div>
                          {professional.profile?.city && (
                            <div className="text-sm text-muted-foreground">
                              {professional.profile.city}
                              {professional.profile.state && `, ${professional.profile.state}`}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={professional.status === 'active' ? 'default' : 'secondary'}
                          >
                            {professional.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(professional.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(professional)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteId(professional.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de confirmação de exclusão */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal de edição */}
        <EditProfessionalModal
          professional={editingProfessional}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />

        {/* Modal de criação */}
        <CreateProfessionalModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSave={handleSaveCreate}
        />

        {/* Modal de senha temporária */}
        <TemporaryPasswordModal
          isOpen={!!temporaryPasswordData}
          onClose={clearTemporaryPasswordData}
          professionalName={temporaryPasswordData?.professionalName || ''}
          professionalEmail={temporaryPasswordData?.professionalEmail || ''}
          temporaryPassword={temporaryPasswordData?.temporaryPassword || ''}
        />
      </div>
    </>
  );
};

export default AdminProfessionals;
