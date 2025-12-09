/**
 * Knowledge Base Management
 * Gestão de ingestão e documentos do RAG
 * Exclusivo para Owner
 */

import React, { useState, useEffect } from 'react';
import { Upload, Trash2, RefreshCw, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';

interface KBDocument {
  id: string;
  title: string;
  content: string;
  file_name: string;
  kb_type: 'baby' | 'mother' | 'professional';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const KnowledgeBaseManagement: React.FC = () => {
  const { hasRole } = useCustomAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [selectedKB, setSelectedKB] = useState<'baby' | 'mother' | 'professional'>('baby');
  const [fileInput, setFileInput] = useState<File | null>(null);

  // Verificar permissão
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
        const docs = data.data || data.documents || [];
        setDocuments(Array.isArray(docs) ? docs : []);
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
      // Validar extensão
      const validExtensions = ['.pdf', '.txt', '.csv', '.json', '.md'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validExtensions.includes(fileExt)) {
        toast({
          title: 'Arquivo inválido',
          description: 'Apenas PDF, TXT, CSV, JSON e MD são permitidos',
          variant: 'destructive',
        });
        return;
      }

      // Validar tamanho (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'Máximo de 10MB permitido',
          variant: 'destructive',
        });
        return;
      }

      setFileInput(file);
    }
  };

  const handleUpload = async () => {
    if (!fileInput) {
      toast({
        title: 'Erro',
        description: 'Selecione um arquivo',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileInput);
      formData.append('kb_type', selectedKB);

      const response = await fetch('/api/admin/knowledge/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Documento enviado com sucesso',
        });
        setFileInput(null);
        await loadDocuments();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer upload');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao fazer upload',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este documento?')) {
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
          title: 'Sucesso',
          description: 'Documento deletado',
        });
        await loadDocuments();
      } else {
        throw new Error('Erro ao deletar');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o documento',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string) => {
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
          title: 'Sucesso',
          description: 'Status atualizado',
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

  const getKBLabel = (type: string) => {
    const labels: Record<string, string> = {
      'baby': 'Bebê',
      'mother': 'Mãe',
      'professional': 'Profissional',
    };
    return labels[type] || type;
  };

  const filteredDocs = documents.filter(doc => doc.kb_type === selectedKB);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Knowledge Base</h1>
          <p className="text-gray-600 mt-2">Upload e gerenciamento de documentos para o RAG</p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Enviar Documento</h2>
          
          <div className="space-y-4">
            {/* KB Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base de Conhecimento
              </label>
              <select
                value={selectedKB}
                onChange={(e) => setSelectedKB(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="baby">📚 Bebê (0-24 meses)</option>
                <option value="mother">👩 Mãe (Saúde Materna)</option>
                <option value="professional">👨‍⚕️ Profissional (Especialistas)</option>
              </select>
            </div>

            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivo
              </label>
              <div className="flex gap-3">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.csv,.json,.md"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !fileInput}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Formatos: PDF, TXT, CSV, JSON, MD | Máximo: 10MB
              </p>
            </div>
          </div>
        </Card>

        {/* Documents List */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Documentos: {getKBLabel(selectedKB)}</h2>
            <Button
              onClick={loadDocuments}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Carregando documentos...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum documento nesta base</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Arquivo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{doc.title || 'Sem título'}</td>
                      <td className="py-3 px-4 text-gray-600">{doc.file_name}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {doc.is_active ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button
                          onClick={() => handleToggleActive(doc.id)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {doc.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          onClick={() => handleDelete(doc.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {(['baby', 'mother', 'professional'] as const).map((type) => (
            <Card key={type} className="p-4">
              <p className="text-sm text-gray-600">{getKBLabel(type)}</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.kb_type === type).length}
              </p>
              <p className="text-xs text-gray-500">documentos</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseManagement;
