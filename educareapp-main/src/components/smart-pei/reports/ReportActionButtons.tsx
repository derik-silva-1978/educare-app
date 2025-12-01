
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, FileCheck, Printer, Download, Share2 } from 'lucide-react';

interface ReportActionButtonsProps {
  onSaveDraft?: () => void;
  onComplete?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  small?: boolean;
}

export const ReportActionButtons: React.FC<ReportActionButtonsProps> = ({
  onSaveDraft,
  onComplete,
  onPrint,
  onDownload,
  onShare,
  small = false
}) => {
  const size = small ? "sm" : "default";
  
  return (
    <div className="flex flex-wrap gap-2">
      {onSaveDraft && (
        <Button 
          variant="outline" 
          size={size}
          onClick={onSaveDraft}
          className="flex items-center gap-1"
        >
          <Save className={`${small ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          <span>Salvar Rascunho</span>
        </Button>
      )}
      
      {onComplete && (
        <Button 
          size={size}
          onClick={onComplete}
          className="flex items-center gap-1"
        >
          <FileCheck className={`${small ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          <span>Finalizar</span>
        </Button>
      )}
      
      {onPrint && (
        <Button 
          variant="outline" 
          size={size}
          onClick={onPrint}
          className="flex items-center gap-1"
        >
          <Printer className={`${small ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          <span>Imprimir</span>
        </Button>
      )}
      
      {onDownload && (
        <Button 
          variant="outline" 
          size={size}
          onClick={onDownload}
          className="flex items-center gap-1"
        >
          <Download className={`${small ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          <span>Baixar PDF</span>
        </Button>
      )}
      
      {onShare && (
        <Button 
          variant="outline" 
          size={size}
          onClick={onShare}
          className="flex items-center gap-1"
        >
          <Share2 className={`${small ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          <span>Compartilhar</span>
        </Button>
      )}
    </div>
  );
};

export default ReportActionButtons;
