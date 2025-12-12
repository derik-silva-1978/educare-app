import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Archive,
  FileText,
  BookOpen,
  GraduationCap,
  Newspaper
} from 'lucide-react';
import { httpClient } from '@/services/api/httpClient';

interface ContentItem {
  id: string;
  type: 'news' | 'training' | 'course';
  title: string;
  description: string;
  summary: string;
  image_url: string;
  category: string;
  duration: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  cta_url: string;
  cta_text: string;
  target_audience: 'all' | 'parents' | 'professionals';
  status: 'draft' | 'published' | 'archived';
  publish_date: string;
  sort_order: number;
  created_at: string;
  creator?: { id: string; name: string };
}

const typeLabels = {
  news: { label: 'Notícia', icon: Newspaper, color: 'bg-blue-100 text-blue-700' },
  training: { label: 'Treinamento', icon: BookOpen, color: 'bg-amber-100 text-amber-700' },
  course: { label: 'Curso', icon: GraduationCap, color: 'bg-purple-100 text-purple-700' },
};

const statusLabels = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700' },
  published: { label: 'Publicado', color: 'bg-green-100 text-green-700' },
  archived: { label: 'Arquivado', color: 'bg-red-100 text-red-700' },
};

const ContentManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    type: 'news' as 'news' | 'training' | 'course',
    title: '',
    description: '',
    summary: '',
    image_url: '',
    category: '',
    duration: '',
    level: 'iniciante' as 'iniciante' | 'intermediário' | 'avançado',
    cta_url: '',
    cta_text: 'Saiba mais',
    target_audience: 'all' as 'all' | 'parents' | 'professionals',
    status: 'draft' as 'draft' | 'published' | 'archived',
    sort_order: 0,
  });

  const { data: contentData, isLoading } = useQuery({
    queryKey: ['admin-content', filterType, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await httpClient.get(`/api/content?${params.toString()}`);
      return response.data;
    },
  });

  const invalidateAllContentQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-content'] });
    queryClient.invalidateQueries({ queryKey: ['welcome-news'] });
    queryClient.invalidateQueries({ queryKey: ['welcome-trainings'] });
    queryClient.invalidateQueries({ queryKey: ['welcome-courses'] });
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return httpClient.post('/api/content', data);
    },
    onSuccess: () => {
      invalidateAllContentQueries();
      toast.success('Conteúdo criado com sucesso!');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar conteúdo');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      return httpClient.put(`/api/content/${id}`, data);
    },
    onSuccess: () => {
      invalidateAllContentQueries();
      toast.success('Conteúdo atualizado com sucesso!');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar conteúdo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return httpClient.delete(`/api/content/${id}`);
    },
    onSuccess: () => {
      invalidateAllContentQueries();
      toast.success('Conteúdo excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir conteúdo');
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return httpClient.patch(`/api/content/${id}/status`, { status });
    },
    onSuccess: () => {
      invalidateAllContentQueries();
      toast.success('Status atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar status');
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      type: 'news',
      title: '',
      description: '',
      summary: '',
      image_url: '',
      category: '',
      duration: '',
      level: 'iniciante',
      cta_url: '',
      cta_text: 'Saiba mais',
      target_audience: 'all',
      status: 'draft',
      sort_order: 0,
    });
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description || '',
      summary: item.summary || '',
      image_url: item.image_url || '',
      category: item.category || '',
      duration: item.duration || '',
      level: item.level || 'iniciante',
      cta_url: item.cta_url || '',
      cta_text: item.cta_text || 'Saiba mais',
      target_audience: item.target_audience || 'all',
      status: item.status,
      sort_order: item.sort_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const content: ContentItem[] = contentData || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Conteúdo</h1>
          <p className="text-muted-foreground">
            Gerencie notícias, treinamentos e cursos do WelcomeHub
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleCloseDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Conteúdo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Conteúdo' : 'Novo Conteúdo'}
              </DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {editingItem ? 'editar' : 'criar'} o conteúdo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'news' | 'training' | 'course') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">Notícia</SelectItem>
                      <SelectItem value="training">Treinamento</SelectItem>
                      <SelectItem value="course">Curso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published' | 'archived') =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do conteúdo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Resumo</Label>
                <Input
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Resumo breve (exibido nos cards)"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição completa"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Desenvolvimento, Saúde..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duração</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ex: 1h 30min"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nível</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: 'iniciante' | 'intermediário' | 'avançado') =>
                      setFormData({ ...formData, level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediário">Intermediário</SelectItem>
                      <SelectItem value="avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Público-alvo</Label>
                  <Select
                    value={formData.target_audience}
                    onValueChange={(value: 'all' | 'parents' | 'professionals') =>
                      setFormData({ ...formData, target_audience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="parents">Pais</SelectItem>
                      <SelectItem value="professionals">Profissionais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL do CTA</Label>
                  <Input
                    value={formData.cta_url}
                    onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto do CTA</Label>
                  <Input
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="Saiba mais"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ordem de exibição</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="news">Notícias</SelectItem>
                <SelectItem value="training">Treinamentos</SelectItem>
                <SelectItem value="course">Cursos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum conteúdo encontrado</p>
              <p className="text-sm">Clique em "Novo Conteúdo" para começar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.map((item) => {
                  const TypeIcon = typeLabels[item.type]?.icon || FileText;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge className={typeLabels[item.type]?.color}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {typeLabels[item.type]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[300px] truncate">
                        {item.title}
                      </TableCell>
                      <TableCell>{item.category || '-'}</TableCell>
                      <TableCell>
                        <Badge className={statusLabels[item.status]?.color}>
                          {statusLabels[item.status]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.sort_order}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            {item.status === 'draft' && (
                              <DropdownMenuItem 
                                onClick={() => statusMutation.mutate({ id: item.id, status: 'published' })}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Publicar
                              </DropdownMenuItem>
                            )}
                            {item.status === 'published' && (
                              <DropdownMenuItem 
                                onClick={() => statusMutation.mutate({ id: item.id, status: 'draft' })}
                              >
                                <EyeOff className="h-4 w-4 mr-2" />
                                Despublicar
                              </DropdownMenuItem>
                            )}
                            {item.status !== 'archived' && (
                              <DropdownMenuItem 
                                onClick={() => statusMutation.mutate({ id: item.id, status: 'archived' })}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Arquivar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
                                  deleteMutation.mutate(item.id);
                                }
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;
