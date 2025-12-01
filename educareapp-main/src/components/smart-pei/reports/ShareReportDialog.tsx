
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'assessment' | 'progress' | 'pei' | 'custom';
    status: 'draft' | 'complete' | 'shared';
    studentName: string;
    coverImage: string;
  } | null;
}

export const ShareReportDialog: React.FC<ShareReportDialogProps> = ({
  open,
  onOpenChange,
  report
}) => {
  const { toast } = useToast();

  const handleConfirmShare = () => {
    toast({
      title: "Relatório compartilhado",
      description: `O relatório foi compartilhado com sucesso`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar Relatório</DialogTitle>
          <DialogDescription>
            {report && (
              <>Compartilhe o relatório "{report.title}" com outros usuários.</>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email dos destinatários</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="exemplo@email.com, outro@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem (opcional)</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
              placeholder="Adicione uma mensagem personalizada..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Permissões</label>
            <div className="space-y-1">
              <div className="flex items-center">
                <input type="checkbox" id="allow-view" className="mr-2" defaultChecked />
                <label htmlFor="allow-view" className="text-sm">Visualizar</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="allow-download" className="mr-2" defaultChecked />
                <label htmlFor="allow-download" className="text-sm">Baixar</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="allow-print" className="mr-2" defaultChecked />
                <label htmlFor="allow-print" className="text-sm">Imprimir</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="allow-comment" className="mr-2" />
                <label htmlFor="allow-comment" className="text-sm">Comentar</label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportDialog;
