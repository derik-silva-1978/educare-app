import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaResource, ResourceType } from '@/types/mediaResource';
import { mediaResourceService } from '@/services/mediaResourceService';
import { Upload, Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const resourceSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  resource_type: z.enum(['text', 'audio', 'image', 'pdf', 'video', 'link'], {
    required_error: 'Selecione o tipo de recurso'
  }),
  content: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  age_range_min: z.coerce.number().min(0).max(216).optional(),
  age_range_max: z.coerce.number().min(0).max(216).optional(),
  is_active: z.boolean().default(true),
  is_public: z.boolean().default(false),
  tts_enabled: z.boolean().default(false),
  tts_endpoint: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'URL inválida'
  }),
  tts_voice: z.string().optional(),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

interface MediaResourceFormProps {
  resource?: MediaResource;
  onSubmit: (data: ResourceFormData, file?: File) => Promise<void>;
  onCancel: () => void;
}

export function MediaResourceForm({ resource, onSubmit, onCancel }: MediaResourceFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: resource ? {
      title: resource.title,
      description: resource.description || '',
      resource_type: resource.resource_type,
      content: resource.content || '',
      category: resource.category || '',
      tags: resource.tags?.join(', ') || '',
      age_range_min: resource.age_range_min,
      age_range_max: resource.age_range_max,
      is_active: resource.is_active,
      is_public: resource.is_public,
      tts_enabled: resource.tts_enabled,
      tts_endpoint: resource.tts_endpoint || '',
      tts_voice: resource.tts_voice || '',
    } : {
      title: '',
      description: '',
      resource_type: 'pdf' as ResourceType,
      content: '',
      category: '',
      tags: '',
      is_active: true,
      is_public: false,
      tts_enabled: false,
      tts_endpoint: '',
      tts_voice: '',
    },
  });

  const { toast } = useToast();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const resourceType = watch('resource_type');
  const ttsEnabled = watch('tts_enabled');

  const handleGenerateAIMeta = async () => {
    const title = watch('title');
    const type = watch('resource_type');
    if (!title || title.length < 3) {
      toast({ title: 'Preencha o título primeiro', description: 'O título precisa ter no mínimo 3 caracteres para gerar metadados.', variant: 'destructive' });
      return;
    }
    setIsGeneratingAI(true);
    try {
      const meta = await mediaResourceService.generateAIMeta(title, type);
      if (meta.description) setValue('description', meta.description);
      if (meta.category) setValue('category', meta.category);
      if (meta.tags) setValue('tags', meta.tags.join(', '));
      toast({ title: 'Metadados gerados!', description: 'Descrição, categoria e tags foram preenchidos pela IA.' });
    } catch (error: any) {
      toast({ title: 'Erro ao gerar metadados', description: error.message, variant: 'destructive' });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onFormSubmit = async (data: ResourceFormData) => {
    console.log('🎯 Form submit iniciado');
    console.log('📝 Dados do formulário:', data);
    console.log('📎 Arquivo:', file);
    console.log('❓ Erros de validação:', errors);
    
    setIsSubmitting(true);
    try {
      await onSubmit(data, file || undefined);
      console.log('✅ Submit concluído com sucesso');
    } catch (error) {
      console.error('❌ Erro no submit:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const needsFile = ['audio', 'image', 'pdf', 'video'].includes(resourceType);
  const needsContent = ['text', 'link'].includes(resourceType);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Digite o título do recurso"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="description">Descrição</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateAIMeta}
                disabled={isGeneratingAI}
                className="text-xs"
              >
                {isGeneratingAI ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
                Gerar com IA
              </Button>
            </div>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descreva o recurso"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="resource_type">Tipo de Recurso *</Label>
            <Select
              value={resourceType}
              onValueChange={(value) => setValue('resource_type', value as ResourceType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="audio">Áudio</SelectItem>
                <SelectItem value="image">Imagem</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
                <SelectItem value="link">Link/URL</SelectItem>
              </SelectContent>
            </Select>
            {errors.resource_type && (
              <p className="text-sm text-destructive mt-1">{errors.resource_type.message}</p>
            )}
          </div>

          {needsContent && (
            <div>
              <Label htmlFor="content">
                {resourceType === 'link' ? 'URL *' : 'Conteúdo'}
              </Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder={
                  resourceType === 'link'
                    ? 'https://exemplo.com'
                    : 'Digite o conteúdo textual'
                }
                rows={5}
              />
            </div>
          )}

          {needsFile && (
            <div>
              <Label htmlFor="file">
                Arquivo {!resource && '*'}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    resourceType === 'audio' ? 'audio/*' :
                    resourceType === 'image' ? 'image/*' :
                    resourceType === 'pdf' ? '.pdf' :
                    resourceType === 'video' ? 'video/*' : undefined
                  }
                />
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              {file && (
                <p className="text-sm text-muted-foreground mt-1">
                  Arquivo selecionado: {file.name}
                </p>
              )}
              {resource?.file_name && !file && (
                <p className="text-sm text-muted-foreground mt-1">
                  Arquivo atual: {resource.file_name}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              {...register('category')}
              placeholder="Ex: Educacional, Terapêutico, Recreativo"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="Ex: desenvolvimento, motor, cognitivo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age_range_min">Idade Mínima (meses)</Label>
              <Input
                id="age_range_min"
                type="number"
                {...register('age_range_min', { valueAsNumber: true })}
                placeholder="0"
                min="0"
                max="216"
              />
            </div>
            <div>
              <Label htmlFor="age_range_max">Idade Máxima (meses)</Label>
              <Input
                id="age_range_max"
                type="number"
                {...register('age_range_max', { valueAsNumber: true })}
                placeholder="216"
                min="0"
                max="216"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Text-to-Speech (TTS)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tts_enabled">Habilitar TTS</Label>
            <Switch
              id="tts_enabled"
              checked={ttsEnabled}
              onCheckedChange={(checked) => setValue('tts_enabled', checked)}
            />
          </div>

          {ttsEnabled && (
            <>
              <div>
                <Label htmlFor="tts_endpoint">Endpoint TTS *</Label>
                <Input
                  id="tts_endpoint"
                  {...register('tts_endpoint')}
                  placeholder="https://api.tts.com/generate"
                  type="url"
                />
                {errors.tts_endpoint && (
                  <p className="text-sm text-destructive mt-1">{errors.tts_endpoint.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tts_voice">Voz</Label>
                <Input
                  id="tts_voice"
                  {...register('tts_voice')}
                  placeholder="Ex: pt-BR-female"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Recurso Ativo</Label>
            <Switch
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_public">Recurso Público</Label>
            <Switch
              id="is_public"
              checked={watch('is_public')}
              onCheckedChange={(checked) => setValue('is_public', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {resource ? 'Atualizar' : 'Criar'} Recurso
        </Button>
      </div>
    </form>
  );
}
