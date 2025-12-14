/**
 * Knowledge Base Management - Versão Modernizada
 * Interface amigável com indicadores de provedores RAG
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, RefreshCw, CheckCircle, AlertCircle, FileText, X, Loader2, Database, Search, Filter, Zap, Brain, Cloud } from 'lucide-react';
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
  metadata?: {
    rag_providers?: string[];
    gemini_file_id?: string;
    qdrant_document_id?: string;
  };
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

const ProviderBadge = ({ provider }: { provider: string }) => {
  const config = {
    gemini: { icon: Zap, label: 'Gemini OCR', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    qdrant: { icon: Brain, label: 'Qdrant Embeddings', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    openai: { icon: Cloud, label: 'OpenAI File Search', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  };

  const prov = config[provider as keyof typeof config];
  if (!prov) return null;

  const Icon = prov.icon;
  return (
    <Badge className={prov.color}>
      <Icon className="w-3 h-3 mr-1" />
      {prov.label}
    </Badge>
  );
};

type IngestionStep = 'uploading' | 'saving' | 'processing' | 'indexing' | 'completed' | 'failed';

interface IngestionState {
  documentId: string | null;
  status: IngestionStep;
  providers: string[];
  error: string | null;
  startedAt: number | null;
}

const INGESTION_STEPS: { key: IngestionStep; label: string; icon: React.ElementType }[] = [
  { key: 'uploading', label: 'Enviando arquivo...', icon: Upload },
  { key: 'saving', label: 'Salvando documento...', icon: FileText },
  { key: 'processing', label: 'Processando OCR...', icon: Zap },
  { key: 'indexing', label: 'Indexando no RAG...', icon: Brain },
  { key: 'completed', label: 'Concluído!', icon: CheckCircle },
];

const KnowledgeBaseManagement: React.FC = () => {
  const { hasRole } = useCustomAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [ingestionState, setIngestionState] = useState<IngestionState>({
    documentId: null,
    status: 'uploading',
    providers: [],
    error: null,
    startedAt: null,
  });
  const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  
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

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const pollIngestionStatus = useCallback(async (documentId: string) => {
    try {
      const response = await fetch(`/api/admin/knowledge/${documentId}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar status');
      }

      const result = await response.json();
      
      if (result.success) {
        const { ingestion_status, rag_providers, ingestion_error, ingestion_started_at } = result.data;
        
        if (ingestion_status === 'pending') {
          setIngestionState(prev => ({
            ...prev,
            status: 'saving',
          }));
        } else if (ingestion_status === 'processing') {
          setIngestionState(prev => {
            const startedAt = ingestion_started_at 
              ? new Date(ingestion_started_at).getTime() 
              : (prev.startedAt || Date.now());
            const elapsed = Date.now() - startedAt;
            
            return {
              ...prev,
              status: elapsed < 5000 ? 'processing' : 'indexing',
            };
          });
        } else if (ingestion_status === 'completed') {
          stopPolling();
          setIngestionState(prev => ({
            ...prev,
            status: 'completed',
            providers: rag_providers || [],
          }));
          
          const providerInfo = rag_providers?.length > 0 
            ? `Indexado em: ${rag_providers.join(', ')}`
            : 'Salvo localmente';
          
          toast({
            title: '✨ Documento processado com sucesso!',
            description: providerInfo,
          });
          
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
            setIngestionState({
              documentId: null,
              status: 'uploading',
              providers: [],
              error: null,
              startedAt: null,
            });
            loadDocuments();
          }, 1500);
          
        } else if (ingestion_status === 'failed') {
          stopPolling();
          setIngestionState(prev => ({
            ...prev,
            status: 'failed',
            error: ingestion_error || 'Falha ao processar documento',
          }));
          
          toast({
            title: 'Erro no processamento',
            description: ingestion_error || 'Falha ao indexar documento. Tente novamente.',
            variant: 'destructive',
          });
          
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
            loadDocuments();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status de ingestão:', error);
    }
  }, [stopPolling, toast]);

  const startPolling = useCallback((documentId: string) => {
    setIngestionState({
      documentId,
      status: 'saving',
      providers: [],
      error: null,
      startedAt: Date.now(),
    });
    
    pollIngestionStatus(documentId);
    
    pollingIntervalRef.current = setInterval(() => {
      pollIngestionStatus(documentId);
    }, 2000);
  }, [pollIngestionStatus]);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const validExtensions = ['.pdf', '.txt', '.csv', '.json', '.md', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExt)) {
      toast({
        title: 'Arquivo inválido',
        description: 'Formatos aceitos: PDF, TXT, CSV, JSON, MD, DOC, DOCX, PNG, JPG, JPEG, WEBP',
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
    setIngestionState({
      documentId: null,
      status: 'uploading',
      providers: [],
      error: null,
      startedAt: Date.now(),
    });

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
      console.log('[KB Upload] Iniciando upload para /api/admin/knowledge/upload');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch('/api/admin/knowledge/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formDataToSend,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('[KB Upload] Resposta recebida:', response.status);
      setUploadProgress(50);

      const result = await response.json();

      if (response.ok && result.success) {
        const documentId = result.data?.id;
        
        if (documentId) {
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
          
          startPolling(documentId);
        } else {
          setUploadProgress(100);
          toast({
            title: '✨ Documento enviado!',
            description: 'O documento foi salvo com sucesso.',
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
          
          setUploading(false);
          setUploadProgress(0);
          await loadDocuments();
        }
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
      setUploading(false);
      setUploadProgress(0);
      setIngestionState({
        documentId: null,
        status: 'uploading',
        providers: [],
        error: null,
        startedAt: null,
      });
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
    indexed: documents.filter(d => d.file_search_id || d.metadata?.rag_providers?.length).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <Database className="h-9 w-9 text-blue-600" />
              Base de Conhecimento
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Gerencie os documentos que alimentam TitiNauta com inteligência moderna
            </p>
          </div>
          <Button onClick={loadDocuments} disabled={loading} variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-gray-800">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards com Gradientes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Documentos</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Documentos Ativos</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{stats.active}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Indexados</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{stats.indexed}</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
          <CardHeader className="pb-4 border-b dark:border-gray-700">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Upload className="h-6 w-6 text-blue-600" />
              Enviar Novo Documento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <Label htmlFor="file-input" className="text-base font-semibold">Upload de Arquivo *</Label>
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`mt-3 p-8 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    <input
                      id="file-input"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.txt,.csv,.json,.md,.doc,.docx,.png,.jpg,.jpeg,.webp"
                      className="hidden"
                    />
                    <label htmlFor="file-input" className="cursor-pointer text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-semibold text-gray-700 dark:text-gray-300">Arraste seu arquivo aqui</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ou clique para selecionar</p>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, TXT, CSV, JSON, MD, DOC, DOCX, PNG, JPG - Máximo 50MB
                  </p>
                  {selectedFile && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between border border-blue-200 dark:border-blue-900">
                      <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        ✓ {selectedFile.name} ({formatFileSize(selectedFile.size)})
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
                  <Label htmlFor="title" className="font-semibold">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Guia de Desenvolvimento Motor 0-6 meses"
                    className="mt-2 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="font-semibold">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Breve descrição do conteúdo do documento..."
                    className="mt-2 border-gray-300 dark:border-gray-600"
                    rows={3}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <Label className="font-semibold">Base de Conhecimento *</Label>
                  <Select
                    value={formData.knowledge_category}
                    onValueChange={(value) => handleInputChange('knowledge_category', value)}
                  >
                    <SelectTrigger className="mt-2 border-gray-300 dark:border-gray-600">
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
                  <Label className="font-semibold">Tipo de Fonte *</Label>
                  <Select
                    value={formData.source_type}
                    onValueChange={(value) => handleInputChange('source_type', value)}
                  >
                    <SelectTrigger className="mt-2 border-gray-300 dark:border-gray-600">
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
                    <Label className="font-semibold">Faixa Etária</Label>
                    <Select
                      value={formData.age_range}
                      onValueChange={(value) => handleInputChange('age_range', value)}
                    >
                      <SelectTrigger className="mt-2 border-gray-300 dark:border-gray-600">
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
                    <Label className="font-semibold">Domínio</Label>
                    <Select
                      value={formData.domain}
                      onValueChange={(value) => handleInputChange('domain', value)}
                    >
                      <SelectTrigger className="mt-2 border-gray-300 dark:border-gray-600">
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
                  <Label htmlFor="tags" className="font-semibold">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="desenvolvimento, motor, bebê"
                    className="mt-2 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            {uploading && (
              <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      {ingestionState.status === 'failed' ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : ingestionState.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {ingestionState.status === 'failed' ? 'Falha no processamento' : 
                       ingestionState.status === 'completed' ? 'Processamento concluído!' :
                       'Processando documento...'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ingestionState.status === 'failed' 
                        ? ingestionState.error || 'Erro desconhecido'
                        : ingestionState.status === 'completed'
                        ? `Indexado em: ${ingestionState.providers.join(', ') || 'local'}`
                        : 'Aguarde enquanto processamos seu documento'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {INGESTION_STEPS.map((step, index) => {
                    const stepIndex = INGESTION_STEPS.findIndex(s => s.key === ingestionState.status);
                    const currentIndex = INGESTION_STEPS.findIndex(s => s.key === step.key);
                    const isCompleted = currentIndex < stepIndex;
                    const isActive = step.key === ingestionState.status;
                    const isFailed = ingestionState.status === 'failed' && step.key !== 'completed';
                    
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.key} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isFailed 
                            ? 'bg-red-100 dark:bg-red-900/30' 
                            : isCompleted 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : isActive 
                            ? 'bg-blue-100 dark:bg-blue-900/30' 
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          {isFailed ? (
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          ) : isActive ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                          ) : (
                            <Icon className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          isFailed 
                            ? 'text-red-600 dark:text-red-400 font-medium' 
                            : isCompleted 
                            ? 'text-green-600 dark:text-green-400' 
                            : isActive 
                            ? 'text-blue-600 dark:text-blue-400 font-medium' 
                            : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {ingestionState.status === 'completed' && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Documento indexado com sucesso!
                      </span>
                    </div>
                    {ingestionState.providers.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {ingestionState.providers.map(p => (
                          <ProviderBadge key={p} provider={p} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {ingestionState.status === 'failed' && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-400">
                        {ingestionState.error || 'Falha ao processar documento'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8"
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

        {/* Documents List - Card View */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
          <CardHeader className="pb-4 border-b dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl">Documentos Cadastrados</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar documentos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-[220px] border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Carregando documentos...</p>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-20 h-20 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  {documents.length === 0 
                    ? 'Nenhum documento cadastrado ainda' 
                    : 'Nenhum documento encontrado'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocs.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:bg-gray-700/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{doc.title}</h3>
                        {doc.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{doc.description}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0 ml-2">
                        {getSourceLabel(doc.source_type).substring(0, 8)}
                      </Badge>
                    </div>

                    {/* Providers */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {doc.metadata?.rag_providers?.map((provider) => (
                        <ProviderBadge key={provider} provider={provider} />
                      ))}
                      {!doc.metadata?.rag_providers?.length && doc.file_search_id && (
                        <ProviderBadge provider="openai" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 pb-3 border-b dark:border-gray-700">
                      <span>{doc.original_filename}</span>
                      <span>{formatFileSize(doc.file_size)}</span>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {doc.is_active ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                            ✓ Ativo
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Inativo
                          </Badge>
                        )}
                        {doc.file_search_id || doc.metadata?.rag_providers?.length ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleToggleActive(doc.id, doc.is_active)}
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8"
                        >
                          {doc.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 h-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeBaseManagement;
