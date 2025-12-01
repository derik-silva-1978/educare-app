
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { FileUp, Download } from 'lucide-react';

interface CSVImportTabProps {
  onCSVUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
}

export const CSVImportTab: React.FC<CSVImportTabProps> = ({
  onCSVUpload,
  onDownloadTemplate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-md p-6 text-center">
        <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm mb-2">Arrastar e soltar arquivo CSV ou</p>
        <Input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={onCSVUpload}
          className="mx-auto max-w-xs"
        />
      </div>
      
      <Button 
        variant="outline" 
        onClick={onDownloadTemplate}
        className="w-full"
      >
        <Download className="h-4 w-4 mr-2" />
        Baixar Modelo CSV
      </Button>
      
      <Alert>
        <AlertTitle>Formato CSV</AlertTitle>
        <AlertDescription>
          O arquivo CSV deve conter os seguintes cabeçalhos: type, model, expiresAt, maxUsers, totalCount, features
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CSVImportTab;
