import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CloudFileSelectorProps {
  onFileSelect: (file: { name: string; url: string; size: number; source: 'google-drive' | 'onedrive' }) => void;
}

const CloudFileSelector: React.FC<CloudFileSelectorProps> = ({ onFileSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [googleDriveUrl, setGoogleDriveUrl] = useState('');
  const [oneDriveUrl, setOneDriveUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const extractGoogleDriveId = (url: string): string | null => {
    // Match pattern: /d/{fileId}/
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const extractOneDriveId = (url: string): string | null => {
    // OneDrive URLs typically have: /download?resid=
    const match = url.match(/resid=([a-zA-Z0-9%!]+)/);
    return match ? match[1] : null;
  };

  const handleGoogleDriveSelect = async () => {
    if (!googleDriveUrl.trim()) {
      setStatus({ type: 'error', message: 'Cole um link do Google Drive' });
      return;
    }

    const fileId = extractGoogleDriveId(googleDriveUrl);
    if (!fileId) {
      setStatus({ type: 'error', message: 'Link do Google Drive inválido. Use: https://drive.google.com/file/d/FILE_ID/view' });
      return;
    }

    setLoading(true);
    try {
      // Get file metadata via Google Drive API
      const response = await fetch(`/api/cloud/google-drive/file-info?fileId=${fileId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('educare_auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Não foi possível acessar o arquivo. Verifique se compartilhado corretamente.');
      }

      const data = await response.json();
      
      onFileSelect({
        name: data.name || 'Arquivo do Google Drive',
        url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        size: data.size || 0,
        source: 'google-drive',
      });

      setStatus({ type: 'success', message: `✓ ${data.name} selecionado!` });
      setTimeout(() => {
        setIsOpen(false);
        setGoogleDriveUrl('');
        setStatus({ type: 'idle' });
      }, 1000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Erro ao acessar arquivo',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOneDriveSelect = async () => {
    if (!oneDriveUrl.trim()) {
      setStatus({ type: 'error', message: 'Cole um link do OneDrive' });
      return;
    }

    setLoading(true);
    try {
      // Get file metadata via OneDrive API
      const response = await fetch(`/api/cloud/onedrive/file-info?url=${encodeURIComponent(oneDriveUrl)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('educare_auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Não foi possível acessar o arquivo. Verifique se compartilhado corretamente.');
      }

      const data = await response.json();

      onFileSelect({
        name: data.name || 'Arquivo do OneDrive',
        url: data.downloadUrl,
        size: data.size || 0,
        source: 'onedrive',
      });

      setStatus({ type: 'success', message: `✓ ${data.name} selecionado!` });
      setTimeout(() => {
        setIsOpen(false);
        setOneDriveUrl('');
        setStatus({ type: 'idle' });
      }, 1000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Erro ao acessar arquivo',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Cloud className="h-4 w-4 mr-2" />
          Da Nuvem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecione um arquivo da nuvem</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="google-drive" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
            <TabsTrigger value="onedrive">OneDrive</TabsTrigger>
          </TabsList>

          {/* Google Drive Tab */}
          <TabsContent value="google-drive" className="space-y-4">
            <div className="space-y-2">
              <Label>Link do arquivo (Google Drive)</Label>
              <Input
                placeholder="https://drive.google.com/file/d/FILE_ID/view"
                value={googleDriveUrl}
                onChange={(e) => {
                  setGoogleDriveUrl(e.target.value);
                  setStatus({ type: 'idle' });
                }}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Copie o link compartilhado do Google Drive. O arquivo deve estar acessível.
              </p>
            </div>

            {status.type !== 'idle' && (
              <div className={`flex items-center gap-2 p-3 rounded ${
                status.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {status.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <span className="text-sm">{status.message}</span>
              </div>
            )}

            <Button
              onClick={handleGoogleDriveSelect}
              disabled={loading || !googleDriveUrl.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Selecionar
                </>
              )}
            </Button>
          </TabsContent>

          {/* OneDrive Tab */}
          <TabsContent value="onedrive" className="space-y-4">
            <div className="space-y-2">
              <Label>Link do arquivo (OneDrive)</Label>
              <Input
                placeholder="https://..."
                value={oneDriveUrl}
                onChange={(e) => {
                  setOneDriveUrl(e.target.value);
                  setStatus({ type: 'idle' });
                }}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Copie o link compartilhado do OneDrive. O arquivo deve estar acessível.
              </p>
            </div>

            {status.type !== 'idle' && (
              <div className={`flex items-center gap-2 p-3 rounded ${
                status.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {status.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <span className="text-sm">{status.message}</span>
              </div>
            )}

            <Button
              onClick={handleOneDriveSelect}
              disabled={loading || !oneDriveUrl.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Selecionar
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CloudFileSelector;
