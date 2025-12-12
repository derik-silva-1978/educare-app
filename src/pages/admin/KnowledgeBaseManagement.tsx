/**
 * Knowledge Base Management
 * Gestão de ingestão e documentos do RAG
 * Exclusivo para Owner
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, RefreshCw, CheckCircle, AlertCircle, FileText, X, Loader2, Database, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface KBDocument {
  id: string;
  title: string;
  description?: string;
  source_type: string;
  file_search_id?: string;
  file_path?: string;
  original_filename?: string;
  file_size?: number;
  mime_type?: string;
  tags?: string[];
  age_range?: string;
  domain?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UploadFormData {
  title: string;
  description: string;
  source_type: string;
  knowledge_category: string;
  age_range: string;
  domain: string;
  tags: string;
}

const SOURCE_TYPES = [
  { value: 'educare', label: 'Educare (Conteúdo Próprio)' },
  { value: 'oms', label: 'OMS (Organização Mundial da Saúde)' },
  { value: 'bncc', label: 'BNCC (Base Nacional Comum Curricular)' },
  { value: 'ministerio_saude', label: 'Ministério da Saúde' },
  { value: 'outro', label: 'Outro' },
];

const KNOWLEDGE_CATEGORIES = [
  { value: 'baby', label: 'Bebê (0-24 meses)', emoji: '👶' },
  { value: 'mother', label: 'Mãe (Saúde Materna)', emoji: '👩' },
  { value: 'professional', label: 'Profissional (Especialistas)', emoji: '👨‍⚕️' },
];

const AGE_RANGES = [
  { value: '0-3', label: '0-3 meses' },
  { value: '4-6', label: '4-6 meses' },
  { value: '7-12', label: '7-12 meses' },
  { value: '13-24', label: '13-24 meses' },
  { value: 'all', label: 'Todas as idades' },
];

const DOMAINS = [
  { value: 'motor', label: 'Desenvolvimento Motor' },
  { value: 'cognitivo', label: 'Desenvolvimento Cognitivo' },
  { value: 'social', label: 'Desenvolvimento Social' },
  { value: 'linguagem', label: 'Desenvolvimento da Linguagem' },
  { value: 'saude', label: 'Saúde Geral' },
  { value: 'nutricao', label: 'Nutrição' },
  { value: 'sono', label: 'Sono' },
  { value: 'vacinas', label: 'Vacinas' },
];

const KnowledgeBaseManagement: React.FC = () => {
  const { hasRole } = useCustomAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    source_type: 'educare',
    knowledge_category: 'baby',
    age_range: 'all',
    domain: 'saude',
    tags: '',
  });

  if (!hasRole('owner')) {
    return <Navigate to="/educare-app/dashboard" replace />;
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/knowledge', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const docs = data.data || [];
        setDocuments(Array.isArray(docs) ? docs : []);
      } else {
        throw new Error('Erro ao carregar documentos');
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os documentos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ['.pdf', '.txt', '.csv', '.json', '.md', '.doc', '.docx'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validExtensions.includes(fileExt)) {
        toast({
          title: 'Arquivo inválido',
          description: 'Formatos aceitos: PDF, TXT, CSV, JSON, MD, DOC, DOCX',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo permitido é 50MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      
      if (!formData.title) {
        const titleFromFile = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setFormData(prev => ({ ...prev, title: titleFromFile }));
      }
    }
  };

  const handleInputChange = (field: keyof UploadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!selectedFile) return 'Selecione um arquivo para enviar';
    if (!formData.title.trim()) return 'O título é obrigatório';
    if (!formData.source_type) return 'Selecione o tipo de fonte';
    if (!formData.knowledge_category) return 'Selecione a categoria da base de conhecimento';
    return null;
  };

  const handleUpload = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: 'Campos incompletos',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile!);
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('source_type', formData.source_type);
      formDataToSend.append('knowledge_category', formData.knowledge_category);
      formDataToSend.append('age_range', formData.age_range);
      formDataToSend.append('domain', formData.domain);
      formDataToSend.append('tags', formData.tags);

      setUploadProgress(30);

      const response = await fetch('/api/admin/knowledge/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formDataToSend,
      });

      setUploadProgress(70);

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadProgress(100);
        
        toast({
          title: 'Documento enviado com sucesso!',
          description: result.data?.indexed 
            ? `"${formData.title}" foi indexado no sistema de busca.`
            : `"${formData.title}" foi salvo. ${result.data?.warning || ''}`,
        });
        
        setSelectedFile(null);
        setFormData({
          title: '',
          description: '',
          source_type: 'educare',
          knowledge_category: 'baby',
          age_range: 'all',
          domain: 'saude',
          tags: '',
        });
        
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        await loadDocuments();
      } else {
        throw new Error(result.error || result.message || 'Erro ao fazer upload');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Erro desconhecido ao processar arquivo',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja deletar "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/knowledge/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Documento deletado',
          description: `"${title}" foi removido com sucesso.`,
        });
        await loadDocuments();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível deletar o documento',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/admin/knowledge/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: currentState ? 'Documento desativado' : 'Documento ativado',
          description: currentState 
            ? 'O documento não será mais usado em buscas.' 
            : 'O documento está ativo para buscas.',
        });
        await loadDocuments();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive',
      });
    }
  };

  const getSourceLabel = (type: string) => {
    return SOURCE_TYPES.find(s => s.value === type)?.label || type;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.domain === filterCategory || doc.source_type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: documents.length,
    active: documents.filter(d => d.is_active).length,
    indexed: documents.filter(d => d.file_search_id).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              Base de Conhecimento
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gerencie os documentos que alimentam o assistente TitiNauta
            </p>
          </div>
          <Button onClick={loadDocuments} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total de Documentos</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <FileText className="h-10 w-10 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Indexados (OpenAI)</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.indexed}</p>
                </div>
                <Search className="h-10 w-10 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Enviar Novo Documento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-input">Arquivo *</Label>
                  <div className="mt-1">
                    <Input
                      id="file-input"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.txt,.csv,.json,.md,.doc,.docx"
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, TXT, CSV, JSON, MD, DOC, DOCX - Máximo 50MB
                    </p>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center justify-between">
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          const fileInput = document.getElementById('file-input') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Guia de Desenvolvimento Motor 0-6 meses"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Breve descrição do conteúdo do documento..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label>Base de Conhecimento *</Label>
                  <Select
                    value={formData.knowledge_category}
                    onValueChange={(value) => handleInputChange('knowledge_category', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KNOWLEDGE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.emoji} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo de Fonte *</Label>
                  <Select
                    value={formData.source_type}
                    onValueChange={(value) => handleInputChange('source_type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Faixa Etária</Label>
                    <Select
                      value={formData.age_range}
                      onValueChange={(value) => handleInputChange('age_range', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AGE_RANGES.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Domínio</Label>
                    <Select
                      value={formData.domain}
                      onValueChange={(value) => handleInputChange('domain', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DOMAINS.map((domain) => (
                          <SelectItem key={domain.value} value={domain.value}>
                            {domain.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="desenvolvimento, motor, bebê"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Enviando documento...</span>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Documento
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Documentos Cadastrados</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-[200px]"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {SOURCE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600 dark:text-gray-400">Carregando documentos...</p>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {documents.length === 0 
                    ? 'Nenhum documento cadastrado ainda' 
                    : 'Nenhum documento encontrado com os filtros atuais'}
                </p>
                {documents.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                    Use o formulário acima para enviar seu primeiro documento
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b dark:border-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Título</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Fonte</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Arquivo</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Indexado</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{doc.title}</p>
                            {doc.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {getSourceLabel(doc.source_type)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          <div>
                            <p className="truncate max-w-[150px]">{doc.original_filename || 'N/A'}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(doc.file_size)}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {doc.is_active ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {doc.file_search_id ? (
                            <CheckCircle className="w-5 h-5 text-purple-500 mx-auto" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              onClick={() => handleToggleActive(doc.id, doc.is_active)}
                              variant="ghost"
                              size="sm"
                              className={doc.is_active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                            >
                              {doc.is_active ? 'Desativar' : 'Ativar'}
                            </Button>
                            <Button
                              onClick={() => handleDelete(doc.id, doc.title)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeBaseManagement;
