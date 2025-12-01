import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MediaResourceForm } from '@/components/admin/media-resources/MediaResourceForm';
import { MediaResourceList } from '@/components/admin/media-resources/MediaResourceList';
import { mediaResourceService } from '@/services/mediaResourceService';
import { MediaResource, MediaResourceStats } from '@/types/mediaResource';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, FileText, Music, Image as ImageIcon, FileType, Video, Link as LinkIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function MediaResourcesManagement() {
  const { toast } = useToast();
  const [resources, setResources] = useState<MediaResource[]>([]);
  const [stats, setStats] = useState<MediaResourceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<MediaResource | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<MediaResource | null>(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadResources();
    loadStats();
  }, [filters]);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const response = await mediaResourceService.list(filters);
      setResources(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar recursos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await mediaResourceService.getStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleCreate = () => {
    setSelectedResource(null);
    setIsFormOpen(true);
  };

  const handleEdit = (resource: MediaResource) => {
    setSelectedResource(resource);
    setIsFormOpen(true);
  };

  const handleView = (resource: MediaResource) => {
    setSelectedResource(resource);
    setIsViewOpen(true);
  };

  const handleDelete = (resource: MediaResource) => {
    setResourceToDelete(resource);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;

    try {
      await mediaResourceService.delete(resourceToDelete.id);
      toast({
        title: 'Recurso deletado',
        description: 'O recurso foi removido com sucesso.',
      });
      loadResources();
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Erro ao deletar recurso',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setResourceToDelete(null);
    }
  };

  const handleFormSubmit = async (data: any, file?: File) => {
    try {
      const formData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
        file,
      };

      if (selectedResource) {
        await mediaResourceService.update(selectedResource.id, formData);
        toast({
          title: 'Recurso atualizado',
          description: 'As alterações foram salvas com sucesso.',
        });
      } else {
        await mediaResourceService.create(formData);
        toast({
          title: 'Recurso criado',
          description: 'O novo recurso foi adicionado com sucesso.',
        });
      }

      setIsFormOpen(false);
      loadResources();
      loadStats();
    } catch (error: any) {
      toast({
        title: selectedResource ? 'Erro ao atualizar' : 'Erro ao criar',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleGenerateTTS = async (resource: MediaResource) => {
    try {
      await mediaResourceService.generateTTS(resource.id);
      toast({
        title: 'TTS gerado',
        description: 'O áudio foi gerado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao gerar TTS',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'pdf': return <FileType className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'link': return <LinkIcon className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestão de Recursos Audiovisuais</h1>
        <p className="text-gray-600">
          Gerencie textos, áudios, imagens, PDFs, vídeos e links para uso na plataforma
        </p>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Recursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Recursos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Recursos Públicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.public}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.by_type.map((item) => (
                  <div key={item.resource_type} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.resource_type)}
                      <span className="capitalize">{item.resource_type}</span>
                    </div>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Recursos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recursos</CardTitle>
              <CardDescription>
                {pagination.total} recurso(s) encontrado(s)
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Recurso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <MediaResourceList
              resources={resources}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onGenerateTTS={handleGenerateTTS}
              onFilterChange={setFilters}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog de Formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedResource ? 'Editar Recurso' : 'Novo Recurso'}
            </DialogTitle>
          </DialogHeader>
          <MediaResourceForm
            resource={selectedResource || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Recurso</DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Título</h3>
                <p>{selectedResource.title}</p>
              </div>
              {selectedResource.description && (
                <div>
                  <h3 className="font-semibold mb-1">Descrição</h3>
                  <p className="text-gray-600">{selectedResource.description}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-1">Tipo</h3>
                <p className="capitalize">{selectedResource.resource_type}</p>
              </div>
              {selectedResource.content && (
                <div>
                  <h3 className="font-semibold mb-1">Conteúdo</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedResource.content}</p>
                </div>
              )}
              {selectedResource.file_url && (
                <div>
                  <h3 className="font-semibold mb-1">Arquivo</h3>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                      const fileUrl = selectedResource.file_url.startsWith('http') 
                        ? selectedResource.file_url 
                        : `${apiUrl}${selectedResource.file_url}`;
                      window.open(fileUrl, '_blank');
                    }}
                  >
                    📄 {selectedResource.file_name || 'Abrir arquivo'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!resourceToDelete} onOpenChange={() => setResourceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o recurso "{resourceToDelete?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
