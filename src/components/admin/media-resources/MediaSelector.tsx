import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Music,
  Image as ImageIcon,
  FileType,
  Video,
  Link as LinkIcon,
  Search,
  Check,
  X,
  Loader2,
  Eye,
} from 'lucide-react';
import { mediaResourceService } from '@/services/mediaResourceService';
import { MediaResource, ResourceType } from '@/types/mediaResource';

const typeConfig: Record<ResourceType, { label: string; icon: React.ElementType; color: string }> = {
  text: { label: 'Texto', icon: FileText, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  audio: { label: 'Audio', icon: Music, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  image: { label: 'Imagem', icon: ImageIcon, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  pdf: { label: 'PDF', icon: FileType, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  video: { label: 'Video', icon: Video, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  link: { label: 'Link', icon: LinkIcon, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
};

interface MediaSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (resource: MediaResource) => void;
  selectedIds?: string[];
  filterType?: ResourceType;
  multiple?: boolean;
}

export function MediaSelector({
  open,
  onOpenChange,
  onSelect,
  selectedIds = [],
  filterType,
  multiple = false,
}: MediaSelectorProps) {
  const [resources, setResources] = useState<MediaResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(filterType || 'all');
  const [previewResource, setPreviewResource] = useState<MediaResource | null>(null);

  useEffect(() => {
    if (open) {
      loadResources();
    }
  }, [open, typeFilter]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const filters: Record<string, any> = { is_active: true, limit: 100 };
      if (typeFilter && typeFilter !== 'all') {
        filters.type = typeFilter;
      }
      const response = await mediaResourceService.list(filters);
      setResources(response.data);
    } catch (error) {
      console.error('Error loading media resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q) ||
      r.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleSelect = (resource: MediaResource) => {
    onSelect(resource);
    if (!multiple) {
      onOpenChange(false);
    }
  };

  const getPreviewContent = (resource: MediaResource) => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const fileUrl = resource.file_url
      ? resource.file_url.startsWith('http')
        ? resource.file_url
        : `${apiUrl}${resource.file_url}`
      : null;

    switch (resource.resource_type) {
      case 'image':
        return fileUrl ? (
          <img src={fileUrl} alt={resource.title} className="max-h-48 rounded-lg object-contain mx-auto" />
        ) : null;
      case 'video':
        return fileUrl ? (
          <video src={fileUrl} controls className="max-h-48 rounded-lg w-full" />
        ) : null;
      case 'audio':
        return fileUrl ? (
          <audio src={fileUrl} controls className="w-full" />
        ) : null;
      case 'text':
        return resource.content ? (
          <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{resource.content}</p>
        ) : null;
      case 'link':
        return resource.content ? (
          <a href={resource.content} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline break-all">
            {resource.content}
          </a>
        ) : null;
      case 'pdf':
        return fileUrl ? (
          <Button variant="outline" size="sm" onClick={() => window.open(fileUrl, '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            Abrir PDF
          </Button>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Recurso de Midia</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por titulo, descricao ou tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="image">Imagem</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1 min-h-0 max-h-[50vh]">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum recurso encontrado</p>
            </div>
          ) : (
            <div className="space-y-2 pr-4">
              {filteredResources.map((resource) => {
                const config = typeConfig[resource.resource_type];
                const Icon = config.icon;
                const isSelected = selectedIds.includes(resource.id);
                const isPreview = previewResource?.id === resource.id;

                return (
                  <div key={resource.id} className="space-y-0">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                          : 'border-border hover:border-primary/40 hover:bg-muted/50'
                      }`}
                      onClick={() => handleSelect(resource)}
                    >
                      <div className={`p-2 rounded-md ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{resource.title}</span>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.color}`}>
                            {config.label}
                          </Badge>
                        </div>
                        {resource.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{resource.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {resource.category && (
                            <span className="text-[10px] text-muted-foreground">{resource.category}</span>
                          )}
                          {resource.tags && resource.tags.length > 0 && (
                            <div className="flex gap-1">
                              {resource.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewResource(isPreview ? null : resource);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {isSelected ? (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                        )}
                      </div>
                    </div>
                    {isPreview && (
                      <div className="ml-12 p-3 border border-t-0 rounded-b-lg bg-muted/30">
                        {getPreviewContent(resource)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {filteredResources.length} recurso(s) disponiveis
          </p>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-1" />
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
