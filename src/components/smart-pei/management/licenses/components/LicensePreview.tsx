
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ParsedLicense {
  key: string;
  type: string;
  model: string;
  expiresAt: string;
  isValid: boolean;
  validationMessage?: string;
}

interface LicensePreviewProps {
  parsedLicenses: ParsedLicense[];
  isProcessing: boolean;
  onCreateLicenses: () => void;
  onReset: () => void;
}

export const LicensePreview: React.FC<LicensePreviewProps> = ({
  parsedLicenses,
  isProcessing,
  onCreateLicenses,
  onReset
}) => {
  const validLicensesCount = parsedLicenses.filter(l => l.isValid).length;
  const invalidLicensesCount = parsedLicenses.filter(l => !l.isValid).length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Revisão de Licenças</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Total: {parsedLicenses.length}
          </Badge>
          <Badge variant="success" className="bg-green-500 hover:bg-green-600">
            Válidas: {validLicensesCount}
          </Badge>
          {invalidLicensesCount > 0 && (
            <Badge variant="destructive">
              Inválidas: {invalidLicensesCount}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chave</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Expiração</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedLicenses.slice(0, 10).map((license, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs">
                  {license.key.substring(0, 16)}...
                </TableCell>
                <TableCell>{license.type}</TableCell>
                <TableCell>{license.model}</TableCell>
                <TableCell>
                  {new Date(license.expiresAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {license.isValid ? (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Válida
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                      {license.validationMessage}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {parsedLicenses.length > 10 && (
          <div className="p-2 text-center bg-slate-50 text-sm text-muted-foreground">
            Mostrando 10 de {parsedLicenses.length} licenças
          </div>
        )}
      </div>
      
      {invalidLicensesCount > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Licenças com Problemas</AlertTitle>
          <AlertDescription>
            Algumas licenças contêm erros e serão ignoradas. Você pode prosseguir com as válidas ou voltar e corrigir os problemas.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onReset}>
          Voltar
        </Button>
        <Button 
          onClick={onCreateLicenses}
          disabled={validLicensesCount === 0 || isProcessing}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              Criar {validLicensesCount} Licença(s)
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LicensePreview;
