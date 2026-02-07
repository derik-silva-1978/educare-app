import { useState } from 'react';
import { MediaResource, ResourceType } from '@/types/mediaResource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Music,
  Image as ImageIcon,
  FileType,
  Video,
  Link as LinkIcon,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Volume2,
  Download,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MediaResourceListProps {
  resources: MediaResource[];
  onEdit: (resource: MediaResource) => void;
  onDelete: (resource: MediaResource) => void;
  onView: (resource: MediaResource) => void;
  onGenerateTTS?: (resource: MediaResource) => void;
  onFilterChange: (filters: any) => void;
}

const getResourceIcon = (type: ResourceType) => {
  switch (type) {
    case 'text':
      return <FileText className="w-4 h-4" />;
    case 'audio':
      return <Music className="w-4 h-4" />;
    case 'image':
      return <ImageIcon className="w-4 h-4" />;
    case 'pdf':
      return <FileType className="w-4 h-4" />;
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'link':
      return <LinkIcon className="w-4 h-4" />;
  }
};

const getResourceTypeLabel = (type: ResourceType) => {
  const labels = {
    text: 'Texto',
    audio: 'Áudio',
    image: 'Imagem',
    pdf: 'PDF',
    video: 'Vídeo',
    link: 'Link',
  };
  return labels[type];
};

export function MediaResourceList({
  resources,
  onEdit,
  onDelete,
  onView,
  onGenerateTTS,
  onFilterChange,
}: MediaResourceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange({ search: value, type: typeFilter === 'all' ? undefined : typeFilter });
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    onFilterChange({ search: searchTerm, type: value === 'all' ? undefined : value });
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange({
      search: searchTerm,
      type: typeFilter === 'all' ? undefined : typeFilter,
      is_active: value === 'all' ? undefined : value === 'active',
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Buscar recursos..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />

        <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="text">Texto</SelectItem>
            <SelectItem value="audio">Áudio</SelectItem>
            <SelectItem value="image">Imagem</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="video">Vídeo</SelectItem>
            <SelectItem value="link">Link</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Visualizações</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  Nenhum recurso encontrado
                </TableCell>
              </TableRow>
            ) : (
              resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.resource_type)}
                      <span className="text-sm">
                        {getResourceTypeLabel(resource.resource_type)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      {resource.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {resource.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {resource.category ? (
                      <Badge variant="outline">{resource.category}</Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatFileSize(resource.file_size)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{resource.view_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={resource.is_active ? 'default' : 'secondary'}>
                        {resource.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {resource.is_public && (
                        <Badge variant="outline">Público</Badge>
                      )}
                      {resource.tts_enabled && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          TTS
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {format(new Date(resource.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(resource)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        {resource.file_url && (
                          <DropdownMenuItem onClick={() => {
                            const apiUrl = import.meta.env.VITE_API_URL || '';
                            const fileUrl = resource.file_url.startsWith('http') 
                              ? resource.file_url 
                              : `${apiUrl}${resource.file_url}`;
                            window.open(fileUrl, '_blank');
                          }}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir Arquivo
                          </DropdownMenuItem>
                        )}
                        {resource.content && resource.resource_type === 'link' && (
                          <DropdownMenuItem onClick={() => window.open(resource.content, '_blank')}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir Link
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onEdit(resource)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        {resource.tts_enabled && onGenerateTTS && (
                          <DropdownMenuItem onClick={() => onGenerateTTS(resource)}>
                            <Volume2 className="w-4 h-4 mr-2" />
                            Gerar TTS
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDelete(resource)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
