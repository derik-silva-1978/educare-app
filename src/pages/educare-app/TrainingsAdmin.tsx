import { useState } from "react";
import { useTrainings, useCreateTraining, useUpdateTraining, useDeleteTraining } from "@/hooks/useTrainings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Video, BookOpen, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface TrainingFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  audience: string;
  isFree: boolean;
  price: string;
}

const defaultFormData: TrainingFormData = {
  title: "",
  description: "",
  thumbnailUrl: "",
  audience: "all",
  isFree: true,
  price: "0",
};

export default function TrainingsAdmin() {
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<string | null>(null);
  const [formData, setFormData] = useState<TrainingFormData>(defaultFormData);

  const { data, isLoading, error } = useTrainings("all", page, 10);
  const createMutation = useCreateTraining();
  const updateMutation = useUpdateTraining();
  const deleteMutation = useDeleteTraining();

  const handleCreateTraining = async () => {
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        thumbnailUrl: formData.thumbnailUrl || undefined,
        audience: formData.audience,
        pricing: {
          price: parseFloat(formData.price) || 0,
          isFree: formData.isFree,
        },
      });
      toast.success("Treinamento criado com sucesso!");
      setIsCreateDialogOpen(false);
      setFormData(defaultFormData);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar treinamento");
    }
  };

  const handleUpdateTraining = async () => {
    if (!editingTraining) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingTraining,
        title: formData.title,
        description: formData.description,
        thumbnailUrl: formData.thumbnailUrl || undefined,
        audience: formData.audience,
        pricing: {
          price: parseFloat(formData.price) || 0,
          isFree: formData.isFree,
        },
      });
      toast.success("Treinamento atualizado com sucesso!");
      setEditingTraining(null);
      setFormData(defaultFormData);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar treinamento");
    }
  };

  const handleDeleteTraining = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este treinamento?")) return;
    
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Treinamento excluído com sucesso!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir treinamento");
    }
  };

  const openEditDialog = (training: { id: string; title: string; description: string; thumbnailUrl: string | null; audience: string; pricing: { price: number; isFree: boolean } | null }) => {
    setEditingTraining(training.id);
    setFormData({
      title: training.title,
      description: training.description,
      thumbnailUrl: training.thumbnailUrl || "",
      audience: training.audience,
      isFree: training.pricing?.isFree ?? true,
      price: training.pricing?.price?.toString() || "0",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">
          <p className="text-destructive">Erro ao carregar treinamentos: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Treinamentos</h1>
          <p className="text-muted-foreground">Crie e gerencie cursos e treinamentos da plataforma</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Treinamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Novo Treinamento</DialogTitle>
              <DialogDescription>
                Preencha as informações básicas do treinamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nome do treinamento"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o conteúdo do treinamento"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="thumbnailUrl">URL da Imagem</Label>
                <Input
                  id="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="audience">Público-Alvo</Label>
                <Select value={formData.audience} onValueChange={(v) => setFormData({ ...formData, audience: v })}>
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFree"
                  checked={formData.isFree}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
                />
                <Label htmlFor="isFree">Gratuito</Label>
              </div>
              {!formData.isFree && (
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTraining} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Criar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((training) => (
          <Card key={training.id} className="relative">
            {training.thumbnailUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={training.thumbnailUrl}
                  alt={training.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1">{training.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(training)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTraining(training.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {training.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {training.modulesCount} módulos
                </Badge>
                <Badge variant={training.pricing?.isFree ? "default" : "outline"}>
                  <DollarSign className="h-3 w-3 mr-1" />
                  {training.pricing?.isFree ? "Gratuito" : `R$ ${training.pricing?.price?.toFixed(2)}`}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data?.data.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum treinamento cadastrado</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Clique em "Novo Treinamento" para começar
            </p>
          </CardContent>
        </Card>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">
            Página {page} de {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.pagination.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      <Dialog open={!!editingTraining} onOpenChange={(open) => !open && setEditingTraining(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Treinamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-thumbnailUrl">URL da Imagem</Label>
              <Input
                id="edit-thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-audience">Público-Alvo</Label>
              <Select value={formData.audience} onValueChange={(v) => setFormData({ ...formData, audience: v })}>
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
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isFree"
                checked={formData.isFree}
                onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
              />
              <Label htmlFor="edit-isFree">Gratuito</Label>
            </div>
            {!formData.isFree && (
              <div>
                <Label htmlFor="edit-price">Preço (R$)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTraining(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateTraining} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
