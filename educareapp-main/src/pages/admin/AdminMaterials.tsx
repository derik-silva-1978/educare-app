
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  FileText, 
  FileImage, 
  FileVideo, 
  Link as LinkIcon, 
  Download,
  Upload
} from 'lucide-react';

// Mock materials data
const materialCategories = [
  'Desenvolvimento Infantil', 
  'Saúde Materna', 
  'Atividades Educativas', 
  'Guias para Pais', 
  'Guias para Profissionais'
];

const materialsData = [
  {
    id: '1',
    title: 'Guia de Desenvolvimento 0-12 meses',
    description: 'Material completo sobre o desenvolvimento infantil no primeiro ano de vida',
    category: 'Desenvolvimento Infantil',
    type: 'pdf',
    size: '2.4MB',
    downloads: 156,
    createdAt: '2025-03-15T09:30:00',
    updatedAt: '2025-03-15T09:30:00',
  },
  {
    id: '2',
    title: 'Cartilha de Saúde Materna',
    description: 'Guia essencial para gestantes e mães recentes',
    category: 'Saúde Materna',
    type: 'pdf',
    size: '1.8MB',
    downloads: 102,
    createdAt: '2025-03-18T14:45:00',
    updatedAt: '2025-04-02T10:15:00',
  },
  {
    id: '3',
    title: 'Atividades para estimulação motora',
    description: '10 atividades para desenvolver habilidades motoras em crianças de 1-2 anos',
    category: 'Atividades Educativas',
    type: 'pdf',
    size: '3.2MB',
    downloads: 89,
    createdAt: '2025-03-20T11:20:00',
    updatedAt: '2025-03-20T11:20:00',
  },
  {
    id: '4',
    title: 'Vídeo: Sinais de alerta no desenvolvimento',
    description: 'Principais sinais que os pais devem ficar atentos durante o desenvolvimento infantil',
    category: 'Guias para Pais',
    type: 'video',
    size: '45.6MB',
    downloads: 78,
    createdAt: '2025-03-25T16:10:00',
    updatedAt: '2025-03-25T16:10:00',
  },
  {
    id: '5',
    title: 'Imagens ilustrativas de marcos de desenvolvimento',
    description: 'Conjunto de imagens para auxiliar na identificação de marcos de desenvolvimento',
    category: 'Desenvolvimento Infantil',
    type: 'images',
    size: '12.8MB',
    downloads: 65,
    createdAt: '2025-04-02T09:15:00',
    updatedAt: '2025-04-02T09:15:00',
  },
  {
    id: '6',
    title: 'Manual para profissionais: Avaliação neuropsicomotora',
    description: 'Guia detalhado para profissionais realizarem avaliação neuropsicomotora',
    category: 'Guias para Profissionais',
    type: 'pdf',
    size: '5.1MB',
    downloads: 42,
    createdAt: '2025-04-10T13:40:00',
    updatedAt: '2025-04-10T13:40:00',
  },
  {
    id: '7',
    title: 'Lista de verificação de desenvolvimento 2-3 anos',
    description: 'Checklist para acompanhamento do desenvolvimento entre 2 e 3 anos',
    category: 'Desenvolvimento Infantil',
    type: 'pdf',
    size: '1.2MB',
    downloads: 112,
    createdAt: '2025-04-12T10:25:00',
    updatedAt: '2025-04-12T10:25:00',
  },
  {
    id: '8',
    title: 'Link: Recursos externos sobre saúde infantil',
    description: 'Compilado de links relevantes sobre saúde infantil',
    category: 'Guias para Pais',
    type: 'link',
    size: '-',
    downloads: 34,
    createdAt: '2025-04-15T14:50:00',
    updatedAt: '2025-04-15T14:50:00',
  }
];

interface MaterialFormProps {
  material: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (material: any) => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, open, onOpenChange, onSubmit }) => {
  const [title, setTitle] = useState(material?.title || '');
  const [description, setDescription] = useState(material?.description || '');
  const [category, setCategory] = useState(material?.category || '');
  const [type, setType] = useState(material?.type || 'pdf');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  
  React.useEffect(() => {
    if (material) {
      setTitle(material.title || '');
      setDescription(material.description || '');
      setCategory(material.category || '');
      setType(material.type || 'pdf');
      setLink('');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setType('pdf');
      setLink('');
      setFile(null);
    }
  }, [material]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fileSize = file ? `${(file.size / (1024 * 1024)).toFixed(1)}MB` : material?.size || '-';
    
    onSubmit({
      id: material?.id || Date.now().toString(),
      title,
      description,
      category,
      type,
      size: type === 'link' ? '-' : fileSize,
      downloads: material?.downloads || 0,
      createdAt: material?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      link: type === 'link' ? link : undefined,
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{material ? 'Editar Material' : 'Novo Material'}</DialogTitle>
          <DialogDescription>
            {material 
              ? 'Edite os detalhes do material de apoio' 
              : 'Adicione um novo material de apoio'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do material"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição detalhada do material"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {materialCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Material</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">Documento PDF</SelectItem>
                  <SelectItem value="images">Imagens</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="link">Link Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {type === 'link' ? (
            <div className="space-y-2">
              <Label htmlFor="link">URL do Link</Label>
              <div className="flex gap-2">
                <LinkIcon className="h-5 w-5 text-gray-400 mt-2" />
                <Input 
                  id="link" 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://exemplo.com/recurso"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="file">Arquivo</Label>
              <div className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md py-6">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  {file ? file.name : 'Arraste e solte o arquivo aqui ou clique para buscar'}
                </p>
                {file && (
                  <p className="text-xs text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
                <Input 
                  id="file" 
                  type="file" 
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('file')?.click()}>
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {material ? 'Salvar Alterações' : 'Adicionar Material'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminMaterials: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<any | null>(null);
  
  // Filter materials based on search and filters
  const filteredMaterials = materialsData.filter(material => {
    const matchesSearch = 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    const matchesType = typeFilter === 'all' || material.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });
  
  const handleAddMaterial = () => {
    setCurrentMaterial(null);
    setDialogOpen(true);
  };
  
  const handleEditMaterial = (material: any) => {
    setCurrentMaterial(material);
    setDialogOpen(true);
  };
  
  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.')) {
      // In a real application, this would delete the material from the database
      toast({
        title: 'Material excluído',
        description: 'O material foi excluído com sucesso.',
      });
    }
  };
  
  const handleMaterialSubmit = (material: any) => {
    // In a real application, this would save the material to the database
    if (currentMaterial) {
      toast({
        title: 'Material atualizado',
        description: `As alterações no material "${material.title}" foram salvas.`,
      });
    } else {
      toast({
        title: 'Material adicionado',
        description: `O novo material "${material.title}" foi adicionado com sucesso.`,
      });
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'images':
        return <FileImage className="h-4 w-4" />;
      case 'video':
        return <FileVideo className="h-4 w-4" />;
      case 'link':
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'pdf':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
          <FileText className="h-3 w-3" /> PDF
        </Badge>;
      case 'images':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
          <FileImage className="h-3 w-3" /> Imagens
        </Badge>;
      case 'video':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
          <FileVideo className="h-3 w-3" /> Vídeo
        </Badge>;
      case 'link':
        return <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <LinkIcon className="h-3 w-3" /> Link
        </Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Materiais de Apoio | Admin Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Materiais de Apoio</h1>
          
          <Button onClick={handleAddMaterial}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Material
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos os Materiais</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="media">Mídia</TabsTrigger>
            <TabsTrigger value="links">Links Externos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Biblioteca de Materiais</CardTitle>
                <CardDescription>
                  Gerencie os materiais de apoio disponíveis para usuários
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar material..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as categorias</SelectItem>
                          {materialCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os tipos</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="images">Imagens</SelectItem>
                          <SelectItem value="video">Vídeo</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Título</TableHead>
                          <TableHead className="hidden md:table-cell">Categoria</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="hidden md:table-cell">Tamanho</TableHead>
                          <TableHead className="hidden md:table-cell">Downloads</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMaterials.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              Nenhum material encontrado com os critérios de busca atuais.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMaterials.map((material) => (
                            <TableRow key={material.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(material.type)}
                                  {material.title}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{material.category}</TableCell>
                              <TableCell>{getTypeBadge(material.type)}</TableCell>
                              <TableCell className="hidden md:table-cell">{material.size}</TableCell>
                              <TableCell className="hidden md:table-cell">{material.downloads}</TableCell>
                              <TableCell>{new Date(material.updatedAt).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Download"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Editar"
                                    onClick={() => handleEditMaterial(material)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Excluir"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteMaterial(material.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
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
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>PDF e outros documentos para download</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Esta visualização já está disponível na aba "Todos os Materiais" com o filtro por tipo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Mídia</CardTitle>
                <CardDescription>Imagens e vídeos disponíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Esta visualização já está disponível na aba "Todos os Materiais" com o filtro por tipo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle>Links Externos</CardTitle>
                <CardDescription>Links para recursos externos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Esta visualização já está disponível na aba "Todos os Materiais" com o filtro por tipo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <MaterialForm 
        material={currentMaterial}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleMaterialSubmit}
      />
    </>
  );
};

export default AdminMaterials;
